import React, { useState, useMemo } from 'react';
import {
  SafeAreaView, StyleSheet, View, Image, Text,
  FlatList, TouchableOpacity
} from 'react-native';
import { getPosts } from './community/CommunityPostData';
import { useNavigation } from '@react-navigation/native';

const profileImages = [
  require('../assets/profileimage/pig_1.png'),
  require('../assets/profileimage/pig_2.png'),
  require('../assets/profileimage/pig_3.png'),
  require('../assets/profileimage/pig_4.png'),
  require('../assets/profileimage/pig_5.png'),
  require('../assets/profileimage/pig_6.png'),
  require('../assets/profileimage/pig_7.png'),
  require('../assets/profileimage/pig_8.png'),
  require('../assets/profileimage/pig_9.png'),
];

const colors = {
  background: '#FDF9F3',
  point: '#D58C6B',
  textDark: '#5D4037',
  textLight: '#A1887F',
  cardBackground: '#F5EFE6',
  separator: '#EBE4D4',
};

const MyPageScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const [mainTab, setMainTab] = useState('activity');
  const [subTab, setSubTab] = useState('posts');

  const allPosts = getPosts();
  const myPosts = allPosts.filter(post => post.writer === user.name);

  const myComments = useMemo(() => {
    const comments = [];
    allPosts.forEach(post => {
      if (post.comments && Array.isArray(post.comments)) {
        post.comments.forEach(comment => {
          if (comment.name === user.name) {
            comments.push({ ...comment, post: post });
          }
        });
      }
    });
    return comments;
  }, [allPosts, user.name]);


  const renderContent = () => {
    if (mainTab === 'activity') {
      return (
        <>
          <View style={styles.subTabSection}>
            <TouchableOpacity
              onPress={() => setSubTab('posts')}
              style={[styles.subTab, subTab === 'posts' && styles.activeSubTab]}>
              <Text style={[styles.subTabText, subTab === 'posts' && styles.activeSubTabText]}>
                작성한 글
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSubTab('comments')}
              style={[styles.subTab, subTab === 'comments' && styles.activeSubTab]}>
              <Text style={[styles.subTabText, subTab === 'comments' && styles.activeSubTabText]}>
                작성한 댓글
              </Text>
            </TouchableOpacity>
          </View>

          {/* ⭐️ 이 부분을 수정했습니다. */}
          <FlatList
            key={subTab} 
            data={subTab === 'posts' ? myPosts : myComments}
            renderItem={subTab === 'posts' ? renderPostItem : renderCommentItem}
            keyExtractor={(item, index) => `${subTab}-${item.id || index}`}
            contentContainerStyle={styles.listContainer}
          />
        </>
      );
    } else {
      return (
        <FlatList
          data={[]}
          renderItem={() => null}
          keyExtractor={(item, idx) => idx.toString()}
          contentContainerStyle={styles.listContainer}
        />
      );
    }
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('커뮤니티', { screen: '글 내용', params: { post: item, user: user } })}>
      <View style={styles.contentItem}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemContent} numberOfLines={2}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCommentItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('커뮤니티', { screen: '글 내용', params: { post: item.post, user: user } })}>
      <View style={styles.contentItem}>
        <Text style={styles.itemTitle}>{item.text}</Text>
        <Text style={styles.itemContent} numberOfLines={1}>- 원본글: {item.post.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={profileImages[user.profile]}
          style={styles.profileImage}
        />
        <Text style={styles.nickname}>{user.name}</Text>
      </View>

      <View style={styles.mainTabSection}>
        <TouchableOpacity
          onPress={() => setMainTab('activity')}
          style={[styles.mainTab, mainTab === 'activity' && styles.activeMainTab]}>
          <Text style={[styles.mainTabText, mainTab === 'activity' && styles.activeMainTabText]}>
            내 활동
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMainTab('saved')}
          style={[styles.mainTab, mainTab === 'saved' && styles.activeMainTab]}>
          <Text style={[styles.mainTabText, mainTab === 'saved' && styles.activeMainTabText]}>
            저장한 빵집
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
};

// (스타일 코드는 이전과 동일하므로 생략합니다)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: "20%" },
  profileSection: { paddingVertical: 20, paddingHorizontal: 30, alignItems: 'center' },
  profileImage: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  nickname: { fontSize: 22, fontWeight: 'bold', color: colors.textDark },
  mainTabSection: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.separator },
  mainTab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeMainTab: { borderBottomWidth: 2.5, borderBottomColor: colors.point },
  mainTabText: { fontSize: 16, color: colors.textLight, fontWeight: '500' },
  activeMainTabText: { color: colors.textDark, fontWeight: 'bold' },
  subTabSection: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  subTab: { marginRight: 20, paddingBottom: 8 },
  activeSubTab: { borderBottomWidth: 2, borderBottomColor: colors.point },
  subTabText: { fontSize: 15, color: colors.textLight },
  activeSubTabText: { fontWeight: 'bold', color: colors.textDark },
  listContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  contentItem: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: colors.textDark },
  itemContent: { fontSize: 14, color: colors.textDark, lineHeight: 20 },
});

export default MyPageScreen;