import {Alert, View} from "react-native";
import React, {useState} from "react";
import {router, useLocalSearchParams, useRouter} from "expo-router";
import {Button, Text} from "react-native-paper";
import {useAuth} from "@/lib/context/AuthContext";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

export default function Index() {
  const { push } = useRouter();
  const { resetToken } = useLocalSearchParams();

  const { resetPassword } = useAuth()

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidatePassword = async (
    password: string,
    passwordConfirm: string
  ): Promise<boolean> => {
    let message = ''

    if (password !== passwordConfirm) {
      message = "Passwords do not match.";
    }

    if (password.length < 8) {
      message = "Password must be at least 8 characters long.";
    }

    if (!password || !passwordConfirm) {
      message = "Password and confirm password are required.";
    }

    if (message) {
      setPasswordErrorMessage(message);
    } else {
      setPasswordErrorMessage('');
    }

    return !message;
  };

  const onUpdate = async () => {
    const isValid = await isValidatePassword(password, confirmPassword)

    if (!isValid) return

    try {
      const response = await resetPassword(resetToken, password)


      if (response.code === 0) {
        Alert.alert(`${response?.message}`, "", [
          { text: "OK", style: "cancel", onPress: () => {
            router.replace("/login")
          } },
        ]);
      } else {
        Alert.alert(`${response?.message}`, "", [
          { text: "Close", style: "cancel" },
        ]);
      }


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
              }}>Reset Password</Text>

            </View>

          </View>

          <View style={{
            paddingTop: 40
          }}>
            <AppTextInput
              autoCapitalize="none"
              placeholder="New Password"
              value={password}
              secureTextEntry
              onChangeText={(value) => {
                setPassword(value.trim())
                if (passwordErrorMessage) setPasswordErrorMessage('')
                if (errorMessage) setErrorMessage('')
              }}
              isError={!!passwordErrorMessage}
            />
            <AppTextInput
              autoCapitalize="none"
              placeholder="Confirm New Password"
              value={confirmPassword}
              secureTextEntry
              onChangeText={(value) => {
                setConfirmPassword(value.trim())
                if (passwordErrorMessage) setPasswordErrorMessage('')
                if (errorMessage) setErrorMessage('')
              }}
              isError={!!passwordErrorMessage}
              errorMessage={passwordErrorMessage}
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

