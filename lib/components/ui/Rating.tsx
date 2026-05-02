import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  rating: number | undefined; // 0 -> 5
  size?: number;
  color?: string;
  readonly?: boolean;
  onChange?: (value: number) => void;
};

export default function Rating({
                                 rating = 0,
                                 size = 36,
                                 color = "#FFC107",
                                 readonly = false,
                                 onChange,
                               }: Props) {
  const handlePress = (value: number) => {
    if (readonly) return;
    onChange?.(value);
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= rating;

        return (
          <TouchableOpacity
            key={star}
            activeOpacity={0.7}
            onPress={() => handlePress(star)}
          >
            <MaterialCommunityIcons
              name={isFilled ? "star" : "star-outline"}
              size={size}
              color={color}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
  },
});
