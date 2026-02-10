
import React, { useState, useMemo } from 'react';
import { Character, ViewState } from '../types';

interface SearchViewProps {
  characters: Character[];
  onOpenProfile: (char: Character) => void;
  setActiveView: (view: ViewState) => void;
}

export const VerifiedBadge = () => (
  <svg className="w-[14px] h-[14px] ml-1 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 5.26L19.44 5.9L19.44 10.33L22.27 13L19.44 15.67L19.44 20.1L15.09 20.74L12 24L8.91 20.74L4.56 20.1L4.56 15.67L1.73 13L4.56 10.33L4.56 5.9L8.91 5.26L12 2Z" fill="#0095F6"/>
    <path d="M10.5 15.5L6.5 11.5L7.91 10.09L10.5 12.67L16.09 7.08L17.5 8.5L10.5 15.5Z" fill="white"/>
  </svg>
);

const SearchView: React.FC<SearchViewProps> = ({ characters, onOpenProfile, setActiveView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 모든 캐릭터 핸들을 가나다 순으로 정렬하여 초기 리스트로 사용
  const allHandles = useMemo(() => {
    return [...characters]
      .sort((a, b) => a.nameKr.localeCompare(b.nameKr, 'ko'))
      .map(char => char.handle);
  }, [characters]);

  // '최근 검색' 리스트 초기값을 11명 전원 핸들로 설정
  const [recentSearches, setRecentSearches] = useState<string[]>(allHandles);

  // 검색 필터링
  const filteredCharacters = characters.filter(
    (char) =>
      char.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.nameKr.includes(searchQuery)
  );

  const handleClearRecent = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter((h) => h !== handle));
  };

  const handleSearchItemClick = (char: Character) => {
    onOpenProfile(char);
  };

  const renderCharacterItem = (char: Character, showRemove: boolean = false) => (
    <div key={char.id} className="relative group">
      <button
        onClick={() => handleSearchItemClick(char)}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full p-[1.5px] border border-gray-200 overflow-hidden">
            <img src={char.avatar} className="w-full h-full rounded-full object-cover" alt="" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-bold text-sm text-gray-900">{char.handle}</span>
              {char.isVerified && <VerifiedBadge />}
            </div>
            <span className="text-xs text-gray-500 font-normal">{char.nameKr}</span>
          </div>
        </div>
      </button>
      {showRemove && (
        <button 
          onClick={(e) => handleClearRecent(char.handle, e)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-2 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-[600px] mx-auto h-full flex flex-col pt-4 md:pt-8 bg-white">
      {/* Search Header */}
      <div className="px-4 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <button 
            onClick={() => setActiveView('home')}
            className="p-1 -ml-1 text-black hover:bg-gray-100 rounded-full transition-colors md:hidden"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold flex-1">검색</h2>
        </div>
        
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full bg-gray-100 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-gray-200 placeholder-gray-500 transition-all"
            placeholder="캐릭터 또는 닉네임 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20 no-scrollbar">
        {searchQuery.length === 0 ? (
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-bold text-base">최근 검색</h3>
                {recentSearches.length > 0 && (
                  <button 
                    onClick={() => setRecentSearches([])}
                    className="text-blue-500 text-sm font-semibold hover:text-blue-700 transition-colors"
                  >
                    전체 삭제
                  </button>
                )}
              </div>
              
              {recentSearches.length > 0 ? (
                <div className="space-y-1">
                  {recentSearches.map((handle) => {
                    const char = characters.find((c) => c.handle === handle);
                    if (!char) return null;
                    return renderCharacterItem(char, true);
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-gray-400 text-sm px-2">최근 검색 내역이 없습니다.</p>
                  <button 
                    onClick={() => setRecentSearches(allHandles)}
                    className="mt-4 text-blue-500 text-sm font-semibold"
                  >
                    전체 캐릭터 다시 불러오기
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCharacters.length > 0 ? (
              filteredCharacters.map((char) => renderCharacterItem(char, false))
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-500 font-medium">"{searchQuery}"에 대한 검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
