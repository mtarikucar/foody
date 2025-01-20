import axios from 'axios';

//const BASE_URL = 'http://localhost:8080/api/menu/v1';
//const BASE_URL = 'https://orca-app-5lor4.ondigitalocean.app/api';
//get bseurl from env using vite
//const BASE_URL = "https://api.philofoody.com/api/menu/v1";

const BASE_URL = process.env.REACT_APP_BASE_API_URL;

console.log("BASE_URL", BASE_URL);

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true

});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
