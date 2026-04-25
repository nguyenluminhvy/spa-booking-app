import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Privacy Policy</Text>

			<Text style={styles.sectionTitle}>1. Information We Collect</Text>
			<Text style={styles.text}>
				We collect personal information such as your name, phone number, email, and booking details when you use our services.
			</Text>

			<Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
			<Text style={styles.text}>
				Your information is used to manage bookings, improve our services, and provide better customer support.
			</Text>

			<Text style={styles.sectionTitle}>3. Data Sharing</Text>
			<Text style={styles.text}>
				We do not sell or share your personal data with third parties, except when required by law or to provide essential services.
			</Text>

			<Text style={styles.sectionTitle}>4. Data Security</Text>
			<Text style={styles.text}>
				We implement appropriate security measures to protect your data from unauthorized access or disclosure.
			</Text>

			<Text style={styles.sectionTitle}>5. Cookies & Tracking</Text>
			<Text style={styles.text}>
				Our app may use cookies or similar technologies to enhance user experience and analyze usage.
			</Text>

			<Text style={styles.sectionTitle}>6. Your Rights</Text>
			<Text style={styles.text}>
				You have the right to access, update, or delete your personal information at any time.
			</Text>

			<Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
			<Text style={styles.text}>
				We may update this Privacy Policy from time to time. Continued use of the app means you accept those changes.
			</Text>

			<Text style={styles.sectionTitle}>8. Contact Us</Text>
			<Text style={styles.text}>
				If you have any questions about this policy, please contact our support team.
			</Text>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		paddingBottom: 40,
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginTop: 12,
		marginBottom: 4,
	},
	text: {
		fontSize: 14,
		lineHeight: 20,
		color: '#444',
	},
});

