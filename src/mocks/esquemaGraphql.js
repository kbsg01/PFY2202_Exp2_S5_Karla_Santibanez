import { buildSchema, graphql } from 'graphql';
import { DESTINOS, HOTELES, VUELOS } from './datos.js';

// Esquema del backend GraphQL simulado. Se ejecuta con la librería graphql real,
// por lo que el cliente recibe solo los campos que pide y los errores llegan en el campo `errors`.
export const esquema = buildSchema(`
  enum Orden {
    PRECIO_ASC
    PRECIO_DESC
  }

  type Vuelo {
    id: ID!
    destinoId: ID!
    aerolinea: String!
    numero: String!
    origen: String!
    fechaSalida: String!
    horaSalida: String!
    horaLlegada: String!
    duracion: String!
    escalas: Int!
    precio: Int!
    asientosDisponibles: Int!
    disponible: Boolean!
  }

  type Hotel {
    id: ID!
    destinoId: ID!
    nombre: String!
    estrellas: Int!
    barrio: String!
    precioNoche: Int!
    disponibleDesde: String!
    disponibleHasta: String!
    habitacionesDisponibles: Int!
    disponible: Boolean!
    servicios: [String!]!
  }

  type Query {
    vuelos(destinoId: ID!, orden: Orden = PRECIO_ASC): [Vuelo!]!
    hoteles(destinoId: ID!, estrellasMinimas: Int = 1): [Hotel!]!
    vuelo(id: ID!): Vuelo
    hotel(id: ID!): Hotel
  }

  type Mutation {
    reservarVuelo(id: ID!, pasajeros: Int!): Vuelo!
    reservarHotel(id: ID!, habitaciones: Int!): Hotel!
  }
`);

// Copias mutables: las reservas descuentan cupos mientras la página esté abierta.
export function crearBaseDatos() {
  return {
    vuelos: VUELOS.map((v) => ({ ...v })),
    hoteles: HOTELES.map((h) => ({ ...h, servicios: [...h.servicios] })),
  };
}

const existeDestino = (id) => DESTINOS.some((d) => d.id === id);

const conVuelo = (v) => ({ ...v, origen: 'Santiago (SCL)', disponible: v.asientosDisponibles > 0 });
const conHotel = (h) => ({ ...h, disponible: h.habitacionesDisponibles > 0 });

// Resolvers de la raíz (rootValue). Lanzar un Error lo convierte en una entrada de `errors`.
export function crearResolvers(db) {
  return {
    vuelos: ({ destinoId, orden }) => {
      if (!existeDestino(destinoId)) throw new Error(`El destino "${destinoId}" no existe.`);
      const signo = orden === 'PRECIO_DESC' ? -1 : 1;
      return db.vuelos
        .filter((v) => v.destinoId === destinoId)
        .sort((a, b) => signo * (a.precio - b.precio))
        .map(conVuelo);
    },
    hoteles: ({ destinoId, estrellasMinimas }) => {
      if (!existeDestino(destinoId)) throw new Error(`El destino "${destinoId}" no existe.`);
      return db.hoteles
        .filter((h) => h.destinoId === destinoId && h.estrellas >= estrellasMinimas)
        .sort((a, b) => a.precioNoche - b.precioNoche)
        .map(conHotel);
    },
    vuelo: ({ id }) => {
      const v = db.vuelos.find((x) => x.id === id);
      return v ? conVuelo(v) : null;
    },
    hotel: ({ id }) => {
      const h = db.hoteles.find((x) => x.id === id);
      return h ? conHotel(h) : null;
    },
    reservarVuelo: ({ id, pasajeros }) => {
      const v = db.vuelos.find((x) => x.id === id);
      if (!v) throw new Error('El vuelo no existe.');
      if (!Number.isInteger(pasajeros) || pasajeros < 1 || pasajeros > 9) throw new Error('La cantidad de pasajeros debe estar entre 1 y 9.');
      if (v.asientosDisponibles < pasajeros) throw new Error(`Solo quedan ${v.asientosDisponibles} asientos en el vuelo ${v.numero}.`);
      v.asientosDisponibles -= pasajeros;
      return conVuelo(v);
    },
    reservarHotel: ({ id, habitaciones }) => {
      const h = db.hoteles.find((x) => x.id === id);
      if (!h) throw new Error('El hotel no existe.');
      if (!Number.isInteger(habitaciones) || habitaciones < 1 || habitaciones > 5) throw new Error('La cantidad de habitaciones debe estar entre 1 y 5.');
      if (h.habitacionesDisponibles < habitaciones) throw new Error(`Solo quedan ${h.habitacionesDisponibles} habitaciones en ${h.nombre}.`);
      h.habitacionesDisponibles -= habitaciones;
      return conHotel(h);
    },
  };
}

// Ejecuta una operación GraphQL contra el esquema.
export function ejecutarGraphql(db, { query, variables, operationName }) {
  return graphql({
    schema: esquema,
    source: query,
    rootValue: crearResolvers(db),
    variableValues: variables,
    operationName,
  });
}
