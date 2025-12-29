import { StyleSheet, Platform } from 'react-native';
import {FontSize} from '../utils/metrics'

const font = (name) =>
  Platform.OS === 'ios' ? `Inter-${name}` : `Inter_18pt-${name}`;

export const GlobalFonts = StyleSheet.create({
  // Main App Titles
  title: {
    fontFamily: font('Bold'),
    fontSize: FontSize.Font24,
    lineHeight: 30,
    letterSpacing:1,
    fontWeight:'600'
  },
  subtitle: {
    fontFamily: font('SemiBold'),
    fontSize: FontSize.Font16,
    lineHeight: 22,
    fontWeight:'600'
  },

  normalText:{
    fontFamily: font('Medium'),
    fontSize: FontSize.Font16,
    lineHeight: 22,
    fontWeight:'500'
  },

  body: {
    fontFamily: font('Regular'),
    fontSize: FontSize.Font16,
    lineHeight: 22,
  },

  small: {
    fontFamily: font('Light'),
    fontSize: FontSize.Font14,
    lineHeight: 20,
  },

  caption: {
    fontFamily: font('Medium'),
    fontSize: FontSize.Font12,
    lineHeight: 18,
  },

  buttonText: {
    fontFamily: font('SemiBold'),
    fontSize: FontSize.Font16,
  },
});
