import {View} from "react-native";
import React, {useEffect, useState} from "react";
import {router, useRouter} from "expo-router";
import {Button, Text} from "react-native-paper";
// import {useAuth} from "@/lib/context/AuthContext";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {useAuth} from "@/lib/context/AuthContext";
// import {userProfile} from "@/lib/services/userService";

export default function Index() {
  const { push } = useRouter();
  const { updateProfile, user, setLoading } = useAuth()

  const [fullName, setFullName] = useState('');
  const [fullNameErrorMessage, setFullNameErrorMessage] = useState('');

  const [phone, setPhone] = useState('');
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const initValue = async () => {
    setLoading(true)

    if (user) {
      setFullName(user?.name)
      setPhone(user?.phone)
    }

    setLoading(false)
  }

  useEffect(() => {
    initValue()
  }, []);

  const isValidFullName = async (): Promise<boolean> => {
    let message = ''

    if (!fullName) {
      message = "Full name is required.";
    }

    if (message) {
      setFullNameErrorMessage(message);
    } else {
      setFullNameErrorMessage('');
    }

    return !message
  }

  const isValidPhone = async (): Promise<boolean> => {
    let message = ''

    if (!phone) {
      message = "Phone is required.";
    }

    if (message) {
      setPhoneErrorMessage(message);
    } else {
      setPhoneErrorMessage('');
    }

    return !message
  }

  const onUpdate = async () => {
    const isValid = await isValidFullName() && await isValidPhone()
    if (!isValid) return

    try {
      const response = await updateProfile(fullName, phone)

      alert(response?.message)

    } catch (e) {
      setErrorMessage(errorMessage)
    }
  }

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <KeyboardAwareScrollView bottomOffset={100}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              alignItems: "center",
              gap: 16,
            }}
          >
            <View style={{
              alignItems: "center",
            }}>
              <Text variant="displayMedium" style={{
                fontWeight: 'bold',
                color: '#105CDB'
              }}>Spa-Y</Text>
              <Text variant="headlineSmall" style={{
                fontWeight: 'semibold',
                color: '#9A9A9A'
              }}>Edit Profile</Text>

            </View>

          </View>

          <View style={{
            paddingTop: 40
          }}>
            <AppTextInput
              placeholder="Full Name"
              value={fullName}
              onChangeText={(value) => {
                setFullName(value)
                if (fullNameErrorMessage) setFullNameErrorMessage('')
              }}
              isError={!!fullNameErrorMessage}
              errorMessage={fullNameErrorMessage}
            />

            <AppTextInput
              autoCapitalize="none"
              keyboardType={"numeric"}
              placeholder="Phone"
              value={phone}
              onChangeText={(value) => {
                setPhone(value.trim())
                if (phoneErrorMessage) setPhoneErrorMessage('')
              }}
              isError={!!phoneErrorMessage}
              errorMessage={phoneErrorMessage}
            />

            {
              errorMessage && (
                <Text
                  variant={'labelSmall'}
                  style={{ marginTop: 8, marginLeft: 0, color: 'rgba(234, 57, 67, 1)'}}
                >
                  {errorMessage}
                </Text>
              )
            }

            <Button
              mode="contained"
              buttonColor="#105CDB"
              style={{
                width: "100%",
                borderRadius: 8,
                marginTop: 16,
              }}
              contentStyle={{
                height: 52,
              }}
              onPress={onUpdate}
            >
              Update
            </Button>

          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

