import { useEffect, useState } from "react";
import fetchApi from "../../api";

const useAuth = () => {
	const [auth, setAuth] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const getProfile = async () => {
		try {
			const response = await fetchApi("/admin/profile");
			setAuth(response.data.data);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getProfile();
	}, []);

	return { auth, loading, error };
};

export default useAuth;
