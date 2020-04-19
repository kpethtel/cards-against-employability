import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket.js";

import './chat.css';

const Chat = () => {

  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  useEffect(() => {
    socket.on('chat message', data => addToChatMessages(data));
    socket.on('announce player entry', data => addToChatMessages(data));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit('chat message', message)
    setMessage("");
  }

  const handleChange = (event) => {
    var text = event.target.value;
    setMessage(text);
  }

  const addToChatMessages = (newMessage) => {
    setChatLog(prevState => [...prevState, newMessage]);
  }

  const renderChatMessages = () => {
    return chatLog.map(line => <li>{line}</li>)
  }

  return (
    <div className="chat">
      <div className="messageBox">
        <ul id="messages">
          { renderChatMessages() }
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          name="message"
          type="text"
          onChange={handleChange}
          value={message}
        />
      </form>
    </div>
  );
}

export default Chat;