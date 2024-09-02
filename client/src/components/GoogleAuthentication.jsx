// GoogleAuthentication.js
import React from "react";
import { toast } from "react-toastify";
import { fetchApi } from "../../api";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function GoogleAuthentication() {
    const [signingUp, setSigningUp] = React.useState(false);
    const [signingIn, setSigningIn] = React.useState(false);

	// Placeholder functions for API calls
	const handleSignUp = async () => {
		// Your API call for sign-up
        try{
            setSigningUp(true);
            const {user} = await signInWithPopup(auth, provider);
            console.log(user);
            
            // Toast success
            toast.success("Signed up successfully!");
        }catch(error){
            // Toast error
            console.log(error);
            
            toast.error("Something went wrong!");
        }finally{
            setSigningUp(false);
        }
	};

	const handleSignIn = async () => {
        // Your API call for sign-in
        try{
            setSigningIn(true);
            const {data} = await signInWithPopup(auth, provider);
            // Toast success
            toast.success("Signed in successfully!");
        }catch(error){
            // Toast error
            toast.error("Something went wrong!");
        }finally{
            setSigningIn(false);
        }
	};

	return (
		<div className="flex justify-center items-center min-h-full min-w-full bg-gray-100">
			<div className="bg-white shadow-lg rounded-lg p-8 max-w-xs w-full text-center md:mb-24">
				<h2 className="text-2xl font-semibold mb-8">Welcome</h2>
				<button
					onClick={handleSignUp}
                    disabled={signingUp}
					className="w-full mb-6 py-2 bg-blue-500 font-semibold text-white rounded-md hover:bg-blue-600 transition duration-300"
				>
					{signingUp ? 'Signing Up...' : 'Sign Up with Google'}
				</button>
				<button
					onClick={handleSignIn}
                    disabled={signingIn}
					className="w-full py-2 bg-green-500 font-semibold text-white rounded-md hover:bg-green-600 transition duration-300"
				>
					{signingIn ? 'Signing In...' : 'Sign In with Google'}
				</button>
			</div>
		</div>
	);
}

export default GoogleAuthentication;
