import React, { useState, useEffect } from 'react';
import {SafeAreaView, ScrollView, View, Image, Text,
  TouchableOpacity, Modal, StyleSheet, Dimensions} from 'react-native';

import { launchCamera } from 'react-native-image-picker'; // ✅ react-native-image-picker로 교체
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const STORAGE_KEY = 'user_gallery_images';

const staticImages = [
  require('../assets/galleryimage/bread_gallery1.png'),
  require('../assets/galleryimage/bread_gallery2.png'),
  require('../assets/galleryimage/bread_gallery3.png'),
  require('../assets/galleryimage/bread_gallery4.png'),
  require('../assets/galleryimage/bread_gallery5.png'),
  require('../assets/galleryimage/bread_gallery6.png'),
  require('../assets/galleryimage/bread_gallery7.png'),
  require('../assets/galleryimage/bread_gallery8.png'),
  require('../assets/galleryimage/bread_gallery9.png'),
  require('../assets/galleryimage/bread_gallery10.png'),
  require('../assets/galleryimage/bread_gallery11.png'),
  require('../assets/galleryimage/bread_gallery12.png'),
  require('../assets/galleryimage/bread_gallery13.png'),
  require('../assets/galleryimage/bread_gallery14.png'),
  require('../assets/galleryimage/bread_gallery15.png'),
  require('../assets/galleryimage/bread_gallery16.png'),
  require('../assets/galleryimage/bread_gallery17.png'),
  require('../assets/galleryimage/bread_gallery18.png'),
  require('../assets/galleryimage/bread_gallery19.png'),
  require('../assets/galleryimage/bread_gallery20.png'),
];

const MyGalleryScreen = ({ navigation, route }) => {
  const mode = route?.params?.mode || 'view';
  const onGoBack = route?.params?.onGoBack;
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setUserImages(parsed);
      setImageList([
        ...staticImages.map(i => ({ source: i })),
        ...parsed.map(uri => ({ source: { uri } })),
      ]);
    };
    loadImages();
  }, []);

  const handleImagePress = (index) => {
    const img = imageList[index];
    if (mode === 'select') {
      setSelectedIndices((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setCurrentImage(img.source);
      setModalVisible(true);
    }
  };

  const handleSelectConfirm = () => {
    const selectedImages = selectedIndices.map((i) => imageList[i].source);
    if (onGoBack) {
      onGoBack(selectedImages);
    }
    navigation.goBack();
  };

  const handleTakePhoto = async () => {
    // react-native-image-picker는 별도의 권한 요청 API는 없고, AndroidManifest.xml에 권한만 설정하면 된다.

    const result = await launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,   // 📥 시스템 갤러리에 저장하려면 true
        quality: 1,
      },
      async (response) => {
        if (response.didCancel) {
          return;
        } else if (response.errorCode) {
          alert(`사진 촬영 실패: ${response.errorMessage}`);
          return;
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;

          // 🧠 AsyncStorage에도 URI 저장
          const updated = [...userImages, uri];
          setUserImages(updated);

          const fullList = [
            ...staticImages.map(i => ({ source: i })),
            ...updated.map(u => ({ source: { uri: u } })),
          ];
          setImageList(fullList);

          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>나의 갤러리</Text>
        <Image
          source={require('../assets/pig_gallery.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>
      <ScrollView contentContainerStyle={[styles.grid, { paddingBottom: 70 }]}>
        {imageList.map((img, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.imageBox,
              mode === 'select' && selectedIndices.includes(index) && styles.selectedBox,
            ]}
            onPress={() => handleImagePress(index)}
          >
            <Image source={img.source} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {mode === 'select' && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleSelectConfirm}>
          <Text style={styles.confirmText}>선택 완료</Text>
        </TouchableOpacity>
      )}
      {mode === 'view' && (
        <TouchableOpacity style={styles.takePhotoButton} onPress={handleTakePhoto}>
          <Ionicons name="camera" size={28} color="#fff" />
        </TouchableOpacity>
      )}
      {modalVisible && currentImage && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.modalBackground}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalImageWrapper}>
              <Image source={currentImage} style={styles.modalImage} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;
const imageSize = (windowWidth - 48) / 3;

const styles = StyleSheet.create({
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  imageBox: {
    width: imageSize,
    height: imageSize,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  selectedBox: {
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageWrapper: {
    width: '90%',
    height: '80%',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    backgroundColor: '#8B4513',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  takePhotoButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyGalleryScreen;
