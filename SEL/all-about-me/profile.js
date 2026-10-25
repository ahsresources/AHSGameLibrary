/* Builds the "About me" paragraph. Pure function so it is easy to test.
   profile: { name, age, school }
   picks:   [{ gid, phrase, ... }] in the order they were chosen
   returns: array of sentences                                            */

function joinList(items) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

function buildProfile(profile, picks) {
  const name = (profile.name || '').trim();
  const school = (profile.school || '').trim();
  const ageNum = parseInt(profile.age, 10);
  const hasAge = Number.isFinite(ageNum) && ageNum > 0;

  const of = gid => picks.filter(p => p.gid === gid);
  const phrases = gid => of(gid).map(p => p.phrase);
  const out = [];

  // Introduction
  out.push(name ? `Hi! My name is ${name}.` : 'Hi!');
  if (hasAge && school) out.push(`I am ${ageNum} ${ageNum === 1 ? 'year' : 'years'} old and I study at ${school}.`);
  else if (hasAge)      out.push(`I am ${ageNum} ${ageNum === 1 ? 'year' : 'years'} old.`);
  else if (school)      out.push(`I study at ${school}.`);

  // Physical traits
  const height = of('height')[0];
  if (height) out.push(`I am ${height.phrase}.`);

  const features = [];
  const hairStyle  = picks.find(p => p.slot === 'hairStyle');
  const hairColour = picks.find(p => p.slot === 'hairColour');
  const hairBits = [hairStyle, hairColour].filter(Boolean).map(p => p.phrase);
  if (hairBits.length) features.push(`${hairBits.join(', ')} hair`);
  const eyes = of('eyes')[0];
  if (eyes) features.push(`${eyes.phrase} eyes`);
  const skin = of('skin')[0];
  if (skin) features.push(`${skin.phrase} skin`);
  if (features.length) out.push(`I have ${joinList(features)}.`);

  // Personality
  const traits = phrases('personality');
  if (traits.length) out.push(`I am ${joinList(traits)}.`);

  // Preferences
  const acts = phrases('activities');
  if (acts.length) out.push(`I like ${joinList(acts)}.`);

  const sports = phrases('sports');
  if (sports.length) out.push(`My favourite ${sports.length === 1 ? 'sport is' : 'sports are'} ${joinList(sports)}.`);

  const colour = of('colours')[0];
  if (colour) out.push(`My favourite colour is ${colour.phrase}.`);

  const food = phrases('food');
  if (food.length) out.push(`My favourite ${food.length === 1 ? 'food is' : 'foods are'} ${joinList(food)}.`);

  const songs = phrases('songs');
  if (songs.length) out.push(`My favourite ${songs.length === 1 ? 'song is' : 'songs are'} ${joinList(songs)}.`);

  // Strengths
  const strengths = phrases('strengths');
  if (strengths.length) out.push(`I am good at ${joinList(strengths)}.`);

  return out;
}
