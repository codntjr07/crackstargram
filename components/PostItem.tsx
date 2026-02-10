
import React, { useState } from 'react';
import { Post, Character } from '../types';
import { VerifiedBadge } from './SearchView';

interface PostItemProps {
  post: Post;
  character: Character;
  onOpenProfile: (char: Character) => void;
  onPostClick?: (post: Post) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, character, onOpenProfile, onPostClick }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Helper to maintain consistent image framing across feed and detail
  const getImageStyle = (url: string): React.CSSProperties => {
    if (url.includes('2dy_busking.png')) {
      return { objectPosition: 'center 10%' }; // Adjusted to move image down and show more of the face
    }
    if (url.includes('sy_model1.png')) {
      return { objectPosition: 'top' };
    }
    if (url.includes('sy_home.png')) {
      return { objectPosition: 'center 60%' };
    }
    return { objectPosition: 'center' };
  };

  return (
    <article className="bg-white md:border md:border-gray-200 md:rounded-lg overflow-hidden transition-all duration-200 mb-4">
      {/* Header - Clicking here goes to Profile */}
      <div className="flex items-center justify-between p-3">
        <button 
          onClick={() => onOpenProfile(character)}
          className="flex items-center space-x-3 text-left hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
            <img src={character.avatar} alt={character.handle} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center">
              <span className="font-bold text-sm leading-tight text-gray-900">{character.handle}</span>
              {character.isVerified && <VerifiedBadge />}
            </div>
            <span className="text-gray-500 text-[11px] font-normal leading-tight">{character.nameKr}</span>
          </div>
        </button>
        <button className="text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors">
           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
             <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
           </svg>
        </button>
      </div>

      {/* Media - Clicking here toggles Zoom effect only */}
      <div 
        className="aspect-square bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden relative"
        onClick={() => setIsZoomed(true)}
      >
        <img 
          src={post.imageUrl} 
          alt="Post content" 
          style={getImageStyle(post.imageUrl)}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]" 
        />
      </div>

      {/* Interaction Section */}
      <div className="p-3 text-left">
        {/* Row 1: Interaction Buttons */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button className="hover:opacity-60 transition-opacity">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button 
              onClick={() => onPostClick?.(post)}
              className="hover:opacity-60 transition-opacity"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button className="hover:opacity-60 transition-opacity">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          <button className="hover:opacity-60 transition-opacity">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
             </svg>
          </button>
        </div>
        
        {/* Row 2: Likes */}
        <div className="text-sm font-bold mb-1.5">좋아요 {post.likes.toLocaleString()}개</div>
        
        {/* Row 3: Caption (Handle + Text/Tags) */}
        <div className="text-sm leading-tight mb-1.5">
          <span className="font-bold mr-2 text-gray-900">{character.handle}</span>
          <span className="text-gray-800 whitespace-pre-wrap">{post.caption}</span>
        </div>

        {/* Row 4: View comments button - Goes to PostDetail */}
        {post.comments > 0 && (
          <button 
            onClick={() => onPostClick?.(post)}
            className="text-gray-500 text-sm mb-1.5 block hover:opacity-70 transition-opacity"
          >
            댓글 {post.comments}개 모두 보기
          </button>
        )}

        {/* Row 5: Timestamp */}
        <div className="text-[10px] text-gray-400 uppercase tracking-tight font-medium">
          {post.timestamp}{post.timestamp === '방금' ? '' : ' 전'}
        </div>
      </div>

      {/* Zoom Lightbox Overlay */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <img 
            src={post.imageUrl} 
            alt="Zoomed" 
            style={getImageStyle(post.imageUrl)}
            className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-300"
          />
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </article>
  );
};

export default PostItem;
