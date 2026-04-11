import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View, Text } from 'react-native';
import {useCallback, useEffect, useRef, useState} from "react";
import {useSpa} from "@/lib/context/SpaContext";
import {FlashList} from "@shopify/flash-list";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";
import {useAdmin} from "@/lib/context/AdminContext";
import {Button} from "react-native-paper";
import {_assignStaff} from "@/lib/services/api/appointments";

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
  const { fetchStaffs } = useAdmin()

  const [filterType, setFilterType] = useState('ALL');

  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef<any>(null);

  useEffect(() => {
    fetchAppointments()
    fetchStaffs()
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
      filterByStatus(filterType)
      setRefreshing(false);
    }, 1000);
  }, [filterType]);

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
                     setFilterType(button.type);
                     await filterByStatus(button.type);
                   }}
                 >
                   {button.label}
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
        data={appointments}
        renderItem={({ item }) => <AppointmentCard data={item} onSelectStaff={async (id, staffId) => {
          await _assignStaff(id, {staffId})
          await filterByStatus(filterType)
        }}/>
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
