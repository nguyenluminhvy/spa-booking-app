import { Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";
import { TextInput, Text, Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdmin } from "@/lib/context/AdminContext";
import { useAuth } from "@/lib/context/AuthContext";
import { validateEmail } from "@/lib/utils/validators";
import { isIos } from "@/lib/utils/helper";
import { View } from "@/components/Themed";

const FormInput = ({ label, error, ...props }: any) => (
  <View style={{ gap: 6 }}>
    <Text style={{ color: "#006EE9", fontWeight: "bold" }}>{label}</Text>

    <TextInput
      mode="outlined"
      {...props}
      outlineColor={error ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
      activeOutlineColor={error ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
      placeholderTextColor={"rgba(0,0,0,0.35)"}
      style={{
        backgroundColor: "white",
        fontSize: 14,
      }}
      outlineStyle={{ borderRadius: 12, borderWidth: 0.5 }}
    />

    {!!error && <Text
      variant={'labelSmall'}
      style={{ marginLeft: 0, color: 'rgba(234, 57, 67, 1)'}}
    >
      {error}
    </Text>}
  </View>
);

export default function CreateUpdateStaffScreen() {
  const { staffId } = useLocalSearchParams();
  const isEditMode = staffId !== "new";

  const { setLoading } = useAuth();
  const { createStaff, getStaffInfo, updateStaff, resetPasswordStaff } = useAdmin();

  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!isEditMode) return;

    (async () => {
      const data = await getStaffInfo(staffId);
      if (data) {
        setForm((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
        }));
      }
    })();
  }, [staffId]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev: any) => ({ ...prev, [key]: "", general: "" }));
  };

  const validate = () => {
    const e: any = {};

    if (!form.name || form.name.length < 3) {
      e.name = "Name must be at least 3 characters";
    }

    const emailMsg = validateEmail(form.email);
    if (emailMsg) e.email = emailMsg;

    if (!isEditMode) {
      if (!form.password || !form.confirmPassword) {
        e.password = "Password required";
      } else if (form.password.length < 8) {
        e.password = "Min 8 characters";
      } else if (form.password !== form.confirmPassword) {
        e.password = "Passwords do not match";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      if (isEditMode) {
        const res = await updateStaff(staffId, {
          name: form.name,
          email: form.email,
        });

        if (res?.id) {
          Alert.alert("Update Successfully!")
        } else if (res?.message) {
          Alert.alert("Notice", res.message);
        };

      } else {
        const res = await createStaff({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        if (res?.id) {
          router.push('/(admin)/create-staff-success-modal');
        } else if (res?.message) {
          Alert.alert("Notice", res.message);
        }

      }
    } catch (err: any) {
      setErrors((prev: any) => ({
        ...prev,
        general: err?.message || "Something went wrong",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    Alert.alert("Reset password", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          try {
            setLoading(true);
            const res = await resetPasswordStaff(staffId);
            if (res?.message) Alert.alert(res.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <>
      <KeyboardAwareScrollView>
        <Stack.Screen
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            title: isEditMode ? "Edit Staff" : "Create Staff",
            contentStyle: {
              backgroundColor: 'white'
            }
          }}
        />

        <View style={{ padding: 16, gap: 16 }}>
          <FormInput
            label="Name"
            placeholder="Staff Name"
            value={form.name}
            onChangeText={(v: string) => handleChange("name", v)}
            error={errors.name}
          />

          <FormInput
            label="Email"
            placeholder="Staff Email"
            value={form.email}
            onChangeText={(v: string) => handleChange("email", v)}
            autoCapitalize="none"
            error={errors.email}
          />

          {!isEditMode && (
            <>
              <FormInput
                label="Password"
                placeholder="Password"
                secureTextEntry
                value={form.password}
                onChangeText={(v: string) => handleChange("password", v)}
                error={errors.password}
              />

              <FormInput
                label="Confirm Password"
                placeholder="Password"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(v: string) =>
                  handleChange("confirmPassword", v)
                }
                error={errors.password}
              />
            </>
          )}

          {errors.general && (
            <Text style={{ color: "red" }}>{errors.general}</Text>
          )}

          {isEditMode && (
            <Button
              mode="outlined"
              textColor="#105CDB"
              style={{
                width: "100%",
                borderRadius: 8,
                marginTop: 8,
                borderColor: '#105CDB'
              }}
              contentStyle={{
                height: 52,
              }}
              onPress={handleResetPassword}
            >
              {"Reset Password"}
            </Button>
          )}

          <Button
            mode="contained"
            buttonColor="#105CDB"
            style={{
              width: "100%",
              borderRadius: 8,
              marginBottom: isIos ? 0 : 16,
            }}
            contentStyle={{
              height: 52,
            }}
            onPress={handleSubmit}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </View>
      </KeyboardAwareScrollView>

      <KeyboardToolbar />
    </>
  );
}
