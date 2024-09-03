import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "./Loader";

function PrivateRoute2() {
	const { auth, loading } = useAuth();

	if (loading) {
		return <Loader />;
	} else if (auth) {
		return <Navigate to="/dashboard" replace />;
	} else {
		return <Outlet />;
	}
}

export default PrivateRoute2;
