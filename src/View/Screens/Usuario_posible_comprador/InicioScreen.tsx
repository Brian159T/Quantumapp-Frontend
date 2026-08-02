import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import LoginButton from '../../components/LoginButton'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.62
const CARD_GAP = 12
const CARD_SIDE_PADDING = 20

const GREEN = '#2fb676'
const BLUE = '#4D9FFF'
const BG = '#0A0F1E'
const WHITE = '#ffffff'
const SUBTLE = '#e8edf8'
const TEXT_DARK = '#0d1b3e'
const TEXT_MID = '#4a5578'

const PLACEHOLDER_HERO = 'https://placehold.co/700x320/0f3460/FFFFFF?text=+'

const CAR_MODELS = [
  {
    id: '1',
    name: 'Voltus Neo',
    type: 'Compact',
    price: '$34,900',
    range: '420 km',
    charge: '6 meses gratis',
    badge: '#1 Más vendido',
    badgeGreen: true,
    image: 'https://placehold.co/400x220/0f2a1e/2fb676?text=Neo',
  },
  {
    id: '2',
    name: 'Voltus Terra',
    type: 'SUV',
    price: '$47,500',
    range: '510 km',
    charge: 'AWD incluido',
    badge: '#2 Popular',
    badgeGreen: false,
    image: 'https://placehold.co/400x220/0f1f3d/4D9FFF?text=Terra',
  },
  {
    id: '3',
    name: 'Voltus Arc',
    type: 'Sedán',
    price: '$39,200',
    range: '480 km',
    charge: 'Sunroof incluido',
    badge: 'Nuevo 2024',
    badgeGreen: true,
    image: 'https://placehold.co/400x220/1a1a2e/2fb676?text=Arc',
  },
  {
    id: '4',
    name: 'Voltus Crest',
    type: 'Pickup',
    price: '$58,000',
    range: '390 km',
    charge: 'Carga rápida DC',
    badge: 'Edición limitada',
    badgeGreen: false,
    image: 'https://placehold.co/400x220/1a0f2e/9b59b6?text=Crest',
  },
  {
    id: '5',
    name: 'Voltus Zen',
    type: 'Hatchback',
    price: '$28,400',
    range: '360 km',
    charge: 'Seguro 1 año',
    badge: 'Más accesible',
    badgeGreen: true,
    image: 'https://placehold.co/400x220/0f2a2a/2fb676?text=Zen',
  },
  {
    id: '6',
    name: 'Voltus Apex',
    type: 'Coupé',
    price: '$64,900',
    range: '550 km',
    charge: '0-100 en 3.2s',
    badge: 'Performance',
    badgeGreen: false,
    image: 'https://placehold.co/400x220/2a0f0f/e74c3c?text=Apex',
  },
  {
    id: '7',
    name: 'Voltus Drift',
    type: 'Sport',
    price: '$72,000',
    range: '500 km',
    charge: 'Modo pista',
    badge: 'Top velocidad',
    badgeGreen: false,
    image: 'https://placehold.co/400x220/1a1000/f39c12?text=Drift',
  },
  {
    id: '8',
    name: 'Voltus Nova',
    type: 'Crossover',
    price: '$43,500',
    range: '465 km',
    charge: 'Techo solar',
    badge: 'Familia ideal',
    badgeGreen: true,
    image: 'https://placehold.co/400x220/0f1a2a/2fb676?text=Nova',
  },
  {
    id: '9',
    name: 'Voltus Orion',
    type: 'SUV Grande',
    price: '$55,800',
    range: '430 km',
    charge: '7 pasajeros',
    badge: 'Más espacioso',
    badgeGreen: true,
    image: 'https://placehold.co/400x220/0a1628/4D9FFF?text=Orion',
  },
  {
    id: '10',
    name: 'Voltus Lux',
    type: 'Luxury',
    price: '$89,000',
    range: '580 km',
    charge: 'Premium total',
    badge: 'Exclusivo',
    badgeGreen: false,
    image: 'https://placehold.co/400x220/1a1500/f1c40f?text=Lux',
  },
  {
    id: '11',
    name: 'Voltus Scout',
    type: 'Off-road',
    price: '$51,200',
    range: '410 km',
    charge: '4x4 eléctrico',
    badge: 'Aventura',
    badgeGreen: true,
    image: 'https://placehold.co/400x220/0f2010/2fb676?text=Scout',
  },
  {
    id: '12',
    name: 'Voltus Mini',
    type: 'City Car',
    price: '$22,900',
    range: '300 km',
    charge: 'Ideal ciudad',
    badge: 'Más económico',
    badgeGreen: true,
    image: 'https://placehold.co/400x220/101a0f/2fb676?text=Mini',
  },
]

// sombras reutilizadas
const shadowSm = {
  shadowColor: '#0d1b3e',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
}
const shadowMd = {
  shadowColor: '#0d1b3e',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
}
const shadowDark = {
  shadowColor: '#000',
  shadowOpacity: 0.18,
  shadowRadius: 16,
  elevation: 6,
}
const shadowDarkStrong = {
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 14,
  elevation: 5,
}

const InicioScreen = () => {
  const flatListRef = useRef<FlatList>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % CAR_MODELS.length
        flatListRef.current?.scrollToIndex({ index: next, animated: true })
        return next
      })
    }, 3000)
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    }
  }, [])

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP))
    setActiveIndex(index)
    if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    autoScrollRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % CAR_MODELS.length
        flatListRef.current?.scrollToIndex({ index: next, animated: true })
        return next
      })
    }, 3000)
  }

  const renderCarCard = ({ item }: { item: typeof CAR_MODELS[0] }) => (
    <View style={[styles.card, { width: CARD_WIDTH }, shadowMd]}>
      <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
      <View
        style={[
          styles.badge,
          {
            backgroundColor: item.badgeGreen ? `${GREEN}26` : `${BLUE}26`,
            borderColor: item.badgeGreen ? `${GREEN}66` : `${BLUE}66`,
          },
        ]}
      >
        <Text style={[styles.badgeText, { color: item.badgeGreen ? GREEN : BLUE }]}>
          {item.badge}
        </Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardType}>{item.type}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="lightning-bolt" size={13} color={GREEN} />
            <Text style={styles.infoText}>{item.range}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="ev-plug-type2" size={13} color={BLUE} />
            <Text style={styles.infoText}>{item.charge}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            {item.price}
            <Text style={styles.priceUsd}>{' USD'}</Text>
          </Text>
          <TouchableOpacity style={styles.verButton}>
            <Text style={styles.verButtonText}>{'Ver'}</Text>
            <MaterialCommunityIcons name="arrow-right" size={12} color={WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    // ✅ root es un View normal (no SafeAreaView) para poder poner el header fijo
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* ── HEADER FIJO — fuera del ScrollView ── */}
      <View style={styles.header}>
        <LoginButton onPress={() => {}} />
      </View>

      {/* ── SCROLL — todo el contenido aquí dentro ── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── HERO BANNER ── */}
        <View style={[styles.hero, shadowDark]}>
          <Image source={{ uri: PLACEHOLDER_HERO }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <View
              style={[styles.offerBadge, { backgroundColor: `${GREEN}33`, borderColor: `${GREEN}66` }]}
            >
              <MaterialCommunityIcons name="fire" size={12} color={GREEN} />
              <Text style={styles.offerBadgeText}>
                {' Oferta del mes'}
              </Text>
            </View>
            <View style={styles.heroBottom}>
              <Text style={styles.heroTitle}>
                {'Hasta 20% OFF\n'}
                <Text style={styles.heroTitleAccent}>{'Neo 2024'}</Text>
              </Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>{'Ver Modelos'}</Text>
                <MaterialCommunityIcons name="arrow-right" size={12} color={WHITE} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── STATS RÁPIDOS ── */}
        <View style={styles.statsRow}>
          {[
            { icon: 'lightning-bolt', value: '420km', label: 'Autonomía', color: GREEN },
            { icon: 'ev-station', value: '45min', label: 'Carga rápida', color: BLUE },
            { icon: 'shield-check', value: '5★', label: 'Seguridad', color: '#a78bfa' },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, shadowSm]}>
              <View style={[styles.statIconWrap, { backgroundColor: `${s.color}18` }]}>
                <MaterialCommunityIcons name={s.icon as any} size={18} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── MODELOS EN CARRUSEL ── */}
        <View style={styles.modelsSection}>
          <View style={[styles.modelsHeader, { paddingHorizontal: CARD_SIDE_PADDING }]}>
            <Text style={styles.sectionTitle}>{'Modelos Destacados'}</Text>
            <TouchableOpacity style={styles.verTodosButton}>
              <Text style={styles.verTodosText}>{'Ver todos'}</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={GREEN} />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={CAR_MODELS}
            keyExtractor={item => item.id}
            renderItem={renderCarCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_GAP}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{
              paddingLeft: CARD_SIDE_PADDING,
              paddingRight: CARD_SIDE_PADDING - CARD_GAP,
              gap: CARD_GAP,
            }}
            onMomentumScrollEnd={onScrollEnd}
            getItemLayout={(_, index) => ({
              length: CARD_WIDTH + CARD_GAP,
              offset: (CARD_WIDTH + CARD_GAP) * index,
              index,
            })}
          />

          {/* Dots */}
          <View style={styles.dotsRow}>
            {CAR_MODELS.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({ index: i, animated: true })
                  setActiveIndex(i)
                }}
              >
                <View
                  style={[
                    styles.dot,
                    i === activeIndex ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── PLANES DE PAGO ── */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>{'Planes de Pago Flexibles'}</Text>

          <View style={styles.plansRow}>
            {/* Crédito */}
            <View style={[styles.planCardBlue, shadowSm]}>
              <View style={styles.planIconBlue}>
                <MaterialCommunityIcons name="bank-outline" size={22} color={BLUE} />
              </View>
              <Text style={styles.planLabel}>
                {'Crédito Automotriz'}
              </Text>
              <Text style={styles.planPrice}>
                {'Desde\n'}
                <Text style={{ color: BLUE }}>{'$499'}</Text>
                <Text style={styles.planPriceUnit}>{' USD/mes*'}</Text>
              </Text>
              <View style={styles.planFeatures}>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="check-circle" size={12} color={BLUE} />
                  <Text style={styles.featureText}>{'Plazos hasta 72 meses'}</Text>
                </View>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="check-circle" size={12} color={BLUE} />
                  <Text style={styles.featureText}>{'Tasa preferencial'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.creditButton}>
                <Text style={styles.creditButtonText}>{'Cotizar Ahora'}</Text>
              </TouchableOpacity>
            </View>

            {/* Leasing */}
            <View style={[styles.planCardGreen, shadowSm]}>
              <View style={styles.planIconGreen}>
                <MaterialCommunityIcons name="car-key" size={22} color={GREEN} />
              </View>
              <Text style={styles.planLabel}>
                {'Arrendamiento'}
              </Text>
              <Text style={styles.planPrice}>
                {'Desde\n'}
                <Text style={{ color: GREEN }}>{'$399'}</Text>
                <Text style={styles.planPriceUnit}>{' USD/mes*'}</Text>
              </Text>
              <View style={styles.planFeatures}>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="check-circle" size={12} color={GREEN} />
                  <Text style={styles.featureText}>{'Actualiza cada 3 años'}</Text>
                </View>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="check-circle" size={12} color={GREEN} />
                  <Text style={styles.featureText}>{'Mantenimiento incluido'}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.leasingButton, { backgroundColor: `${GREEN}15`, borderColor: `${GREEN}55` }]}
              >
                <Text style={styles.leasingButtonText}>{'Más Información'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── BANNER: TEST DRIVE ── */}
        <View style={[styles.testDriveBanner, shadowDarkStrong]}>
          <View style={styles.testDriveLeft}>
            <Text style={styles.testDriveEyebrow}>
              {'Experiencia real'}
            </Text>
            <Text style={styles.testDriveTitle}>{'Agenda tu\nTest Drive'}</Text>
            <Text style={styles.testDriveSubtitle}>{'Gratis · Sin compromiso'}</Text>
            <TouchableOpacity style={styles.testDriveButton}>
              <MaterialCommunityIcons name="calendar-check-outline" size={13} color={WHITE} />
              <Text style={styles.testDriveButtonText}>{' Reservar'}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[styles.testDriveIconWrap, { backgroundColor: `${GREEN}20`, borderColor: `${GREEN}44` }]}
          >
            <MaterialCommunityIcons name="car-electric" size={44} color={GREEN} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
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
    backgroundColor: '#f4f7ff',
  },

  // Card
  card: {
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8edf8',
    backgroundColor: '#fff',
  },
  cardImage: {
    height: 148,
    width: '100%',
  },
  badge: {
    position: 'absolute',
    left: 12,
    top: 12,
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 14,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d1b3e',
  },
  cardType: {
    marginBottom: 10,
    marginTop: 2,
    fontSize: 11,
    color: '#4a5578',
  },
  infoRow: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    backgroundColor: '#f4f7ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    flexShrink: 1,
    fontSize: 10,
    color: '#4a5578',
  },
  divider: {
    height: 16,
    width: 1,
    backgroundColor: '#e8edf8',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d1b3e',
  },
  priceUsd: {
    fontSize: 11,
    fontWeight: 'normal',
    color: '#4a5578',
  },
  verButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 10,
    backgroundColor: '#0A0F1E',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  verButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Hero
  hero: {
    marginHorizontal: 16,
    marginTop: 12,
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#1A2744',
  },
  heroImage: {
    height: 130,
    width: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 14,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  offerBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#2fb676',
  },
  heroBottom: {
    alignSelf: 'flex-start',
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 20,
    color: '#fff',
  },
  heroTitleAccent: {
    color: '#2fb676',
  },
  heroButton: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderRadius: 10,
    backgroundColor: '#0A0F1E',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  heroButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: '#fff',
  },

  // Stats
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 14,
  },
  statIconWrap: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d1b3e',
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '500',
    color: '#4a5578',
  },

  // Modelos
  modelsSection: {
    marginTop: 24,
  },
  modelsHeader: {
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d1b3e',
  },
  verTodosButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verTodosText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2fb676',
  },
  dotsRow: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 20,
  },
  dot: {
    marginVertical: 2,
    height: 5,
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
    backgroundColor: '#2fb676',
  },
  dotInactive: {
    width: 5,
    backgroundColor: '#c8d0e0',
  },

  // Planes
  plansSection: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  plansRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  planCardBlue: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    backgroundColor: '#fff',
    padding: 16,
  },
  planCardGreen: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    backgroundColor: '#fff',
    padding: 16,
  },
  planIconBlue: {
    marginBottom: 12,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#dbeafe',
  },
  planIconGreen: {
    marginBottom: 12,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#d1fae5',
  },
  planLabel: {
    marginBottom: 4,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#4a5578',
  },
  planPrice: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    color: '#0d1b3e',
  },
  planPriceUnit: {
    fontSize: 11,
    fontWeight: 'normal',
    color: '#4a5578',
  },
  planFeatures: {
    marginBottom: 16,
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 10,
    color: '#4a5578',
  },
  creditButton: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#4D9FFF',
    paddingVertical: 10,
  },
  creditButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  leasingButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
  },
  leasingButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2fb676',
  },

  // Test drive
  testDriveBanner: {
    marginHorizontal: 16,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    backgroundColor: '#0A0F1E',
    padding: 20,
  },
  testDriveLeft: {
    flex: 1,
    paddingRight: 16,
  },
  testDriveEyebrow: {
    marginBottom: 4,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#2fb676',
  },
  testDriveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    color: '#fff',
  },
  testDriveSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  testDriveButton: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    backgroundColor: '#2fb676',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  testDriveButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  testDriveIconWrap: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
  },
})

export default InicioScreen