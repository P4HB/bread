// MyGalleryScreen.js with pagination and indicator
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Image, Text, ImageBackground,
  TouchableOpacity, Modal, StyleSheet, Dimensions
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { launchCamera } from 'react-native-image-picker';
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
const windowHeight = Dimensions.get('window').height;

const MyGalleryScreen = ({ navigation, route }) => {
  const mode = route?.params?.mode || 'view';
  const onGoBack = route?.params?.onGoBack;
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setUserImages(parsed);
      const all = [
        ...staticImages.map(i => ({ source: i })),
        ...parsed.map(uri => ({ source: { uri } }))
      ];
      setImageList(all);
    };
    loadImages();
  }, []);

  const handleImagePress = (index) => {
    const img = imageList[index];
    if (mode === 'select') {
      setSelectedIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setCurrentImage(img.source);
      setModalVisible(true);
    }
  };

  const handleSelectConfirm = () => {
    const selectedImages = selectedIndices.map((i) => imageList[i].source);
    if (onGoBack) onGoBack(selectedImages);
    navigation.goBack();
  };

  const handleTakePhoto = async () => {
    await launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
        quality: 1,
      },
      async (response) => {
        if (response.didCancel || response.errorCode) return;
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          const updated = [...userImages, uri];
          setUserImages(updated);
          const all = [
            ...staticImages.map(i => ({ source: i })),
            ...updated.map(u => ({ source: { uri: u } }))
          ];
          setImageList(all);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      }
    );
  };

  const pageSize = 9;
  const pages = [];
  for (let i = 0; i < imageList.length; i += pageSize) {
    pages.push(imageList.slice(i, i + pageSize));
  }

  let pagerRef = React.useRef(null);

  const goToPrevPage = () => {
    if (currentPage > 0) {
      pagerRef.current.setPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      pagerRef.current.setPage(currentPage + 1);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/myGallery.png')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <PagerView
          style={{ flex: 1 }}
          initialPage={0}
          ref={pagerRef}
          onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
        >
          {pages.map((pageImages, pageIndex) => (
            <View key={pageIndex} style={styles.page}>
              <View style={styles.grid}>
                {pageImages.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.imageBox,
                      mode === 'select' &&
                      selectedIndices.includes(pageIndex * pageSize + index) &&
                      styles.selectedBox,
                    ]}
                    onPress={() => handleImagePress(pageIndex * pageSize + index)}
                  >
                    <Image source={img.source} style={styles.image} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </PagerView>

        {/* 좌우 버튼 */}
        <View style={styles.pageButtons}>
          <TouchableOpacity onPress={goToPrevPage} disabled={currentPage === 0}>
            <Ionicons name="chevron-back-circle" size={36} color={currentPage === 0 ? '#ccc' : '#8B4513'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextPage} disabled={currentPage === pages.length - 1}>
            <Ionicons name="chevron-forward-circle" size={36} color={currentPage === pages.length - 1 ? '#ccc' : '#8B4513'} />
          </TouchableOpacity>
        </View>

        {/* 페이지 indicator */}
        <View style={styles.pageIndicator}>
          <Text style={{ color: '#8B4513', fontWeight: 'bold' }}>{currentPage + 1} / {pages.length}</Text>
        </View>

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
          <Modal transparent animationType="fade">
            <View style={styles.modalBackground}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalImageWrapper}>
                <Image source={currentImage} style={styles.modalImage} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;
const imageSize = (windowWidth - 60) / 3;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
    // paddingBottom: '30%',
  },
  page: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: '78%',
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

  // 이미지 클릭 시
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
    bottom: '11%',
    right: '43%',
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

  pageButtons: {
    position: 'absolute',
    bottom: '14%',
    left: '5%',
    right: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});

export default MyGalleryScreen;