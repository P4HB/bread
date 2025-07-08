import React, { useState, useRef, useCallback } from 'react';
import {SafeAreaView, Text, StyleSheet, Image, View,
  ScrollView, TouchableOpacity, TextInput, Animated, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { updatePostById, getPosts } from './CommunityPostData';

const profileImages = [
  require('../../assets/profileimage/pig_1.png'),
  require('../../assets/profileimage/pig_2.png'),
  require('../../assets/profileimage/pig_3.png'),
  require('../../assets/profileimage/pig_4.png'),
  require('../../assets/profileimage/pig_5.png'),
  require('../../assets/profileimage/pig_6.png'),
  require('../../assets/profileimage/pig_7.png'),
  require('../../assets/profileimage/pig_8.png'),
  require('../../assets/profileimage/pig_9.png')
];

const CommunityPostScreen = ({ route }) => {
  const {post, user } = route.params;
    console.log('user:', user);
  const [comment, setComment] = useState('');
  const [likeNum, setLikeNum] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const refreshPostData = () => {
    const latest = getPosts().find((p) => p.id === post.id);
    if (latest) {
      setLikeNum(latest.likes || 0);
      setComments(latest.comments || []);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    const newComment = { name: user.name,
      profileImage: user.profileImage, text: comment };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setComment('');
    await updatePostById(post.id, (prev) => ({
      ...prev, //전부 복사
      comments: updatedComments, //이것만 대체
    }));
    
    refreshPostData();
  };

  const handleLike = async () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.4,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    const newLikeCount = likeNum + 1;
    setLikeNum(newLikeCount);
    await updatePostById(post.id, (prev) => ({
      ...prev,
      likes: newLikeCount,
    }));
    refreshPostData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <View style={styles.authorInfo}>
                  <Image
                    source={profileImages[user.profile]}
                    style={styles.profileImage}
                  />
                  <Text style={styles.authorName}>{post.writer}</Text>
                </View>
                <Text style={styles.likesText}>❤️ {likeNum} 공감</Text>
              </View>

              {post.images && post.images.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageScrollView}
                >
                  {post.images.map((img, index) => {
                    const source = typeof img === 'string' ? { uri: img } : img;
                    return (
                      <Image
                        key={index}
                        source={source}
                        style={styles.postImage}
                        resizeMode="cover"
                      />
                    );
                  })}
                </ScrollView>
              )}

              <Text style={styles.content}>{post.content}</Text>

              <View style={styles.reactionRow}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
                    <Text style={styles.likeText}>👍 공감하기</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              <View style={styles.commentSection}>
                <Text style={styles.commentCount}>댓글 {comments.length}</Text>
                {comments.length === 0 ? (
                  <Text style={styles.commentEmpty}>
                    아직 댓글이 없어요. 가장 먼저 댓글을 남겨보세요.
                  </Text>
                ) : (
                  comments.map((cmt, idx) => (
                    <View key={idx} style={styles.commentItem}>
                      <View style={styles.commentHeader}>
                        <Image
                          source={require('../../assets/walking_pig.png')}
                          style={styles.commentProfileImage}
                        />
                        <Text style={styles.commentAuthor}>{cmt.name}</Text>
                      </View>
                      <Text style={styles.commentContent}>{cmt.text}</Text>
                    </View>
                  ))
                )}
              </View>
            </View>

            <View style={styles.commentInputBar}>
              <TextInput
                style={styles.commentInput}
                placeholder="댓글을 입력해주세요..."
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity onPress={handleCommentSubmit}>
                <Text style={styles.sendButtonText}>작성</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf2e7' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorInfo: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  authorName: { fontSize: 20, marginLeft: 15, fontWeight: '600', color: '#333' },
  likesText: { fontSize: 18, color: '#555' },
  postImage: {
    width: 300,
    height: 300,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  content: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  reactionRow: { alignItems: 'center', marginBottom: 20 },
  likeButton: {
    backgroundColor: '#8b4a21',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  likeText: { fontSize: 13, color: '#fff', fontWeight: 'bold' },
  commentSection: { marginTop: 10 },
  commentCount: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 },
  commentEmpty: { color: '#999', fontSize: 15, margin: 15, textAlign: 'center' },
  commentItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 10,
    margin: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentProfileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentAuthor: { fontSize: 16, fontWeight: 'bold', color: '#4A4A4A' },
  commentContent: { fontSize: 18, margin: 10, color: '#333' },
  commentInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 70,
    paddingHorizontal: 16,
    paddingVertical: 7,
    paddingLeft:20,
    marginTop: 20,
    marginHorizontal: 20,
  },
  commentInput: {
    flex: 1,
    fontSize: 15,
    marginRight: 8,
  },
  sendButtonText: {
    color: '#e06666',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 20,
    marginBottom: 5,
  },
});

export default CommunityPostScreen;
