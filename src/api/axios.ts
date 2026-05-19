import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:3000/v1",
    baseURL: "https://srirms-be.onrender.com/v1"
});


export default API;