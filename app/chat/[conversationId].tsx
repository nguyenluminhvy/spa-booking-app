import {LayoutChangeEvent, StyleSheet, TextInput, TouchableOpacity, View, Text, Alert} from "react-native";
import {
  KeyboardChatScrollView, KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import Message from "@/lib/components/ui/Message";
import {SafeAreaView} from "react-native-safe-area-context";
import {useCallback, useEffect, useRef, useState} from "react";
import {Button, TextInput as TextInputPaper} from "react-native-paper";
import { MaterialCommunityIcons} from "@expo/vector-icons";
import {useAuth} from "@/lib/context/AuthContext";
import {useChat} from "@/lib/hooks/useChat";
import {Stack, useIsFocused, useLocalSearchParams} from "expo-router";
import {useNotifications} from "@/lib/context/NotificationContext";
import {isIos} from "@/lib/utils/helper";

export default function ChatScreen() {
  const { conversationId, chatTitle } = useLocalSearchParams();
  const isFocused = useIsFocused();

  const { user } = useAuth()

  if (!user) return null;

  const { clearUnread } = useNotifications()
  const {messages, sendMessage, sending: isMessageSending, loading: isConvoLoading } = useChat(conversationId, user?.id, user?.role)

  const isProgressing = isMessageSending || isConvoLoading

  const textInputRef = useRef<any>(null);
  const textRef = useRef("");
  const listRef = useRef<any>(null);

  const [inputHeight, setInputHeight] = useState(MIN_HEIGHT);

  useEffect(() => {
    setTimeout(() => {
      listRef?.current?.scrollToEnd()
    }, 500)
  }, [listRef, messages]);

  useEffect(() => {
    if (isFocused) {
      clearUnread().then();
    }
  }, [isFocused]);

  const onInputLayoutChanged = useCallback((e: LayoutChangeEvent) => {
    setInputHeight(e.nativeEvent.layout.height);
  }, []);

  const onInput = useCallback((text: string) => {
    textRef.current = text;
  }, []);


  const onSend = useCallback(async () => {
    const message = textRef.current.trim();

    if (message === "") {
      return;
    }

    await sendMessage(message);

    textInputRef.current?.clear();
    textRef.current = "";
    setTimeout(() => {
      listRef?.current?.scrollToEnd()
    }, 100)
  }, []);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>

      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerTitle: chatTitle || "Spa Supporter",
        }}
      />

      <KeyboardGestureArea
        interpolator="ios"
        style={styles.container}
      >
        <KeyboardChatScrollView
          ref={listRef}
        >
          {messages.map((msg) => (
            <Message key={msg.id} {...msg} currentUserId={user?.id} />
          ))}
        </KeyboardChatScrollView>

        <KeyboardStickyView
          style={{
            backgroundColor: 'white',
            paddingVertical: 10,
          }}
          offset={{
            opened: 30
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <View style={{
              flex: 1,
              borderWidth: 0.5,
              borderColor: 'rgba(0,110,233,0.4)',
              marginHorizontal: 16,
              borderRadius: 50
            }}>
              <TextInputPaper
                multiline
                textAlignVertical={'center'}
                verticalAlign={'middle'}
                dense
                ref={textInputRef}
                contentStyle={{
                  borderRadius: 50
                }}
                outlineStyle={{
                  borderRadius: 50,
                  paddingTop: 8,
                }}
                style={[
                  styles.input,
                  !isIos &&
                  {
                    height: inputHeight,
                  }
                ]}
                mode={"outlined"}
                outlineColor={"transparent"}
                activeOutlineColor={"transparent"}
                cursorColor={'rgba(0,110,233,0.4)'}
                selectionColor={'rgba(0,110,233,0.4)'}
                placeholder={'Type a message...'}
                onChangeText={onInput}
                onContentSizeChange={(e) => {
                  const nextHeight = e.nativeEvent.contentSize.height
                  if (nextHeight > MAX_HEIGHT) {
                    setInputHeight(MAX_HEIGHT);
                  } else {
                    setInputHeight(nextHeight);
                  }
                }}
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              disabled={isProgressing}
              hitSlop={16}
              style={{
                paddingRight: 16,
                opacity: isProgressing ? 0.5 : 1
              }}
              onPress={onSend}
            >
              <MaterialCommunityIcons name={'send-circle'} size={32} color={'#006EE9'} />
            </TouchableOpacity>
          </View>
        </KeyboardStickyView>
      </KeyboardGestureArea>
    </SafeAreaView>

  );
}
const MIN_HEIGHT = 50;
const MAX_HEIGHT = 80;

export const TEXT_INPUT_HEIGHT = 50;

export const MARGIN = 16;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flex: 1,
    // backgroundColor: "#3A3A3C",
  },
  input: {
    backgroundColor: 'white',
    paddingLeft: 8,
    // maxHeight: MAX_HEIGHT,
    borderRadius: 50,
    padding: 0,
    fontSize: 16,
  },

  composer: {
    position: "absolute",
    width: "100%",
    minHeight: TEXT_INPUT_HEIGHT,
  },
  send: {
    position: "absolute",
    top: MARGIN + (TEXT_INPUT_HEIGHT - MARGIN * 2) / 2,
    right: MARGIN * 2,
    padding: MARGIN,
    backgroundColor: "white",
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 99,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
