import axios from "axios";

const baseUrl = axios.create({ baseURL: "https://pdf-generatorr.herokuapp.com/api" });

export default baseUrl;
