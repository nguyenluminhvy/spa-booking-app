import {RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';

import { View } from '@/components/Themed';
import {FlashList} from "@shopify/flash-list";
import {AnimatedFAB, Button, Chip, MD3Colors, Text} from "react-native-paper";
import { Image } from 'expo-image'
import {router, Stack, useIsFocused} from "expo-router";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSpa} from "@/lib/context/SpaContext";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {formatPrice} from "@/lib/utils/helper";
import {MessageListButton} from "@/lib/components/ui/MessageListButton";
import {NotificationButton} from "@/lib/components/ui/NotificationButton";
import {ServiceItem} from "@/lib/components/ui/ServiceItem";
import _ from "lodash";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {
  getSortLabel,
  ServiceAdvancedFilterModal,
  ServiceAdvancedFilterValue
} from "@/lib/components/ui/ServiceAdvancedFilterModal";
import {IMAGES} from "@/lib/assets/images";

export default function BookingScreen() {
  const isFocused = useIsFocused()
  const { fetchServices, services } = useSpa()

  const searchInputRef = useRef<any>(null);
  const listRef = useRef<any>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [advancedFilterValue, setAdvancedFilterValue] = useState<ServiceAdvancedFilterValue>({});

  useEffect(() => {
    ;(async () => {
      await fetchServices(advancedFilterValue)
    })()
  }, [advancedFilterValue]);

  useEffect(() => {
    if (isFocused) {
      setAdvancedFilterValue({})
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchServices(advancedFilterValue)
      setRefreshing(false);
    }, 1000);
  }, [advancedFilterValue]);

  const goToSelectTime = (item) => {
    router.push({
      pathname: '/select-time',
      params: {
        serviceId: item.id,
      }
    })
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

      <View style={styles.searchContainer}>
        <AppTextInput
          ref={searchInputRef}
          showSearchIcon
          placeholder="Search..."
          onChangeText={handleSearch}
          // RightComponent={searchText?.length > 0 && <TouchableOpacity style={{ paddingRight: 8}} onPress={() => {
          //   handleSearch('')
          //   searchInputRef.current?.clear();
          // }}>
          //   <MaterialCommunityIcons
          //     name={"close-circle"}
          //     size={20}
          //     color={MD3Colors.neutralVariant60}
          //   />
          // </TouchableOpacity>}
          RightComponent={<ServiceAdvancedFilterModal value={advancedFilterValue} onChange={(data) => {
            console.log(data, 'data AdvancedFilterModal');
            setAdvancedFilterValue(data)
          }}/>}
        />
      </View>

      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingTop: 8, paddingHorizontal: 16, paddingBottom: 8}}>
        {
          advancedFilterValue.maxPrice && (
            <Chip selectedColor={'white'} style={{
              backgroundColor: '#006EE9'
            }} onClose={() => {
              setAdvancedFilterValue(prev => ({ ...prev, maxPrice: undefined }));
            }}>{`${formatPrice(100000)} - ${formatPrice(advancedFilterValue.maxPrice)}`}</Chip>
          )
        }
        {
          advancedFilterValue.maxRating && (
            <TouchableOpacity
              activeOpacity={1}
              style={{flexDirection: 'row', height: 34, backgroundColor: '#006EE9', alignItems: 'center', justifyContent: 'center', borderRadius: 8, paddingHorizontal: 12, gap: 2}}
              onPress={() => setAdvancedFilterValue(prev => ({ ...prev, maxRating: undefined }))}
            >
              <Text style={{color: 'white', fontWeight: '500'}}>
                {0}
              </Text>
              <MaterialCommunityIcons name={'star'} size={20} color={'#FFC107'} />

              <MaterialCommunityIcons name={'arrow-right-thin'} size={20} color={'white'} />

              <Text style={{color: 'white', fontWeight: '500'}}>
                {advancedFilterValue.maxRating}
              </Text>
              <MaterialCommunityIcons name={'star'} size={20} color={'#FFC107'} />

            </TouchableOpacity>
          )
        }
        {
          advancedFilterValue.sort && (
            <Chip selectedColor={'white'} style={{
              backgroundColor: '#006EE9',
            }} onClose={() => {
              setAdvancedFilterValue(prev => ({ ...prev, sort: undefined }));
            }}>
              {`${getSortLabel(advancedFilterValue.sort)}`}
            </Chip>
          )
        }
      </View>

      <FlashList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 80}}
        keyExtractor={(item) => item.id.toString()}
        data={dataFilter}
        renderItem={({ item }) => <ServiceItem item={item} onPress={() => goToSelectTime(item)} />}
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
  searchContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
