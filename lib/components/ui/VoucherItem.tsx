import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Text} from "react-native-paper";
import moment from "moment";

type Voucher = {
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  maxDiscount?: number;
  usedCount: number;
  usageLimit?: number;
  startDate: string;
  runtimeState: string;
  isExpired: boolean;
  isUsable: boolean;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type Props = {
  item: Voucher;
  onEdit?: () => void;
  onToggle?: () => void;
};

const STATUS_COLOR = {
  ACTIVE: "#2ECC71",
  INACTIVE: "#FF3B30",
};

const InfoItem = ({
                    icon,
                    label,
                    value,
                    color,
                    style,
                  }: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value?: string;
  color?: string;
  style?: any;
}) => (
  <View style={[styles.infoItem, style]}>
    <MaterialCommunityIcons name={icon} size={20} color="#006EE9" />
    <View>
      <Text variant="labelMedium" style={styles.label}>
        {label}
      </Text>
      <Text
        variant="labelLarge"
        style={color ? { color, fontWeight: "600" } : undefined}
      >
        {value ?? "--"}
      </Text>
    </View>
  </View>
);

const formatDate = (d: string) => {
  const date = new Date(d);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const color =
    status === 'Upcoming' ? '#f1c40f' : '#e74c3c';

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
};

export const VoucherItem = ({ item, onEdit, onToggle }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.notchLeft} />
      <View style={styles.notchRight} />

      <View style={styles.content}>
        <View style={[styles.rowBetween, {padding: 16}]}>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialCommunityIcons name={'ticket-confirmation'} size={22} color={'#006EE9'}/>
            <Text style={styles.code}>{item.code}</Text>
          </View>
          {
            item?.isExpired && <StatusBadge status={'Expired'} />
          }
          {
            item?.runtimeState === 'UPCOMING' && <StatusBadge status={'Upcoming'} />
          }
        </View>

        <View style={{paddingVertical: 8, paddingLeft: 24, gap: 8}}>
          <View style={{ flexDirection: 'row'}}>
            <InfoItem
              style={{flex: 2}}
              icon="sale"
              label="Value"
              value={`${item.type === 'PERCENT'
                ? `${item.value}% OFF`
                : `${item.value.toLocaleString()}đ OFF`} ${item.maxDiscount
                ? ` (max ${item.maxDiscount.toLocaleString()}đ)`
                : ''}`}
            />

            <InfoItem
              style={{flex: 1}}
              icon="progress-check"
              label="Used"
              value={`${item.usedCount} / ${item.usageLimit || '∞'}`}
            />
          </View>


          <View style={{ flexDirection: 'row'}}>
            <InfoItem
              style={{flex: 2}}
              icon="calendar-range-outline"
              label="Period"
              // value={`${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}
              value={`${moment(item.startDate).format('DD/MM')} - ${moment(item.endDate).format('DD/MM')}`}
            />

            <InfoItem
              icon="broadcast"
              label="Status"
              value={item?.status}
              color={STATUS_COLOR[item?.status]}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btn} onPress={onEdit}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnOutline} onPress={onToggle}>
            <Text style={styles.btnOutlineText}>
              {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: '#006EE9',

    backgroundColor: 'rgba(0,110,233,0.05)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
  },

  content: {
    // padding: 16,
    gap: 8
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: '#006EE9',
  },

  code: {
    color: '#006EE9',
    fontSize: 18,
    fontWeight: 'bold',
  },

  discount: {
    fontSize: 15,
    color: '#333',
  },

  meta: {
    // fontSize: 12,
    color: '#888',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingRight: 16,
    paddingBottom: 16
  },

  btn: {
    backgroundColor: '#006EE9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
  },

  btnText: {
    color: '#fff',
    fontSize: 12,
  },

  btnOutline: {
    borderWidth: 1,
    borderColor: '#006EE9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
  },

  btnOutlineText: {
    color: '#006EE9',
    fontSize: 12,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
  },

  notchLeft: {
    position: 'absolute',
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: '#006EE9',
    left: -12,
    top: '40%',
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
  },

  notchRight: {
    position: 'absolute',
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: '#006EE9',
    right: -12,
    top: '40%',
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },

  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: "#777",
  },
});
