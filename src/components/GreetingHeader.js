import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { CommonSelector } from '../store/reducers/commonSlice';
import { FontSize, responsiveHeight } from '../utils/metrics';
import { GlobalFonts } from '../theme/typography';
import { EditIcon, NotificationIcon } from '../assets/svgs';
import { COLOR } from '../theme/theme';
import useNotifications from '../screens//notifications/NotificationsController';

const GreetingHeader = ({
  desc,
  avatar,
  containerStyle,
  screenName,
  onAvatarPress,
}) => {
  const { t } = useTranslation();
  const { UserDetailsData, isProfileUpdateFetching } = useSelector(CommonSelector);
  const navigation = useNavigation();
  const { badgeCount } = useNotifications();

  const navigateProfile = () => {
    if (screenName !== 'editProfile') {
      navigation.navigate('profile');
    }
  };

  const navigateToNotification = () => {
    navigation.navigate('notifications');
  };

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const words = fullName.trim().split(' ');
    return words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444'];
    let hash = 0;
    for (let i = 0; i < name?.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(UserDetailsData?.name);
  const bgColor = getAvatarColor(initials);
  const notificationCount = badgeCount;
  console.log("notificationCount===>", notificationCount)
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, containerStyle]}
      onPress={navigateProfile}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={screenName !== 'editProfile'}
        onPress={onAvatarPress}
      >
        <View style={styles.avatarWrapper}>
          {UserDetailsData?.image_url ? (
            <Image
              source={{ uri: avatar || UserDetailsData.image_url }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.initialAvatar,
                {
                  backgroundColor: !UserDetailsData?.image_url
                    ? COLOR.Transparent
                    : bgColor,
                },
              ]}
            >
              <Text style={styles.initialText}>{initials}</Text>
            </View>
          )}

          {(isProfileUpdateFetching || !UserDetailsData?.image_url) && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}

          {screenName === 'editProfile' && (
            <TouchableOpacity style={styles.editIcon} onPress={onAvatarPress}>
              <EditIcon width={22} height={22} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {screenName === 'editProfile'
            ? UserDetailsData?.name ?? ''
            : `${t('comman.Hello')} ${UserDetailsData?.name ?? ''}`}
        </Text>
        <Text style={styles.subtitle}>
          {desc || t('comman.Welcome')}
        </Text>
      </View>

      {screenName !== 'editProfile' && (
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={navigateToNotification}
        >
          <NotificationIcon />
          {notificationCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={[styles.badgeText, { fontSize: notificationCount > 99 ? 9 : 10 }]}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default GreetingHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop:
      Platform.OS === 'android'
        ? responsiveHeight(3)
        : responsiveHeight(6),
  },

  avatarWrapper: {
    width: 44,
    height: 44,
    marginRight: 12,
    position: 'relative',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  initialAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  initialText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: FontSize.Font18,
    ...GlobalFonts.subtitle,
    fontWeight: '600',
  },

  subtitle: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font15,
    color: '#777',
    marginTop: 2,
  },
  notificationIcon: {
    position: 'absolute',
    right: 25,
    padding: 10,
  },

  badgeContainer: {
    position: "absolute",
    top: 2,
    right: 0,
    backgroundColor: "#FF3B30",
    borderRadius: 14,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: 'center',
  },

  editIcon: {
    position: 'absolute',
    bottom: -4,
    right: 0,
  },

  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});