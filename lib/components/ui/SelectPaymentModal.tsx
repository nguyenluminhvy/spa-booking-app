import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet, Pressable,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { IMAGES } from "@/lib/assets/images";

type PaymentMethod = {
  code: string;
  label: string;
  type: 'icon' | 'image';
  icon?: string;
  image?: any;
};

type Props = {
  visible: boolean;
  paymentCode: string;
  onClose: () => void;
  onSelect: (code: string) => void;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    code: 'CASH',
    label: 'Cash',
    type: 'icon',
    icon: 'wallet',
  },
  {
    code: 'VISA',
    label: '**** **** **** 1234',
    type: 'image',
    image: IMAGES.visa,
  },
  {
    code: 'MASTER',
    label: '**** **** **** 5678',
    type: 'image',
    image: IMAGES.mastercard,
  },
];

const PaymentItem = ({ item, selected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.itemContainer,
        selected && styles.itemSelected
      ]}
      onPress={() => onPress(item.code)}
    >
      {item.type === 'icon' ? (
        <Ionicons name={item.icon} size={25} color={'#105CDB'} />
      ) : (
        <Image
          style={styles.image}
          source={item.image}
          contentFit="contain"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.label}>{item.label}</Text>

        {selected && (
          <Ionicons name="checkmark-circle" size={20} color="#006EE9" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SelectPaymentModal = ({
                              visible,
                              paymentCode = 'CASH',
                              onClose,
                              onSelect
                            }: Props) => {

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />

        <View style={styles.container}>
          <Text style={styles.title}>Payment Method</Text>

          <FlatList
            data={PAYMENT_METHODS}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <PaymentItem
                item={item}
                selected={item.code === paymentCode}
                onPress={onSelect}
              />
            )}
            showsVerticalScrollIndicator={false}
          />

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SelectPaymentModal;

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
    marginBottom: 16,
    color: '#006EE9',
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bababa',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 12,
    gap: 10,
  },

  itemSelected: {
    borderColor: '#006EE9',
    backgroundColor: '#F0F7FF',
  },

  image: {
    width: 36,
    height: '100%',
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
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
