/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useSocket, useAuth, useCurrentRoom } from "../../context/index.js";
import roomsAPI from "../../api/rooms.js";
import Message from "./Message.jsx";
import RoomInfo from "./RoomInfo.jsx";

const ChatRoom = () => {
	const {
		currentRoom,
		addNewMessage,
		setMessages,
		removeMessage,
		editMessage,
	} = useCurrentRoom();
	const { auth } = useAuth();
	const {
		socketState: { socket },
	} = useSocket();

	const firstMessage = useRef(null);
	const scrollSpan = useRef(null);
	const observer = useRef(null);
	const newMessage = useRef(false);

	const observerCallback = entries => {
		entries.forEach(entry => {
			if (!entry.target.id === "firstMessage" || !entry.isIntersecting) return;
			roomsAPI
				.getRoomMessages(
					currentRoom.room_id,
					auth.token,
					currentRoom.messages.length
				)
				.then(({ data }) => {
					const messages = data.messages.reverse();
					setMessages(messages, data.isFinished, false);
				})
				.catch(error => console.log(error));
		});
	};

	const [messageText, setMessageText] = useState("");
	const [showRoomInfo, setShowRoomInfo] = useState(false);

	const sendMessage = async e => {
		e.preventDefault();
		setMessageText("");

		socket.emit("chat-room/new-message", {
			roomId: currentRoom.room_id,
			messageText,
			senderId: auth.userId,
		});
	};

	useEffect(() => {
		if (showRoomInfo) setShowRoomInfo(false);

		roomsAPI
			.getRoomMessages(currentRoom.room_id, auth.token)
			.then(({ data }) => {
				newMessage.current = true;
				setMessages(data.messages, data.isFinished);
			})
			.catch(error => console.log(error));

		socket.on("chat-room/new-message", message => {
			newMessage.current = true;
			addNewMessage(message);
		});
		socket.on("chat-room/message-deleted", messageId => {
			removeMessage(messageId);
		});
		socket.on("chat-room/message-edited", editedMessage => {
			editMessage(editedMessage.message_id, editedMessage.message_text);
		});

		return () => {
			socket.removeListener("chat-room/new-message");
			socket.removeListener("chat-room/message-edited");
			socket.removeListener("chat-room/message-deleted");
		};
	}, [currentRoom.room_id]);

	useEffect(() => {
		if (currentRoom.awaitFetchMessages) return;

		if (newMessage.current) {
			scrollSpan.current.scrollIntoView({ behavior: "smooth" });
			newMessage.current = false;
		}

		if (currentRoom.areMessagesFinished) {
			if (observer.current) observer.current.disconnect();
			return;
		}

		setTimeout(() => {
			observer.current = new IntersectionObserver(observerCallback, {
				rootMargin: "-100px 0px 0px -100px",
			});
			observer.current.observe(firstMessage.current);
		}, 1000);

		return () => {
			if (observer.current) observer.current.disconnect();
		};
	}, [currentRoom.messages]);

	return (
		<section className='chat-screen'>
			{showRoomInfo && (
				<RoomInfo
					removeComponent={() => setShowRoomInfo(false)}
					room={currentRoom}
				/>
			)}

			<header className='header'>
				<h3 className='room-name'>{currentRoom.room_name}</h3>
				<button
					onClick={() => setShowRoomInfo(true)}
					className='room-info not-button'
				>
					room info
				</button>
			</header>
			<div className='main-container'>
				{currentRoom.awaitFetchMessages ? (
					<h3 className='no-messages'>Loading...</h3>
				) : currentRoom.messages.length > 0 ? (
					currentRoom.messages.map((message, i) => {
						return (
							<div
								ref={i === 0 ? firstMessage : undefined}
								key={message.message_id}
								itsme={
									message.sender.user_id === auth.userId ? "true" : "false"
								}
								className='message-container'
								id={message.i === 0 ? "firstMessage" : undefined}
							>
								<Message message={message} />
							</div>
						);
					})
				) : (
					<h3 className='no-messages'>There is no messages</h3>
				)}

				<span ref={scrollSpan} style={{ display: "inline" }}></span>
			</div>
			<article className='footer'>
				<form onSubmit={sendMessage} action=''>
					<textarea
						required
						value={messageText}
						onChange={e => setMessageText(e.target.value)}
						placeholder='write something'
						type='text'
					/>

					<button disabled={messageText ? false : true} type='submit'>
						send
					</button>
				</form>
			</article>
		</section>
	);
};

export default ChatRoom;
