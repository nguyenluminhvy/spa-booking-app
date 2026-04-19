import {RefreshControl, StyleSheet, TouchableOpacity, View, Text, Alert} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {FlashList} from "@shopify/flash-list";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useNotifications} from "@/lib/context/NotificationContext";
import moment from "moment";
import {router, Stack} from "expo-router";
import {BrushNotificationButton} from "@/lib/components/ui/BrushNotificationButton";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";

const NotificationItem = ({
                            id,
                            title,
                            body,
                            isRead,
                            createdAt,
                          }: any) => {
  const { markAsRead } = useNotifications()

  const [isActive, setIsActive] = useState<boolean>(isRead)

  useEffect(() => {
    setIsActive(isRead)
  }, [isRead]);

  const onPress = async () => {
    if (isRead) {
      return
    }

    await markAsRead(id)
    setIsActive(prev => !prev)
  }

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 4,
          paddingHorizontal: 16,
          height: 64,
          backgroundColor: isActive ? 'white': 'rgba(0,110,233,0.05)',
        }}
      >
        <MaterialCommunityIcons
          name={"bullhorn-outline"}
          size={20}
          color={'#006EE9'}
        />
        <View
          style={{
            flex: 1,
            marginLeft: 8,
          }}
        >
          <View
            style={{
              flexDirection: 'row',

              justifyContent: 'space-between',
              height: 24,
            }}
          >
            <Text style={{
              color:'rgba(0, 0, 0, 1)',
              fontWeight: 700
            }}>
              {title}
            </Text>
            <Text
              style={{
                color:'rgba(6, 7, 38, 0.5)',
                fontSize: 12

              }}
            >
              {moment(createdAt).format('DD-MM-YYYY HH:mm')}
            </Text>
          </View>
          <View style={{ paddingRight: 32 }}>
            <Text
              numberOfLines={2}
              style={{
                color:'rgba(6, 7, 38, 0.5)',
                fontSize: 12

              }}
            >
              {body?.replace('\n', '').trim()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function Index() {
  const { notifications, fetchNotifications } = useNotifications()

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    ;(async () => {
      await fetchNotifications()
    })()
  }, []);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchNotifications()
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerRight: () => (
            <BrushNotificationButton/>
          ),
        }}
      />

      <FlashList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80}}
        keyExtractor={(item) => item.id.toString()}
        data={notifications}
        renderItem={({ item }) => <NotificationItem {...item}/>}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  itemContainer: {
    paddingBottom: 0,
    // borderRadius: 40,
    // borderWidth: 1,
    marginBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,

    shadowColor: 'rgba(6, 7, 38, 0.17)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
    backgroundColor: "#006EE9",
  },
});
