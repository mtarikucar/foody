import axios from "axios";

//const BASE_URL ="http://localhost:8080/api/menu/v1";
//const BASE_URL = 'https://api.philofoody.com/api/menu/v1';

const BASE_URL = process.env.REACT_APP_BASE_API_URL;

const axioss = axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {"Content-Type": "application/xml"},
    withCredentials: true,
});

export const getMenu = async (menuId) => {
    const response = await axioss.get(`/menu/${menuId}`);
    return response.data;
};


export const getBranch = async (breachId) => {
    const response = await axioss.get(`/branch/${breachId}`);
    return response.data;
};

export const getCategories = async (menuId) => {
    const response = await axioss.get(`/menu/categories/${menuId}`);
    return response.data;
};

export const getFeatures = async (id) => {
    const response = await axioss.get(`/product/features/${id}`);
    return response.data;
};

export const getProducts = async (categoryId, menuId,page, pageSize = 10) => {
    if (typeof menuId === 'undefined' || menuId === '') {
        console.error('menuId is undefined or empty');
        return null;
    }
    let url = `/product/list?menuId=${menuId}&page=${page}&size=${pageSize}`;

    if (typeof categoryId !== 'undefined' && categoryId !== '') {
        url += `&categoryId=${encodeURIComponent(categoryId)}`;
    }

    try {
        const response = await axioss.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
};

