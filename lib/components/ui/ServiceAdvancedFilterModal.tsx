import {Keyboard, TouchableOpacity, View} from "react-native";
import {Text, Button, Modal, Portal, Icon, MD3Colors} from "react-native-paper";
import React, {useEffect, useState} from "react";
import moment from "moment";
import PriceSlider from "@/lib/components/ui/PriceSlider";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import RatingSlider from "@/lib/components/ui/RatingSlider";


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

export const SORT_BUTTONS = [
  {
    label: "Highest rated",
    type: 'rating',
  },
  {
    label: "Most reviewed",
    type: 'review',
  },
  {
    label: "Price low",
    type: 'priceLow',
  },
  {
    label: "Price high",
    type: 'priceHigh',
  },
];

export const getSortLabel = (value: string) => {
  if (value === 'rating') {
    return 'Highest rated'
  }
  if (value === 'review') {
    return 'Most reviewed'
  }
  if (value === 'priceLow') {
    return 'Price low'
  }
  if (value === 'priceHigh') {
    return 'Price high'
  }
}

export type ServiceAdvancedFilterValue = {
  status: string | undefined;
  sort: string | undefined;
  order: string | undefined;
  maxRating: number | undefined;
  maxPrice: number | undefined;
};

interface AdvancedFilterModalProps {
  value: ServiceAdvancedFilterValue;
  onChange: (data: ServiceAdvancedFilterValue) => void;
}

const defaultRange = {
  start: moment().startOf('month').toDate(),
  end: moment().endOf('month').toDate(),
}

export function ServiceAdvancedFilterModal({ onChange, value }: AdvancedFilterModalProps) {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState<ServiceAdvancedFilterValue>({
    maxPrice: 1000000,
    maxRating: 5,
    sort: undefined,
    order: undefined,
    status: undefined,
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
    const data = {
      ...filters,
      maxPrice: filters?.maxPrice || 1000000,
      maxRating: filters?.maxRating || 5}
    ;

    onChange?.(data);
    hideModal()
  }

  const onCancelFilter = () => {
    hideModal()
    setTimeout(() => {
      setFilters(value)
    }, 200)
  }


  return (
    <View>
      <TouchableOpacity style={{paddingRight: 12}} onPress={showModal}>
        <Icon source="filter-outline" color={'#006EE9'} size={24} />
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
              marginTop: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
                Price
              </Text>

              <MaterialCommunityIcons
                name={"tune-variant"}
                size={20}
                color={"#006EE9"}
              />
            </View>

            <PriceSlider value={filters?.maxPrice} onChange={(value: number) => setFilters(prevState => ({...prevState, maxPrice: value}))} />
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
               Rating
              </Text>

              <MaterialCommunityIcons
                name={"tune-vertical-variant"}
                size={20}
                color={"#006EE9"}
              />
            </View>

            <RatingSlider value={filters?.maxRating} onChange={(value: number) => setFilters(prevState => ({...prevState, maxRating: value}))} />
          </View>


          <View
            style={{
              gap: 8,
              opacity: isSwitchOn ? 0.3 : 1
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
                Sort
              </Text>

              <MaterialCommunityIcons
                name={"sort"}
                size={20}
                color={"#006EE9"}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {SORT_BUTTONS.map((button, index) => {
                const isActive = button.type === filters.sort;
                const isPriceHigh = button.type?.indexOf('High') >= 0

                return (
                  <TouchableOpacity
                    disabled={isSwitchOn}
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 50,
                      backgroundColor: isActive ? "#006EE9" : "#F4F9FF"
                    }}
                    onPress={() => {
                      setFilters(prev => ({ ...prev, sort: isActive ? undefined : button.type }));
                    }}
                  >
                    <Text variant={"labelLarge"} style={{
                      color: isActive ? "white" : "black"
                    }}>
                      {button.label}
                    </Text>
                    {
                      button.type?.indexOf('price') >= 0 && <MaterialCommunityIcons
                        name={isPriceHigh ? "sort-ascending" : "sort-descending"}
                        size={20}
                        color={isActive ? "white" : "black"}
                      />
                    }

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
