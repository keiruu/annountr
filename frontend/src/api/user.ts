import axios from 'axios';

export const loginUser = async (data : any) => {
  try {
    const response = await axios.post('http://localhost:4000/api/v1/authentication/login', {
      email: data.email,
      password: data.password
    });

    return response
  } catch (error) {
    console.error(error);
  }
};

export const registerUser = async (data : any) => {
  try {
    const response = await axios.post('http://localhost:4000/api/v1/authentication/register', {
      fullname: data.fullname,
      email: data.email,
      password: data.password
    });

    return response
  } catch (error) {
    console.error(error);
  }
};
