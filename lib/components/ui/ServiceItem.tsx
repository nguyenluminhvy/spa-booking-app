import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {Text} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {formatPrice} from "@/lib/utils/helper";
import { Image } from 'expo-image'

export function ServiceItem({ item, onPress }) {

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
    >
      <View>
        <Image
          contentFit="cover"
          source={item.imageUrl}
          style={styles.image}
        />

        <View style={[styles.badge, styles.badgeLeft]}>
          <Text style={styles.badgeText}>{item.duration}p</Text>
        </View>

        <View style={[styles.badge, styles.badgeRight]}>
          <Text style={styles.badgeText}>
            {formatPrice(item.price)}
          </Text>

        </View>

      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text variant="labelMedium" style={styles.name}>
            {item.name} •
          </Text>

          <View style={styles.ratingRow}>
            <MaterialCommunityIcons
              name="star"
              size={17}
              color="#FFC107"
            />

            <Text variant="labelMedium" style={styles.rating}>
              {item.rating.average}
            </Text>

            <Text variant="labelMedium" style={styles.ratingCount}>
              ({item.rating.total})
            </Text>
          </View>
        </View>

        <Text variant="titleMedium" style={styles.description}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingBottom: 0,
    // borderRadius: 40,
    // borderWidth: 1,
    marginBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,

    shadowColor: 'rgba(6, 7, 38, 0.17)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },

  image: {
    height: 200,
    width: '100%',
    borderRadius: 16,
  },

  badge: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: '#eff6fd',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  badgeLeft: {
    left: 12,
  },

  badgeRight: {
    right: 12,
  },

  badgeText: {
    color: '#105CDB',
  },

  content: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    color: '#999',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  rating: {
    color: '#FFC107',
  },

  ratingCount: {
    color: '#999',
  },

  description: {
    fontWeight: 'bold',
    marginVertical: 4,
  },
});
