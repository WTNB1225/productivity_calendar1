import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';

function Auth() {
    const [shouldRedirect, setShouldRedirect] = useState(false); //リダイレクトするかどうかのフラグ
    const [redirectPath, setRedirectPath] = useState(''); //リダイレクト先のパス
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const url = import.meta.env.VITE_API_URL + '/code';
    useEffect(() => {
        let ignore = false;
        async function post() {
            try{
                const response = await axios.post(
                    url,
                    {
                        code: code
                    },
                    {
                        headers: {
                            'Accept': 'application/json',
                        },
                        withCredentials: true
                    }
                );
                console.log(response.status);
                setShouldRedirect(true);
                setRedirectPath('/calendar');
            } catch (error: unknown) {
                console.log(error);
                setShouldRedirect(true);
                setRedirectPath('/');
            }
        }

        if(!ignore) {
            post();
        }
        return(() => {ignore = true;});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    if (shouldRedirect) {
        return <Navigate to={redirectPath} />;
    }
    return(
        <>
        </>
    )
}

export default Auth;