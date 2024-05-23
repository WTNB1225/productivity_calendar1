import axios from "axios";
async function checkLoginStatus() {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + '/auth/check',
      {
        headers: {
          'Accept': 'application/json',
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch(e: unknown) {
    return;
  }
}

export default checkLoginStatus;