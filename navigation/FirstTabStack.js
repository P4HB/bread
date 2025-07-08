import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RestaurantListScreen from '../screens/RestaurantListScreen';
import RestaurantGalleryScreen from '../screens/RestaurantGalleryScreen';

const Stack = createStackNavigator();

const FirstTabStack = ({route}) => {
    const {user} = route.params;

    return(
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen
            name="Home"
            component={HomeScreen}
            initialParams={{user}}
            options={{ headerShown: false }} 
            />
            <Stack.Screen
            name="breadList"
            component={RestaurantListScreen}
            options={{ headerShown: false }}
            />
            <Stack.Screen
            name="Gallery"
            component={RestaurantGalleryScreen}
            options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default FirstTabStack;