import React, { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, FlatList, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import dummyImage from '../assets/list_dumimg.png';
// const data = require('../crawl/results_googlemaps.json');

const { width } = Dimensions.get('window');

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

// 네비게이션 prop을 받아, 리스트 아이템 터치 시 상세 화면으로 이동 가능
const RestaurantListScreen = ({ navigation, route }) => {
  const numColumns = 2;
  const { dong } = route.params;
  const data = dataFiles[dong] || []; // 없는 dong이면 빈 배열

  // 음식점 데이터 준비
  const fixedData = useMemo(() => {
    const temp = [...data];
    if (temp.length % numColumns !== 0) {
      temp.push({ id: 'dummy', isDummy: true });
    }
    return temp;
  }, [data]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('Gallery', { 
        restaurantId: item.id,
        dong: dong,
       })}
    >
      <Image
        source={
          item.image && item.image.startsWith('http') ? { uri: item.image } : dummyImage
        }
        style={styles.image}
      />
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>{item.name}</Text>
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.addressText}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', position: 'relative', paddingBottom: 70 }}>
      {/* 상단 크림톤 배너 + 앱 이름 + 돼지 이미지 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{dong} 빵집</Text>
        <Image
          source={require('../assets/walking_pig.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#FDF0C1" />
        </TouchableOpacity>
      {/* 음식점 리스트 */}
      <FlatList
        data={fixedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  header: {
    backButton: {
      position: 'absolute',
      top: 45,
      left: 20,
      zIndex: 10,
      padding: 8,
    },
    backgroundColor: '#fdf2e7',       // 따뜻한 크림톤 배경
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
    width: 120,
    height: 120,
  },
  
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#f3f0e8',
  },
  nameContainer: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  nameText: {
    color: '#333333',
    fontWeight: '700',
    fontSize: 17,
  },
  addressContainer: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  addressText: {
    color: '#888888',
    fontSize: 14,
  },
});

export default RestaurantListScreen;