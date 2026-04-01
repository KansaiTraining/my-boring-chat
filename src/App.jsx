import { useState } from "react";
// 1. Import the UI components and styles
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setChat(prev => [...prev, userMessage]);

    try {
      // 2. Get the fresh session tokens
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      // 3. Perform the fetch with the Authorization header
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
    <Authenticator>
      {({ signOut, user }) => (
        <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
          <header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2>Our Boring AI Chat</h2>
            <button onClick={signOut}>Sign Out</button>
          </header>

          <p>Welcome, <strong>{user.username}</strong>!</p>

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
      )}
    </Authenticator>
  );
}

export default App;