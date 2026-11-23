// Looks: each is a whole visual world modelled on the Harvest 26 boards.
// Palettes: bg (collage background), bgPaper (scrapbook background), papers for cards, dark and accent strips,
// light and ink for text, line for line art, leaf for botanicals, tape for masking tape.
window.LOOKS = {
  harvest: {
    name: "Harvest", feel: "Warm browns and creams, like your board",
    palettes: [
      { bg: "#4a3527", bgPaper: "#e8e0d5", cream: "#efe6d8", taupe: "#c9baa5", grey: "#d9d5cf", white: "#f8f5ef", sticky: "#efe2c8", dark: "#3a281e", accent: "#8e4630", light: "#f7efe4", ink: "#2b211b", line: "#3b3029", leaf: "#8a9474", tape: "#e6d8bc" },
      { bg: "#e6ddd1", bgPaper: "#e6ddd1", cream: "#f3ece1", taupe: "#cdbca6", grey: "#d6d1ca", white: "#fbf8f3", sticky: "#eadcc2", dark: "#3d2b21", accent: "#9a5236", light: "#f7efe4", ink: "#2d231d", line: "#3b3029", leaf: "#7f8c6b", tape: "#ddd0b6" },
      { bg: "#5b4335", bgPaper: "#ebe3d8", cream: "#f1e9dc", taupe: "#bfae97", grey: "#d4cfc8", white: "#f7f3ec", sticky: "#ead9bd", dark: "#2f221b", accent: "#7c3f2c", light: "#f6ede1", ink: "#281f19", line: "#3b3029", leaf: "#8c9576", tape: "#e3d4b7" }
    ],
    grade: { warm: 0.16, bwShare: 0.28, desat: 0.22, fade: 0.05 },
    comps: ["collage", "scrapbook", "masonry"], compWeights: [4, 3, 2],
    cards: ["taupeCaps", "greyType", "lined", "whiteCond", "greyCond", "creamSerif"],
    strips: ["darkSerif", "accentCaps", "accentItalic", "tornBold", "tape", "whiteSerif"],
    titles: ["harvest", "script"], frames: { white: 0.32, polaroid: 0.1 }, pins: 0.35, tape: 0.3, art: 1
  },
  softlife: {
    name: "Soft Life", feel: "Blush, cream and gentle script",
    palettes: [
      { bg: "#e8d3cb", bgPaper: "#f3e8e3", cream: "#fbf4ef", taupe: "#e6cdc2", grey: "#ece4e0", white: "#fffaf7", sticky: "#f8dde2", dark: "#5c3d42", accent: "#b97480", light: "#fff6f4", ink: "#4a3035", line: "#8a6168", leaf: "#c79aa2", tape: "#f3d9d9" },
      { bg: "#f1e4dc", bgPaper: "#f6ece6", cream: "#fffaf6", taupe: "#ead6cb", grey: "#efe7e2", white: "#ffffff", sticky: "#fbe3e6", dark: "#6b4148", accent: "#c98390", light: "#fff7f5", ink: "#4d3237", line: "#9a6f76", leaf: "#b9a08f", tape: "#f6dfe0" },
      { bg: "#d9bfb4", bgPaper: "#efe2dc", cream: "#f9f0ea", taupe: "#e2c4b8", grey: "#e9dfda", white: "#fff9f6", sticky: "#f5d6dc", dark: "#553539", accent: "#a8636f", light: "#fff4f1", ink: "#45292e", line: "#7d5359", leaf: "#c4979d", tape: "#efd4d4" }
    ],
    grade: { warm: 0.1, rosy: 0.12, bwShare: 0.15, fade: 0.08, desat: 0.08 },
    comps: ["scrapbook", "collage", "masonry"], compWeights: [4, 3, 2],
    cards: ["sticky", "scriptCard", "greyType", "taupeCaps", "creamSerif"],
    strips: ["accentItalic", "tornBold", "whiteSerif", "label", "script"],
    titles: ["script", "harvest"], frames: { white: 0.35, polaroid: 0.25 }, pins: 0.2, tape: 0.5, art: 1
  },
  midnight: {
    name: "Midnight", feel: "Black, gold and black-and-white photos",
    palettes: [
      { bg: "#141212", bgPaper: "#1b1817", cream: "#efe8dc", taupe: "#cbbfae", grey: "#c4bfb8", white: "#f6f3ee", sticky: "#e8d9b5", dark: "#0c0b0b", accent: "#b8975a", light: "#f3ead8", ink: "#1a1715", line: "#b8975a", leaf: "#6f6a5f", tape: "#d9cba8" },
      { bg: "#1e1b19", bgPaper: "#211e1c", cream: "#f2ece2", taupe: "#bdb19f", grey: "#bab5ae", white: "#f7f5f1", sticky: "#e4d4ad", dark: "#0e0d0c", accent: "#c9a96a", light: "#f5edde", ink: "#1b1816", line: "#c9a96a", leaf: "#6b675c", tape: "#d6c7a2" }
    ],
    grade: { bwShare: 0.6, contrast: 0.12, desat: 0.2, dark: 0.05 },
    comps: ["masonry", "collage", "scrapbook"], compWeights: [3, 3, 1],
    cards: ["darkItalic", "greyCond", "whiteCond", "taupeCaps", "greyType"],
    strips: ["accentCaps", "darkSerif", "whiteSerif", "label", "accentItalic"],
    titles: ["editorial", "script"], frames: { white: 0.25, polaroid: 0 }, pins: 0, tape: 0.1, art: 0.6
  },
  garden: {
    name: "Garden", feel: "Sage, cream and leaves everywhere",
    palettes: [
      { bg: "#dfe3d3", bgPaper: "#eef0e5", cream: "#f6f3e8", taupe: "#d2d7c1", grey: "#e0e1d9", white: "#fbfbf6", sticky: "#e9edcf", dark: "#3d4a35", accent: "#6f7f52", light: "#f6f6ee", ink: "#2f3a2a", line: "#55644a", leaf: "#7f9566", tape: "#e3e2cc" },
      { bg: "#e9e4d6", bgPaper: "#efeadf", cream: "#f8f5eb", taupe: "#d6d4bd", grey: "#e3e1d8", white: "#fdfcf7", sticky: "#edebd0", dark: "#33402e", accent: "#8a6e4b", light: "#f8f6ee", ink: "#2c3527", line: "#4f5d44", leaf: "#86996b", tape: "#e5ddc4" }
    ],
    grade: { warm: 0.1, green: 0.06, bwShare: 0.15, fade: 0.06, desat: 0.12 },
    comps: ["scrapbook", "collage", "masonry"], compWeights: [4, 2, 2],
    cards: ["greyType", "creamSerif", "sticky", "lined", "taupeCaps"],
    strips: ["tape", "accentItalic", "tornBold", "darkSerif", "script"],
    titles: ["script", "harvest"], frames: { white: 0.4, polaroid: 0.3 }, pins: 0.2, tape: 0.5, art: 1.3
  },
  gallery: {
    name: "Gallery", feel: "Clean white, black type, calm grid",
    palettes: [
      { bg: "#f2f0ec", bgPaper: "#f2f0ec", cream: "#ffffff", taupe: "#e8e4dd", grey: "#dedcd8", white: "#ffffff", sticky: "#f1ede6", dark: "#161616", accent: "#161616", light: "#ffffff", ink: "#161616", line: "#161616", leaf: "#a3a39a", tape: "#e9e6df" },
      { bg: "#e9e6e0", bgPaper: "#ece9e3", cream: "#fbfaf8", taupe: "#dcd6cc", grey: "#d6d3ce", white: "#ffffff", sticky: "#efeae2", dark: "#1d1b19", accent: "#8b6f52", light: "#ffffff", ink: "#1d1b19", line: "#1d1b19", leaf: "#9d9c92", tape: "#e3dfd7" }
    ],
    grade: { bwShare: 0.45, desat: 0.15, contrast: 0.05 },
    comps: ["masonry", "collage"], compWeights: [4, 2],
    cards: ["whiteCond", "taupeCaps", "greyType", "darkItalic"],
    strips: ["label", "darkSerif", "whiteSerif", "accentCaps"],
    titles: ["editorial", "harvest"], frames: { white: 0.2, polaroid: 0 }, pins: 0, tape: 0, art: 0.5
  },
  lagospop: {
    name: "Lagos Pop", feel: "Warm colour, bold type, joyful",
    palettes: [
      { bg: "#f2e4cf", bgPaper: "#f5eadb", cream: "#fff7ea", taupe: "#f1c99f", grey: "#e9dfd0", white: "#fffdf8", sticky: "#ffd36b", dark: "#1d3b8f", accent: "#d9532b", light: "#fff8ec", ink: "#1d1b18", line: "#1d3b8f", leaf: "#3f8a5b", tape: "#f4d58d" },
      { bg: "#1d3b8f", bgPaper: "#f3e6d2", cream: "#fff7ea", taupe: "#f6c7a0", grey: "#ece2d3", white: "#fffdf8", sticky: "#ffd36b", dark: "#16295f", accent: "#e0662f", light: "#fff8ec", ink: "#1b1916", line: "#1d3b8f", leaf: "#3f8a5b", tape: "#f4d58d" }
    ],
    grade: { warm: 0.08, sat: 0.08, bwShare: 0.1 },
    comps: ["collage", "scrapbook", "masonry"], compWeights: [3, 2, 2],
    cards: ["whiteCond", "sticky", "creamSerif", "greyCond", "lined"],
    strips: ["accentCaps", "label", "darkSerif", "tape", "tornBold"],
    titles: ["poster", "harvest"], frames: { white: 0.35, polaroid: 0.1 }, pins: 0.3, tape: 0.4, art: 0.8
  }
};

window.AREAS = {
  her: { label: "Her", short: "Her" },
  career: { label: "Career & work", short: "Career" },
  money: { label: "Money & investment", short: "Wealth" },
  love: { label: "Love & marriage", short: "Love" },
  family: { label: "Family & motherhood", short: "Family" },
  home: { label: "Home", short: "Home" },
  travel: { label: "Travel", short: "Travel" },
  health: { label: "Health & fitness", short: "Health" },
  peace: { label: "Peace & me-time", short: "Rest" },
  friends: { label: "Friends & community", short: "Friends" },
  faith: { label: "Faith & purpose", short: "Faith" },
  learning: { label: "Learning", short: "Growth" }
};

// Backgrounds she can choose. "look" keeps the look's own colour.
window.BACKGROUNDS = [
  { key: "look", name: "Match my look" },
  { key: "espresso", name: "Espresso", color: "#4a3527", texture: "paper" },
  { key: "cream", name: "Cream paper", color: "#ece4d8", texture: "paper" },
  { key: "kraft", name: "Kraft", color: "#b8987a", texture: "kraft" },
  { key: "linen", name: "Linen", color: "#e9e3d8", texture: "linen" },
  { key: "blush", name: "Blush", color: "#ecd3cc", texture: "paper" },
  { key: "sage", name: "Sage", color: "#dce2d0", texture: "linen" },
  { key: "grid", name: "Grid paper", color: "#f4f1ea", texture: "grid" },
  { key: "dots", name: "Dotted journal", color: "#f3efe8", texture: "dots" },
  { key: "wash", name: "Watercolour", color: "#f1e9df", texture: "wash" },
  { key: "terracotta", name: "Terracotta", color: "#a85d43", texture: "paper" },
  { key: "navy", name: "Midnight blue", color: "#1d2840", texture: "paper" },
  { key: "black", name: "Black", color: "#151313", texture: "paper" },
  { key: "photo", name: "One of my photos", texture: "photo" }
];

// Words and affirmations by theme, so every woman sees ones that fit what she chose.
window.THEMES = {
  her: { f: ["Radiant", "Magnetic", "Elegant", "Poised", "Glowing", "Self-assured", "Unbothered", "Becoming", "Soft", "Striking"],
    a: ["I am becoming her", "I move with grace and quiet confidence", "I deserve soft and beautiful things", "I take up space and I belong there", "My presence is felt before I speak", "I dress for the life I am walking into"] },
  career: { f: ["Visibility", "Leadership", "Momentum", "Ambitious", "Focused", "Unstoppable", "Promoted", "Respected", "Sharp", "Fearless"],
    a: ["Doors open for me", "I am paid well for my brilliance", "My work speaks for me in rooms I am not in", "I am the one they call", "I lead with clarity and courage", "Big rooms are my rooms"] },
  money: { f: ["Abundant", "Affluent", "Secure", "Prosperous", "Investor", "Generous", "Luxury", "Rich", "Owner", "Liquid"],
    a: ["Money comes to me easily and often", "Everything I touch prospers", "My income keeps growing", "I am building wealth that outlives me", "I am a good steward of great wealth", "I can afford the life I want"] },
  love: { f: ["Loved", "Cherished", "Adored", "Safe", "Chosen", "Romance", "Devoted", "Tender", "Together", "Desired"],
    a: ["I am loved out loud", "Love finds me ready", "I give and receive love freely", "I am chosen every day", "I am safe in love", "My love story is soft and steady"] },
  family: { f: ["Grateful", "Nurtured", "Present", "Blessed", "Legacy", "Warmth", "Patient", "Home", "Laughter", "Rooted"],
    a: ["My home is full of peace and love", "I am raising a legacy", "There is enough of me to go round", "My family is my soft place", "We are growing together"] },
  home: { f: ["Sanctuary", "Grounded", "Settled", "Cosy", "Beauty", "Order", "Keys", "Mine", "Calm", "Nested"],
    a: ["My home is my sanctuary", "I live in the home I prayed for", "I hold the keys to my own space", "Everything in my space brings me peace"] },
  travel: { f: ["Expansive", "Adventure", "Wanderlust", "Curious", "Alive", "Explorer", "Sunlit", "Passport", "Worldly", "Unhurried"],
    a: ["The world is my playground", "I see the world on my own terms", "New places find me wide awake", "My passport stays busy", "I collect sunsets and stories"] },
  health: { f: ["Strong", "Healthy", "Energised", "Vital", "Fit", "Nourished", "Rested", "Whole", "Light", "Glowing"],
    a: ["I am healthy, strong and glowing", "My body is my home and I honour it", "I move my body with love", "I nourish myself well", "I sleep deeply and wake rested"] },
  peace: { f: ["Calm", "Still", "Unhurried", "Present", "Balanced", "Gentle", "Quiet", "Ease", "Rested", "Unbothered"],
    a: ["Rest is part of my success", "I protect my peace", "I am allowed to slow down", "I release what I cannot control", "Ease is my new normal"] },
  friends: { f: ["Sisterhood", "Celebrated", "Belonging", "Laughter", "Seen", "Loyal", "Community", "Fun", "Delight", "Kindred"],
    a: ["My circle is rich in love and ambition", "I am surrounded by women who win", "I am celebrated, not tolerated", "I attract good people everywhere I go", "We rise together"] },
  faith: { f: ["Favoured", "Grace", "Blessed", "Faithful", "Anchored", "Trust", "Light", "Devoted", "Covered", "Hopeful"],
    a: ["I am covered by grace", "What is meant for me will find me", "My steps are ordered", "I walk by faith"],
    christian: ["I am fearfully and wonderfully made", "God's favour surrounds me"],
    muslim: ["Alhamdulillah for every season", "What is written for me will reach me"] },
  learning: { f: ["Growth", "Curious", "Wise", "Disciplined", "Sharp", "Capable", "Evolving", "Scholar", "Skilled", "Bright"],
    a: ["I keep my promises to myself", "I learn fast and I use it", "Every skill I build pays me back", "I am always becoming better", "My mind is my best asset"] }
};
// "More" lists are simply every theme's words together
window.FEELINGS = []; window.AFFIRMATIONS = [];
Object.values(window.THEMES).forEach((t) => { t.f.forEach((w) => { if (!window.FEELINGS.includes(w)) window.FEELINGS.push(w); }); t.a.forEach((w) => { if (!window.AFFIRMATIONS.includes(w)) window.AFFIRMATIONS.push(w); }); });
// Related themes lend photos when she picks only one or two, so her board is never thin.
window.RELATED = { her: ["travel", "peace", "money"], career: ["her", "money", "learning"], money: ["home", "travel", "her"], love: ["family", "her", "peace"], family: ["love", "home", "her"], home: ["peace", "family", "her"], travel: ["her", "peace", "money"], health: ["peace", "her", "travel"], peace: ["her", "health", "travel"], friends: ["her", "love", "travel"], faith: ["peace", "her", "family"], learning: ["career", "her", "peace"] };
