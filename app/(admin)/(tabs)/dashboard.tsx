import {RefreshControl, ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';

import { Text } from '@/components/Themed';
import {Button, Chip} from "react-native-paper";
import {Stack, useRouter} from "expo-router";
import React, {useCallback, useEffect, useState} from "react";
import {useAuth} from "@/lib/context/AuthContext";
import {LinearGradient} from "expo-linear-gradient";
import {BarChart, LineChart, PieChart,} from "react-native-chart-kit";
import {_getBookings, _getOverview, _getRevenue, _getStatus} from "@/lib/services/api/dashboard";
import {formatPrice} from "@/lib/utils/helper";
import {NotificationButton} from "@/lib/components/ui/NotificationButton";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {MessageListButton} from "@/lib/components/ui/MessageListButton";
import {TopServicesCard} from "@/lib/components/ui/TopServicesCard";
import {TopUserCard} from "@/lib/components/ui/TopUserCard";
import {TopStaffCard} from "@/lib/components/ui/TopStaffCard";
import {
  DashboardAdvancedFilterModal,
  DashboardAdvancedFilterValue
} from "@/lib/components/ui/DashboardAdvancedFilterModal";
import moment from "moment/moment";

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

  if (!labels?.length) {
    return
  }

  return labels?.map((status, index) => ({
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

const KpiCard = ({ icon, title, value, trend, isUp, colors, BottomComponent }: any) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>

      {BottomComponent}
    </LinearGradient>
  );
};

export const EmptyChart = () => {
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      paddingVertical: 20,
      gap: 8
    }}>
      <Image
        style={{
          width: "100%",
          height: 50,
        }}
        source={IMAGES.nodata}
        contentFit="contain"
      />
      <Text variant={'labelMedium'}>
        No data
      </Text>
    </View>
  );
};

export default function DashboardScreen() {
  const { navigate } = useRouter()
  const { user, setLoading } = useAuth();

  const {width} = useWindowDimensions()

  const [overview, setOverview] = useState({
    revenue: 0,
    appointments: 0,
    newUsers: 0,
    completed: 0,
    cancelled: 0,
    topServices: [],
    topUserBooking: [],
    topStaff: [],
  });

  const [revenue, setRevenue] = useState({
    labels: [],
    data: [],
  });
  const [bookings, setBookings] = useState({
    labels: [],
    data: [],
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


  const [filterType, setFilterType] = useState<any>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [advancedFilterValue, setAdvancedFilterValue] = useState<DashboardAdvancedFilterValue>({
    type: 'all'
  });

  const fetchData = useCallback(async (range: any, customRange?: any) => {
    setFilterType(range)
    try {
      setLoading(true);

      const [overviewResponse, revenue, bookings, statusResponse] = await Promise.all([
        _getOverview({
          range: range,
          startDate: customRange?.start,
          endDate: customRange?.end,
        }),
        _getRevenue({
          range: range,
          startDate: customRange?.start,
          endDate: customRange?.end,
        }),
        _getBookings({
          range: range,
          startDate: customRange?.start,
          endDate: customRange?.end,
        }),
        _getStatus({
          range: range,
          startDate: customRange?.start,
          endDate: customRange?.end,
        }),
      ]);

      if (overviewResponse?.code === 0) {
        setOverview(overviewResponse?.data || {});
      }

      if (revenue?.data) {
        setRevenue(revenue || {});
      }

      if (bookings?.data) {
        setBookings(bookings || {});
      }

      if (statusResponse?.code === 0) {
        const pieData = mapStatusToPieData(statusResponse?.data)
        setStatusData(pieData || []);
      }

    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setFilterType(advancedFilterValue.type);
    fetchData(advancedFilterValue.type, advancedFilterValue.range);
  }, [advancedFilterValue]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData(filterType, advancedFilterValue?.range)
      setRefreshing(false);
    }, 1000);
  }, [filterType, advancedFilterValue]);

  return (
    <View style={styles.container}>

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
            <View style={{ marginRight: 16, flexDirection: 'row', gap: 8 }}>
              <MessageListButton size={'medium'}/>

              <NotificationButton size={'medium'} refreshing={refreshing}/>
            </View>
          ),
        }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Overview</Text>

        <DashboardAdvancedFilterModal value={advancedFilterValue} onChange={(data) => {
          console.log(data, 'data AdvancedFilterModal');
          setAdvancedFilterValue(data)
        }}/>
      </View>

        {
          advancedFilterValue.range && (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingTop: 16}}>
              <Chip selectedColor={'white'} style={{
                backgroundColor: '#006EE9'
              }} onClose={() => {
                setAdvancedFilterValue(prev => ({ ...prev, range: undefined }));
              }}>{`from ${moment(advancedFilterValue.range.start).format("MMM-DD-YYYY")} to ${moment(advancedFilterValue.range.end).format("MMM-DD-YYYY")}`}</Chip>
            </View>
          )
        }

      {
        !advancedFilterValue.range && (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              paddingBottom: 8,
              marginTop: 16
            }}
          >
            {BUTTONS?.map((button, index) => {
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
                    setAdvancedFilterValue(prev => ({ ...prev, type: button.type }));
                  }}
                >
                  {button.label}
                </Button>
              );
            })}
          </View>
        )
      }

      <ScrollView
        style={{}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >

        <View style={{ marginTop: 16 }}>
          <KpiCard
            title="Revenue"
            value={formatPrice(overview.revenue)}
            colors={['#967ADC', '#AC92EC']}
            BottomComponent={
              <View>
                <Text style={styles.title}>Coupons</Text>

                <View style={{ marginTop: 4, flexDirection: 'row', gap: 4 }}>
                  <View>
                    <Text style={{ color: 'white'}}>Usage Count:</Text>
                    <Text style={{ color: 'white'}}>Usage Rate:</Text>
                    <Text style={{ color: 'white'}}>Total Discount:</Text>
                  </View>
                  <View>
                    <Text style={{ color: 'white', fontWeight: 'bold'}}>{overview?.voucher?.usageCount}</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold'}}>{overview?.voucher?.usageRate} %</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold'}}>{formatPrice(overview?.voucher?.totalDiscount)}</Text>
                  </View>
                </View>
              </View>
            }
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <KpiCard
              title="Bookings"
              value={overview.appointments}
              colors={['#3BAFDA', '#4FC1E9']}
            />

            <KpiCard
              title="New Users"
              value={overview.newUsers}
              colors={['#FCBB42', '#FFCE54']}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <KpiCard
              title="Done"
              value={overview.completed}
              trend="+10%"f
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
          {
            revenue.labels?.length > 0 && revenue.data?.length > 0 ? (
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
            ) : (
              <EmptyChart />
            )
          }
        </View>

        <View style={[styles.cardChart, {paddingRight: 0}]}>
          <Text style={styles.titleChart}>Bookings</Text>
          {
            bookings.labels?.length > 0 && bookings.data?.length > 0 ? (
              <View style={{paddingRight: 32}}>
                <BarChart
                  data={{
                    labels: bookings.labels,
                    datasets: [
                      {
                        data: bookings.data,
                      },
                    ],

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
            ) : (
              <EmptyChart />
            )
          }

        </View>

        <View style={styles.cardChart}>
          <Text style={styles.titleChart}>Appointment Status</Text>

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

        <TopServicesCard data={overview?.topServices} />

        <TopUserCard data={overview?.topUserBooking}/>

        <TopStaffCard data={overview?.topStaff}/>

      </ScrollView>
    </View>
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
