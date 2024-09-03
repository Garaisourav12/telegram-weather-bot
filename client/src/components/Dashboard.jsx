import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Loader from "./Loader";
import Error from "./Error";
import { useNavigate } from "react-router-dom";
import fetchApi from "../../api";
import BotUser from "./BotUser";
import WebShare from "./WebShare";
import { toast } from "react-toastify";

function Dashboard() {
	const navigate = useNavigate();
	const { auth, loading, error } = useAuth(); // renamed to user for clarity
	const [admin, setAdmin] = useState(null);
	const [botUsers, setBotUsers] = useState([]);
	const [siginingOut, setSiginingOut] = useState(false);
	const [botUsersFetching, setBotUsersFetching] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [blocking, setBlocking] = useState(false);

	const fetchBotUsers = async () => {
		try {
			setBotUsersFetching(true);
			const response = await fetchApi("/user/find");
			setBotUsers(response.data.data);
		} catch (err) {
			console.log(err);
		} finally {
			setBotUsersFetching(false);
		}
	};

	useEffect(() => {
		if (auth) {
			setAdmin(auth);
			fetchBotUsers();
		}
	}, [auth]);

	const handleSignout = async () => {
		try {
			setSiginingOut(true);
			const { data } = await fetchApi("/admin/logout");
			setAdmin(null);
			navigate("/");
			toast.success(data.message);
		} catch (err) {
			// console.log(err);
			toast.error(err.response.data.error);
		} finally {
			setSiginingOut(false);
		}
	};

	if (loading) return <Loader />;

	if (error || !admin) return <Error />;

	return (
		<div className="flex flex-col justify-start items-center bg-gray-100 w-full p-4 sm:p-10">
			{/* Admin Panel Heading */}
			<h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
			<div className="bg-white shadow-lg rounded-lg p-6 sm:w-[350px] w-full mb-8 relative">
				<WebShare
					text={"Weather Bot"}
					title={"Weather Bot"}
					url={"https://web.telegram.org/k/#@nest_daily_weather_bot"}
				/>
				<div className="text-center">
					<img
						src={admin.profilePic}
						alt="Profile"
						className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-400"
					/>
					<h2 className="text-xl font-semibold text-gray-700">
						{admin.username}
					</h2>
					<p className="text-gray-500 mb-4">{admin.email}</p>
					<button
						onClick={handleSignout}
						disabled={siginingOut}
						className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
					>
						{siginingOut ? "Signing Out..." : "Sign Out"}
					</button>
				</div>
			</div>

			{/* Bot Users Heading */}
			<h2 className="text-2xl font-semibold mb-4">Bot Users</h2>

			{/* Bot Users List */}
			{botUsersFetching ? (
				<Loader className="text-[14px] font-normal text-gray-500" />
			) : (
				<>
					{botUsers.length > 0 ? (
						<ul className="w-full max-w-xl">
							{botUsers.map((botUser) => (
								<BotUser
									key={botUser._id}
									botUser={botUser}
									setBotUsers={setBotUsers}
								/>
							))}
						</ul>
					) : (
						<p className="font-normal text-gray-500">
							No Bot Users found.
						</p>
					)}
				</>
			)}
		</div>
	);
}

export default Dashboard;
