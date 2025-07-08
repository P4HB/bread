import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/splashScreen';
import FirstTabStack from './FirstTabStack';
import MyGalleryScreen from '../screens/MyGalleryScreen';
import CommunityTabStack from './CommunityTabStack';
import MyPageScreen from '../screens/MyPageScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 기존 탭 네비게이터 유지
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
          headerShown: false,
          tabBarShowLabel: false, // 라벨 숨기고 아이콘만
          tabBarStyle: {
            position: 'absolute',
            left: 20,         // 좌측 여백
            right: 20,       // 우측 여백
            height: 80,       // 높이
            paddingTop: 15,
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            backgroundColor: '#fff',
            borderTopWidth: 0, // 위 테두리 없앰
          },
          tabBarActiveTintColor: '#FFA500',
          tabBarInactiveTintColor: '#A0A0A0',
    }}
  >
    <Tab.Screen
      name="음식점"
      component={FirstTabStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="restaurant-outline" color={color} size={28} />
        ),
      }}
    />
    <Tab.Screen
      name="나의 갤러리"
      component={MyGalleryScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="images-outline" color={color} size={28} />
        ),
      }}
    />
    <Tab.Screen
      name="커뮤니티"
      component={CommunityTabStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubble-ellipses-outline" color={color} size={28} />
        ),
      }}
    />
    <Tab.Screen
      name="마이페이지"
      component={MyPageScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" color={color} size={28} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Root Stack으로 Splash + MainTabs 묶기
const RootNavigator = () => (
  <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component = {LoginScreen} />
    <Stack.Screen name="Signup" component = {SignupScreen} />
    <Stack.Screen name="Main" component={MainTabs} />
  </Stack.Navigator>
);

export default RootNavigator;