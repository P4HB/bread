// LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  Image, SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const stored = await AsyncStorage.getItem('users');
    const users = stored ? JSON.parse(stored) : [];
    console.log('저장된 유저:', users);
    const matched = users.find(
      user => user.username === username && user.password === password
    );

    if (matched) {
      Alert.alert('로그인 성공', `${matched.name}님 환영합니다!`);
      navigation.navigate('Main', { user: matched }); // 홈 화면으로 이동
    } else {
      Alert.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
          <Image
              source={require('../assets/login_pig.png')}
              style={styles.pigImage}
          />
        <Text style={styles.title}>로그인</Text>

        <TextInput
          style={styles.input}
          placeholder="아이디"
          onChangeText={setUsername}
          value={username}
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>아직 회원이 아니신가요? 회원가입</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex:1,
    backgroundColor: "#FEF6DC"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
    pigImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  title: {
    fontSize: 35,
    marginBottom: 30,
    textAlign: 'center',
    fontFamily : 'SDSamliphopangcheTTFBasic',
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
  },
  link: {
    marginTop: 20,
    color: '#555',
    textAlign: 'center'
  }
});

export default LoginScreen;