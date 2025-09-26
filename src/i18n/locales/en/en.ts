import general from "./collections/general";
import sports from "./collections/sports";
import lol from "./collections/lol";
import biblical from "./collections/biblical";

export default {
  translation: {
    general: {
      back: "Back"
    },
    wordCollections: {
      general: "General",
      sports: "Sports",
      lol: "League of Legends",
      biblical: "Biblical"
    },
    collections: {
      general,
      sports,
      lol,
      biblical
    },
    multiplayerSetup: {
      welcome: "Welcome to Undercover!",
      hostGame: "Host New Game",
      existingGame: "OR JOIN AN EXISTING GAME",
      joinGame: "Join Game",
      enterUsername: "Enter your username",
      startHosting: "Start Hosting",
      gameID: "Enter Game ID"
    },
    gameSetup: {
      title: "Game Setup",
      link: "Game Link - Share to friends",
      selectCollection: "Select Collection",
      players: "Players",
      roles: "Role Distribution",
      civilians: "Civilians",
      undercovers: "Undercovers",
      mrWhites: "Mr Whites",
      alertPlayers: "At least 4 players are required to start the game",
      startGame: "Start Game"
    }
  }
};