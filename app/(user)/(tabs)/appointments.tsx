import {RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from 'react-native';
import {useCallback, useEffect, useState} from "react";
import {useSpa} from "@/lib/context/SpaContext";
import {FlashList} from "@shopify/flash-list";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";
import {Button} from "react-native-paper";
import {getServices} from "@/lib/services/api/services";
import {_cancelAppointment, getPastAppointment, getUpcomingAppointment} from "@/lib/services/api/appointments";

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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
