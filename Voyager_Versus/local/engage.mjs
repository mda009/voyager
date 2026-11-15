// Voyager chat engagement (2.20.22): Comms Relay, daily muster (!report), Bridge Quiz, Squadrons, arrival cards and
// the Captain's Log. Reads chat from Twitch, Kick and YouTube (the same messages Voyager already sees).
// Points it awards (muster, quiz) are never paid here: they're listed in Missions › Points owed and paid through the
// Points Ledger's own audited path, like mission and Dreadnought rewards. Nothing here touches giveaways or tickets.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {weekStart} from './community.mjs';

const FILE='engage.json',HOUR=3600000,DAY=86400000,SESSION_GAP=4*HOUR;
export const SQUADRONS=['red','gold','blue'];
export const REWARD_MAX=50;
// 2.20.24: !report pays at most 2 points. Accounts are per platform (Twitch, Kick and YouTube never merge), so one person
// on all three can muster three times a stream; a small reward keeps that fair.
export const REPORT_MAX=2;
export const ENGAGE_DEFAULTS={
  relay:{enabled:true,threshold:50,damagePct:2,perUserSeconds:5},
  report:{enabled:true,reward:2},
  quiz:{enabled:true,reward:5,seconds:60,autoMinutes:0}, // 2.20.94: 5 points a correct answer
  squadrons:{enabled:true,names:{red:'Red Wing',gold:'Gold Wing',blue:'Blue Wing'},chat:1,chatCap:60,mission:25,damageDiv:10,versusWin:50},
  arrivals:{enabled:true,minTier:'silver',ranks:true},
  log:{enabled:true,perStream:3}
};
// Starter questions (2.26.0, bank 4): a step harder than the 2.21.13 set, and none of them appeared in any earlier set.
// A question is asked once and never again (see ask()). Edit them in Voyager Control › Chat engagement, or reload this set
// with "Load the Star Citizen & general knowledge set".
export const QUIZ_BANK_VERSION=4;
export const QUIZ_STARTERS=[
  // Star Citizen — places
  {q:'What is the name of Orison\'s spaceport?',a:['august dunlow','august dunlow spaceport']},
  {q:'What is the name of Lorville\'s spaceport?',a:['teasa','teasa spaceport']},
  {q:'What is the name of Area18\'s spaceport?',a:['riker','riker memorial','riker memorial spaceport']},
  {q:'What is the bar in Orison called?',a:['voyager','voyager bar','the voyager bar']},
  {q:'What is the gun shop in Area18 called?',a:['cubby blast','cubbyblast']},
  {q:'Which Crusader moon is the icy one with an asteroid ring?',a:['yela']},
  {q:'Which microTech moon shares its name with the Muse of history?',a:['clio']},
  {q:'Which ArcCorp moon is the icy one known for cryovolcanoes?',a:['lyria']},
  {q:'How many planets orbit the Stanton star?',a:['4','four']},
  {q:'What is the nickname of Pyro III, the most habitable planet in Pyro?',a:['bloom']},
  {q:'Pyro II is nicknamed after a poisonous gas. What is it called?',a:['monox']},
  {q:'Which Pyro station orbits Bloom?',a:['orbituary']},
  {q:'Which Pyro station orbits Monox?',a:['checkmate']},
  {q:'On which planetoid did Levski sit when it was temporarily placed in Stanton?',a:['delamar']},
  {q:'What is the space station in the Tayac system that stores the Galactapedia called?',a:['the ark','ark']},
  {q:'In which system is the UEE building an artificial planet, the Synthworld?',a:['chronos']},
  // Star Citizen — factions, lore, people
  {q:'Which gang holds Ruin Station in Pyro?',a:['xenothreat','xeno threat']},
  {q:'Which Pyro settler group goes by the initials CFP?',a:['citizens for prosperity']},
  {q:'Which pirate gang blockades stations in Stanton\'s lockdown events?',a:['nine tails','ninetails','9 tails']},
  {q:'What is ArcCorp\'s security force called?',a:['blacjac','blacjac security','blackjack','blackjack security']},
  {q:'Which crime boss at GrimHEX speaks through a hologram of a former Imperator?',a:['ruto']},
  {q:'Which family ruled the UEE as dictators until 2792?',a:['messer','the messers','messers']},
  {q:'A massacre on which planet sparked the fall of the Messer regime?',a:['garron ii','garron 2','garron']},
  {q:'What does UPE, the government before the UEE, stand for?',a:['united planets of earth']},
  {q:'Which admiral defeated the Vanduul at the Battle of Vega II?',a:['bishop','ernst bishop','admiral bishop']},
  {q:'Which alien race did humanity meet first?',a:['banu','the banu']},
  {q:'What is a Banu guild-family called?',a:['souli']},
  {q:'What is the Tevarin warrior code called?',a:['rijora']},
  {q:'Which Xi\'an manufacturer builds the Railen and the Syulen?',a:['gatac','gatac manufacture']},
  {q:'Which actor plays Admiral Bishop in Squadron 42?',a:['gary oldman','oldman']},
  {q:'Which actor plays "Old Man" Colton in Squadron 42?',a:['mark hamill','hamill']},
  {q:'Which actor plays Captain Maclaren in Squadron 42?',a:['gillian anderson','anderson']},
  {q:'In Squadron 42, the player serves aboard which Idris frigate?',a:['stanton','uees stanton','the stanton']},
  {q:'What is microTech\'s penguin mascot called?',a:['pico','pico the penguin']},
  {q:'Which company makes the mobiGlas?',a:['microtech','micro tech']},
  {q:'What do Klescher prisoners earn to shorten their sentence?',a:['merits','merit']},
  {q:'Which pink gemstone is a favourite for hand and ROC mining?',a:['hadanite']},
  {q:'Which drug is in a standard red MedPen?',a:['hemozal']},
  {q:'What are the giant sand worms added to the verse in 2025 called?',a:['valakkar','valakkars']},
  {q:'Which dog-like alien predator is hunted for its horns?',a:['kopion','kopions']},
  // Star Citizen — events and culture
  {q:'Which yearly in-game event celebrates the UEE Navy with a fleet flyover?',a:['invictus','invictus launch week']},
  {q:'Which winter festival of Banu origin is celebrated in-game each December?',a:['luminalia']},
  {q:'Which in-game holiday in March celebrates luck and fortune?',a:['stella fortuna']},
  {q:'What is the verse\'s Halloween-style holiday called?',a:['day of the vara','vara','day of vara']},
  {q:'What is the verse\'s premier racing series called?',a:['murray cup','the murray cup']},
  {q:'What is the verse\'s favourite zero-g sport?',a:['sataball','sata ball']},
  {q:'What is the monthly subscriber magazine for Star Citizen called?',a:['jump point','jumppoint']},
  {q:'What is Star Citizen\'s dogfighting module called?',a:['arena commander']},
  {q:'What is Star Citizen\'s FPS module called?',a:['star marine']},
  {q:'In which Texas city was Cloud Imperium Games founded?',a:['austin']},
  {q:'CIG\'s largest studio is in which English city?',a:['manchester']},
  {q:'Which 1990 space combat series made Chris Roberts famous?',a:['wing commander']},
  {q:'Which 2003 space game did Chris Roberts begin at Digital Anvil?',a:['freelancer']},
  // Star Citizen — jargon
  {q:'What does LTI stand for?',a:['lifetime insurance','life time insurance']},
  {q:'What does CCU stand for?',a:['cross chassis upgrade','cross-chassis upgrade']},
  {q:'What does REC, the Arena Commander rental currency, stand for?',a:['rental equipment credits','rental equipment credit']},
  {q:'What does PTU stand for?',a:['public test universe']},
  {q:'What does EVA stand for?',a:['extravehicular activity','extra vehicular activity']},
  {q:'What does MFD stand for in a cockpit?',a:['multi function display','multifunction display','multi-function display']},
  {q:'What does SCM stand for in flight?',a:['space combat maneuvers','space combat manoeuvres','space combat maneuvering']},
  {q:'What does IFCS stand for?',a:['intelligent flight control system']},
  {q:'What does QED stand for?',a:['quantum enforcement device']},
  {q:'What does RMC, the salvage material, stand for?',a:['recycled material composite']},
  {q:'What does SCU stand for?',a:['standard cargo unit']},
  {q:'What does the "a" in aUEC stand for?',a:['alpha']},
  {q:'What is the 2024 flight change that split ships into SCM and NAV modes called?',a:['master modes','master mode']},
  {q:'Which component class is built for low signatures?',a:['stealth']},
  // Star Citizen — ships and weapons
  {q:'Which Aegis patrol corvette bristles with six manned turrets?',a:['hammerhead','aegis hammerhead']},
  {q:'Which Aegis gunship won the "Next Great Starship" design contest?',a:['redeemer','aegis redeemer']},
  {q:'Which Vanguard variant is the dropship?',a:['hoplite','vanguard hoplite']},
  {q:'Which huge Aegis salvage ship carries a giant claw?',a:['reclaimer','aegis reclaimer']},
  {q:'Which Aegis ship is a dedicated minelayer?',a:['nautilus','aegis nautilus']},
  {q:'Which small armoured Anvil scanning ship is named after a turtle?',a:['terrapin','anvil terrapin']},
  {q:'Which Anvil ship is a dedicated repair platform?',a:['crucible','anvil crucible']},
  {q:'Which Anvil ship is an open-deck light carrier for moving other ships?',a:['liberator','anvil liberator']},
  {q:'Which Anvil ground vehicle is a mobile missile launcher?',a:['ballista','anvil ballista']},
  {q:'Which Origin ship is a tiny racer with two oversized engines?',a:['m50','origin m50']},
  {q:'What is Origin\'s open-canopy hover bike called?',a:['x1','origin x1']},
  {q:'Which Drake capital ship is a flying carrier with landing pads?',a:['kraken','drake kraken']},
  {q:'Which Cutlass variant is the medical one?',a:['red','cutlass red']},
  {q:'Which Cutlass variant is built for bounty hunters, with holding cells?',a:['blue','cutlass blue']},
  {q:'What is Drake\'s two-seat hover bike called?',a:['dragonfly','drake dragonfly']},
  {q:'Which MISC science ship carries swappable research pods?',a:['endeavor','endeavour','misc endeavor']},
  {q:'Which MISC ship is a dedicated refinery?',a:['expanse','misc expanse']},
  {q:'Which Freelancer variant is the exploration model?',a:['dur','freelancer dur']},
  {q:'Which Constellation variant is the explorer that carries a rover?',a:['aquila','constellation aquila']},
  {q:'Which Constellation variant is the luxury model?',a:['phoenix','constellation phoenix']},
  {q:'What is the UEE Navy\'s largest carrier class?',a:['bengal','bengal carrier']},
  {q:'Which RSI heavy fighter has rotating X-wings and a rear turret?',a:['scorpius','rsi scorpius']},
  {q:'Which RSI gunboat is named after the Greek hero who slew Medusa?',a:['perseus','rsi perseus']},
  {q:'What is RSI\'s six-wheeled rover called?',a:['ursa','ursa rover','rsi ursa']},
  {q:'Which Crusader data-runner is built to slip through blockades?',a:['mercury star runner','mercury','msr','star runner']},
  {q:'Which Argo ship is a dedicated tug?',a:['srv','argo srv']},
  {q:'Which Argo hauler carries containers on an open rack and is named after a simple boat?',a:['raft','argo raft']},
  {q:'Which Kruger snub is the racing cousin of the Merlin?',a:['archimedes','p72','p 72','p72 archimedes']},
  {q:'Esperia builds replicas of which Vanduul fighter, heavier than the Scythe?',a:['glaive']},
  {q:'Which company makes the CF-series Bulldog, Badger and Panther laser repeaters?',a:['klaus werner','klaus and werner','kw','k w']},
  {q:'Which company makes the P4-AR rifle and the FS-9 machine gun?',a:['behring']},
  {q:'Which company makes the Karna rifle and the Custodian SMG?',a:['kastak arms','kastak']},
  // Space
  {q:'What is the largest moon in the Solar System?',a:['ganymede']},
  {q:'Which planet has the most known moons?',a:['saturn']},
  {q:'Which dwarf planet, found in 2005, is more massive than Pluto?',a:['eris']},
  {q:'What is Pluto\'s largest moon?',a:['charon']},
  {q:'Which probe flew past Pluto in 2015?',a:['new horizons']},
  {q:'Which is the only spacecraft to have visited Uranus and Neptune?',a:['voyager 2','voyager two']},
  {q:'Which lander made the first soft landing on a comet, in 2014?',a:['philae','rosetta']},
  {q:'Which NASA mission brought back samples of the asteroid Bennu?',a:['osiris rex','osirisrex','osiris-rex']},
  {q:'What was the first rover on Mars, in 1997?',a:['sojourner']},
  {q:'Which Mars rover landed in 2012 and is still driving?',a:['curiosity']},
  {q:'What is the giant canyon system on Mars called?',a:['valles marineris','mariner valley']},
  {q:'What are the dark basalt plains on the Moon called?',a:['maria','mare','lunar maria','seas']},
  {q:'What was the Apollo 11 lunar module called?',a:['eagle','the eagle']},
  {q:'Who stayed in lunar orbit while Armstrong and Aldrin walked on the Moon?',a:['michael collins','collins']},
  {q:'Who was the last person to walk on the Moon?',a:['gene cernan','cernan','eugene cernan']},
  {q:'Who was the first American to orbit the Earth?',a:['john glenn','glenn']},
  {q:'Who made the first spacewalk, in 1965?',a:['alexei leonov','leonov']},
  {q:'Who was the first paying space tourist, in 2001?',a:['dennis tito','tito']},
  {q:'Which space telescope found thousands of exoplanets by watching for transits from 2009?',a:['kepler']},
  {q:'The James Webb telescope sits at which Lagrange point?',a:['l2','lagrange 2','lagrange point 2']},
  {q:'What type of galaxy is the Milky Way?',a:['barred spiral','spiral','barred spiral galaxy','spiral galaxy']},
  {q:'Which red supergiant is the heart of Scorpius?',a:['antares']},
  {q:'What does a Sun-like star become when it dies?',a:['white dwarf','a white dwarf']},
  {q:'What is the maximum mass of a white dwarf called?',a:['chandrasekhar limit','chandrasekhar','the chandrasekhar limit']},
  {q:'What is the boundary of a black hole called?',a:['event horizon','the event horizon']},
  {q:'What is the radiation black holes are predicted to emit called?',a:['hawking radiation','hawking']},
  {q:'What is the afterglow of the Big Bang called?',a:['cosmic microwave background','cmb','cosmic background radiation','microwave background']},
  {q:'Roughly how old is the universe, in billions of years?',a:['13 8','13 8 billion','14','14 billion','13 7','13 8 billion years']},
  {q:'What unit is the average distance between the Earth and the Sun?',a:['astronomical unit','au','an astronomical unit']},
  {q:'What is the Moon\'s phase when it lies between the Earth and the Sun?',a:['new moon','new']},
  {q:'What are the southern lights properly called?',a:['aurora australis']},
  {q:'Which meteor shower peaks every August?',a:['perseids','the perseids','perseid']},
  {q:'What is the region around a star where liquid water can exist called?',a:['habitable zone','goldilocks zone','the habitable zone','the goldilocks zone']},
  {q:'What are the lakes on Titan made of?',a:['methane','ethane','liquid methane','hydrocarbons','methane and ethane']},
  {q:'What is the atmosphere of Venus mostly made of?',a:['carbon dioxide','co2']},
  {q:'What are Saturn\'s rings mostly made of?',a:['ice','water ice','ice and rock']},
  {q:'What are Jupiter\'s four large moons collectively called?',a:['galilean moons','galilean','the galilean moons','galilean satellites']},
  {q:'Which bright asteroid did the Dawn probe orbit before Ceres?',a:['vesta']},
  {q:'Which rocket carried the Apollo crews to the Moon?',a:['saturn v','saturn 5','saturn five']},
  {q:'What is SpaceX\'s crew capsule called?',a:['dragon','crew dragon']},
  {q:'What is SpaceX\'s giant stainless-steel rocket called?',a:['starship']},
  {q:'What is Blue Origin\'s orbital rocket called?',a:['new glenn']},
  {q:'From which territory does Europe launch its Ariane rockets?',a:['french guiana','kourou','guiana']},
  {q:'What is India\'s space agency called?',a:['isro','indian space research organisation','indian space research organization']},
  {q:'Which Indian lander touched down near the Moon\'s south pole in 2023?',a:['chandrayaan 3','chandrayaan','chandrayaan-3']},
  {q:'Which shuttle flew the final Space Shuttle mission in 2011?',a:['atlantis']},
  {q:'Which Soviet and Russian space station orbited from 1986 to 2001?',a:['mir']},
  {q:'About how many times does the ISS orbit the Earth each day?',a:['16','15','sixteen','fifteen','15 5']},
  {q:'What is Earth\'s escape velocity, in kilometres per second?',a:['11 2','11','11 2 km s','11 km s','eleven']},
  // Science and maths
  {q:'What is the chemical symbol for potassium?',a:['k']},
  {q:'What is the chemical symbol for sodium?',a:['na']},
  {q:'What is the chemical symbol for mercury?',a:['hg']},
  {q:'Which element has atomic number 6?',a:['carbon']},
  {q:'What is the lightest metal?',a:['lithium']},
  {q:'What is the most abundant element in the Earth\'s crust?',a:['oxygen']},
  {q:'Who created the periodic table?',a:['mendeleev','dmitri mendeleev','mendeleyev']},
  {q:'What is the pH of pure water?',a:['7','seven']},
  {q:'What is the SI unit of frequency?',a:['hertz','hz']},
  {q:'What is the SI unit of power?',a:['watt','watts','w']},
  {q:'What is the SI unit of electric charge?',a:['coulomb','coulombs']},
  {q:'What is the SI unit of pressure?',a:['pascal','pascals','pa']},
  {q:'What is the SI unit of energy?',a:['joule','joules','j']},
  {q:'Which particle in the nucleus has no charge?',a:['neutron','neutrons','the neutron']},
  {q:'What is the antiparticle of the electron?',a:['positron','the positron']},
  {q:'Who discovered penicillin?',a:['fleming','alexander fleming']},
  {q:'Who discovered polonium and radium?',a:['marie curie','curie','marie and pierre curie']},
  {q:'Who proposed that the Earth orbits the Sun, in 1543?',a:['copernicus','nicolaus copernicus']},
  {q:'What shape is a DNA molecule?',a:['double helix','helix','a double helix']},
  {q:'How many chromosomes does a human cell normally have?',a:['46','forty six','23 pairs']},
  {q:'What is the largest internal organ of the human body?',a:['liver','the liver']},
  {q:'What is the smallest bone in the human body?',a:['stapes','stirrup','the stapes']},
  {q:'Which protein carries oxygen in red blood cells?',a:['haemoglobin','hemoglobin']},
  {q:'What is the tenth prime number?',a:['29','twenty nine']},
  {q:'How many sides does a dodecagon have?',a:['12','twelve']},
  {q:'What is 7 factorial?',a:['5040']},
  {q:'What is hexadecimal FF in decimal?',a:['255']},
  {q:'What is the Roman numeral for 500?',a:['d']},
  {q:'What do the interior angles of a quadrilateral add up to, in degrees?',a:['360','360 degrees']},
  // Computing and games
  {q:'What does RAM stand for?',a:['random access memory']},
  {q:'What does SSD stand for?',a:['solid state drive','solid state disk']},
  {q:'What does DNS stand for?',a:['domain name system','domain name service','domain name server']},
  {q:'What does GPU stand for?',a:['graphics processing unit','graphics processor unit']},
  {q:'Which port does HTTPS use by default?',a:['443']},
  {q:'Who created the Linux kernel?',a:['linus torvalds','torvalds','linus']},
  {q:'Which mathematician helped break Enigma and is called the father of computer science?',a:['alan turing','turing']},
  {q:'Who is often called the first computer programmer?',a:['ada lovelace','lovelace','ada']},
  {q:'Which company makes GeForce graphics cards?',a:['nvidia']},
  {q:'Which studio made CryEngine?',a:['crytek']},
  {q:'Which studio makes Elite Dangerous?',a:['frontier','frontier developments']},
  {q:'Which studio makes EVE Online?',a:['ccp','ccp games']},
  {q:'Which studio made No Man\'s Sky?',a:['hello games']},
  {q:'What is the home planet in Kerbal Space Program?',a:['kerbin']},
  {q:'Who is the silent hero of Half-Life?',a:['gordon freeman','freeman','gordon']},
  {q:'What is the name of Master Chief\'s AI companion?',a:['cortana']},
  // Sci-fi
  {q:'In The Hitchhiker\'s Guide to the Galaxy, what is the answer to life, the universe and everything?',a:['42','forty two']},
  {q:'What is the ship\'s computer in 2001: A Space Odyssey called?',a:['hal','hal 9000','hal9000']},
  {q:'What is the crew\'s ship in The Expanse called?',a:['rocinante','the rocinante','roci']},
  {q:'What is the hull registry number of the original starship Enterprise?',a:['ncc 1701','ncc1701','1701']},
  {q:'What is the ship in the film Alien called?',a:['nostromo','the nostromo']},
  {q:'What is the black hole in the film Interstellar called?',a:['gargantua']},
  {q:'Who is the stranded astronaut in The Martian?',a:['mark watney','watney']},
  {q:'What is the desert planet in Dune called?',a:['arrakis','dune']},
  {q:'Who wrote the Foundation series?',a:['asimov','isaac asimov']},
  {q:'Who wrote Dune?',a:['frank herbert','herbert']},
  {q:'What are the robotic enemies in Battlestar Galactica called?',a:['cylons','cylon','the cylons']},
  {q:'What is the ship in Firefly called?',a:['serenity']},
  // Geography and history
  {q:'What is the largest country in the world by area?',a:['russia']},
  {q:'What is the capital of Brazil?',a:['brasilia']},
  {q:'What is the capital of Turkey?',a:['ankara']},
  {q:'What is the largest lake in the world by area?',a:['caspian sea','caspian','the caspian sea']},
  {q:'What is the deepest ocean trench?',a:['mariana trench','mariana','marianas trench','the mariana trench']},
  {q:'What is the highest waterfall in the world?',a:['angel falls','angel']},
  {q:'What is the longest mountain range on land?',a:['andes','the andes']},
  {q:'What is the tallest building in the world?',a:['burj khalifa','burj']},
  {q:'Which strait separates Tasmania from mainland Australia?',a:['bass strait','bass']},
  {q:'What is Australia\'s largest state by area?',a:['western australia','wa']},
  {q:'What is the capital of Tasmania?',a:['hobart']},
  {q:'Which city was Australia\'s seat of government before Canberra?',a:['melbourne']},
  {q:'In which Victorian city did the Eureka Stockade take place?',a:['ballarat']},
  {q:'In which year did Australia switch to decimal currency?',a:['1966']},
  {q:'In which year did the First Fleet arrive in Australia?',a:['1788']},
  {q:'Who was the first emperor of Rome?',a:['augustus','octavian','caesar augustus']},
  {q:'In which year did the Titanic sink?',a:['1912']},
  {q:'In which year did the Second World War end?',a:['1945']},
  {q:'Who led the first expedition to reach the South Pole?',a:['amundsen','roald amundsen']},
  {q:'In which year did the Wright brothers first fly?',a:['1903']},
  {q:'In which year was Magna Carta sealed?',a:['1215']},
  {q:'Who invented the movable-type printing press in Europe?',a:['gutenberg','johannes gutenberg']}
];
// Earlier shipped starters, recognised so a new set can replace them without touching the streamer's own questions.
const PREVIOUS_STARTERS=[
  // 2.21.13 (bank 3)
  "What does CIG call its fork of CryEngine that runs Star Citizen?","What is the name of the technology that lets many servers share one Star Citizen shard?","What does PU stand for in Star Citizen?","What is the name of the UEE's federal law-enforcement agency?","What is the UEE-wide network that is also the name of Star Citizen's official forums?","Who is the current Imperator of the UEE, elected in 2950?","Roughly how many years ahead of the real-world date is the Star Citizen timeline?","Which planet rivals Earth as the UEE's cultural capital and has the city Prime?","Levski, the free settlement run by the People's Alliance, is in which star system?","What is the main outlaw hub station in Pyro called?","What is the crime rating that outlaws build up by breaking the law called?","Which mined ore is refined into quantum fuel?","What is the small injectable used to heal yourself in the field called?","What is the name of the UEE's main hostile alien enemy's largest capital ship?","What is the common Vanduul light fighter, named after a farming tool?","microTech's three moons are named after Greek Muses. Name one.","Name one of ArcCorp's two moons.","Name one of Hurston's four moons.","Which orbital station serves Lorville, above Hurston?","Which station orbits microTech?","Which station orbits ArcCorp?","Which station replaced Port Olisar above Crusader in 2023?","Which Hurston moon holds the Klescher Rehabilitation Facility?","Which Stanton moon hosts the community Daymar Rally?","What does the company that owns Hurston make most of its money from?","Which manufacturer builds the Cyclone buggy and the Nova tank?","Who makes the ROC ground mining vehicle?","Which manufacturer builds the MOLE multi-crew mining ship?","Which manufacturer builds the Mustang and the Nomad?","The Fury, Pulse and Guardian belong to which MISC brand?","The Ares Ion and Ares Inferno heavy fighters are built by which manufacturer?","Which alien race builds the Khartu-al and the Nox?","Which alien race of traders builds the Merchantman and the Defender?","The Esperia Prowler is a dropship design of which alien race?","Which small snub fighter docks inside the RSI Constellation?","The Origin 85X snub is carried by which ship?","The Pisces is carried inside which Anvil explorer?","Which Anvil dropship is named after the Norse maidens who carried warriors to Valhalla?","Which Aegis destroyer is bigger than the Idris?","Which Aegis stealth fighter is named after a sword?","Which Aegis stealth bomber is named after an astronomical event?","What is RSI's torpedo-armed corvette called?","Which RSI medical ship is named after a Greek god of healing?","Which RSI ship can pull others out of quantum travel with a snare?","Which Drake ship is built for carrying and relaying data?","Which Drake multi-crew explorer is named after a Barbary pirate?","Which Hercules Starlifter variant (A2, C2 or M2) is the bomber?","MISC's dedicated cargo haulers run from the Hull A up to the Hull what?","Which planet spins on its side, with its axis tilted about 98 degrees?","Which planet has a day that is longer than its year?","Which planet has the shortest day in the Solar System?","Which planet takes about 165 Earth years to go round the Sun?","What is the name of Neptune's largest moon?","Name one of Mars's two moons.","Which moon of Jupiter is the most volcanically active body in the Solar System?","Which moon of Jupiter is named after a continent?","Which moon of Saturn sprays water geysers from its south pole?","What is the largest object in the asteroid belt?","What is the region of icy bodies beyond Neptune, where Pluto lives, called?","Which comet returns about every 76 years?","What is the unit of distance equal to about 3.26 light-years?","What is the boundary about 100 km up that is usually taken as the edge of space called?","What is the point in an orbit closest to Earth called?","What is the name of the supermassive black hole at the centre of the Milky Way?","What is the brightest star in the night sky?","Betelgeuse is the shoulder of which constellation?","What element does the Sun fuse to make its energy?","What type of star is the Sun?","About how many minutes does sunlight take to reach Earth?","Which probe took the Pale Blue Dot photo of Earth in 1990?","In which year were the two Voyager probes launched?","Which NASA mission orbited Saturn for 13 years before diving into it in 2017?","Which probe landed on Saturn's moon Titan in 2005?","What is the name of NASA's Mars helicopter that flew in 2021?","Which rover carried that helicopter to Mars?","Which Apollo mission radioed \"Houston, we've had a problem\"?","How many people have walked on the Moon?","Which NASA program aims to return people to the Moon this decade?","Who was the first woman in space?","What was the name of the first space station, launched in 1971?","What was the name of the Soviet space shuttle?","In which country is the Baikonur Cosmodrome?","What is the name of China's space station?","Which SpaceX rocket was the first to land its booster back on the ground?","What is the chemical symbol for tungsten?","Which element has the chemical symbol Pb?","What is the SI unit of force?","What is the SI unit of electrical resistance?","What is absolute zero in degrees Celsius?","What is the most abundant gas in Earth's atmosphere?","Which blood type is the universal donor?","How many chambers does the human heart have?","What is the largest organ of the human body?","What is the only even prime number?","What is 2 to the power of 10?","What is the square root of 169?","What is binary 1010 in decimal?","How many bits are in a byte?","What does CPU stand for?","What does HTTP stand for?","What is the Linux mascot penguin called?","Which company makes Ryzen processors?","Epic Games makes which game engine?","In which year was the first iPhone released?","Who co-founded Microsoft with Bill Gates?","Which country has the most time zones?","Which country has the most islands?","What is the largest island in the Mediterranean?","What is the smallest country in the world?","What is the largest hot desert in the world?","What is the capital of Canada?","What is the capital of New Zealand?","What is the currency of Switzerland?","Who painted The Starry Night?","Who wrote the novel 1984?","In which year did the Berlin Wall fall?","In which year did World War I begin?","In which year did Australia become a federation?","Who was Australia's first Prime Minister?","What is the highest mountain in Australia?","What is the longest river in Australia?","Darwin is the capital of which Australian state or territory?",
  // 2.20.22
  'Which planet has the Great Red Spot?','What is the closest star to the Sun?','Which planet is known as the Red Planet?','What is the name of Saturn\'s largest moon?','Which large galaxy is the Milky Way\'s nearest neighbour?','What was the first artificial satellite put into orbit?','What chat command shows your Voyager membership card?','What do you type to board the fleet when the Dreadnought appears?','How many naval ranks are there in the Voyager fleet?','How many grades do most Voyager medals have?',
  // 2.20.94 (bank 2)
  'Which studio develops Star Citizen?','Who is the creator and director of Star Citizen?','In what year did Star Citizen first go up on Kickstarter?','What is the name of Star Citizen\'s single-player campaign?','Which star system was the first one playable in Star Citizen?','Which lawless star system connects to Stanton through a jump point?','What is the name of the human government in Star Citizen?','What does UEC stand for?','Which alien race is the UEE\'s main hostile enemy in Star Citizen?','Which Stanton planet has the landing zone Lorville?','Which Stanton planet has the landing zone New Babbage?','Which Stanton planet has the landing zone Area18?','Which Stanton planet is a gas giant with the floating city Orison?','Name one of Crusader\'s three moons.','Which outlaw station is hidden inside an asteroid orbiting Yela?','Which Stanton moon holds the Klescher prison?','Which manufacturer builds the Cutlass, the Caterpillar and the Vulture?','Which manufacturer builds the Carrack, the Arrow and the Hornet?','Which manufacturer builds the Gladius, the Avenger and the Idris?','Which manufacturer builds the 300 series and the 890 Jump?','Which manufacturer builds the Aurora and the Constellation?','Which manufacturer builds the Prospector, the Freelancer and the Starfarer?','What job is the Drake Vulture built for?','What job is the MISC Prospector built for?','What is the name of the faster-than-light travel mode used to cross a star system?','What is the annual Star Citizen fan convention called?','What does IAE stand for in Star Citizen?','Which noodle brand has vending machines all over Stanton?','What is the name of the in-game currency you earn in the live alpha, with its first letter?','Which company is Hurston\'s planet named after and run by?',
  'How many planets are in our Solar System?','Who was the first person to walk on the Moon?','In which year did humans first land on the Moon?','Who was the first human in space?','Which is the hottest planet in the Solar System?','Which is the smallest planet in the Solar System?','How many moons does Mars have?','What is the largest volcano in the Solar System, found on Mars?','What does ISS stand for?','Which space telescope launched in December 2021?','Roughly how fast does light travel, in kilometres per second?','What is the chemical symbol for gold?','What gas do plants absorb from the air?','What is the largest ocean on Earth?','What is the tallest mountain above sea level?','What is the capital city of Australia?','The Great Barrier Reef lies off which Australian state?','What is the largest animal that has ever lived?','What is the fastest land animal?','How many bones are in the adult human body?','How many continents are there?','At what temperature does water boil at sea level, in Celsius?','What is the hardest natural substance?','Who wrote Romeo and Juliet?','What is the currency of Japan?','Which country launched the first satellite into orbit?','How many sides does a hexagon have?'
];
const OLD_STARTERS=PREVIOUS_STARTERS.map(q=>({q}));
const TIERS=['blue','silver','gold','platinum'];
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const norm=v=>String(v??'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9! ]/g,' ').replace(/(?<=\S)!+/g,' ').replace(/\s+/g,' ').trim();
const int=(v,min,max,label)=>{const n=Number(v);if(!Number.isInteger(n)||n<min||n>max)throw new Error(label+' must be a whole number from '+min+' to '+max+'.');return n;};
const URL_RE=/(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|gg|tv|ly|me|xyz)\b)/i;

export function normalizeEngageSettings(raw={},base=ENGAGE_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},s=structuredClone(base);
  for(const k of Object.keys(ENGAGE_DEFAULTS))if(r[k]?.enabled!==undefined)s[k].enabled=r[k].enabled===true;
  if(r.relay){for(const [k,min,max] of [['threshold',5,1000],['damagePct',1,20],['perUserSeconds',0,60]])if(r.relay[k]!==undefined)s.relay[k]=int(r.relay[k],min,max,'Comms Relay '+k);}
  if(r.report?.reward!==undefined)s.report.reward=int(r.report.reward,0,REPORT_MAX,'The !report reward');
  if(r.quiz){if(r.quiz.reward!==undefined)s.quiz.reward=int(r.quiz.reward,0,REWARD_MAX,'The quiz reward');if(r.quiz.seconds!==undefined)s.quiz.seconds=int(r.quiz.seconds,15,600,'Quiz time (seconds)');if(r.quiz.autoMinutes!==undefined)s.quiz.autoMinutes=int(r.quiz.autoMinutes,0,240,'Automatic quiz (minutes)');}
  if(r.squadrons){const q=r.squadrons;
    if(q.names)for(const k of SQUADRONS)if(q.names[k]!==undefined){const n=clean(q.names[k],24);if(!n)throw new Error('Every squadron needs a name.');s.squadrons.names[k]=n;}
    for(const [k,min,max] of [['chat',0,100],['chatCap',0,1000],['mission',0,1000],['damageDiv',1,1000],['versusWin',0,1000]])if(q[k]!==undefined)s.squadrons[k]=int(q[k],min,max,'Squadron '+k);}
  if(r.arrivals){if(r.arrivals.minTier!==undefined){if(!TIERS.includes(r.arrivals.minTier))throw new Error('Unknown tier.');s.arrivals.minTier=r.arrivals.minTier;}if(r.arrivals.ranks!==undefined)s.arrivals.ranks=r.arrivals.ranks===true;}
  if(r.log?.perStream!==undefined)s.log.perStream=int(r.log.perStream,1,20,'Log entries per viewer');
  return s;
}

export class Engage{
  constructor({dataDir,now=Date.now,say=()=>{},boss=()=>null,cards=()=>null,community=()=>null,pilots=()=>[],random=Math.random}={}){
    Object.assign(this,{dataDir,now,boss,cards,community,pilots,random});
    // 2.21.5: every chat line Voyager tries to post is remembered with whether Streamer.bot took it, so "!report did nothing"
    // can be answered from the Chat engagement page instead of guessed.
    this.chatOut=[];
    this.say=(text,platform='')=>{const row={at:this.now(),text:String(text).slice(0,160),platform:platform||'all',ok:null,message:'sending…'};this.chatOut=[row,...this.chatOut].slice(0,12);
      let r;try{r=say(text,platform);}catch(e){r={ok:false,message:e?.message||'failed'};}
      const done=x=>{if(x&&typeof x==='object'){row.ok=!!x.ok;row.message=x.message||'';}else{row.ok=x!==false;row.message=row.ok?'sent':'not sent';}return x;};
      return Promise.resolve(r).then(done).catch(e=>{row.ok=false;row.message=e?.message||'failed';return {ok:false,message:row.message};});};
    this.state=this.fresh();this.saving=Promise.resolve();this.savedAt=0;this.dirty=false;this.relayUsers=new Map();this.lastChatAt=0;this.pendingReports=[];this.reportSaidAt=0;this.seq=0;
  }
  fresh(){const now=this.now();return {schema:1,settings:structuredClone(ENGAGE_DEFAULTS),stream:{id:0,lastAt:0},relay:{count:0,crew:[],fired:0,battle:0},
    reports:{},muster:[],quiz:{bank:QUIZ_STARTERS.map(x=>({id:randomUUID().slice(0,8),...x})),bankVersion:QUIZ_BANK_VERSION,active:null,history:[],lastAutoAt:0},
    squadrons:{members:{},week:{id:weekStart(now),chat:{},damage:{},versusBase:{},versus:{}},history:[]},
    arrivals:{stream:0,seen:{},ranks:{}},log:[],rewards:[],toasts:[]};}
  async load(){try{const raw=JSON.parse(await readFile(join(this.dataDir,FILE),'utf8'));if(raw?.schema===1){const f=this.fresh();this.state={...f,...raw,quiz:{...f.quiz,...raw.quiz},squadrons:{...f.squadrons,...raw.squadrons},arrivals:{...f.arrivals,...raw.arrivals}};
    // Settings saved before 2.20.24 may pay !report more than the new cap: bring them down rather than resetting everything.
    if(raw.settings?.report&&Number(raw.settings.report.reward)>REPORT_MAX)raw.settings.report.reward=REPORT_MAX;
    try{this.state.settings=normalizeEngageSettings(raw.settings||{});}catch{this.state.settings=structuredClone(ENGAGE_DEFAULTS);}
    // 2.20.94: the Star Citizen & general knowledge set replaces the original ten starters (questions the streamer added are kept), and a correct answer pays 5 points unless the reward was changed by hand.
    if((Number(raw.quiz?.bankVersion)||1)<QUIZ_BANK_VERSION){const oldQ=new Set(OLD_STARTERS.map(x=>x.q)),starterQ=new Set(QUIZ_STARTERS.map(x=>x.q));const kept=(this.state.quiz.bank||[]).filter(x=>!oldQ.has(x.q)&&!starterQ.has(x.q));
      this.state.quiz.bank=[...QUIZ_STARTERS.map(x=>({id:randomUUID().slice(0,8),...x})),...kept];this.state.quiz.bankVersion=QUIZ_BANK_VERSION;if(this.state.settings.quiz.reward===25)this.state.settings.quiz.reward=5;this.persist(true);}
    // 2.21.4: the quiz pays 5 points a correct answer (asked for in 2.20.94); a saved 10 or 25 from before becomes 5 once.
    if(!this.state.quizReward5){if([10,25].includes(this.state.settings.quiz.reward))this.state.settings.quiz.reward=5;this.state.quizReward5=true;this.persist(true);}
    if(!Array.isArray(this.state.quiz.asked)){this.state.quiz.asked=[...new Set((this.state.quiz.history||[]).map(h=>norm(h.q)).filter(Boolean))];this.persist(true);}
    // 2.25.0: start the Bridge Quiz leaderboard from the quiz wins still on file (the reward records kept for payouts).
    if(!this.state.quiz.scores){this.state.quiz.scores={};for(const b of [...(this.state.rewards||[])].reverse())if(String(b.id).startsWith('quiz-'))for(const p of b.pilots||[]){const st=this.state.stream;this.state.stream={id:-1};this.quizScore(p,b.reward,b.at);this.state.stream=st;}this.persist(true);}}}catch{}return this;}
  // Replace the bank with the shipped set (Voyager Control › Chat engagement).
  loadStarters(){this.state.quiz.bank=QUIZ_STARTERS.map(x=>({id:randomUUID().slice(0,8),...x}));this.state.quiz.bankVersion=QUIZ_BANK_VERSION;this.persist(true);return this.state.quiz.bank;}
  persist(force=false){if(!this.dataDir)return this.saving;if(!force&&this.now()-this.savedAt<15000){this.dirty=true;return this.saving;}
    this.savedAt=this.now();this.dirty=false;const data=JSON.stringify(this.state),tmp=join(this.dataDir,FILE+'.tmp');
    this.saving=this.saving.then(async()=>{await writeFile(tmp,data);await rename(tmp,join(this.dataDir,FILE));}).catch(()=>{});return this.saving;}
  toast(kind,data){this.state.toastSeq=(this.state.toastSeq||0)+1;const t={id:this.state.toastSeq,kind,at:this.now(),...data};this.state.toasts=[...this.state.toasts.filter(x=>this.now()-x.at<120000),t].slice(-30);return t;}
  key(chat){const p=String(chat.platform||'twitch').toLowerCase();if(!['twitch','youtube','kick'].includes(p))return '';const id=clean(chat.userId,128),login=clean(chat.login,60).toLowerCase();return id?p+':'+id:login?p+':@'+login:'';}
  // A "stream" here is a run of chat with no gap longer than 4 hours (or a Twitch StreamOnline).
  streamFor(now){const s=this.state.stream;if(!s.id||now-s.lastAt>SESSION_GAP){s.id=now;this.state.reports=this.state.reports||{};}s.lastAt=now;return s.id;}
  // keepMuster (2.23.1): the "Reset per-stream counters" button keeps tonight's !report muster — whoever has reported stays reported
  // and cannot collect again. A genuinely new stream (the automatic one after a long gap in chat) still starts a fresh muster.
  newStream(now=this.now(),{keepMuster=false}={}){const old=this.state.stream?.id,id=Math.max(now,(old||0)+1);
    if(keepMuster){const m=this.state.muster.find(x=>x.stream===old);if(m)m.stream=id;for(const r of Object.values(this.state.reports||{})){if(r.last===old)r.last=id;if(r.told===old)r.told=id;}}else this.pendingReports=[];
    this.state.stream={id,lastAt:now};this.persist(true);}

  // ---------- every chat message ----------
  chat(chat){
    const s=this.state.settings,now=this.now(),key=this.key(chat);if(!key)return null;
    const text=clean(chat.text,500),word=text.toLowerCase().split(' ')[0],name=clean(chat.name||chat.login,60)||'Crew',platform=key.split(':')[0];
    const stream=this.streamFor(now);this.lastChatAt=now;
    const who={key,name,platform,login:clean(chat.login,60).toLowerCase()};
    this.rollWeek(now);
    let out=null;
    if(word==='!report')out=this.report(who,stream);
    else if(word==='!squadron'||word==='!squad')out=this.squadron(who,text.split(' ')[1]||'');
    else if(word==='!log')out=this.logEntry(who,text.slice(word.length).trim(),stream);
    else if(word==='!quiz')out=this.quizStatus();
    // Not commands: the relay, the quiz answer, squadron chat points and the arrival card.
    if(!word.startsWith('!')){
      this.relay(who,now);
      if(this.state.quiz.active)this.answer(who,text);
      const m=this.state.squadrons.members[key];
      if(s.squadrons.enabled&&m){const c=this.state.squadrons.week.chat;const st=(c[key]||(c[key]={n:0,stream:0,streamN:0}));if(st.stream!==stream){st.stream=stream;st.streamN=0;}if(st.streamN<s.squadrons.chatCap){st.streamN++;st.n++;}}
    }
    this.arrival(who,stream);
    this.persist();return out;
  }

  // 1. Comms Relay
  relay(who,now){
    const s=this.state.settings.relay,b=this.boss();if(!s.enabled||!b?.battle||b.battle.phase!=='battle'||b.battle.demo)return;
    const r=this.state.relay;if(r.battle!==b.battle.id){r.battle=b.battle.id;r.count=0;r.crew=[];r.fired=0;}
    const last=this.relayUsers.get(who.key)||0;if(now-last<s.perUserSeconds*1000)return;this.relayUsers.set(who.key,now);
    r.count++;if(!r.crew.includes(who.key))r.crew.push(who.key);
    if(r.count>=s.threshold){const crew=r.crew.length;const dmg=b.relayStrike(s.damagePct,crew);r.count=0;r.crew=[];r.fired++;if(dmg)this.say('📡 COMMS RELAY at '+s.threshold+'! '+crew+' crew charged a fleet barrage: '+dmg.toLocaleString('en')+' damage. Keep chatting to charge the next one.');}
  }
  relayView(){const s=this.state.settings.relay,b=this.boss(),r=this.state.relay;const live=s.enabled&&b?.battle&&b.battle.phase==='battle'&&r.battle===b.battle.id;return {enabled:s.enabled,count:live?r.count:0,threshold:s.threshold,fired:live?r.fired:0};}

  // 2. Daily muster
  report(who,stream){
    const s=this.state.settings.report;if(!s.enabled)return null;
    const r=this.state.reports[who.key]||(this.state.reports[who.key]={last:0,streak:0,best:0,total:0});
    // 2.21.5: a second !report in the same stream gets one quiet answer instead of silence (viewers read silence as "broken").
    if(r.last===stream){if(r.told!==stream){r.told=stream;this.say('🫡 '+who.name+', you already reported for duty this stream'+(r.streak>1?' ('+r.streak+' in a row)':'')+'. Once a stream is all it takes.',who.platform);}return {ok:false,already:true};}
    // A streak counts streams in a row where they reported (the previous stream anyone reported in).
    const prev=this.state.muster.find(m=>m.stream!==stream)?.stream;r.streak=r.last&&r.last===prev?r.streak+1:1;
    r.last=stream;r.best=Math.max(r.best,r.streak);r.total++;
    let m=this.state.muster.find(x=>x.stream===stream);if(!m){m={stream,crew:[]};this.state.muster.unshift(m);this.state.muster=this.state.muster.slice(0,30);}
    m.crew.push({key:who.key,name:who.name,platform:who.platform,streak:r.streak});
    if(s.reward>0)this.addReward('muster-'+stream,'Daily muster',s.reward,'Muster',who);
    this.pendingReports.push({name:who.name,streak:r.streak,platform:who.platform});
    this.toast('report',{name:who.name,platform:who.platform,streak:r.streak,count:m.crew.length});
    return {ok:true,streak:r.streak};
  }
  // 3. Bridge Quiz
  ask(id){
    const s=this.state.settings.quiz,q=this.state.quiz;if(!s.enabled)throw new Error('Turn the Bridge Quiz on first.');if(q.active&&!q.active.winner&&this.now()<q.active.endsAt)throw new Error('A question is already running.');
    const bank=q.bank;if(!bank.length)throw new Error('Add a question first.');
    // 2.26.0: a question is asked once and never again. What has been asked is remembered by its wording (so editing the list,
    // reloading the set or a new set never brings one back); when every question has been used the quiz says so instead of repeating.
    const used=new Set(q.asked||(q.asked=[]));
    let pick=id?bank.find(x=>x.id===id):null;if(id&&!pick)throw new Error('Unknown question.');
    if(pick&&used.has(norm(pick.q)))throw new Error('That question has already been asked. Questions are never repeated.');
    if(!pick){const pool=bank.filter(x=>!used.has(norm(x.q)));if(!pool.length)throw new Error('Every question has been asked. Add new questions (questions are never repeated).');pick=pool[Math.floor(this.random()*pool.length)];}
    q.asked.push(norm(pick.q));if(q.asked.length>5000)q.asked=q.asked.slice(-5000);
    const now=this.now();q.active={id:randomUUID().slice(0,8),qid:pick.id,q:pick.q,a:pick.a,reward:s.reward,startedAt:now,endsAt:now+s.seconds*1000,winner:null};
    this.say('🧠 BRIDGE QUIZ: '+pick.q+' · First correct answer in chat wins '+s.reward+' Voyager points ('+s.seconds+'s).');
    this.toast('quiz',{q:pick.q});this.persist(true);return q.active;
  }
  answer(who,text){
    const a=this.state.quiz.active,now=this.now();if(!a||a.winner||now>a.endsAt)return false;
    const said=norm(text);if(!a.a.some(x=>{const n=norm(x);return said===n||said===n.replace(/^!/,'')||(n.length>=4&&(' '+said+' ').includes(' '+n+' '));}))return false;
    a.winner={key:who.key,name:who.name,platform:who.platform,at:now};
    if(a.reward>0)this.addReward('quiz-'+a.id,'Bridge Quiz: '+a.q.slice(0,40),a.reward,'Bridge Quiz',who);
    this.state.quiz.history=[{id:a.id,qid:a.qid,q:a.q,answer:a.a[0],winner:a.winner,at:now},...this.state.quiz.history].slice(0,50);
    this.quizScore(who,a.reward,now);
    this.say('🧠 '+who.name+' got it! The answer was '+a.a[0]+'. +'+a.reward+' Voyager points.');
    this.toast('quizwin',{name:who.name,platform:who.platform,answer:a.a[0],q:a.q});this.persist(true);return true;
  }
  // Bridge Quiz leaderboard (2.25.0): correct answers and points awarded per viewer, all-time and for the current stream.
  quizScore(who,points,now=this.now()){const sc=this.state.quiz.scores||(this.state.quiz.scores={}),stream=this.state.stream?.id||0;
    const r=sc[who.key]||(sc[who.key]={name:who.name,platform:who.platform,correct:0,points:0,last:0,stream:0,sCorrect:0,sPoints:0});
    if(r.stream!==stream){r.stream=stream;r.sCorrect=0;r.sPoints=0;}
    r.name=who.name;r.platform=who.platform;r.correct++;r.points+=Math.max(0,Number(points)||0);r.sCorrect++;r.sPoints+=Math.max(0,Number(points)||0);r.last=now;}
  quizBoard(limit=10){const sc=Object.values(this.state.quiz.scores||{}),stream=this.state.stream?.id||0,n=Math.max(1,Math.min(25,limit|0||10));
    const rank=(rows,c,p)=>rows.filter(r=>r[c]>0).sort((a,b)=>b[c]-a[c]||b[p]-a[p]||a.last-b.last).slice(0,n).map((r,i)=>({place:i+1,name:r.name,platform:r.platform,correct:r[c],points:r[p]}));
    const a=this.state.quiz.active,live=a&&!a.winner&&this.now()<a.endsAt;
    return {serverAt:this.now(),enabled:this.state.settings.quiz.enabled,all:rank(sc,'correct','points'),stream:rank(sc.filter(r=>r.stream===stream),'sCorrect','sPoints'),players:sc.length,asked:live?{endsAt:a.endsAt}:null,endedAt:a&&!live?(a.winner?.at||a.endsAt):0, // 2.25.1: when the last question finished (answered or timed out), so the panel can stay up for a while after
      last:this.state.quiz.history[0]?{name:this.state.quiz.history[0].winner?.name||'',at:this.state.quiz.history[0].at}:null};}
  resetQuizBoard(){this.state.quiz.scores={};this.persist(true);return true;}
  quizStatus(){const a=this.state.quiz.active;if(a&&!a.winner&&this.now()<a.endsAt)this.say('🧠 BRIDGE QUIZ: '+a.q+' · '+Math.ceil((a.endsAt-this.now())/1000)+'s left.');return null;}
  cancelQuiz(){const a=this.state.quiz.active;if(!a)throw new Error('No question is running.');this.state.quiz.active=null;this.persist(true);return true;}
  setBank(list){
    if(!Array.isArray(list)||list.length>500)throw new Error('Up to 500 questions.');
    this.state.quiz.bank=list.map(x=>{const q=clean(x?.q,160);const a=(Array.isArray(x?.a)?x.a:String(x?.a||'').split('|')).map(v=>clean(v,60)).filter(Boolean).slice(0,6);
      if(!q||!a.length)throw new Error('Every question needs the question and at least one answer.');return {id:/^[a-z0-9-]{1,12}$/.test(x?.id||'')?x.id:randomUUID().slice(0,8),q,a};});
    this.persist(true);return this.state.quiz.bank;
  }
  // 4. Squadrons
  squadron(who,pick){
    const s=this.state.settings.squadrons,sq=this.state.squadrons;if(!s.enabled)return null;
    const want=norm(pick).replace(/ wing$/,''),names=s.names,id=SQUADRONS.find(k=>k===want||norm(names[k])===norm(pick)||norm(names[k]).split(' ')[0]===want);
    const m=sq.members[who.key];
    if(!id){this.say('@'+who.name+' '+(m?'you fly with '+names[m.sq]+'. ':'')+'Enlist with !squadron '+SQUADRONS.join(' | ')+' ('+SQUADRONS.map(k=>names[k]).join(', ')+').',who.platform);return {ok:false};}
    if(m?.sq===id){this.say('@'+who.name+' you already fly with '+names[id]+'.',who.platform);return {ok:false};}
    if(m&&this.now()-m.joinedAt<30*DAY){this.say('@'+who.name+' you can change squadron once every 30 days (next on '+new Date(m.joinedAt+30*DAY).toLocaleDateString('en-AU',{day:'numeric',month:'short'})+').',who.platform);return {ok:false};}
    sq.members[who.key]={sq:id,name:who.name,platform:who.platform,login:who.login,joinedAt:this.now()};
    // Contributions start from now: past chat, damage and wins this week stay with the old squadron (or nobody).
    delete sq.week.chat[who.key];delete sq.week.damage[who.key];delete sq.week.versus[who.key];
    this.say('@'+who.name+' welcome to '+names[id]+'! Chat, missions, Dreadnought damage and Versus wins now score for your squadron.',who.platform);
    this.toast('enlist',{name:who.name,platform:who.platform,sq:id,sqName:names[id]});this.persist(true);return {ok:true,sq:id};
  }
  rollWeek(now){
    const sq=this.state.squadrons,w=weekStart(now);if(sq.week.id===w)return;
    const st=this.standings();if(st.some(x=>x.score>0))sq.history=[{week:sq.week.id,scores:Object.fromEntries(st.map(x=>[x.id,x.score])),winner:st[0].id},...sq.history].slice(0,26);
    sq.week={id:w,chat:{},damage:{},versusBase:{},versus:{}};this.persist(true);
  }
  observeBoss(r){if(!r||!Array.isArray(r.pilots))return;const d=this.state.squadrons.week.damage;for(const p of r.pilots){if(this.state.squadrons.members[p.key]&&p.damage>0)d[p.key]=(d[p.key]||0)+Math.round(p.damage);}this.persist();}
  observePilots(){
    const sq=this.state.squadrons,w=sq.week;let list=[];try{list=this.pilots()||[];}catch{}
    const byLogin=new Map(list.filter(p=>p&&p.login).map(p=>[String(p.login).toLowerCase(),Number(p.wins)||0]));
    for(const [key,m] of Object.entries(sq.members)){if(m.platform!=='twitch'||!m.login||!byLogin.has(m.login))continue;const wins=byLogin.get(m.login);
      if(w.versusBase[key]===undefined){w.versusBase[key]=wins;continue;}w.versus[key]=Math.max(0,wins-w.versusBase[key]);}
  }
  missionCount(){const out={};let list=[];try{list=this.community()?.completions()||[];}catch{}for(const c of list)if(c.key)out[c.key]=(out[c.key]||0)+1;return out;}
  contribution(key,missions){const s=this.state.settings.squadrons,w=this.state.squadrons.week;
    return (w.chat[key]?.n||0)*s.chat+(missions[key]||0)*s.mission+Math.floor((w.damage[key]||0)/s.damageDiv)+(w.versus[key]||0)*s.versusWin;}
  standings(){
    const s=this.state.settings.squadrons,sq=this.state.squadrons,missions=this.missionCount(),out=Object.fromEntries(SQUADRONS.map(k=>[k,{id:k,name:s.names[k],score:0,crew:0,top:[]}]));
    for(const [key,m] of Object.entries(sq.members)){const t=out[m.sq];if(!t)continue;t.crew++;const c=this.contribution(key,missions);t.score+=c;if(c>0)t.top.push({name:m.name,platform:m.platform,score:c});}
    for(const t of Object.values(out))t.top=t.top.sort((a,b)=>b.score-a.score).slice(0,5);
    return Object.values(out).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  }
  // 5. Arrival cards
  arrival(who,stream){
    const s=this.state.settings.arrivals,a=this.state.arrivals;if(!s.enabled)return;
    if(a.stream!==stream){a.stream=stream;a.seen={};}
    if(a.seen[who.key])return;a.seen[who.key]=1;
    const cards=this.cards(),cm=this.community()?.state?.members?.[who.key];if(!cards||!cm)return;
    const tier=cm.tier||cards.state?.members?.[who.key]?.tier||'blue';
    const {place}=cards.board(),lifetime=Math.max(Number(cm.value)||0,Number(cm.balance)||0),rank=cards.rankOf(lifetime,place.get(who.key));
    const before=a.ranks[who.key];a.ranks[who.key]=rank;
    const promoted=s.ranks&&before!==undefined&&rank>before;
    if(TIERS.indexOf(tier)<TIERS.indexOf(s.minTier)&&!promoted)return;
    const RANK_NAMES=['Midshipman','Acting Sub-Lieutenant','Sub-Lieutenant','Lieutenant','Lieutenant Commander','Commander','Captain','Commodore','Rear Admiral','Vice Admiral','Admiral','Admiral of the Fleet'];
    this.toast('arrival',{name:who.name,platform:who.platform,tier,rank,rankName:cards.state?.settings?.ranks===false?'':RANK_NAMES[rank]||'',promoted});
  }
  // 6. Captain's Log
  logEntry(who,text,stream){
    const s=this.state.settings.log;if(!s.enabled)return null;
    const t=clean(text,140);if(t.length<3){this.say('@'+who.name+' add your moment after !log, e.g. !log that torpedo was massive',who.platform);return {ok:false};}
    if(URL_RE.test(t))return {ok:false,link:true};
    const mine=this.state.log.filter(e=>e.stream===stream&&e.key===who.key);if(mine.length>=s.perStream)return {ok:false,limit:true};
    if(mine.some(e=>this.now()-e.at<60000))return {ok:false,cooldown:true};
    const e={id:randomUUID().slice(0,8),stream,key:who.key,name:who.name,platform:who.platform,text:t,at:this.now(),pinned:false,hidden:false};
    this.state.log=[e,...this.state.log].slice(0,500);this.toast('log',{name:who.name,platform:who.platform,text:t});return {ok:true,id:e.id};
  }
  moderateLog(id,{pinned,hidden}){const e=this.state.log.find(x=>x.id===id);if(!e)throw new Error('Log entry not found.');if(pinned!==undefined)e.pinned=pinned===true;if(hidden!==undefined)e.hidden=hidden===true;if(e.hidden)e.pinned=false;this.persist(true);return e;}

  // ---------- rewards (paid from Missions › Points owed) ----------
  addReward(id,title,reward,label,who){
    let b=this.state.rewards.find(x=>x.id===id);if(!b){b={id,title,reward,label,at:this.now(),pilots:[]};this.state.rewards.unshift(b);this.state.rewards=this.state.rewards.slice(0,60);}
    if(!b.pilots.some(p=>p.key===who.key))b.pilots.push({key:who.key,name:who.name,platform:who.platform});
  }
  rewardBatches(){return this.state.rewards.map(b=>({stamp:b.at,missionId:b.id.slice(0,32),title:b.title,reward:b.reward,label:b.label,pilots:b.pilots}));}

  // ---------- once a second ----------
  tick(){
    const now=this.now(),s=this.state.settings;
    const a=this.state.quiz.active;if(a&&!a.winner&&now>a.endsAt&&!a.closed){a.closed=true;this.say('🧠 Time! Nobody got it. The answer was '+a.a[0]+'.');this.state.quiz.history=[{id:a.id,qid:a.qid,q:a.q,answer:a.a[0],winner:null,at:now},...this.state.quiz.history].slice(0,50);this.toast('quizend',{answer:a.a[0],q:a.q});this.persist(true);}
    if(s.quiz.enabled&&s.quiz.autoMinutes>0&&now-this.lastChatAt<10*60000&&now-(this.state.quiz.lastAutoAt||0)>=s.quiz.autoMinutes*60000&&(!a||a.winner||now>a.endsAt)){this.state.quiz.lastAutoAt=now;try{this.ask();}catch{}}
    // The muster line goes to the platform the reports came from: Kick reports are announced on Kick only (2.20.25).
    if(this.pendingReports.length&&now-this.reportSaidAt>5000){const list=this.pendingReports.splice(0,25);this.reportSaidAt=now;const r=s.report.reward;
      for(const platform of [...new Set(list.map(x=>x.platform))]){const mine=list.filter(x=>x.platform===platform);
        this.say('🫡 Reporting for duty: '+mine.map(x=>x.name+(x.streak>1?' ('+x.streak+' in a row)':'')).join(', ')+(r?' · +'+r+' Voyager points each':'')+'. Type !report once a stream.',platform);}}
    if(this.dirty&&now-this.savedAt>=15000)this.persist(true);
  }

  // ---------- views ----------
  overlay({always=false}={}){ // always: the Dreadnought stage's squadron slot shows the standings whether or not the timed panel is on
    // 2.21.6: once someone has the answer the question is finished — it shows the winner for 10 s and leaves, however long the clock had left.
    const now=this.now(),a=this.state.quiz.active,showQuiz=a&&(a.winner?now-a.winner.at<10000:now<a.endsAt+8000);
    return {serverAt:now,toasts:this.state.toasts.filter(t=>now-t.at<60000),quiz:showQuiz?{id:a.id,q:a.q,endsAt:a.endsAt,duration:a.endsAt-a.startedAt,reward:a.reward,winner:a.winner?{name:a.winner.name,platform:a.winner.platform}:null,answer:a.winner||now>a.endsAt?a.a[0]:''}:null,
      squadrons:always||(this.state.panel&&!(this.state.panel.until&&now>this.state.panel.until))?{visible:true,until:this.state.panel?.until||0,standings:this.standings().map(({top,...x})=>({...x,top:top.slice(0,3)}))}:null};
  }
  showPanel(seconds){this.state.panel=seconds>0?{until:this.now()+seconds*1000}:null;if(this.state.panel&&seconds>=3600)this.state.panel.until=0;this.persist(true);return this.state.panel;}
  view(){
    const st=this.state;if(st.panel?.until&&this.now()>st.panel.until)st.panel=null;
    const stream=st.stream.id,muster=st.muster.find(m=>m.stream===stream);
    return {settings:st.settings,defaults:ENGAGE_DEFAULTS,stream:{id:stream,lastAt:st.stream.lastAt},relay:this.relayView(),chatOut:this.chatOut,
      muster:{count:muster?.crew.length||0,crew:(muster?.crew||[]).slice(-40).reverse()},
      quiz:{bank:st.quiz.bank.map(x=>({...x,asked:(st.quiz.asked||[]).includes(norm(x.q))})),remaining:st.quiz.bank.filter(x=>!(st.quiz.asked||[]).includes(norm(x.q))).length,active:st.quiz.active,history:st.quiz.history.slice(0,15),board:this.quizBoard(10)},
      squadrons:{standings:this.standings(),members:Object.keys(st.squadrons.members).length,history:st.squadrons.history.slice(0,8),weekId:st.squadrons.week.id,panel:!!st.panel&&!(st.panel.until&&this.now()>st.panel.until),panelUntil:st.panel?.until||0},
      log:st.log.filter(e=>!e.hidden).slice(0,80),rewards:st.rewards.slice(0,12).map(b=>({title:b.title,label:b.label,reward:b.reward,count:b.pilots.length,at:b.at}))};
  }
  configure(raw){this.state.settings=normalizeEngageSettings({...this.state.settings,...raw},this.state.settings);this.persist(true);return this.view();}
  // Public site: squadron standings and the Captain's Log pinned from the latest stream that has any.
  publicView(){
    const pinned=this.state.log.filter(e=>e.pinned&&!e.hidden),stream=pinned[0]?.stream||0;
    return {squadrons:this.state.settings.squadrons.enabled?{standings:this.standings(),history:this.state.squadrons.history.slice(0,6).map(h=>({week:h.week,winner:h.winner,scores:h.scores})),weekEndsAt:this.state.squadrons.week.id+7*DAY}:null,
      log:this.state.settings.log.enabled&&stream?{stream,entries:pinned.filter(e=>e.stream===stream).slice(0,12).map(e=>({name:e.name,platform:e.platform,text:e.text,at:e.at}))}:null};
  }
}
