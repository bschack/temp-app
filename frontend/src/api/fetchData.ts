import axios from "axios"
import { getCookie } from 'typescript-cookie'

export const fetchSecureData = async () => {
  try {
    const response = await axios.get('http://localhost:8080/secure-data',
      { headers: { 'Authorization': `Bearer ${getCookie('token')}` } }
    );

    return { success: true, message: response.data.message, data: response.data.data };
  } catch (error) {
    return { success: false, message: error, data: null };
  }
};