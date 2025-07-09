import React, { useEffect, useState } from 'react';
// ⭐️ Platform import 추가
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, Linking, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

// ... (dataFiles, BreadRating, parseRating 등 다른 부분은 이전과 동일)
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

const BREAD_ICON_WIDTH = 40;
const BREAD_ICON_HEIGHT = 40;
const MAX_BREADS = 5;

const BreadRating = ({ rating }) => {
  const fullCount = Math.floor(rating);
  const decimal = rating - fullCount;
  const breads = [];

  for (let i = 0; i < fullCount; i++) {
    breads.push(
      <Image
        key={`full-${i}`}
        source={require('../assets/review_bread/bread_full.png')}
        style={styles.breadIcon}
      />
    );
  }

  if (decimal > 0) {
    breads.push(
      <View
        key="clipped"
        style={[styles.breadClipContainer, { width: BREAD_ICON_WIDTH * decimal }]}
      >
        <Image
          source={require('../assets/review_bread/bread_full.png')}
          style={styles.breadIcon}
        />
      </View>
    );
  }

    const emptyCount = MAX_BREADS - Math.ceil(rating);
    for (let i = 0; i < emptyCount; i++) {
        breads.push(
            <Image
                key={`empty-${i}`}
                source={require('../assets/review_bread/bread_empty.png')}
                style={styles.breadIcon}
            />
        );
    }

  return <View style={styles.breadRow}>
    <Text style={styles.breadText}>- 별점: </Text>
    {breads}
  </View>;
};

const parseRating = (ratingStr) => {
  if (!ratingStr) return 0;
  const match = ratingStr.match(/([\d.]+)/);  // 숫자와 점(.) 포함 추출
  return match ? parseFloat(match[1]) : 0;
};

const SAVED_BAKERIES_KEY = 'saved_bakeries';
// ⭐️ 방문 기록을 저장할 새로운 키
const VISIT_HISTORY_KEY = 'visit_history';

Geocoder.init("YOUR_GOOGLE_API_KEY"); 

const RestaurantGalleryScreen = ({ route, navigation }) => {
  const { restaurantId, dong } = route.params;
  const data = dataFiles[dong];
  const restaurant = data.find((r) => r.id === restaurantId);
  const [isSaved, setIsSaved] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  // ... (다른 함수들은 동일)
  const openInGoogleMapsByNameAndAddress = (name, address) => {
    if (!name || !address) return;
  
    const query = `${name} ${address}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  
    Linking.openURL(url).catch(err => {
      console.warn("Google Maps 열기 실패:", err);
    });
  };

  useEffect(() => {
    if (restaurant?.address) {
      const fetchCoordinates = async () => {
        setIsMapLoading(true);
        try {
          const json = await Geocoder.from(restaurant.address);
          const location = json.results[0].geometry.location;
          setCoordinates({
            latitude: location.lat,
            longitude: location.lng,
          });
        } catch (error) {
          console.warn("지오코딩 실패:", error);
          setCoordinates(null);
        } finally {
          setIsMapLoading(false);
        }
      };
      fetchCoordinates();
    } else {
        setIsMapLoading(false);
    }
  }, [restaurant?.address]);

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

  // ⭐️ 방문 기록 추가 함수
  const handleAddVisit = () => {
    Alert.alert(
      "방문 기록 추가",
      `'${restaurant.name}'에 대한 방문 기록을 오늘 날짜로 추가하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { 
          text: "추가", 
          onPress: async () => {
            try {
              const visitDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
              const newVisit = {
                id: `${restaurant.id}-${Date.now()}`, // 고유한 방문 ID 생성
                restaurantId: restaurant.id,
                name: restaurant.name,
                dong: dong,
                image: restaurant.image,
                date: visitDate,
              };

              const existingVisits = await AsyncStorage.getItem(VISIT_HISTORY_KEY);
              const visitList = existingVisits ? JSON.parse(existingVisits) : [];
              
              visitList.push(newVisit);
              
              await AsyncStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(visitList));
              Alert.alert("성공", "방문 기록이 추가되었습니다.");
            } catch (e) {
              Alert.alert("오류", "방문 기록을 추가하는 데 실패했습니다.");
            }
          }
        },
      ]
    );
  };

  if (!restaurant) {
    return <SafeAreaView style={styles.container}><Text>해당하는 빵집 정보를 찾을 수 없습니다.</Text></SafeAreaView>;
  }
  
  const { name, call_value, review, rating_value } = restaurant;
  const reviews = review.map((rev, index) => ({ id: index + 1, author: rev.nickname, text: rev.text }));


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {/* ... (상단 UI는 동일) ... */}
        <View style={styles.topSection}>
          <View style={styles.topHeaderRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={18} color={isSaved ? "#FF6347" : "#FFF"} />
              <Text style={styles.saveButtonText}>{isSaved ? '저장됨' : '저장'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.storeName}>{name}</Text>
          <BreadRating rating={parseRating(rating_value)} />
          <View style={styles.phoneBox}>
            <Text style={styles.phoneText}>- TEL: {call_value}</Text>
          </View>
                {/* ⭐️ 방문 기록 추가 플로팅 버튼 */}
      <TouchableOpacity style={styles.addVisitButton} onPress={handleAddVisit}>
        <Ionicons name="footsteps-outline" size={16} color="#fff" />
        <Text style={styles.addVisitButtonText}>방문 기록 추가</Text>
      </TouchableOpacity>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.SectionText}>리뷰</Text>
          {reviews.map((item, index) => (
            <View key={item.id} style={[styles.speechBubble, index % 2 === 0 ? styles.bubbleLeft : styles.bubbleRight]}>
              <Text style={styles.reviewAuthor}>{item.author}</Text>
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.SectionText}>지도</Text>
        <View style={styles.mapOuterContainer}>
          {isMapLoading ? <ActivityIndicator size="large" color="#8B4513" style={{ height: 250 }}/> : coordinates ? (
            <View style={styles.mapBorder}> 
              <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={{ ...coordinates, latitudeDelta: 0.005, longitudeDelta: 0.0025, }} scrollEnabled={true} zoomEnabled={true}>
                <Marker coordinate={coordinates} title={name} />
              </MapView>
            </View>
          ) : (
            <View style={[styles.mapBorder, styles.mapErrorContainer]}>
                <Text style={styles.mapErrorText}>지도 정보를 불러올 수 없습니다.</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => openInGoogleMapsByNameAndAddress(restaurant.name, restaurant.address)} style={styles.googleMapButton}>
          <Text style={styles.googleMapButtonText}>Google 지도에서 보기</Text>
        </TouchableOpacity>
      </ScrollView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (기존 스타일 대부분 동일)
  container: { flex: 1, backgroundColor: '#FEF6DC' },
  scrollContentContainer: { paddingBottom: 100 },
  topSection: { 
    backgroundColor: '#8B4513',
    paddingTop: '10%',
    paddingBottom: 20,
    paddingHorizontal: 35,
    marginBottom: 20, // 오타 수정
    borderBottomRightRadius: 30,
    elevation: 8,
    position: 'relative',
  },
  topHeaderRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom:30 },
  backButton : { padding :0, borderRadius:6 },
  storeName: { fontSize: 50, fontFamily : 'SDSamliphopangcheTTFBasic', color: '#FEF6DC', marginBottom: 20 },
  breadText: { fontFamily : 'SDSamliphopangcheTTFBasic', color: '#fff', fontSize: 18, paddingTop:10 },
  breadRow: { paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' },
  breadIcon: { width: BREAD_ICON_WIDTH, height: BREAD_ICON_HEIGHT, resizeMode: 'contain', marginRight: 2 },
  breadClipContainer: { overflow: 'hidden', height: BREAD_ICON_HEIGHT, marginRight: 2 },
  phoneBox: { padding: 10, borderRadius: 5 },
  phoneText: { color: '#fff', fontFamily : 'SDSamliphopangcheTTFBasic', fontSize: 16 },
  saveButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 16, },
  saveButtonText: { color: '#fff', marginLeft: 6, fontWeight: 'bold', fontSize: 13, },
  reviewSection: { paddingHorizontal: 20 },
  SectionText:{ paddingTop:"8%", fontSize: 30, fontFamily : 'SDSamliphopangcheTTFBasic', color: '#8b4a21', paddingLeft:"3%", paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: '#8b4a21', maxWidth: '20%', },
  speechBubble: { backgroundColor: '#fff', padding: 15, marginVertical: 15, maxWidth: '75%', borderRadius: 15 },
  bubbleLeft: { alignSelf: 'flex-start', borderBottomLeftRadius: 0, elevation: 5 },
  bubbleRight: { alignSelf: 'flex-end', borderBottomRightRadius: 0, elevation: 5 },
  reviewAuthor: { fontWeight: 'bold', fontSize: 20, marginBottom: 5 },
  reviewText: { fontSize: 15 },
  mapOuterContainer: { marginTop: "5%", alignItems: 'center', },
  mapBorder: { width: '90%', height: 250, borderRadius: 20, borderWidth: 4, borderColor: '#f3f3f3', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', },
  map: { width: '100%', height: '100%', },
  mapErrorContainer: { backgroundColor: '#E0E0E0' },
  mapErrorText: { textAlign: 'center', fontSize: 16, color: '#666', },
  googleMapButton: { marginTop: 10, alignSelf: 'center', backgroundColor: '#8B4513', padding: 10, borderRadius: 10 },
  googleMapButtonText: { color: 'white', fontWeight: 'bold' },

  // ⭐️ 방문 기록 추가 버튼 스타일
  addVisitButton: {
    position: 'absolute',
 bottom: 10,
 right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D58C6B', // 포인트 컬러 사용
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addVisitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    marginLeft: 8,
  },
});

export default RestaurantGalleryScreen;