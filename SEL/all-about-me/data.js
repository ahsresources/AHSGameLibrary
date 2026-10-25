/* ------------------------------------------------------------------
   All about me – content for the board.
   To change words, add items or swap icons, edit this file only.

   Icons: each item names an icon file (without extension) that lives
   in the assets/ folder, e.g. icon: 'hair-curly'  ->  assets/hair-curly.png
   If a file is missing, the app shows an emoji (or a colour swatch)
   instead, so the app always works while you add your artwork.
------------------------------------------------------------------- */

const ICON_DIR = 'assets/';
const ICON_EXT = 'png';

/* 12 colours. Choosing one re-colours the whole app.
   h = hue, S = saturation (0-100). aL / sL / bgL fine-tune lightness. */
const COLOURS = [
  { id: 'pink',      label: 'Pink',      hex: '#F8A5C2', h: 340, S: 100 },
  { id: 'red',       label: 'Red',       hex: '#E53935', h: 355, S: 90,  aL: 58, sL: 36 },
  { id: 'orange',    label: 'Orange',    hex: '#FB8C00', h: 28,  S: 100, aL: 56, sL: 34 },
  { id: 'yellow',    label: 'Yellow',    hex: '#FDD835', h: 48,  S: 100, aL: 52, sL: 26 },
  { id: 'green',     label: 'Green',     hex: '#43A047', h: 135, S: 60,  sL: 28 },
  { id: 'turquoise', label: 'Turquoise', hex: '#1DB8A8', h: 175, S: 70,  sL: 28 },
  { id: 'blue',      label: 'Blue',      hex: '#1E88E5', h: 210, S: 90 },
  { id: 'purple',    label: 'Purple',    hex: '#8E4EC6', h: 275, S: 65 },
  { id: 'brown',     label: 'Brown',     hex: '#8D5B3A', h: 25,  S: 45,  aL: 45, sL: 28 },
  { id: 'grey',      label: 'Grey',      hex: '#9E9E9E', h: 215, S: 10,  aL: 55, sL: 30 },
  { id: 'black',     label: 'Black',     hex: '#212121', h: 0,   S: 0,   aL: 30, sL: 10, bgL: 96 },
  { id: 'white',     label: 'White',     hex: '#FFFFFF', h: 0,   S: 0,   aL: 70, sL: 28, bgL: 100 }
];
const DEFAULT_THEME = COLOURS[0];

/* Item fields
   label  – the word on the tile (keep it short and simple)
   sub    – optional small word under the label
   phrase – how it reads in the profile sentence (defaults to label in lower case)
   icon   – file name in assets/ (no extension)
   emoji  – fallback shown until the icon file exists
   swatch – colour circle (used as the picture for skin and colours, or as fallback)
   listSuffix (on a group) – text added after the label in "My list", e.g. " hair" gives "Black hair"
   slot   – items with the same slot replace each other (e.g. hair style vs hair colour)

   Group modes
   single – only one item can be chosen (a new choice replaces the old one)
   multi  – any number of items
   colour – single choice that also changes the app colour theme
*/

const CATEGORIES = [
  {
    id: 'physical', label: 'Physical traits', sub: 'My body', icon: 'cat-physical', emoji: '🧍',
    groups: [
      {
        id: 'height', label: 'Height', icon: 'group-height', emoji: '📏', mode: 'single',
        items: [
          { id: 'tall',  label: 'Tall',  icon: 'height-tall',  emoji: '🦒' },
          { id: 'short', label: 'Short', icon: 'height-short', emoji: '🐢' }
        ]
      },
      {
        id: 'hair', label: 'Hair', icon: 'group-hair', emoji: '💇', mode: 'single', listSuffix: ' hair',
        items: [
          { id: 'straight', label: 'Straight', icon: 'hair-straight', emoji: '💁', slot: 'hairStyle' },
          { id: 'curly',    label: 'Curly',    icon: 'hair-curly',    emoji: '👩‍🦱', slot: 'hairStyle' },
          { id: 'black',    label: 'Black',    icon: 'hair-black',    swatch: '#1d1d1d', slot: 'hairColour' },
          { id: 'brown',    label: 'Brown',    icon: 'hair-brown',    swatch: '#6b4226', slot: 'hairColour' },
          { id: 'white',    label: 'White',    icon: 'hair-white',    swatch: '#f2f2f2', slot: 'hairColour' },
          { id: 'red',      label: 'Red',      icon: 'hair-red',      swatch: '#b5381e', slot: 'hairColour' },
          { id: 'blonde',   label: 'Blonde',   icon: 'hair-blonde',   swatch: '#e8c66a', slot: 'hairColour' }
        ]
      },
      {
        id: 'eyes', label: 'Eyes', icon: 'group-eyes', emoji: '👀', mode: 'single', listSuffix: ' eyes',
        items: [
          { id: 'black', label: 'Black', icon: 'eyes-black', swatch: '#1d1d1d' },
          { id: 'brown', label: 'Brown', icon: 'eyes-brown', swatch: '#6b4226' },
          { id: 'blue',  label: 'Blue',  icon: 'eyes-blue',  swatch: '#3b82c4' },
          { id: 'green', label: 'Green', icon: 'eyes-green', swatch: '#4f9d5d' },
          { id: 'grey',  label: 'Grey',  icon: 'eyes-grey',  swatch: '#9aa3ab' }
        ]
      },
      {
        id: 'skin', label: 'Skin', icon: 'group-skin', emoji: '🖐️', mode: 'single', listSuffix: ' skin',
        items: [
          { id: 'verylight', label: 'Very light', phrase: 'very light', swatch: '#FCE4D2' },
          { id: 'light',     label: 'Light',      phrase: 'light',      swatch: '#F5CFAE' },
          { id: 'medium',    label: 'Medium',     phrase: 'medium',     swatch: '#E8B58C' },
          { id: 'tanned',    label: 'Tanned',     phrase: 'tanned',     swatch: '#D39A6B' },
          { id: 'olive',     label: 'Olive',      phrase: 'olive',      swatch: '#C6A06A' },
          { id: 'brown',     label: 'Brown',      phrase: 'brown',      swatch: '#A9703F' },
          { id: 'darkbrown', label: 'Dark brown', phrase: 'dark brown', swatch: '#7B4A2A' },
          { id: 'verydark',  label: 'Very dark',  phrase: 'very dark',  swatch: '#4B2C1B' }
        ]
      }
    ]
  },

  {
    id: 'personality', label: 'Personality', sub: 'What I am like', icon: 'cat-personality', emoji: '😊',
    groups: [
      {
        id: 'personality', label: 'Personality', icon: 'cat-personality', emoji: '😊', mode: 'multi',
        lowerCustom: true,
        other: { label: 'Others', title: 'What else are you like?', placeholder: 'Type a word, e.g. cheeky', icon: 'other', emoji: '✏️' },
        items: [
          { id: 'kind',     label: 'Kind',     icon: 'personality-kind',     emoji: '🤗' },
          { id: 'funny',    label: 'Funny',    icon: 'personality-funny',    emoji: '😂' },
          { id: 'happy',    label: 'Happy',    icon: 'personality-happy',    emoji: '😊' },
          { id: 'active',   label: 'Active',   icon: 'personality-active',   emoji: '🏃' },
          { id: 'creative', label: 'Creative', icon: 'personality-creative', emoji: '🎨' },
          { id: 'shy',      label: 'Shy',      icon: 'personality-shy',      emoji: '🙈' },
          { id: 'brave',    label: 'Brave',    icon: 'personality-brave',    emoji: '🦁' },
          { id: 'friendly', label: 'Friendly', icon: 'personality-friendly', emoji: '🤝' },
          { id: 'quiet',    label: 'Quiet',    icon: 'personality-quiet',    emoji: '🤫' },
          { id: 'helpful',  label: 'Helpful',  icon: 'personality-helpful',  emoji: '🙌' },
          { id: 'smart',    label: 'Smart',    icon: 'personality-smart',    emoji: '💡' }
        ]
      }
    ]
  },

  {
    id: 'preferences', label: 'Preferences', sub: 'What I like', icon: 'cat-preferences', emoji: '❤️',
    groups: [
      {
        id: 'activities', label: 'Activities', icon: 'group-activities', emoji: '🎈', mode: 'multi',
        lowerCustom: true,
        other: { label: 'Others', title: 'What else do you like to do?', placeholder: 'Type it, e.g. dancing', icon: 'other', emoji: '✏️' },
        items: [
          { id: 'eat',     label: 'Eat',            phrase: 'eating',                        icon: 'activity-eat',     emoji: '🍽️' },
          { id: 'videos',  label: 'Watch videos',   phrase: 'watching videos',               icon: 'activity-videos',  emoji: '📺' },
          { id: 'read',    label: 'Read',           phrase: 'reading',                       icon: 'activity-read',    emoji: '📖' },
          { id: 'draw',    label: 'Draw',           phrase: 'drawing',                       icon: 'activity-draw',    emoji: '✏️' },
          { id: 'paint',   label: 'Paint',          phrase: 'painting',                      icon: 'activity-paint',   emoji: '🎨' },
          { id: 'toys',    label: 'Toys and games', phrase: 'playing with toys and games',   icon: 'activity-toys',    emoji: '🧸' },
          { id: 'friends', label: 'Play with friends', phrase: 'playing with friends',       icon: 'activity-friends', emoji: '👫' },
          { id: 'swim',    label: 'Swim',           phrase: 'swimming',                      icon: 'sport-swimming',   emoji: '🏊' },
          { id: 'run',     label: 'Run',            phrase: 'running',                       icon: 'sport-running',    emoji: '🏃' },
          { id: 'sing',    label: 'Sing',           phrase: 'singing',                       icon: 'activity-sing',    emoji: '🎤' },
          { id: 'dance',   label: 'Dance',          phrase: 'dancing',                       icon: 'activity-dance',   emoji: '💃' }
        ]
      },
      {
        id: 'sports', label: 'Sports', icon: 'group-sports', emoji: '🏅', mode: 'multi',
        lowerCustom: true,
        other: { label: 'Others', title: 'What other sport do you like?', placeholder: 'Type a sport, e.g. tennis', icon: 'other', emoji: '✏️' },
        items: [
          { id: 'swimming',   label: 'Swimming',   icon: 'sport-swimming',   emoji: '🏊' },
          { id: 'basketball', label: 'Basketball', icon: 'sport-basketball', emoji: '🏀' },
          { id: 'football',   label: 'Football',   icon: 'sport-football',   emoji: '⚽' },
          { id: 'badminton',  label: 'Badminton',  icon: 'sport-badminton',  emoji: '🏸' },
          { id: 'running',    label: 'Running',    icon: 'sport-running',    emoji: '🏃' },
          { id: 'canoeing',   label: 'Canoeing',   icon: 'sport-canoeing',   emoji: '🛶' },
          { id: 'climbing',   label: 'Climbing',   icon: 'sport-climbing',   emoji: '🧗' }
        ]
      },
      {
        id: 'colours', label: 'Colours', icon: 'group-colours', emoji: '🌈', mode: 'colour',
        items: COLOURS.map(c => ({ id: c.id, label: c.label, phrase: c.label.toLowerCase(), swatch: c.hex,
                                    h: c.h, S: c.S, aL: c.aL, sL: c.sL, bgL: c.bgL }))
      },
      {
        id: 'food', label: 'Food', icon: 'group-food', emoji: '🍽️', mode: 'multi',
        other: { label: 'Others', title: 'What other food do you like?', placeholder: 'Type a food, e.g. laksa', icon: 'other', emoji: '✏️' },
        items: [
          { id: 'chickenrice', label: 'Chicken rice',    phrase: 'chicken rice',    icon: 'food-chicken-rice', emoji: '🍚' },
          { id: 'nasilemak',   label: 'Nasi lemak',      phrase: 'nasi lemak',      icon: 'food-nasi-lemak',   emoji: '🍛' },
          { id: 'pasta',       label: 'Pasta',           phrase: 'pasta',           icon: 'food-pasta',        emoji: '🍝' },
          { id: 'pizza',       label: 'Pizza',           phrase: 'pizza',           icon: 'food-pizza',        emoji: '🍕' },
          { id: 'nuggets',     label: 'Chicken nuggets', phrase: 'chicken nuggets', icon: 'food-nuggets',      emoji: '🍗' },
          { id: 'burger',      label: 'Burger',          phrase: 'burgers',         icon: 'food-burger',       emoji: '🍔' },
          { id: 'maggi',       label: 'Maggi',           phrase: 'Maggi',           icon: 'food-maggi',        emoji: '🍜' },
          { id: 'prata',       label: 'Prata',           phrase: 'prata',           icon: 'food-prata',        emoji: '🫓' },
          { id: 'pancakes',    label: 'Pancakes',        phrase: 'pancakes',        icon: 'food-pancakes',     emoji: '🥞' },
          { id: 'icecream',    label: 'Ice cream',       phrase: 'ice cream',       icon: 'food-ice-cream',    emoji: '🍦' },
          { id: 'oreo',        label: 'Oreo',            phrase: 'Oreo',            icon: 'food-oreo',         emoji: '🍪' }
        ]
      },
      {
        id: 'songs', label: 'Songs', icon: 'group-songs', emoji: '🎵', mode: 'multi',
        other: { label: 'Add a song', title: 'What song do you like?', placeholder: 'Type the name of a song', icon: 'add-song', emoji: '🎵' },
        items: []
      }
    ]
  },

  {
    id: 'strengths', label: 'Strengths', sub: 'What I am good at', icon: 'cat-strengths', emoji: '⭐',
    groups: [
      {
        id: 'strengths', label: 'Strengths', icon: 'cat-strengths', emoji: '⭐', mode: 'multi',
        items: [
          { id: 'drawing',   label: 'Drawing',          phrase: 'drawing',            icon: 'activity-draw',       emoji: '🖍️' },
          { id: 'running',   label: 'Running',          phrase: 'running',            icon: 'sport-running',       emoji: '🏃' },
          { id: 'numbers',   label: 'Numbers',  sub: 'Numeracy', phrase: 'numeracy', icon: 'strength-numbers',    emoji: '🔢' },
          { id: 'reading',   label: 'Reading and writing', sub: 'Literacy', phrase: 'literacy', icon: 'strength-literacy', emoji: '📚' },
          { id: 'singing',   label: 'Singing',          phrase: 'singing',            icon: 'activity-sing',       emoji: '🎤' },
          { id: 'dancing',   label: 'Dancing',          phrase: 'dancing',            icon: 'activity-dance',       emoji: '💃' },
          { id: 'building',  label: 'Building',         phrase: 'building things',    icon: 'strength-building',   emoji: '🧱' },
          { id: 'helping',   label: 'Helping others',   phrase: 'helping others',     icon: 'strength-helping',    emoji: '🤝' },
          { id: 'remember',  label: 'Remembering',      phrase: 'remembering things', icon: 'strength-remembering',emoji: '🧠' },
          { id: 'listening', label: 'Listening',        phrase: 'listening',          icon: 'strength-listening',  emoji: '👂' },
          { id: 'friends',   label: 'Making friends',   phrase: 'making friends',     icon: 'strength-friends',    emoji: '👫' }
        ]
      }
    ]
  }
];

CATEGORIES.forEach(c => c.groups.forEach(g => { g.cat = c.id; }));
