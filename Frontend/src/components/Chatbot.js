import React, { useState } from 'react';
import { MessageCircle, X, Mail } from 'lucide-react';

const ExpandableChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [showCustomQuestionInput, setShowCustomQuestionInput] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setMessages([]);
    setCustomQuestion('');
    setShowCustomQuestionInput(false);
  };

  const handleQuestionClick = (question) => {
    if (question === 'I have a different question') {
      setShowCustomQuestionInput(true);
    } else {
      setMessages([{ type: 'user', text: question }]);
      setIsTyping(true);

      setTimeout(() => {
        setMessages([
          { type: 'user', text: question },
          { type: 'bot', text: getAnswer(question) },
        ]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleCustomQuestionSubmit = (e) => {
    e.preventDefault();
    if (customQuestion.trim() !== '') {
      setMessages([
        { type: 'user', text: customQuestion },
        { type: 'bot', text: 'Thank you for your inquiry. We will get back to you soon.' },
      ]);
      setCustomQuestion('');
      setShowCustomQuestionInput(false);
      // Here, you can add logic to send the custom inquiry to the admin
      console.log('Sending custom inquiry to admin:', customQuestion);
    }
  };

  const getAnswer = (question) => {
    switch (question) {
      case 'Do you ship internationally?':
        return 'Yes, we ship internationally to most countries.';
      case 'Why are your prices so low?':
        return 'We are able to offer low prices due to our efficient supply chain and high sales volume.';
      case 'How do I track my order?':
        return 'You can track your order by logging into your account and going to the orders section.';
      case 'How much is shipping?':
        return 'Shipping costs vary depending on your location and the size/weight of your order. You can check the shipping costs during checkout.';
      default:
        return 'I do not have an answer for that question. Please submit your inquiry and we will get back to you.';
    }
  };

  const inquiryOptions = [
    'Do you ship internationally?',
    'Why are your prices so low?',
    'How do I track my order?',
    'How much is shipping?',
    'I have a different question',
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
        {showCustomQuestionInput ? (
          <form onSubmit={handleCustomQuestionSubmit} className="px-4 py-2 bg-gray-100 rounded-b-lg flex items-center">
            <input
              type="text"
              placeholder="Ask your question"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              className="flex-1 bg-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </form>
        ) : (
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
        )}
        <div className="px-4 py-2 bg-gray-100 rounded-b-lg flex justify-end">
          <a href="mailto:support@example.com" className="flex items-center text-blue-500 hover:text-blue-600">
            <Mail size={16} className="mr-2" />
            Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default ExpandableChatbot;