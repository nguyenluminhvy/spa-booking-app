import React, { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import {formatPrice} from "@/lib/utils/helper";


const PriceSlider = (props: any) => {
  const [value, setValue] = useState(props?.value ?? 1000000);

  const onChange = (value: number) => {
    setValue(value);
    props.onChange(value);
  }

  return (
    <View style={{marginTop: 8}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.text}>{formatPrice(100*1000)}</Text>
        <Text style={styles.text}>{value && formatPrice(value)}</Text>
      </View>
      <Slider
        minimumValue={100000}
        maximumValue={1000000}
        thumbTintColor={'#006EE9'}
        minimumTrackTintColor={'#006EE9'}
        tapToSeek
        step={100000}
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
    margin: 0,
  },
  slider: {
    width: 300,
    opacity: 1,
  },
});

export default PriceSlider;
