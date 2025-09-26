import general from "./collections/general";
import sports from "./collections/sports";
import lol from "./collections/lol";

export default {
  translation: {
    general: {
      back: "Volver"
    },
    wordCollections: {
      general: "General",
      sports: "Deportes",
      lol: "League of Legends"
    },
    collections: {
      general,
      sports,
      lol
    },
    multiplayerSetup: {
      welcome: "¡Bienvenido al Impostor!",
      hostGame: "Hostear Juego Nuevo",
      existingGame: "O UNETE A UN JUEGO",
      joinGame: "Unirse a Juego",
      enterUsername: "Ingresa tu nombre de usuario",
      startHosting: "Empezar a Hostear",
      gameID: "Ingresa el ID del Juego"
    }
  }
};