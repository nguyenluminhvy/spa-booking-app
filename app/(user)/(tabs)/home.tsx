import React, { useEffect, useState, useCallback } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import {router, Stack, useRouter} from "expo-router";
import { Image } from "expo-image";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";

import ImagePager from "@/lib/components/ui/ImagePager";
import AppointmentCard from "@/lib/components/ui/AppointmentCard";

import { useAuth } from "@/lib/context/AuthContext";
import { getServices } from "@/lib/services/api/services";
import { getUpcomingAppointment } from "@/lib/services/api/appointments";
import {IMAGES} from "@/lib/assets/images";
import {formatPrice} from "@/lib/utils/helper";
import {NotificationButton} from "@/lib/components/ui/NotificationButton";
import {_getOrCreateChatConversation} from "@/lib/services/api/chat";
import {useNotifications} from "@/lib/context/NotificationContext";
import {MessageListButton} from "@/lib/components/ui/MessageListButton";

type Service = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: any;
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

  const viewServiceDetails = () => {
    router.push(`/service/${item.id}`);
  }

  return <TouchableOpacity style={styles.serviceItem} activeOpacity={0.4} onPress={viewServiceDetails}>
    <Image
      source={item.imageUrl}
      contentFit="cover"
      style={styles.serviceImage}
    />

    <View style={styles.serviceContent}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text variant={'labelLarge'} style={{fontWeight: 'bold'}}>{item.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <MaterialCommunityIcons
            name={"star"}
            size={17}
            color={'#FFC107'}
          />
          <Text variant={'labelMedium'} style={{ color: '#FFC107'}}>{item.rating.average}</Text>
          <Text variant={'labelMedium'} style={{ color: '#999'}}>({item.rating.total})</Text>
        </View>
      </View>

      <View style={styles.serviceFooter}>
        <Text variant="labelLarge">
          {formatPrice(item.price)}
        </Text>

        <TouchableOpacity onPress={goToSelectTime}>
          <Text style={styles.link}>Book now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
};

export default function HomeScreen() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const { hasUnreadMessage } = useNotifications();

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

  const onOpenChat = async () => {
    const response = await _getOrCreateChatConversation()
    const convoId = response?.id

    if (convoId) {
      router.push({
        pathname: "/chat/[conversationId]",
        params: {
          conversationId: convoId,
        },
      });
    }
  }

  return (
    <View style={{flex: 1}}>
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
                  {`👋 ${user?.name || ""}`}
                </Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 16, flexDirection: 'row', gap: 8 }}>
              <NotificationButton size={'medium'} refreshing={refreshing}/>
            </View>
          ),
        }}
      />


      <ScrollView
        contentContainerStyle={{ paddingBottom: 80}}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
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

      <TouchableOpacity activeOpacity={0.7} style={styles.chatBubbleButton} onPress={onOpenChat}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color={"white"} />
        {
          hasUnreadMessage &&  <View style={styles.chatBubbleBadge}/>
        }

      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
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

  chatBubbleButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: "#006EE9",
    borderRadius: 50,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatBubbleBadge: {
    backgroundColor: '#FF3B30',
    width: 16,
    height: 16,
    borderRadius: 50,
    position: 'absolute',
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white'
  },
});
