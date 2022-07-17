import { useState } from "react";
import CurrentRoomContext from "./context.js";

const initial = {
	messages: [],
	users_ids: [],
	room_name: "",
	room_id: "",
	awaitFetchMessages: true,
	awaitFetchRoom: true,
	areMessagesFinished: false,
};

const CurrentRoomState = props => {
	const [currentRoomState, setCurrentRoomState] = useState(initial);

	const setCurrentRoom = room => {
		setCurrentRoomState({
			...currentRoomState,
			...room,
			awaitFetchRoom: false,
		});
	};

	const setMessages = (messages, isFinished, initial = true) => {
		setCurrentRoomState(state => {
			return {
				...state,
				messages: initial ? [...messages] : [...messages, ...state.messages],
				awaitFetchMessages: false,
				areMessagesFinished: isFinished,
			};
		});
	};

	const addNewMessage = message => {
		setCurrentRoomState(state => {
			return {
				...state,
				messages: [
					...state.messages,
					{
						message_id: message.message_id,
						created_at: message.created_at,
						message_text: message.message_text,
						sender: {
							user_id: message.sender_id,
							profile_picture: message.profile_picture,
							username: message.username,
						},
					},
				],
			};
		});
	};

	const editMessage = (messageId, messageText) => {
		console.log(messageId, messageText);
		setCurrentRoomState(state => {
			return {
				...state,
				messages: state.messages.map(mappedMessage => {
					if (mappedMessage.message_id === messageId) {
						mappedMessage.message_text = messageText;
					}
					return mappedMessage;
				}),
			};
		});
	};

	const removeMessage = messageId => {
		setCurrentRoomState(state => {
			return {
				...state,
				messages: state.messages.filter(message => {
					return message.message_id !== messageId;
				}),
			};
		});
	};

	const submitCurrentRoom = () => {
		setCurrentRoomState({ ...currentRoomState, submitted: true });
	};

	return (
		<CurrentRoomContext.Provider
			value={{
				currentRoom: currentRoomState,
				setCurrentRoom: setCurrentRoom,
				submitCurrentRoom: submitCurrentRoom,
				addNewMessage: addNewMessage,
				setMessages: setMessages,
				removeMessage: removeMessage,
				editMessage: editMessage,
			}}
		>
			{props.children}
		</CurrentRoomContext.Provider>
	);
};

export default CurrentRoomState;
