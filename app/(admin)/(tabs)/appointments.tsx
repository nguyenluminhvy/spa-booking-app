import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import { View, Text } from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSpa} from "@/lib/context/SpaContext";
import {FlashList} from "@shopify/flash-list";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";
import {useAdmin} from "@/lib/context/AdminContext";
import {Button, Chip, MD3Colors} from "react-native-paper";
import {_assignStaff} from "@/lib/services/api/appointments";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {NotificationButton} from "@/lib/components/ui/NotificationButton";
import {router, Stack} from "expo-router";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {MessageListButton} from "@/lib/components/ui/MessageListButton";
import _ from "lodash";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {
  AppointmentAdvancedFilterModal,
  AppointmentAdvancedFilterValue
} from "@/lib/components/ui/AppointmentAdvancedFilterModal";
import moment from "moment/moment";

const BUTTONS = [
  {
    label: "All",
    type: '',
  },
  {
    label: "Pending",
    type: 'PENDING',
  },
  {
    label: "Confirmed",
    type: 'CONFIRMED',
  },
  {
    label: "Done",
    type: 'DONE',
  },
  {
    label: "Cancelled",
    type: 'CANCELLED',
  },
];

export default function AppointmentsScreen() {
  const { appointments, fetchAppointments, filterByStatus } = useSpa()

  const searchInputRef = useRef<any>(null);
  const listRef = useRef<any>(null);

  const [advancedFilterValue, setAdvancedFilterValue] = useState<AppointmentAdvancedFilterValue>({});
  const [searchText, setSearchText] = useState('');
  const [totalItem, setTotalItem] = useState(null);

  const [filterType, setFilterType] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const filterDateRange = useMemo(() => {
    return {
      startDate: advancedFilterValue?.range?.start,
      endDate: advancedFilterValue?.range?.end,
    }
  }, [advancedFilterValue])

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
  }, [appointments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      filterByStatus(filterType, filterDateRange)
      setRefreshing(false);
    }, 1000);
  }, [filterType, filterDateRange]);

  const goToSelectTime = (item) => {
    // router.push({
    //   pathname: '/select-time',
    //   params: {
    //     serviceId: item.id,
    //   }
    // })
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

    if (!searchText) {
      setTotalItem(appointments?.length)
      return appointments
    };

    const keyword = searchText.toLowerCase();

    const dataRtn = appointments?.filter((s: any) =>
      s?.staff?.name?.toLowerCase().includes(keyword) ||
      s?.user?.name?.toLowerCase().includes(keyword) ||
      s?.service?.name?.toLowerCase().includes(keyword) ||
      s?.voucherCode?.toLowerCase().includes(keyword) ||
      String(s?.service?.price).includes(keyword) ||
      String(s?.id).includes(keyword)
    );

    setTotalItem(dataRtn?.length)
    return dataRtn
  }, [searchText, appointments]);

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
          RightComponent={<AppointmentAdvancedFilterModal value={advancedFilterValue} onChange={(data) => {
            console.log(data, 'data AdvancedFilterModal');
            setAdvancedFilterValue(data)

            filterByStatus(filterType, {
              startDate: data?.range?.start,
              endDate: data?.range?.end,
            })
          }}/>}
        />
      </View>

      {
        advancedFilterValue.range && (
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingTop: 4, paddingHorizontal: 16}}>
            <Chip selectedColor={'white'} style={{
              backgroundColor: '#006EE9'
            }} onClose={() => {
              setAdvancedFilterValue(prev => ({ ...prev, range: undefined }));

              filterByStatus(filterType, {
                startDate: undefined,
                endDate: undefined,
              })
            }}>{`from ${moment(advancedFilterValue.range.start).format("MMM-DD-YYYY")} to ${moment(advancedFilterValue.range.end).format("MMM-DD-YYYY")}`}</Chip>
          </View>
        )
      }

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
           <View
             style={{
               flexDirection: "row",
               gap: 8,
               paddingBottom: 8,
               paddingHorizontal: 16,
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
                   onPress={async () => {
                     setTotalItem(null)
                     setFilterType(button.type);
                     await filterByStatus(button.type, filterDateRange);
                   }}
                 >
                   {`${button.label} ${(isActive && totalItem !== null) ? `(${totalItem})`: ''  }`}
                 </Button>
               );
             })}
           </View>
        </ScrollView>
      </View>

      <FlashList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 80}}
        keyExtractor={(item) => item.id.toString()}
        data={dataFilter}
        renderItem={({ item }) => (
          <AppointmentCard
            data={item}
            onConfirmed={() => filterByStatus(filterType, filterDateRange)}
            onCompleted={() => filterByStatus(filterType, filterDateRange)}
            onSelectStaff={async (id, staffId) => {
              await _assignStaff(id, {staffId})
              await filterByStatus(filterType, filterDateRange)
          }}/>
        )
        }
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
  searchContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
