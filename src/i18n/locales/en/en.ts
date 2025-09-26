import general from "./collections/general";
import sports from "./collections/sports";
import lol from "./collections/lol";

export default {
  translation: {
    general: {
      back: "Back"
    },
    wordCollections: {
      general: "General",
      sports: "Sports",
      lol: "League of Legends"
    },
    collections: {
      general,
      sports,
      lol
    },
    multiplayerSetup: {
      welcome: "Welcome to Undercover!",
      hostGame: "Host New Game",
      existingGame: "OR JOIN AN EXISTING GAME",
      joinGame: "Join Game",
      enterUsername: "Enter your username",
      startHosting: "Start Hosting",
      gameID: "Enter Game ID"
    }
  }
};