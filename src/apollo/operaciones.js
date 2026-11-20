import { gql } from '@apollo/client';

// Fragmentos: cada componente declara los campos que necesita.
export const CAMPOS_VUELO = gql`
  fragment CamposVuelo on Vuelo {
    id
    aerolinea
    numero
    origen
    fechaSalida
    horaSalida
    horaLlegada
    duracion
    escalas
    precio
    asientosDisponibles
    disponible
  }
`;

export const CAMPOS_HOTEL = gql`
  fragment CamposHotel on Hotel {
    id
    nombre
    estrellas
    barrio
    precioNoche
    disponibleDesde
    disponibleHasta
    habitacionesDisponibles
    disponible
    servicios
  }
`;

// Una sola consulta trae vuelos y hoteles del destino (evita dos viajes al servidor).
export const OPCIONES_DE_VIAJE = gql`
  query OpcionesDeViaje($destinoId: ID!, $orden: Orden, $estrellasMinimas: Int) {
    vuelos(destinoId: $destinoId, orden: $orden) {
      ...CamposVuelo
    }
    hoteles(destinoId: $destinoId, estrellasMinimas: $estrellasMinimas) {
      ...CamposHotel
    }
  }
  ${CAMPOS_VUELO}
  ${CAMPOS_HOTEL}
`;

export const RESERVAR_VUELO = gql`
  mutation ReservarVuelo($id: ID!, $pasajeros: Int!) {
    reservarVuelo(id: $id, pasajeros: $pasajeros) {
      id
      asientosDisponibles
      disponible
    }
  }
`;

export const RESERVAR_HOTEL = gql`
  mutation ReservarHotel($id: ID!, $habitaciones: Int!) {
    reservarHotel(id: $id, habitaciones: $habitaciones) {
      id
      habitacionesDisponibles
      disponible
    }
  }
`;
