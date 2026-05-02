import React, { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import {formatPrice} from "@/lib/utils/helper";
import {MaterialCommunityIcons} from "@expo/vector-icons";


const RatingSlider = (props: any) => {
  const [value, setValue] = useState(props?.value ?? 5);

  const onChange = (value: number) => {
    setValue(value);
    props.onChange(value);
  }

  return (
    <View style={{marginTop: 8}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
          <Text style={styles.text}>{0}</Text>
          <MaterialCommunityIcons name={'star'} size={20} color={'#FFC107'} />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
          <Text style={styles.text}>{value}</Text>
          <MaterialCommunityIcons name={'star'} size={20} color={'#FFC107'} />
        </View>

      </View>
      <Slider
        minimumValue={1}
        maximumValue={5}
        thumbTintColor={'#006EE9'}
        minimumTrackTintColor={'#006EE9'}
        tapToSeek
        step={1}
        style={[styles.slider, props.style]}
        {...props}
        value={value}
        onValueChange={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  slider: {
    width: 300,
    opacity: 1,
  },
});

export default RatingSlider;
