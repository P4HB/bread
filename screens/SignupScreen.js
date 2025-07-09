import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const profileImages = [
  require('../assets/profileimage/pig_1.png'),
  require('../assets/profileimage/pig_2.png'),
  require('../assets/profileimage/pig_3.png'),
  require('../assets/profileimage/pig_4.png'),
  require('../assets/profileimage/pig_5.png'),
  require('../assets/profileimage/pig_6.png'),
  require('../assets/profileimage/pig_7.png'),
  require('../assets/profileimage/pig_8.png'),
  require('../assets/profileimage/pig_9.png')
];

const SignupScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileIndex, setProfileIndex] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(profileImages[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * profileImages.length);
    setSelectedImage(profileImages[randomIndex]);
    setProfileIndex(randomIndex);
  }, []);

  const handleSignup = async () => {
    if (!nickname || !username || !password || !confirmPassword) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    const existing = await AsyncStorage.getItem('users');
    const users = existing ? JSON.parse(existing) : [];

    const duplicate = users.find(u => u.username === username);
    if (duplicate) {
      Alert.alert('중복 아이디', '이미 사용 중인 아이디입니다.');
      return;
    }

    const newUser = {
      username,
      password,
      name: nickname,
      profile: profileIndex,
    };

    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    Alert.alert('회원가입 완료', '이제 로그인해 주세요!');
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 고정 영역 */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.mainContentContainer}>
        <Text style={styles.welcomeText}>환영합니다!</Text>

        <View style={styles.imageRow}>
          <Image source={selectedImage} style={styles.profileImage} />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 15 }]}
            placeholder="닉네임"
            value={nickname}
            onChangeText={setNickname}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FEF6DC',
  },
  backButtonContainer: {
    paddingHorizontal: '5%',
    paddingTop: '10%',
  },
  backButton: {
    padding: 5,
  },
  welcomeText: {
    fontSize: 32,
    fontFamily: 'SDSamliphopangcheTTFBasic',
    color: '#8b4a21',
    textAlign: 'center',
    marginBottom: '15%',
  },
  mainContentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '10%',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10%',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  input: {
    height: 50,
    borderColor: '#D2B48C',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: '5%',
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8b4a21',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: '25%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
