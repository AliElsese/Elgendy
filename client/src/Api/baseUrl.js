import axios from "axios";

const baseUrl = axios.create({ baseURL: "http://localhost:8101" });

export default baseUrl;
