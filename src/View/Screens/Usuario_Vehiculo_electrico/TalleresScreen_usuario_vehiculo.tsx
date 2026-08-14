import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native'
import React, { useMemo, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import LogoutButton from '../../components/LogoutButton'
import { styles, GREEN, BLUE, ORANGE, RED, BG, WHITE, OFF_WHITE, SUBTLE, TEXT_DARK, TEXT_MID } from '../../../styles/TalleresScreen_usuario_vehiculo.styles'


type Specialty = 'Baterías' | 'Motor eléctrico' | 'Electrónica' | 'Carrocería' | 'Neumáticos'

type Workshop = {
  id: string
  name: string
  address: string
  distanceKm: number
  rating: number
  reviews: number
  certified: boolean
  specialties: Specialty[]
  openNow: boolean
  hours: string
  waitTime: string
}

const WORKSHOPS: Workshop[] = [
  {
    id: '1',
    name: 'Voltus Service Center',
    address: 'Av. Ballivián #745, La Paz',
    distanceKm: 1.8,
    rating: 4.9,
    reviews: 214,
    certified: true,
    specialties: ['Baterías', 'Electrónica'],
    openNow: true,
    hours: '08:00 - 19:00',
    waitTime: '~20 min',
  },
  {
    id: '2',
    name: 'ElectroMec Sopocachi',
    address: 'Av. 20 de Octubre #1890',
    distanceKm: 2.6,
    rating: 4.6,
    reviews: 132,
    certified: true,
    specialties: ['Motor eléctrico', 'Electrónica'],
    openNow: true,
    hours: '09:00 - 18:00',
    waitTime: '~45 min',
  },
  {
    id: '3',
    name: 'Taller GreenDrive',
    address: 'Calle 21, Calacoto',
    distanceKm: 4.3,
    rating: 4.4,
    reviews: 89,
    certified: false,
    specialties: ['Carrocería', 'Neumáticos'],
    openNow: false,
    hours: '08:30 - 17:30',
    waitTime: 'Cerrado',
  },
  {
    id: '4',
    name: 'PowerFix Obrajes',
    address: 'Calle 15 de Obrajes #340',
    distanceKm: 3.1,
    rating: 4.8,
    reviews: 176,
    certified: true,
    specialties: ['Baterías', 'Motor eléctrico', 'Neumáticos'],
    openNow: true,
    hours: '07:30 - 20:00',
    waitTime: '~15 min',
  },
  {
    id: '5',
    name: 'Taller Miraflores EV',
    address: 'Av. Saavedra #1590',
    distanceKm: 5.2,
    rating: 4.2,
    reviews: 54,
    certified: false,
    specialties: ['Carrocería'],
    openNow: true,
    hours: '09:00 - 18:30',
    waitTime: '~1 h',
  },
]

const FILTERS: { key: Specialty | 'Todos'; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: 'Todos', icon: 'wrench-outline' },
  { key: 'Baterías', icon: 'battery-charging-outline' },
  { key: 'Motor eléctrico', icon: 'engine-outline' },
  { key: 'Electrónica', icon: 'chip' },
  { key: 'Carrocería', icon: 'car-door' },
  { key: 'Neumáticos', icon: 'tire' },
]

const RepairServices = [
  { icon: 'battery-alert-variant-outline', label: 'Diagnóstico\nde batería', color: GREEN },
  { icon: 'engine-outline', label: 'Motor\neléctrico', color: BLUE },
  { icon: 'ev-plug-type2', label: 'Sistema de\ncarga', color: ORANGE },
  { icon: 'car-wrench', label: 'Mantenimiento\ngeneral', color: '#a78bfa' },
]

const TalleresScreen_usuario_vehiculo = () => {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<Specialty | 'Todos'>('Todos')
  const [onlyOpen, setOnlyOpen] = useState(false)

  const filteredWorkshops = useMemo(() => {
    return WORKSHOPS.filter(w => {
      const matchesSearch =
        search.trim().length === 0 ||
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.address.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = activeFilter === 'Todos' || w.specialties.includes(activeFilter)
      const matchesOpen = !onlyOpen || w.openNow
      return matchesSearch && matchesFilter && matchesOpen
    }).sort((a, b) => a.distanceKm - b.distanceKm)
  }, [search, activeFilter, onlyOpen])

  const certifiedCount = WORKSHOPS.filter(w => w.certified).length
  const openCount = WORKSHOPS.filter(w => w.openNow).length

  const renderWorkshop = ({ item }: { item: Workshop }) => (
    <View style={styles.workshopCard}>
      <View style={styles.workshopTopRow}>
        <View style={styles.workshopIconBox}>
          <MaterialCommunityIcons name="wrench" size={20} color={GREEN} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.workshopNameRow}>
            <Text style={styles.workshopName} numberOfLines={1}>{item.name}</Text>
            {item.certified && (
              <MaterialCommunityIcons name="check-decagram" size={14} color={BLUE} />
            )}
          </View>
          <View style={styles.workshopAddressRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={12} color={TEXT_MID} />
            <Text style={styles.workshopAddress} numberOfLines={1}>{item.address}</Text>
          </View>
        </View>
        <View style={styles.workshopDistanceBox}>
          <Text style={styles.workshopDistanceValue}>{item.distanceKm.toFixed(1)}</Text>
          <Text style={styles.workshopDistanceUnit}>{'km'}</Text>
        </View>
      </View>

      <View style={styles.workshopInfoRow}>
        <View style={[styles.statusPill, item.openNow ? styles.statusPillGreen : styles.statusPillRed]}>
          <View style={[styles.dotStatus, { backgroundColor: item.openNow ? GREEN : RED }]} />
          <Text style={[styles.statusText, { color: item.openNow ? GREEN : RED }]}>
            {item.openNow ? `Abierto · ${item.hours}` : 'Cerrado ahora'}
          </Text>
        </View>

        {item.openNow && (
          <View style={styles.waitPill}>
            <MaterialCommunityIcons name="clock-outline" size={11} color={ORANGE} />
            <Text style={styles.waitPillText}>{item.waitTime}</Text>
          </View>
        )}
      </View>

      <View style={styles.specialtiesRow}>
        {item.specialties.map(s => (
          <View key={s} style={styles.specialtyTag}>
            <Text style={styles.specialtyTagText}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={styles.workshopFooter}>
        <View style={styles.workshopFooterLeft}>
          <MaterialCommunityIcons name="star" size={14} color={ORANGE} />
          <Text style={styles.workshopRating}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.workshopDivider}>{'·'}</Text>
          <Text style={styles.workshopReviews}>{`${item.reviews} reseñas`}</Text>
        </View>

        <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.85}>
          <MaterialCommunityIcons name="calendar-clock-outline" size={13} color={WHITE} />
          <Text style={styles.appointmentBtnText}>{'Agendar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* ── HEADER FIJO ── */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSub}>{'SOPORTE TÉCNICO'}</Text>
          <Text style={styles.headerTitle}>{'Talleres Autorizados'}</Text>
        </View>
        <LogoutButton />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── BUSCADOR ── */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={18} color={TEXT_MID} />
            <TextInput
              placeholder="Buscar taller o dirección..."
              placeholderTextColor={TEXT_MID}
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.locationBtn}>
              <MaterialCommunityIcons name="crosshairs-gps" size={16} color={WHITE} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── BANNER: ASISTENCIA DE EMERGENCIA ── */}
        <View style={styles.emergencyBanner}>
          <View style={styles.emergencyIconBox}>
            <MaterialCommunityIcons name="tow-truck" size={26} color={RED} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>{'¿Necesitas asistencia urgente?'}</Text>
            <Text style={styles.emergencySub}>{'Grúa y soporte en carretera 24/7'}</Text>
          </View>
          <TouchableOpacity style={styles.emergencyBtn} activeOpacity={0.85}>
            <Text style={styles.emergencyBtnText}>{'Llamar'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── STATS RÁPIDOS ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: `${GREEN}18` }]}>
              <MaterialCommunityIcons name="wrench-outline" size={18} color={GREEN} />
            </View>
            <Text style={styles.statValue}>{WORKSHOPS.length}</Text>
            <Text style={styles.statLabel}>{'Talleres cerca'}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: `${BLUE}18` }]}>
              <MaterialCommunityIcons name="check-decagram" size={18} color={BLUE} />
            </View>
            <Text style={styles.statValue}>{certifiedCount}</Text>
            <Text style={styles.statLabel}>{'Certificados'}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: `${ORANGE}18` }]}>
              <MaterialCommunityIcons name="clock-check-outline" size={18} color={ORANGE} />
            </View>
            <Text style={styles.statValue}>{openCount}</Text>
            <Text style={styles.statLabel}>{'Abiertos ahora'}</Text>
          </View>
        </View>

        {/* ── SERVICIOS FRECUENTES ── */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>{'Servicios frecuentes'}</Text>
          <View style={styles.servicesRow}>
            {RepairServices.map((s, i) => (
              <TouchableOpacity key={i} style={styles.serviceItem} activeOpacity={0.85}>
                <View style={[styles.serviceIconBox, { backgroundColor: `${s.color}18` }]}>
                  <MaterialCommunityIcons name={s.icon as any} size={20} color={s.color} />
                </View>
                <Text style={styles.serviceLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── FILTROS DE ESPECIALIDAD ── */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>{'Especialidad'}</Text>
          <View style={styles.filterRow}>
            {FILTERS.map(f => {
              const active = activeFilter === f.key
              return (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setActiveFilter(f.key)}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons
                    name={f.icon}
                    size={14}
                    color={active ? WHITE : TEXT_MID}
                  />
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {f.key}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <TouchableOpacity
            style={styles.openToggle}
            onPress={() => setOnlyOpen(!onlyOpen)}
            activeOpacity={0.85}
          >
            <View style={[styles.checkbox, onlyOpen && styles.checkboxActive]}>
              {onlyOpen && <MaterialCommunityIcons name="check" size={12} color={WHITE} />}
            </View>
            <Text style={styles.openToggleText}>{'Mostrar solo talleres abiertos'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── LISTA DE TALLERES ── */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{'Talleres cercanos'}</Text>
            <Text style={styles.resultsCount}>{`${filteredWorkshops.length} resultados`}</Text>
          </View>

          {filteredWorkshops.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="wrench-outline" size={32} color={SUBTLE} />
              <Text style={styles.emptyStateText}>{'No encontramos talleres con estos filtros'}</Text>
            </View>
          ) : (
            <FlatList
              data={filteredWorkshops}
              keyExtractor={item => item.id}
              renderItem={renderWorkshop}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 12 }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default TalleresScreen_usuario_vehiculo

