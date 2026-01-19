import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import { askChatGPT } from '../../utils/ChatService';
import { CommonView } from '../../utils/common';
import CommonHeader from '../../components/CommonHeader';
import { COLOR } from '../../theme/theme';
import { GlobalFonts } from '../../theme/typography';
import { FontSize } from '../../utils/metrics';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, from: "user" };
    setMessages(prev => [...prev, userMessage]);

    const reply = await askChatGPT(input);

    setMessages(prev => [
      ...prev,
      { id: Date.now() + 1, text: reply, from: "bot" }
    ]);

    setInput("");
  };

  const renderItem = ({ item }) => (
    <Text
      style={[
        styles.message,
        item.from === 'user' ? styles.userMessage : styles.botMessage
      ]}
    >
      {item.text}
    </Text>
  );

  return (
    <CommonView>
      <CommonHeader title="Chat Bot" />

      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={styles.input}
            placeholderTextColor={COLOR.TextPlaceholder}
          />

          <TouchableWithoutFeedback onPress={sendMessage}>
            <View style={styles.sendButton}>
              <Text style={styles.sendText}>Send</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </CommonView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  listContent: {
    paddingBottom: 10,
  },

  message: {
    ...GlobalFonts.subtitle,
    fontSize:FontSize.Font14,
    marginVertical: 6,
    padding: 10,
    borderRadius: 6,
    maxWidth: '80%',
    fontSize: 14,
  },

  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#acf',
  },

  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },

  inputContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
    alignItems: 'center',
  },

  input: {
    ...GlobalFonts.subtitle,
    fontSize:FontSize.Font14,
    flex: 1,
    borderWidth: 1,
    borderColor: COLOR.TextPlaceholder,
    padding: 14,
    borderRadius: 6,
    marginRight: 20,
  },

  sendButton: {
    backgroundColor: COLOR.Black1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 6,
  },

  sendText: {
    color: COLOR.White1,
    fontWeight: '600',
    fontSize: 15,
  },
});
