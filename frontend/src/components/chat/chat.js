import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import './chat.css';

const Chat = ({socket, playerName}) => {

  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    socket.on('chat message', (playerName, msg) => addToChatMessages([playerName, msg]));
    socket.on('announce player entry', msg => addToChatMessages([msg]));
  }, [socket]);

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit('chat message', playerName, message)
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
    let counter = 0;
    return chatLog.map(line => {
      counter = ++counter;
      if (line.length === 1) {
        return <li key={counter}>{line[0]}</li>
      } else {
        return <li key={counter}><b>{`${line[0]}: `}</b>{line[1]}</li>
      }
    })
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

Chat.propTypes = {
  name: PropTypes.string,
  socket: PropTypes.object,
}

export default Chat;