import axios from "axios"

export const fetchSecureData = async (token: string) => {

  try {
    console.log(token);
    const response = await axios.get('http://localhost:8080/secure-data',
      { headers: { 'authorization': `Bearer ${token}` } }
    );

    return { success: true, message: response.data.message, data: response.data.data };
  } catch (error) {
    return { success: false, message: error, data: null };
  }
};