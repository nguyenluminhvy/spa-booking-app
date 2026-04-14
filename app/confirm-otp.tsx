import {StyleSheet, TouchableOpacity, View} from "react-native";
import {router, useLocalSearchParams, useRouter} from "expo-router";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text} from "react-native-paper";
import {useAuth} from "@/lib/context/AuthContext";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

export default function Index() {
  const { email, code } = useLocalSearchParams();
  const { navigate } = useRouter();
  const { confirmOTPResetPassword, sendOTPResetPassword: reSendOTPResetPassword } = useAuth();

  const [otpCode, setOtpCode] = useState<string>('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const isNotVerify = code === '-1'
  const isForgotPassword = code === '-2'

  const onConfirmOTP = async () => {
    const response = await confirmOTPResetPassword(email, otpCode)

    if (response.resetToken) {
      router.replace({
        pathname: '/reset-password',
        params: {
          resetToken: response.resetToken,
        }
      })
    }
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

              {
                isForgotPassword ? (
                  <View>
                    <Text
                      variant="labelSmall"
                      style={{
                        textAlign: "center",
                        marginTop: 20,
                        paddingHorizontal: 70
                      }}
                    >
                      {`We has send the code to ${email}`}
                    </Text>
                    <Text
                      variant="labelSmall"
                      style={{
                        textAlign: "center",
                        marginTop: 4,
                        paddingHorizontal: 40
                      }}
                    >
                      Please follow email instructions to reset your password
                    </Text>
                  </View>
                ) : (
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
                        isNotVerify ? 'Your account is not verified' : `We has send the verification email to ${email}`
                      }
                    </Text>

                    <Text
                      variant="labelSmall"
                      style={{
                        textAlign: "center",
                        marginTop: 4,
                        paddingHorizontal: 70
                      }}
                    >
                      Please check email and enter your code
                    </Text>
                  </View>
                )
              }

              <AppTextInput
                autoCapitalize="none"
                placeholder="Code"
                value={otpCode}
                onChangeText={(value) => {
                  setOtpCode(value.trim())
                }}
                isError={!!emailErrorMessage}
                errorMessage={emailErrorMessage}
              />

              {
                !isForgotPassword && (
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
                    <TouchableOpacity onPress={() => reSendOTPResetPassword(email)}>
                      <Text
                        variant="labelMedium"
                        style={{
                          textAlign: "center",
                          color: '#105CDB',
                        }}
                      >
                        Resend
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
              }
            </View>

            <Button
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
