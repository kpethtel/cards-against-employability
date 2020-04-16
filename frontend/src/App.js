import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import './App.css';

const ENDPOINT = "localhost:3001"
const socket = socketIOClient(ENDPOINT);

function App() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  useEffect(() => {
    socket.on('chat message', data => addToChatMessages(data));
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
    <div>
      <ul id="messages">
        { renderChatMessages() }
      </ul>
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

export default App;