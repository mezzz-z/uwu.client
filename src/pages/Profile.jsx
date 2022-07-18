import { useUser, useAuth } from "../context";
import { useState, useEffect } from "react";
import noProfile from "../assets/images/no-profile.png";
import { convertImageToBase64 } from "../helpers/toBase64.js";
import usersAPI from "../api/users.js";
import { useNavigate } from "react-router-dom";

const animationDuration = 600;

const animation = {
	initial: {
		transform: "scale(0)",
		opacity: 0,
	},
	start: {
		transform: "scale(1)",
		opacity: 1,
	},
	end: {
		transform: "scale(0) translateX(-1000px)",
		opacity: 0,
	},
};

const Profile = () => {
	const {
		userState: { username, profile_picture },
	} = useUser();

	const {
		auth: { token },
	} = useAuth();

	const [currentStyle, setCurrentStyle] = useState(animation.initial);
	const [currentProfilePicture, setCurrentProfilePicture] = useState(
		profile_picture || noProfile
	);

	const navigate = useNavigate();

	const uploadImage = async e => {
		if (!e.target.files || !e.target.files[0]) return;
		const maxSize = 5 * 1024 * 1024;
		const image = e.target.files[0];

		if (image.size > maxSize) return;

		try {
			const encodedImage = await convertImageToBase64(image);
			const { data } = await usersAPI.updateProfilePicture(encodedImage, token);
			setCurrentProfilePicture(data.updatedProfilePicture);
		} catch (error) {
			console.log(error);
		}
	};

	const handleGoingBack = () => {
		setCurrentStyle(animation.end);

		setTimeout(() => {
			navigate("/home");
		}, animationDuration + 200);
	};

	useEffect(() => {
		setCurrentStyle(animation.start);
	}, []);

	return (
		<section id='profile'>
			<div className='profile-container' style={currentStyle}>
				<button
					onClick={handleGoingBack}
					to={"/home"}
					className='go-back not-button'
				>
					go back
				</button>
				<button className='not-button edit-profile float-corner float-corner-top-right'>
					Edit profile
				</button>

				<span className='float-corner float-corner-top-left profile-information-label'>
					Profile information
				</span>

				<div className='profile-information'>
					<span className='username'>{username}</span>
					<p className='bio'>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
						dolorum aspernatur non iure quas pariatur similique sunt labore,
						optio corporis!
					</p>
				</div>
				<div className='profile-picture-container'>
					<img
						src={currentProfilePicture}
						className='profile-picture'
						alt='your-profiles'
					/>
					<form>
						<input
							type='file'
							className='hide'
							name='profile-picture'
							id='profile-picture'
							onChange={uploadImage}
						/>
						<label htmlFor='profile-picture'>change</label>
					</form>
				</div>
			</div>
		</section>
	);
};

export default Profile;
