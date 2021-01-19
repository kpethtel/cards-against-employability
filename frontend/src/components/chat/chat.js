import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import './chat.css';

let counter = 0;

const Chat = ({socket, playerName}) => {

  const [inputText, setInputText] = useState("");
  const [chatLog, setChatLog] = useState({});

  useEffect(() => {
    const addToChatMessages = (newMessage) => {
      setChatLog(prevState => {
        counter = ++counter;
        let incomingMessage = {};
        incomingMessage[counter] = newMessage;
        return {...prevState, ...incomingMessage}
      });
    }
    socket.on('chat message', (playerName, msg) => addToChatMessages({name: playerName, message: msg}));
    socket.on('announce player entry', msg => addToChatMessages({message: msg}));
  }, [socket]);

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit('chat message', playerName, inputText)
    setInputText("");
  }

  const handleChange = (event) => {
    var text = event.target.value;
    setInputText(text);
  }

  const renderChatMessages = () => {
    const items = [];
    for (const [key, value] of Object.entries(chatLog)) {
      if (value.name) {
        items.push(<li key={key}><b>{`${value.name}: `}</b>{value.message}</li>);
      } else {
        items.push(<li key={key}>{value.message}</li>);
      }
    }
    return items;
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
          value={inputText}
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