import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketComponent = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socketInstance = io();

    socketInstance.on("connect", () => {
      console.log("Connected to server with ID:", socketInstance.id);
    });

    // Listen for messages
    socketInstance.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit("message", input);
      setInput("");
    }
  };

  return (
    <div>
      <h1>Socket.IO Chat</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default SocketComponent;
