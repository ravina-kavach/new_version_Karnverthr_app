import { Dimensions, Platform, PixelRatio } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const insets = initialWindowMetrics?.insets || {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

// Raw screen sizes
const screenWidth = SCREEN_WIDTH;
const screenHeight = SCREEN_HEIGHT;

// Safe area
const safeTop = insets.top;
const safeBottom = insets.bottom;
const safeLeft = insets.left;
const safeRight = insets.right;

// Platform detection
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

// Responsive percentages (cross-device reliable)
const responsiveWidth = p => wp(p);
const responsiveHeight = p => hp(p);

const usableHeight = SCREEN_HEIGHT - insets.top - insets.bottom;
const usableWidth = SCREEN_WIDTH - insets.left - insets.right;

const guidelineBaseWidth = 375;

const getFont = size => {
  const scale = usableWidth / guidelineBaseWidth;

  let newSize = size * scale;

  // Adjust based on platform differences
  if (Platform.OS === 'ios') {
    newSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    newSize = Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  }

  // Prevent extremely small fonts
  if (newSize < size - 2) newSize = size;

  // Prevent huge fonts on tablets
  if (newSize > size * 1.4) newSize = size * 1.3;

  return newSize;
};

const FontSize = {
  Font8: getFont(8),
  Font10: getFont(10),
  Font12: getFont(12),
  Font14: getFont(14),
  Font15: getFont(15),
  Font16: getFont(16),
  Font18: getFont(18),
  Font20: getFont(20),
  Font22: getFont(22),
  Font24: getFont(24),
  Font26: getFont(26),
  Font28: getFont(28),
};

export const EXPENSE_STATUS = {
  draft: 'Darft',
  reported:'Reported',
  submitted: 'Submitted',
  approved: 'Approved',
  post:'Posted',
  done:'Completed',
  refused: 'Rejected',
};

export const LEAVE_STATUS = {
  confirm: 'Pending Approval',
  validate1: 'Second-Level Approval',
  validate2: 'Admin Approval',
  validate: 'Approved',
  refuse: 'Rejected',
  cancel: 'Cancelled',
};

export const APPROVALS_STATUS = {
  draft: 'Draft',
  submit: 'Submitted',
  approved: 'Approved',
  reject: 'Rejected',
};

export const createStatusFilterOptions = (statusObj) => {
  return [
    { id: 'all', name: 'All' },
    ...Object.entries(statusObj).map(([key, label]) => ({
      id: key,
      name: label,
    })),
  ];
};

export const EXPENSE_STATUS_FILTER_OPTIONS =
  createStatusFilterOptions(EXPENSE_STATUS);

export const LEAVE_STATUS_FILTER_OPTIONS =
  createStatusFilterOptions(LEAVE_STATUS);

export const APPROVALS_STATUS_FILTER_OPTIONS =
  createStatusFilterOptions(APPROVALS_STATUS);

export {
  insets,
  screenWidth,
  screenHeight,
  safeTop,
  safeBottom,
  safeLeft,
  safeRight,
  isAndroid,
  isIOS,
  responsiveWidth,
  responsiveHeight,
  usableHeight,
  usableWidth,
  FontSize,
};
