import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';

import { Text, View } from '@/components/Themed';
import {Button, SegmentedButtons} from "react-native-paper";
import {removeStringData} from "@/lib/utils/AsyncStorage";
import {Stack, useRouter} from "expo-router";
import React, {useCallback, useEffect, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {useAuth} from "@/lib/context/AuthContext";
import {LinearGradient} from "expo-linear-gradient";
import {BarChart, LineChart, PieChart,} from "react-native-chart-kit";
import {getServices} from "@/lib/services/api/services";
import {getUpcomingAppointment} from "@/lib/services/api/appointments";
import {_getBookings, _getOverview, _getRevenue, _getStatus} from "@/lib/services/api/dashboard";

const BUTTONS = [
  {
    label: "Today",
    type: 'day',
  },
  {
    label: "Week",
    type: 'week',
  },
  {
    label: "Month",
    type: 'month',
  },
  {
    label: "All",
    type: 'all',
  },
];

// const revenueData = {
//   labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
//   datasets: [
//     {
//       data: [120,200,150,300,250,400,350],
//     },
//   ],
// };


const revenueData = {
  labels: ["1","3","5","7","9","13","15"],
  datasets: [
    {
      data: [100,150,250,350,180,280,350],
    },
  ],
};



const bookingData = {
  labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  datasets: [
    {
      data: [5,8,6,10,7,20,30],
    },
  ],
};

const pieData = [
  {
    name: 'Pending',
    population: 5,
    color: '#FCBB42',
    legendFontColor: '#333',
    legendFontSize: 12,
  },
  {
    name: 'Confirmed',
    population: 10,
    color: '#3BAFDA',
    legendFontColor: '#333',
    legendFontSize: 12,
  },
  {
    name: 'Done',
    population: 20,
    color: '#8CC152',
    legendFontColor: '#333',
    legendFontSize: 12,
  },
  {
    name: 'Cancelled',
    population: 2,
    color: '#DA4453',
    legendFontColor: '#333',
    legendFontSize: 12,
  },
];

const STATUS_META = {
  PENDING: {
    label: 'Pending',
    color: '#FCBB42',
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: '#3BAFDA',
  },
  DONE: {
    label: 'Done',
    color: '#8CC152',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: '#DA4453',
  },
};

const mapStatusToPieData = (resData) => {
  const { labels, data } = resData;

  return labels.map((status, index) => ({
    name: STATUS_META[status]?.label || status,
    population: data[index],
    color: STATUS_META[status]?.color || '#ccc',
    legendFontColor: '#333',
    legendFontSize: 12,
  }));
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',

  decimalPlaces: 0,

  color: (opacity = 1) => `rgba(124, 131, 253, ${opacity})`, // tím pastel
  labelColor: () => '#888',

  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#7C83FD',
  },

  propsForBackgroundLines: {
    stroke: '#eee', // grid nhẹ
  },
};

const KpiCard = ({ icon, title, value, trend, isUp, colors }) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>
    </LinearGradient>
  );
};

export default function DashboardScreen() {
  const { navigate } = useRouter()
  const { user } = useAuth();

  const {width} = useWindowDimensions()

  const [overview, setOverview] = useState({
    revenue: 0,
    appointments: 0,
    newUsers: 0,
    completed: 0,
    cancelled: 0,
  });

  const [revenue, setRevenue] = useState({
    labels: ["1","3","5","7","9","13","15"],
    data: [100,150,250,350,180,280,350],
  });
  const [bookings, setBookings] = useState({
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    data: [5,8,6,10,7,20,30],
  });
  const [statusData, setStatusData] = useState([
    {
      name: 'Pending',
      population: 5,
      color: '#FCBB42',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Confirmed',
      population: 10,
      color: '#3BAFDA',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Done',
      population: 20,
      color: '#8CC152',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Cancelled',
      population: 2,
      color: '#DA4453',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ]);


  const [filterType, setFilterType] = useState('day');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (range: any) => {
    setFilterType(range)
    try {
      // setLoading(true);

      const [overview, revenue, bookings, statusResponse] = await Promise.all([
        _getOverview({ range: range }),
        _getRevenue({ range: range }),
        _getBookings({ range: range }),
        _getStatus({ range: range }),
      ]);

      const pieData = mapStatusToPieData(statusResponse)

      setOverview(overview || {});
      setRevenue(revenue || {});
      setBookings(bookings || {});
      setStatusData(pieData || []);
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData('day')
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData(filterType)
      setRefreshing(false);
    }, 1000);
  }, [filterType]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: '',
          headerStyle: {
            height: 120
          },
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <View>
                <Text style={styles.greeting}>
                  {`Hello ${user?.name || ""} 👋`}
                </Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.notifyBtn}>
              <Ionicons name="notifications-outline" size={22} />
            </TouchableOpacity>
          ),
        }}
      />

      <Text style={{fontSize: 18, fontWeight: 'bold'}}>Overview</Text>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingBottom: 8,
          marginTop: 16
        }}
      >
        {BUTTONS.map((button, index) => {
          const isActive = button.type === filterType;

          return (
            <Button
              key={index}
              // icon="camera"
              mode="elevated"
              buttonColor={isActive ? "#006EE9" : "#F4F9FF"}
              textColor={isActive ? "white" : "black"}
              // labelStyle={{ fontWeight: isActive ? "bold" : "light" }}
              onPress={() => {
                fetchData(button.type);
              }}
            >
              {button.label}
            </Button>
          );
        })}
      </View>

      <View style={{ marginTop: 16 }}>

        <KpiCard
          title="Revenue"
          value={overview.revenue}
          colors={['#967ADC', '#AC92EC']}
        />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <KpiCard
            title="Bookings"
            value={overview.revenue}
            colors={['#3BAFDA', '#4FC1E9']}
          />

          <KpiCard
            title="Users"
            value={overview.newUsers}
            colors={['#FCBB42', '#FFCE54']}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <KpiCard
            title="Done"
            value={overview.completed}
            trend="+10%"
            colors={['#8CC152', '#A0D468']}
          />

          <KpiCard
            title="Cancelled"
            value={overview.cancelled}
            trend="-2%"
            colors={['#DA4453', '#ED5565']}
          />
        </View>
      </View>




      <View style={styles.cardChart}>
        <Text style={styles.titleChart}>Revenue</Text>

        <LineChart
          data={{
            labels: revenue.labels,
            datasets: [
              {
                data: revenue.data,
              },
            ]
          }}
          width={width - 32}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={[styles.cardChart, {paddingRight: 32}]}>
        <Text style={styles.titleChart}>Bookings</Text>

        <BarChart
          data={{
            labels: bookings.labels,
            datasets: [
              {
                data: bookings.data,
              },
            ]
          }}
          width={width - 36}
          height={180}
          chartConfig={{
            ...chartConfig,
            color: () => '#93C5FD',
          }}
          style={styles.chart}
          yAxisLabel={''}
          yAxisSuffix={''}
        />
      </View>

      <View style={styles.cardChart}>
        <Text style={styles.titleChart}>Status</Text>

        <PieChart
          data={statusData}
          width={width - 32}
          height={180}
          accessor="population"
          backgroundColor="transparent"
          chartConfig={chartConfig}
          paddingLeft={'16'}
          absolute
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
  },

  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E3A59",
  },

  subText: {
    color: "#2E3A59",
  },

  notifyBtn: {
    borderWidth: 0.5,
    borderColor: "#9e9e9e",
    borderRadius: 50,
    padding: 12,
    marginRight: 16,
  },


  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12
  },
  icon: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 6,
  },

  title: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold'
  },

  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  trend: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },

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

  chart: {
    borderRadius: 12,
  },
});
