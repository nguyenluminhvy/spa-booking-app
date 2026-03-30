import {StyleSheet, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import {Stack, useLocalSearchParams} from "expo-router";
import {KeyboardAwareScrollView, KeyboardToolbar} from "react-native-keyboard-controller";
import {TextInput, Text, Button} from "react-native-paper";
import {useEffect, useMemo, useState} from "react";
import {isIos} from "@/lib/utils/helper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import {createService, getServiceDetail, updateService} from "@/lib/services/api/services";
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

export default function ConfirmBookingScreen() {
  const { serviceId } = useLocalSearchParams();
  const isEditMode = serviceId !== "new";

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

  console.log(moment(dateTime).format('YYYY-MM-DD HH:mm'));


  const [service, setService] = useState({
    name: '',
    price: '',
    duration: 0,
    description: '',
  });
  const [image, setImage] = useState({});

  const [errorMessage, setErrorMessage] = useState<string>("");

  const isError = useMemo(() => {
    return !!errorMessage
  }, [errorMessage])

  useEffect(() => {
    (async () => {
      if (serviceId) {
        const data = await getServiceDetail(serviceId)

        if (data) {
          setService(data)
          setImage({
            uri: data.imageUrl,
          });
        } else {
          // setTask(prev => ({
          //   ...prev,
          //   category: TaskCategory.Personal,
          //   status: TaskStatus.Todo,
          //   priority: TaskPriority.Medium,
          //   reminderOffset: 10,
          // }))
        }
      }
    })();
  }, [serviceId]);

  return (
    <View style={{
      flex: 1
    }}>

     <View>

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
