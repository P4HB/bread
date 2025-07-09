import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY = "community_posts";

let postData = [
  {
    id: '1',
    title: '오늘의 빵 메뉴 추천!',
    writer: '크림치즈덕후',
    profileImage: [require('../../assets/profileimage/pig_1.png')], // 경로 수정
    content: '요즘 핫한 소금빵 맛집 아시는 분? 🥐 겉바속촉 제대로 된 곳 찾아요!',
    images: [require('../../assets/walking_pig.png')],
    likes: 25,
    comments: [
      { id: 'c1', writer: '단팥빵러버', content: '저희 동네 \'빵굽는 사람들\' 소금빵 진짜 맛있어요!', profileImage: require('../../assets/profileimage/pig_2.png') }, // 경로 수정
      { id: 'c2', writer: '식빵공주', content: '저는 \'블랑제리\' 소금빵이 인생 소금빵이었어요!', profileImage: require('../../assets/profileimage/pig_3.png') }, // 경로 수정
    ],
  },
  {
    id: '2',
    title: '새로운 빵집 발견했어요!',
    writer: '에그타르트킹',
    profileImage: require('../../assets/profileimage/pig_4.png'), // 경로 수정
    content: '신상 빵집 \'오븐의 마법사\' 다녀왔는데, 에그타르트가 예술이에요! 겉은 바삭 속은 촉촉 ㅠㅠ',
    images: [require('../../assets/galleryimage/bread_gallery10.png')],
    likes: 40,
    comments: [
      { id: 'c3', writer: '딸기케이크장인', content: '와 비주얼 대박이네요! 당장 가봐야겠어요!', profileImage: require('../../assets/profileimage/pig_5.png') }, // 경로 수정
      { id: 'c4', writer: '앙버터성애자', content: '에그타르트 맛집이라니 메모합니다📝', profileImage: require('../../assets/profileimage/pig_6.png') }, // 경로 수정
    ],
  },
  {
    id: '3',
    title: '빵 보관 꿀팁 공유해요!',
    writer: '바게트장인',
    profileImage: require('../../assets/profileimage/pig_7.png'), // 경로 수정
    content: '바게트 냉동 보관 어떻게 하시나요? 해동해도 갓 구운 맛 내는 법 아시면 알려주세요!',
    images: [],
    likes: 10,
    comments: [
      { id: 'c5', writer: '카스테라요정', content: '저는 키친타월로 감싸서 냉동해요! 해동할 땐 물 살짝 뿌리고 에프 돌리면 최고!', profileImage: require('../../assets/profileimage/pig_8.png') }, // 경로 수정
      { id: 'c6', writer: '페스츄리여왕', content: '김치냉장고에 보관하면 좀 더 촉촉하더라고요!', profileImage: require('../../assets/profileimage/pig_9.png') }, // 경로 수정
    ],
  },
  {
    id: '4',
    title: '추천 베이커리 카페',
    writer: '슈크림매니아',
    profileImage: require('../../assets/profileimage/pig_1.png'), // 재사용
    content: '분위기 좋은 빵집 카페 찾고 있어요. 작업하기 좋고 빵 종류 많은 곳으로요!',
    images: [require('../../assets/galleryimage/bread_gallery1.png'), require('../../assets/galleryimage/bread_gallery5.png')],
    likes: 55,
    comments: [
      { id: 'c7', writer: '생크림킬러', content: '\'빵의 정원\' 추천해요! 좌석도 편하고 빵 종류도 엄청 많아요!', profileImage: require('../../assets/profileimage/pig_2.png') }, // 재사용
      { id: 'c8', writer: '맘모스빵매니아', content: '\'도우앤빈\' 가보셨나요? 커피랑 빵 다 맛있어요!', profileImage: require('../../assets/profileimage/pig_3.png') }, // 재사용
      { id: 'c9', writer: '소보로공주', content: '조용하고 작업하기 좋은 곳은 \'디어브레드\' 좋아요!', profileImage: require('../../assets/profileimage/pig_4.png') }, // 재사용
    ],
  },
  {
    id: '5',
    title: '오늘의 빵 flex 🍞',
    writer: '크루아상홀릭',
    profileImage: require('../../assets/profileimage/pig_5.png'), // 재사용
    content: '퇴근길에 갓 구운 크루아상 사왔어요! 버터 향이 장난 아니네요 🧈',
    images: [require('../../assets/galleryimage/bread_gallery3.png')],
    likes: 33,
    comments: [
      { id: 'c10', writer: '마카롱여신', content: '아 부러워요! 저도 얼른 퇴근해서 빵 먹고 싶네요 😋', profileImage: require('../../assets/profileimage/pig_6.png') }, // 재사용
      { id: 'c11', writer: '스콘사랑', content: '밤에 빵 사진은 반칙 아닌가요?! 🤤', profileImage: require('../../assets/profileimage/pig_7.png') }, // 재사용
    ],
  },
  {
    id: '6',
    title: '홈베이킹 성공했어요!',
    writer: '홈베이킹꿈나무',
    profileImage: require('../../assets/profileimage/pig_8.png'), // 재사용
    content: '처음으로 식빵 만들어봤는데 생각보다 잘 나와서 뿌듯해요! 다음엔 어떤 빵에 도전해볼까요?',
    images: [require('../../assets/galleryimage/bread_gallery4.png')],
    likes: 45,
    comments: [
      { id: 'c12', writer: '제빵왕', content: '우와 금손이시네요! 다음엔 모닝빵 도전해보세요!', profileImage: require('../../assets/profileimage/pig_9.png') }, // 재사용
      { id: 'c13', writer: '베이킹고수', content: '발효가 중요해요! 👏👏', profileImage: require('../../assets/profileimage/pig_1.png') }, // 재사용 (없는 pig_10.png 대신 1번 다시 사용)
    ],
  },
  {
    id: '7',
    title: '다이어트 중인데 빵이 너무 먹고 싶어요 😭',
    writer: '빵순이',
    profileImage: require('../../assets/profileimage/pig_2.png'), // 재사용
    content: '다이어트 중이라 빵 끊어야 하는데... 통밀빵이나 호밀빵이라도 추천해주세요!',
    images: [],
    likes: 18,
    comments: [
      { id: 'c14', writer: '프로틴빵맨', content: '저도 다이어터인데, 단백질 빵이나 통밀 스콘 찾아보세요!', profileImage: require('../../assets/profileimage/pig_3.png') }, // 재사용
      { id: 'c15', writer: '건강빵지킴이', content: '호밀 100% 빵은 혈당 스파이크도 적어요!', profileImage: require('../../assets/profileimage/pig_4.png') }, // 재사용
    ],
  },
  {
    id: '8',
    title: '빵 먹고 행복해지는 시간 💖',
    writer: '빵생빵사',
    profileImage: require('../../assets/profileimage/pig_5.png'), // 재사용
    content: '갓 구운 빵 냄새는 정말 참을 수 없어요... 퇴근하고 빵집 들러서 힐링했어요!',
    images: [require('../../assets/galleryimage/bread_gallery6.png')],
    likes: 38,
    comments: [
      { id: 'c16', writer: '빵은사랑', content: '맞아요 빵은 사랑입니다 😍', profileImage: require('../../assets/profileimage/pig_6.png') }, // 재사용
      { id: 'c17', writer: '빵냄새성애자', content: '가장 행복한 순간이죠! 🤤', profileImage: require('../../assets/profileimage/pig_7.png') }, // 재사용
    ],
  },
  {
    id: '9',
    title: '이색 빵집 어디 없을까요?',
    writer: '도넛탐험가',
    profileImage: require('../../assets/profileimage/pig_8.png'), // 재사용
    content: '흔하지 않은 특별한 빵 파는 곳 아시면 공유 부탁드려요! 독특한 맛집 찾아다니는 중입니다.',
    images: [],
    likes: 20,
    comments: [
      { id: 'c18', writer: '베이글박사', content: '\'괴짜 빵집\'이라고 독특한 조합의 빵 많아요!', profileImage: require('../../assets/profileimage/pig_9.png') }, // 재사용
      { id: 'c19', writer: '마늘빵귀신', content: '퓨전 빵집 \'블랙올리브 베이커리\'도 괜찮아요!', profileImage: require('../../assets/profileimage/pig_1.png') }, // 재사용 (없는 pig_10.png 대신 1번 다시 사용)
    ],
  },
  {
    id: '10',
    title: '밤에 빵 먹는 거 후회되지만...',
    writer: '빵도둑',
    profileImage: require('../../assets/profileimage/pig_2.png'), // 재사용
    content: '새벽에 갑자기 빵이 너무 먹고 싶어서 참지 못하고 먹었어요... 후회는 내일의 제가 할게요! 🤣',
    images: [require('../../assets/galleryimage/bread_gallery2.png')],
    likes: 30,
    comments: [
      { id: 'c20', writer: '야식빵파티', content: '동지네요... 저도 방금 빵 먹었어요 ㅋㅋㅋ', profileImage: require('../../assets/profileimage/pig_3.png') }, // 재사용
      { id: 'c21', writer: '모닝빵', content: '후회는 잠시, 행복은 영원!', profileImage: require('../../assets/profileimage/pig_4.png') }, // 재사용
      { id: 'c22', writer: '빵지순례자', content: '맛있게 먹었으면 0칼로리! 😉', profileImage: require('../../assets/profileimage/pig_5.png') }, // 재사용
    ],
  },
];
  
export const getPosts = () => postData;

export const addPost = async (newPost) => {
  try {
    postData = [newPost, ...postData]; // 메모리 내 postData 갱신
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(postData)); // AsyncStorage에도 저장
  } catch (error) {
    console.error('게시글 저장 실패:', error);
  }
};

// 게시글 수정 (좋아요, 댓글 용)
export const updatePostById = async (id, updaterFn) => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    let posts = stored ? JSON.parse(stored) : [];

    posts = posts.map((post) =>
      post.id === id ? updaterFn(post) : post
    );

    postData = posts; // 메모리 반영
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); // 저장소 반영
  } catch (error) {
    console.error('게시글 필드 수정 실패:', error);
  }
};

  
export const loadPosts = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      postData = JSON.parse(stored);
    } else {
      // 처음 실행 시에는 현재의 postData를 저장해둠
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(postData));
    }
  } catch (e) {
    console.error('게시글 로딩 실패', e);
  }
};