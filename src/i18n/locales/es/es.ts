import general from "./collections/general";
import sports from "./collections/sports";
import lol from "./collections/lol";
import biblical from "./collections/biblical"

export default {
  translation: {
    general: {
      back: "Volver"
    },
    wordCollections: {
      general: "General",
      sports: "Deportes",
      lol: "League of Legends",
      biblical: "Biblico"
    },
    collections: {
      general,
      sports,
      lol,
      biblical
    },
    multiplayerSetup: {
      welcome: "¡Bienvenido al Impostor!",
      hostGame: "Hostear Juego Nuevo",
      existingGame: "O UNETE A UN JUEGO",
      joinGame: "Unirse a Juego",
      enterUsername: "Ingresa tu nombre de usuario",
      startHosting: "Empezar a Hostear",
      gameID: "Ingresa el ID del Juego"
    },
    gameSetup: {
      title: "Configuracion del Juego",
      link: "Link de Juego - Compartelo con amigos",
      selectCollection: "Selecciona una Coleccion",
      players: "Jugadores",
      roles: "Distribucion de roles",
      civilians: "Civiles",
      undercovers: "Encubiertos",
      mrWhites: "Impostores",
      alertPlayers: "Se necesitan 4 jugadores para empezar el juego",
      startGame: "Comenzar Juego",
    }
  }
};