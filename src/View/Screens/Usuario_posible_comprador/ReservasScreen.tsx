import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
} from 'react-native'
import LoginButton from '../../components/LoginButton'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

const COLORS = {
  primary: '#2fb676',
  primaryDark: '#239a61',
  primaryLight: '#e8f8f0',
  navy: '#0A0F1E',
  navyMid: '#1a2f5e',
  blue: '#1e4fd8',
  blueLight: '#2563eb',
  white: '#ffffff',
  gray: '#f4f6fb',
  grayMid: '#c8d0e0',
  grayText: '#6b7a99',
  dark: '#0a1628',
  cardBg: '#f0f4ff',
}

const MODELOS = [
  { id: '1', nombre: 'Voltus Neo Compact', precio: '$27,920', descuento: '-$6,980', base: '$34,900' },
  { id: '2', nombre: 'Voltus Neo Sport', precio: '$39,500', descuento: '-$4,500', base: '$44,000' },
  { id: '3', nombre: 'Voltus Neo SUV', precio: '$52,800', descuento: '-$7,200', base: '$60,000' },
]

const COLORES = [
  { id: '1', nombre: 'Deep Blue', hex: '#1e4fd8' },
  { id: '2', nombre: 'Midnight Black', hex: '#0a1628' },
  { id: '3', nombre: 'Pearl White', hex: '#f0f4ff', border: true },
  { id: '4', nombre: 'Voltus Green', hex: '#2fb676' },
  { id: '5', nombre: 'Silver Mist', hex: '#9ca3af' },
]

const COLOR_ITEM_WIDTH = (width - 80) / 5

// sombras reutilizadas
const shadowForm = {
  shadowColor: COLORS.navy,
  shadowOpacity: 0.08,
  shadowRadius: 20,
  elevation: 4,
}
const shadowColorDot = {
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 3,
}

interface FormData {
  nombre: string
  ci: string
  modelo: (typeof MODELOS)[0] | null
  color: (typeof COLORES)[0] | null
}

interface ReservaModalProps {
  visible: boolean
  form: FormData
  onClose: () => void
  onConfirm: () => void
}

function ReservaModal({ visible, form, onClose, onConfirm }: ReservaModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderBar} />
            <Text style={styles.modalTitle}>Confirmar Reserva</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>{'✕'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Car placeholder */}
            <View style={styles.carPlaceholder}>
              <Text style={styles.carEmoji}>{'🚗'}</Text>
              <Text style={styles.carPlaceholderLabel}>{'Imagen del vehículo'}</Text>
            </View>

            {/* Datos del cliente */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionLabel}>
                {'DATOS DEL CLIENTE'}
              </Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{'Nombre Completo'}</Text>
                <Text style={styles.infoValue}>
                  {form.nombre || '—'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{'Cédula de Identidad'}</Text>
                <Text style={styles.infoValue}>{form.ci || '—'}</Text>
              </View>
            </View>

            {/* Datos del vehículo */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionLabel}>
                {'VEHÍCULO SELECCIONADO'}
              </Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{'Modelo'}</Text>
                <Text style={styles.infoValue}>
                  {form.modelo?.nombre || '—'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{'Color'}</Text>
                <View style={styles.colorValueRow}>
                  {form.color && (
                    <View
                      style={[styles.colorDot, { backgroundColor: form.color.hex }]}
                    />
                  )}
                  <Text style={styles.infoValue}>
                    {form.color?.nombre || '—'}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{'Precio Base'}</Text>
                <Text style={styles.infoValue}>
                  {form.modelo?.base || '—'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{'Descuento'}</Text>
                <Text style={styles.infoValueGreen}>
                  {form.modelo?.descuento || '—'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.totalLabel}>{'Total'}</Text>
                <Text style={styles.totalValue}>
                  {form.modelo?.precio || '—'}
                </Text>
              </View>
            </View>

            {/* QR Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionLabel}>{'PAGO QR'}</Text>
              <View style={styles.qrCenter}>
                <View style={styles.qrBox}>
                  <View style={[styles.qrCornerBase, styles.qrCornerTL]} />
                  <View style={[styles.qrCornerBase, styles.qrCornerTR]} />
                  <View style={[styles.qrCornerBase, styles.qrCornerBL]} />
                  <View style={[styles.qrCornerBase, styles.qrCornerBR]} />
                  <Text style={styles.qrPlaceholderIcon}>{'⬛'}</Text>
                  <Text style={styles.qrText}>{'Código QR de Pago'}</Text>
                  <Text style={styles.qrSubtext}>{'Se añadirá próximamente'}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.refundNote}>
              {'✓ El precio de reserva es reembolsable'}
            </Text>

            {/* Botones */}
            <TouchableOpacity style={styles.primaryButton} onPress={onConfirm}>
              <Text style={styles.primaryButtonText}>{'EFECTUAR PAGO Y CONFIRMAR'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{'Cancelar'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

interface State {
  form: FormData
  modalVisible: boolean
  exitoVisible: boolean
  confirmacion: string
}

export class ReservasScreen extends Component<{}, State> {
  state: State = {
    form: { nombre: '', ci: '', modelo: null, color: null },
    modalVisible: false,
    exitoVisible: false,
    confirmacion: '',
  }

  handleReservar = () => {
    const { form } = this.state
    if (!form.nombre || !form.ci || !form.modelo || !form.color) return
    this.setState({ modalVisible: true })
  }

  handleConfirmar = () => {
    const codigo = 'VT-' + Math.floor(1000 + Math.random() * 9000) + '-ABC'
    this.setState({ modalVisible: false, exitoVisible: true, confirmacion: codigo })
  }

  render() {
    const { form, modalVisible, exitoVisible, confirmacion } = this.state
    const isFormValid = form.nombre && form.ci && form.modelo && form.color

    return (
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

        {/* Header */}
        <View style={styles.header}>
          <LoginButton onPress={() => {}} />
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>
                {'Reserva ahora,\nmaneja el futuro'}
              </Text>
              <Text style={styles.bannerSubtitle}>
                {'Garantiza tu lugar con\nsolo $1,000 USD'}
              </Text>
            </View>
            <View style={styles.bannerIconWrap}>
              <MaterialCommunityIcons name="car-sports" size={70} color={COLORS.primary} />
            </View>
          </View>

          {/* Formulario */}
          <View style={[styles.formCard, shadowForm]}>
            <Text style={styles.formSectionTitle}>
              {'Datos Personales'}
            </Text>

            <Text style={styles.inputLabel}>{'Nombre Completo'}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej. Juan Pérez Mamani"
              placeholderTextColor={COLORS.grayMid}
              value={form.nombre}
              onChangeText={v => this.setState({ form: { ...form, nombre: v } })}
            />

            <Text style={styles.inputLabel}>{'Cédula de Identidad'}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej. 12345678"
              placeholderTextColor={COLORS.grayMid}
              keyboardType="number-pad"
              value={form.ci}
              onChangeText={v => this.setState({ form: { ...form, ci: v } })}
            />

            <Text style={[styles.formSectionTitle, styles.formSectionTitleMt]}>
              {'Selecciona tu Modelo'}
            </Text>
            {MODELOS.map(m => {
              const selected = form.modelo?.id === m.id
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.modelOption,
                    selected ? styles.modelOptionSelected : styles.modelOptionUnselected,
                  ]}
                  onPress={() => this.setState({ form: { ...form, modelo: m } })}
                >
                  <View style={styles.modelEmojiWrap}>
                    <Text style={styles.modelEmoji}>{'🚙'}</Text>
                  </View>
                  <View style={styles.modelOptionInfo}>
                    <Text
                      style={[
                        styles.modelOptionName,
                        selected ? styles.modelOptionNameSelected : styles.modelOptionNameUnselected,
                      ]}
                    >
                      {m.nombre}
                    </Text>
                    <Text style={styles.modelBasePrice}>
                      {m.base}
                      <Text style={styles.modelDiscount}>{' ' + m.descuento}</Text>
                    </Text>
                    <Text style={styles.modelTotalPrice}>{'Total: ' + m.precio}</Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      selected ? styles.radioCircleSelected : styles.radioCircleUnselected,
                    ]}
                  >
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              )
            })}

            <Text style={[styles.formSectionTitle, styles.formSectionTitleMt]}>
              {'Elige tu Color'}
            </Text>
            <View style={styles.colorsWrap}>
              {COLORES.map(c => {
                const selected = form.color?.id === c.id
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.colorOption, { width: COLOR_ITEM_WIDTH }]}
                    onPress={() => this.setState({ form: { ...form, color: c } })}
                  >
                    <View
                      style={[
                        styles.colorDotCircle,
                        shadowColorDot,
                        { backgroundColor: c.hex },
                        c.border && styles.colorDotBorder,
                        selected && styles.colorDotSelected,
                      ]}
                    >
                      {selected && (
                        <Text
                          style={styles.colorCheckmark}
                          
                        >
                          {'✓'}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.colorLabel,
                        selected ? styles.colorLabelSelected : styles.colorLabelUnselected,
                      ]}
                    >
                      {c.nombre}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* Precio reserva */}
            <View style={styles.reservePriceRow}>
              <Text style={styles.reservePriceLabel}>{'💳  Precio de Reserva'}</Text>
              <Text style={styles.reservePriceValue}>{'$1,000 USD'}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isFormValid ? styles.submitButtonActive : styles.submitButtonDisabled,
              ]}
              onPress={this.handleReservar}
              disabled={!isFormValid}
            >
              <Text style={styles.primaryButtonText}>{'CONFIRMAR Y PAGAR RESERVA'}</Text>
            </TouchableOpacity>

            {!isFormValid && (
              <Text style={styles.helperText}>
                {'Completa todos los campos para continuar'}
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Modal de confirmación */}
        <ReservaModal
          visible={modalVisible}
          form={form}
          onClose={() => this.setState({ modalVisible: false })}
          onConfirm={this.handleConfirmar}
        />

        {/* Modal de éxito */}
        <Modal visible={exitoVisible} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.successSheet}>
              <View style={styles.successIconWrap}>
                <Text style={styles.successIconText}>{'✓'}</Text>
              </View>
              <Text style={styles.successTitle}>
                {'¡RESERVA EXITOSA!'}
              </Text>

              <View style={styles.successCarPlaceholder}>
                <Text style={styles.successCarEmoji}>{'🚗'}</Text>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Vehículo'}</Text>
                  <Text style={styles.infoValue}>
                    {form.modelo?.nombre}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Color'}</Text>
                  <Text style={styles.infoValue}>
                    {form.color?.nombre}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Costo Reserva'}</Text>
                  <Text style={styles.infoValue}>{'$1,000 USD'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Nº Confirmación'}</Text>
                  <Text style={styles.confirmationValue}>{confirmacion}</Text>
                </View>
              </View>

              <View style={styles.nextStepsBox}>
                <Text style={styles.nextStepsTitle}>{'Próximos Pasos'}</Text>
                <Text style={styles.nextStepsItem}>{'• Revisa tu correo para más detalles'}</Text>
                <Text style={styles.nextStepsItem}>{'• Un asesor de Voltus se pondrá en contacto'}</Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => this.setState({ exitoVisible: false, form: { nombre: '', ci: '', modelo: null, color: null } })}
              >
                <Text style={styles.primaryButtonText}>{'IR A INICIO'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  // Root / header / scroll
  root: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#0A0F1E',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 30,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },

  // Banner
  banner: {
    marginHorizontal: 16,
    marginBottom: 4,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: '#1a2f5e',
    padding: 20,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    color: '#fff',
  },
  bannerSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: '#2fb676',
  },
  bannerIconWrap: {
    height: 70,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Formulario
  formCard: {
    margin: 16,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 20,
  },
  formSectionTitle: {
    marginBottom: 14,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#0A0F1E',
  },
  formSectionTitleMt: {
    marginTop: 24,
  },
  inputLabel: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7a99',
  },
  textInput: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#c8d0e0',
    backgroundColor: '#f4f6fb',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0a1628',
  },

  // Modelo
  modelOption: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
  },
  modelOptionSelected: {
    borderColor: '#2fb676',
    backgroundColor: '#e8f8f0',
  },
  modelOptionUnselected: {
    borderColor: '#c8d0e0',
    backgroundColor: '#f0f4ff',
  },
  modelEmojiWrap: {
    height: 50,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelEmoji: {
    fontSize: 36,
  },
  modelOptionInfo: {
    flex: 1,
  },
  modelOptionName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modelOptionNameSelected: {
    color: '#2fb676',
  },
  modelOptionNameUnselected: {
    color: '#0A0F1E',
  },
  modelBasePrice: {
    marginTop: 2,
    fontSize: 12,
    color: '#6b7a99',
  },
  modelDiscount: {
    fontWeight: 'bold',
    color: '#2fb676',
  },
  modelTotalPrice: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '800',
    color: '#1e4fd8',
  },
  radioCircle: {
    height: 22,
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    borderWidth: 2,
  },
  radioCircleSelected: {
    borderColor: '#2fb676',
  },
  radioCircleUnselected: {
    borderColor: '#c8d0e0',
  },
  radioDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#2fb676',
  },

  // Colores
  colorsWrap: {
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    alignItems: 'center',
  },
  colorDotCircle: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  colorDotBorder: {
    borderWidth: 1.5,
    borderColor: '#c8d0e0',
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#2fb676',
  },
  colorCheckmark: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
  },
  colorLabel: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '500',
  },
  colorLabelSelected: {
    fontWeight: 'bold',
    color: '#2fb676',
  },
  colorLabelUnselected: {
    color: '#6b7a99',
  },

  // Precio reserva
  reservePriceRow: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: '#e8f8f0',
    padding: 14,
  },
  reservePriceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A0F1E',
  },
  reservePriceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2fb676',
  },

  submitButton: {
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
  },
  submitButtonActive: {
    backgroundColor: '#2fb676',
  },
  submitButtonDisabled: {
    backgroundColor: '#c8d0e0',
  },
  helperText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7a99',
  },

  // Modal compartido
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    maxHeight: '90%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalHeader: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalHeaderBar: {
    height: 24,
    width: 4,
    borderRadius: 2,
    backgroundColor: '#2fb676',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0A0F1E',
  },
  modalCloseButton: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#f4f6fb',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7a99',
  },

  carPlaceholder: {
    marginBottom: 16,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f4ff',
  },
  carEmoji: {
    fontSize: 48,
  },
  carPlaceholderLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7a99',
  },

  infoSection: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#f4f6fb',
    padding: 16,
  },
  sectionLabel: {
    marginBottom: 12,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#2fb676',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7a99',
  },
  infoValue: {
    maxWidth: '55%',
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#0A0F1E',
  },
  infoValueGreen: {
    maxWidth: '55%',
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#2fb676',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0A0F1E',
  },
  totalValue: {
    maxWidth: '55%',
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0F1E',
  },
  divider: {
    height: 1,
    backgroundColor: '#c8d0e0',
    opacity: 0.5,
  },
  colorValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    height: 14,
    width: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#c8d0e0',
  },

  qrCenter: {
    alignItems: 'center',
  },
  qrBox: {
    height: 160,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#c8d0e0',
    backgroundColor: '#fff',
  },
  qrCornerBase: {
    position: 'absolute',
    height: 20,
    width: 20,
    borderTopLeftRadius: 4,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: '#2fb676',
  },
  qrCornerTL: {
    left: 8,
    top: 8,
  },
  qrCornerTR: {
    right: 8,
    top: 8,
  },
  qrCornerBL: {
    bottom: 8,
    left: 8,
  },
  qrCornerBR: {
    bottom: 8,
    right: 8,
  },
  qrPlaceholderIcon: {
    fontSize: 36,
    opacity: 0.2,
  },
  qrText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7a99',
  },
  qrSubtext: {
    marginTop: 2,
    fontSize: 11,
    color: '#c8d0e0',
  },

  refundNote: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#2fb676',
  },

  primaryButton: {
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#2fb676',
    paddingVertical: 16,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#fff',
  },
  cancelButton: {
    marginBottom: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7a99',
  },

  // Modal de éxito
  successSheet: {
    maxHeight: '92%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#fff',
    padding: 24,
  },
  successIconWrap: {
    marginBottom: 12,
    height: 64,
    width: 64,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: '#2fb676',
  },
  successIconText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
  },
  successTitle: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#0A0F1E',
  },
  successCarPlaceholder: {
    marginBottom: 16,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f4ff',
  },
  successCarEmoji: {
    fontSize: 56,
  },
  confirmationValue: {
    maxWidth: '55%',
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2fb676',
  },
  nextStepsBox: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#e8f8f0',
    padding: 16,
  },
  nextStepsTitle: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '800',
    color: '#2fb676',
  },
  nextStepsItem: {
    marginBottom: 4,
    fontSize: 13,
    color: '#0A0F1E',
  },
})

export default ReservasScreen