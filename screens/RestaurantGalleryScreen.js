import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import data from '../crawl/results_googlemaps.json';
import background_img from '../assets/background.png';

const RestaurantGalleryScreen = ({ route, navigation }) => {
  // route : 현재 화면의 위치와 관련 데이터를 담고 있는 객체
  // 현재 어떤 스택/탭/라우트에 위치해 있는지, 이동 시 전달받은 params는 무엇인지 등을 포함
  const { restaurantId, dong } = route.params;
  // 배열의 각 요소(r)에 대해 r.id가 restaurantId와 같은지 검사
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
  const data = dataFiles[dong];
  const restaurant = data.find((r) => r.id === restaurantId);

  const restaurantName = restaurant.name;
  const rating = restaurant.rating_value;
  const phone = restaurant.call_value;
  const reviews = restaurant.review.map((rev, index) => ({
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
          source={require('../assets/background.png')} // 배경 이미지 경로 수정 필요
          style={styles.topSection}
          resizeMode="cover"
        >
          <Text style={styles.storeName}>{restaurantName}</Text>

          {/* <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>🥐 {rating}</Text>
          </View> */}

          <View style={styles.phoneBox}>
            <Text style={styles.phoneText}>TEL: {phone}</Text>
          </View>
        </ImageBackground>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.reviewsSection}>
            {reviews.map((review, index) => (
              <View
                key={review.id}
                style={[
                  styles.speechBubble,
                  index % 2 === 0 ? styles.bubbleLeft : styles.bubbleRight,
                ]}
              >
                <Text style={styles.reviewAuthor}>{review.author}</Text>
                <Text style={styles.reviewText}>{review.text}</Text>
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
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  topSection: {
    padding:35,
    paddingTop: 100, // 음식점명을 버튼과 겹치지 않도록 더 내림
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    marginBottom: 10,
  },
  storeName: {
    fontSize: 34, // 크기 키움
    fontWeight: 'bold',
    color: '#FEF6DC',
    marginBottom: 20,
  },

  ratingBox: {
    // backgroundColor: '#B22222',
    padding: 10,
    borderRadius: 5,
  },
  ratingText: {
    color: '#fff',
    fontSize: 18,
  },
  phoneBox: {
    // backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
  },
  phoneText: {
    color: '#fff',
    fontSize: 16,
  },

  reviewsSection: {
    paddingHorizontal: 0,
  },
  speechBubble: {
    backgroundColor: '#fff',

    padding: 15,
    marginVertical: 15,
    maxWidth: '75%',
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 10,
  },
  bubbleRight: {
    alignSelf: 'flex-end',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    elevation: 10,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 15,
  },
});

export default RestaurantGalleryScreen;