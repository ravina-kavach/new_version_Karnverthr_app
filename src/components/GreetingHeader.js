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
import { EditIcon } from '../assets/svgs';
import { COLOR } from '../theme/theme';

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
  const navigateProfile = () => {
    if (screenName !== 'editProfile') {
      navigation.navigate('profile');
    }
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

  const initials = getInitials(
    UserDetailsData.name
  );
  const bgColor = getAvatarColor(initials);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, containerStyle]}
      onPress={navigateProfile}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={screenName === 'editProfile' ? onAvatarPress : undefined}
      >
        <View style={styles.avatarWrapper}>
          {UserDetailsData.image_url ? (
            <Image
              source={{ uri: avatar || UserDetailsData.image_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.initialAvatar, { backgroundColor: !UserDetailsData.image_url ? COLOR.Transparent : bgColor }]}>
              <Text style={styles.initialText}>{initials}</Text>
            </View>
          )}

          {isProfileUpdateFetching || !UserDetailsData.image_url  && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}

          {screenName === 'editProfile' && (
            <TouchableOpacity
              style={styles.editIcon}
              onPress={onAvatarPress}
            >
              <EditIcon width={22} height={22} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>


      <View>
        <Text style={styles.title}>
          {screenName === 'editProfile'
            ? UserDetailsData?.name ?? ''
            : `${t('comman.Hello')} ${UserDetailsData?.name ?? ''}`
          }
        </Text>
        <Text style={styles.subtitle}>
          {desc || t('comman.Welcome')}
        </Text>
      </View>
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
  editIcon: {
    position: 'absolute',
    bottom: -4,
    right: 0,
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
  avatarWrapper: {
  width: 44,
  height: 44,
  marginRight: 12,
  position: 'relative',
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
