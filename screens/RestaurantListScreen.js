import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dummyImage from '../assets/list_dumimg.png';

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

const RestaurantListScreen = ({ navigation, route }) => {
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or 'list'
  const { dong } = route.params;
  const data = dataFiles[dong] || [];

  const fixedData = useMemo(() => {
    if (viewMode !== 'gallery') return data;
    const temp = [...data];
    if (temp.length % 2 !== 0) {
      temp.push({ id: 'dummy', isDummy: true });
    }
    return temp;
  }, [data, viewMode]);

  const renderItem = ({ item }) => {
    if (item.isDummy) return <View style={{ flex: 1, margin: 8 }} />;

    if (viewMode === 'list') {
      return (
        <TouchableOpacity
          style={styles.listItemContainer}
          onPress={() =>
            navigation.navigate('Gallery', { restaurantId: item.id, dong })
          }
        >
          <Image
            source={item.image?.startsWith('http') ? { uri: item.image } : dummyImage}
            style={styles.listImage}
          />
          <View style={styles.listTextBox}>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.addressText}>{item.address}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate('Gallery', { restaurantId: item.id, dong })
        }
      >
        <Image
          source={item.image?.startsWith('http') ? { uri: item.image } : dummyImage}
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
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 70 }}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{dong} 빵집</Text>
        <Image
          source={require('../assets/walking_pig.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      {/* 보기 전환 버튼 */}
      <View style={styles.modeToggleBar}>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'gallery' && styles.modeButtonSelected]}
          onPress={() => setViewMode('gallery')}
        >
          <Text style={[styles.modeButtonText, viewMode === 'gallery' && styles.modeButtonTextSelected]}>
            갤러리뷰
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'list' && styles.modeButtonSelected]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.modeButtonText, viewMode === 'list' && styles.modeButtonTextSelected]}>
            리스트뷰
          </Text>
        </TouchableOpacity>
      </View>

      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={25} color="#8b4a21" />
      </TouchableOpacity>

      {/* FlatList 분기 + key로 오류 방지 */}
      {viewMode === 'gallery' ? (
        <FlatList
          key="gallery"
          data={fixedData}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id?.toString() || `dummy-${index}`}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FlatList
          key="list"
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id?.toString() || `dummy-${index}`}
          numColumns={1}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    marginLeft:'5%',
    bottom:'32%',
    left:'2%'
  },
  headerImage: {
    width: 160,
    height: 100,
    right:'6%'
  },

  backButton: {
    position: 'absolute',
    top: '3%',
    left: 20,
    zIndex: 10,
    padding: 8,
    color:'#8b4a21'
  },

  modeToggleBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    gap: 10,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  modeButtonSelected: {
    backgroundColor: '#8b4a21',
  },
  modeButtonText: {
    fontSize: 14,
    color: '#555',
  },
  modeButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },

  itemContainer: {
    flex: 1,
    marginInlineStart:'3%',
    margin:"3%",
    borderRadius: 20,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 7,
  },
  image: {
    width: 150,
    height: 90,
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
    paddingBottom:15
  },
  addressText: {
    color: '#888888',
    fontSize: 14,
  },

  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: '7%',
    backgroundColor: '#fff',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '2%',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 6,
    padding: 10,
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  listTextBox: {
    marginLeft: 12,
    flex: 1,
  },
});

export default RestaurantListScreen;
