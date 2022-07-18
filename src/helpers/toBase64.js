const convertToBase64 = file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
};
const convertImageToBase64 = async file => {
	const convertedImage = await convertToBase64(file);
	const mimeType = convertedImage.split("data:")[1].split(";")[0];

	return {
		mimeType: mimeType,
		data: convertedImage,
	};
};

export { convertToBase64, convertImageToBase64 };
