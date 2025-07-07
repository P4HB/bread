import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPosts } from './CommunityPostData';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = 'community_posts';

const CommunityScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const loadPostsFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPosts(parsed);
      } else {
        const latest = getPosts();
        setPosts(latest);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(latest));
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPostsFromStorage();
    }, [])
  );

  const leftColumn = [];
  const rightColumn = [];

  posts.forEach((item, index) => {
    const card = (
      <TouchableOpacity
        key={item.id}
        style={styles.card}
        onPress={() => navigation.navigate('글 내용', { post: item })}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
        </View>

        {item.images && item.images.length > 0 && (
          <Image
            source={
              typeof item.images[0] === 'string'
                ? { uri: item.images[0] }
                : item.images[0]
            }
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.contentContainer}>
          <Text style={styles.content}>{item.content}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.writerText}>{item.writer}</Text>
        </View>
      </TouchableOpacity>
    );

    if (index % 2 === 0) {
      leftColumn.push(card);
    } else {
      rightColumn.push(card);
    }
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerText}>빵뮤니티</Text>
        <Image
          source={require('../../assets/pig-community.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.columns}>
            <View style={styles.column}>{leftColumn}</View>
            <View style={styles.column}>{rightColumn}</View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('글쓰기')}
        >
          <Ionicons name="create-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 70,
  },
  header: {
    backgroundColor: '#fdf2e7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8b4a21',
  },
  headerImage: {
    width: 200,
    height: 120,
  },
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 6,
    overflow: 'hidden',
    elevation: 4,
  },
  titleContainer: {
    padding: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#f3f0e8',
  },
  contentContainer: {
    padding: 10,
  },
  content: {
    fontSize: 15,
    color: '#666',
  },
  footer: {
    padding: 10,
  },
  writerText: {
    color: '#888',
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#8B4513',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default CommunityScreen;
