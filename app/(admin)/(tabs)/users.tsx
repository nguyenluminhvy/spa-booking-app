import {StyleSheet, View} from 'react-native';
import {AnimatedFAB, Button, Text} from "react-native-paper";
import {useEffect, useRef, useState} from "react";
import {IMAGES} from "@/lib/assets/images";
import {FlashList} from "@shopify/flash-list";
import {Image} from "expo-image";
import {AccountItem} from "@/lib/components/ui/AccountItem";
import {useAdmin} from "@/lib/context/AdminContext";
import {router} from "expo-router";

const BUTTONS = [
  {
    label: "All",
    type: 'ALL',
  },
  {
    label: "Staff",
    type: 'STAFF',
  },
];

export default function UsersScreen() {
  const { fetchUsers, users } = useAdmin()

  console.log('users', users)

  const [filterType, setFilterType] = useState('ALL');
  const [filterParams, setFilterParams] = useState({});

  const listRef = useRef<any>(null);

  useEffect(() => {
    fetchUsers(filterParams)
  }, [filterParams])

  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
  }, [users]);


  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingBottom: 8,
          marginTop: 16
        }}
      >
        {BUTTONS.map((button, index) => {
          const isActive = button.type === filterType;

          return (
            <Button
              key={index}
              // icon="camera"
              mode="elevated"
              buttonColor={isActive ? "#006EE9" : "#F4F9FF"}
              textColor={isActive ? "white" : "black"}
              // labelStyle={{ fontWeight: isActive ? "bold" : "light" }}
              onPress={() => {
                setFilterType(button.type);
                if (button.type === 'STAFF') {
                  setFilterParams({
                    role: 'STAFF'
                  })
                } else {
                  setFilterParams({})
                }
              }}
            >
              {button.label}
            </Button>
          );
        })}
      </View>

      <FlashList
        ref={listRef}
        ListEmptyComponent={<View style={{
          flex: 1,
          paddingTop: 100,
          alignItems: 'center',
          gap: 8
        }}>
          <Image
            style={{
              width: "100%",
              height: 50,
            }}
            source={IMAGES.nodata}
            contentFit="contain"
          />
          <Text variant={'labelMedium'}>
            No data
          </Text>
        </View>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
        keyExtractor={(item) => item.id.toString()}
        data={users}
        renderItem={({ item }) => <AccountItem {...item} />}
      />

      <AnimatedFAB
        icon={'plus'}
        label={'Add Staff'}
        extended
        onPress={() => router.push({
          pathname: '/create-edit-staff',
          params: {
            staffId: 'new'
          }
        })}
        visible
        style={[styles.fabStyle]}
        color={'white'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
    backgroundColor: "#006EE9",
  },
});
