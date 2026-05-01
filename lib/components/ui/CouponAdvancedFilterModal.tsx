import {Keyboard, TouchableOpacity, View} from "react-native";
import {Text, Button, Modal, Portal, Icon, MD3Colors} from "react-native-paper";
import React, {useEffect, useState} from "react";
import moment from "moment";

export const STATUS_BUTTONS = [
  {
    label: "All",
    type: 'ALL',
  },
  {
    label: "Active",
    type: 'ACTIVE',
  },
  {
    label: "Inactive",
    type: 'INACTIVE',
  },
];

export const STATE_BUTTONS = [
  {
    label: "All",
    type: 'ALL',
  },
  {
    label: "Running",
    type: 'RUNNING',
  },
  {
    label: "Upcoming",
    type: 'UPCOMING',
  },
  {
    label: "Expired",
    type: 'EXPIRED',
  },
];

export const SORT_BUTTONS = [
  {
    label: "Newest",
    type: 'desc',
  },
  {
    label: "Oldest",
    type: 'asc',
  },
];


export type CouponAdvancedFilterValue = {
  status?: any;
  state?: any;
  orderBy?: any;
};

interface AdvancedFilterModalProps {
  value: CouponAdvancedFilterValue;
  onChange: (data: CouponAdvancedFilterValue) => void;
}

export function CouponAdvancedFilterModal({ onChange, value }: AdvancedFilterModalProps) {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState<CouponAdvancedFilterValue>({
    status: undefined,
    state: undefined,
    orderBy: 'desc',
  });
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    setFilters(value)
  }, [value]);

  const showModal = () => {
    setVisible(true)
    Keyboard.dismiss()
  };
  const hideModal = () => setVisible(false);

  const onApplyFilter = () => {
    const data = {...filters};

    onChange?.(data);
    hideModal()
  }

  const onCancelFilter = () => {
    hideModal()
    setTimeout(() => {
      setFilters(value)
    }, 200)
  }

  const hasFilter = !!filters.status || !!filters.state || isSwitchOn;

  return (
    <View>
      <TouchableOpacity style={{paddingRight: 12}} onPress={showModal}>
        <Icon source="filter-outline" color={hasFilter ? '#006EE9' : MD3Colors.neutralVariant60} size={24} />
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={visible} onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            marginHorizontal: 16,
            borderRadius: 8,
            gap: 16
          }}>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
            <Text variant={'titleLarge'} style={{ color: "#006EE9", fontWeight: "bold" }}>
              Advanced Filter
            </Text>
            <Icon source="filter-outline" color={'#006EE9'} size={28} />
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Status
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              {STATUS_BUTTONS.map((button, index) => {
                const isActive = button.type === filters.status;

                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 50,
                      backgroundColor: isActive ? "#006EE9" : "#F4F9FF"
                    }}
                    onPress={() => {
                      setFilters(prev => ({ ...prev, status: isActive ? undefined : button.type }));
                    }}
                  >
                    <Text variant={"labelLarge"} style={{
                      color: isActive ? "white" : "black"
                    }}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              State
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {STATE_BUTTONS.map((button, index) => {
                const isActive = button.type === filters.state;

                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 50,
                      backgroundColor: isActive ? "#006EE9" : "#F4F9FF"
                    }}
                    onPress={() => {
                      setFilters(prev => ({ ...prev, state: isActive ? undefined : button.type }));
                    }}
                  >
                    <Text variant={"labelLarge"} style={{
                      color: isActive ? "white" : "black"
                    }}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Sort
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              {SORT_BUTTONS.map((button, index) => {
                const isActive = button.type === filters.orderBy;

                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 50,
                      backgroundColor: isActive ? "#006EE9" : "#F4F9FF"
                    }}
                    onPress={() => {
                      setFilters(prev => ({ ...prev, orderBy: isActive ? undefined : button.type }));
                    }}
                  >
                    <Text variant={"labelLarge"} style={{
                      color: isActive ? "white" : "black"
                    }}>
                      {button.label}
                    </Text>
                    <Icon source={"arrow-down-thin"} color={isActive ? "white" : "black"} size={24} />

                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            gap: 16,
            marginTop: 16
          }}>

            <Button
              mode="contained"
              buttonColor={"#F4F9FF"}
              textColor={"grey"}
              style={{
                flex: 1,
                borderRadius: 12,
              }}
              onPress={onCancelFilter}
            >
              {"Cancel"}
            </Button>

            <Button
              mode="contained"
              buttonColor={"#F4F9FF"}
              textColor={"#006EE9"}
              contentStyle={{}}
              style={{
                flex: 1,
                borderRadius: 12,
              }}
              onPress={onApplyFilter}
            >
              {"Apply"}
            </Button>
          </View>

        </Modal>
      </Portal>
    </View>
  );
}
