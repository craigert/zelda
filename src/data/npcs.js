// NPC definitions per overworld screen location
// Each NPC has: tx/ty (tile coords), name, lines (dialogue array)
export const NPC_DATA = {
  "1,1": [
    { tx: 3, ty: 4, name: "Old Sage", lines: [
      "Welcome, hero! Hyrule needs you.",
      "Seek the three Triforce pieces...",
      "hidden in the Forest Temple, Fire Cavern,",
      "and Shadow Keep. Beware the Dark Sanctum!"
    ]},
  ],
  "0,0": [
    { tx: 12, ty: 3, name: "Forest Guide", lines: [
      "The Forest Temple lies ahead...",
      "Bombs can break cracked walls!",
      "Search every room for secrets."
    ]},
  ],
  "2,-1": [
    { tx: 5, ty: 8, name: "Mountain Hermit", lines: [
      "The mountains hide many secrets.",
      "Heart Pieces increase your strength.",
      "Look carefully in every corner!"
    ]},
  ],
  "3,0": [
    { tx: 8, ty: 6, name: "Desert Wanderer", lines: [
      "The eastern desert is dangerous!",
      "Fire bats patrol these lands.",
      "A Fire Cavern lies to the south..."
    ]},
  ],
  "-1,1": [
    { tx: 6, ty: 5, name: "Swamp Witch", lines: [
      "The swamp poisons those who linger!",
      "The Shadow Keep to the south...",
      "holds an ancient, evil power.",
      "Only the brave may enter."
    ]},
  ],
  "1,2": [
    { tx: 10, ty: 5, name: "Old Fisherman", lines: [
      "I've seen lights in the caves...",
      "Bomb the cracked walls to find",
      "hidden treasures beneath the earth!"
    ]},
  ],
  "3,2": [
    { tx: 3, ty: 3, name: "Dark Sentinel", lines: [
      "The Dark Sanctum opens only",
      "when all three Triforce pieces",
      "have been gathered. Are you ready?"
    ]},
  ],
  "4,1": [
    { tx: 3, ty: 8, name: "Fire Keeper", lines: [
      "The Fire Cavern burns eternal!",
      "Its Master Key is hidden deep...",
      "behind locked doors within."
    ]},
  ],
  "0,1": [
    { tx: 7, ty: 4, name: "Ancient Tree", lines: [
      "...*creak*... Ah, a visitor...",
      "I have watched these lands for ages.",
      "The mountains to the north hide a",
      "golden treasure behind cracked stone.",
      "In each dungeon, defeat all foes",
      "in a room to earn its treasure.",
      "Light dim torches with your sword...",
      "and the darkness will reward you."
    ]},
    { tx: 8, ty: 8, name: "Sign", fixed: true, lines: [
      "BEWARE OF SWAMP!",
      "Poisonous bog lies ahead.",
      "Stay on the path!"
    ]},
  ],
};
