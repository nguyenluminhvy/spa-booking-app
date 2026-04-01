import {RefreshControl, StyleSheet, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from 'react-native';
import {useCallback, useEffect, useState} from "react";
import {useSpa} from "@/lib/context/SpaContext";
import {FlashList} from "@shopify/flash-list";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";
import {useAdmin} from "@/lib/context/AdminContext";

export default function AppointmentsScreen() {
  const { appointments, fetchAppointments } = useSpa()
  const { fetchStaffs } = useAdmin()

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAppointments()
    fetchStaffs()
  }, [])

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
      <FlashList
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
