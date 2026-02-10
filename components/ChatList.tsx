
import React from 'react';
import { Character, Message } from '../types';

interface ChatListProps {
  characters: Character[];
  onSelect: (char: Character) => void;
  lastMessages: Record<string, Message[]>;
}

const ChatList: React.FC<ChatListProps> = ({ characters, onSelect, lastMessages }) => {
  return (
    <div className="max-w-[800px] mx-auto h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold">Messages</h2>
        <button className="text-blue-500 font-semibold text-sm">Requests</button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {characters.map((char) => {
          const history = lastMessages[char.id] || [];
          const lastMsg = history[history.length - 1];
          
          return (
            <button
              key={char.id}
              onClick={() => onSelect(char)}
              className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <img src={char.avatar} alt={char.name} className="w-14 h-14 rounded-full" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">{char.name}</p>
                <p className={`text-sm ${lastMsg ? 'text-gray-500' : 'text-blue-500 font-medium'}`}>
                  {lastMsg ? (
                    <span className="truncate block max-w-[200px]">{lastMsg.text}</span>
                  ) : (
                    `Say hi to ${char.handle}!`
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
