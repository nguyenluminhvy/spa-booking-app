import {RefreshControl, StyleSheet} from 'react-native';

import { View } from '@/components/Themed';
import {FlashList} from "@shopify/flash-list";
import {Button} from "react-native-paper";
import {router, Stack} from "expo-router";
import React, {useCallback, useEffect, useState} from "react";
import {useSpa} from "@/lib/context/SpaContext";
import {ServiceItem} from "@/lib/components/ui/ServiceItem";
import {Ionicons} from "@expo/vector-icons";

export default function ServicesScreen() {
  const { fetchServices, services } = useSpa()
  const [refreshing, setRefreshing] = useState(false);


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

  const viewServiceDetails = (item) => {
    router.push(`/service/${item.id}`);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerLeft: () => <Button compact buttonColor={'white'} onPress={router.back}>
            <Ionicons name={'chevron-back'} size={20} color={'black'} />
          </Button>
        }}
      />

      <FlashList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 80}}
        keyExtractor={(item) => item.id.toString()}
        data={services}
        renderItem={({ item }) => <ServiceItem item={item} onPress={() => viewServiceDetails(item)} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
