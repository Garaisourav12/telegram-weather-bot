import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

axios.defaults.withCredentials = true;

const fetchApi = async (endpoint, methode = "get", body) => {
	if (body) {
		const response = await axios[methode](BASE_URL + endpoint, body);
		// console.log(response);
		return response;
	} else {
		const response = await axios[methode](BASE_URL + endpoint);
		// console.log(response);
		return response;
	}
};

export default fetchApi;
