import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/menu/v1';
//const BASE_URL = "https://api.philofoody.com/api/menu/v1";

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true

});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
