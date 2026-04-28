import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from '@/components/Themed';
import { router, Stack, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";
import { TextInput, Text, Button } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { isIos } from "@/lib/utils/helper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { getServiceDetail } from "@/lib/services/api/services";
import { useAuth } from "@/lib/context/AuthContext";
import { useSpa } from "@/lib/context/SpaContext";

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
  });

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

  const { setLoading } = useAuth();
  const { createService, updateService } = useSpa();

  const [service, setService] = useState<any>({
    name: '',
    price: '',
    duration: '',
    description: '',
  });

  const [image, setImage] = useState<{
    uri?: string;
    fileName?: string;
  }>({});

  const [errorInputMessage, setErrorInputMessage] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
  });

  const [checked, setChecked] = useState(true);

  useEffect(() => {
    (async () => {
      if (isEditMode) {
        const data = await getServiceDetail(serviceId);

        if (data) {
          setService(data);
          setImage({
            uri: data.imageUrl,
          });
          setChecked(data?.status === 'ACTIVE')
        }
      }
    })();
  }, [serviceId]);

  const onSelectImage = async () => {
    try {
      setLoading(true);
      const source = await pickImage();
      if (source) setImage(source);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setService(prev => ({ ...prev, [field]: value }));

    if (errorInputMessage[field]) {
      setErrorInputMessage(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const checkError = () => {
    const errors = {
      name: '',
      price: '',
      duration: '',
      description: '',
    };

    if (!service.name?.trim() || service.name.trim().length < 8) {
      errors.name = 'Service name must be at least 8 characters';
    }

    if (!service.description?.trim() || service.description.trim().length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    const price = Number(service.price);
    if (!service.price) {
      errors.price = 'Price is required';
    } else if (isNaN(price)) {
      errors.price = 'Price must be a number';
    } else if (price < 99999) {
      errors.price = 'Price must be greater than 99,999';
    }

    const duration = Number(service.duration);
    if (!service.duration) {
      errors.duration = 'Duration is required';
    } else if (isNaN(duration)) {
      errors.duration = 'Duration must be a number';
    } else if (duration <= 0) {
      errors.duration = 'Duration must be greater than 0';
    }

    setErrorInputMessage(errors);

    return Object.values(errors).every(e => !e);
  };

  const buildFormData = () => {
    const formData = new FormData();

    const status = checked ? 'ACTIVE' : 'INACTIVE';

    formData.append('name', service.name);
    formData.append('status', status);
    formData.append('description', service.description);
    formData.append('price', String(service.price));
    formData.append('duration', String(service.duration));

    const shouldUploadImage =
      image?.uri &&
      (!isEditMode || image.uri !== service.imageUrl);

    if (shouldUploadImage) {
      formData.append('file', {
        uri: image.uri,
        name: image.fileName || 'image.jpg',
        type: 'image/jpeg',
      } as any);
    }

    return formData;
  };

  const onCreateService = async () => {
    try {
      const isValid = checkError();
      if (!isValid) return;

      setLoading(true);

      const result: any = await createService(buildFormData());

      if (result?.id) {
        router.push('/(admin)/create-service-success-modal');
      } else if (result?.message) {
        Alert.alert("Notice", result.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateService = async () => {
    try {
      const isValid = checkError();
      if (!isValid) return;

      setLoading(true);

      const result = await updateService(service.id, buildFormData());

      if (result?.id) {
        router.push('/(admin)/update-service-success-modal');
      } else if (result?.message) {
        Alert.alert("Notice", result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView bottomOffset={100}>
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
          <View style={{ gap: 8 }}>
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Name <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TextInput
              mode={"outlined"}
              value={service.name}
              onChangeText={(text) => handleChange('name', text)}
              outlineColor={!!errorInputMessage.name ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              activeOutlineColor={!!errorInputMessage.name ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              style={{ backgroundColor: "white", fontSize: 14 }}
              outlineStyle={{ borderWidth: 0.5, borderRadius: 12 }}
              placeholder={'Service name'}
              placeholderTextColor={"rgba(0,0,0,0.35)"}
            />
            {!!errorInputMessage.name && (
              <Text variant={'labelSmall'} style={{ color: 'rgba(234, 57, 67, 1)' }}>
                {errorInputMessage.name}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ gap: 8, flex: 1 }}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
                Price(VND) <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                mode={"outlined"}
                value={service.price}
                onChangeText={(text) => handleChange('price', text)}
                outlineColor={!!errorInputMessage.price ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
                activeOutlineColor={!!errorInputMessage.price ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
                style={{ backgroundColor: "white", fontSize: 14 }}
                outlineStyle={{ borderWidth: 0.5, borderRadius: 12 }}
                placeholder={'Price'}
                placeholderTextColor={"rgba(0,0,0,0.35)"}
              />
              {!!errorInputMessage.price && (
                <Text variant={'labelSmall'} style={{ color: 'rgba(234, 57, 67, 1)' }}>
                  {errorInputMessage.price}
                </Text>
              )}
            </View>

            <View style={{ gap: 8, flex: 1 }}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
                Duration <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                mode={"outlined"}
                value={service.duration?.toString()}
                keyboardType="numeric"
                onChangeText={(text) => handleChange('duration', text)}
                outlineColor={!!errorInputMessage.duration ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
                activeOutlineColor={!!errorInputMessage.duration ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
                style={{ backgroundColor: "white", fontSize: 14 }}
                outlineStyle={{ borderWidth: 0.5, borderRadius: 12 }}
                placeholder={'Duration'}
                placeholderTextColor={"rgba(0,0,0,0.35)"}
              />
              {!!errorInputMessage.duration && (
                <Text variant={'labelSmall'} style={{ color: 'rgba(234, 57, 67, 1)' }}>
                  {errorInputMessage.duration}
                </Text>
              )}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Description <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TextInput
              mode={"outlined"}
              multiline
              value={service.description}
              onChangeText={(text) => handleChange('description', text)}
              outlineColor={!!errorInputMessage.description ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              activeOutlineColor={!!errorInputMessage.description ? "rgba(234, 57, 67, 1)" : "rgba(0,110,233,0.4)"}
              style={{ backgroundColor: "white", fontSize: 14 }}
              contentStyle={{ height: 90 }}
              outlineStyle={{ borderWidth: 0.5, borderRadius: 12 }}
            />
            {!!errorInputMessage.description && (
              <Text variant={'labelSmall'} style={{ color: 'rgba(234, 57, 67, 1)' }}>
                {errorInputMessage.description}
              </Text>
            )}
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Service Image <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <TouchableOpacity
              style={{
                height: 200,
                borderRadius: 16,
                borderWidth: 0.5,
                borderColor: image.uri ? 'transparent' : '#006EE9',
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: image.uri ? 'solid' : 'dashed',
              }}
              onPress={onSelectImage}
            >
              {image.uri ? (
                <Image
                  contentFit={'cover'}
                  source={image.uri}
                  style={{ height: 200, width: '100%', borderRadius: 16 }}
                />
              ) : (
                <View style={{
                  borderRadius: 16,
                  borderWidth: 0.5,
                  borderColor: 'rgba(0,110,233,0.4)',
                  padding: 4
                }}>
                  <Ionicons name={'add'} size={25} color={'#006EE9'} />
                </View>
              )}
            </TouchableOpacity>
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
            disabled={!image.uri && !isEditMode}
            mode="contained"
            buttonColor="#105CDB"
            style={{
              width: "100%",
              borderRadius: 8,
              marginBottom: isIos ? 0 : 16,
              marginTop: 8,
            }}
            contentStyle={{ height: 52 }}
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

const styles = StyleSheet.create({});
