
import React, { useState, useEffect } from 'react';
import { ViewState, Character, Message, Post, Comment } from './types';
import { CHARACTERS, IMAGE_POOL, CAPTIONS } from './constants';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import ChatRoom from './components/ChatRoom';
import BottomNav from './components/BottomNav';
import SearchView from './components/SearchView';
import ProfileView from './components/ProfileView';
import PostDetail from './components/PostDetail';

const AVATAR_COLORS = [
  'from-pink-400 to-rose-500', 'from-blue-400 to-indigo-500', 'from-yellow-400 to-orange-500', 
  'from-green-400 to-teal-500', 'from-purple-400 to-fuchsia-500', 'from-gray-400 to-slate-500'
];

const COMMENT_POOLS = {
  visual: [
    "언니 비주얼 실화야? 💙", "진짜 너무 예쁘다...", "QUEEN 👑", "오늘도 미모 열일 중", "이게 사람이야 인형이야", "Perfect as always", "심장 멎을 뻔..", "분위기 미쳤다", "공주님 그 자체 💖", "레전드 경신중", "비주얼 공격 무엇...", "갓벽하다 진짜", "매일이 리즈네", "너무 눈부셔요 ✨", "Absolute masterpiece", "Gorgeous is an understatement", "You are the moment", "천상계 비주얼", "보고 또 봐도 예뻐", "질리지 않는 미모"
  ],
  trainee: [
    "언니 연습 화이팅해요!", "항상 응원하고 있어요", "노력은 배신하지 않아요!", "오늘도 연습 고생했어요", "꿈을 향해 달려가는 모습 최고!", "언제나 백도연 편!", "화이팅 도연아!", "차근차근 잘 가고 있어요", "응원합니다 정말루", "위신트 에이스 백도연 화이팅!", "위신트에서 꼭 데뷔해줘요 ㅠㅠ", "wescent new girl group center visual", "위신트 보석함 그 자체..."
  ],
  athlete: [
    "국가대표급 포스 ㄷㄷ", "진짜 멋있어요 언니", "관리 끝판왕", "수영하는 모습 보고 싶다", "진짜 인어공주 같아", "운동하는 여자는 아름답다", "오늘도 훈련 고생했어!", "건강미 넘쳐요", "역시 프로는 다르네", "인간 수달이다 🌊", "항상 응원해요", "자기관리 대박", "물속에서 제일 예쁜듯"
  ],
  fashion: [
    "언니 오늘 착장 정보좀요!! 😍", "언니 손민수 하고 싶어", "언니 오늘 메이크업 찰떡", "옷이 언니 빨 받네", "완판 예감 ㄷㄷ", "언니가 입으니까 다 예뻐", "진정한 패셔니스타", "스타일링 대박", "가방 어디꺼에요?", "모델 포스 대박이다"
  ],
  pd_life: [
    "PD님 편집 화이팅...", "방송국 놈들(?) 화이팅입니다 ㅋㅋ", "이번 프로그램 기대할게요!", "야근 요정 ㅠㅠ 힘내세요", "상암동 맛집 공유 좀...", "편집실 탈출 기원 🙏", "막내 PD의 삶이란...", "오늘도 밤새시나요? ㅠㅠ", "커피 수혈 필수 ☕️", "건강 챙기면서 일해요!!"
  ],
  acting: [
    "분위기 여배우 재질 ✨", "차기작 기다리고 있어요!", "오디션 꼭 붙을 거예요", "눈빛이 너무 좋아요", "배우님 화이팅!", "감성 사진 너무 좋다...", "스크린에서 보고 싶어요", "응원할게요 리온님!"
  ],
  music: [
    "목소리 진짜 보물 🎵", "버스킹 언제 또 해요?", "어제 홍대에서 봤어요!", "노래 너무 잘해요 ㅠㅠ", "신청곡 받아주시나요?", "음색 깡패...", "다음 공연 일정 알려주세요!", "라이브 영상 더 올려줘요!"
  ],
  uni_life: [
    "언니 학교에서 봤어요! 대박..", "과탑 포스 ㄷㄷ", "공부도 잘하고 얼굴도 예쁘고", "학교의 자랑이다 진짜", "카페 알바 고생 많아요!", "오늘 수업 들으러 가시나요?", "신촌 여신이다.."
  ],
  chic_cool: [
    "언니 시크함 무엇.. 🖤", "홍대에서 본 적 있어요! 포스 대박", "진짜 독보적인 분위기", "무심한듯 힙한게 언니 매력", "입덕 부정기 끝내고 입덕함", "이 분위기 따라할 수가 없다"
  ],
  daily: [
    "오늘도 고생했어 언니!", "You deserve all the love", "My happiness", "언니 보고 힐링 중", "Daily dose of beauty", "좋은 하루 보내세요", "항상 곁에 있을게", "Love you unnie!!", "맛있는거 많이 먹어요!", "언니 최고다 진짜"
  ]
};

// Helper to convert follower string to number for internal calculations
const parseFollowerCount = (f?: string): number => {
  if (!f) return 100;
  let num = parseFloat(f.replace(/[^0-9.]/g, ''));
  if (f.includes('k')) num *= 1000;
  else if (f.includes('만')) num *= 10000;
  return num;
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [previousView, setPreviousView] = useState<ViewState>('home');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    generateInitialPosts();
  }, []);

  const createComment = (handle: string, text: string, time: string): Comment => ({
    id: `c_${Math.random().toString(36).substr(2, 9)}`,
    handle,
    text,
    timestamp: time,
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
  });

  const getContextualComments = (charId: string, caption: string): Comment[] => {
    let pool: string[] = [...COMMENT_POOLS.visual, ...COMMENT_POOLS.daily];
    
    if (charId === 'char_7') pool = [...pool, ...COMMENT_POOLS.trainee];
    if (charId === 'char_11') pool = [...pool, ...COMMENT_POOLS.athlete, ...COMMENT_POOLS.fashion];
    if (['char_5', 'char_9'].includes(charId)) pool = [...pool, ...COMMENT_POOLS.fashion];
    if (charId === 'char_12') pool = [...pool, ...COMMENT_POOLS.pd_life];
    if (charId === 'char_13') pool = [...pool, ...COMMENT_POOLS.acting];
    if (charId === 'char_14') pool = [...pool, ...COMMENT_POOLS.music];
    if (['char_6', 'char_15'].includes(charId)) pool = [...pool, ...COMMENT_POOLS.uni_life];
    if (charId === 'char_8') pool = [...pool, ...COMMENT_POOLS.chic_cool];

    if (charId !== 'char_7') {
      pool = pool.filter(msg => 
        !msg.includes('춤선') && !msg.includes('무대') && !msg.includes('아이돌') && 
        !msg.includes('연습생') && !msg.includes('데뷔') && !msg.includes('Dancer')
      );
    }
    
    if (charId === 'char_12') {
       pool = pool.filter(msg => 
        !msg.includes('노래') && !msg.includes('음색') && !msg.includes('버스킹') && 
        !msg.includes('공연') && !msg.includes('신청곡')
      );
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 10) + 20; 
    return shuffled.slice(0, count).map(text => 
      createComment(`user_${Math.floor(Math.random()*9999)}`, text, `${Math.floor(Math.random()*12)+1}시간`)
    );
  };

  const generateInitialPosts = () => {
    const newPosts: Post[] = [];
    const now = Date.now();

    const curatedContent: Record<string, { img: string, cap: string }[]> = {
      'char_5': [
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/sy_waflle.png', cap: '❤️ #와플 #카페 #일상' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/sy_model1.png', cap: '시크한척... #피팅모델 #일 #촬영' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/sy_model2.png', cap: '일은...좋아... #피팅모델 #일 #촬영' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/sy_home.png', cap: '냥냥~ #셀카 #피팅모델 #고양이' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/sy_gym.png', cap: '관리하는 척... #피팅모델 #운동' }
      ],
      'char_9': [
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/sb_movie.png', cap: '친구가 몰래찍음. 한참 놀렸음...💧 #데이트 #영화 #눈물' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/sb_work1.png', cap: '#일 #옷가게 #동대문 #나보러와 👗' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/sb_work2.png', cap: '신상 오픈! 동대문으로 구경오세요~ #일 #옷가게 #동대문' }
      ],
      'char_11': [
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/cl_swim.png', cap: '연습 연습 연습 🌊 #수영 #선수 #컨셉샷' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/cl_swim2.png', cap: '인어공주...라고 하면 웃을거야...? #수영선수 #연습' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/cl_fall.png', cap: '넘어졌는데 찍음 💢 #굴욕샷' }
      ],
      'char_6': [
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/hr_motorcycle.png', cap: '스트레스 풀리는 라이딩 🏍️💨' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/hr_sea.png', cap: '바다 보니까 마음이 편해진다 🌊💙' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/hr_selfie.png', cap: '오랜만에 셀카 ✨' }
      ],
      'char_7': [
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/bdy_dance.png', cap: '오늘도 연습 완료 💃🔥' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/bdy_recording.png', cap: '녹음 중... 🎤🎧' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/bdy_school.png', cap: '친구가 찍어줬어...! #한림 #셀카' }
      ],
      'char_8': [
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/ian_club.png', cap: '#클럽 #홍대 #바이브' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/ian_wall.png', cap: '#홍대 #데일리룩' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/ian_liquor.png', cap: 'Cheers 🍺' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/ian_selfie.png', cap: '뭘 봐. #홍대 #셀피' }
      ],
      'char_12': [
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/so_coffee.png', cap: '출근 완료... ☕️ 아아 없으면 시체임. 오늘도 상암동의 평화를 지키러 갑니다 총총. #PD라이프 #상암 #출근 #직장인스타그램' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/so_lunch.png', cap: '오늘 점심은 카레! 🍛 줄 서서 먹는 맛집이라길래 와봤는데 대박... 오후 편집 버틸 힘 충전 완료 🔥 #상암맛집 #점심 #맛점 #카레' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/so_tired.png', cap: '아직도 편집실... 🖥️ 렌더링 걸어놓고 멍때리는 중. 집에 가고 싶어요... 🥺 살려주세요... #야근 #편집 #방송국 #막내의삶' }
      ],
      'char_13': [
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/ro_home.png', cap: '오늘 하루도 끝... 🌙 다들 좋은 꿈 꿔요. #굿밤 #잠옷 #집순이' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/ro_profile.png', cap: '새 프로필 사진 나왔어요! 📸 어때요...? 아직은 어색하지만... 열심히 하겠습니다! 🤍 #배우프로필 #촬영 #신인배우 #강리온' }
      ],
      'char_14': [
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/2dy_busking.png', cap: '오늘도 노래할 수 있어서 행복했다! 🎤 홍대 9번 출구 앞, 다들 즐거우셨나요? 다음엔 신청곡도 받을게요! 🎶✨ #홍대버스킹 #노래 #꿈 #C_yeon2' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/2dy_home.png', cap: '집이 최고야... 🏠💤 씻고 누우니까 세상 행복함. 오늘 하루도 알찼다! 다들 굿밤 🌙 #방전 #집순이모드 #셀카' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/2dy_subway.png', cap: '어디 가는 길이게? 🚇🎵 이어폰 필수템. 오늘 플레이리스트는 비밀! 🤫 #이동중 #지하철 #데일리룩' }
      ],
      'char_15': [
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/yj_partime.png', cap: '오늘도 카페 알바 중... ☕️ 손님이 많아서 정신없지만 힘내볼게요! #알바 #카페 #신촌' },
        { img: 'https://raw.githubusercontent.com/codntjr07/b/refs/heads/main/yj_study.png', cap: '시험기간... 도서관은 내 운명 📚 조용한 이 분위기가 좋아요. #공부 #이대도서관 #열공' }
      ]
    };

    CHARACTERS.forEach(char => {
      const charCurated = curatedContent[char.id];
      const followerCount = parseFollowerCount(char.followers);
      
      if (charCurated) {
        charCurated.forEach((item, i) => {
          const postComments = getContextualComments(char.id, item.cap);
          // Likes: 5% ~ 15% of follower count (realistic engagement)
          const likeRatio = 0.05 + Math.random() * 0.10;
          const calculatedLikes = Math.floor(followerCount * likeRatio);
          
          newPosts.push({
            id: `p_${char.id}_${i}`,
            characterId: char.id,
            imageUrl: item.img,
            caption: item.cap,
            likes: Math.max(Math.floor(Math.random() * 50) + 10, calculatedLikes), // Min 10 likes for very low counts
            comments: postComments.length,
            timestamp: `${i + 1}시간`,
            createdAt: now - (i * 3600000 + Math.random() * 1000000),
            mockComments: postComments
          });
        });
      }

      const existingCount = newPosts.filter(p => p.characterId === char.id).length;
      if (char.id !== 'char_13' && char.id !== 'char_15' && existingCount < 3) {
        for (let i = 0; i < (3 - existingCount); i++) {
          const cap = CAPTIONS[(existingCount + i) % CAPTIONS.length];
          const postComments = getContextualComments(char.id, cap);
          const likeRatio = 0.04 + Math.random() * 0.08;
          const calculatedLikes = Math.floor(followerCount * likeRatio);

          newPosts.push({
            id: `p_extra_${char.id}_${i}`,
            characterId: char.id,
            imageUrl: IMAGE_POOL[(existingCount + i) % IMAGE_POOL.length],
            caption: cap,
            likes: Math.max(Math.floor(Math.random() * 30) + 5, calculatedLikes),
            comments: postComments.length,
            timestamp: `${i + 3}일`,
            createdAt: now - ((existingCount + i + 10) * 86400000),
            mockComments: postComments
          });
        }
      }
    });

    setAllPosts(newPosts.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleOpenProfile = (char: Character) => {
    setPreviousView(activeView);
    setSelectedCharacter(char);
    setActiveView('profile');
  };

  const handleOpenChat = (char: Character) => {
    setPreviousView(activeView);
    setSelectedCharacter(char);
    setActiveView('chat');
  };

  const handleBackToView = () => {
    setActiveView(previousView);
  };

  const addMessage = (charId: string, message: Message) => {
    setChatHistories(prev => ({
      ...prev,
      [charId]: [...(prev[charId] || []), message]
    }));
  };

  const switchView = (view: ViewState) => {
    setPreviousView(activeView);
    setActiveView(view);
  };

  const getCurrentPostList = () => {
    if (selectedCharacter) {
       return allPosts.filter(p => p.characterId === selectedCharacter.id);
    }
    return allPosts;
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-white overflow-hidden text-black relative">
      <div className="hidden md:block w-20 lg:w-64 border-r border-gray-200">
        <Sidebar activeView={activeView} setActiveView={switchView} />
      </div>
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative no-scrollbar">
        {activeView === 'home' && (
          <Feed 
            posts={allPosts} 
            characters={CHARACTERS} 
            onOpenProfile={handleOpenProfile}
            onPostClick={(post) => setSelectedPost(post)}
            onRefresh={generateInitialPosts}
          />
        )}
        {activeView === 'search' && (
          <SearchView characters={CHARACTERS} onOpenProfile={handleOpenProfile} setActiveView={switchView} />
        )}
        {activeView === 'profile' && selectedCharacter && (
          <ProfileView
            character={selectedCharacter}
            posts={allPosts.filter(p => p.characterId === selectedCharacter.id)}
            onBack={handleBackToView}
            onOpenChat={handleOpenChat}
            onPostClick={(post) => setSelectedPost(post)}
          />
        )}
        {activeView === 'chat' && selectedCharacter && (
          <ChatRoom 
            character={selectedCharacter} 
            messages={chatHistories[selectedCharacter.id] || []}
            onBack={handleBackToView}
            onSendMessage={(msg) => addMessage(selectedCharacter.id, msg)}
          />
        )}
        {selectedPost && (
          <PostDetail 
            initialPost={selectedPost} 
            contextPosts={getCurrentPostList()}
            character={CHARACTERS.find(c => c.id === selectedPost.characterId)!}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60]">
        <BottomNav activeView={activeView} setActiveView={switchView} />
      </div>
    </div>
  );
};

export default App;
