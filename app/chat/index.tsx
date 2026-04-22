import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {AnimatedFAB, Button, Text} from "react-native-paper";
import {useEffect, useRef, useState, useTransition} from "react";
import {IMAGES} from "@/lib/assets/images";
import {FlashList} from "@shopify/flash-list";
import {Image} from "expo-image";
import {router} from "expo-router";
import {useAuth} from "@/lib/context/AuthContext";
import {useChatList} from "@/lib/hooks/useChatList";
import ChatItem from "@/lib/components/ui/ChatItem";

const BUTTONS = [
  {
    label: "Waiting",
    type: 'WAITING',
  },
  {
    label: "Active",
    type: 'ACTIVE',
  },
];

export default function ChatListScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const { waiting, active } = useChatList({
    userId: user.id,
    role: user.role,
  });

  const [filterType, setFilterType] = useState('WAITING');

  const conversations = filterType === 'WAITING' ? waiting : active;

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingBottom: 8,
          marginTop: 16
        }}
      >
        {BUTTONS.map((button, index) => {
          const isActive = button.type === filterType;

          return (
            <Button
              key={index}
              mode="elevated"
              buttonColor={isActive ? "#006EE9" : "#F4F9FF"}
              textColor={isActive ? "white" : "black"}
              onPress={() => {
                setFilterType(button.type);
              }}
            >
              {button.label}
            </Button>
          );
        })}
      </View>

      <FlashList
        ListEmptyComponent={<View style={{
          flex: 1,
          paddingTop: 100,
          alignItems: 'center',
          gap: 8
        }}>
          <Image
            style={{
              width: "100%",
              height: 50,
            }}
            source={IMAGES.nodata}
            contentFit="contain"
          />
          <Text variant={'labelMedium'}>
            No data
          </Text>
        </View>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
        keyExtractor={(item) => item.id.toString()}
        data={conversations}
        renderItem={({ item }) => <ChatItem
          convo={item}
          staffId={user.id}
          onPress={() => {
            router.push({
              pathname: "/chat/[conversationId]",
              params: {
                conversationId: item.id,
                chatTitle: item?.userName
              },
            });
          }}
        />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
    backgroundColor: "#006EE9",
  },
});
