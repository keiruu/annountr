require('dotenv').config()

const bcrypt = require('bcrypt')
const responseHandler = require('../handlers/responseHandler');
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client')

const { addRefreshTokenToWhitelist, generateTokens, verifyRefreshToken, findUserById, findUserByEmail, findRefreshTokenById, hashToken, deleteRefreshToken } = require('../utils/jwt')
const { sendRefreshToken } = require('../utils/sendRefreshToken')

const prisma = new PrismaClient();
const utils = require('../utils/jwt')

const RegisterUser = async (req: any, res: any, next: any) => {

  let payload = req.body
  const { refreshTokenInCookie } = req.query

  const existingUser = await findUserByEmail(payload.email)

  if (existingUser) {
    responseHandler(res, 400, 'Error', 'Email already in use');
    return
  }

  // Hash password
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const password = await bcrypt.hash(payload.password, salt)

  async function registerUser(fullname : string, email : string, password : string) {
    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        password,
      },
    });
    
    return newUser;
  }

  // Create User
  try {
    const newUser = await registerUser(payload.fullname, payload.email, password)
    const user = {
      fullname: newUser.fullname,
      email: newUser.email,
      id: newUser.id
    };
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    if (refreshTokenInCookie === 'true') {
      sendRefreshToken(res, refreshToken)
      const response = {
        accessToken,
      }
      responseHandler(res, 200, 'Successful', 'Log in successful.', response);
    } else {
      const response = {
        accessToken,
        refreshToken,
      }
      responseHandler(res, 200, 'Successful', 'Log in successful.', response);
    }

  } catch (error) {
    console.error('Error registering user:', error);
    responseHandler(res, 500, 'Error', 'Error registering user.', null);
  }

}

const LoginUser = async (req: any, res: any, next: any) => {

  let payload = req.body
  const { refreshTokenInCookie } = req.query

  const existingUser = await findUserByEmail(payload.email)

  if (!existingUser) {
    responseHandler(res, 401, 'Error', 'Invalid login credentials');
    return
  }

  async function loginUser(email : string, password : string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  
    if (!user) {
      responseHandler(res, 404, 'Error', 'User not found');
    }

    bcrypt.compare(password, user.password, (err : any, data : any) => {
      //if error than throw error
      if (!data || err) {
        responseHandler(res, 401, 'Error', 'Invalid login credentials');
      }
    })
  
    return user;
  }

  // Login User
  try {
    const newUser = await loginUser(payload.email, payload.password);
    const user = {
      id: newUser.id,
      fullname: newUser.fullname,
      email: newUser.email,
    };
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    // await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    if (refreshTokenInCookie === 'true') {
      sendRefreshToken(res, refreshToken)
      const response = {
        accessToken,
        user
      }
      responseHandler(res, 200, 'Successful', 'Log in successful.', response);
    } else {
      const response = {
        accessToken,
        refreshToken,
        user
      }
      responseHandler(res, 200, 'Successful', 'Log in successful.', response);
    }

    return
  } catch (error) {
    console.error('Error logging user:', error);
    responseHandler(res, 500, 'Error', 'Error logging user.', null);
    return
  }
}

const LogoutUser = async (req: any, res: any, next: any) => {
}

module.exports = {
  RegisterUser,
  LoginUser,
  LogoutUser
}

export {}