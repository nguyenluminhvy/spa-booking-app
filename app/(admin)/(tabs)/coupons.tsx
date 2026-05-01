import {Alert, RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import { FlashList } from "@shopify/flash-list";
import {AnimatedFAB, Button, Chip, MD3Colors, Text} from "react-native-paper";
import { router, Stack } from "expo-router";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { NotificationButton } from "@/lib/components/ui/NotificationButton";
import { MessageListButton } from "@/lib/components/ui/MessageListButton";
import { AppTextInput } from "@/lib/components/ui/AppTextInput";
import _ from 'lodash';
import {VoucherItem} from "@/lib/components/ui/VoucherItem";
import {useSpa} from "@/lib/context/SpaContext";
import {useAuth} from "@/lib/context/AuthContext";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {CouponAdvancedFilterModal, CouponAdvancedFilterValue} from "@/lib/components/ui/CouponAdvancedFilterModal";


export default function CouponsScreen() {
  const listRef = useRef<any>(null);

  const { coupons, fetchCoupons, activateCoupon, deactivateCoupon, setQueryCoupon, queryCoupon } = useSpa()
  const { setLoading } = useAuth()

  console.log(coupons, 'coupons')

  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [isSortByNew, setIsSortByNew] = useState(true);

  const [advancedFilterValue, setAdvancedFilterValue] = useState<CouponAdvancedFilterValue>(queryCoupon);

  useEffect(() => {
    setQueryCoupon(advancedFilterValue);
    fetchCoupons(advancedFilterValue);
  }, [advancedFilterValue]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCoupons();
    setRefreshing(false);
  }, []);

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

    fetchCoupons(nextQuery);
  };

  const dataFilter = useMemo(() => {
    setTimeout(() => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    }, 350)

    if (!searchText) return coupons;

    const keyword = searchText.toLowerCase();

    return coupons?.filter((s: any) =>
      s?.code?.toLowerCase().includes(keyword)
      // s?.description?.toLowerCase().includes(keyword) ||
      // String(s?.price).includes(keyword) ||
      // String(s?.duration).includes(keyword)
    );
  }, [searchText, coupons]);


  const goToUpdate = (id: string) => {
    router.push({
      pathname: '/create-edit-service',
      params: { serviceId: id },
    });
  };

  const viewServiceDetails = (id: string) => {
    router.push(`/service/${id}`);
  };

  const onToggleCoupon = async (item) => {
    const isActive = item?.status === "ACTIVE";
    const title = `${isActive ? 'Deactivate' : 'Activate'} coupon ${item.code}`

    Alert.alert(title, "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: async () => {
        try {
          setLoading(true);
          const response = isActive ? await deactivateCoupon(item?.id) : await activateCoupon(item?.id)

          if (response?.code === 0) {
            await fetchCoupons()
          } else if (response?.message) {
            Alert.alert(`Notice`, response?.message, [
              { text: "OK", style: "default", onPress: async () => {
                } },
            ]);
          }
        } catch (e) {

        } finally {
          setLoading(false);
        }
      }},
    ]);
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
          headerRight: () => <NotificationButton />,
        }}
      />

      <View style={styles.searchContainer}>
        <AppTextInput
          showSearchIcon
          placeholder="Search..."
          onChangeText={handleSearch}
          RightComponent={
            <CouponAdvancedFilterModal value={advancedFilterValue} onChange={(data) => {
              console.log(data, 'data AdvancedFilterModal');
              setAdvancedFilterValue(data)
            }}/>
          }
        />
      </View>

      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingTop: 8, paddingHorizontal: 16}}>
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
          advancedFilterValue.state && (
            <Chip selectedColor={'white'} style={{
              backgroundColor: '#006EE9'
            }} onClose={() => {
              setAdvancedFilterValue(prev => ({ ...prev, state: undefined }));
            }}>{`State: ${advancedFilterValue.state}`}</Chip>
          )
        }
        {
          advancedFilterValue.orderBy && (
            <Chip selectedColor={'white'} style={{
              backgroundColor: '#006EE9',
            }} onClose={() => {
              setAdvancedFilterValue(prev => ({ ...prev, orderBy: undefined }));
            }}>
              {`${ advancedFilterValue.orderBy === 'desc' ? 'Newest' : 'Oldest'}`}
            </Chip>
          )
        }
      </View>

      <FlashList
        ref={listRef}
        data={dataFilter}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <VoucherItem
            item={item}
            onEdit={() => {
              router.push({
                pathname: '/create-edit-coupon',
                params: {
                  voucherId: item.id,
                }
              })
            }}
            onToggle={() => onToggleCoupon(item)}
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
            pathname: '/create-edit-coupon',
            params: {
              voucherId: 'new'
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
