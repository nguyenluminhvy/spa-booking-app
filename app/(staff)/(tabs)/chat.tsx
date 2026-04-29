import {Alert, StyleSheet, View} from 'react-native';
import {Text} from "react-native-paper";
import React, {useEffect, useRef, useState, useTransition} from "react";
import {IMAGES} from "@/lib/assets/images";
import {FlashList} from "@shopify/flash-list";
import {Image} from "expo-image";
import {router, Stack, useFocusEffect, useIsFocused} from "expo-router";
import {useAuth} from "@/lib/context/AuthContext";
import {useChatList} from "@/lib/hooks/useChatList";
import ChatItem from "@/lib/components/ui/ChatItem";
import {NotificationButton} from "@/lib/components/ui/NotificationButton";
import {useNotifications} from "@/lib/context/NotificationContext";
import FilterTab from "@/lib/components/ui/FilterTab";

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
  const isFocused = useIsFocused();

  if (!user) {
    return null;
  }

  const { waiting, active, claimConversation, loading: isLoading } = useChatList({
    userId: user.id,
    role: user.role,
  });

  const { clearUnread } = useNotifications()

  const [filterType, setFilterType] = useState('ACTIVE');

  const conversations = filterType === 'ACTIVE' ? active : waiting;

  const listRef = useRef<any>(null);

  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
  }, [conversations]);

  useEffect(() => {
    if (isFocused) {
      clearUnread().then();
    }
  }, [isFocused]);

  const onClaimConversation = async (id: any) => {
    Alert.alert(`Claim this conversation`, "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", style: "default", onPress: async () => {
          const response = await claimConversation(id)
          if (response?.code === 0) {
            setFilterType('ACTIVE')
          }
        }},
    ]);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerRight: () => (
            <NotificationButton />
          ),
        }}
      />

      <FilterTab tabs={TABS} onChange={(type) => {
        setFilterType(type);
      }}/>

      <FlashList
        ref={listRef}
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
          onClaim={async () => {
            await onClaimConversation(item.id)
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
