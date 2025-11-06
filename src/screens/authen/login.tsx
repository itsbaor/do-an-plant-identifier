import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TextInput, Button, HelperText, ActivityIndicator, Divider } from "react-native-paper";

/**
 * React Native Login / Register screen
 *
 * Requirements in your app (already present per stack trace):
 * - <PaperProvider> at root
 * - React Navigation stack/screen can render this component
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
  onSuccess?: () => void; // Called after successful login
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

  const validate = () => {
    if (!emailRegex.test(email)) return "Email không hợp lệ";
    if (password.length < 8) return "Mật khẩu cần tối thiểu 8 ký tự";
    if (mode === "register") {
      if (!name.trim()) return "Vui lòng nhập tên";
      if (password !== confirmPassword) return "Mật khẩu nhập lại không khớp";
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
      if (!res.ok) throw new Error((data && (data.error || data.message)) || "Đã có lỗi xảy ra");

      if (mode === "login") {        if (data?.token && remember) {
               await AsyncStorage.setItem("auth_token", String(data.token));
             }     setMessage("Đăng nhập thành công!");
                 onSuccess?.();
      } else {
        setMessage("Đăng kí thành công! Hãy đăng nhập.");
        setMode("login");
      }
    } catch (e: any) {
      setError(e?.message || "Không thể kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title} variant="headlineMedium">
          {mode === "login" ? "Đăng nhập" : "Đăng kí tài khoản"}
        </Text>
        <Text style={styles.subtitle} variant="bodyMedium">
          {mode === "login"
            ? "Chào mừng bạn quay lại ứng dụng Plant Identifier"
            : "Tạo tài khoản để sử dụng ứng dụng Plant Identifier"}
        </Text>

        {!!error && <HelperText type="error" visible>{error}</HelperText>}
        {!!message && <HelperText type="info" visible>{message}</HelperText>}

        {mode === "register" && (
          <TextInput
            label="Họ và tên"
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
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={secure}
          right={<TextInput.Icon icon={secure ? "eye" : "eye-off"} onPress={() => setSecure((s) => !s)} />}
          style={styles.input}
        />

        {mode === "register" && (
          <TextInput
            label="Nhập lại mật khẩu"
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
            <Text>Ghi nhớ đăng nhập</Text>
            <View style={{flex:1}} />
            <TouchableOpacity onPress={() => {/* navigate to forgot password screen */}}>
              <Text style={styles.link}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        <Button mode="contained" onPress={handleSubmit} disabled={loading} style={styles.submit}>
          {loading ? <ActivityIndicator animating /> : (mode === "login" ? "Đăng nhập" : "Tạo tài khoản")}
        </Button>

        <View style={styles.dividerRow}>
          <Divider style={{ flex: 1 }} />
          <Text style={{ marginHorizontal: 8 }}>Hoặc</Text>
          <Divider style={{ flex: 1 }} />
        </View>

        <Button mode="outlined" onPress={() => { /* open /api/auth/oauth/google */ }} style={styles.oauthBtn}>
          Tiếp tục với Google
        </Button>
        <Button mode="outlined" onPress={() => { /* open /api/auth/oauth/github */ }} style={styles.oauthBtn}>
          Tiếp tục với GitHub
        </Button>

        <View style={styles.bottomRow}>
          {mode === "login" ? (
            <>
              <Text>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => { resetMessages(); setMode("register"); }}>
                <Text style={styles.link}>Đăng kí ngay</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => { resetMessages(); setMode("login"); }}>
                <Text style={styles.link}>Đăng nhập</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <Text style={styles.footer}>
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản & Chính sách bảo mật.
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
