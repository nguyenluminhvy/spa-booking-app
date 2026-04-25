import {StyleSheet, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import {router} from "expo-router";
import {isIos} from "@/lib/utils/helper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text} from "react-native-paper";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {validateEmail} from "@/lib/utils/validators";
import {signInFn} from "@/lib/services/api/auth";
import {storeStringData} from "@/lib/utils/AsyncStorage";
import {useAuth} from "@/lib/context/AuthContext";
import {registerForPushNotificationsAsync, useNotifications} from "@/lib/context/NotificationContext";
import {Ionicons} from "@expo/vector-icons";

export default function Index() {
  const { fetchProfile, setLoading } = useAuth()
  const { saveDeviceToken } = useNotifications()

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [checked, setChecked] = useState(true);

  const isValidEmail = async (value: any): Promise<boolean> => {
    const message = validateEmail(value);

    if (message) {
      setEmailErrorMessage(message);
    } else {
      setEmailErrorMessage('');
    }

    return !message
  }

  const isValidatePassword = async (
    password: string,
  ): Promise<boolean> => {
    let message = ''

    if (!password) {
      message = "Password is required.";
    }

    if (password.length < 8) {
      message = "Password must be at least 8 characters long.";
    }

    if (message) {
      setPasswordErrorMessage(message);
    } else {
      setPasswordErrorMessage('');
    }

    return !message;
  };

  const handleLoginSuccess = async (data) => {
    console.log(data, 'data <<')
    if (data?.accessToken) {
      await storeStringData("accessToken", data?.accessToken);
      await storeStringData("user-role", data?.role);

      if (data?.role === 'ADMIN') {
        router.push('/(admin)/(tabs)/dashboard')
      }
      if (data?.role === 'USER') {
        router.push('/(user)/(tabs)/home')
      }
      if (data?.role === 'STAFF') {
        router.push('/(staff)/(tabs)/appointments')
      }

      await fetchProfile()

      registerForPushNotificationsAsync()
        .then(token => {
          if (token) {
            saveDeviceToken(token).then()
          }
        })
        .catch((error: any) => {});
    }
  }

  const onLogin = async () => {
    const isValid = await isValidEmail(email) && await isValidatePassword(password)

    if (!isValid) return

    try {
      setLoading(true)
      const response = await signInFn({
        email, password
      })


      if (response?.accessToken) {
        await handleLoginSuccess(response)
      } else if (response?.message) {
        setErrorMessage(response?.message)
      }
    } catch (e) {
      // const errorMessage = getFirebaseAdminErrorMessage(e?.code)
      // setErrorMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1,  }}>
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
              marginTop: 100,
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
              }}>Spa Booking App</Text>

            </View>

          </View>

          <View style={{
            marginTop: 40
          }}>
            <Text
              variant="titleSmall"
              style={{
                textAlign: "center",
                marginBottom: 20
              }}
            >
              Login to your account
            </Text>

            <AppTextInput
              autoCapitalize="none"
              placeholder="Email"
              value={email}
              onChangeText={(value) => {
                setEmail(value.trim())
                if (emailErrorMessage) setEmailErrorMessage('')
                if (errorMessage) setErrorMessage('')
              }}
              isError={!!emailErrorMessage}
              errorMessage={emailErrorMessage}
            />
            <AppTextInput
              autoCapitalize="none"
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={(value) => {
                setPassword(value.trim())
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


            <TouchableOpacity
              onPress={() => setChecked(!checked)}
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, marginTop: 20, paddingRight: 20 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: "#006EE9",
                  backgroundColor: checked ? '#006EE9' : 'white',
                  marginRight: 10,
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

              <Text variant="labelLarge">
                I agree to the <Text onPress={() => {
                router?.push('/term')
              }} variant="labelLarge" style={{ color: '#006EE9'}}>Terms Conditions</Text> and <Text onPress={() => {
                router?.push('/policy')
              }} variant="labelLarge" style={{ color: '#006EE9'}}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            <Button
              disabled={!checked}
              mode="contained"
              buttonColor="#105CDB"
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: isIos ? 0 : 16,
                marginTop: 8
              }}
              contentStyle={{
                height: 52,
              }}
              onPress={onLogin}
            >
              Login
            </Button>


            <TouchableOpacity
              onPress={() => {
                router.push('/forgot-password')
              }}
              style={{
                marginTop: 20,
                marginVertical: 8,
                alignSelf: 'center'
              }}>
              <Text
                style={{
                  textAlign: "right",
                  color: '#006EE9'
                }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', gap: 4, alignSelf: 'center'}}>
              <Text>
                Don’t have an account?
              </Text>
              <TouchableOpacity onPress={() => {
                router.push('/register')
              }}>
                <Text
                  style={{
                    color: '#006EE9'
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
  },
});
