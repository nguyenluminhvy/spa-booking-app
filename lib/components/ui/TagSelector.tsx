import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
};

export default function TagSelector({
                                      options,
                                      selected,
                                      onChange,
                                    }: Props) {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((tag) => {
        const isSelected = selected.includes(tag);

        return (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              isSelected && styles.tagActive,
            ]}
            onPress={() => toggleTag(tag)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.text,
                isSelected && styles.textActive,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    minWidth: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "rgba(0,110,233,0.1)",
  },

  tagActive: {
    backgroundColor: "#006EE9",
  },

  text: {
    fontSize: 12,
    color: "#006EE9",
    textAlign: 'center'
  },

  textActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
