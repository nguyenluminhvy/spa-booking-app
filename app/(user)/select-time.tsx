import {Alert, StyleSheet, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import {router, Stack, useLocalSearchParams, useRouter} from "expo-router";
import {TextInput, Text, Button} from "react-native-paper";
import {useEffect, useMemo, useState} from "react";
import {isIos} from "@/lib/utils/helper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import TimeSlot from "@/lib/components/ui/TimeSlot";
import moment from "moment";
import {PickDateButton} from "@/lib/components/ui/PickDateButton";

const TIMES = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

const isPastTimeSlot = (date: Date, time: string) => {
  const now = moment();

  const [hour, minute] = time.split(':').map(Number);

  const slotTime = moment(date).set({
    hour,
    minute,
    second: 0,
    millisecond: 0,
  });

  if (!moment(date).isSame(now, 'day')) {
    return false;
  }

  return slotTime.isBefore(now);
};

export default function SelectTimeScreen() {
  const { push, navigate } = useRouter()

  const { serviceId } = useLocalSearchParams();

  const insets = useSafeAreaInsets();
  const bottom = isIos ? insets.bottom : 20;

  const [startDate, setStartDate] = useState<Date>(moment().toDate());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dateTime = moment(startDate)
    .set({
      hour: Number(selectedTime?.split(':')[0]),
      minute: Number(selectedTime?.split(':')[1]),
      second: 0,
      millisecond: 0,
    });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const isError = useMemo(() => {
    return !!errorMessage
  }, [errorMessage])

  const goToConfirm = async () => {
    push({
      pathname: '/(user)/confirm-booking',
      params: {
        serviceId: serviceId,
        selectTime: dateTime.toISOString()
      }
    })
  }

  return (
    <View style={{
      flex: 1,
      paddingBottom: bottom,
    }}>

      <View style={{ flex: 1, gap: 8, paddingHorizontal: 16 }}>
        <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
          Select Date
        </Text>
        <PickDateButton
          calendarMode={"date"}
          buttonColor={"#EEF5FD"}
          textColor={"#006EE9"}
          style={{
            borderWidth: 0.5,
            borderRadius: 12,
            borderColor: "rgba(0,110,233,0.4)",
          }}
          dateDefault={startDate}
          onDateChange={setStartDate}
        />

        <View style={{flexDirection: 'row', justifyContent:'space-between', flexWrap: 'wrap', gap: 4}}>
          {TIMES.map((time) => (
            <TimeSlot
              key={time}
              time={time}
              selected={selectedTime === time}
              disabled={isPastTimeSlot(startDate, time)}
              onPress={() => setSelectedTime(time)}
            />
          ))}
        </View>
      </View>

      <View style={{
        paddingHorizontal: 16,
      }}>
        <Button
          mode="contained"
          buttonColor="#105CDB"
          style={{
            width: "100%",
            borderRadius: 8,
            marginBottom: isIos ? 0 : 16,
            marginTop: 8,
          }}
          contentStyle={{
            height: 52,
          }}
          disabled={!selectedTime}
          onPress={goToConfirm}
        >
          {"Continue"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
