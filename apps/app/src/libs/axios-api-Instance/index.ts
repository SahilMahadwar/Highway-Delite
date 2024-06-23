import axios from "axios";
import { baseApiUrl } from "../constants";

const config = {
  baseURL: baseApiUrl,
};

const api = axios.create(config);

export const axiosApiInstance = api;
