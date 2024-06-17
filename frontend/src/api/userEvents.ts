import axios from "axios"

export const userLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post(`https://tempappbackend-sc20eg0e.b4a.run/login`, { username, password }, { withCredentials: true });

    if (response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.error };
    }

  } catch (error) {
    return { success: false, message: error };
  }
}