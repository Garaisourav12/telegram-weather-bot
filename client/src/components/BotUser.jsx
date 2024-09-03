import React, { useState } from "react";
import fetchApi from "../../api";

function BotUser({ botUser, setBotUsers }) {
	const { _id, name, isSubscribed, isBlocked } = botUser;
	const [deleteing, setDeleteing] = useState(false);
	const [blocking, setBlocking] = useState(false);

	const blockUser = async (id) => {
		try {
			setBlocking(true);
			await fetchApi(`/user/block/${id}`);
			setBotUsers((prev) =>
				prev.map((user) => {
					if (user._id === id) return { ...user, isBlocked: true };
					return user;
				})
			);
		} catch (err) {
			console.log(err);
		} finally {
			setBlocking(false);
		}
	};

	const unblockUser = async (id) => {
		try {
			setBlocking(true);
			await fetchApi(`/user/unblock/${id}`);
			setBotUsers((prev) =>
				prev.map((user) => {
					if (user._id === id) return { ...user, isBlocked: false };
					return user;
				})
			);
		} catch (err) {
			console.log(err);
		} finally {
			setBlocking(false);
		}
	};

	const deleteUser = async (id) => {
		try {
			setDeleteing(true);
			await fetchApi(`/user/delete/${id}`);
			setBotUsers((prev) => prev.filter((user) => user._id !== id));
		} catch (err) {
			console.log(err);
		} finally {
			setDeleteing(false);
		}
	};

	return (
		<li
			key={_id}
			className="flex justify-between items-center p-3 sm:px-4 bg-white rounded-lg shadow-md"
		>
			<div>
				<h3 className="text-md sm:text-lg font-semibold text-gray-700">
					{name}
				</h3>
				<div className="text-[10px] sm:text-sm flex">
					(&nbsp;
					<p
						className={
							isSubscribed ? "text-green-700" : "text-red-700"
						}
					>
						{isSubscribed ? "Subscribed" : "No Subscription"}
					</p>
					&nbsp;/&nbsp;
					<p
						className={
							isBlocked ? "text-red-700" : "text-green-700"
						}
					>
						{isBlocked ? "Blocked" : "Active"}
					</p>
					&nbsp;)
				</div>
			</div>
			<div className="flex items-center space-x-2 text-[10px] sm:text-sm">
				<button
					onClick={() =>
						isBlocked ? unblockUser(_id) : blockUser(_id)
					}
					disabled={blocking}
					className={`px-2 py-1 w-[70px] sm:w-[100px] rounded-md text-white font-medium ${
						isBlocked
							? "bg-green-600 hover:bg-green-700"
							: "bg-yellow-600 hover:bg-yellow-700"
					}`}
				>
					{isBlocked
						? `${blocking ? "Unblocking..." : "Unblock"}`
						: `${blocking ? "Blocking..." : "Block"}`}
				</button>
				<button
					onClick={() => deleteUser(_id)}
					disabled={deleteing}
					className="px-2 py-1 w-[70px] sm:w-[100px] bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
				>
					{deleteing ? "Deleting..." : "Delete"}
				</button>
			</div>
		</li>
	);
}

export default BotUser;
