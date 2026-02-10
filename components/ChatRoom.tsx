
import React, { useState, useRef, useEffect } from 'react';
import { Character, Message } from '../types';
import { getGeminiResponse } from '../services/gemini';
import { VerifiedBadge } from './SearchView';

interface ChatRoomProps {
  character: Character;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (msg: Message) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ character, messages, onBack, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      text: inputText,
      timestamp: Date.now(),
      isAi: false
    };

    onSendMessage(userMsg);
    setInputText('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: (m.isAi ? 'model' : 'user') as 'model' | 'user',
        text: m.text
      }));
      
      const aiText = await getGeminiResponse(character.systemPrompt, history, inputText);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: character.id,
        text: aiText || "미안, 지금 좀 정신이 없네.",
        timestamp: Date.now(),
        isAi: true
      };
      onSendMessage(aiMsg);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: character.id,
        text: "연결이 좀 불안정한 것 같아. 나중에 다시 얘기할까?",
        timestamp: Date.now(),
        isAi: true
      };
      onSendMessage(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-[800px] mx-auto border-x border-gray-100">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img src={character.avatar} alt={character.name} className="w-9 h-9 rounded-full border border-gray-100 object-cover" />
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="font-bold text-sm leading-tight">{character.handle}</p>
              {character.isVerified && <VerifiedBadge />}
            </div>
            <p className="text-[10px] text-gray-500 font-normal">{character.nameKr}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="text-gray-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
             </svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <img src={character.avatar} alt="" className="w-24 h-24 rounded-full mb-4 object-cover" />
            <div className="flex items-center">
               <h3 className="text-lg font-bold">{character.handle}</h3>
               {character.isVerified && <VerifiedBadge />}
            </div>
            <p className="text-sm">{character.nameKr}</p>
            <p className="text-xs mt-4 text-center px-10">이 대화의 시작입니다.</p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.isAi ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
              m.isAi 
                ? 'bg-gray-100 text-black rounded-bl-none' 
                : 'bg-blue-500 text-white rounded-br-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 p-3 rounded-2xl rounded-bl-none text-sm animate-pulse">
              입력 중...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 bg-gray-50">
          <input 
            type="text" 
            placeholder="메시지 보내기..."
            className="flex-1 bg-transparent border-none outline-none text-sm py-1 text-black"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className={`ml-3 font-semibold text-sm ${
              inputText.trim() ? 'text-blue-500' : 'text-blue-300'
            }`}
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
