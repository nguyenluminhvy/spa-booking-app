import {StyleSheet, View, Text, TextStyle, StyleProp} from "react-native";
import {EmptyChart} from "@/app/(admin)/(tabs)/dashboard";

const getMedal = (index: number) => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return "";
};

const Row = ({ index, name, bookings, isHeader = false }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderBottomWidth:  0,
      }}
    >
      <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
        <Text style={{ fontSize: 12, fontWeight: isHeader ? "600" : "400", width: 20 }}>
          {isHeader ? "" : getMedal(index) || ``}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: isHeader ? "600" : "400" }}>
          {name}
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ textAlign: 'right', fontSize: 12, fontWeight: isHeader ? "600" : "400" }}>
          {bookings}
          <Text style={{ color: 'rgba(0,0,0,0.5)' }}> bookings</Text>
        </Text>
      </View>
    </View>
  );
};

export const TopUserCard = ({ data = [] }: any) => {

  return (
    <View style={[styles.cardChart, { flex: 1 }]}>
      <Text style={styles.titleChart}>💎  Top User</Text>

      {data?.length > 0 ? data.map((item, index) => (
        <Row
          key={item.id}
          index={index}
          name={item.name}
          bookings={item.bookings}
        />
      )) : (
        <EmptyChart/>
      )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  cardChart: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  titleChart: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
})
