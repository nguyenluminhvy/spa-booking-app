import React, {useCallback, useState} from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import {Button, Text} from "react-native-paper";
import {router, useRouter} from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import {useAdmin} from "@/lib/context/AdminContext";
import AssignStaffModal from "@/lib/components/ui/AssignStaffModal";

type Role = "USER" | "STAFF";
type Status = "ACTIVE" | "INACTIVE";

type Props = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
};

const ROLE_COLOR = {
  USER: "#006EE9",
  STAFF: "#2ECC71",
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

export function AccountItem({
                              id,
                              name,
                              email,
                              role,
                              status,
                              createdAt,
                            }: Props) {
  const { push } = useRouter();
  const { deactivateUser, activateUser, users } = useAdmin();

  const isActive = status === 'ACTIVE'
  const isStaff = role === 'STAFF'

  const onEdit = useCallback(() => {
    if (isStaff) {
      push({
        pathname: '/create-edit-staff',
        params: { staffId: id },
      });
    }
  }, [id, push]);

  const onActivate = () => {
    Alert.alert(`Activate user ${name}`, "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", style: "default", onPress: () => activateUser(id) },
    ]);
  };

  const onDeactivate = () => {
    Alert.alert(`Deactivate user ${name}`, "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Deactivate", style: "destructive", onPress: () => deactivateUser(id) },
    ]);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.itemContainer}
      onPress={onEdit}
    >
      <View style={styles.item}>
        <View style={[styles.row, {flex: 2}]}>
          <InfoItem style={{flex: 2}} icon="account" label="Name" value={name} />

          <InfoItem
            style={{flex: 1}}
            icon="check-decagram"
            label="Type"
            value={role}
            color={ROLE_COLOR[role]}
          />
        </View>

        <View style={[styles.row, {flex: 1}]}>
          <InfoItem style={{flex: 2}} icon="email" label="Email" value={email} />

          <InfoItem
            icon="broadcast"
            label="Status"
            value={status}
            color={STATUS_COLOR[status]}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8}}>
          {
            isActive ?
              <Button compact mode="text" style={{}} textColor={'rgba(234, 57, 67, 1)'} onPress={onDeactivate}>
                Deactivate
              </Button>
              :
              <Button compact mode="text" buttonColor={'#006EE9'} textColor={'white'} onPress={onActivate}>
                Activate
              </Button>
          }
        </View>

      </View>
    </TouchableOpacity>
  );
}

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
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
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
