import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'

import { IMAGES } from '@/lib/assets/images'
import { isIos } from '@/lib/utils/helper'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {
	const { push, navigate } = useRouter()

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
					paddingHorizontal: 16,
				}}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						gap: 16,
					}}
				>
					<Image
						style={styles.image}
						source={IMAGES.welcome}
						contentFit="contain"
						transition={500}
					/>
					<Text variant="headlineSmall">Relax & Book with Ease</Text>

					<Text
						style={{
							textAlign: 'center',
							paddingHorizontal: 20,
						}}
					>
						Easily schedule your appointments and enjoy a seamless spa experience.
						Choose your preferred time and let us take care of the rest.
					</Text>
				</View>

				<Button
					mode="contained"
					buttonColor="#105CDB"
					style={{
						width: '100%',
						borderRadius: 8,
						marginBottom: isIos ? 0 : 16,
					}}
					contentStyle={{
						height: 52,
					}}
					onPress={() => {
						navigate('/login')
					}}
				>
					Get Started
				</Button>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: 260,
	},
})
