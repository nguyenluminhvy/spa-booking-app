import {RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';

import { View } from '@/components/Themed';
import {FlashList} from "@shopify/flash-list";
import {AnimatedFAB, Button, Text} from "react-native-paper";
import { Image } from 'expo-image'
import {router, Stack} from "expo-router";
import React, {useCallback, useEffect, useState} from "react";
import {getServices} from "@/lib/services/api/services";
import {formatPrice} from "@/lib/utils/helper";
import {NotificationButton} from "@/lib/components/ui/NotificationButton";
import {MessageListButton} from "@/lib/components/ui/MessageListButton";
import {ServiceItem} from "@/lib/components/ui/ServiceItem";

export default function ServicesScreen() {

  const [services, setServices] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    const data = await getServices();

    if (data?.length > 0) {
      setServices(data);
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchServices()
    })()
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchServices()
      setRefreshing(false);
    }, 1000);
  }, []);

  const goToUpdate = (id) => {
    router.push({
      pathname: '/create-edit-service',
      params: {
        serviceId: id
      }
    })
  }

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

      <FlashList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 80}}
        keyExtractor={(item) => item.id.toString()}
        data={services}
        renderItem={({ item }) => <ServiceItem item={item} onPress={() => goToUpdate(item.id)} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />

      <AnimatedFAB
        icon={"plus"}
        label={""}
        extended={false}
        onPress={() => {
          router.push({
            pathname: '/create-edit-service',
            params: {
              serviceId: 'new'
            }
          })
        }}
        visible
        color={"white"}
        animateFrom={"right"}
        iconMode={"static"}
        style={[styles.fabStyle]}
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
