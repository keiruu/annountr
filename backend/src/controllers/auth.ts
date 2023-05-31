const bcrypt = require('bcrypt')
const responseHandler = require('../handlers/responseHandler');
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
  registerUser(payload.fullname, payload.email, password)
    .then((newUser) => {
      console.log('Created user:', newUser);
    })
    .catch((error) => {
      console.error('Error creating user:', error);
    });

  responseHandler(res, 'Successful', 'Registration Successfull.', null)
}

const LoginUser = async (req: { body: any; }, res: any, next: any) => {

  let payload = req.body

  // Hash password
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const password = await bcrypt.hash(payload.password, salt)

  async function loginUser(email : string, password : string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  
    if (!user) {
      throw new Error('User not found');
    }

    bcrypt.compare(payload.password, user.password)
      .then((match : any) => {
        if (match) {
          console.log('Password is correct');
        } else {
          throw new Error('Password is incorrect');
        }
      })
      .catch((error: any) => {
        throw new Error('Invalid password');
      });
  
    return user;
  }
  
  // Create User
  loginUser(payload.email, password)
    .then((newUser) => {
      console.log('Logged in user:', newUser);
    })
    .catch((error) => {
      console.error('Error logging user:', error);
    });
    
  responseHandler(res, 'Successful', 'Log in Successfull.', null)
}

module.exports = {
  RegisterUser,
  LoginUser
}

export {}