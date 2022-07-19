const FormModal = ({ modalClassName, modalContent, removeModal }) => {
	const className = `modal-container ${modalClassName}`;

	removeModal(3000);

	return (
		<section className={className}>
			<span>{modalContent}</span>
		</section>
	);
};

export default FormModal;
