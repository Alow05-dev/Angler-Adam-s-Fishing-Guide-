export const species = {
  largemouth: {
    name: "Largemouth Bass",
    preferredTemps: [58, 76],
    lureBias: ["soft-plastic", "spinnerbait", "jig", "crankbait"],
    habitats: ["cover", "points", "flats", "rock", "wood"]
  },
  smallmouth: {
    name: "Smallmouth Bass",
    preferredTemps: [55, 72],
    lureBias: ["jig", "crankbait", "soft-plastic", "jerkbait"],
    habitats: ["rock", "points", "current", "dropoff"]
  },
  trout: {
    name: "Trout",
    preferredTemps: [45, 62],
    lureBias: ["spinner", "bait", "jerkbait"],
    habitats: ["inlet", "points", "current", "shallow"]
  },
  crappie: {
    name: "Crappie",
    preferredTemps: [55, 70],
    lureBias: ["jig", "minnow", "soft-plastic"],
    habitats: ["brush", "timber", "dropoff"]
  },
  catfish: {
    name: "Catfish",
    preferredTemps: [65, 82],
    lureBias: ["bait", "jig"],
    habitats: ["channel", "bottom", "deep"]
  },
  striper: {
    name: "Striper",
    preferredTemps: [55, 72],
    lureBias: ["swimbait", "jerkbait", "spinnerbait", "bait"],
    habitats: ["points", "bait-school", "channel", "current"]
  }
};