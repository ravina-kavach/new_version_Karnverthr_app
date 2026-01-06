import React from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { CommonSelector } from '../store/reducers/commonSlice';
import { responsiveHeight } from '../utils/metrics';

const GreetingHeader = ({ name = '', navigateScreen , desc, avatar,containerStyle }) => {
  const { t } = useTranslation();
const { UsersigninData } = useSelector(CommonSelector);
  const Navigation = useNavigation();
  const getInitials = (fullName) => {
    if (!fullName) return '';
    const words = fullName.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#F97316', 
      '#3B82F6', 
      '#10B981',
      '#8B5CF6', 
      '#EF4444', 
      '#14B8A6', 
      '#F59E0B', 
    ];

    if (!name) return colors[0];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const bgColor = getAvatarColor(UsersigninData.full_name || UsersigninData.name);
  const initials = getInitials(UsersigninData.full_name || UsersigninData.name);

  const navigateProfile = () =>{
    const screen = navigateScreen ? navigateScreen : "profile"
    return Navigation.navigate(screen)
  }
  return (
    <TouchableOpacity activeOpacity={1} onPress={()=>{}} style={[styles.container,containerStyle]}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.initialAvatar, { backgroundColor: bgColor }]}>
          <Text style={styles.initialText}>{initials}</Text>
        </View>
      )}
      <View>
        <Text style={styles.title}>{t('comman.Hello')} {UsersigninData.full_name}</Text>
        <Text style={styles.subtitle}>{ desc? desc : t('comman.Welcome')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop:Platform.OS === 'android' ? responsiveHeight(3) : 0
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  initialAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
});


export default GreetingHeader;
