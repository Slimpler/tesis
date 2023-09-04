import axios from "./axios";

export const registerRequest = async (user) =>
  axios.post(`/auth/register`, user);

export const loginRequest = async (user) => 
  axios.post(`/auth/login`, user);

  export const verifyTokenRequest = async () => {
    try {
      const response = await axios.get(`/auth/verify`, {
        params: {
          timestamp: new Date().getTime(), 
        },
        withCredentials: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

export const logoutRequest = async () =>
  axios.post(`/auth/logout`, {
    withCredentials: true,
  });
