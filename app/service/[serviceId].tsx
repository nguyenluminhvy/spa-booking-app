import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import { View } from '@/components/Themed';
import {router, useLocalSearchParams} from "expo-router";
import React, {useEffect, useState} from "react";
import {getServiceDetail} from "@/lib/services/api/services";
import {SafeAreaView} from "react-native-safe-area-context";
import {Image} from "expo-image";
import {ActivityIndicator, Button, Text} from "react-native-paper";
import {formatPrice, isIos} from "@/lib/utils/helper";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import TabView from "@/lib/components/ui/TabView";
import RatingOverview from "@/lib/components/ui/RatingOverview";
import ServiceAboutView from "@/lib/components/ui/ServiceAboutView";

const BIO_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet enim ac enim pretium ornare. Aenean sagittis libero vitae metus cursus tincidunt. Ut eget imperdiet lacus, nec pretium justo. Etiam ac nunc tellus. Pellentesque sed accumsan ex. Aliquam dictum imperdiet est, ut faucibus quam eleifend nec. Aliquam eleifend erat vel pulvinar dapibus. Morbi sodales mauris nec placerat rutrum. Sed quam quam, luctus vitae commodo nec,'

export default function ServiceDetailScreen() {
  const { serviceId } = useLocalSearchParams();

  const [service, setService] = useState<any>({});
  const [imageLoading, setImageLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: 'About',
      content: <ServiceAboutView
        description={service?.description}
        reviews={service?.reviews || []}
        bookingCount={service?.bookings || 0}
        rated={service?.rating?.average}
        reviewCount={service?.rating?.total}
        onViewRating={() => setActiveTab(1)}
      />
    },
    {
      title: 'Reviews',
      content: <RatingOverview
        rating={service?.rating}
      />
    },
  ];

  useEffect(() => {
    (async () => {
      if (serviceId) {
        const data = await getServiceDetail(serviceId)

        if (data) {
          setService(data)

        }
      }
    })();
  }, [serviceId]);

  const onBookNow = () => {
    router.navigate({
      pathname: '/select-time',
      params: {
        serviceId: serviceId,
      }
    })
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <ScrollView>
        <View style={{ }}>
          <View style={{ height: 200, width: '100%', backgroundColor: 'rgba(0,110,233,0.05)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              onLoadStart={() => {
                setImageLoading(true)
              }}
              onLoadEnd={() => {
                setImageLoading(false)
              }}
              contentFit={'cover'}
              source={service.imageUrl} style={{ height: 200, width: '100%', borderRadius: 16 }} />

            <View style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: 'transparent',
              alignItems: 'center', justifyContent: 'center'
            }}>
              {imageLoading && <ActivityIndicator size={30} animating={true} color={'#105CDB'} />}
            </View>
          </View>

          <View style={{
            position: 'absolute',
            right: 12,
            bottom: 12,
            backgroundColor: '#eff6fd',
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderRadius: 8
          }}>
            <Text style={{ color: '#105CDB'}}>{formatPrice(service?.price || 0)}</Text>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 8
        }}>
          <Text variant={'titleLarge'} style={{color: '#006EE9', fontWeight: 'bold'}}>{service.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <MaterialCommunityIcons
              name={"star"}
              size={17}
              color={'#FFC107'}
            />
            <Text variant={'labelMedium'} style={{ color: ''}}>{service?.rating?.average}</Text>
          </View>
        </View>
        <Text numberOfLines={3} variant={'bodyLarge'} style={{ paddingHorizontal: 20, paddingBottom: 20, color: 'rgba(0,0,0,0.5)'}}>{service.description}</Text>


        <TabView tabs={tabs} activeIndex={activeTab} onChange={setActiveTab}/>

      </ScrollView>

      <View style={{ paddingHorizontal: 20 }}>
        <Button
          mode="contained"
          buttonColor="#105CDB"
          style={{
            width: "100%",
            borderRadius: 8,
            marginTop: 8,
          }}
          contentStyle={{ height: 52 }}
          onPress={onBookNow}
        >
          {"Book Now"}
        </Button>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
