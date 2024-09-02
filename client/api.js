import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

axios.defaults.withCredentials = true;

export const fetchApi = async (endpoint) => {
	// All are get requests
	return await axios.get(BASE_URL + endpoint);
};
