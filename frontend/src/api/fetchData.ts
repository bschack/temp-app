import axios from "axios"

export const fetchSecureData = async (token: string) => {

  try {
    console.log(token);
    const response = await axios.get('https://tempappbackend-sc20eg0e.b4a.run/secure-data',
      { headers: { 'authorization': `Bearer ${token}` } }
    );

    return { success: true, message: response.data.message, data: response.data.data };
  } catch (error) {
    return { success: false, message: error, data: null };
  }
};