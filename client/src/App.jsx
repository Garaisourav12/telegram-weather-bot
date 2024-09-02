import "./App.css";
import Header from "./components/Header";
import GoogleAuthentication from "./components/GoogleAuthentication";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
	return (
		<main className="flex flex-col min-h-screen">
      {/* <ToastContainer /> */}
			<Header />
			<div className="flex-1 flex">
				<Routes>
					<Route path="/" element={<GoogleAuthentication />} />
					<Route element={<PrivateRoute />}>
						<Route path="/dashboard" element={<Dashboard />} />
					</Route>
				</Routes>
			</div>
		</main>
	);
}

export default App;
