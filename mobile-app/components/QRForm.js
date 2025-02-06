import { Formik } from "formik";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import * as yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  bloodType: yup.string().required("Blood type is required"),
  allergies: yup.string(),
  emergencyContact: yup.object().shape({
    name: yup.string().required("Contact name is required"),
    number: yup.string().required("Contact number is required"),
  }),
});

export default function QRForm({ navigation, route }) {
  const [existingData, setExistingData] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    bloodType: "",
    allergies: "",
    emergencyContact: { name: "", number: "" },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    if (route.params?.editData) {
      setInitialValues(route.params.editData);
      setRecordId(route.params.editData.id);
      setIsEditing(true);
    }
  }, [route.params]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const { data } = await axios.get(
          "http://192.168.1.81:3001/api/records",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data) setExistingData(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = isEditing
        ? `http://localhost:3001/api/records/${recordId}`
        : "http://localhost:3001/api/records";

      const response = await (isEditing
        ? axios.patch(url, values, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : axios.post(url, values, {
            headers: { Authorization: `Bearer ${token}` },
          }));

      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      navigation.navigate("QRDisplay", { id: response.data.id, ...values });
    } catch (err) {
      console.error("Error updating/saving record:", err);
      alert(isEditing ? "Failed to update" : "Failed to save");
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3001/api/records/${recordId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
      alert("Record deleted successfully");
      navigation.navigate("Profile");
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete record");
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            <Text style={styles.label}>Blood Type</Text>
            <TextInput
              style={styles.input}
              placeholder="O+"
              onChangeText={handleChange("bloodType")}
              onBlur={handleBlur("bloodType")}
              value={values.bloodType}
            />
            {touched.bloodType && errors.bloodType && (
              <Text style={styles.errorText}>{errors.bloodType}</Text>
            )}

            <Text style={styles.label}>Allergies (Leave blank if N/A)</Text>
            <TextInput
              style={styles.input}
              placeholder="Peanuts, Shellfish"
              onChangeText={handleChange("allergies")}
              onBlur={handleBlur("allergies")}
              value={values.allergies}
            />

            <Text style={styles.label}>Emergency Contact Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              onChangeText={handleChange("emergencyContact.name")}
              onBlur={handleBlur("emergencyContact.name")}
              value={values.emergencyContact.name}
            />
            {touched.emergencyContact?.name &&
              errors.emergencyContact?.name && (
                <Text style={styles.errorText}>
                  {errors.emergencyContact.name}
                </Text>
              )}

            <Text style={styles.label}>Emergency Contact Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+1234567890"
              onChangeText={handleChange("emergencyContact.number")}
              onBlur={handleBlur("emergencyContact.number")}
              value={values.emergencyContact.number}
            />
            {touched.emergencyContact?.number &&
              errors.emergencyContact?.number && (
                <Text style={styles.errorText}>
                  {errors.emergencyContact.number}
                </Text>
              )}

            <View style={styles.buttonContainer}>
              <Button
                title="Generate QR"
                onPress={handleSubmit}
                color="#007AFF"
              />
            </View>

            {existingData && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Delete My Record"
                  onPress={handleDelete}
                  color="#ff4444"
                />
              </View>
            )}
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginBottom: 8,
  },
});
