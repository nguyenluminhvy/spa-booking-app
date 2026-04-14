import {StyleSheet, TouchableOpacity, View} from "react-native";
import {router, useLocalSearchParams, useRouter} from "expo-router";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text} from "react-native-paper";
import {useAuth} from "@/lib/context/AuthContext";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {useEffect, useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

export default function Index() {
  const { email  } = useLocalSearchParams();
  const { navigate } = useRouter();
  const { confirmOTPResetPassword, sendOTPResetPassword: reSendOTPResetPassword } = useAuth();

  const [otpCode, setOtpCode] = useState<string>('');
  const [otpCodeErrorMessage, setOtpCodeErrorMessage] = useState('');

  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);


  const onConfirmOTP = async () => {
    const response = await confirmOTPResetPassword(email, otpCode)

    if (response.resetToken) {
      router.replace({
        pathname: '/reset-password',
        params: {
          resetToken: response.resetToken,
        }
      })
    } else if (response.message) {
      setOtpCodeErrorMessage(response.message)
    }
  }

  const onResendOTP = async () => {
    await reSendOTPResetPassword(email)

    setCountdown(30);
    setCanResend(false);
  }

  return (
    <SafeAreaView style={{ flex: 1,  }}>
      <KeyboardAwareScrollView bottomOffset={50}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
          }}
        >


          <View style={{
            marginTop: 0
          }}>

            <Image
              style={styles.image}
              source={IMAGES.bro}
              contentFit="contain"
              transition={500}
            />

            <View>
              <View>
                <Text
                  variant="labelSmall"
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    paddingHorizontal: 70
                  }}
                >
                  {
                    `We has send the code to ${email}`
                  }
                </Text>

                <Text
                  variant="labelSmall"
                  style={{
                    textAlign: "center",
                    marginTop: 4,
                    paddingHorizontal: 20
                  }}
                >
                  Please check email and enter your code
                </Text>
              </View>

              <AppTextInput
                maxLength={6}
                autoCapitalize="none"
                placeholder="Code"
                value={otpCode}
                onChangeText={(value) => {
                  setOtpCode(value.trim())
                  if (otpCodeErrorMessage) setOtpCodeErrorMessage('')
                }}
                isError={!!otpCodeErrorMessage}
                errorMessage={otpCodeErrorMessage}
              />

              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                marginTop: 4,
                marginBottom: 20,

              }}>
                <Text
                  variant="labelSmall"
                  style={{
                    textAlign: "center",
                  }}
                >
                  Didn't receive code?
                </Text>

                <TouchableOpacity disabled={!canResend} onPress={onResendOTP}>
                  <Text
                    variant="labelMedium"
                    style={{
                      textAlign: "center",
                      color: '#105CDB',
                      opacity: canResend ? 1 : 0.5
                    }}
                  >
                    {canResend ? `Resend` : `Resend in ${countdown}s`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              disabled={otpCode.length !== 6}
              mode="contained"
              buttonColor="#105CDB"
              style={{
                width: "100%",
                borderRadius: 8,
                marginTop: 24,
              }}
              contentStyle={{
                height: 52,
              }}
              onPress={onConfirmOTP}
            >
              Continue
            </Button>

          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
  },
});
