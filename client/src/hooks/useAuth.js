import { useEffect } from "react";
import { fetchApi } from "../../api";

export const useAuth = async () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(async () => {
		try {
			const { data } = await fetchApi("/admin/profile");
			setUser(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	});
	return { user, loading, error };
};
