
import React, { useRef, useState, useEffect } from 'react';
import { Post, Character, Comment } from '../types';
import { VerifiedBadge } from './SearchView';

interface PostDetailProps {
  initialPost: Post;
  contextPosts: Post[];
  character: Character;
  onClose: () => void;
}

// Separate component for Comments Modal on Mobile
const CommentsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  characterHandle: string;
}> = ({ isOpen, onClose, comments, characterHandle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-end justify-center animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-[500px] h-[75vh] rounded-t-2xl flex flex-col slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="w-10" />
          <span className="font-bold text-sm">댓글</span>
          <button onClick={onClose} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 items-start text-left">
              <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
                <div className={`w-full h-full bg-gradient-to-tr ${comment.avatarColor}`}></div>
              </div>
              <div className="text-sm flex flex-col flex-1">
                <div className="flex items-center space-x-1">
                  <span className="font-bold leading-tight">{comment.handle}</span>
                  <span className="text-[11px] text-gray-400">{comment.timestamp} 전</span>
                </div>
                <span className="mt-1 leading-tight text-gray-800">{comment.text}</span>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="py-10 text-center text-gray-400 text-sm">아직 댓글이 없습니다.</div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center space-x-3 bg-white pb-8">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0"></div>
          <input 
            type="text" 
            placeholder={`${characterHandle}님에게 댓글 달기...`} 
            className="flex-1 text-sm border-none outline-none focus:ring-0 bg-transparent text-left"
          />
          <button className="text-blue-500 font-bold text-sm">게시</button>
        </div>
      </div>
    </div>
  );
};

const PostDetail: React.FC<PostDetailProps> = ({ 
  initialPost, 
  contextPosts,
  character, 
  onClose
}) => {
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeComments, setActiveComments] = useState<{ isOpen: boolean, comments: Comment[] }>({ 
    isOpen: false, 
    comments: initialPost.mockComments || [] 
  });

  // Mobile: Scroll to initial post on load and potentially open comments
  useEffect(() => {
    const scrollToTarget = () => {
      if (containerRef.current && window.innerWidth < 768) {
        const initialEl = document.getElementById(`mobile-post-${initialPost.id}`);
        if (initialEl) {
          initialEl.scrollIntoView({ block: 'start', behavior: 'auto' });
        }
      }
    };

    // Use requestAnimationFrame to ensure the DOM has updated before scrolling
    const rafId = requestAnimationFrame(() => {
      scrollToTarget();
      // Auto-open comments on mobile if coming from a specific post click
      // (This approximates the "comment button" behavior)
      if (window.innerWidth < 768) {
        setActiveComments({ isOpen: true, comments: initialPost.mockComments || [] });
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [initialPost.id, initialPost.mockComments]);

  const getImageStyle = (url: string): React.CSSProperties => {
    if (url.includes('2dy_busking.png')) {
      return { objectPosition: 'center 10%' };
    }
    if (url.includes('sy_model1.png')) {
      return { objectPosition: 'top' };
    }
    if (url.includes('sy_home.png')) {
      return { objectPosition: 'center 60%' };
    }
    return { objectPosition: 'center' };
  };

  const openMobileComments = (comments: Comment[]) => {
    setActiveComments({ isOpen: true, comments });
  };

  const handleCommentClick = () => {
    if (window.innerWidth < 768) {
      openMobileComments(initialPost.mockComments || []);
    } else {
      desktopInputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-0 md:p-10 overflow-hidden" onClick={onClose}>
      
      {/* Detail Container */}
      <div 
        className="bg-white w-full max-w-[1100px] h-[100dvh] md:h-auto md:max-h-[850px] md:rounded-lg overflow-hidden flex flex-col md:flex-row relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Header (Sticky) */}
        <div className="md:hidden p-3 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-50 shrink-0">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="mr-1 text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
              <img src={character.avatar} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center">
                <span className="font-bold text-sm leading-tight tracking-tight text-gray-900">{character.handle}</span>
                {character.isVerified && <VerifiedBadge />}
              </div>
              <span className="text-[11px] text-gray-500 font-medium">게시물</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar bg-white scroll-smooth">
          
          {/* MOBILE VIEW: Continuous Feed */}
          <div className="md:hidden">
            {contextPosts.map((p) => (
              <div 
                key={p.id} 
                id={`mobile-post-${p.id}`} 
                className="border-b border-gray-100 mb-6 scroll-mt-14"
              >
                {/* Post Header in Scroll View */}
                <div className="flex items-center p-3 space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                    <img src={character.avatar} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-sm text-gray-900">{character.handle}</span>
                    {character.isVerified && <VerifiedBadge />}
                  </div>
                </div>

                {/* Image (65vh crop) */}
                <div className="w-full h-[65vh] bg-gray-50 overflow-hidden">
                  <img 
                    src={p.imageUrl} 
                    style={getImageStyle(p.imageUrl)}
                    className="w-full h-full object-cover" 
                    alt="" 
                  />
                </div>

                {/* Actions & Caption */}
                <div className="p-3 text-left">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <button className="hover:opacity-60 transition-opacity">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => openMobileComments(p.mockComments || [])} 
                        className="hover:opacity-60 transition-opacity"
                      >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                    </div>
                    <button className="hover:opacity-60 transition-opacity">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-sm font-bold mb-1.5">좋아요 {p.likes.toLocaleString()}개</div>
                  <div className="text-sm">
                    <span className="font-bold mr-2 text-gray-900">{character.handle}</span>
                    <span className="text-gray-800">{p.caption}</span>
                  </div>
                  {p.comments > 0 && (
                    <button 
                      onClick={() => openMobileComments(p.mockComments || [])}
                      className="text-gray-500 text-sm mt-1 block"
                    >
                      댓글 {p.comments}개 모두 보기
                    </button>
                  )}
                  <div className="text-[10px] text-gray-400 uppercase tracking-tight font-medium mt-1">
                    {p.timestamp} 전
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Split Layout */}
          <div className="hidden md:flex h-full">
            <div className="flex-1 bg-gray-100 flex items-center justify-center relative overflow-hidden h-full">
              <img 
                src={initialPost.imageUrl} 
                style={getImageStyle(initialPost.imageUrl)}
                className="w-full h-full object-cover" 
                alt="Post" 
              />
            </div>

            <div className="w-[400px] flex flex-col bg-white border-l border-gray-100 h-full relative shrink-0">
              {/* Desktop Header */}
              <div className="flex p-4 border-b border-gray-100 items-center justify-between bg-white shrink-0 z-30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                    <img src={character.avatar} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-sm text-gray-900 mr-1">{character.handle}</span>
                    {character.isVerified && <VerifiedBadge />}
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-gray-900 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content (Caption + Comments) */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="px-4 py-4 text-left">
                  <div className="text-sm flex flex-col">
                    <div className="flex items-center">
                      <span className="font-bold leading-tight mr-1 text-black">{character.handle}</span>
                      <VerifiedBadge />
                    </div>
                    <span className="whitespace-pre-wrap leading-tight mt-2 text-gray-900">{initialPost.caption}</span>
                    <div className="mt-3 text-[11px] text-gray-400 font-normal">{initialPost.timestamp} 전</div>
                  </div>
                </div>
                <div className="px-4"><div className="border-b border-gray-100"></div></div>
                <div className="p-4 space-y-5 text-left">
                  {initialPost.mockComments?.map((comment) => (
                    <div key={comment.id} className="flex space-x-3 items-start">
                      <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
                        <div className={`w-full h-full bg-gradient-to-tr ${comment.avatarColor}`}></div>
                      </div>
                      <div className="text-sm flex flex-col">
                        <span className="font-bold leading-tight">{comment.handle}</span>
                        <span className="mt-1 leading-tight text-gray-800">{comment.text}</span>
                        <div className="mt-1 text-[11px] text-gray-400">{comment.timestamp} 전</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sticky Actions & Input */}
              <div className="sticky bottom-0 bg-white z-20 border-t border-gray-100">
                 <div className="p-3 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <button className="hover:opacity-60 transition-opacity">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button onClick={handleCommentClick} className="hover:opacity-60 transition-opacity">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      </div>
                      <button className="hover:opacity-60 transition-opacity">
                         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                         </svg>
                      </button>
                    </div>
                    <div className="text-sm font-bold mb-1">좋아요 {initialPost.likes.toLocaleString()}개</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-tight font-medium">{initialPost.timestamp} 전</div>
                 </div>
                 <div className="p-3 border-t border-gray-100 flex items-center space-x-3 bg-white pb-6">
                    <input 
                      ref={desktopInputRef}
                      type="text" 
                      placeholder="댓글 달기..." 
                      className="flex-1 text-sm border-none outline-none focus:ring-0 bg-transparent text-left"
                    />
                    <button className="text-blue-500 font-bold text-sm">게시</button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Only Comments Modal */}
      <CommentsModal 
        isOpen={activeComments.isOpen} 
        onClose={() => setActiveComments({ ...activeComments, isOpen: false })}
        comments={activeComments.comments}
        characterHandle={character.handle}
      />
    </div>
  );
};

export default PostDetail;
