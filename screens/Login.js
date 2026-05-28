import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { theme } from "../theme";
import { login } from "../redux/actions/actions";

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    if (!email || !email.trim()) {
      return Alert.alert("Error!", "Don't Forget To Enter Your E-Mail!");
    }

    if (!validateEmail(email.trim())) {
      return Alert.alert("Error!", "Please enter a valid email address.");
    }

    if (!password || !password.trim()) {
      return Alert.alert("Error!", "Don't Forget To Enter Your Password!");
    }

    try {
      setLoading(true);
      await login(email.trim().toLowerCase(), password)(dispatch);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error?.message || "Network or server error. Please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={require("../images/wtwbanner.png")} style={styles.banner} resizeMode="contain" />
        <Text style={styles.subtitle}>Let us help you find your new favorite movie!</Text>

        <View style={styles.form}>
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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={theme.colors.white}/>
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Create an account </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.darkBlueBg,
    padding: 20
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  banner: {
    width: "100%",
    height: 100,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.lightGray,
    textAlign: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
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
  loginButton: {
    backgroundColor: theme.colors.orange,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  loginButtonText: {
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
  signUpLink: {
    color: theme.colors.orange,
    fontSize: 14,
    fontWeight: "bold",
  },
});
