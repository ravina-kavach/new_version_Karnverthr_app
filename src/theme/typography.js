import { StyleSheet, Platform } from 'react-native';

const font = (name) =>
  Platform.OS === 'ios' ? `Inter-${name}` : `Inter_18pt-${name}`;

export const GlobalFonts = StyleSheet.create({
  // Main App Titles
  title1: {
    fontFamily: font('Bold'),
    fontSize: 24,
    lineHeight: 30,
  },
  title2: {
    fontFamily: font('SemiBold'),
    fontSize: 20,
    lineHeight: 26,
  },

  // Sub titles
  subtitle: {
    fontFamily: font('Medium'),
    fontSize: 18,
    lineHeight: 24,
  },

  // Paragraph / Description Text
  body: {
    fontFamily: font('Regular'),
    fontSize: 16,
    lineHeight: 22,
  },

  small: {
    fontFamily: font('Light'),
    fontSize: 14,
    lineHeight: 20,
  },

  caption: {
    fontFamily: font('Medium'),
    fontSize: 12,
    lineHeight: 18,
  },

  buttonText: {
    fontFamily: font('SemiBold'),
    fontSize: 16,
  },
});
