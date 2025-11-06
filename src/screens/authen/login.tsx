import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TextInput, Button, HelperText, ActivityIndicator, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootParamList } from "~/navigations/RootNavigation";

/**
 * React Native Login / Register screen (English version)
 *
 * Requirements:
 * - <PaperProvider> at root
 * - Works with React Navigation
 *
 * Backend endpoints assumed:
 *   POST /api/auth/login     { email, password, remember }
 *   POST /api/auth/register  { name, email, password }
 *
 * Usage:
 *   <LoginNative onSuccess={() => navigation.replace("Home")}/>
 */

type Mode = "login" | "register";

interface Props {
  onSuccess?: () => void;
}

const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;

const LoginNative: React.FC<Props> = ({ onSuccess }) => {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const resetMessages = () => { setError(null); setMessage(null); };
    const navigation =
      useNavigation<StackNavigationProp<RootParamList, 'Login'>>();

  const validate = () => {
    if (!emailRegex.test(email)) return "Invalid email address";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (mode === "register") {
      if (!name.trim()) return "Please enter your name";
      if (password !== confirmPassword) return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async () => {
    resetMessages();
    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);
    try {
      const API_BASE = (process.env.EXPO_PUBLIC_API_BASE_URL as string)
        || (Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000");
      const endpoint = mode === "login" ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`;
      const payload: Record<string, unknown> = { email, password };
      if (mode === "register") payload.name = name;
      if (mode === "login") payload.remember = remember;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data && (data.error || data.message)) || "An error occurred");

      if (mode === "login") {
        if (data?.token && remember) {
          await AsyncStorage.setItem("auth_token", String(data.token));
        }
        setMessage("Login successful!");
        navigation.navigate('BottomTabNavigation', {screen: 'HomeScreen'});
      } else {
        setMessage("Registration successful! Please log in.");
        setMode("login");
      }
    } catch (e: any) {
      setError(e?.message || "Cannot connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title} variant="headlineMedium">
          {mode === "login" ? "Sign In" : "Create an Account"}
        </Text>
        <Text style={styles.subtitle} variant="bodyMedium">
          {mode === "login"
            ? "Welcome back to Plant Identifier"
            : "Create an account to use Plant Identifier"}
        </Text>

        {!!error && <HelperText type="error" visible>{error}</HelperText>}
        {!!message && <HelperText type="info" visible>{message}</HelperText>}

        {mode === "register" && (
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            autoCapitalize="words"
          />
        )}

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={secure}
          right={<TextInput.Icon icon={secure ? "eye" : "eye-off"} onPress={() => setSecure((s) => !s)} />}
          style={styles.input}
        />

        {mode === "register" && (
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={secure}
            style={styles.input}
          />
        )}

        {mode === "login" && (
          <TouchableOpacity onPress={() => setRemember((r) => !r)} style={styles.rememberRow}>
            <View style={[styles.checkbox, remember && styles.checkboxChecked]} />
            <Text>Remember me</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => { /* navigate to forgot password screen */ }}>
              <Text style={styles.link}>Forgot password?</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        <Button mode="contained" onPress={handleSubmit} disabled={loading} style={styles.submit}>
          {loading ? <ActivityIndicator animating /> : (mode === "login" ? "Sign In" : "Create Account")}
        </Button>

        <View style={styles.dividerRow}>
          <Divider style={{ flex: 1 }} />
          <Text style={{ marginHorizontal: 8 }}>Or</Text>
          <Divider style={{ flex: 1 }} />
        </View>

        <Button mode="outlined" onPress={() => { /* open /api/auth/oauth/google */ }} style={styles.oauthBtn}>
          Continue with Google
        </Button>
        <Button mode="outlined" onPress={() => { /* open /api/auth/oauth/github */ }} style={styles.oauthBtn}>
          Continue with GitHub
        </Button>

        <View style={styles.bottomRow}>
          {mode === "login" ? (
            <>
              <Text>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => { resetMessages(); setMode("register"); }}>
                <Text style={styles.link}>Register now</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text>Already have an account? </Text>
              <TouchableOpacity onPress={() => { resetMessages(); setMode("login"); }}>
                <Text style={styles.link}>Sign in</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <Text style={styles.footer}>
          By continuing, you agree to the Terms & Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16, justifyContent: "center" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, elevation: 3 },
  title: { textAlign: "center", marginBottom: 4 },
  subtitle: { textAlign: "center", color: "#64748b", marginBottom: 8 },
  input: { marginTop: 8 },
  rememberRow: { flexDirection: "row", alignItems: "center", marginTop: 6, marginBottom: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: "#CBD5E1", marginRight: 8 },
  checkboxChecked: { backgroundColor: "#0f172a", borderColor: "#0f172a" },
  submit: { marginTop: 8 },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  oauthBtn: { marginBottom: 8 },
  bottomRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 12 },
  link: { color: "#0f172a", fontWeight: "600" },
  footer: { textAlign: "center", color: "#64748b", marginTop: 12, fontSize: 12 },
});

export default LoginNative;
