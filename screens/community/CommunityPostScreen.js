import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePostById, getPosts } from './CommunityPostData'; // 🔧 수정 1: getPosts 추가

const CommunityPostScreen = ({ route }) => {
  const { post } = route.params;
  const [comment, setComment] = useState('');
  const [likeNum, setLikeNum] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);

  // 🔧 수정 2: 최신 데이터 갱신 함수
  const refreshPostData = () => {
    const latest = getPosts().find((p) => p.id === post.id);
    if (latest) {
      setLikeNum(latest.likes || 0);
      setComments(latest.comments || []);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setComment('');

    await updatePostById(post.id, (prev) => ({
      ...prev,
      comments: updatedComments,
    }));

    refreshPostData(); // 🔧 수정 3: 최신 데이터 반영
  };

  const handleLike = async () => {
    const newLikeCount = likeNum + 1;
    setLikeNum(newLikeCount);

    await updatePostById(post.id, (prev) => ({
      ...prev,
      likes: newLikeCount,
    }));

    refreshPostData(); // 🔧 수정 4: 최신 데이터 반영
  };

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: 70 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.profileRow}>
            <Image
              source={require('../../assets/walking_pig.png')}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{post.writer}</Text>
          </View>

          <View style={styles.titleBox}>
            <Text style={styles.title}>{post.title}</Text>
          </View>

          {post.images && post.images.length > 0 && (
            <View style={styles.imageGrid}>
              {post.images.map((img, index) => (
                <Image
                  key={index}
                  source={typeof img === 'string' ? { uri: img } : img}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}

          <Text style={styles.content}>{post.content}</Text>

          <View style={styles.likeCnt}>
            <Text>공감수: {likeNum}</Text>
          </View>

          <View style={styles.reactionRow}>
            <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
              <Text style={styles.likeText}>👍 공감하기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.commentSection}>
            <Text style={styles.commentCount}>댓글 {comments.length}</Text>
            {comments.length === 0 ? (
              <Text style={styles.commentEmpty}>
                아직 댓글이 없어요. 가장 먼저 댓글을 남겨보세요.
              </Text>
            ) : (
              comments.map((cmt, idx) => (
                <Text key={idx} style={{ marginBottom: 6 }}>
                  {cmt}
                </Text>
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.commentInputBar}>
          <TouchableOpacity>
            <Image source={require('../../assets/pig-community.png')} style={styles.icon} />
          </TouchableOpacity>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력해주세요.."
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity onPress={handleCommentSubmit}>
            <Text style={styles.sendButtonText}>작성</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  name: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  titleBox: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  imageGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  image: {
    width: '100%',
    height: 240,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    color: '#444',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  reactionRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  likeCnt: {
    paddingHorizontal: 20,
    margin: 8,
  },
  likeButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  likeText: {
    fontWeight: 'bold',
    color: '#555',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  commentSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  commentCount: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  commentEmpty: {
    color: '#999',
  },
  commentInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonText: {
    marginLeft: 10,
    color: '#8B4513',
    fontWeight: 'bold',
    fontSize: 15,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default CommunityPostScreen;
