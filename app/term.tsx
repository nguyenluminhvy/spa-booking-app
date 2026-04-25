import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function TermsScreen() {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Terms & Conditions</Text>

			<Text style={styles.sectionTitle}>1. Introduction</Text>
			<Text style={styles.text}>
				Welcome to our Spa Booking App. By using our services, you agree to the following terms and conditions.
			</Text>

			<Text style={styles.sectionTitle}>2. Booking Policy</Text>
			<Text style={styles.text}>
				Users can book services based on available time slots. Please ensure your information is accurate when making a booking.
			</Text>

			<Text style={styles.sectionTitle}>3. Cancellation</Text>
			<Text style={styles.text}>
				You can cancel your booking within a specified time. Late cancellations may be subject to fees.
			</Text>

			<Text style={styles.sectionTitle}>4. Payments</Text>
			<Text style={styles.text}>
				We support multiple payment methods including Cash on Delivery (COD). All payments must be completed as required.
			</Text>

			<Text style={styles.sectionTitle}>5. Privacy Policy</Text>
			<Text style={styles.text}>
				We respect your privacy. Your personal information will be securely stored and not shared with third parties without your consent.
			</Text>

			<Text style={styles.sectionTitle}>6. User Responsibilities</Text>
			<Text style={styles.text}>
				Users must provide accurate information and behave respectfully when using our services.
			</Text>

			<Text style={styles.sectionTitle}>7. Changes to Terms</Text>
			<Text style={styles.text}>
				We reserve the right to update these terms at any time. Continued use of the app means you accept the changes.
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
