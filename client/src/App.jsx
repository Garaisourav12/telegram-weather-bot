import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import GoogleAuthentication from "./components/GoogleAuthentication";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PrivateRoute2 from "./components/PrivateRoute2";

function App() {
	return (
		<main className="flex flex-col min-h-screen">
			<ToastContainer />
			<Header />
			<div className="flex-1 flex">
				<Routes>
					<Route element={<PrivateRoute2 />}>
						<Route path="/" element={<GoogleAuthentication />} />
					</Route>
					<Route element={<PrivateRoute />}>
						<Route path="/dashboard" element={<Dashboard />} />
					</Route>
				</Routes>
			</div>
		</main>
	);
}

export default App;
