// // -------------------------------
// // 탭 네비게이션 + 스택 네비게이션 코드
// // -------------------------------
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import { SafeAreaView, FlatList, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import SplashScreen from './screens/SplashScreen';

// // -------------------------------
// // 음식점 데이터
// // -------------------------------
// const data = [
//   { id: '1', name: '잇마이타이', address: '대전 유성구 어은동 112-4', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKtUEtajn49sUPOZ0PCvZmg_70ZmqvGhWX-w&s' },
//   { id: '2', name: '헤이마오차이', address: '대전 유성구 어은동 114-14', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxOhFkR-HiAvODjXn72eAJNHK9ncwV8c5n6A&s' },
//   { id: '3', name: '어은스시', address: '대전 유성구 어은동 110-3', image: 'https://modo-phinf.pstatic.net/20150823_20/1440256330212sjYxC_JPEG/mosaPOLTC9.jpeg?type=w720' },
//   { id: '4', name: '오늘 뭐 먹지', address: '대전 유성구 어은로48번길 25 1층', image: 'https://mblogthumb-phinf.pstatic.net/MjAyMzA1MzBfMjM4/MDAxNjg1NDU3NDIwNzI4.NzolwxLGyu9wzdj6vFsskkHn8Li5uEMVKJbQGhFhkLog.t1_tlAuRMQNR76ABb8knvzwXYBoYyOHQ_wSryvZ-hGAg.JPEG.bp_studio/%EC%98%A4%EB%8A%98.jpg?type=w800' },
//   { id: '5', name: '잇텐', address: '대전 유성구 어은로48번길 18 지상1층', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZvU19bJOkvMfaRBJ7NsFPS84FlFi8cvtmlQ&s' },
//   { id: '6', name: '궁칼국수', address: '대전 유성구 어은로58번길 10 2층', image: 'https://mblogthumb-phinf.pstatic.net/MjAyNDEwMTRfMjQg/MDAxNzI4ODY4MzQxMzcy._OWZFQhtBvyI1xlJw0sKVymSdbYiKjihcL1aoMNDQ1wg.AEUat_gCh-1SG2BChQdtT5bRDZVso-crBanvlL5ogWwg.PNG/%EB%8B%A8%ED%92%8D_%EC%82%AC%EC%A7%84_%EB%B0%B0%EA%B2%BD_%EB%8B%A8%ED%92%8D_%EB%AA%85%EC%86%8C_%EC%B6%94%EC%B2%9C_%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8_%EA%B2%8C%EC%8B%9C%EB%AC%BC%EC%9D%98_%EC%82%AC%EB%B3%B8.png?type=w800' },
//   { id: '7', name: '골목', address: '대전 유성구 어은로57번길 5 1층', image: 'https://mblogthumb-phinf.pstatic.net/MjAyNDA1MjFfMjc0/MDAxNzE2MjU3MjQ2Nzc0.oPXtbYqq-47VTm9D65VuCSg25zp6eV_FYlMsc0IH8Asg.2A6oBzpAIFXwI7xfNpHnr0M-yXFyvEMv-j1q4tUQ7VUg.JPEG/output_3165001848.jpg?type=w800' },
//   { id: '8', name: '다다카츠', address: '대전 유성구 어은로52번길 7 1층', image: 'https://mblogthumb-phinf.pstatic.net/MjAyMzA3MjVfMjU5/MDAxNjkwMjUwMDM0OTc5.-gcm_Xoy5SRCpdnfPylpCWKQj16SxmyAz3sihjMwCLwg.gc8HBfkpRm2PhTc0EC7q3WlliYdTQM8DH7jyrTmKRJwg.JPEG.ffshwldud/SE-7c900b50-d4af-472a-af8b-92a1f8b4bbde.jpg?type=w800' },
//   { id: '9', name: '음식점9', address: '주소9', image: 'https://via.placeholder.com/150/aaaaaa' },
//   { id: '10', name: '음식점10', address: '주소10', image: 'https://via.placeholder.com/150/aaaaaa' },
// ];

// // -------------------------------
// // 첫 번째 탭: 음식점 리스트 페이지
// // -------------------------------
// const RestaurantListScreen = ({ navigation }) => {
//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.itemContainer}
//       onPress={() => navigation.navigate('Gallery', { restaurantId: item.id })}
//     >
//       <Image source={{ uri: item.image }} style={styles.image} />
//       <View style={styles.nameContainer}>
//         <Text style={styles.nameText}>{item.name}</Text>
//       </View>
//       <View style={styles.addressContainer}>
//         <Text style={styles.addressText}>{item.address}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={true}
//       />
//     </SafeAreaView>
//   );
// };

// // -------------------------------
// // 갤러리 페이지: 음식점 번호만 간단히 표시
// // -------------------------------
// const RestaurantGalleryScreen = ({ route }) => {
//   const { restaurantId } = route.params;
//   return (
//     <SafeAreaView style={styles.centered}>
//       <Text style={{ fontSize: 24 }}>음식점 {restaurantId} 갤러리 페이지</Text>
//     </SafeAreaView>
//   );
// };


// // -------------------------------
// // 스택 네비게이터: 첫 번째 탭 안에 스택으로 구성
// // -------------------------------
// const Stack = createStackNavigator();

// const FirstTabStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen name="음식점 목록" component={RestaurantListScreen} />
//     <Stack.Screen name="Gallery" component={RestaurantGalleryScreen} />
//   </Stack.Navigator>
// );

// // -------------------------------
// // 두 번째 탭: 예시 페이지
// // -------------------------------
// const MyRestaurantGalleryScreen = () => (
//   <SafeAreaView style={styles.centered}>
//     <Text style={{ fontSize: 20 }}>두 번째 탭 내용</Text>
//   </SafeAreaView>
// );

// // -------------------------------
// // 탭 네비게이터 설정
// // -------------------------------
// const Tab = createBottomTabNavigator();

// const App = () => (
//   <NavigationContainer>
//     <Tab.Navigator>
//       <Tab.Screen name="음식점" component={FirstTabStack} />
//       <Tab.Screen name="탭2" component={MyRestaurantGalleryScreen} />
//     </Tab.Navigator>
//   </NavigationContainer>
// );

// // -------------------------------
// // 공통 스타일 정의
// // -------------------------------
// const styles = StyleSheet.create({
//   listContainer: {
//     padding: 10,
//   },
//   itemContainer: {
//     flex: 1,
//     margin: 5,
//     backgroundColor: '#f0f0f0',
//   },
//   image: {
//     width: '100%',
//     aspectRatio: 1,
//     backgroundColor: '#aaaaaa',
//   },
//   nameContainer: {
//     backgroundColor: '#c00000',
//     padding: 4,
//   },
//   nameText: {
//     color: '#ffffff',
//     fontWeight: 'bold',
//   },
//   addressContainer: {
//     backgroundColor: '#cccc33',
//     padding: 4,
//   },
//   addressText: {
//     color: '#000000',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default App;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './navigation/TabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}