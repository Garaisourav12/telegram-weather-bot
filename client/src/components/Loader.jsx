import React from "react";

function Loader({ className = "" }) {
	return (
		<p className={`text-center min-w-full self-center` + className}>
			Loading...
		</p>
	);
}

export default Loader;
