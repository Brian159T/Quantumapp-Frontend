// components/LoginButton.tsx
import React, { useState } from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const WHITE       = '#ffffff'
const ACCENT      = '#2fb676'
// Base dark: azul medianoche #0A0F1E
const SURFACE     = '#0d1526'   // card — un tono por encima del base
const SURFACE_IN  = '#080d1a'   // inputs — más profundo
const OVERLAY_BG  = 'rgba(10, 15, 30, 0.88)'
const BORDER      = 'rgba(47, 182, 118, 0.16)'
const BORDER_F    = 'rgba(47, 182, 118, 0.52)'
const MUTED       = 'rgba(255,255,255,0.30)'
const MUTED_TXT   = 'rgba(255,255,255,0.50)'

type Screen = 'login' | 'register'
type Props  = { onPress?: () => void }

const LoginButton = ({ onPress }: Props) => {
  const [visible, setVisible]       = useState(false)
  const [screen,  setScreen]        = useState<Screen>('login')
  const [focused, setFocused]       = useState<string | null>(null)

  const open  = () => { setScreen('login'); setVisible(true); onPress?.() }
  const close = () => setVisible(false)

  return (
    <>
      <TouchableOpacity style={styles.loginBtn} onPress={open} activeOpacity={0.8}>
        <MaterialCommunityIcons name="account-outline" size={16} color="rgba(255,255,255,0.7)" />
        <Text style={styles.loginBtnText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={close}>
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kvWrap}>
                <View style={styles.card}>
                  <View style={styles.accentBar} />

                  <Pressable style={styles.closeBtn} onPress={close} hitSlop={12}>
                    <MaterialCommunityIcons name="close" size={18} color={MUTED_TXT} />
                  </Pressable>

                  {screen === 'login'
                    ? <LoginForm  focused={focused} setFocused={setFocused} onRegister={() => setScreen('register')} />
                    : <RegisterForm focused={focused} setFocused={setFocused} onBack={() => setScreen('login')} />
                  }
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
}

const Field = ({ icon, placeholder, id, focused, setFocused, secure, keyboard }: FieldProps) => (
  <View style={[fStyles.wrap, focused === id && fStyles.wrapFocused]}>
    <MaterialCommunityIcons
      name={icon as any}
      size={16}
      color={focused === id ? ACCENT : MUTED}
      style={fStyles.icon}
    />
    <TextInput
      style={fStyles.input}
      placeholder={placeholder}
      placeholderTextColor={MUTED}
      secureTextEntry={secure}
      keyboardType={keyboard ?? 'default'}
      autoCapitalize="none"
      onFocus={() => setFocused(id)}
      onBlur={() => setFocused(null)}
    />
  </View>
)

const fStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE_IN,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    height: 50,
  },
  wrapFocused: {
    borderColor: BORDER_F,
    backgroundColor: 'rgba(47,182,118,0.04)',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: WHITE, fontSize: 14, height: '100%' },
})

/* ─── LOGIN FORM ───────────────────────────────────────────────── */
type FormProps = {
  focused: string | null
  setFocused: (v: string | null) => void
  onRegister?: () => void
  onBack?: () => void
}

const LoginForm = ({ focused, setFocused, onRegister }: FormProps) => (
  <View>
    <View style={styles.iconWrap}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="shield-lock-outline" size={26} color={ACCENT} />
      </View>
    </View>

    <Text style={styles.title}>Bienvenido</Text>
    <Text style={styles.subtitle}>Ingresa a tu cuenta para continuar</Text>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Correo electrónico</Text>
      <Field id="email" icon="email-outline" placeholder="tu@correo.com"
             keyboard="email-address" focused={focused} setFocused={setFocused} />
    </View>

    <View style={styles.fieldGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Contraseña</Text>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </View>
      <Field id="pass" icon="lock-outline" placeholder="••••••••"
             secure focused={focused} setFocused={setFocused} />
    </View>

    <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
      <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
      <MaterialCommunityIcons name="arrow-right" size={16} color={WHITE} />
    </TouchableOpacity>

    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>¿No tienes cuenta?</Text>
      <View style={styles.dividerLine} />
    </View>

    <TouchableOpacity style={styles.secondaryBtn} onPress={onRegister} activeOpacity={0.8}>
      <MaterialCommunityIcons name="account-plus-outline" size={16} color={ACCENT} />
      <Text style={styles.secondaryBtnText}>Crear una cuenta</Text>
    </TouchableOpacity>
  </View>
)

/* ─── REGISTER FORM ────────────────────────────────────────────── */
const RegisterForm = ({ focused, setFocused, onBack }: FormProps) => (
  <View>
    <View style={styles.iconWrap}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="account-plus-outline" size={26} color={ACCENT} />
      </View>
    </View>

    <Text style={styles.title}>Crear cuenta</Text>
    <Text style={styles.subtitle}>Completa los datos para registrarte</Text>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Correo electrónico</Text>
      <Field id="reg-email" icon="email-outline" placeholder="tu@correo.com"
             keyboard="email-address" focused={focused} setFocused={setFocused} />
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Contraseña</Text>
      <Field id="reg-pass" icon="lock-outline" placeholder="••••••••"
             secure focused={focused} setFocused={setFocused} />
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Confirmar contraseña</Text>
      <Field id="reg-confirm" icon="lock-check-outline" placeholder="••••••••"
             secure focused={focused} setFocused={setFocused} />
    </View>

    <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
      <Text style={styles.primaryBtnText}>Crear cuenta</Text>
      <MaterialCommunityIcons name="check" size={16} color={WHITE} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.backLink} onPress={onBack} activeOpacity={0.7}>
      <MaterialCommunityIcons name="arrow-left" size={14} color={MUTED_TXT} />
      <Text style={styles.backLinkText}>Volver a iniciar sesión</Text>
    </TouchableOpacity>
  </View>
)

/* ─── STYLES ───────────────────────────────────────────────────── */
export default LoginButton

const styles = StyleSheet.create({
  loginBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    gap: 7,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginLeft: 'auto',
  },
  loginBtnText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  overlay: {
    flex: 1,
    backgroundColor: OVERLAY_BG,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  kvWrap: {
    width: '100%',
    maxWidth: 390,
  },

  card: {
    backgroundColor: SURFACE,
    borderRadius: 20,
    padding: 28,
    paddingTop: 0,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 14,
  },
  accentBar: {
    height: 3,
    backgroundColor: ACCENT,
    marginHorizontal: -28,
    marginBottom: 28,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  iconWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(47,182,118,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(47,182,118,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: WHITE,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  subtitle: {
    color: MUTED_TXT,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 26,
    lineHeight: 18,
  },

  fieldGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  forgotText: {
    color: ACCENT,
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 8,
  },

  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: ACCENT,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryBtnText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  dividerText: {
    color: MUTED_TXT,
    fontSize: 12,
  },

  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(47,182,118,0.30)',
    height: 48,
    backgroundColor: 'rgba(47,182,118,0.06)',
  },
  secondaryBtnText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
  },

  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingVertical: 4,
  },
  backLinkText: {
    color: MUTED_TXT,
    fontSize: 13,
    fontWeight: '500',
  },
})