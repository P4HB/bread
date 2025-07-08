import React, { useState } from "react";
import { View, Text, TextInput, Image, SafeAreaView,
  TouchableOpacity, ScrollView, StyleSheet} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const navigation = useNavigation(); // ✅ 추가
  
  const dongList = [
   '궁동', '괴정동', '노은동', '만년동', '법동',
   '석교동', '어은동', '오류동', '월평동', '중앙동'
  ];

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

  const handleSearch = () => {
    console.log('[검색]', search);
  };

  const handleDongPress = (dong) => {
    navigation.navigate('breadList', { dong }); // 동 이름 prop으로 전달
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#8b4a21', position: 'relative', 
      paddingTop: 0, paddingBottom: 80,}}>
      {/* 상단 배너 */}
      
      <View style={styles.header}>
        <Text style={styles.headerText}>오늘의 빵탐험</Text>
        <Image
          source={require('../assets/walking_pig.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      {/* 검색창 + 버튼
      <View style={[styles.searchRow, {padding: 15}]}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="지역이나 가게명을 검색하세요"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View> */}

      {/* 빵 이미지 2x2
      <View style={styles.grid}>
        {dummyImages.map((img, idx) => (
          <TouchableOpacity key={idx} style={styles.imageBox}>
            <Image source={img} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </View> */}

      {/* 동 버튼 리스트 */}
      <FlatList
        data={dongList}
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
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.buttonContainer}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 280,
    position: 'relative',
    borderBottomLeftRadius:35,
    borderBottomRightRadius:35,
    backgroundColor: '#fdf2e7',
    elevation: 20,
  },
  headerText: {
    fontFamily: 'Yeongdeok Snow Crab',
    position: 'absolute',
    top:60,
    right: 40,
    width: 200,                    // 텍스트 박스 너비
    textAlign: 'center',
    fontSize: 60,
    // fontWeight: 'bold',
    fontFamily : 'SDSamliphopangcheTTFBasic',
    color: '#8b4a21',
    zIndex: 2,
  },
  headerImage: {
    position: 'absolute',
    left: 30,
    bottom:20,
    width: 200,
    height: 120,
  },

  // searchRow: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // searchInput: {
  //   flex: 1,
  //   backgroundColor: '#f2f2f2',
  //   padding: 12,
  //   borderRadius: 8,
  //   marginRight: 10,
  // },
  // searchButton: {
  //   padding: 12,
  //   backgroundColor: '#d2691e',
  //   borderRadius: 8,
  // },
  // searchButtonText: {
  //   color: '#fff',
  //   fontWeight: 'bold',
  // },

  buttonContainer: {
    paddingVertical:10,
    paddingHorizontal: 35,
  },

  dongButton: {
    flex:1,
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
