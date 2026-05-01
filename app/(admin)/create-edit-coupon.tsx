import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from '@/components/Themed';
import {router, Stack, useLocalSearchParams} from "expo-router";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";
import { TextInput, Text, Button } from "react-native-paper";
import React, {useEffect, useState} from "react";
import { isIos } from "@/lib/utils/helper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {PickDateButton} from "@/lib/components/ui/PickDateButton";
import {_getCouponDetail} from "@/lib/services/api/coupon";
import {useAuth} from "@/lib/context/AuthContext";
import {useSpa} from "@/lib/context/SpaContext";

export default function CreateUpdateVoucherScreen() {
  const { voucherId } = useLocalSearchParams();
  const isEditMode = voucherId !== "new";

  const { createCoupon, updateCoupon } = useSpa()

  const { setLoading } = useAuth()
  const insets = useSafeAreaInsets();
  const bottom = isIos ? insets.bottom : 20;

  const [voucher, setVoucher] = useState<any>({
    code: '',
    type: 'PERCENT',
    value: '',
    maxDiscount: '',
    usageLimit: '',
    startDate: new Date(),
    endDate: new Date(),
  });

  console.log(voucher, 'voucher')

  const [checked, setChecked] = useState(true);

  const [error, setError] = useState<any>({
    code: '',
    value: '',
  });

  useEffect(() => {
    (async () => {
      if (isEditMode) {
        const data = await _getCouponDetail(voucherId);

        if (data) {
          setVoucher({
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
          });
          setChecked(data?.status === 'ACTIVE')
        }
      }
    })();
  }, [voucherId]);

  const handleChange = (field: string, value: any) => {
    setVoucher(prev => ({ ...prev, [field]: value }));

    if (error[field]) {
      setError(prev => ({ ...prev, [field]: '' }));
    }
  };

  const checkError = () => {
    const err: any = {};

    if (!voucher.code) {
      err.code = 'Code is required';
    }

    const value = Number(voucher.value);
    if (!voucher.value) {
      err.value = 'Value is required';
    } else if (isNaN(value)) {
      err.value = 'Must be a number';
    } else if (voucher.type === 'PERCENT' && value > 100) {
      err.value = 'Cannot exceed 100%';
    }

    setError(err);
    return Object.keys(err).length === 0;
  };

  const onSubmit = async () => {
    if (!checkError()) return;

    try {
      setLoading(true)

      const payload = {
        ...voucher,
        value: Number(voucher.value),
        maxDiscount: voucher.maxDiscount ? Number(voucher.maxDiscount) : null,
        usageLimit: voucher.usageLimit ? Number(voucher.usageLimit) : null,
        status: checked ? 'ACTIVE' : 'INACTIVE',
      };

      const response = isEditMode
        ? await updateCoupon(voucherId, payload)
        : await createCoupon(payload);

      if (response?.id) {
        router.push({
          pathname: '/(admin)/create-update-coupon-success-modal',
          params: {
            voucherId
          }
        });
      } else if (response?.message) {
        Alert.alert("Notice", response.message);
      }
    } catch (e) {

    } finally {
      setLoading(false)
    }

  };

  return (
    <>
      <KeyboardAwareScrollView bottomOffset={100}>
        <Stack.Screen
          options={{
            title: isEditMode ? "Edit Coupon" : "Create Coupon",
            headerTitleAlign: "center",
            contentStyle: {
              backgroundColor: 'white'
            }
          }}
        />

        <View style={{ padding: 16, gap: 20, paddingBottom: bottom }}>

          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Code *</Text>
            <TextInput
              autoCapitalize={'characters'}
              mode={"outlined"}
              value={voucher.code}
              onChangeText={(text) => handleChange('code', text)}
              outlineColor={!!error.code ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              activeOutlineColor={!!error.code ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              style={{ backgroundColor: "white", fontSize: 14 }}
              outlineStyle={{ borderWidth: 0.5, borderRadius: 12 }}
              placeholder={'Coupon Code'}
              placeholderTextColor={"rgba(0,0,0,0.35)"}
            />
            {!!error.code && <Text style={styles.error}>{error.code}</Text>}
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button
              buttonColor={voucher.type === 'PERCENT' ? '#105CDB' : '#fff'}
              style={{
                borderColor: voucher.type === 'PERCENT' ? '#fff' : '#105CDB'
              }}
              labelStyle={{
                color: voucher.type === 'PERCENT' ? '#fff' : '#105CDB'
              }}
              mode={voucher.type === 'PERCENT' ? 'contained' : 'outlined'}
              onPress={() => handleChange('type', 'PERCENT')}
            >
              %
            </Button>

            <Button
              buttonColor={voucher.type === 'FIXED' ? '#105CDB' : '#fff'}
              style={{
                borderColor: voucher.type === 'FIXED' ? '#fff' : '#105CDB'
              }}
              labelStyle={{
                color: voucher.type === 'FIXED' ? '#fff' : '#105CDB'
              }}
              mode={voucher.type === 'FIXED' ? 'contained' : 'outlined'}
              onPress={() => handleChange('type', 'FIXED')}
            >
              VND
            </Button>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Value *</Text>
            <TextInput
              mode={"outlined"}
              keyboardType="numeric"
              value={voucher.value.toString()}
              onChangeText={(text) => handleChange('value', text)}
              outlineColor={!!error.value ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              activeOutlineColor={!!error.value ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              style={{ backgroundColor: "white", fontSize: 14 }}
              outlineStyle={{ borderWidth: 0.5, borderRadius: 12 }}
              placeholder={'Value'}
              placeholderTextColor={"rgba(0,0,0,0.35)"}
            />

            {!!error.value && <Text style={styles.error}>{error.value}</Text>}
          </View>

          {voucher.type === 'PERCENT' && (
            <View style={{ gap: 8 }}>
              <Text style={styles.label}>Max Discount</Text>
              <TextInput
                mode={"outlined"}
                keyboardType="numeric"
                value={voucher.maxDiscount?.toString()}
                onChangeText={(text) => handleChange('maxDiscount', text)}
                outlineColor={!!error.maxDiscount ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
                activeOutlineColor={!!error.maxDiscount ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
                style={{ backgroundColor: "white", fontSize: 14 }}
                outlineStyle={{ borderWidth: 0.5, borderRadius: 12 }}
                placeholderTextColor={"rgba(0,0,0,0.35)"}
              />
            </View>
          )}

          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Usage Limit</Text>
            <TextInput
              mode={"outlined"}
              keyboardType="numeric"
              value={voucher.usageLimit?.toString()}
              onChangeText={(text) => handleChange('usageLimit', text)}
              outlineColor={!!error.usageLimit ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              activeOutlineColor={!!error.usageLimit ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              style={{ backgroundColor: "white", fontSize: 14 }}
              outlineStyle={{ borderWidth: 0.5, borderRadius: 12 }}
              placeholderTextColor={"rgba(0,0,0,0.35)"}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 16,
            }}
          >
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
                Start
              </Text>
              <PickDateButton
                check30Days={false}
                format={'DD-MMM'}
                buttonColor={"#EEF5FD"}
                textColor={"#006EE9"}
                style={{
                  borderWidth: 0.5,
                  borderRadius: 12,
                  borderColor: "rgba(0,110,233,0.4)",
                }}
                dateDefault={voucher.startDate}
                onDateChange={(date) => handleChange('startDate', date)}
              />
            </View>

            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>End</Text>

              <PickDateButton
                check30Days={false}
                format={'DD-MMM'}
                buttonColor={"#EEF5FD"}
                textColor={"#006EE9"}
                style={{
                  borderWidth: 0.5,
                  borderRadius: 12,
                  borderColor: "rgba(0,110,233,0.4)",
                }}
                dateDefault={voucher.endDate}
                onDateChange={(date) => handleChange('endDate', date)}
              />
            </View>
          </View>


          <TouchableOpacity
            onPress={() => setChecked(!checked)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: "#006EE9",
                backgroundColor: checked ? '#006EE9' : 'white',
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {
                checked && (
                  <Ionicons name="checkmark-outline" size={18} color={checked ? 'white' : '#006EE9'} />
                )
              }
            </View>

            <Text variant="labelLarge" style={{ color: '#006EE9'}}>
              Active
            </Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            buttonColor="#105CDB"
            style={{
              width: "100%",
              borderRadius: 8,
              marginBottom: isIos ? 0 : 16,
              marginTop: 8,
            }}
            contentStyle={{ height: 52 }}
            onPress={onSubmit}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>

        </View>
      </KeyboardAwareScrollView>

      <KeyboardToolbar />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#006EE9",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
});
