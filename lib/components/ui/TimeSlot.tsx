import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  time: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

const TimeSlot = ({ time, selected, disabled, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          selected && styles.selectedText,
          disabled && styles.disabledText,
        ]}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );
};

export default TimeSlot;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 6,
    width: 75,
  },
  text: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: '#006EE9',
    borderColor: '#006EE9',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabled: {
    backgroundColor: '#f2f2f2',
    borderColor: '#eee',
  },
  disabledText: {
    color: '#aaa',
  },
});
