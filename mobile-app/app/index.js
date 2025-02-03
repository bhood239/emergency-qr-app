import { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import QRForm from "../components/QRForm";
import QRDisplay from "../components/QRDisplay";

export default function App() {
  const [qrData, setQrData] = useState(null);
  const [showQR, setShowQR] = useState(false);

  return (
    <View style={styles.container}>
      {!showQR ? (
        <QRForm setQrData={setQrData} setShowQR={setShowQR} />
      ) : (
        <QRDisplay qrData={qrData} setShowQR={setShowQR} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
});
