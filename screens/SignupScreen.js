import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 프로필 이미지 목록
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
    // 컴포넌트 마운트 시 랜덤 이미지 선택
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
      profile: profileIndex, // 실제 경로 저장해도 되고 생략해도 됨
    };

    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    Alert.alert('회원가입 완료', '이제 로그인해 주세요!');
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 뒤로가기 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}> 환영합니다! </Text>
      </View>

      <View style={styles.container}>
        {/* 이미지 + 닉네임 */}
        <View style={styles.imageRow}>
          <Image source={selectedImage} style={styles.profileImage} />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 15 }]}
            placeholder="닉네임"
            value={nickname}
            onChangeText={setNickname}
          />
        </View>

        {/* 아래쪽 입력 필드들 */}
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={username}
          onChangeText={setUsername}
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
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10
  },
  headerText: {
    position: 'absolute',
    top : 100,
    width : 370,
    textAlign : 'center',
    fontSize: 40,
    // fontWeight: 'bold',
    fontFamily : 'SDSamliphopangcheTTFBasic',
    color: '#8b4a21',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FEF6DC',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    // backgroundColor: 'pink'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: '#D2B48C',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});
