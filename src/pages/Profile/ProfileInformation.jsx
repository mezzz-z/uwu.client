import { useAuth } from "../../context";
import { useState, useEffect } from "react";
import noProfile from "../../assets/images/no-profile.png";
import { convertImageToBase64 } from "../../helpers/toBase64.js";
import usersAPI from "../../api/users.js";
import { useNavigate } from "react-router-dom";

const profileContainerAnimationDuration = 400;

const profileContainerAnimation = {
	initial: {
		transform: "scale(.3) translate(-40%, -90%)",
		opacity: 0,
	},
	start: {
		transform: "scale(1) translate(0%, 0%)",
		opacity: 1,
	},
	end: {
		transform: "scale(0) translateX(-1000px)",
		opacity: 0,
	},
};

const ProfileInformation = ({
	nextPage,
	currentUser: { username, bio, profile_picture },
}) => {
	const {
		auth: { token },
	} = useAuth();

	const [profileContainerStyle, setProfileContainerStyle] = useState(
		profileContainerAnimation.initial
	);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [currentProfilePicture, setCurrentProfilePicture] = useState(
		profile_picture || noProfile
	);

	const navigate = useNavigate();

	const uploadImage = async e => {
		if (!e.target.files || !e.target.files[0]) return;
		const maxSize = 5 * 1024 * 1024;
		const image = e.target.files[0];
		if (image.size > maxSize) return;

		setUploadingImage(true);
		try {
			const encodedImage = await convertImageToBase64(image);
			const { data } = await usersAPI.updateProfilePicture(encodedImage, token);
			setCurrentProfilePicture(data.updatedProfilePicture);
			setUploadingImage(false);
		} catch (error) {
			console.log(error);
			setUploadingImage(false);
		}
	};

	const handleGoingBack = () => {
		setProfileContainerStyle(profileContainerAnimation.end);

		setTimeout(() => {
			navigate("/home");
		}, profileContainerAnimationDuration + 100);
	};

	useEffect(() => {
		setProfileContainerStyle(profileContainerAnimation.start);
	}, []);

	return (
		<section className='profile float-component'>
			<div className='profile-container' style={profileContainerStyle}>
				<button
					disabled={uploadingImage ? true : false}
					onClick={handleGoingBack}
					to={"/home"}
					className='go-back not-button'
				>
					go back
				</button>
				<button
					onClick={() => nextPage()}
					className='not-button edit-profile float-corner float-corner-top-right'
				>
					Edit profile
				</button>

				<span className='float-corner float-corner-top-left profile-information-label'>
					Profile information
				</span>

				<div className='profile-information'>
					<span className='username'>{username}</span>
					<p className='bio'>{bio}</p>
				</div>
				<div
					className={`profile-picture-container  ${
						uploadingImage && "loading"
					}`}
				>
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
							disabled={uploadingImage ? true : false}
						/>
						<label
							htmlFor='profile-picture'
							className={uploadingImage ? "disabled" : undefined}
						>
							change
						</label>
					</form>
				</div>
			</div>
		</section>
	);
};

export default ProfileInformation;
