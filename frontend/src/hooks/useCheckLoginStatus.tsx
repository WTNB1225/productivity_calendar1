import axios from "axios";
async function useCheckLoginStatus() {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + '/verify',
      {
        headers: {
          'Accept': 'application/json',
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch(e: unknown) {
    console.error(e);
  }
}

export default useCheckLoginStatus;