import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import {Button} from "react-native-paper";
import {removeStringData} from "@/lib/utils/AsyncStorage";
import {useRouter} from "expo-router";

export default function ProfileScreen() {
  const { navigate } = useRouter()

  return (
    <View style={styles.container}>

      <Button onPress={async () => {
        await removeStringData('accessToken');
        navigate('/login');
      }}>Log out</Button>
    </View>
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
