import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet, Pressable,
} from 'react-native';
import {Ionicons} from "@expo/vector-icons";

type Props = {
  visible: boolean;
  currentStaffId: any;
  staffs: any[];
  onClose: () => void;
  onSelect: (staffId: number) => void;
};

const AssignStaffModal = ({ visible, currentStaffId, staffs, onClose, onSelect }: Props) => {

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />

        <View style={styles.container}>
          <Text style={styles.title}>Assign Practitioner</Text>

          <FlatList
            data={staffs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = currentStaffId === item.id
              const isDisabled= !item?.isAvailable && !isSelected


              return (
                <TouchableOpacity
                  disabled={isDisabled}
                  style={[styles.item, {
                    opacity: isDisabled ? 0.5 : 1
                  }]}
                  onPress={() => onSelect(item.id)}
                >
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                  </View>

                  {
                    isSelected ? <Ionicons name={'checkmark-circle'} size={20} color={'#006EE9'} /> : (
                      <Text style={{ color: 'red'}}>
                        {isDisabled ? 'Busy' : ''}
                      </Text>
                    )
                  }
                </TouchableOpacity>
              )
            }}
          />

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AssignStaffModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#006EE9'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  name: {
    fontSize: 16,
  },
  email: {
    fontSize: 12,
    color: '#888',
  },
  cancel: {
    textAlign: 'center',
    marginTop: 12,
    color: 'red',
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
