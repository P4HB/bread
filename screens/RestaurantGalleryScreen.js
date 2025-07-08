import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dataFiles = {
    '괴정동': require('../crawl/괴정동 카페_crawled.json'),
    '궁동': require('../crawl/궁동 카페_crawled.json'),
    '노은동': require('../crawl/노은동 카페_crawled.json'),
    '만년동': require('../crawl/만년동 카페_crawled.json'),
    '법동': require('../crawl/법동 카페_crawled.json'),
    '석교동': require('../crawl/석교동 카페_crawled.json'),
    '어은동': require('../crawl/어은동 카페_crawled.json'),
    '오류동': require('../crawl/오류동 카페_crawled.json'),
    '월평동': require('../crawl/월평동 카페_crawled.json'),
    '중앙동': require('../crawl/중앙동 카페_crawled.json'),
  };

const SAVED_BAKERIES_KEY = 'saved_bakeries';

const RestaurantGalleryScreen = ({ route, navigation }) => {
  const { restaurantId, dong } = route.params;
  const data = dataFiles[dong];
  const restaurant = data.find((r) => r.id === restaurantId);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkIsSaved = async () => {
      const saved = await AsyncStorage.getItem(SAVED_BAKERIES_KEY);
      const savedList = saved ? JSON.parse(saved) : [];
      if (savedList.some(item => item.id === restaurantId && item.dong === dong)) {
        setIsSaved(true);
      }
    };
    checkIsSaved();
  }, [restaurantId, dong]);


  const handleSave = async () => {
    try {
      const saved = await AsyncStorage.getItem(SAVED_BAKERIES_KEY);
      let savedList = saved ? JSON.parse(saved) : [];

      if (isSaved) {
        savedList = savedList.filter(item => !(item.id === restaurantId && item.dong === dong));
        Alert.alert('저장 취소', '저장된 빵집 목록에서 삭제되었습니다.');
      } else {
        savedList.push({ id: restaurantId, dong, name: restaurant.name, image: restaurant.image });
        Alert.alert('저장 완료', '빵집이 저장되었습니다.');
      }
      
      await AsyncStorage.setItem(SAVED_BAKERIES_KEY, JSON.stringify(savedList));
      setIsSaved(!isSaved);

    } catch (e) {
      Alert.alert('오류', '빵집을 저장하는 데 실패했습니다.');
    }
  };


  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>해당하는 빵집 정보를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const { name, rating_value, call_value, review } = restaurant;
  const reviews = review.map((rev, index) => ({
    id: index + 1,
    author: rev.nickname,
    text: rev.text,
  }));

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: 70 }]}>
       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={25} color="#fff" />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require('../assets/background.png')}
          style={styles.topSection}
          resizeMode="cover"
        >
          <Text style={styles.storeName}>{name}</Text>
          <View style={styles.phoneBox}>
            <Text style={styles.phoneText}>TEL: {call_value}</Text>
          </View>
        </ImageBackground>

        {/* ⭐️ 저장하기 버튼 추가 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name={isSaved ? "heart" : "heart-outline"} size={24} color={isSaved ? "#FF6347" : "#FFF"} />
            <Text style={styles.saveButtonText}>{isSaved ? '저장됨' : '저장하기'}</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.reviewsSection}>
            {reviews.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.speechBubble,
                  index % 2 === 0 ? styles.bubbleLeft : styles.bubbleRight,
                ]}
              >
                <Text style={styles.reviewAuthor}>{item.author}</Text>
                <Text style={styles.reviewText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF6DC' },
  backButton: { position: 'absolute', top: 45, left: 20, zIndex: 10, padding: 8 },
  topSection: { padding:35, paddingTop: 100, borderBottomLeftRadius: 0, borderBottomRightRadius: 30, overflow: 'hidden', elevation: 8, marginBottom: 10 },
  storeName: { fontSize: 34, fontWeight: 'bold', color: '#FEF6DC', marginBottom: 20 },
  phoneBox: { padding: 10, borderRadius: 5 },
  phoneText: { color: '#fff', fontSize: 16 },
  reviewsSection: { paddingHorizontal: 0 },
  speechBubble: { backgroundColor: '#fff', padding: 15, marginVertical: 15, maxWidth: '75%' },
  bubbleLeft: { alignSelf: 'flex-start', borderTopRightRadius: 15, borderBottomRightRadius: 15, elevation: 10 },
  bubbleRight: { alignSelf: 'flex-end', borderTopLeftRadius: 15, borderBottomLeftRadius: 15, elevation: 10 },
  reviewAuthor: { fontWeight: 'bold', fontSize: 20, marginBottom: 5 },
  reviewText: { fontSize: 15 },
  saveButton: { position: 'absolute', top: 180, right: 30, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  saveButtonText: { color: '#fff', marginLeft: 8, fontWeight: 'bold' }
});

export default RestaurantGalleryScreen;