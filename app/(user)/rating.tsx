import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';

import {router, Stack, useLocalSearchParams} from "expo-router";
import {KeyboardAwareScrollView, KeyboardToolbar} from "react-native-keyboard-controller";
import {TextInput, Text, Button} from "react-native-paper";
import React, {useEffect, useMemo, useState} from "react";
import {Image} from "expo-image";
import moment from "moment";
import {InfoItem} from "@/lib/components/ui/AppointmentCard";
import Rating from "@/lib/components/ui/Rating";
import TagSelector from "@/lib/components/ui/TagSelector";
import {useAuth} from "@/lib/context/AuthContext";
import {useSpa} from "@/lib/context/SpaContext";
import {Ionicons} from "@expo/vector-icons";

export default function RatingScreen() {
  const { query } = useLocalSearchParams();
  const { setLoading } = useAuth()
  const { ratingAppointment } = useSpa()

  const data = JSON.parse(query) || {}
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');

  const [modalVisible, setModalVisible] = useState(false);

  const onRating = async () => {
    try {
      const params = {
        appointmentId: data.id,
        rating,
        comment,
        tags: selectedTags
      }

      setLoading(true)

      const response = await ratingAppointment(params)

      if (response?.id) {
        setModalVisible(true)
      }

    } catch (e) {

    } finally {
      setLoading(false)
    }
  }

  const onSuccess = async () => {
    setModalVisible(false)
    router.back()
  }

  return (
    <>
      <KeyboardAwareScrollView bottomOffset={150} style={{
        backgroundColor: 'white'
      }} >
        <View style={{
          flex: 1,
          backgroundColor: 'white',
          paddingHorizontal: 16,
          gap: 20
          // paddingBottom: 40,
        }}>
            <View style={styles.item}>
              <View>
                <Image
                  contentFit={'cover'}
                  source={data.service.imageUrl} style={{ height: 200, width: '100%', borderRadius: 16 }} />
              </View>

              <View style={styles.row}>
                <InfoItem
                  icon="spa"
                  label="Service"
                  value={data.service?.name || '--'}
                />
                <InfoItem icon="calendar-check-outline" label="Booked On" value={moment(data.appointmentTime).format('DD-MM-YYYY | HH:mm')} />
              </View>
            </View>

            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 20
            }}>
              <Text variant="titleSmall" style={{ color: '#999'}}>
                Rate Your Experience
              </Text>

              <Rating rating={rating} onChange={setRating} />
            </View>

            <TagSelector
              options={["Clean", "Friendly", "Professional", "Relaxing", "Kind"]}
              selected={selectedTags}
              onChange={setSelectedTags}
            />

            <View
              style={{
                gap: 8,
              }}
            >
              <Text style={{ color: "#999" }}>
                How was your overall experience?
              </Text>
              <TextInput
                mode={"outlined"}
                multiline
                value={comment}
                onChangeText={(text) => setComment(text)}
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

            <Button
              disabled={rating === 0}
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
              onPress={onRating}
            >
              Done!
            </Button>

        </View>
      </KeyboardAwareScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>

            <Ionicons name="checkmark-circle-outline" size={65} color="lightgreen" style={{paddingVertical: 16}} />
            <Text style={styles.modalTitle}>Submitted!</Text>
            <Text style={styles.modalMessage}>Thanks for sharing your feedback with us!!</Text>


            <TouchableOpacity
              style={{
                backgroundColor: '#006EE9',
                height: 40,
                width: 200,
                paddingHorizontal: 16,
                borderRadius: 12,
              }}
              onPress={onSuccess}
            >
              <Text style={styles.cancel}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {

  },
  item: {
    backgroundColor: 'rgba(0,110,233,0.05)',
    borderRadius: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 16
  },

  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#006EE9'
  },
  modalMessage: {
    fontSize: 14,
    paddingHorizontal: 40,
    textAlign: 'center',
    marginBottom: 12,
  },

  cancel: {
    textAlign: 'center',
    marginTop: 12,
    color: 'white',
  },
});
