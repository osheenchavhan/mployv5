import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { theme } from '../../theme/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../services/firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Welcome to Mploy</Text>
            
            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                touched={true}
                required
                containerStyle={styles.inputContainer}
              />

              <View style={styles.passwordContainer}>
                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                  touched={true}
                  required
                  containerStyle={styles.inputContainer}
                />
                <Button
                  title="Forgot Password?"
                  variant="text"
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={styles.forgotButton}
                  textStyle={styles.forgotButtonText}
                />
              </View>

              <Button
                title="Login"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
                textStyle={styles.loginButtonText}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Button
                  title="Create Account"
                  variant="text"
                  onPress={() => navigation.navigate('Register')}
                  style={styles.createAccountButton}
                  textStyle={styles.createAccountButtonText}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['5xl'],
    paddingBottom: theme.spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing['3xl'],
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  passwordContainer: {
    marginBottom: theme.spacing.md,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing['2xl'],
  },
  forgotButtonText: {
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.medium,
  },
  loginButton: {
    width: '100%',
    marginBottom: theme.spacing['4xl'],
  },
  loginButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: theme.spacing['2xl'],
  },
  footerText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkGrey,
  },
  createAccountButton: {
    marginLeft: theme.spacing.xs,
  },
  createAccountButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default Login;
