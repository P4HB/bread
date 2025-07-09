// MyPageScreen.js

import React, { useState, useMemo, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getPosts } from './community/CommunityPostData';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ... (profileImages, colors는 동일)
const profileImages = [
    require('../assets/profileimage/pig_1.png'),
    require('../assets/profileimage/pig_2.png'),
    require('../assets/profileimage/pig_3.png'),
    require('../assets/profileimage/pig_4.png'),
    require('../assets/profileimage/pig_5.png'),
    require('../assets/profileimage/pig_6.png'),
    require('../assets/profileimage/pig_7.png'),
    require('../assets/profileimage/pig_8.png'),
    require('../assets/profileimage/pig_9.png'),
  ];
  
  const colors = {
    background: '#FDF9F3',
    point: '#D58C6B',
    textDark: '#5D4037',
    textLight: '#A1887F',
    cardBackground: '#F5EFE6',
    separator: '#EBE4D4',
  };

const SAVED_BAKERIES_KEY = 'saved_bakeries';
// ⭐️ 방문 기록 키
const VISIT_HISTORY_KEY = 'visit_history';

const MyPageScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const [mainTab, setMainTab] = useState('activity');
  const [subTab, setSubTab] = useState('posts');
  const [savedBakeries, setSavedBakeries] = useState([]);
  
  // ⭐️ 방문 기록 관련 state 추가
  const [visitHistory, setVisitHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateVisits, setSelectedDateVisits] = useState([]);

  // ⭐️ 캘린더에 표시할 점(markedDates) 계산
  const markedDates = useMemo(() => {
    const marks = {};
    visitHistory.forEach(visit => {
      // ⭐️ 이미 날짜에 점이 찍혀있지 않을 때만 추가 (중복 방지)
      if (!marks[visit.date]) {
        marks[visit.date] = { marked: true, dotColor: colors.point };
      }
    });
    // 선택된 날짜는 다른 스타일로 표시
    if (selectedDate) {
      marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: colors.point };
    }
    return marks;
  }, [visitHistory, selectedDate]);

  // ... (myPosts, myComments는 동일)
  const allPosts = getPosts();
  const myPosts = allPosts.filter(post => post.writer === user.name);
  const myComments = useMemo(() => {
    const comments = [];
    allPosts.forEach(post => {
      if (post.comments && Array.isArray(post.comments)) {
        post.comments.forEach(comment => {
          if (comment.name === user.name) {
            comments.push({ ...comment, post: post });
          }
        });
      }
    });
    return comments;
  }, [allPosts, user.name]);

  // ⭐️ 화면이 포커스될 때마다 데이터 다시 로드
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (mainTab === 'saved') {
          const saved = await AsyncStorage.getItem(SAVED_BAKERIES_KEY);
          setSavedBakeries(saved ? JSON.parse(saved) : []);
        } else if (mainTab === 'history') {
          const visits = await AsyncStorage.getItem(VISIT_HISTORY_KEY);
          setVisitHistory(visits ? JSON.parse(visits) : []);
        }
      };
      loadData();
    }, [mainTab])
  );

  // ⭐️ 날짜 클릭 핸들러
  const handleDayPress = (day) => {
    const dateStr = day.dateString;
    setSelectedDate(dateStr);
    
    // 클릭된 날짜에 해당하는 방문 기록 필터링
    const visitsOnDay = visitHistory.filter(visit => visit.date === dateStr);
    setSelectedDateVisits(visitsOnDay);
  };

  // ... (renderPostItem, renderCommentItem, renderSavedBakeryItem은 동일)
  const renderPostItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('커뮤니티', { screen: '글 내용', params: { post: item, user: user } })}>
      <View style={styles.contentItem}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemContent} numberOfLines={2}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCommentItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('커뮤니티', { screen: '글 내용', params: { post: item.post, user: user } })}>
      <View style={styles.contentItem}>
        <Text style={styles.itemTitle}>{item.text}</Text>
        <Text style={styles.itemContent} numberOfLines={1}>- 원본글: {item.post.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSavedBakeryItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('음식점', { screen: 'Gallery', params: { restaurantId: item.id, dong: item.dong }})}>
       <View style={styles.savedBakeryItem}>
         <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.bakeryImage} />
         <View style={styles.bakeryInfo}>
           <Text style={styles.itemTitle}>{item.name}</Text>
           <Text style={styles.itemContent}>{item.dong}</Text>
         </View>
       </View>
    </TouchableOpacity>
  );

  const renderVisitHistoryItem = ({ item }) => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('음식점', {
        screen: 'Gallery',
        params: { restaurantId: item.restaurantId, dong: item.dong }
      })
    }
  >
    <View style={styles.savedBakeryItem}>
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.bakeryImage}
      />
      <View style={styles.bakeryInfo}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemContent}>{item.dong}</Text>
        {/* <Text style={styles.itemContent}>{item.date}</Text> 방문 날짜도 보여주기 가능 */}
      </View>
    </View>
  </TouchableOpacity>
);

const renderContent = () => {
  if (mainTab === 'activity') {
    return (
      <FlatList
        key={subTab}
        data={subTab === 'posts' ? myPosts : myComments}
        renderItem={subTab === 'posts' ? renderPostItem : renderCommentItem}
        keyExtractor={(item, index) => `${subTab}-${item.id || index}`}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.subTabSection}>
            <TouchableOpacity
              onPress={() => setSubTab('posts')}
              style={[styles.subTab, subTab === 'posts' && styles.activeSubTab]}
            >
              <Text style={[styles.subTabText, subTab === 'posts' && styles.activeSubTabText]}>작성한 글</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSubTab('comments')}
              style={[styles.subTab, subTab === 'comments' && styles.activeSubTab]}
            >
              <Text style={[styles.subTabText, subTab === 'comments' && styles.activeSubTabText]}>작성한 댓글</Text>
            </TouchableOpacity>
          </View>
        }
      />
    );
  } else if (mainTab === 'saved') {
    return (
      <FlatList
        data={savedBakeries}
        renderItem={renderSavedBakeryItem}
        keyExtractor={(item) => `${item.dong}-${item.id}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>저장한 빵집이 없어요.</Text>
        }
      />
    );
  } else {
    // mainTab === 'history'
    return (
      <View style={styles.historyContainer}>
        <Calendar
          markedDates={markedDates}
          theme={calendarTheme}
          onDayPress={handleDayPress}
        />
        {selectedDate && (
          <FlatList
            data={selectedDateVisits}
            renderItem={renderVisitHistoryItem} // ✅ 방문 기록 전용 렌더러 사용
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={
              <Text style={styles.visitListHeader}>{selectedDate} 방문 기록</Text>
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>해당 날짜의 방문 기록이 없어요.</Text>
            }
          />
        )}
      </View>
    );
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={profileImages[user.profile]} style={styles.profileImage} />
        <Text style={styles.nickname}>{user.name}</Text>
        <Text style={styles.profileSubtitle}>빵순이의 일상 기록</Text>
      </View>

      <View style={styles.mainTabSection}>
        <TouchableOpacity onPress={() => setMainTab('activity')} style={[styles.mainTab, mainTab === 'activity' && styles.activeMainTab]}><Text style={[styles.mainTabText, mainTab === 'activity' && styles.activeMainTabText]}>내 활동</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setMainTab('saved')} style={[styles.mainTab, mainTab === 'saved' && styles.activeMainTab]}><Text style={[styles.mainTabText, mainTab === 'saved' && styles.activeMainTabText]}>저장한 빵집</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setMainTab('history')} style={[styles.mainTab, mainTab === 'history' && styles.activeMainTab]}><Text style={[styles.mainTabText, mainTab === 'history' && styles.activeMainTabText]}>방문 기록</Text></TouchableOpacity>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
};

const calendarTheme = { backgroundColor: colors.background, calendarBackground: colors.background, textSectionTitleColor: colors.point, selectedDayBackgroundColor: colors.point, selectedDayTextColor: '#ffffff', todayTextColor: colors.point, dayTextColor: colors.textDark, textDisabledColor: colors.textLight, dotColor: colors.point, selectedDotColor: '#ffffff', arrowColor: colors.point, monthTextColor: colors.textDark, textDayFontWeight: '300', textMonthFontWeight: 'bold', textDayHeaderFontWeight: '300', textDayFontSize: 16, textMonthFontSize: 16, textDayHeaderFontSize: 14 };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: "15%", paddingBottom: 80 },
  profileSection: {paddingHorizontal: 30, alignItems: 'center', marginBottom: 20},
  profileImage: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  profileSubtitle: { fontSize: 14, color: colors.textLight, marginTop: 4, fontFamily: 'SDSamliphopangcheTTFBasic', },
  nickname: { fontSize: 22, fontWeight: 'bold', color: colors.textDark },
  mainTabSection: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.separator },
  mainTab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeMainTab: { borderBottomWidth: 2.5, borderBottomColor: colors.point },
  mainTabText: { fontSize: 16, color: colors.textLight, fontWeight: '500' },
  activeMainTabText: { color: colors.textDark, fontWeight: 'bold' },
  subTabSection: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  subTab: { marginRight: 20, paddingBottom: 8 },
  activeSubTab: { borderBottomWidth: 2, borderBottomColor: colors.point },
  subTabText: { fontSize: 15, color: colors.textLight },
  activeSubTabText: { fontWeight: 'bold', color: colors.textDark },
  listContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  contentItem: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: colors.textDark },
  itemContent: { fontSize: 14, color: colors.textDark, lineHeight: 20 },
  savedBakeryItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12, },
  bakeryImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15, },
  bakeryInfo: { flex: 1 },
  emptyText: { textAlign: 'center', marginTop: 50, color: colors.textLight, fontSize: 16},
  
  // ⭐️ 방문 기록 탭 컨테이너 스타일
  historyContainer: { flex: 1 },
  visitListHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
    marginTop: 10
  }
});

export default MyPageScreen;