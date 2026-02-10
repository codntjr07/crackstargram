
import React from 'react';
import { Character, Post } from '../types';
import { VerifiedBadge } from './SearchView';

interface ProfileViewProps {
  character: Character;
  posts: Post[];
  onBack: () => void;
  onOpenChat: (char: Character) => void;
  onPostClick: (post: Post) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ character, posts, onBack, onOpenChat, onPostClick }) => {
  return (
    <div className="max-w-[935px] mx-auto pt-0 md:pt-4 bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="flex items-center px-4 py-2 border-b border-gray-100 sticky top-0 bg-white z-20 md:hidden">
        <button onClick={onBack} className="p-1 -ml-1 text-black">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 text-center pr-8">
          <span className="font-bold text-sm">{character.handle}</span>
        </div>
      </div>

      {/* Desktop Header Navigation */}
      <div className="hidden md:flex items-center px-4 py-3 mb-4">
        <button onClick={onBack} className="p-1 -ml-1 text-black hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Profile Header Area */}
      <div className="px-4 md:px-8 flex flex-col md:flex-row md:items-start md:space-x-12 mb-8">
        {/* Avatar */}
        <div className="flex justify-center md:justify-start mb-6 md:mb-0">
          <div className="w-20 h-20 md:w-36 md:h-36 rounded-full p-0.5 border border-gray-200 overflow-hidden">
            <img 
              src={character.avatar} 
              className={`w-full h-full rounded-full object-cover transform scale-110 origin-center ${character.id === 'char_5' ? 'object-top' : ''}`} 
              alt={character.name} 
            />
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-1 text-left">
          <div className="flex flex-col mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-3 mb-1">
              <div className="flex items-center">
                <h1 className="text-xl font-normal text-gray-900 md:text-2xl mr-1">{character.handle}</h1>
                {character.isVerified && <VerifiedBadge />}
              </div>
              <div className="flex space-x-2 mt-3 md:mt-0">
                <button className="bg-blue-500 text-white px-5 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex-1 md:flex-none">
                  팔로우
                </button>
                <button 
                  onClick={() => onOpenChat(character)}
                  className="bg-gray-100 text-black px-5 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex-1 md:flex-none"
                >
                  메시지 보내기
                </button>
              </div>
            </div>
            {/* 한국어 이름 작게 핸들 아래 배치 */}
            <span className="text-xs text-gray-500 md:text-sm font-medium tracking-tight mb-2">{character.nameKr}</span>
          </div>

          <div className="text-sm leading-relaxed text-gray-800 whitespace-pre-line mb-4 font-normal">
            {character.bio}
          </div>
          
          <div className="flex space-x-6 text-sm">
             <div>게시물 <span className="font-bold">{posts.length}</span></div>
             <div>팔로워 <span className="font-bold">{character.followers || '0'}</span></div>
             <div>팔로우 <span className="font-bold">{character.following || '0'}</span></div>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="border-t border-gray-200 flex justify-center space-x-12">
        <button className="flex items-center py-4 border-t border-black -mt-px text-xs uppercase tracking-widest font-semibold space-x-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>게시물</span>
        </button>
        <button className="flex items-center py-4 text-xs uppercase tracking-widest font-semibold space-x-2 text-gray-400">
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>저장됨</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-7 pb-10">
        {posts.map(post => (
          <div key={post.id} onClick={() => onPostClick(post)} className="aspect-square relative group cursor-pointer overflow-hidden bg-gray-100">
            <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
            {/* Hover Overlay showing both Likes and Comments (Instagram Style) */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 text-white space-x-8">
              <div className="flex items-center space-x-2 font-bold">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span className="text-lg">{post.likes > 1000 ? (post.likes/1000).toFixed(1) + 'k' : post.likes}</span>
              </div>
              <div className="flex items-center space-x-2 font-bold">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" />
                </svg>
                <span className="text-lg">{post.comments > 1000 ? (post.comments/1000).toFixed(1) + 'k' : post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileView;
