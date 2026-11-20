// Datos simulados del backend. Precios en pesos chilenos (CLP); todos los vuelos salen desde Santiago (SCL).

// REST: destinos con país y actividades populares.
export const DESTINOS = [
  {
    id: 'cusco',
    ciudad: 'Cusco',
    pais: 'Perú',
    region: 'Sudamérica',
    descripcion: 'Antigua capital inca y punto de partida hacia Machu Picchu y el Valle Sagrado.',
    actividades: ['Visita a Machu Picchu', 'Recorrido por el Valle Sagrado', 'Caminata a la Montaña de Colores', 'Barrio de San Blas'],
  },
  {
    id: 'buenos-aires',
    ciudad: 'Buenos Aires',
    pais: 'Argentina',
    region: 'Sudamérica',
    descripcion: 'Ciudad de cafés, teatros y tango, con barrios para recorrer a pie.',
    actividades: ['Show de tango en San Telmo', 'Caminito en La Boca', 'Teatro Colón', 'Feria de Mataderos'],
  },
  {
    id: 'rio-de-janeiro',
    ciudad: 'Río de Janeiro',
    pais: 'Brasil',
    region: 'Sudamérica',
    descripcion: 'Playas, morros y miradores entre el mar y la selva atlántica.',
    actividades: ['Cristo Redentor', 'Pan de Azúcar en teleférico', 'Playa de Copacabana', 'Escalera Selarón'],
  },
  {
    id: 'cancun',
    ciudad: 'Cancún',
    pais: 'México',
    region: 'Norteamérica',
    descripcion: 'Caribe mexicano con arrecifes, cenotes y ruinas mayas cercanas.',
    actividades: ['Snorkel en Isla Mujeres', 'Nado en cenotes', 'Chichén Itzá', 'Museo Subacuático MUSA'],
  },
  {
    id: 'nueva-york',
    ciudad: 'Nueva York',
    pais: 'Estados Unidos',
    region: 'Norteamérica',
    descripcion: 'Museos, musicales y barrios icónicos en una ciudad que no se detiene.',
    actividades: ['Central Park en bicicleta', 'Musical en Broadway', 'Museo Metropolitano de Arte', 'Puente de Brooklyn'],
  },
  {
    id: 'madrid',
    ciudad: 'Madrid',
    pais: 'España',
    region: 'Europa',
    descripcion: 'Capital de museos, plazas y tapas, con escapadas fáciles a Toledo y Segovia.',
    actividades: ['Museo del Prado', 'Parque del Retiro', 'Tapeo en La Latina', 'Excursión a Toledo'],
  },
  {
    id: 'roma',
    ciudad: 'Roma',
    pais: 'Italia',
    region: 'Europa',
    descripcion: 'Historia a cielo abierto: foros, basílicas y plazas barrocas.',
    actividades: ['Coliseo y Foro Romano', 'Museos Vaticanos', 'Fontana di Trevi', 'Trastevere al atardecer'],
  },
  {
    id: 'tokio',
    ciudad: 'Tokio',
    pais: 'Japón',
    region: 'Asia',
    descripcion: 'Templos tradicionales junto a barrios futuristas y una gastronomía única.',
    actividades: ['Templo Senso-ji en Asakusa', 'Cruce de Shibuya', 'Mercado de Tsukiji', 'Excursión al monte Fuji'],
  },
];

// GraphQL: vuelos por destino (fechas en formato ISO AAAA-MM-DD).
export const VUELOS = [
  { id: 'v-cus-1', destinoId: 'cusco', aerolinea: 'LATAM', numero: 'LA2401', fechaSalida: '2026-12-12', horaSalida: '06:40', horaLlegada: '10:55', duracion: '5 h 15 min', escalas: 1, precio: 289990, asientosDisponibles: 14 },
  { id: 'v-cus-2', destinoId: 'cusco', aerolinea: 'Sky Airline', numero: 'H2510', fechaSalida: '2026-12-19', horaSalida: '09:15', horaLlegada: '14:05', duracion: '5 h 50 min', escalas: 1, precio: 249990, asientosDisponibles: 3 },
  { id: 'v-bue-1', destinoId: 'buenos-aires', aerolinea: 'Aerolíneas Argentinas', numero: 'AR1281', fechaSalida: '2026-12-05', horaSalida: '07:30', horaLlegada: '10:35', duracion: '2 h 05 min', escalas: 0, precio: 159990, asientosDisponibles: 22 },
  { id: 'v-bue-2', destinoId: 'buenos-aires', aerolinea: 'JetSMART', numero: 'JA0870', fechaSalida: '2026-12-06', horaSalida: '18:10', horaLlegada: '21:15', duracion: '2 h 05 min', escalas: 0, precio: 119990, asientosDisponibles: 0 },
  { id: 'v-bue-3', destinoId: 'buenos-aires', aerolinea: 'LATAM', numero: 'LA0443', fechaSalida: '2026-12-13', horaSalida: '13:00', horaLlegada: '16:05', duracion: '2 h 05 min', escalas: 0, precio: 174990, asientosDisponibles: 9 },
  { id: 'v-rio-1', destinoId: 'rio-de-janeiro', aerolinea: 'LATAM', numero: 'LA0750', fechaSalida: '2027-01-08', horaSalida: '08:20', horaLlegada: '13:25', duracion: '4 h 05 min', escalas: 0, precio: 329990, asientosDisponibles: 11 },
  { id: 'v-rio-2', destinoId: 'rio-de-janeiro', aerolinea: 'GOL', numero: 'G37321', fechaSalida: '2027-01-10', horaSalida: '22:45', horaLlegada: '05:30', duracion: '5 h 45 min', escalas: 1, precio: 279990, asientosDisponibles: 6 },
  { id: 'v-cun-1', destinoId: 'cancun', aerolinea: 'Copa Airlines', numero: 'CM0186', fechaSalida: '2027-01-15', horaSalida: '05:55', horaLlegada: '15:40', duracion: '11 h 45 min', escalas: 1, precio: 689990, asientosDisponibles: 8 },
  { id: 'v-cun-2', destinoId: 'cancun', aerolinea: 'LATAM', numero: 'LA0612', fechaSalida: '2027-01-22', horaSalida: '00:35', horaLlegada: '08:10', duracion: '9 h 35 min', escalas: 0, precio: 749990, asientosDisponibles: 17 },
  { id: 'v-nyc-1', destinoId: 'nueva-york', aerolinea: 'LATAM', numero: 'LA0532', fechaSalida: '2027-02-03', horaSalida: '22:30', horaLlegada: '07:05', duracion: '10 h 35 min', escalas: 0, precio: 899990, asientosDisponibles: 12 },
  { id: 'v-nyc-2', destinoId: 'nueva-york', aerolinea: 'American Airlines', numero: 'AA0940', fechaSalida: '2027-02-05', horaSalida: '21:10', horaLlegada: '09:40', duracion: '14 h 30 min', escalas: 1, precio: 819990, asientosDisponibles: 4 },
  { id: 'v-mad-1', destinoId: 'madrid', aerolinea: 'Iberia', numero: 'IB6830', fechaSalida: '2027-03-02', horaSalida: '12:35', horaLlegada: '06:00', duracion: '13 h 25 min', escalas: 0, precio: 1049990, asientosDisponibles: 19 },
  { id: 'v-mad-2', destinoId: 'madrid', aerolinea: 'LATAM', numero: 'LA0704', fechaSalida: '2027-03-09', horaSalida: '13:50', horaLlegada: '07:25', duracion: '13 h 35 min', escalas: 0, precio: 989990, asientosDisponibles: 2 },
  { id: 'v-rom-1', destinoId: 'roma', aerolinea: 'ITA Airways', numero: 'AZ0681', fechaSalida: '2027-04-14', horaSalida: '18:05', horaLlegada: '14:45', duracion: '15 h 40 min', escalas: 1, precio: 1189990, asientosDisponibles: 10 },
  { id: 'v-tyo-1', destinoId: 'tokio', aerolinea: 'Qatar Airways', numero: 'QR0158', fechaSalida: '2027-04-01', horaSalida: '23:55', horaLlegada: '17:20', duracion: '32 h 25 min', escalas: 2, precio: 1649990, asientosDisponibles: 7 },
  { id: 'v-tyo-2', destinoId: 'tokio', aerolinea: 'Air Canada', numero: 'AC0093', fechaSalida: '2027-04-08', horaSalida: '21:40', horaLlegada: '15:30', duracion: '30 h 50 min', escalas: 1, precio: 1529990, asientosDisponibles: 0 },
];

// GraphQL: hoteles por destino. Roma no tiene hoteles cargados, para mostrar el estado vacío.
export const HOTELES = [
  { id: 'h-cus-1', destinoId: 'cusco', nombre: 'Casa Andina San Blas', estrellas: 3, barrio: 'San Blas', precioNoche: 58990, disponibleDesde: '2026-12-01', disponibleHasta: '2027-02-28', habitacionesDisponibles: 6, servicios: ['Desayuno', 'Wi-Fi', 'Oxígeno'] },
  { id: 'h-cus-2', destinoId: 'cusco', nombre: 'Palacio del Inka', estrellas: 5, barrio: 'Centro Histórico', precioNoche: 189990, disponibleDesde: '2026-12-10', disponibleHasta: '2027-03-31', habitacionesDisponibles: 2, servicios: ['Desayuno', 'Spa', 'Restaurante'] },
  { id: 'h-bue-1', destinoId: 'buenos-aires', nombre: 'Hotel Palermo Soho', estrellas: 4, barrio: 'Palermo', precioNoche: 79990, disponibleDesde: '2026-12-01', disponibleHasta: '2027-01-31', habitacionesDisponibles: 9, servicios: ['Desayuno', 'Wi-Fi', 'Piscina'] },
  { id: 'h-bue-2', destinoId: 'buenos-aires', nombre: 'Hostal San Telmo', estrellas: 2, barrio: 'San Telmo', precioNoche: 32990, disponibleDesde: '2026-11-25', disponibleHasta: '2027-02-28', habitacionesDisponibles: 0, servicios: ['Wi-Fi', 'Cocina compartida'] },
  { id: 'h-rio-1', destinoId: 'rio-de-janeiro', nombre: 'Copacabana Mar', estrellas: 4, barrio: 'Copacabana', precioNoche: 99990, disponibleDesde: '2027-01-01', disponibleHasta: '2027-03-15', habitacionesDisponibles: 5, servicios: ['Desayuno', 'Vista al mar', 'Piscina'] },
  { id: 'h-rio-2', destinoId: 'rio-de-janeiro', nombre: 'Pousada Santa Teresa', estrellas: 3, barrio: 'Santa Teresa', precioNoche: 64990, disponibleDesde: '2027-01-05', disponibleHasta: '2027-02-28', habitacionesDisponibles: 3, servicios: ['Desayuno', 'Wi-Fi'] },
  { id: 'h-cun-1', destinoId: 'cancun', nombre: 'Resort Laguna Azul', estrellas: 5, barrio: 'Zona Hotelera', precioNoche: 249990, disponibleDesde: '2027-01-10', disponibleHasta: '2027-04-30', habitacionesDisponibles: 7, servicios: ['Todo incluido', 'Playa privada', 'Spa'] },
  { id: 'h-cun-2', destinoId: 'cancun', nombre: 'Hotel Centro Cancún', estrellas: 3, barrio: 'Centro', precioNoche: 69990, disponibleDesde: '2027-01-01', disponibleHasta: '2027-03-31', habitacionesDisponibles: 12, servicios: ['Desayuno', 'Wi-Fi', 'Traslado a la playa'] },
  { id: 'h-nyc-1', destinoId: 'nueva-york', nombre: 'Midtown Suites', estrellas: 4, barrio: 'Midtown', precioNoche: 229990, disponibleDesde: '2027-01-15', disponibleHasta: '2027-03-15', habitacionesDisponibles: 4, servicios: ['Wi-Fi', 'Gimnasio'] },
  { id: 'h-mad-1', destinoId: 'madrid', nombre: 'Hotel Gran Vía', estrellas: 4, barrio: 'Centro', precioNoche: 119990, disponibleDesde: '2027-02-20', disponibleHasta: '2027-05-31', habitacionesDisponibles: 8, servicios: ['Desayuno', 'Wi-Fi', 'Terraza'] },
  { id: 'h-mad-2', destinoId: 'madrid', nombre: 'Hostal La Latina', estrellas: 2, barrio: 'La Latina', precioNoche: 45990, disponibleDesde: '2027-02-01', disponibleHasta: '2027-06-30', habitacionesDisponibles: 5, servicios: ['Wi-Fi'] },
  { id: 'h-tyo-1', destinoId: 'tokio', nombre: 'Shinjuku Business Hotel', estrellas: 3, barrio: 'Shinjuku', precioNoche: 94990, disponibleDesde: '2027-03-25', disponibleHasta: '2027-05-31', habitacionesDisponibles: 10, servicios: ['Wi-Fi', 'Lavandería'] },
  { id: 'h-tyo-2', destinoId: 'tokio', nombre: 'Ryokan Asakusa', estrellas: 4, barrio: 'Asakusa', precioNoche: 159990, disponibleDesde: '2027-03-28', disponibleHasta: '2027-04-30', habitacionesDisponibles: 1, servicios: ['Desayuno japonés', 'Onsen'] },
];
