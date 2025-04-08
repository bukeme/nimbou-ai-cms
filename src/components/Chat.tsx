// src/Chat.tsx
import React, { useState, FormEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import aiChatImg from "../assets/ai-chat-img.png";
import axios from "axios";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const Chat: React.FC = () => {
  const storedMessages = sessionStorage.getItem("chat");
  const initialMessages: ChatMessage[] = storedMessages
    ? JSON.parse(storedMessages)
    : [];
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (e: FormEvent) => {
    console.log("hello");
    e.preventDefault();

    setIsLoading(true);
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    axios
      .post("https://nimbou-api.stylconmarketplace.com/api/chat/", {
        message: inputValue,
      })
      .then((response) => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: response.data.message, sender: "bot" },
        ]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    sessionStorage.setItem("chat", JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="h-[calc(100vh-64px)] py-4 px-32">
      <div className="h-full flex flex-col justify-center">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mb-3">
            <img
              src={aiChatImg}
              alt="Empty chat placeholder"
              className="mb-2 w-20 h-20 object-contain"
            />
            <p className="text-lg font-medium text-black">Hello, I'm an AI</p>
            <p className="">You can ask me anything you want.</p>
          </div>
        ) : (
          <div className="grow max-h-full p-4 overflow-y-auto space-y-2 mb-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-xs ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        )}
        <form
          onSubmit={handleSendMessage}
          className="bg-gray-200 w-full rounded-lg p-3 flex flex-col items-end space-y-3"
        >
          <textarea
            value={inputValue}
            placeholder="Type your message..."
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-lg bg-white h-18 p-2 outline-none border border-gray-300"
          ></textarea>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 text-white px-2 py-1 cursor-pointer rounded hover:bg-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
