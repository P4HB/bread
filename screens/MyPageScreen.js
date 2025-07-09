// MyPageScreen.js

import React, { useState, useMemo, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getPosts } from './community/CommunityPostData';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// (profileImages, colors 등은 동일하므로 생략)
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
const VISIT_HISTORY_KEY = 'visit_history';

const MyPageScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const [mainTab, setMainTab] = useState('activity');
  const [subTab, setSubTab] = useState('posts');
  const [savedBakeries, setSavedBakeries] = useState([]);
  
  const [visitHistory, setVisitHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateVisits, setSelectedDateVisits] = useState([]);

  const markedDates = useMemo(() => {
    const marks = {};
    visitHistory.forEach(visit => {
      if (!marks[visit.date]) {
        marks[visit.date] = { marked: true, dotColor: colors.point };
      }
    });
    if (selectedDate) {
      marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: colors.point };
    }
    return marks;
  }, [visitHistory, selectedDate]);

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

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const saved = await AsyncStorage.getItem(SAVED_BAKERIES_KEY);
        setSavedBakeries(saved ? JSON.parse(saved) : []);

        const visits = await AsyncStorage.getItem(VISIT_HISTORY_KEY);
        setVisitHistory(visits ? JSON.parse(visits) : []);
      };
      loadData();
    }, [])
  );

  const handleDayPress = (day) => {
    const dateStr = day.dateString;
    setSelectedDate(dateStr);
    const visitsOnDay = visitHistory.filter(visit => visit.date === dateStr);
    setSelectedDateVisits(visitsOnDay);
  };

  const renderPostItem = (item, index) => (
    <TouchableOpacity key={`post-${item.id || index}`} onPress={() => navigation.navigate('커뮤니티', { screen: '글 내용', params: { post: item, user: user } })}>
      <View style={styles.contentItem}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemContent} numberOfLines={2}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCommentItem = (item, index) => (
    <TouchableOpacity key={`comment-${index}`} onPress={() => navigation.navigate('커뮤니티', { screen: '글 내용', params: { post: item.post, user: user } })}>
      <View style={styles.contentItem}>
        <Text style={styles.itemTitle}>{item.text}</Text>
        <Text style={styles.itemContent} numberOfLines={1}>- 원본글: {item.post.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSavedBakeryItem = (item) => (
    <TouchableOpacity key={`${item.dong}-${item.id}`} onPress={() => navigation.navigate('음식점', { screen: 'Gallery', params: { restaurantId: item.id, dong: item.dong }})}>
       <View style={styles.savedBakeryItem}>
         <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.bakeryImage} />
         <View style={styles.bakeryInfo}>
           <Text style={styles.itemTitle}>{item.name}</Text>
           <Text style={styles.itemContent}>{item.dong}</Text>
         </View>
       </View>
    </TouchableOpacity>
  );

  const renderVisitHistoryItem = (item) => (
    <TouchableOpacity key={`visit-${item.id}`} onPress={() => navigation.navigate('음식점', { screen: 'Gallery', params: { restaurantId: item.restaurantId, dong: item.dong }})}>
      <View style={styles.savedBakeryItem}>
        <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.bakeryImage}/>
        <View style={styles.bakeryInfo}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemContent}>{item.dong}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (mainTab === 'activity') {
      const data = subTab === 'posts' ? myPosts : myComments;
      const renderer = subTab === 'posts' ? renderPostItem : renderCommentItem;
      return (
        <View>
          <View style={styles.subTabSection}>
            <TouchableOpacity onPress={() => setSubTab('posts')} style={[styles.subTab, subTab === 'posts' && styles.activeSubTab]}>
              <Text style={[styles.subTabText, subTab === 'posts' && styles.activeSubTabText]}>작성한 글</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSubTab('comments')} style={[styles.subTab, subTab === 'comments' && styles.activeSubTab]}>
              <Text style={[styles.subTabText, subTab === 'comments' && styles.activeSubTabText]}>작성한 댓글</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listContainer}>
            {data.length > 0 ? data.map(renderer) : <Text style={styles.emptyText}>작성한 내용이 없어요.</Text>}
          </View>
        </View>
      );
    } else if (mainTab === 'saved') {
      return (
        <View style={styles.listContainer}>
          {savedBakeries.length > 0 ? (
            savedBakeries.map(renderSavedBakeryItem)
          ) : (
            <Text style={styles.emptyText}>저장한 빵집이 없어요.</Text>
          )}
        </View>
      );
    } else { // mainTab === 'history'
      return (
        <View style={styles.historyContainer}>
          <Calendar
            markedDates={markedDates}
            theme={calendarTheme}
            onDayPress={handleDayPress}
          />
          {selectedDate && (
            <View>
              <Text style={styles.visitListHeader}>{selectedDate} 방문 기록</Text>
              <View style={styles.listContainer}>
                {selectedDateVisits.length > 0 ? (
                  selectedDateVisits.map(renderVisitHistoryItem)
                ) : (
                  <Text style={styles.emptyText}>해당 날짜의 방문 기록이 없어요.</Text>
                )}
              </View>
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* [수정] ScrollView에 contentContainerStyle을 적용합니다. */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
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
        
        {/* [제거] 불필요해진 임시 여백 View를 제거합니다. */}
        {/* <View style={{ height: 50 }} /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const calendarTheme = { backgroundColor: colors.background, calendarBackground: colors.background, textSectionTitleColor: colors.point, selectedDayBackgroundColor: colors.point, selectedDayTextColor: '#ffffff', todayTextColor: colors.point, dayTextColor: colors.textDark, textDisabledColor: colors.textLight, dotColor: colors.point, selectedDotColor: '#ffffff', arrowColor: colors.point, monthTextColor: colors.textDark, textDayFontWeight: '300', textMonthFontWeight: 'bold', textDayHeaderFontWeight: '300', textDayFontSize: 16, textMonthFontSize: 16, textDayHeaderFontSize: 14 };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  // [추가] ScrollView의 contentContainer를 위한 스타일
  scrollContainer: {
    paddingBottom: 100, // 탭바 높이와 여유 공간을 고려한 넉넉한 값
  },
  profileSection: { paddingTop: "15%", paddingHorizontal: 30, alignItems: 'center', marginBottom: 20 },
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
  listContainer: { paddingHorizontal: 20, paddingTop: 10 },
  contentItem: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: colors.textDark },
  itemContent: { fontSize: 14, color: colors.textDark, lineHeight: 20 },
  savedBakeryItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12, },
  bakeryImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15, },
  bakeryInfo: { flex: 1 },
  emptyText: { textAlign: 'center', marginTop: 50, color: colors.textLight, fontSize: 16},
  
  historyContainer: { },
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