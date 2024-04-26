import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const useFetch = (url) => {
  const [isPending, setIsPending] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { admin } = useAuthContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(url, {
      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + admin.token,
      },
      signal
    })
      .then((res) => {
        if (!res.ok) {
          throw Error('Could not fetch the data from that API resource');
        }
        return res.json();
      })
      .then((data) => {
        setData(data.Message);
        setIsPending(false);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Request was aborted');
        } else {
          setIsPending(false);
          setErrorMessage(error.message);
          console.log(error);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [url, admin.token]);

  return { isPending, data, errorMessage };
};

export default useFetch;
