import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import moment from 'moment';

type Appointment = {
  id: string;
  staff?: string;
  appointmentTime?: string;
  service?: any;
  status?: string;
  price?: number;
};

type Props = {
  data: Appointment;
  disabled?: boolean;
  onPress?: (id: string) => void;
};

const InfoItem = ({
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

const AppointmentCard = ({ data, disabled, onPress }: Props) => {
  const { id, appointmentTime, staff, status, price, service } = data;

  return (
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
          <InfoItem icon="account-heart-outline" label="Practitioner" value={staff} />
          <InfoItem
            icon="broadcast"
            label="Status"
            value={status}
            highlight
          />
        </View>

        <InfoItem
          icon="cash-check"
          label="Total Amount"
          value={service?.price ? `${service?.price.toLocaleString()}₫` : '--'}
        />
      </View>
    </TouchableOpacity>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: 'rgba(6, 7, 38, 0.17)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
