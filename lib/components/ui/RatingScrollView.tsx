import React from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ITEM_WIDTH = SCREEN_WIDTH * 0.85;
const ITEM_GAP = 12;

const RatingScrollView = ({data}) => {

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((item) => (
          <View
            key={item.id}
            style={styles.card}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row'}}>
                {Array.from({ length: item?.rating || 1 }).map((_, i) => (
                  <MaterialCommunityIcons
                    key={i}
                    name={"star"}
                    size={16}
                    color={'#FFC107'}
                  />
                ))}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4}}>
               <MaterialCommunityIcons
                 name={"checkbox-marked-circle"}
                 size={14}
                 color={'#fff'}
               />
               <Text style={{
                 color: 'white',
                 fontSize: 12,
                 fontWeight: 'bold',
               }}>
                 Verified Appointment
               </Text>
              </View>
            </View>

            <View style={{
              marginTop: 12
            }}>
              <Text
                numberOfLines={6}
                style={{
                  color: 'white',
                }}>
                {item?.comment}
              </Text>
            </View>

          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: ITEM_GAP,
  },
  card: {
    padding: 8,
    backgroundColor: '#006EE9',
    width: ITEM_WIDTH,
    height: 140,
    borderRadius: 12,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default RatingScrollView;
