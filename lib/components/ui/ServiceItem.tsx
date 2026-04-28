import React, {useState} from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {ActivityIndicator, Text} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from 'expo-image'
import {formatPrice} from "@/lib/utils/helper";
import { View } from '@/components/Themed';
import {useAuth} from "@/lib/context/AuthContext";

const STATUS_COLOR = {
  ACTIVE: "#2ECC71",
  INACTIVE: "#FF3B30",
};

export function ServiceItem({ item, onPress }: any) {
  const [imageLoading, setImageLoading] = useState(true);
  const { isAdminRole } = useAuth()

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View>
        <View style={{ height: 200, width: '100%', backgroundColor: 'rgba(0,110,233,0.05)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            onLoadStart={() => {
              setImageLoading(true)
            }}
            onLoadEnd={() => {
              setImageLoading(false)
            }}
            contentFit={'cover'}
            source={item.imageUrl} style={{ height: 200, width: '100%', borderRadius: 16 }} />

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
          <Text style={{ color: '#105CDB'}}>{formatPrice(item.price)}</Text>
        </View>

        {
          isAdminRole && (
            <View style={{
              position: 'absolute',
              right: 12,
              top: 12,
              backgroundColor: STATUS_COLOR[item?.status],
              padding: 6,
              borderRadius: 8
            }}/>
          )
        }
      </View>

      <View style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text variant={'labelMedium'} style={{color: '#999'}}>{item.name}  • </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <MaterialCommunityIcons
              name={"star"}
              size={17}
              color={'#FFC107'}
            />
            <Text variant={'labelMedium'} style={{ color: '#FFC107'}}>{item.rating.average}</Text>
            <Text variant={'labelMedium'} style={{ color: '#999'}}>({item.rating.total})</Text>
          </View>
        </View>
        <Text variant={"titleMedium"} style={{ fontWeight: 'bold', marginVertical: 4 }}>{item.description}</Text>
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
});
