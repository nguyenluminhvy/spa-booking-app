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
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {useAuth} from "@/lib/context/AuthContext";

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

const PaymentItem = ({ payment, onPress }) => {

  if (!payment) return null;

  return (
    <View style={{gap: 8}}>
      <Text variant="titleMedium">
        {'Payment Method'}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
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

        <TouchableOpacity style={{width: 70}} onPress={onPress}>
          <Text style={{
            textAlign: 'right',
            color: '#006EE9'
          }}>Change</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function ConfirmBookingScreen() {
  const { serviceId, selectTime } = useLocalSearchParams();
  const { setLoading } = useAuth();
  const { fetchAppointments, validateCoupon } = useSpa();

  const [service, setService] = useState<any>({});
  const [paymentCode, setPaymentCode] = useState<string>('CASH');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<any>(null);
  const [error, setError] = useState('');

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
        appointmentTime,
        voucherCode: applied?.finalAmount ? code : ''
      };

      const response = await createAppointment(data);

      if (response?.code === 0) {
        router.push('/(user)/booking-success-modal')
      } else if (response?.code === -1) {
        return Alert.alert(`Notice`, response?.message, [
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

  const onApplyCode = async () => {
    if (!code) return;
    try {
      setLoading(true);
      setError('');
      const res = await validateCoupon({
        code,
        totalAmount: service.price,
      })

      console.log(res, 'res')

      if (res?.discount) {
        setApplied({
          code,
          discount: res.discount,
          finalAmount: res.finalAmount,
        });
      } else if (res?.message) {
        setApplied(null)
        setError(res?.message || 'Invalid code');
      }
    } finally {
      setLoading(false);
    }
  };

  const remove = () => {
    setApplied(null);
    setCode('');
  };

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


      <View style={{gap: 8}}>
        <Text variant="titleMedium">
          {'Coupon'}
        </Text>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
         <View style={{flex: 1, gap: 4}}>
           <TextInput
             mode={"outlined"}
             autoCapitalize={'characters'}
             value={code}
             onChangeText={(text) => setCode(text?.toUpperCase())}
             style={{ backgroundColor: "white", fontSize: 14 }}
             outlineStyle={{ borderRadius: 12, borderWidth: 0.5 }}
             outlineColor={"#bababa"}
             activeOutlineColor={"#bababa"}
             placeholder="Enter promo code"
             placeholderTextColor={"rgba(0,0,0,0.35)"}
             left={<TextInput.Icon icon="ticket-percent" color={'#006EE9'} />}
           />
           {!!error && (
             <Text variant={'labelSmall'} style={{ color: 'rgba(234, 57, 67, 1)' }}>
               {error}
             </Text>
           )}
         </View>


          <TouchableOpacity style={{width: 70}} onPress={() => {
            onApplyCode()
          }}>
            <Text style={{
              textAlign: "right",
              color: '#006EE9'
            }}>Apply</Text>
          </TouchableOpacity>
        </View>

        {applied && (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" color="#2ecc71" size={18} />
            <Text style={styles.successText}>
              {applied.code} applied (-{formatPrice(applied.discount)})
            </Text>
            <TouchableOpacity onPress={remove}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        </View>

        <PaymentItem payment={PAYMENT_CONFIG[paymentCode]} onPress={onChangePayment}/>

        <View style={{gap: 8}}>
          <View style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text variant="titleMedium">
              {'Service'}
            </Text>
            <Text style={{ fontSize: 16}}>
              {formatPrice(service?.price)}
            </Text>
          </View>
          <View style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text variant="titleMedium">
              {'Coupon'}
            </Text>
            <Text style={{ fontSize: 16}}>
              {`${applied?.discount ? `-${formatPrice(applied?.discount)}` : `${formatPrice(0)}`}`}
            </Text>
          </View>
          <View style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text variant="titleMedium">
              {'Total to pay'}
            </Text>
            <Text style={{ fontSize: 16}}>
              {formatPrice(service?.price - (applied?.discount || 0))}
            </Text>
          </View>
        </View>

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
    paddingTop: 8,
  },
  row: {
    alignItems: 'center',
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
    flex: 1,
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
  error: {
    color: 'red',
    fontSize: 12,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF8F0',
    padding: 10,
    borderRadius: 8,
  },
  successText: {
    flex: 1,
    color: '#2ecc71',
  },
  remove: {
    color: '#e74c3c',
  },
});
