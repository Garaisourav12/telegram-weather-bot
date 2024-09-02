import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
	const { user, loading, error } = useAuth();

    if(loading) return <div className="my-8 text-center">Loading...</div>

    if (!user || error) <Navigate to="/" replace />;

	return <Outlet />;
}

export default PrivateRoute;
