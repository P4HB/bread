import React, { useRef } from "react";
import {
  View, Text, Image, SafeAreaView,
  TouchableOpacity, StyleSheet, Animated,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 애니메이션 관련 상수
const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 200;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const TEXT_MAX_FONT_SIZE = 60;
const TEXT_MIN_FONT_SIZE = 50;
const TEXT_BOX_WIDTH = 200;

export default function HomeScreen() {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current; // ✅ 스크롤 감지용

  const dongList = [ '궁동', '괴정동', '노은동', '만년동', '법동', '석교동', '어은동', '오류동', '월평동', '중앙동' ];
  
  // 요청하신 breadImages 배열
  const breadImages = [
    require('../assets/bread/bread1.png'),
    require('../assets/bread/bread2.png'),
    require('../assets/bread/bread3.png'),
    require('../assets/bread/bread4.png'),
    require('../assets/bread/bread5.png'),
    require('../assets/bread/bread6.png'),
    require('../assets/bread/bread7.png'),
    require('../assets/bread/bread8.png'),
    require('../assets/bread/bread9.png'),
    require('../assets/bread/bread10.png'),
  ];

  const handleDongPress = (dong) => {
    navigation.navigate('breadList', { dong });
  };

  // ✅ layout 속성 애니메이션 값 정의 (네이티브 드라이버 호환 속성으로 변경)

  // 1. 헤더 자체를 위로 이동시켜 사라지는 효과
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  // // 2. 돼지 이미지 투명도 조절
  // const imageOpacity = scrollY.interpolate({
  //   inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
  //   outputRange: [1, 0],
  //   extrapolate: 'clamp',
  // });
  
  // ▼▼▼ 돼지 이미지 스케일 애니메이션 값 정의 ▼▼▼
  const imageScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.6], // 초기 크기 1에서 스크롤 끝까지 0.6배로 줄어듭니다. (조절 가능)
    extrapolate: 'clamp',
  });

  const imageTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -65], // 왼쪽으로 40만큼 이동합니다. (값 조절 가능)
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 40],
    extrapolate: 'clamp',
  });

  // 3. 텍스트 크기를 scale로 조절
  const textScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, TEXT_MIN_FONT_SIZE / TEXT_MAX_FONT_SIZE],
    extrapolate: 'clamp',
  });

  // 4. 텍스트 세로 위치를 translateY로 조절
  const textTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 80],
    extrapolate: 'clamp',
  });

  // 5. 텍스트 가로 위치를 translateX로 조절
  const initialLeft = SCREEN_WIDTH - TEXT_BOX_WIDTH - 40;
  const finalLeft = (SCREEN_WIDTH - TEXT_BOX_WIDTH) / 2;
  const textTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, finalLeft - initialLeft],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ▼▼▼ 1. 테두리 역할을 할 View 추가 ▼▼▼ */}
      <Animated.View style={[styles.headerBorder, { transform: [{ translateY: headerTranslateY }] }]} />

      {/* 헤더: translateY를 적용해 위로 슬라이드 */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
        <Animated.Text style={[
          styles.headerText,
          {
            transform: [
              { translateX: textTranslateX },
              { translateY: textTranslateY },
              { scale: textScale },
            ]
          }
        ]}>
          오늘의 빵탐험
        </Animated.Text>
        <Animated.Image
          source={require('../assets/walking_pig.png')}
          style={[
            styles.headerImage,
            {
              transform: [
                { scale: imageScale },
                { translateX: imageTranslateX },
                { translateY: imageTranslateY }
              ],
            },
          ]}
          resizeMode="contain"
        />
      </Animated.View>

      {/* FlatList: 이제 transform 없이 스크롤 이벤트만 감지 */}
      <Animated.FlatList
        data={dongList}
        contentContainerStyle={styles.buttonContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.dongButton}
            onPress={() => handleDongPress(item)}
          >
            <Image
              source={breadImages[index % breadImages.length]}
              style={styles.breadImage}
              resizeMode="contain"
            />
            <Text style={styles.dongButtonText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true } // 네이티브 드라이버 사용
        )}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#8b4a21',
  },
  // ▼▼▼ 1. 테두리 역할을 할 스타일 새로 추가 ▼▼▼
  headerBorder: {
    position: 'absolute',
    top: 0,
    left: -4,
    right: -4,
    zIndex: 99, // 헤더(100) 바로 뒤에 위치
    height: HEADER_MAX_HEIGHT + 10, // 헤더보다 1px 더 크게
    backgroundColor: '#4E342E', // 테두리 색상
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 20, // 그림자 효과를 테두리에 적용
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: HEADER_MAX_HEIGHT, // 헤더 높이 고정
    backgroundColor: '#fdf2e7',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDD', // 선 색상 (조절 가능)
  },
  headerText: {
    position: 'absolute',
    top: 60,
    left: SCREEN_WIDTH - TEXT_BOX_WIDTH - 40,
    width: TEXT_BOX_WIDTH,
    textAlign: 'center',
    fontSize: TEXT_MAX_FONT_SIZE,
    fontFamily: 'SDSamliphopangcheTTFBasic',
    color: '#8b4a21',
  },
  headerImage: {
    position: 'absolute',
    left: 30,
    bottom: 20,
    width: 200,
    height: 120,
  },
  // FlatList의 콘텐츠 시작점을 헤더 높이만큼 아래로 설정
  buttonContainer: {
    paddingTop: HEADER_MAX_HEIGHT,
    paddingHorizontal: 35,
    paddingTop:"65%",
    paddingBottom: "20%",
  },
  dongButton: {
    flex: 1,
    margin: 15,
    padding: 25,
    height: 160,
    backgroundColor: '#fdf2e7',
    borderRadius: 40, borderTopRightRadius: 90,
    alignItems: 'center',
    elevation: 15
  },
  dongButtonText: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  breadImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
});