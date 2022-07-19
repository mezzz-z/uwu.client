import handleInputs from "../../helpers/HandleInputs.js";
import { useState } from "react";
import { useAuth, useUser } from "../../context/index.js";
import usersAPI from "../../api/users.js";
import FormModal from "../../components/FormModal.jsx";
import useFormModal from "../../hooks/useFormModal.js";
const EditProfile = ({ user: { username, bio }, prevPage }) => {
	const [userInformation, setUserInformation] = useState({ username, bio });
	const handle = handleInputs(setUserInformation, userInformation);

	const { setUser } = useUser();
	const { modalState, removeModal, setModal } = useFormModal();

	const {
		auth: { token },
	} = useAuth();

	const handleSubmit = async e => {
		e.preventDefault();
		if (modalState.openModal) return;
		if (!userInformation.username) {
			return setModal("Username cannot be empty", false);
		}
		if (userInformation.username === username && userInformation.bio === bio) {
			return setModal("Cannot accept the same information", false);
		}

		try {
			const {
				data: { updatedProfile, message },
			} = await usersAPI.updateUserProfile(
				userInformation.username,
				userInformation.bio,
				token
			);

			setUser(updatedProfile);
			setModal(message, true, () => prevPage());
		} catch (error) {
			setModal(error?.response?.data?.message || "something went wrong", false);
		}
	};

	return (
		<section className='edit-profile float-component'>
			{modalState.openModal && (
				<FormModal
					modalClassName={modalState.modalClassName}
					modalContent={modalState.content}
					removeModal={removeModal}
				/>
			)}
			<div className='edit-profile-container'>
				<button
					onClick={() => !modalState.openModal && prevPage()}
					className='go-back not-button'
				>
					go back
				</button>
				<form onSubmit={handleSubmit}>
					<h3 className='title'>Edit account</h3>
					<div className='form-item'>
						<label htmlFor='username' className='username'>
							Username
						</label>
						<input
							type='text'
							className='username'
							id='username'
							onChange={handle}
							value={userInformation.username}
							required
							name='username'
						/>
					</div>
					<div className='form-item'>
						<label htmlFor='bio' className='bio'>
							Bio
						</label>
						<textarea
							type='text'
							className='bio'
							id='bio'
							name='bio'
							onChange={handle}
							value={userInformation.bio}
						/>
					</div>
					<div className='form-item'>
						<button type='submit' className='submit'>
							Edit
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default EditProfile;
