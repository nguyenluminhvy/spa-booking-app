import {RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';

import { View } from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import {FlashList} from "@shopify/flash-list";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";
import {Button, Text} from "react-native-paper";
import {_cancelAppointment, getPastAppointment, getUpcomingAppointment} from "@/lib/services/api/appointments";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {MessageListButton} from "@/lib/components/ui/MessageListButton";
import {NotificationButton} from "@/lib/components/ui/NotificationButton";
import {Stack} from "expo-router";

const BUTTONS = [
  {
    label: "Upcoming",
    type: 'UPCOMING',
  },
  {
    label: "Past",
    type: 'PAST',
  }
];

export default function AppointmentsScreen() {
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
    fetchData()
  }, [])

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
                if (button.type === 'UPCOMING') {
                  fetchUpcomingAppointments()
                }
                if (button.type === 'PAST') {
                  fetchPastAppointments()
                }
              }}
            >
              {button.label}
            </Button>
          );
        })}
      </View>


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
