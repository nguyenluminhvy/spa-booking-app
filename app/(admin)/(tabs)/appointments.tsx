import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import { View, Text } from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useSpa} from "@/lib/context/SpaContext";
import {FlashList} from "@shopify/flash-list";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";
import {useAdmin} from "@/lib/context/AdminContext";
import {Button} from "react-native-paper";
import {_assignStaff} from "@/lib/services/api/appointments";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {NotificationButton} from "@/lib/components/ui/NotificationButton";
import {router, Stack} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {MessageListButton} from "@/lib/components/ui/MessageListButton";

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

  const [filterType, setFilterType] = useState('');

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
        renderItem={({ item }) => (
          <AppointmentCard
            data={item}
            onConfirmed={() => filterByStatus(filterType)}
            onCompleted={() => filterByStatus(filterType)}
            onSelectStaff={async (id, staffId) => {
              await _assignStaff(id, {staffId})
              await filterByStatus(filterType)
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
});
