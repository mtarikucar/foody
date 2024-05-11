import axios from '../api/axios';
import useAuth from './useAuth';
import {useDispatch} from "react-redux";
import {loginSuccess} from "../store/AuthSlice";

const useRefreshToken = () => {
    const auth = useAuth();
    const dispatch = useDispatch();

    const refresh = async () => {
        const response = await axios.post('auth/refresh-token', {}, {
            headers: {
                Authorization: `Bearer ${auth.refreshToken}`
            }
        });
        console.log(response.data)
        dispatch(loginSuccess({
            user: auth.currentUser,
            role: auth.currentUserRole,
            logo: auth.companyLogo,
            company: auth.companyId,
            access_token: response.data.access_token || auth.accessToken,
            refresh_token: response.data.refresh_token || auth.refreshToken
        }));

        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
