require('dotenv').config()

const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const { hashToken } = require('../utils/hash')
const { verifyAccessToken } = require('../utils/jwt')
const responseHandler = require('../handlers/responseHandler')
const prisma = new PrismaClient();

function isAuthenticated(req : any, res : any, next : any) {
  const { authorization } = req.headers;

  if (!authorization) {
    responseHandler(res, 401, 'Error', 'Unauthorized')
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.payload = payload;
  } catch (err : any) {
    if (err.name === 'TokenExpiredError') {
      responseHandler(res, 401, 'Error', err.name)
    } else {
      responseHandler(res, 401, 'Error', 'Unauthorized')
    }
  }

  return next();
}

function validateRequest(validators: any) {
  return async (req: any, res: Response, next: any) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params)
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body)
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

function deserializeUser(req : any, res : any, next : any) {
  try {
    const accessToken = (req.headers.authorization || '').replace(
      /^Bearer\s/,
      ''
    )
    if (!accessToken) {
      return next()
    }
    const payload = verifyAccessToken(accessToken) 
    req.user = payload

    next()
  } catch (error) {
    next()
  }
}

function requireUser(req : any, res : any, next : any) {
  try {
    const user = req.user

    if (!user) {
      res.status(401)
      throw new Error('Unauthorized.')
    }

    next()
  } catch (error) {
    next(error)
  }
}


// CODE TO FOR PASSWORD RESET
// try {
//   const { userId } = req.body;
//   await revokeTokens(userId);
//   res.json({ message: `Tokens revoked for user with id #${userId}` });
// } catch (err) {
//   next(err);
// }

export {
  isAuthenticated,
  requireUser,
  deserializeUser,
  validateRequest
};
