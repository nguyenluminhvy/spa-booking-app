import {RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AnimatedFAB, Button, Text} from "react-native-paper";
import React, {useCallback, useEffect, useRef, useState, useTransition} from "react";
import {IMAGES} from "@/lib/assets/images";
import {FlashList} from "@shopify/flash-list";
import {Image} from "expo-image";
import {AccountItem} from "@/lib/components/ui/AccountItem";
import {useAdmin} from "@/lib/context/AdminContext";
import {router, Stack} from "expo-router";
import {NotificationButton} from "@/lib/components/ui/NotificationButton";
import {MessageListButton} from "@/lib/components/ui/MessageListButton";

const BUTTONS = [
  {
    label: "All",
    type: 'ALL',
  },
  {
    label: "Staff",
    type: 'STAFF',
  },
];

export default function UsersScreen() {
  const { fetchUsers, users } = useAdmin()
  const [, startTransition] = useTransition();

  const [filterType, setFilterType] = useState('ALL');
  const [filterParams, setFilterParams] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const listRef = useRef<any>(null);

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
  }, [users]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchUsers(filterParams)
      setRefreshing(false);
    }, 1000);
  }, [filterParams]);


  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <MessageListButton />
            </View>
          ),
          headerRight: () => (
            <NotificationButton />
          ),
        }}
      />

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
              // icon="camera"
              mode="elevated"
              buttonColor={isActive ? "#006EE9" : "#F4F9FF"}
              textColor={isActive ? "white" : "black"}
              // labelStyle={{ fontWeight: isActive ? "bold" : "light" }}
              onPress={() => {
                setFilterType(button.type);
                if (button.type === 'STAFF') {
                  startTransition(() => {
                    setFilterParams({
                      role: 'STAFF'
                    })
                    fetchUsers({
                      role: 'STAFF'
                    })
                  });

                } else {
                  startTransition(() => {
                    setFilterParams({})
                    fetchUsers({})
                  });

                }
              }}
            >
              {button.label}
            </Button>
          );
        })}
      </View>

      <FlashList
        ref={listRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
        data={users}
        renderItem={({ item }) => <AccountItem {...item} onUpdate={() => {
          fetchUsers(filterParams)
        }} />}
      />

      <AnimatedFAB
        icon={'plus'}
        label={'Add Staff'}
        extended
        onPress={() => router.push({
          pathname: '/create-edit-staff',
          params: {
            staffId: 'new'
          }
        })}
        visible
        style={[styles.fabStyle]}
        color={'white'}
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
