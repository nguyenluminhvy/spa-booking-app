import {RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';

import { View } from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import {FlashList} from "@shopify/flash-list";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";
import {Button, Text} from "react-native-paper";
import {_cancelAppointment, getPastAppointment, getUpcomingAppointment} from "@/lib/services/api/appointments";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {useIsFocused} from "expo-router";
import FilterTab from "@/lib/components/ui/FilterTab";

const TABS = [
  {
    title: 'Upcoming',
    type: 'UPCOMING',
  },
  {
    title: 'Past',
    type: 'PAST',
  },
];

export default function AppointmentsScreen() {
  const isFocused = useIsFocused();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('UPCOMING');

  const [refreshing, setRefreshing] = useState(false);

  const fetchUpcomingAppointments = useCallback(async () => {
    try {

      const response = await getUpcomingAppointment();

      if (response ) {
        setAppointments(response);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
    }
  }, []);

  const fetchPastAppointments = useCallback(async () => {
    try {

      const response = await getPastAppointment();

      if (response ) {
        setAppointments(response);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
    }
  }, []);


  const fetchData = useCallback(async () => {
    try {
      if (filterType === 'UPCOMING') {
        await fetchUpcomingAppointments()
      } else if (filterType === 'PAST') {
        await fetchPastAppointments()
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  }, [filterType]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData()
      setRefreshing(false);
    }, 1000);
  }, [fetchData]);

  const cancelAppointment = async (id: any) => {
    const response = await _cancelAppointment(id)

    await fetchData()

    return response
  }

  return (
    <View style={styles.container}>

      <FilterTab count={appointments?.length} tabs={TABS} onChange={(type) => {
        setFilterType(type);
        if (type === 'UPCOMING') {
          fetchUpcomingAppointments()
        }
        if (type === 'PAST') {
          fetchPastAppointments()
        }
      }}/>

      <FlashList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 80}}
        keyExtractor={(item) => item.id.toString()}
        data={appointments}
        renderItem={({ item }) => <AppointmentCard data={item} onCancel={cancelAppointment}/>
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
});
