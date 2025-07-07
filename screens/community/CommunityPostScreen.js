import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { updatePostById, getPosts } from './CommunityPostData';

const CommunityPostScreen = ({ route }) => {
  const { post } = route.params;
  const [comment, setComment] = useState('');
  const [commenterName, setCommenterName] = useState('');
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
    if (!commenterName.trim() || !comment.trim()) return;
    const newComment = { name: commenterName, text: comment };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setComment('');
    setCommenterName('');
    await updatePostById(post.id, (prev) => ({
      ...prev,
      comments: updatedComments,
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.authorInfo}>
              <Image
                source={require('../../assets/walking_pig.png')}
                style={styles.profileImage}
              />
              <Text style={styles.authorName}>{post.writer}</Text>
            </View>
            <Text style={styles.likesText}>❤️ {likeNum} 공감</Text>
          </View>

          {post.images && post.images.length > 0 && (
            <Image
              source={typeof post.images[0] === 'string' ? { uri: post.images[0] } : post.images[0]}
              style={styles.postImage}
              resizeMode="cover"
            />
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
            style={styles.nameInput}
            placeholder="이름"
            value={commenterName}
            onChangeText={setCommenterName}
          />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf2e7' }, // 갈색 배경
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
  authorName: { fontSize: 20, marginLeft
    :15, fontWeight: '600', color: '#333' },
  likesText: { fontSize: 18, color: '#555' },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginTop:16,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  content: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginTop:10,
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
  commentCount: { fontSize: 18, fontWeight: 'bold', marginLeft:10, marginBottom:10},
  commentEmpty: { color: '#999', fontSize: 15, margin:15, textAlign:'center' },
  commentItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 10,
    margin:10,
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
  commentAuthor: { fontSize:16, fontWeight: 'bold', color: '#4A4A4A' },
  commentContent: { fontSize:18, margin:10, color: '#333' },
  commentInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0', // 회색으로 변경
    borderRadius: 70,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginTop: 20,
    marginHorizontal:20
  },

  nameInput: {
    width: 80,
    fontSize: 15,
    marginRight: 8,
    fontWeight: 'bold',
    textAlign: 'center'
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
    marginRight:20,
    marginBottom:5
  },
});

export default CommunityPostScreen;
