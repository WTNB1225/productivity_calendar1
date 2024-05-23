import axios from "axios";
import { useEffect} from "react";

export default function useFetchLinesOfCode(userId: number) {
  useEffect(() => {
    let ignore = false;
    if(!ignore) {
      fetchCalendarData();
    }
    return () => {ignore = true;}
  })

  const fetchCalendarData = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/calendar',
        {
          userId: userId
        },
        {
          headers: {
            'Accept': 'application/json',
          },
          withCredentials: true
        }
      )
      console.log(response.status);
    } catch(e:unknown){
      console.error(e);
    }
  }

  return;
}