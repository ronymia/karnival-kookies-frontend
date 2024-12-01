"use client";

import React, { useState } from "react";
import { AiOutlineMessage, AiOutlineClose } from "react-icons/ai";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    setMessages([...messages, { text: inputValue, sender: "user" }]);
    setInputValue("");
  };

  return (
    <div>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-purple-700 text-white p-4 rounded-full shadow-lg hover:bg-purple-800 transition duration-300 flex items-center justify-center"
        aria-label="Live Chat"
      >
        <AiOutlineMessage size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white shadow-lg rounded-lg border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-purple-700 text-white p-4 rounded-t-lg">
            <h4 className="font-bold">Live Chat</h4>
            <button onClick={toggleChat} aria-label="Close Chat">
              <AiOutlineClose size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-64 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">
                Start the conversation!
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center border-t border-gray-200 p-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
            />
            <button
              onClick={handleSendMessage}
              className="bg-purple-700 text-white px-4 py-2 rounded-r-lg hover:bg-purple-800 transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
