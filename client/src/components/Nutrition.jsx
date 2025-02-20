import React, { useState } from "react";

const Nutrition = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = "AIzaSyCBbgV5eH6taAcX7hZFVhf-7XMMn8YEAzU"; 

  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
      .replace(/\*(.*?)\*/g, "<em>$1</em>") 
      .replace(/(\n\n|\r\n\r\n)/g, "<br/><br/>") 
      .replace(/\n/g, "<br/>"); 
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );

      if (response.status === 429) {
        setMessages([
          ...newMessages,
          {
            text: "Chill Dude...AI also needs rest!!",
            sender: "bot",
          },
        ]);
      } else {
        const data = await response.json();

        const aiResponse =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Sorry, I couldn't process that.";

        setMessages([
          ...newMessages,
          { text: formatResponse(aiResponse), sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          text: "Ahhh...Error again!!",
          sender: "bot",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-cyan-300 to-blue-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center text-green-600">
          AI Nutritionist
        </h1>

        
        <div className="h-80 overflow-y-auto p-3 border rounded-lg bg-gray-100 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-green-300 self-end text-right"
                  : "bg-gray-300 self-start text-left"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }} 
            />
          ))}
          {loading && (
            <div className="text-gray-500 text-center">Thinking...</div>
          )}
        </div>

       
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} 
            placeholder="Ask about nutrition..."
            className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
