import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';

import {router, Stack, useLocalSearchParams} from "expo-router";
import {TextInput, Text, Button} from "react-native-paper";
import React, {useEffect, useMemo, useState} from "react";
import {Image} from "expo-image";
import moment from "moment";
import {InfoItem} from "@/lib/components/ui/AppointmentCard";
import {useSpa} from "@/lib/context/SpaContext";
import {Ionicons} from "@expo/vector-icons";
import {getServiceDetail} from "@/lib/services/api/services";
import {createAppointment} from "@/lib/services/api/appointments";
import {formatPrice} from "@/lib/utils/helper";
import {IMAGES} from "@/lib/assets/images";
import SelectPaymentModal from "@/lib/components/ui/SelectPaymentModal";
import {SafeAreaView} from "react-native-safe-area-context";

const PAYMENT_CONFIG = {
  CASH: {
    type: 'icon',
    icon: 'wallet',
    label: 'Cash',
  },
  VISA: {
    type: 'image',
    image: IMAGES.visa,
    label: '**** **** **** 1234',
  },
  MASTER: {
    type: 'image',
    image: IMAGES.mastercard,
    label: '**** **** **** 5678',
  },
};

const PaymentItem = ({ payment }) => {

  if (!payment) return null;

  return (
    <View style={styles.paymentContainer}>
      {payment.type === 'icon' ? (
        <Ionicons name={payment.icon} size={25} color={'#105CDB'} />
      ) : (
        <Image
          style={styles.paymentImage}
          source={payment.image}
          contentFit="contain"
        />
      )}
      <Text variant="labelLarge">{payment.label}</Text>
    </View>

  );

};

export default function ConfirmBookingScreen() {
  const { serviceId, selectTime } = useLocalSearchParams();
  const { fetchAppointments } = useSpa();

  const [service, setService] = useState<any>({});
  const [paymentCode, setPaymentCode] = useState<string>('CASH');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const onConfirmBooking = async () => {
    try {
      const appointmentTime = selectTime

      const data = {
        serviceId: Number(serviceId),
        appointmentTime
      };

      const response = await createAppointment(data);

      if (response?.code === 0) {
        router.push('/(user)/booking-success-modal')
      } else if (response?.code === -1) {
        return Alert.alert(`Notice`, "You already have an appointment during this time slot. Please choose a different time.", [
          { text: "OK", style: "default", onPress: async () => {
            } },
        ]);
      }
    } catch (e) {

    }
  }

  const onChangePayment = async () => {
    setShowPaymentModal(true)
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        gap: 20,
        paddingTop: 20,
      }}>
        <View style={styles.item}>
          <View>
            <Image
              contentFit={'cover'}
              source={service?.imageUrl} style={{ height: 200, width: '100%', borderRadius: 16 }} />
          </View>

          <View style={styles.row}>
            <InfoItem
              icon="spa"
              label="Service"
              value={service?.name || '--'}
            />
            <InfoItem icon="calendar-check-outline" label="Booked On" value={moment(selectTime).format('DD-MM-YYYY | HH:mm')} />
          </View>

          <View style={styles.row}>
            <InfoItem
              icon="cash-check"
              label="Amount"
              value={service?.price ? `${formatPrice(service?.price)}` : '--'}
            />
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text variant="titleMedium">
            {'Payment Method'}
          </Text>

          <TouchableOpacity onPress={() => {
            onChangePayment()
          }}>
            <Text style={{
              color: '#006EE9'
            }}>Change</Text>
          </TouchableOpacity>
        </View>

        <PaymentItem payment={PAYMENT_CONFIG[paymentCode]} />

        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: 16,
        }}>

          <View style={{
            marginBottom: 20,
            paddingHorizontal: 40
          }}>
            <Text style={{ textAlign: 'center', fontSize: 13}}>
              By Booking, you acknowledge and accept our <Text onPress={() => {
              router.push('/term')
            }}  style={{ color: '#006EE9'}}>Terms Conditions</Text> and <Text onPress={() => {
              router.push('/policy')
            }} style={{ color: '#006EE9'}}>Privacy Policy</Text>
            </Text>
          </View>

          <Button
            mode="contained"
            buttonColor="#105CDB"
            style={{
              alignSelf: 'flex-end',
              width: "100%",
              borderRadius: 8,
            }}
            contentStyle={{
              height: 52,
            }}
            onPress={onConfirmBooking}
          >
            Confirm
          </Button>
        </View>
      </View>

      <SelectPaymentModal
        visible={showPaymentModal}
        paymentCode={paymentCode}
        onClose={() => setShowPaymentModal(false)}
        onSelect={(code) => {
          setPaymentCode(code)
          setShowPaymentModal(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {

  },
  item: {
    backgroundColor: 'rgba(0,110,233,0.05)',
    borderRadius: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 16
  },

  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#006EE9'
  },
  modalMessage: {
    fontSize: 14,
    paddingHorizontal: 40,
    textAlign: 'center',
    marginBottom: 12,
  },

  cancel: {
    textAlign: 'center',
    marginTop: 12,
    color: 'white',
  },

  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bababa',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 8,
    height: 56,
  },
  paymentImage: {
    width: 36,
    height: '100%',
  },
});
