import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  role: 'USER' | string;
  onClose: () => void;
  onSelect: (activeType: 'edit' | 'activate' | 'deactivate') => void;
};

const EditAccountModal = ({ visible, status, role, onClose, onSelect }: Props) => {
  const isUserRole = role === 'USER';
  const isActive = status === 'ACTIVE';

  const renderMenuItem = (
    label: string,
    iconName: keyof typeof Ionicons.glyphMap,
    action: 'edit' | 'activate' | 'deactivate',
    iconColor: string = 'black'
  ) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onSelect(action)}
    >
      <Ionicons name={iconName} size={22} color={iconColor} />
      <Text style={[styles.name, { color: iconColor === 'black' ? '#333' : iconColor }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />

        <View style={styles.container}>
          <Text style={styles.title}>Actions</Text>

          {!isUserRole && renderMenuItem('Edit', 'create-outline', 'edit')}

          {isActive
            ? renderMenuItem('Deactivate', 'remove-circle-outline', 'deactivate', '#E67E22') // Màu cam cảnh báo
            : renderMenuItem('Activate', 'radio-button-on-outline', 'activate', '#2ECC71')  // Màu xanh lá kích hoạt
          }

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditAccountModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    color: '#888',
    textTransform: 'uppercase',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
  },
  cancelText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
