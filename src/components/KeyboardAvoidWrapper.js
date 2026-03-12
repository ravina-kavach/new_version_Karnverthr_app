import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const KeyboardAvoidWrapper = ({
  children,
  contentContainerStyle,
  style,
}) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={'padding'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default KeyboardAvoidWrapper;