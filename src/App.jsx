import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setChat(prev => [...prev, userMessage]);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      const aiMessage = { role: "assistant", content: data.response };
      setChat(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error calling API:", error);
    }

    setMessage("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Our Boring AI Chat</h2>

      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 300 }}>
        {chat.map((msg, index) => (
          <p key={index}>
            <strong>{msg.role}:</strong> {msg.content}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          style={{ width: "80%", padding: 8 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          style={{ padding: 8, marginLeft: 5 }}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;