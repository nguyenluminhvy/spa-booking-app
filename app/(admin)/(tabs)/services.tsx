import { RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from '@/components/Themed';
import { FlashList } from "@shopify/flash-list";
import {AnimatedFAB, Chip, MD3Colors, Text} from "react-native-paper";
import { router, Stack } from "expo-router";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { getServices } from "@/lib/services/api/services";
import { NotificationButton } from "@/lib/components/ui/NotificationButton";
import { MessageListButton } from "@/lib/components/ui/MessageListButton";
import { ServiceItem } from "@/lib/components/ui/ServiceItem";
import EditServiceModal from "@/lib/components/ui/EditServiceModal";
import { AppTextInput } from "@/lib/components/ui/AppTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import _ from 'lodash';
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {
  getSortLabel,
  ServiceAdvancedFilterModal,
  ServiceAdvancedFilterValue
} from "@/lib/components/ui/ServiceAdvancedFilterModal";
import {formatPrice} from "@/lib/utils/helper";

export default function ServicesScreen() {
  const listRef = useRef<any>(null);

  const [services, setServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [advancedFilterValue, setAdvancedFilterValue] = useState<ServiceAdvancedFilterValue>({});
  const [searchText, setSearchText] = useState('');
  const [isSortByNew, setIsSortByNew] = useState(true);

  const [queryParams, setQueryParams] = useState({
    orderBy: "desc",
  });

  const fetchServices = async (query = queryParams) => {
    try {
      setQueryParams(query);

      const params = {
        sort: 'createdAt',
        order: 'desc'
      }

      if (query?.sort === 'rating') {
        params.sort = 'rating'
      }
      if (query?.sort === 'review') {
        params.sort = 'review'
      }
      if (query?.sort === 'priceHigh') {
        params.sort = 'price'
      }
      if (query?.sort === 'priceLow') {
        params.sort = 'price'
        params.order = 'asc'
      }

      const data = await getServices({...query, ...params});
      setServices(data || []);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    ;(async () => {
      await fetchServices(advancedFilterValue)
    })()
  }, [advancedFilterValue]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchServices(advancedFilterValue);
    setRefreshing(false);
  }, [advancedFilterValue]);

  const debouncedSearch = useMemo(
    () => _.debounce((text: string) => setSearchText(text), 300),
    []
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const toggleSortNew = () => {
    const next = !isSortByNew;
    setIsSortByNew(next);

    const nextQuery = {
      orderBy: next ? "desc" : "asc",
    };

    fetchServices(nextQuery);
  };

  const dataFilter = useMemo(() => {
    setTimeout(() => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    }, 350)

    if (!searchText) return services;

    const keyword = searchText.toLowerCase();

    return services.filter((s: any) =>
      s?.name?.toLowerCase().includes(keyword) ||
      s?.description?.toLowerCase().includes(keyword) ||
      String(s?.price).includes(keyword) ||
      String(s?.duration).includes(keyword)
    );
  }, [searchText, services]);

  const goToUpdate = (id: string) => {
    router.push({
      pathname: '/create-edit-service',
      params: { serviceId: id },
    });
  };

  const viewServiceDetails = (id: string) => {
    router.push(`/service/${id}`);
  };

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
          headerRight: () => <NotificationButton />,
        }}
      />

      <View style={styles.searchContainer}>
        <AppTextInput
          showSearchIcon
          placeholder="Search..."
          onChangeText={handleSearch}
          // RightComponent={
          //   <TouchableOpacity onPress={toggleSortNew} style={styles.sortBtn}>
          //     <Text style={styles.sortText}>New</Text>
          //     <MaterialCommunityIcons
          //       name={isSortByNew ? "arrow-down-thin" : "arrow-up-thin"}
          //       size={20}
          //       color={MD3Colors.neutralVariant60}
          //     />
          //   </TouchableOpacity>
          // }
          RightComponent={<ServiceAdvancedFilterModal value={advancedFilterValue} onChange={(data) => {
            console.log(data, 'data AdvancedFilterModal');
            setAdvancedFilterValue(data)
          }}/>}
        />
      </View>

      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingTop: 8, paddingHorizontal: 16, paddingBottom: 8}}>
        {
          advancedFilterValue.status && (
            <Chip selectedColor={'white'} style={{
              backgroundColor: '#006EE9'
            }} onClose={() => {
              setAdvancedFilterValue(prev => ({ ...prev, status: undefined }));
            }}>{`Status: ${advancedFilterValue.status}`}</Chip>
          )
        }
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

      <Text style={{ textAlign: 'right', marginRight: 16, paddingBottom: 8}}>
        Total: {dataFilter?.length}
      </Text>

      <FlashList
        ref={listRef}
        data={dataFilter}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ServiceItem
            item={item}
            onPress={() => {
              setSelectedItem(item);
              setShowModal(true);
            }}
          />
        )}
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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

      <EditServiceModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSelect={(type) => {
          if (!selectedItem) return;

          if (type === "edit") goToUpdate(selectedItem.id);
          if (type === "view") viewServiceDetails(selectedItem.id);

          setShowModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  sortText: {
    fontSize: 14,
    color: MD3Colors.neutralVariant50,
  },
  fabStyle: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#006EE9",
  },
});
