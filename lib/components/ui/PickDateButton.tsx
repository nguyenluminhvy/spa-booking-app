import {Alert, View} from "react-native";
import { Text, Button, ButtonProps } from "react-native-paper";
import React, {useEffect, useState} from "react";
import DatePicker from "react-native-date-picker";
import moment from "moment";

export interface PickDateButtonProps extends ButtonProps {
  onDateChange: (date: Date) => void;
  dateDefault: Date | null;
  calendarMode?: 'date' | 'time' | 'datetime'
  format?: string
}

export function PickDateButton({
                                 buttonColor,
                                 textColor,
                                 style,
                                 dateDefault,
                                 onDateChange,
                                 calendarMode = "date",
                                 format = "MMM-DD-YYYY",
                                 disabled = false
                               }: Partial<PickDateButtonProps>) {
  const [date, setDate] = useState(dateDefault || new Date());
  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    if (dateDefault) {
      setDate(dateDefault)
    }
  }, [dateDefault])

  const onChange = (date: Date) => {
    const now = moment();
    const selected = moment(date);
    const maxDate = now.clone().add(1, 'month');

    if (selected.isAfter(maxDate, 'day')) {
      Alert.alert(`Notice`, "You cannot schedule an appointment more than 30 days in advance.", [
        { text: "OK", style: "default", onPress: () => {
            setOpenPicker(false);
          }},
      ]);

      return;
    }

    setOpenPicker(false);
    setDate(date);
    onDateChange?.(date);
  };

  return (
    <View>
      <Button
        disabled={disabled}
        icon={calendarMode === "time" ? "clock" : "calendar"}
        mode="outlined"
        onPress={() => setOpenPicker(true)}
        buttonColor={buttonColor}
        textColor={textColor}
        style={style}
        contentStyle={{
          paddingVertical: 4,
        }}
      >
        <Text style={{ color: "black" }}>
          {moment(date).format(format)}
        </Text>
      </Button>

      <DatePicker
        modal
        minimumDate={new Date()}
        // maximumDate={moment().add(1, 'month').toDate()}
        open={openPicker}
        mode={calendarMode}
        date={date}
        onConfirm={onChange}
        onCancel={() => {
          setOpenPicker(false);
        }}
      />
    </View>
  );
}
