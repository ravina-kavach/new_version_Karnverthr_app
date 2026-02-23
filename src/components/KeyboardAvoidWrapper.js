import React from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const KeyboardAvoidWrapper = ({ children, contentContainerStyle, style }) => {
  return (
    <KeyboardAwareScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
      resetScrollToCoords={{ x: 0, y: 0 }}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default KeyboardAvoidWrapper;
