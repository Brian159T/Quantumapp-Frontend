import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
} from 'react-native'
import React, { useMemo, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import LoginButton from '../../components/LoginButton'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

import { styles, GREEN, BLUE, ORANGE, RED, BG, WHITE, OFF_WHITE, SUBTLE, TEXT_DARK, TEXT_MID } from '../../../styles/EstacionesScreen_usuario_vehiculo.styles'
type ConnectorType = 'CCS' | 'CHAdeMO' | 'Tipo 2' | 'Tesla'

type Station = {
  id: string
  name: string
  address: string
  distanceKm: number
  available: number
  total: number
  pricePerKwh: string
  rating: number
  connectors: ConnectorType[]
  speed: 'Rápida' | 'Ultra rápida' | 'Estándar'
  open24h: boolean
}

const STATIONS: Station[] = [
  {
    id: '1',
    name: 'Voltus Hub San Miguel',
    address: 'Av. Ballivián #620, La Paz',
    distanceKm: 1.2,
    available: 4,
    total: 6,
    pricePerKwh: '$0.32',
    rating: 4.8,
    connectors: ['CCS', 'Tipo 2'],
    speed: 'Ultra rápida',
    open24h: true,
  },
  {
    id: '2',
    name: 'EcoCarga Obrajes',
    address: 'Calle 15 de Obrajes',
    distanceKm: 2.4,
    available: 0,
    total: 4,
    pricePerKwh: '$0.28',
    rating: 4.3,
    connectors: ['CHAdeMO', 'CCS'],
    speed: 'Rápida',
    open24h: false,
  },
  {
    id: '3',
    name: 'Voltus Station Sopocachi',
    address: 'Av. 20 de Octubre #2140',
    distanceKm: 3.1,
    available: 2,
    total: 2,
    pricePerKwh: '$0.30',
    rating: 4.6,
    connectors: ['Tipo 2', 'Tesla'],
    speed: 'Estándar',
    open24h: true,
  },
  {
    id: '4',
    name: 'GreenPlug Zona Sur',
    address: 'Av. Montenegro #480, Calacoto',
    distanceKm: 5.6,
    available: 3,
    total: 8,
    pricePerKwh: '$0.35',
    rating: 4.9,
    connectors: ['CCS', 'CHAdeMO', 'Tipo 2'],
    speed: 'Ultra rápida',
    open24h: true,
  },
  {
    id: '5',
    name: 'ElectroPunto Miraflores',
    address: 'Av. Saavedra #1780',
    distanceKm: 4.0,
    available: 1,
    total: 3,
    pricePerKwh: '$0.29',
    rating: 4.1,
    connectors: ['Tipo 2'],
    speed: 'Rápida',
    open24h: false,
  },
]

const FILTERS: { key: ConnectorType | 'Todos'; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: 'Todos', icon: 'lightning-bolt-circle' },
  { key: 'CCS', icon: 'ev-plug-ccs2' },
  { key: 'CHAdeMO', icon: 'ev-plug-chademo' },
  { key: 'Tipo 2', icon: 'ev-plug-type2' },
  { key: 'Tesla', icon: 'car-electric' },
]

const speedColor = (speed: Station['speed']) => {
  if (speed === 'Ultra rápida') return GREEN
  if (speed === 'Rápida') return BLUE
  return ORANGE
}

const EstacionesScreen_usuario_vehiculo = () => {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<ConnectorType | 'Todos'>('Todos')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const filteredStations = useMemo(() => {
    return STATIONS.filter(s => {
      const matchesSearch =
        search.trim().length === 0 ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = activeFilter === 'Todos' || s.connectors.includes(activeFilter)
      const matchesAvailability = !onlyAvailable || s.available > 0
      return matchesSearch && matchesFilter && matchesAvailability
    }).sort((a, b) => a.distanceKm - b.distanceKm)
  }, [search, activeFilter, onlyAvailable])

  const totalAvailable = STATIONS.reduce((acc, s) => acc + s.available, 0)
  const totalPorts = STATIONS.reduce((acc, s) => acc + s.total, 0)

  const renderStation = ({ item }: { item: Station }) => {
    const isFull = item.available === 0
    return (
      <View style={styles.stationCard}>
        <View style={styles.stationTopRow}>
          <View style={styles.stationIconBox}>
            <MaterialCommunityIcons name="ev-station" size={22} color={GREEN} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.stationName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.stationAddressRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={12} color={TEXT_MID} />
              <Text style={styles.stationAddress} numberOfLines={1}>{item.address}</Text>
            </View>
          </View>
          <View style={styles.stationDistanceBox}>
            <Text style={styles.stationDistanceValue}>{item.distanceKm.toFixed(1)}</Text>
            <Text style={styles.stationDistanceUnit}>{'km'}</Text>
          </View>
        </View>

        <View style={styles.stationInfoRow}>
          <View style={[styles.availabilityPill, isFull ? styles.availabilityPillRed : styles.availabilityPillGreen]}>
            <View style={[styles.dotStatus, { backgroundColor: isFull ? RED : GREEN }]} />
            <Text style={[styles.availabilityText, { color: isFull ? RED : GREEN }]}>
              {isFull ? 'Sin disponibilidad' : `${item.available}/${item.total} disponibles`}
            </Text>
          </View>

          <View style={styles.speedPill}>
            <MaterialCommunityIcons name="flash" size={11} color={speedColor(item.speed)} />
            <Text style={[styles.speedPillText, { color: speedColor(item.speed) }]}>{item.speed}</Text>
          </View>

          {item.open24h && (
            <View style={styles.openPill}>
              <Text style={styles.openPillText}>{'24h'}</Text>
            </View>
          )}
        </View>

        <View style={styles.connectorsRow}>
          {item.connectors.map(c => (
            <View key={c} style={styles.connectorTag}>
              <Text style={styles.connectorTagText}>{c}</Text>
            </View>
          ))}
        </View>

        <View style={styles.stationFooter}>
          <View style={styles.stationFooterLeft}>
            <MaterialCommunityIcons name="star" size={14} color={ORANGE} />
            <Text style={styles.stationRating}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.stationDivider}>{'·'}</Text>
            <Text style={styles.stationPrice}>{item.pricePerKwh}{' / kWh'}</Text>
          </View>

          <TouchableOpacity style={styles.routeBtn} activeOpacity={0.85}>
            <MaterialCommunityIcons name="map-marker-path" size={14} color={WHITE} />
            <Text style={styles.routeBtnText}>{'Ver ruta'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* ── HEADER FIJO ── */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSub}>{'ENCUENTRA TU'}</Text>
          <Text style={styles.headerTitle}>{'Carga Eléctrica'}</Text>
        </View>
        <LoginButton onPress={() => {}} />
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
              placeholder="Buscar por nombre o dirección..."
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

        {/* ── MAPA (placeholder, se integrará mapa interactivo con ruta) ── */}
        <View style={styles.mapPlaceholder}>
          <MaterialCommunityIcons name="map-outline" size={30} color={`${GREEN}` } />
          <Text style={styles.mapPlaceholderTitle}>{'Mapa interactivo'}</Text>
          <Text style={styles.mapPlaceholderSub}>{'Aquí se mostrará la ruta más corta a la estación seleccionada'}</Text>
        </View>

        {/* ── STATS RÁPIDOS ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: `${GREEN}18` }]}>
              <MaterialCommunityIcons name="ev-station" size={18} color={GREEN} />
            </View>
            <Text style={styles.statValue}>{STATIONS.length}</Text>
            <Text style={styles.statLabel}>{'Estaciones cerca'}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: `${BLUE}18` }]}>
              <MaterialCommunityIcons name="power-plug" size={18} color={BLUE} />
            </View>
            <Text style={styles.statValue}>{totalAvailable}{`/${totalPorts}`}</Text>
            <Text style={styles.statLabel}>{'Puntos libres'}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: `${ORANGE}18` }]}>
              <MaterialCommunityIcons name="clock-fast" size={18} color={ORANGE} />
            </View>
            <Text style={styles.statValue}>{'~8min'}</Text>
            <Text style={styles.statLabel}>{'Más cercana'}</Text>
          </View>
        </View>

        {/* ── FILTROS DE CONECTOR ── */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>{'Tipo de conector'}</Text>
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
            style={styles.availabilityToggle}
            onPress={() => setOnlyAvailable(!onlyAvailable)}
            activeOpacity={0.85}
          >
            <View style={[styles.checkbox, onlyAvailable && styles.checkboxActive]}>
              {onlyAvailable && <MaterialCommunityIcons name="check" size={12} color={WHITE} />}
            </View>
            <Text style={styles.availabilityToggleText}>{'Mostrar solo disponibles ahora'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── LISTA DE ESTACIONES ── */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{'Estaciones cercanas'}</Text>
            <Text style={styles.resultsCount}>{`${filteredStations.length} resultados`}</Text>
          </View>

          {filteredStations.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="ev-station" size={32} color={SUBTLE} />
              <Text style={styles.emptyStateText}>{'No encontramos estaciones con estos filtros'}</Text>
            </View>
          ) : (
            <FlatList
              data={filteredStations}
              keyExtractor={item => item.id}
              renderItem={renderStation}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 12 }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default EstacionesScreen_usuario_vehiculo

