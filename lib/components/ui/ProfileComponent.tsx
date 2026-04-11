import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Avatar, Text } from "react-native-paper";
import {router, useRouter} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { removeStringData } from "@/lib/utils/AsyncStorage";
import { useAuth } from "@/lib/context/AuthContext";
import { IMAGES } from "@/lib/assets/images";

const MenuItem = ({
                    icon,
                    label,
                    onPress,
                  }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) => (
  <View style={styles.menuRow}>
    <Ionicons name={icon} size={20} color="#006EE9" />

    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.menuItem}
      onPress={onPress}
    >
      <Text variant="titleSmall">{label}</Text>

      <Ionicons
        name="arrow-forward-circle-outline"
        size={20}
        color="#999"
      />
    </TouchableOpacity>
  </View>
);

export default function ProfileComponent() {
  const { navigate } = useRouter();
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ")
    ?.map((w: string) => w[0])
    ?.slice(0, 2)
    ?.join("")
    ?.toUpperCase();

  const handleLogout = async () => {
    await removeStringData("accessToken");
    navigate("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={StyleSheet.absoluteFill}
          source={IMAGES.profileBg}
          contentFit="cover"
        />

        <View style={styles.userInfo}>
          <Avatar.Text
            size={44}
            label={initials || "U"}
            style={styles.avatar}
          />

          <View>
            <Text variant={'titleMedium'} style={styles.name}>{user?.name}</Text>
            <Text variant={'titleSmall'}style={styles.email}>{user?.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem label="Edit Profile" icon="pencil" onPress={() => {
          router.push("/edit-profile")
        }}/>
        <MenuItem label="Change Password" icon="lock-closed" onPress={() => {
          router.push("/change-password")
        }}/>
      </View>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          textColor="rgba(234, 57, 67, 1)"
          style={styles.logoutBtn}
          contentStyle={styles.logoutContent}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 24,
    backgroundColor: "#006EE9",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingLeft: 16,
  },

  avatar: {
    backgroundColor: "rgb(0,54,233)",
  },

  name: {
    color: "#fff",
    fontWeight: "bold",
  },

  email: {
    color: "#fff",
  },

  menuContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  footer: {
    paddingHorizontal: 16,
  },

  logoutBtn: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 8,
    borderColor: "rgba(234, 57, 67, 1)",
  },

  logoutContent: {
    height: 52,
  },
});
