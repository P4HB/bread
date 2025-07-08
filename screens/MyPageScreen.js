import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, StyleSheet, View, Image, Text, ScrollView,
  FlatList, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const colors = {
  background: '#FDF9F3', // 따뜻한 크림색 배경
  point: '#D58C6B',      // 톤 다운된 오렌지 브라운
  textDark: '#5D4037',   // 부드러운 다크 브라운
  textLight: '#A1887F',  // 연한 브라운
  cardBackground: '#F5EFE6', // 은은한 베이지
  separator: '#EBE sezione4D', // 구분선
};

const MyPageScreen = () => {
  const [mainTab, setMainTab] = useState('activity');
  const [subTab, setSubTab] = useState('posts');

  // --- 임시 데이터 ---
  const user = {
    nickname: '빵에 진심',
    profileImage: require('../assets/profileimage/pig_1.png'), 
  };

  const myPosts = [
    { id: '1', title: '인생 소금빵 맛집 후기', content: '여기 진짜 소금빵이 겉바속촉 그 자체에요...', date: '2023.10.27' },
    { id: '2', title: '다들 최애 케이크 있으신가요?', content: '저는 딸기 생크림 케이크를 가장 좋아하는데...', date: '2023.10.25' },
  ];

  const myComments = [
    { id: '1', postTitle: '인생 소금빵 맛집 후기', comment: '오, 저도 여기 가봤는데 진짜 맛있죠!', date: '2023.10.27' },
    { id: '2', postTitle: '다들 최애 케이크 있으신가요?', comment: '맞아요! 딸기 생크림은 진리입니다.', date: '2023.10.26' },
  ];

  const savedBakeries = [
    { id: '1', name: '성심당', location: '대전 중구', image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDAzMDdfMjEg%2FMDAxNzA5NzM2OTM0OTk4.iS-42r5Yl6qr8UDHLa_xR5jOPE1sBv9s2Ks-b-m7eJQg.j1G4vG4-zGk5zE42GkGBSbW4yJ2_S2aI8v-L9zYz-QIg.JPEG%2FIMG_9720.JPG' },
    { id: '2', name: '나폴레옹 과자점', location: '서울 성북구', image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDAzMjZfMjE5%2FMDAxNzExNDQzMTYxMTM5.x7aKjT9wLg6d-tUqg_w27xxzVp7Fh2vXk29s-Yh0uOQg.Z-tT3qGk3A9o3zR9yY_1o-b-gqg5ZgQ8E-d-3jZ-Z-Yg.JPEG%2FIMG_2448.jpg' },
  ];
  
  const renderContent = () => {
    if (mainTab === 'activity') {
      return (
        <>
          <View style={styles.subTabSection}>

            <TouchableOpacity onPress={() => setSubTab('posts')}
             style={[styles.subTab, subTab === 'posts' && styles.activeSubTab]}>
              <Text style={[styles.subTabText, subTab === 'posts' && styles.activeSubTabText]}>작성한 글</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSubTab('comments')}
             style={[styles.subTab, subTab === 'comments' && styles.activeSubTab]}>
              <Text style={[styles.subTabText, subTab === 'comments' && styles.activeSubTabText]}>작성한 댓글</Text>
            </TouchableOpacity>

          </View>
          
          <FlatList
            data={subTab === 'posts' ? myPosts : myComments}
            renderItem={subTab === 'posts' ? renderPostItem : renderCommentItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </>
      );
    } else {
      return (
        <FlatList
          data={savedBakeries}
          renderItem={renderBakeryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      );
    }
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.contentItem}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemContent}>{item.content}</Text>
      <Text style={styles.itemDate}>{item.date}</Text>
    </View>
  );

  const renderCommentItem = ({ item }) => (
    <View style={styles.contentItem}>
      <Text style={styles.itemContent}>"{item.comment}"</Text>
      <Text style={styles.itemDate}>{item.date} · {item.postTitle} 게시물에 남긴 댓글</Text>
    </View>
  );

  const renderBakeryItem = ({ item }) => (
    <View style={styles.bakeryItem}>
      <Image source={{ uri: item.image }} style={styles.bakeryImage} />
      <View style={styles.bakeryInfo}>
        <Text style={styles.bakeryName}>{item.name}</Text>
        <Text style={styles.bakeryLocation}>{item.location}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={user.profileImage} style={styles.profileImage} />
        <Text style={styles.nickname}>{user.nickname}</Text>
      </View>
      <View style={styles.mainTabSection}>
        <TouchableOpacity onPress={() => setMainTab('activity')} style={[styles.mainTab, mainTab === 'activity' && styles.activeMainTab]}>
          <Text style={[styles.mainTabText, mainTab === 'activity' && styles.activeMainTabText]}>내 활동</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMainTab('saved')} style={[styles.mainTab, mainTab === 'saved' && styles.activeMainTab]}>
          <Text style={[styles.mainTabText, mainTab === 'saved' && styles.activeMainTabText]}>저장한 빵집</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

// 스타일 정의 (새로운 색상 테마 적용)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop:"20%" },
  // --- 프로필 ---
  profileSection: { paddingVertical: 20, paddingHorizontal: 30, alignItems: 'center' },
  profileImage: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  nickname: { fontSize: 22, fontWeight: 'bold', color: colors.textDark },
  // --- 메인 탭 ---
  mainTabSection: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.separator },
  mainTab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeMainTab: { borderBottomWidth: 2.5, borderBottomColor: colors.point },
  mainTabText: { fontSize: 16, color: colors.textLight, fontWeight: '500' },
  activeMainTabText: { color: colors.textDark, fontWeight: 'bold' },
  // --- 서브 탭 ---
  subTabSection: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  subTab: { marginRight: 20, paddingBottom: 8 },
  activeSubTab: { borderBottomWidth: 2, borderBottomColor: colors.point },
  subTabText: { fontSize: 15, color: colors.textLight },
  activeSubTabText: { fontWeight: 'bold', color: colors.textDark },
  // --- 목록 공통 ---
  listContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  contentItem: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: colors.textDark },
  itemContent: { fontSize: 14, color: colors.textDark, lineHeight: 20, marginBottom: 10 },
  itemDate: { fontSize: 12, color: colors.textLight, textAlign: 'right' },
  // --- 저장한 빵집 ---
  bakeryItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, borderRadius: 12, padding: 12, marginBottom: 12 },
  bakeryImage: { width: 70, height: 70, borderRadius: 8, marginRight: 15 },
  bakeryInfo: { flex: 1 },
  bakeryName: { fontSize: 17, fontWeight: 'bold', color: colors.textDark },
  bakeryLocation: { fontSize: 13, color: colors.textLight, marginTop: 4 },
});

export default MyPageScreen;