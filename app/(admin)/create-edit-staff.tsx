import {Alert, StyleSheet, TouchableOpacity} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import {Stack, useLocalSearchParams} from "expo-router";
import {KeyboardAwareScrollView, KeyboardToolbar} from "react-native-keyboard-controller";
import {TextInput, Text, Button} from "react-native-paper";
import {useEffect, useMemo, useState} from "react";
import {isIos} from "@/lib/utils/helper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import {createService, getServiceDetail, updateService} from "@/lib/services/api/services";
import {useAdmin} from "@/lib/context/AdminContext";
import {useAuth} from "@/lib/context/AuthContext";

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
  });

  console.log(result)

  if (!result.canceled) {
    return result.assets[0];
  }

  return null;
};

export default function CreateUpdateStaffScreen() {
  const { staffId } = useLocalSearchParams();
  const isEditMode = staffId !== "new";

  const { setLoading } = useAuth()
  const { createStaff, getStaffInfo, updateStaff, resetPasswordStaff } = useAdmin()

  const insets = useSafeAreaInsets();
  const bottom = isIos ? insets.bottom : 20;

  const [staff, setStaff] = useState({
    name: '',
    email: '',
  });
  const [image, setImage] = useState({});

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isError = useMemo(() => {
    return !!errorMessage
  }, [errorMessage])

  useEffect(() => {
    (async () => {
      if (staffId) {
        const data = await getStaffInfo(staffId)

        if (data) {
          setStaff(data)
        } else {
          // setTask(prev => ({
          //   ...prev,
          //   category: TaskCategory.Personal,
          //   status: TaskStatus.Todo,
          //   priority: TaskPriority.Medium,
          //   reminderOffset: 10,
          // }))
        }
      }
    })();
  }, [staffId]);

  const onSelectImage = async () => {
    const source = await pickImage();

    if (source) {
      setImage(source)
    }
  }

  const onCreateStaff = async () => {
    try {
      const params = {
        name: staff.name,
        email: staff.email,
        password: password,
      }

      const result = await createStaff(params);

      // return res.data;
    } catch (e) {
    }
  };

  const onUpdateStaff = async () => {
    try {
      setLoading(true)
      const params = {
        name: staff.name,
        email: staff.email,
      }

      console.log('runn')

      const result = await updateStaff(staff.id, params);

      if (result?.id) {
        Alert.alert('Update Successfully!')
      } else if (result?.message) {
        Alert.alert(result?.message)
      }

    } catch (e) {
    } finally {
      setLoading(false)
    }
  };

  const onResetPasswordStaff = async () => {
    Alert.alert(`Reset staff password`, "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", style: "default", onPress: async () => {
        try {
          setLoading(true)
          const result = await resetPasswordStaff(staff.id);

          if (result?.message) {
            Alert.alert(result?.message)
          }

        } catch (e) {
        } finally {
          setLoading(false)
        }
      }},
    ]);
  };

  return (
    <>
      <KeyboardAwareScrollView bottomOffset={100} >
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

        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingBottom: bottom,
            padding: 16,
            gap: 20,
          }}
        >
          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>Name</Text>
            <TextInput
              mode={"outlined"}
              value={staff.name}
              onChangeText={(text) => setStaff(prev => ({ ...prev, name: text }))}
              outlineColor={isError ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              activeOutlineColor={isError ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              style={{
                backgroundColor: "white",
                fontSize: 14,
              }}
              outlineStyle={{
                borderWidth: 0.5,
                borderRadius: 12,
              }}
              placeholder={'Staff name'}
              placeholderTextColor={"rgba(0,0,0,0.35)"}
            />
            {
              isError && (
                <Text
                  variant={'labelSmall'}
                  style={{ color: 'rgba(234, 57, 67, 1)'}}
                >
                  {errorMessage}
                </Text>
              )
            }
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>Email</Text>
            <TextInput
              mode={"outlined"}
              autoCapitalize="none"
              value={staff.email}
              onChangeText={(text) => setStaff(prev => ({ ...prev, email: text }))}
              outlineColor={isError ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              activeOutlineColor={isError ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              style={{
                backgroundColor: "white",
                fontSize: 14,
              }}
              outlineStyle={{
                borderWidth: 0.5,
                borderRadius: 12,
              }}
              placeholder={'Staff email'}
              placeholderTextColor={"rgba(0,0,0,0.35)"}
            />
            {
              isError && (
                <Text
                  variant={'labelSmall'}
                  style={{ color: 'rgba(234, 57, 67, 1)'}}
                >
                  {errorMessage}
                </Text>
              )
            }
          </View>

          {
            !isEditMode && <>
              <View
                style={{
                  gap: 8,
                }}
              >
                <Text style={{ color: "#006EE9", fontWeight: "bold" }}>Password</Text>
                <TextInput
                  autoCapitalize="none"
                  mode={"outlined"}
                  secureTextEntry
                  value={password}
                  outlineColor={isError ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
                  activeOutlineColor={isError ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
                  style={{
                    backgroundColor: "white",
                    fontSize: 14,
                  }}
                  outlineStyle={{
                    borderWidth: 0.5,
                    borderRadius: 12,
                  }}
                  placeholder="Password"
                  placeholderTextColor={"rgba(0,0,0,0.35)"}
                  onChangeText={(value) => {
                    setPassword(value.trim())
                    // if (passwordErrorMessage) setPasswordErrorMessage('')
                    // if (errorMessage) setErrorMessage('')
                  }}
                  // isError={!!passwordErrorMessage}
                  // errorMessage={passwordErrorMessage}
                />
                {
                  isError && (
                    <Text
                      variant={'labelSmall'}
                      style={{ color: 'rgba(234, 57, 67, 1)'}}
                    >
                      {errorMessage}
                    </Text>
                  )
                }
              </View>

              <View
                style={{
                  gap: 8,
                }}
              >
                <Text style={{ color: "#006EE9", fontWeight: "bold" }}>Confirm Password</Text>
                <TextInput
                  autoCapitalize="none"
                  mode={"outlined"}
                  secureTextEntry
                  value={confirmPassword}
                  outlineColor={isError ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
                  activeOutlineColor={isError ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
                  style={{
                    backgroundColor: "white",
                    fontSize: 14,
                  }}
                  outlineStyle={{
                    borderWidth: 0.5,
                    borderRadius: 12,
                  }}
                  placeholder="Confirm Password"
                  placeholderTextColor={"rgba(0,0,0,0.35)"}
                  onChangeText={(value) => {
                    setConfirmPassword(value.trim())
                    if (passwordErrorMessage) setPasswordErrorMessage('')
                    if (errorMessage) setErrorMessage('')
                  }}
                />
                {
                  isError && (
                    <Text
                      variant={'labelSmall'}
                      style={{ color: 'rgba(234, 57, 67, 1)'}}
                    >
                      {errorMessage}
                    </Text>
                  )
                }
              </View>
            </>
          }

          {
            isEditMode && (
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
                onPress={onResetPasswordStaff}
              >
                {"Reset Password"}
              </Button>
            )
          }

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
            onPress={isEditMode ? onUpdateStaff : onCreateStaff}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
