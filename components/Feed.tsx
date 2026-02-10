
import React from 'react';
import { Post, Character } from '../types';
import PostItem from './PostItem';

interface FeedProps {
  posts: Post[];
  characters: Character[];
  onOpenProfile: (char: Character) => void;
  onPostClick: (post: Post) => void;
  onRefresh?: () => void;
}

const Feed: React.FC<FeedProps> = ({ posts, characters, onOpenProfile, onPostClick, onRefresh }) => {
  return (
    <div className="max-w-[470px] lg:max-w-[630px] mx-auto pt-0 md:pt-8 pb-4">
      {/* Header for mobile */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tighter">crack</h1>
          <svg className="w-5 h-5 ml-0.5 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <div className="flex space-x-4">
           <button onClick={onRefresh} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
           </button>
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
           </svg>
        </div>
      </div>

      {/* Desktop Top Header (Hidden on Mobile) */}
      <div className="hidden md:flex justify-between items-center px-4 mb-6">
        <h2 className="text-lg font-bold">Feed</h2>
        <button onClick={onRefresh} className="text-blue-500 text-sm font-semibold hover:underline">
          Refresh Feed
        </button>
      </div>

      <div className="mt-0 md:mt-4 space-y-4 md:space-y-6">
        {posts.map((post) => {
          const char = characters.find(c => c.id === post.characterId);
          if (!char) return null;
          return (
            <PostItem 
              key={post.id} 
              post={post} 
              character={char} 
              onOpenProfile={onOpenProfile}
              onPostClick={onPostClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Feed;
