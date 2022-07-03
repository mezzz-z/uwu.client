export default function handleInputs(setState, state){
    this.state = state
    this.setState = setState
    this.handle = (e) => this.setState({
        ...this.state,
        [e.target.name]: e.target.value
    })
}