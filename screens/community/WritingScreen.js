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
import { useNavigation } from '@react-navigation/native';
import { addPost } from './CommunityPostData';

const WritingScreen = ({route}) => {
  const {user} = route.params;
  console.log('user:', user);
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const handleGallerySelect = () => {
    navigation.navigate('select gallery', {
      mode: 'select',
      onGoBack: (images) => {
        if (images.length > 0) {
          setSelectedImages(images);
        }
      },
    });
  };

  const handleSubmit = () => {
    const post = {
      id: Date.now().toString(),
      title,
      content,
      writer: user.name,
      profileImage : user.profile,
      images: selectedImages,
    };

    console.log('[작성됨]', post);
    addPost(post);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
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
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>내용</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="내용을 입력하세요"
          placeholderTextColor="#aaa"
          multiline
        />

        <TouchableOpacity style={styles.galleryButton} onPress={handleGallerySelect}>
          <Text style={styles.galleryButtonText}>사진 선택하기</Text>
        </TouchableOpacity>

        {selectedImages.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageScroll}
            contentContainerStyle={styles.imageScrollContent}
          >
            {selectedImages.map((img, index) => (
              <Image
                key={index}
                source={img}
                style={styles.scrollImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>작성 완료</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fdf2e7',
    paddingBottom: 80 
  },
  header: {
    backgroundColor: '#fdf2e7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: '7%',
    paddingBottom: '3%',
    height:'25%'
  },
  headerText: {
    fontSize: 40,
    // fontWeight: 'bold',
    fontFamily : 'SDSamliphopangcheTTFBasic',
    color: '#8b4a21',
    marginLeft:'5%'
  },
  headerImage: {
    width: 160,
    height: 120,
    marginRight:'5%'
  },
  container: {paddingHorizontal: 30, paddingVertical:15},

  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginTop:5,
    marginBottom:10,
    borderRadius: 10,
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingHorizontal:20
  },

  galleryButton: {
    marginTop: 25,
    padding: 12,
    backgroundColor: '#d2691e',
    borderRadius: 10,
    alignItems: 'center',
  },
  galleryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  imageScroll: {
    marginTop: 16,
    maxHeight: 130,
  },
  imageScrollContent: {
    paddingHorizontal: 4,
    gap: 10,
  },
  scrollImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 10,
  },

  button: {
    backgroundColor: '#8B4513',
    marginTop: '15%',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default WritingScreen;
