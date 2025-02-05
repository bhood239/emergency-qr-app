import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Login";
import QRForm from "../components/QRForm";
import RegisterScreen from "../screens/Register";
import QRDisplay from "../components/QRDisplay";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Profile" component={QRForm} />
      <Stack.Screen name="QRDisplay" component={QRDisplay} />
    </Stack.Navigator>
  );
}
