import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const ExpandableChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setMessages([]);
  };

  const handleQuestionClick = (question) => {
    setMessages([{ type: 'user', text: question }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages([
        { type: 'user', text: question },
        { type: 'bot', text: getAnswer(question) },
      ]);
      setIsTyping(false);
    }, 500);
  };

  const getAnswer = (question) => {
    switch (question) {
      case 'How long will it take for my payment to be approved?':
        return 'Payments are usually approved within a few hours, but it can take up to one business day';
      case 'What are the benefits of being a member?':
        return 'Membership benefits include access to resources like virtual one-on-one coaching, webinars, and discounts on other programs.';
      case 'How do I view which programmes I have signed up for?':
        return 'You can view the programs you have enrolled in on your dashboard.';
      default:
        return 'I do not have an answer for that question. Please contact support for more details.';
    }
  };

  const inquiryOptions = [
    'How long will it take for my payment to be approved?',
    'What are the benefits of being a member?',
    'How do I view which programmes I have signed up for?',
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChatbot}
        className={`bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle size={24} />
      </button>
      <div
        className={`bg-white shadow-lg rounded-lg w-80 ${
          isOpen ? 'block' : 'hidden'
        } transition-all duration-300`}
      >
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-t-lg">
          <h3 className="text-lg font-medium">Digibot</h3>
          <button onClick={toggleChatbot} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-2 h-64 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-end justify-start">
              <div className="inline-block px-3 py-2 rounded-lg bg-gray-200 text-gray-800">
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce mr-1 inline-block"></div>
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce mr-1 inline-block"></div>
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce inline-block"></div>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-2 bg-gray-100 rounded-b-lg">
          <ul className="space-y-1">
            {inquiryOptions.map((option, index) => (
              <li
                key={index}
                className="bg-gray-200 p-2 rounded hover:bg-gray-300 cursor-pointer"
                onClick={() => handleQuestionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExpandableChatbot;
