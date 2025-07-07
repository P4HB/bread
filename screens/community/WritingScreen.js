import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addPost } from './CommunityPostData';

const WritingScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const handleGallerySelect = () => {
    navigation.navigate('select gallery', {
      mode: 'select',
      onGoBack: (images) => {
        if (images.length > 0) {
          setSelectedImages(images); // 여러 장 저장
        }
      },
    });
  };


  const handleSubmit = () => {
    const post = {
      id: Date.now().toString(),
      title,
      content,
      writer: '익명',
      images: selectedImages, // uri로 변환하지 않고 이미지 객체 그대로 저장
    };
  
    console.log('[작성됨]', post);
    addPost(post);         // 메모리에 저장
    navigation.goBack();   // 커뮤니티 목록으로 이동
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingBottom: 70 }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>빵뮤니티</Text>
        <Image
          source={require('../../assets/pig-community.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>제목</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="제목을 입력하세요"
        />

        <Text style={styles.label}>내용</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="내용을 입력하세요"
          multiline
        />

        <TouchableOpacity style={styles.galleryButton} onPress={handleGallerySelect}>
          <Text style={styles.galleryButtonText}>사진 선택하기</Text>
        </TouchableOpacity>

        {selectedImages.length > 0 && (
          <View style={styles.imageGrid}>
            {selectedImages.map((img, index) => (
              <Image
                key={index}
                source={img}
                style={styles.gridImage}
                resizeMode="cover"
              />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>작성 완료</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const screenWidth = Dimensions.get('window').width;
const imageSpacing = 8;
const imageWidth = (screenWidth - 40 - imageSpacing) / 2; // 양쪽 padding 20씩 + 간격

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fdf2e7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8b4a21',
  },
  headerImage: {
    width: 200,
    height: 120,
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  galleryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#d2691e',
    borderRadius: 8,
    alignItems: 'center',
  },
  galleryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  gridImage: {
    width: imageWidth,
    height: 140,
    borderRadius: 10,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#8B4513',
    marginTop: 24,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WritingScreen;
