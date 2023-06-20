const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid')

const { findRefreshTokenById, deleteRefreshToken, addRefreshTokenToWhitelist, generateTokens, findUserById } = require('./utils/jwt')
const { PrismaClient } = require('@prisma/client')
const { hashToken } = require('./utils/hash')

const prisma = new PrismaClient()
const app = express()

const apiPrefix = '/api/v1'

app.use(express.json());
app.listen(4000, () => console.log("Server is running on port 4000"));

app.use(cors({ origin: true }))
app.use(cookieParser())
app.use(apiPrefix + '/authentication', routes.auth)
app.use(apiPrefix + '/announcement', routes.announcements)
app.use(apiPrefix + '/refresh', async (req : any, res : any, next : any) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Missing refresh token.');
    }
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const user = await findUserById(payload.user.id);
    if (!user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    next(err);
  }
})

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

export {}