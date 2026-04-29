import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {AnimatedFAB, Button, Text} from "react-native-paper";
import React, {useEffect, useRef, useState, useTransition} from "react";
import {IMAGES} from "@/lib/assets/images";
import {FlashList} from "@shopify/flash-list";
import {Image} from "expo-image";
import {router, useIsFocused} from "expo-router";
import {useAuth} from "@/lib/context/AuthContext";
import {useChatList} from "@/lib/hooks/useChatList";
import ChatItem from "@/lib/components/ui/ChatItem";
import {useNotifications} from "@/lib/context/NotificationContext";
import FilterTab from "@/lib/components/ui/FilterTab";

const BUTTONS = [
  {
    label: "Active",
    type: 'ACTIVE',
  },
  {
    label: "Waiting",
    type: 'WAITING',
  },
];

const TABS = [
  {
    title: 'Active',
    type: 'ACTIVE',
  },
  {
    title: 'Waiting',
    type: 'WAITING',
  },
];

export default function ChatListScreen() {
  const { user } = useAuth();
  const { clearUnread } = useNotifications()
  const isFocused = useIsFocused();

  if (!user) {
    return null;
  }

  const { waiting, active } = useChatList({
    userId: user.id,
    role: user.role,
  });

  const [filterType, setFilterType] = useState('ACTIVE');

  const conversations = filterType === 'ACTIVE' ? active : waiting;

  useEffect(() => {
    if (isFocused) {
      clearUnread().then();
    }
  }, [isFocused]);


  return (
    <View style={styles.container}>

      <FilterTab tabs={TABS} onChange={(type) => {
        setFilterType(type);
      }}/>

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
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80, paddingHorizontal: 16 }}
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
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
    backgroundColor: "#006EE9",
  },
});
