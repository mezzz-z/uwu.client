export default function handleInputs(setState, state) {
	return e =>
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
}
