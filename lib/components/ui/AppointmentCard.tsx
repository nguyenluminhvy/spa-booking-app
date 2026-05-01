import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, View, Alert} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Button, Text} from 'react-native-paper';
import moment from 'moment';
import {useSpa} from "@/lib/context/SpaContext";
import {useAuth} from "@/lib/context/AuthContext";
import AssignStaffModal from "@/lib/components/ui/AssignStaffModal";
import {useAdmin} from "@/lib/context/AdminContext";
import {formatPrice} from "@/lib/utils/helper";
import {router} from "expo-router";

type Appointment = {
  id: string;
  staff?: any;
  appointmentTime?: string;
  user?: any;
  service?: any;
  status?: string;
  price?: number;
  review?: any
  originalPrice: any,
  finalPrice: any,
  discount: any,
  voucherCode: any,
};

type Props = {
  data: Appointment;
  disabled?: boolean;
  onPress?: (id: string) => void;
  onCancel?: (id: string) => void;
  onSelectStaff?: (id: any, staffId: any) => void;
  onConfirmed?: () => void;
  onCompleted?: () => void;
  onRated?: () => void;
};

export const InfoItem = ({
                    icon,
                    label,
                    value,
                    highlight,
                  }: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value?: string | number;
  highlight?: boolean;
}) => (
  <View style={styles.infoItem}>
    <MaterialCommunityIcons name={icon} size={20} color="#006EE9" />
    <View>
      <Text variant="labelMedium" style={styles.label}>
        {label}
      </Text>
      <Text
        variant="labelLarge"
        style={highlight ? styles.highlight : undefined}
      >
        {value ?? '--'}
      </Text>
    </View>
  </View>
);

const AppointmentCard = ({ data, disabled, onPress, onCancel, onSelectStaff, onConfirmed, onCompleted, onRated }: Props) => {
  const { id, appointmentTime, staff, status, price, service, user, review, finalPrice, voucherCode } = data;

  const isPending = status === 'PENDING';
  const isConfirmed = status === 'CONFIRMED';
  const isDone = status === 'DONE';
  const isStaffAssigned = !!staff.id;

  const { confirmAppointment, cancelAppointment, completeAppointment, ratingAppointment } = useSpa()
  const { isAdminRole, isStaffRole } = useAuth()
  const { assignStaff } = useSpa()
  const { availableStaffByAppointment, fetchAvailableStaffByAppointment } = useAdmin()

  const [showModal, setShowModal] = useState(false);

  const onConfirm = async () => {


    Alert.alert(`Comfirm this appointment`, "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", style: "default", onPress: async () => {
        await confirmAppointment(id)
        onConfirmed?.()
      }},
    ]);
  }

  const onPressCancel = async () => {
    Alert.alert(`Cancel this appointment`, "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", style: "default", onPress: async () => {
        if (onCancel) {
          onCancel?.(id)
        } else {
          await cancelAppointment(id)
        }
      }},
    ]);
  }

  const onComplete = async () => {
    Alert.alert(`Complete this appointment`, "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", style: "default", onPress: async () => {
        await completeAppointment(id)
        onCompleted?.()
      }},
    ]);
  }

  const goToRating = async () => {
    const queryStringify = JSON.stringify(data)

    router.push({
      pathname: '/rating',
      params: {
        query: queryStringify
      }
    })
  }

  const onAssignStaff = async () => {
    await fetchAvailableStaffByAppointment(id)
    setShowModal(true)
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.itemContainer}
        disabled={disabled}
        onPress={() => onPress?.(id)}
      >
        <View style={styles.item}>
          <View style={styles.row}>
            <InfoItem icon="check-circle" label="Booking ID" value={`#${id}`} />
            <InfoItem icon="calendar-check-outline" label="Booked On" value={moment(appointmentTime).format('DD-MM-YYYY | HH:mm')} />
          </View>

          <View style={styles.row}>

            <InfoItem
              icon="spa"
              label="Service"
              value={service?.name || '--'}
            />
            {
              (isAdminRole || isStaffRole) && (
                <InfoItem
                  icon="account"
                  label="Customer"
                  value={user?.name || '--'}
                />
              )
            }
          </View>

          <View style={styles.row}>
            <InfoItem icon="account-heart-outline" label="Practitioner" value={staff?.name} />
            <InfoItem
              icon="broadcast"
              label="Status"
              value={status}
              highlight
            />
          </View>

          <View style={styles.row}>
            <InfoItem
              icon="cash-check"
              label="Total Amount"
              value={finalPrice ? `${formatPrice(finalPrice)}` : '--'}
            />
            <InfoItem
              icon="ticket-percent"
              label="Coupon"
              value={voucherCode}
            />
          </View>


          {
            isPending && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8}}>
                {
                  isAdminRole && (
                    <Button compact mode="text" buttonColor={'#006EE9'} textColor={'white'} onPress={onConfirm}>
                      Confirm
                    </Button>
                  )
                }
                <Button compact mode="text" style={{}} textColor={'rgba(234, 57, 67, 1)'} onPress={onPressCancel}>
                  {isAdminRole ? 'Reject' : 'Cancel'}
                </Button>
              </View>
            )
          }

          {
            isConfirmed && (isAdminRole || isStaffRole) && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8}}>

                {
                  isAdminRole &&  <Button compact mode="text" buttonColor={'#006EE9'} textColor={'white'} onPress={onAssignStaff}>
                    {isStaffAssigned ? 'Change Practitioner' : 'Assign Practitioner'}
                  </Button>
                }

                <Button compact mode="text" buttonColor={'#006EE9'} textColor={'white'} onPress={onComplete}>
                  Complete
                </Button>
              </View>
            )
          }

          {
            isDone && !review?.id && (!isAdminRole && !isStaffRole) && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8}}>
                <Button compact mode="text" buttonColor={'#006EE9'} textColor={'white'} onPress={goToRating}>
                  Rate now
                </Button>
              </View>
            )
          }

        </View>
      </TouchableOpacity>

      <AssignStaffModal
        visible={showModal}
        staffs={availableStaffByAppointment}
        currentStaffId={staff?.id}
        onClose={() => setShowModal(false)}
        onSelect={(staffId) => {
          onSelectStaff?.(id, staffId)
          setShowModal(false);
        }}
      />
    </>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    // shadowColor: 'rgba(6, 7, 38, 0.17)',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  item: {
    backgroundColor: 'rgba(0,110,233,0.05)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#777777',
  },
  highlight: {
    color: '#006EE9',
    fontWeight: '600',
  },
});
