import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { theme } from "../theme";
import { signUp } from "../redux/actions/actions";

export default function SignUp({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert("Error!", "Don't Forget To Enter Your Name!");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error!", "Don't Forget To Enter Your E-Mail!");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error!", "Don't Forget To Enter Your Password!");
      return;
    }
    if (password.length < 6 || password.length > 20) {
      Alert.alert("Error!", "Password must be between 6 and 20 characters!");
      return;
    }
    if (!confirmPassword.trim()) {
      Alert.alert("Error!", "Don't Forget To Confirm Your Password!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error!", "Don't Forget To Match Your Passwords!");
      return;
    }

    try {
      await signUp(name.trim(), email.trim().toLowerCase(), password)(dispatch);
    } catch (error) {
      Alert.alert("Error!", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require("../images/wtwbanner.png")}
          style={styles.banner}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={theme.colors.white}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.white}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.white}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colors.white}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.darkBlueBg,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  banner: {
    width: "100%",
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.orange,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  input: {
    backgroundColor: theme.colors.darkBlue,
    borderColor: theme.colors.orange,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: theme.colors.orange,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  signUpButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: theme.colors.lightGray,
    fontSize: 14,
  },
  loginLink: {
    color: theme.colors.orange,
    fontSize: 14,
    fontWeight: "bold",
  },
});