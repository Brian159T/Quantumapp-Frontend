import React, { useState } from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAuth } from '../../ViewModel/AuthViewModel'

const ACCENT = '#2fb676'
const WHITE = '#ffffff'
const MUTED = 'rgba(255,255,255,0.30)'
const MUTED_TXT = 'rgba(255,255,255,0.50)'

type Screen = 'login' | 'register'
type Props = { onPress?: () => void }

const LoginButton = ({ onPress }: Props) => {
  const { login, registro, loadingLogin, loadingRegistro, errorLogin, errorRegistro } = useAuth()

  const [visible, setVisible] = useState(false)
  const [screen, setScreen] = useState<Screen>('login')
  const [focused, setFocused] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regConfirmError, setRegConfirmError] = useState<string | null>(null)

  const handleLogin = async () => {
    const ok = await login({ correo: email, contrasena: password })
    if (ok) close()
  }

  const handleRegister = async () => {
    setRegConfirmError(null)
    if (regPassword !== regConfirm) {
      setRegConfirmError('Las contraseñas no coinciden')
      return
    }
    const ok = await registro({ correo: regEmail, contrasena: regPassword })
    if (ok) close()
  }

  const open = () => {
    setScreen('login')
    setVisible(true)
    onPress?.()
  }
  const close = () => setVisible(false)

  return (
    <>
      <TouchableOpacity onPress={open} activeOpacity={0.8} style={styles.loginButton}>
        <MaterialCommunityIcons name="account-outline" size={16} color="rgba(255,255,255,0.7)" />
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={close}>
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.kav}
              >
                <View
                  style={[
                    styles.modalCard,
                    {
                      shadowColor: ACCENT,
                      shadowOffset: { width: 0, height: 12 },
                      shadowOpacity: 0.18,
                      shadowRadius: 32,
                      elevation: 14,
                    },
                  ]}
                >
                  <View style={styles.topBar} />

                  <Pressable onPress={close} hitSlop={12} style={styles.closeButton}>
                    <MaterialCommunityIcons name="close" size={18} color={MUTED_TXT} />
                  </Pressable>

                  {screen === 'login' ? (
                    <LoginForm
                      focused={focused}
                      setFocused={setFocused}
                      onRegister={() => setScreen('register')}
                      email={email}
                      password={password}
                      setEmail={setEmail}
                      setPassword={setPassword}
                      onLogin={handleLogin}
                      error={errorLogin}
                      loading={loadingLogin}
                    />
                  ) : (
                    <RegisterForm
                      focused={focused}
                      setFocused={setFocused}
                      onBack={() => setScreen('login')}
                      email={regEmail}
                      password={regPassword}
                      confirm={regConfirm}
                      setEmail={setRegEmail}
                      setPassword={setRegPassword}
                      setConfirm={setRegConfirm}
                      onRegister={handleRegister}
                      error={regConfirmError || errorRegistro}
                      loading={loadingRegistro}
                    />
                  )}
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

/* ─── SHARED FIELD ─────────────────────────────────────────────── */
type FieldProps = {
  icon: string
  placeholder: string
  id: string
  focused: string | null
  setFocused: (v: string | null) => void
  secure?: boolean
  keyboard?: 'email-address' | 'default'
  value: string
  onChangeText: (text: string) => void
}

const Field = ({ icon, placeholder, id, focused, setFocused, secure, keyboard, value, onChangeText }: FieldProps) => (
  <View
    style={[
      styles.field,
      focused === id ? styles.fieldFocused : styles.fieldBlurred,
    ]}
  >
    <MaterialCommunityIcons
      name={icon as any}
      size={16}
      color={focused === id ? ACCENT : MUTED}
      style={styles.fieldIcon}
    />
    <TextInput
      style={styles.fieldInput}
      placeholder={placeholder}
      placeholderTextColor={MUTED}
      secureTextEntry={secure}
      keyboardType={keyboard ?? 'default'}
      autoCapitalize="none"
      onFocus={() => setFocused(id)}
      onBlur={() => setFocused(null)}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
)

/* ─── LOGIN FORM ───────────────────────────────────────────────── */
type LoginFormProps = {
  focused: string | null
  setFocused: (v: string | null) => void
  onRegister?: () => void
  email: string
  password: string
  setEmail: (v: string) => void
  setPassword: (v: string) => void
  onLogin: () => void
  error: string | null
  loading: boolean
}

const LoginForm = ({ focused, setFocused, onRegister, email, password, setEmail, setPassword, onLogin, error, loading }: LoginFormProps) => (
  <View>
    <View style={styles.iconHeaderWrap}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="shield-lock-outline" size={26} color={ACCENT} />
      </View>
    </View>

    <Text style={styles.title}>Bienvenido</Text>
    <Text style={styles.subtitle}>
      Ingresa a tu cuenta para continuar
    </Text>

    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>Correo electrónico</Text>
      <Field id="email" icon="email-outline" placeholder="tu@correo.com" keyboard="email-address" focused={focused} setFocused={setFocused} value={email} onChangeText={setEmail} />
    </View>

    <View style={styles.fieldWrapper}>
      <View style={styles.fieldLabelRow}>
        <Text style={styles.fieldLabelInline}>Contraseña</Text>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </View>
      <Field id="pass" icon="lock-outline" placeholder="••••••••" secure focused={focused} setFocused={setFocused} value={password} onChangeText={setPassword} />
    </View>

    {error && <Text style={styles.errorText}>{error}</Text>}

    <TouchableOpacity
      activeOpacity={0.85}
      disabled={loading}
      onPress={onLogin}
      style={[
        styles.submitButton,
        { shadowColor: ACCENT, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 14, elevation: 8, opacity: loading ? 0.7 : 1 },
      ]}
    >
      <Text style={styles.submitButtonText}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</Text>
      <MaterialCommunityIcons name="arrow-right" size={16} color={WHITE} />
    </TouchableOpacity>

    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>¿No tienes cuenta?</Text>
      <View style={styles.dividerLine} />
    </View>

    <TouchableOpacity onPress={onRegister} activeOpacity={0.8} style={styles.secondaryButton}>
      <MaterialCommunityIcons name="account-plus-outline" size={16} color={ACCENT} />
      <Text style={styles.secondaryButtonText}>Crear una cuenta</Text>
    </TouchableOpacity>
  </View>
)

/* ─── REGISTER FORM ────────────────────────────────────────────── */
type RegisterFormProps = {
  focused: string | null
  setFocused: (v: string | null) => void
  onBack?: () => void
  email: string
  password: string
  confirm: string
  setEmail: (v: string) => void
  setPassword: (v: string) => void
  setConfirm: (v: string) => void
  onRegister: () => void
  error: string | null
  loading: boolean
}

const RegisterForm = ({ focused, setFocused, onBack, email, password, confirm, setEmail, setPassword, setConfirm, onRegister, error, loading }: RegisterFormProps) => (
  <View>
    <View style={styles.iconHeaderWrap}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="account-plus-outline" size={26} color={ACCENT} />
      </View>
    </View>

    <Text style={styles.title}>Crear cuenta</Text>
    <Text style={styles.subtitle}>
      Completa los datos para registrarte
    </Text>

    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>Correo electrónico</Text>
      <Field id="reg-email" icon="email-outline" placeholder="tu@correo.com" keyboard="email-address" focused={focused} setFocused={setFocused} value={email} onChangeText={setEmail} />
    </View>

    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>Contraseña</Text>
      <Field id="reg-pass" icon="lock-outline" placeholder="••••••••" secure focused={focused} setFocused={setFocused} value={password} onChangeText={setPassword} />
    </View>

    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>Confirmar contraseña</Text>
      <Field id="reg-confirm" icon="lock-check-outline" placeholder="••••••••" secure focused={focused} setFocused={setFocused} value={confirm} onChangeText={setConfirm} />
    </View>

    {error && <Text style={styles.errorText}>{error}</Text>}

    <TouchableOpacity
      activeOpacity={0.85}
      disabled={loading}
      style={[
        styles.submitButton,
        { shadowColor: ACCENT, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 14, elevation: 8, opacity: loading ? 0.7 : 1 },
      ]}
      onPress={onRegister}
    >
      <Text style={styles.submitButtonText}>{loading ? 'Creando...' : 'Crear cuenta'}</Text>
      <MaterialCommunityIcons name="check" size={16} color={WHITE} />
    </TouchableOpacity>

    <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backButton}>
      <MaterialCommunityIcons name="arrow-left" size={14} color={MUTED_TXT} />
      <Text style={styles.backButtonText}>Volver a iniciar sesión</Text>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  loginButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  loginButtonText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
    color: '#fff',
  },

  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(10,15,30,0.88)',
  },
  kav: {
    width: '100%',
    maxWidth: 390,
  },
  modalCard: {
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(47,182,118,0.16)',
    backgroundColor: '#0d1526',
    padding: 28,
    paddingTop: 0,
  },
  topBar: {
    marginHorizontal: -28,
    marginBottom: 28,
    height: 3,
    backgroundColor: '#2fb676',
  },
  closeButton: {
    position: 'absolute',
    right: 18,
    top: 18,
    zIndex: 10,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  field: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  fieldFocused: {
    borderColor: 'rgba(47,182,118,0.52)',
    backgroundColor: 'rgba(47,182,118,0.04)',
  },
  fieldBlurred: {
    borderColor: 'rgba(47,182,118,0.16)',
    backgroundColor: '#080d1a',
  },
  fieldIcon: {
    marginRight: 10,
  },
  fieldInput: {
    height: '100%',
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },

  iconHeaderWrap: {
    marginBottom: 18,
    alignItems: 'center',
  },
  iconCircle: {
    height: 58,
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(47,182,118,0.28)',
    backgroundColor: 'rgba(47,182,118,0.10)',
  },
  title: {
    marginBottom: 6,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    color: '#fff',
  },
  subtitle: {
    marginBottom: 26,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.50)',
  },

  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: 'rgba(255,255,255,0.70)',
  },
  fieldLabelRow: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabelInline: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: 'rgba(255,255,255,0.70)',
  },
  forgotText: {
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '500',
    color: '#2fb676',
  },

  errorText: {
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 12,
    color: '#f87171',
  },

  submitButton: {
    marginTop: 8,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: '#2fb676',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.3,
    color: '#fff',
  },

  dividerRow: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  dividerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.50)',
  },

  secondaryButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(47,182,118,0.30)',
    backgroundColor: 'rgba(47,182,118,0.06)',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2fb676',
  },

  backButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.50)',
  },
})

export default LoginButton