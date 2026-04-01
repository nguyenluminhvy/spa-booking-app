import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
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
        <View style={styles.container}>
          <Text style={styles.title}>Assign Practitioner</Text>

          <FlatList
            data={staffs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = currentStaffId === item.id


              return (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => onSelect(item.id)}
                >
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                  </View>


                  {
                    isSelected && <Ionicons name={'checkmark-circle'} size={20} color={'#006EE9'} />
                  }


                </TouchableOpacity>
              )
            }}
          />

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
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
});
