import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RestaurantListScreen from '../screens/RestaurantListScreen';
import RestaurantGalleryScreen from '../screens/RestaurantGalleryScreen';

const Stack = createStackNavigator();

const FirstTabStack = () => (
  <Stack.Navigator initialRouteName='Home'>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }} 
    />
    <Stack.Screen
      name="breadList"
      component={RestaurantListScreen}
      options={{ headerShown: false }} // 네이티브 헤더 숨기기
    />
    <Stack.Screen
      name="Gallery"
      component={RestaurantGalleryScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default FirstTabStack;
