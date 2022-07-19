import { useUser } from "../../context";
import { useState } from "react";
import ProfileInformation from "./ProfileInformation";
import EditProfile from "./EditProfile.jsx";

const sliderAnimation = {
	initial: {
		transform: "translateX(0vw)",
	},
	next: {
		transform: "translateX(-100%)",
	},
	prev: {
		transform: "translateX(0%)",
	},
};

const Profile = () => {
	const [sliderStyle, setSliderStyle] = useState(sliderAnimation.initial);
	const [showEditProfile, setShowEditProfile] = useState(false);

	const {
		userState: { profile_picture, username, bio },
	} = useUser();

	// const [currentStyle, setCurrentStyle] = useState(animation.initial);

	const next = () => {
		setShowEditProfile(true);
		setSliderStyle(sliderAnimation.next);
	};
	const prev = () => {
		setSliderStyle(sliderAnimation.prev);
		setTimeout(() => setShowEditProfile(false), 800);
	};

	return (
		<>
			<div className='slider' style={sliderStyle}>
				<ProfileInformation
					currentUser={{ username, bio, profile_picture }}
					nextPage={next}
				/>

				{showEditProfile && (
					<EditProfile prevPage={prev} user={{ username, bio }} />
				)}
			</div>
		</>
	);
};

export default Profile;
