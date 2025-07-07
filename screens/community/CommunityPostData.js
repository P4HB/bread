import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY = "community_posts";


let postData = [
  { id: '1', title: '오늘 뭐 먹지?', writer: '김지연', content: '김밥 먹자!', images: [require('../../assets/walking_pig.png')], likes: 0, comments: [] },
  { id: '2', title: '맛집 공유', writer: '김지연 2', content: '다다카츠 갔어요!', likes: 0, comments: [] },
  { id: '3', title: '질문 있어요', writer: '김지연 3', content: '어디가 제일 맛있나요?', likes: 0, comments: [] },
  { id: '4', title: '추천 메뉴', writer: '김지연 4', content: '어은스시 사시미 굿', images: [require('../../assets/galleryimage/bread_gallery10.png'), require('../../assets/galleryimage/bread_gallery1.png')], likes: 0, comments: [] },
  { id: '5', title: '디저트 카페 추천', writer: '김지연 5', content: '레드벨벳 케이크 맛있어요!', likes: 0, comments: [] },
  { id: '6', title: '브런치 카페', writer: '김지연 6', content: '에그 베네딕트 대박!', images: [require('../../assets/galleryimage/bread_gallery1.png')], likes: 0, comments: [] },
  { id: '7', title: '이자카야 분위기', writer: '김지연 7', content: '혼술하기 좋은 곳이에요.', likes: 0, comments: [] },
  { id: '8', title: '버거킹 신메뉴', writer: '김지연 8', content: '칠리 새우버거 먹어봤어요.', likes: 0, comments: [] },
  { id: '9', title: '한식 맛집', writer: '김지연 9', content: '된장찌개 맛있음!', likes: 0, comments: [] },
  { id: '10', title: '야식 추천 좀요', writer: '김지연 10', content: '떡볶이요!', likes: 0, comments: [] },
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