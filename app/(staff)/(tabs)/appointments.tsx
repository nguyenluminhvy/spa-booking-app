import {RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';

import { View } from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSpa} from "@/lib/context/SpaContext";
import {FlashList} from "@shopify/flash-list";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";
import {Button, MD3Colors, Text} from "react-native-paper";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {Stack} from "expo-router";
import {NotificationButton} from "@/lib/components/ui/NotificationButton";
import {MessageListButton} from "@/lib/components/ui/MessageListButton";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import _ from "lodash";

const BUTTONS = [
  {
    label: "All",
    type: 'ALL',
  },
  {
    label: "Today",
    type: 'TODAY',
  },
  {
    label: "Done",
    type: 'DONE',
  },
];

export default function AppointmentsScreen() {
  const { appointments, fetchAppointments, initAppointments, filterByToday, filterByDone } = useSpa()

  const [searchText, setSearchText] = useState('');

  const [filterType, setFilterType] = useState('ALL');

  const [refreshing, setRefreshing] = useState(false);

  const searchInputRef = useRef<any>(null);
  const listRef = useRef<any>(null);

  useEffect(() => {
    initAppointments()
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
      fetchAppointments()
      setRefreshing(false);
    }, 1000);
  }, []);

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

    if (!searchText) return appointments;

    const keyword = searchText.toLowerCase();

    return appointments?.filter((s: any) =>
      s?.staff?.name?.toLowerCase().includes(keyword) ||
      s?.user?.name?.toLowerCase().includes(keyword) ||
      s?.service?.name?.toLowerCase().includes(keyword) ||
      String(s?.service?.price).includes(keyword) ||
      String(s?.id).includes(keyword)
    );
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
            <NotificationButton refreshing={refreshing}/>
          ),
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
              onPress={() => {
                setFilterType(button.type);
                if (button.type === 'TODAY') {
                  filterByToday()
                }
                if (button.type === 'DONE') {
                  filterByDone()
                }
                if (button.type === 'ALL') {
                  initAppointments()
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 80}}
        keyExtractor={(item) => item.id.toString()}
        data={dataFilter}
        renderItem={({ item }) => <AppointmentCard data={item}/>
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
});
