require('dotenv').config()

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const { hashToken } = require('./hash');

const generateAccessToken = (user : any) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m'})
}

function generateRefreshToken(user : any, jti : any) {
  return jwt.sign({
    user,
    jti
  }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
}

const configureRefreshToken = async (req: any, res: any, next: any) => {
  let refreshTokens: string | any[] = []

  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if(refreshTokens.includes(refreshToken)) return res.sendStatus(403)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err : any, user : any) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.fullname })
    res.json({ accessToken })
  })
}

function generateTokens(user : any, jti : any) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}

function findUserByEmail(email : string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

function findUserById(id : string) {
  return prisma.user.findUnique({
    where: {
      id : parseInt(id),
    },
  });
}

interface RefreshTokenData {
  jti: string;
  refreshToken: string;
  userId: number;
}

function addRefreshTokenToWhitelist({ jti, refreshToken, userId }: RefreshTokenData): Promise<any> {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
}

function findRefreshTokenById(id: string): Promise<any> {
  return prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

function deleteRefreshToken(id: string): Promise<any> {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

function revokeTokens(userId: number): Promise<any> {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}

module.exports = {
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeTokens,
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  findUserByEmail,
  findUserById
};