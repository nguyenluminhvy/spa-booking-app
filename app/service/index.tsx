import {RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';

import { View } from '@/components/Themed';
import {FlashList} from "@shopify/flash-list";
import {Button, MD3Colors, Text} from "react-native-paper";
import {router, Stack} from "expo-router";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSpa} from "@/lib/context/SpaContext";
import {ServiceItem} from "@/lib/components/ui/ServiceItem";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import _ from "lodash";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";

export default function ServicesScreen() {
  const { fetchServices, services } = useSpa()
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const searchInputRef = useRef<any>(null);
  const listRef = useRef<any>(null);

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

  const debouncedSearch = useMemo(
    () => _.debounce((text: string) => setSearchText(text), 300),
    []
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const dataFilter = useMemo(() => {
    setTimeout(() => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    }, 200)

    if (!searchText) return services;

    const keyword = searchText.toLowerCase();

    return services?.filter((s: any) =>
      s?.name?.toLowerCase().includes(keyword) ||
      s?.description?.toLowerCase().includes(keyword) ||
      String(s?.price).includes(keyword) ||
      String(s?.duration).includes(keyword)
    );
  }, [searchText, services]);

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

      <View style={styles.searchContainer}>
        <AppTextInput
          ref={searchInputRef}
          showSearchIcon
          placeholder="Search..."
          onChangeText={handleSearch}
          RightComponent={searchText?.length > 0 && <TouchableOpacity style={{ paddingRight: 8}} onPress={() => {
            handleSearch('')
            searchInputRef.current?.clear();
          }}>
            <MaterialCommunityIcons
              name={"close-circle"}
              size={20}
              color={MD3Colors.neutralVariant60}
            />
          </TouchableOpacity>}
        />
      </View>

      <FlashList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 80}}
        keyExtractor={(item) => item.id.toString()}
        data={dataFilter}
        renderItem={({ item }) => <ServiceItem item={item} onPress={() => viewServiceDetails(item)} />}
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

  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
});
