import React from "react";
import { RWebShare } from "react-web-share";
import { FaShareAlt } from "react-icons/fa";

function WebShare({ text, url, title }) {
	return (
		<div
			title={"Share Weather Bot"}
			className="flex absolute top-6 right-6 cursor-pointer"
		>
			<RWebShare
				data={{
					text: text,
					url: url,
					title: title,
				}}
			>
				<FaShareAlt />
			</RWebShare>
		</div>
	);
}

export default WebShare;
