import axios from "axios";

const headers = {
    "Content-Type": "multipart/form-data",
};

export const baseURL = "https://latest.dbrain.io";
export const secondaryURL = "https://docr4.demos.dbrain.io";

export const axiosInstance = axios.create({
    baseURL,
    headers,
});
