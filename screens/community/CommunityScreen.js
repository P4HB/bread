import React, { useState, useCallback } from 'react';
import {SafeAreaView, ScrollView, View, Text, Image,
  StyleSheet, TouchableOpacity,} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPosts } from './CommunityPostData';
import Ionicons from 'react-native-vector-icons/Ionicons';

const STORAGE_KEY = 'community_posts';

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

const CommunityScreen = ({ navigation, route }) => {
  const {user} = route.params;
  const [posts, setPosts] = useState([]);

  const loadPostsFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPosts(JSON.parse(stored));
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
        onPress={() => navigation.navigate('글 내용', { post: item, user:user })}
      >
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image
              source={profileImages[item.profileImage]}
              style={styles.profileThumb}
            />
            <Text style={styles.writerText}>{item.writer}</Text>
          </View>
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

        <View style={styles.cardBody}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.content} numberOfLines={2}>
            {item.content}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.iconText}>♥️ {item.likes || 0}</Text>
          <Text style={styles.iconText}>💬 {(item.comments || []).length}</Text>
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
          onPress={() => navigation.navigate('글쓰기',{user})}
        >
          <Ionicons name="pencil" size={28} color="#fff"> </Ionicons>
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
    paddingTop: '7%',
    paddingBottom: '3%',
    height:'25%'
  },
  headerText: {
    fontSize: 40,
    // fontWeight: 'bold',
    fontFamily : 'SDSamliphopangcheTTFBasic',
    color: '#8b4a21',
    marginLeft:'5%'
  },
  headerImage: {
    width: 160,
    height: 120,
    marginRight:'5%'
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: '#fdf2e7',
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  column: {
    flex: 1,
    gap: 20,
  },
  
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  cardHeader: {padding: 10},
  profileThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  writerText: {fontSize: 13, color: '#333'},
  image: {
    width: '94%',
    height: 100,
    backgroundColor: '#f3f0e8',
    margin:'3%',
    borderRadius:10
  },

  cardBody: {paddingHorizontal: 15, paddingVertical:8, gap: 3},
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  content: {fontSize: 12, color: '#666'},
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical:10, 
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
  },

  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconText: {
    fontSize: 13,
    color: '#666',
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#8B4513',
    width: 50,
    height: 50,
    borderRadius: 30,
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
