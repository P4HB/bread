import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CommunityScreen from '../screens/community/CommunityScreen';
import CommunityPostScreen from '../screens/community/CommunityPostScreen';
import WritingScreen from '../screens/community/WritingScreen';
import MyGalleryScreen from '../screens/MyGalleryScreen.js';

const Stack = createStackNavigator();

const CommunityTabStack = ({ route }) => {
  const { user } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="커뮤니티 글 목록"
        component={CommunityScreen}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="글 내용" component={CommunityPostScreen} />
      <Stack.Screen
        name="글쓰기"
        component={WritingScreen}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="select gallery"
        component={MyGalleryScreen}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default CommunityTabStack;