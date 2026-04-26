import {Alert, StyleSheet, TouchableOpacity} from 'react-native';

import { View } from '@/components/Themed';
import {router, Stack, useLocalSearchParams} from "expo-router";
import {KeyboardAwareScrollView, KeyboardToolbar} from "react-native-keyboard-controller";
import {TextInput, Text, Button} from "react-native-paper";
import {useEffect, useMemo, useState} from "react";
import {isIos} from "@/lib/utils/helper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import {getServiceDetail} from "@/lib/services/api/services";
import {useAuth} from "@/lib/context/AuthContext";
import {useSpa} from "@/lib/context/SpaContext";

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

export default function CreateUpdateServiceScreen() {
  const { serviceId } = useLocalSearchParams();
  const isEditMode = serviceId !== "new";

  const insets = useSafeAreaInsets();
  const bottom = isIos ? insets.bottom : 20;

  const { setLoading } = useAuth()
  const { createService, updateService, fetchServices } = useSpa()

  const [service, setService] = useState({
    name: '',
    price: '',
    duration: 0,
    description: '',
  });
  const [image, setImage] = useState({});

  const [errorMessage, setErrorMessage] = useState<string>("");

  const isError = useMemo(() => {
    return !!errorMessage
  }, [errorMessage])

  useEffect(() => {
    (async () => {
      if (serviceId) {
        const data = await getServiceDetail(serviceId)

        if (data) {
          setService(data)
          setImage({
            uri: data.imageUrl,
          });
        }
      }
    })();
  }, [serviceId]);

  const onSelectImage = async () => {
    try {
      setLoading(true)
      const source = await pickImage();

      if (source) {
        setImage(source)
      }
    } catch (e) {

    } finally {
      setLoading(false)
    }
  }

  const onCreateService = async () => {
    try {
      const formData = new FormData();

      formData.append('name', service.name);
      formData.append('description', service.description);
      formData.append('price', String(service.price));
      formData.append('duration', String(service.duration));

      formData.append('file', {
        uri: image.uri,
        name: image.fileName,
        type: 'image/jpeg',
      } as any);

      setLoading(true)

      const result: any = await createService(formData);

      if (result?.id) {
        // fetchServices()
        router.push('/(admin)/create-service-success-modal')
      } else if (result?.message) {
        Alert.alert(`Notice`, result?.message, [
          { text: "OK", style: "default", onPress: async () => {
          }},
        ]);
      }
    } catch (e) {
      console.log(e, 'e')
    } finally {
      setLoading(false)
    }
  };

  const onUpdateService = async () => {
    try {
      const formData = new FormData();

      formData.append('name', service.name);
      formData.append('description', service.description);
      formData.append('price', String(service.price));
      formData.append('duration', String(service.duration));

      if (image.uri !== service.imageUrl) {
        formData.append('file', {
          uri: image.uri,
          name: image.fileName,
          type: 'image/jpeg',
        } as any);
      }

      setLoading(true)

      const result = await updateService(service.id, formData);

      if (result?.id) {
        // fetchServices()
        router.push('/(admin)/update-service-success-modal')
      } else if (result?.message) {
        Alert.alert(`Notice`, result?.message, [
          { text: "OK", style: "default", onPress: async () => {
            }},
        ]);
      }

    } catch (e) {

    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <KeyboardAwareScrollView bottomOffset={100} >
        <Stack.Screen
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            title: isEditMode ? "Edit Service" : "Create Service",
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
              value={service.name}
              onChangeText={(text) => setService(prev => ({ ...prev, name: text }))}
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
              placeholder={'Service name'}
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

          <View style={{flexDirection: 'row', gap: 16}}>
            <View
              style={{
                gap: 8,
                flex: 1
              }}
            >
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>Price</Text>
              <TextInput
                mode={"outlined"}
                value={service.price}
                onChangeText={(text) => setService(prev => ({ ...prev, price: text }))}
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
                placeholder={'Service price'}
                placeholderTextColor={"rgba(0,0,0,0.35)"}
              />
            </View>
            <View
              style={{
                gap: 8,
                flex: 1

              }}
            >
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>Duration</Text>
              <TextInput
                mode={"outlined"}
                value={service?.duration?.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setService(prev => ({ ...prev, duration: text }))}
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
                placeholder={'Duration'}
                placeholderTextColor={"rgba(0,0,0,0.35)"}
              />
            </View>
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Description
            </Text>
            <TextInput
              mode={"outlined"}
              multiline
              value={service.description}
              onChangeText={(text) => setService(prev => ({ ...prev, description: text }))}
              outlineColor={"rgba(0,110,233,0.4)"}
              activeOutlineColor={"rgba(0,110,233,0.4)"}
              style={{
                backgroundColor: "white",
                fontSize: 14,
              }}
              contentStyle={{
                height: 90,
              }}
              outlineStyle={{
                borderWidth: 0.5,
                borderRadius: 12,
              }}
            />
          </View>

          <View
            style={{
              gap: 8,
            }}>
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Service Image
            </Text>
            <TouchableOpacity
              style={{
                height: 200,
                borderRadius: 16,
                borderWidth: 0.5,
                borderColor: '#006EE9',
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: 'dashed',
              }}
              onPress={onSelectImage}
            >
              {
                image.uri ?
                <Image
                  contentFit={'cover'}
                  source={image.uri} style={{ height: 200, width: '100%', borderRadius: 16 }} />
                  : (
                    <View style={{
                      borderRadius: 16,
                      borderWidth: 0.5,
                      borderColor: 'rgba(0,110,233,0.4)',
                      padding: 4
                    }}>
                      <Ionicons name={'add'} size={25} color={'#006EE9'} />
                    </View>
                  )
              }
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            buttonColor="#105CDB"
            style={{
              width: "100%",
              borderRadius: 8,
              marginBottom: isIos ? 0 : 16,
              marginTop: 8,
            }}
            contentStyle={{
              height: 52,
            }}
            onPress={isEditMode ? onUpdateService : onCreateService}
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
