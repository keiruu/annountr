require('dotenv').config()

const bcrypt = require('bcrypt')
const responseHandler = require('../handlers/responseHandler');
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RegisterUser = async (req: { body: any; }, res: any, next: any) => {

  let payload = req.body

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
      user: newUser.fullname,
      email: newUser.email,
    };

    responseHandler(res, 'Successful', 'Log in successful.', user);
  } catch (error) {
    console.error('Error registering user:', error);
    responseHandler(res, 'Error', 'Error registering user.', null);
  }

}

const LoginUser = async (req: any, res: any, next: any) => {

  let payload = req.body
  const user = { email: payload.email}

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json({ accessToken: accessToken })

  async function loginUser(email : string, password : string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  
    if (!user) {
      throw new Error('User not found');
    }

    bcrypt.compare(password, user.password, (err : any, data : any) => {
      //if error than throw error
      if (err) throw err
      //if both match than you can do anything
      if (data) {
        console.log('Success')
      } else {
        throw new Error('Passwords dont match')
      }
    })
  
    return user;
  }
  // Login User
  try {
    const newUser = await loginUser(payload.email, payload.password);
    const user = {
      user: newUser.fullname,
      email: newUser.email,
    };

    responseHandler(res, 'Successful', 'Log in successful.', user);
  } catch (error) {
    console.error('Error logging user:', error);
    responseHandler(res, 'Error', 'Error logging user.', null);
  }
}

module.exports = {
  RegisterUser,
  LoginUser
}

export {}