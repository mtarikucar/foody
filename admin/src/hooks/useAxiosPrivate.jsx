import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const auth = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(  )
    );

      const responseIntercept = axiosPrivate.interceptors.response.use(
          response => response,
          async error => {
              if (!error.response) {
                  console.error("Network or CORS error:", error);
                  return Promise.reject(error);
              }

              const prevRequest = error.config;
              if (error.response.status === 401 && !prevRequest.sent) {
                  prevRequest.sent = true;
                  try {
                      const newAccessToken = await refresh();
                      console.log(newAccessToken)
                      prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                      return axiosPrivate(prevRequest);
                  } catch (refreshError) {
                      console.error("Unable to refresh token", refreshError);
                      return Promise.reject(refreshError);
                  }
              }
              return Promise.reject(error);
          }
      );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
