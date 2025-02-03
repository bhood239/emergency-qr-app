import { View, Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRDisplay({ qrData, setShowQR }) {
  const qrValue = `http://localhost:3001/record/${qrData.id}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Emergency QR Code</Text>
      <View style={styles.qrContainer}>
        <QRCode value={qrValue} size={300} />
      </View>
      <Text style={styles.instructions}>
        Scan this QR code to access your emergency information.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowQR(false)}>
        <Text style={styles.buttonText}>Edit Information</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  qrContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
