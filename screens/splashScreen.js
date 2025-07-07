import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

// 특정 컴포넌트에서 일정 시간 후에 다른 화면으로 전환해야 할 때, navigation 객체의 메서드를 사용
const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main'); // 3초 후 Main으로 이동
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
