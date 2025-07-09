import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, ActivityIndicator,Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { Linking } from 'react-native';

const dataFiles = {
    // ... (데이터 파일 require 부분)
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

// 별점 코드
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

  // 소수점 처리 (예: 0.6이면 60%만 보여줌)
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

  // 빈 빵 아이콘 추가
  while (breads.length < MAX_BREADS) {
    breads.push(
      <Image
        key={`empty-${breads.length}`}
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

// ⭐️ API 키를 다시 한번 확인해주세요!
Geocoder.init("AIzaSyDlqEZ2PlL91fds8yJwGWmMFPQ8U85tItU"); 

const RestaurantGalleryScreen = ({ route, navigation }) => {
  const { restaurantId, dong } = route.params;
  const data = dataFiles[dong];
  const restaurant = data.find((r) => r.id === restaurantId);
  const [isSaved, setIsSaved] = useState(false);
  
  const [coordinates, setCoordinates] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
//   const openInGoogleMaps = () => {
//   if (!coordinates) return;
//   const { latitude, longitude } = coordinates;
//   const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
//   Linking.openURL(url).catch(() => {
//     Alert.alert('오류', 'Google 지도를 열 수 없습니다.');
//   });
// };

// const openInGoogleMapsByAddress = (address) => {
//   if (!address) return;

//   const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

//   Linking.openURL(url).catch(err => {
//     console.warn("Google Maps 열기 실패:", err);
//   });
// };
const openInGoogleMapsByNameAndAddress = (name, address) => {
  if (!name || !address) return;

  const query = `${name} ${address}`;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  Linking.openURL(url).catch(err => {
    console.warn("Google Maps 열기 실패:", err);
  });
};
  // ... (useEffect, handleSave 등 다른 로직은 이전과 동일합니다)
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


  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>해당하는 빵집 정보를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }
  
  const { name, call_value, review } = restaurant;
  const reviews = review.map((rev, index) => ({
    id: index + 1,
    author: rev.nickname,
    text: rev.text,
  }));


  return (
    <SafeAreaView style={styles.container}>

      
      {/* ScrollView가 화면 전체를 차지하도록 수정 */}
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.topSection}>
          <View style={styles.topHeaderRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            {/* 가운데: 공간 채우기 */}
            <View style={{ flex: 1 }} />

            {/* 오른쪽: 저장 */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={18} color={isSaved ? "#FF6347" : "#FFF"} />
              <Text style={styles.saveButtonText}>{isSaved ? '저장됨' : '저장'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.storeName}>{name}</Text>
          <BreadRating rating={parseRating(restaurant.rating_value)} />
          <View style={styles.phoneBox}>
            <Text style={styles.phoneText}>- TEL: {call_value}</Text>
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.SectionText}>리뷰</Text>
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

        <Text style={styles.SectionText}>지도</Text>
        {/* ⭐️ --- 지도 섹션 --- ⭐️ */}
        <View style={styles.mapOuterContainer}>
          {isMapLoading ? (
            <ActivityIndicator size="large" color="#8B4513" style={{ height: 250 }}/>
          ) : coordinates ? (
            // ⭐️ 테두리를 위한 부모 View 추가
            <View style={styles.mapBorder}> 
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  ...coordinates,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.0025,
                }}
                // ⭐️ scrollEnabled와 zoomEnabled를 true로 변경 (또는 속성 자체를 제거)
                scrollEnabled={true}
                zoomEnabled={true}
              >
                <Marker
                  coordinate={coordinates}
                  title={name}
                />
              </MapView>
              
            </View>
          ) : (
            <View style={[styles.mapBorder, styles.mapErrorContainer]}>
                <Text style={styles.mapErrorText}>지도 정보를 불러올 수 없습니다.</Text>
            </View>
          )}
        </View>
        {/* <TouchableOpacity style={styles.googleMapButton} onPress={openInGoogleMaps}>
        <Text style={styles.googleMapButtonText}>Google 지도에서 보기</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => openInGoogleMapsByAddress(restaurant.address)} style={{ marginTop: 10 }}>
  <Text style={{ color: '#007AFF', textAlign: 'center' }}>Google 지도에서 보기</Text>
</TouchableOpacity> */}
<TouchableOpacity
  onPress={() => openInGoogleMapsByNameAndAddress(restaurant.name, restaurant.address)}
  style={{ marginTop: 10, alignSelf: 'center', backgroundColor: '#8B4513', padding: 10, borderRadius: 10 }}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>Google 지도에서 보기</Text>
</TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF6DC' },
  backButton : {
    padding :0,
    borderRadius:6
  },
  // ⭐️ ScrollView 관련 스타일 수정
  scrollContentContainer: {
    flexGrow : 1,
    paddingBottom: 100,
  },
  topSection: { 
    backgroundColor: '#8B4513',  // 갈색
    paddingTop: '10%',
    paddingBottom: 20,
    paddingHorizontal: 35,
    marginBototm:20,
    borderBottomRightRadius: 30,
    elevation: 8,
    position: 'relative',
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom:30,
},

storeName: {
  fontSize: 50,
  fontFamily : 'SDSamliphopangcheTTFBasic',
  color: '#FEF6DC',
  marginBottom: 20
},

breadText: {
  fontFamily : 'SDSamliphopangcheTTFBasic',
  color: '#fff',
  fontSize: 18,
  paddingTop:10
},
breadRow: {
  paddingHorizontal: 10,
  flexDirection: 'row',
},
breadIcon: {
  width: BREAD_ICON_WIDTH,
  height: BREAD_ICON_HEIGHT,
  resizeMode: 'contain',
  marginRight: 2,
},
breadClipContainer: {
  overflow: 'hidden',
  height: BREAD_ICON_HEIGHT,
  marginRight: 2,
},

phoneBox: { padding: 10, borderRadius: 5 },
phoneText: {
  color: '#fff',
  fontFamily : 'SDSamliphopangcheTTFBasic',
  fontSize: 16
},

// ⭐️ 저장 버튼 위치 조정 (topSection 기준)
saveButton: { 
  flexDirection: 'row', 
  alignItems: 'center', 
  backgroundColor: 'rgba(0,0,0,0.4)', 
  paddingHorizontal: 15, 
  paddingVertical: 10, 
  borderRadius: 16, 
},
saveButtonText: {
  color: '#fff',
  marginLeft: 6,
  fontWeight: 'bold',
  fontSize: 13,
},

reviewSection: {},
SectionText:{
  paddingTop:"8%",
  fontSize: 30, // 텍스트 크기 증가
  fontFamily : 'SDSamliphopangcheTTFBasic',
  color: '#8b4a21',
  paddingLeft:"3%",
  paddingBottom: 10,
  borderBottomWidth: 2,
  borderBottomWidth: 2, // 하단에 선 추가
  borderBottomColor: '#8b4a21', // 선 색상
  maxWidth: '20%', // 선의 최대 너비를 제한하여 글자 밑에만 오도록 (조절 가능)
},
speechBubble: { backgroundColor: '#fff', padding: 15, marginVertical: 15, maxWidth: '75%' },
bubbleLeft: { alignSelf: 'flex-start', borderTopRightRadius: 15, borderBottomRightRadius: 15, elevation: 10 },
bubbleRight: { alignSelf: 'flex-end', borderTopLeftRadius: 15, borderBottomLeftRadius: 15, elevation: 10 },
reviewAuthor: { fontWeight: 'bold', fontSize: 20, marginBottom: 5 },
reviewText: { fontSize: 15 },
  
  // ⭐️ 지도 관련 스타일 수정
  mapOuterContainer: {
    marginTop: "5%",
    alignItems: 'center', // 내부 컨텐츠(mapBorder)를 중앙에 위치시킴
  },
  // ⭐️ 테두리를 위한 View 스타일
  mapBorder: {
    width: '90%',
    height: 250,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#f3f3f3',
    overflow: 'hidden', // 이 부분이 중요! 자식인 MapView가 테두리를 넘어가지 않도록 함
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ⭐️ MapView 자체의 스타일
  map: {
    width: '100%',
    height: '100%',
  },
  mapErrorContainer: {
    backgroundColor: '#E0E0E0'
  },
  mapErrorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  googleMapButton: {
  marginTop: 15,
  backgroundColor: '#FFB347',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignSelf: 'center',
},
googleMapButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
});

export default RestaurantGalleryScreen;