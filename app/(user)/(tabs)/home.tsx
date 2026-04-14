import React, { useEffect, useState, useCallback } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import {router, useRouter} from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import ImagePager from "@/lib/components/ui/ImagePager";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";

import { useAuth } from "@/lib/context/AuthContext";
import { getServices } from "@/lib/services/api/services";
import { getUpcomingAppointment } from "@/lib/services/api/appointments";
import {IMAGES} from "@/lib/assets/images";

type Service = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

const ServiceItem = ({ item }: { item: Service }) => {

  const goToSelectTime = () => {
    router.push({
      pathname: '/select-time',
      params: {
        serviceId: item?.id,
      }
    })
  }

  return <View style={styles.serviceItem}>
    <Image
      source={item.imageUrl}
      contentFit="cover"
      style={styles.serviceImage}
    />

    <View style={styles.serviceContent}>
      <Text variant="labelLarge">{item.name}</Text>

      <View style={styles.serviceFooter}>
        <Text variant="labelLarge">
          {item.price?.toLocaleString()}₫
        </Text>

        <TouchableOpacity onPress={goToSelectTime}>
          <Text style={styles.link}>Book now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
};

export default function HomeScreen() {
  const { navigate } = useRouter();
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [serviceRes, appointmentRes] = await Promise.all([
        getServices({ limit: 5 }),
        getUpcomingAppointment({ limit: 1 }),
      ]);

      setServices(serviceRes || []);
      setAppointments(appointmentRes || []);
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData()
      setRefreshing(false);
    }, 1000);
  }, []);



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
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {`Hello ${user?.name || ""} 👋`}
          </Text>
          <Text style={styles.subText}>Have a nice day.</Text>
        </View>

        <TouchableOpacity style={styles.notifyBtn}>
          <Ionicons name="notifications-outline" size={22} />
        </TouchableOpacity>
      </View>

      <ImagePager />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>

          <TouchableOpacity onPress={() => {
            router.navigate('/(user)/(tabs)/booking')
          }}>
            <Text style={styles.link}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {services.map((item) => (
            <ServiceItem key={item.id} item={item} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming</Text>

        <View style={styles.list}>
          {appointments.length > 0 ? (
            appointments.map((item) => (
              <AppointmentCard key={item.id} data={item} />
            ))
          ) : (
            <View style={{
              flex: 1,
              paddingBottom: 40,
              alignItems: 'center',
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
              <Text style={styles.emptyText}>No upcoming appointments</Text>

              <TouchableOpacity
                style={{
                borderWidth: 0.5,
                borderStyle: 'dashed',
                borderColor: '#006EE9',
                borderRadius: 8,
                padding: 8,
                paddingHorizontal: 12
              }} onPress={() => router.navigate('/(user)/(tabs)/booking')}
              >
                <Text style={styles.link}>Book now</Text>
              </TouchableOpacity>

            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  list: {
    gap: 12,
  },

  serviceItem: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#fff",

    shadowColor: "rgba(6,7,38,0.17)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },

  serviceContent: {
    flex: 1,
    justifyContent: "space-between",
    gap: 16
  },

  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  link: {
    color: "#006EE9",
    fontWeight: "500",
  },

  emptyText: {
    textAlign: "center",
    color: "#999",
  },
});
