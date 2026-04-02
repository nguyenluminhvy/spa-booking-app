import {RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from 'react-native';
import {useCallback, useEffect, useRef, useState} from "react";
import {useSpa} from "@/lib/context/SpaContext";
import {FlashList} from "@shopify/flash-list";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";
import {Button} from "react-native-paper";

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

  const [filterType, setFilterType] = useState('ALL');

  const [refreshing, setRefreshing] = useState(false);

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
        data={appointments}
        renderItem={({ item }) => <AppointmentCard data={item}/>
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
