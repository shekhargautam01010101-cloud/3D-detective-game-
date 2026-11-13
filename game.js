import * as THREE from 'three';

const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101715);
scene.fog = new THREE.FogExp2(0x101715, 0.012);
const camera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 120);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

scene.add(new THREE.HemisphereLight(0xb6c4b8, 0x211c19, 1.15));
const moon = new THREE.DirectionalLight(0xc9d9cf, 2.15);
moon.position.set(-12, 21, 12); moon.castShadow = true;
moon.shadow.mapSize.set(1024, 1024); moon.shadow.camera.left = -24; moon.shadow.camera.right = 24; moon.shadow.camera.top = 24; moon.shadow.camera.bottom = -24;
scene.add(moon);
const warm = new THREE.PointLight(0xffbd72, 24, 15, 2); warm.position.set(-8, 3.2, -6); scene.add(warm);
const warm2 = new THREE.PointLight(0xffd18e, 22, 14, 2); warm2.position.set(8, 3.2, -6); scene.add(warm2);
const warm3 = new THREE.PointLight(0xffbd72, 19, 14, 2); warm3.position.set(-8, 3.2, 6); scene.add(warm3);
const hallLight = new THREE.PointLight(0xc0d6ca, 17, 18, 2); hallLight.position.set(0, 5, 0); scene.add(hallLight);

const mat = (color, roughness = 0.86) => new THREE.MeshStandardMaterial({ color, roughness });
const materials = {
  floor: mat(0x443a30), wood: mat(0x33271e), wall: mat(0x51483e), trim: mat(0x211c18), stone: mat(0x57534a), rug: mat(0x58312e), gold: mat(0xb28b51, 0.5), green: mat(0x31463c), fabric: mat(0x817361), paper: mat(0xd0bb91), metal: mat(0x555b58, 0.35)
};
function box(name, x, y, z, w, h, d, material, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.name = name; mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true;
  if (options.rotation) mesh.rotation.set(...options.rotation);
  scene.add(mesh); return mesh;
}
function cylinder(x, y, z, rt, rb, h, material, radial = 12) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, radial), material);
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh); return mesh;
}

// Mansion shell, floorboards, four connected rooms, and a central corridor.
box('ground', 0, -0.24, 0, 31, 0.45, 25, mat(0x171b18));
box('mansion-floor', 0, 0, 0, 26, 0.24, 20, materials.floor);
for (let x = -12.4; x <= 12.4; x += 1.1) box('floorboard', x, 0.127, 0, 0.035, 0.012, 19.7, mat(0x594a3a));
const wallH = 4.4;
// Exterior walls with large doorway gaps on the front and back.
box('north-wall', 0, wallH / 2, -10, 26, wallH, 0.45, materials.wall);
box('west-wall', -13, wallH / 2, 0, 0.45, wallH, 20, materials.wall);
box('east-wall', 13, wallH / 2, 0, 0.45, wallH, 20, materials.wall);
box('south-left', -9, wallH / 2, 10, 8, wallH, 0.45, materials.wall);
box('south-right', 9, wallH / 2, 10, 8, wallH, 0.45, materials.wall);
// Interior partitions, deliberately open at the hall doors.
box('west-cross-a', -6, wallH / 2, -7, 0.25, wallH, 6);
box('west-cross-b', -6, wallH / 2, 7, 0.25, wallH, 6);
box('east-cross-a', 6, wallH / 2, -7, 0.25, wallH, 6);
box('east-cross-b', 6, wallH / 2, 7, 0.25, wallH, 6);
box('center-north-left', -2.25, wallH / 2, -3.2, 7.5, wallH, 0.25, materials.wall);
box('center-north-right', 9, wallH / 2, -3.2, 8, wallH, 0.25, materials.wall);
box('center-south-left', -9, wallH / 2, 3.2, 8, wallH, 0.25, materials.wall);
box('center-south-right', 2.25, wallH / 2, 3.2, 7.5, wallH, 0.25, materials.wall);
// Top trim and windows add a mansion silhouette.
for (const x of [-10.5, -8, -3.4, 3.4, 8, 10.5]) {
  box('window', x, 2.55, -9.73, 1.35, 1.65, 0.08, mat(0x263531, 0.3));
  box('window-glow', x, 2.55, -9.67, 1.13, 1.43, 0.04, mat(0x768779, 0.3));
  box('window-mullion', x, 2.55, -9.58, 0.07, 1.5, 0.06, materials.trim);
}
for (let x = -12; x <= 12; x += 4) box('cornice', x, 4.47, 0, 0.12, 0.18, 20, materials.trim);

// Furnishings: study, bedroom, kitchen, garden room, and a grand hall.
box('study-rug', -9, 0.15, -6.5, 4.8, 0.035, 4.4, materials.rug);
box('study-desk', -10, 0.9, -8.2, 3.2, 0.3, 1.25, materials.wood);
for (const x of [-11.2, -8.8]) for (const z of [-8.6, -7.8]) box('desk-leg', x, 0.48, z, 0.13, 0.75, 0.13, materials.wood);
box('bookcase', -12.2, 1.55, -5.8, 0.5, 3, 3.5, materials.wood);
for (let y = 0.65; y < 2.8; y += 0.65) box('bookshelf', -11.9, y, -5.8, 0.15, 0.1, 3.15, materials.gold);
for (let i = 0; i < 10; i++) box('book', -11.75, 0.82 + Math.floor(i / 5) * 0.65, -7 + (i % 5) * 0.52, 0.2, 0.46, 0.31, mat([0x70483b, 0x435349, 0x88714d][i % 3]));
box('bed-frame', 9, 0.5, -7, 4.6, 0.55, 3.6, materials.wood);
box('bed-cover', 9, 0.85, -7, 4.35, 0.25, 3.35, materials.fabric);
box('pillow-a', 8, 1.02, -8.15, 1.5, 0.22, 0.7, mat(0xc6bda8)); box('pillow-b', 10, 1.02, -8.15, 1.5, 0.22, 0.7, mat(0xc6bda8));
box('kitchen-counter', -9, 0.92, 7.9, 6, 0.25, 1.1, materials.stone);
for (let x = -11.5; x <= -6.5; x += 1.65) box('cabinet', x, 0.52, 7.9, 1.45, 0.7, 0.95, materials.wood);
box('kitchen-table', -9, 0.9, 5, 3.1, 0.22, 1.9, materials.wood);
for (const x of [-10.2, -7.8]) for (const z of [4.35, 5.65]) box('table-leg', x, 0.46, z, 0.12, 0.72, 0.12, materials.wood);
box('dining-table', 0, 0.85, 0, 5.2, 0.22, 2.3, materials.wood);
for (const x of [-2, 2]) for (const z of [-0.8, 0.8]) box('dining-leg', x, 0.43, z, 0.14, 0.75, 0.14, materials.wood);
box('hall-runner', 0, 0.145, -5.1, 2.8, 0.04, 4.4, materials.rug);
// Potted plants in the garden and room corners.
for (const [x, z] of [[8, 7.7], [11, 5], [-11.7, 1.5], [11.7, 1.4]]) {
  cylinder(x, 0.38, z, 0.42, 0.5, 0.7, mat(0x67503c));
  const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.82, 1), materials.green); leaves.position.set(x, 1.35, z); leaves.castShadow = true; scene.add(leaves);
  for (let i = 0; i < 4; i++) { const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.35, 6), materials.green); leaf.position.set(x + Math.cos(i * 1.57) * 0.35, 1.55, z + Math.sin(i * 1.57) * 0.35); leaf.rotation.z = -0.25; scene.add(leaf); }
}

// Player is a low-poly third-person detective, built from simple shapes.
const player = new THREE.Group(); scene.add(player);
const coat = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.66, 4, 8), mat(0x39423d)); coat.position.y = 1.08; coat.castShadow = true; player.add(coat);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), mat(0xc49b79)); head.position.y = 1.78; head.castShadow = true; player.add(head);
const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.37, 0.12, 12), mat(0x282b28)); hat.position.y = 2.03; player.add(hat);
const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.055, 12), mat(0x282b28)); brim.position.y = 1.97; player.add(brim);
for (const x of [-0.17, 0.17]) { const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.5, 3, 6), mat(0x262b29)); leg.position.set(x, 0.4, 0.02); leg.castShadow = true; player.add(leg); }
player.position.set(0, 0.15, 7.8);

const suspects = [
  { id: 'rahul', name: 'Rahul Mehta', role: 'The business partner', color: 0x52667b, pos: [-4.3, 0.15, -7.7], motive: 'Arjun planned to end their partnership and take control of the estate.', statement: 'I was in the library all evening. I never went near the study.' },
  { id: 'aman', name: 'Aman Blackwood', role: 'The nephew', color: 0x76504a, pos: [9.4, 0.15, 0.1], motive: 'He was recently removed from Arjun’s will.', statement: 'I was in my bedroom before ten. I did not see my uncle tonight.' },
  { id: 'priya', name: 'Priya Sharma', role: 'The housekeeper', color: 0x68745b, pos: [-9.2, 0.15, 2.1], motive: 'Arjun accused her of stealing a valuable family heirloom.', statement: 'I was preparing supper in the kitchen. I heard a noise from upstairs.' },
  { id: 'karan', name: 'Karan Singh', role: 'The groundskeeper', color: 0x9a8159, pos: [3.8, 0.15, 7.5], motive: 'Arjun intended to sell the garden Karan had cared for for years.', statement: 'I was outside checking the storm damage. The garden gate was stuck.' }
];
const suspectMeshes = new Map();
for (const s of suspects) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.66, 4, 8), mat(s.color)); body.position.y = 1.02; body.castShadow = true; group.add(body);
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), mat(0xb99071)); face.position.y = 1.72; face.castShadow = true; group.add(face);
  const marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.15), materials.gold); marker.position.y = 2.35; group.add(marker);
  group.position.set(...s.pos); group.userData.suspect = s; scene.add(group); suspectMeshes.set(s.id, group);
}

const clueData = [
  { id: 'letter', name: 'Torn letter', room: 'Study', pos: [-9.4, 0.48, -7.65], text: 'A torn letter from Arjun: “...the will is changed. Aman will receive nothing after tonight.” The ink is still fresh.' },
  { id: 'watch', name: 'Stopped pocket watch', room: 'Study', pos: [-7.6, 0.32, -5.3], text: 'Arjun’s pocket watch stopped at 9:40 PM. A faint smear of dark red wax clings to its cover.' },
  { id: 'footprint', name: 'Muddy footprint', room: 'Bedroom', pos: [7.2, 0.22, -5.3], text: 'A muddy shoe print beside the window. The tread is clean and narrow—not the heavy boots worn by the groundskeeper.' },
  { id: 'key', name: 'Brass key', room: 'Bedroom', pos: [10.8, 0.35, -8.2], text: 'A brass key hidden beneath the bed. The initials A.B. are scratched into its handle.' },
  { id: 'cctv', name: 'CCTV log', room: 'Kitchen', pos: [-6.6, 1.05, 7.4], text: 'The hallway camera shows someone entering the study at 9:32 PM and leaving at 9:47. The face is obscured, but a signet ring catches the light.' },
  { id: 'ring', name: 'Signet ring impression', room: 'Garden', pos: [8.9, 0.3, 6.4], text: 'A fresh impression in the damp garden soil: the crest matches the Blackwood family signet. Aman wears the only matching ring.' }
];
const clues = new Map();
for (const clue of clueData) {
  const group = new THREE.Group();
  const glow = new THREE.PointLight(0xe4bd70, 5, 3); glow.position.y = 0.55; group.add(glow);
  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 1), new THREE.MeshStandardMaterial({ color: 0xf2cc7a, emissive: 0x8c5a1b, emissiveIntensity: 1.5, roughness: 0.35 })); orb.position.y = 0.55; group.add(orb);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.025, 6, 20), materials.gold); ring.rotation.x = Math.PI / 2; ring.position.y = 0.16; group.add(ring);
  group.position.set(...clue.pos); group.userData.clue = clue; scene.add(group); clues.set(clue.id, group);
}

const keys = new Set(); let yaw = Math.PI; let pitch = 0.22; let dragging = false; let lastPointer = { x: 0, y: 0 }; let activeTarget = null; let started = false; let finished = false;
const found = new Set(); const questioned = new Set(); let wrongGuesses = 0; let toastTimer;
const el = (id) => document.getElementById(id);
const roomLabel = el('room-name');
function showToast(message) { const t = el('toast'); t.textContent = message; t.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('visible'), 2600); }
function openModal(id) { el(id).classList.remove('hidden'); keys.clear(); }
function closeModal(id) { el(id).classList.add('hidden'); }
function updateClueCount() { el('clue-count').textContent = found.size; el('progress-fill').style.width = `${found.size / clueData.length * 100}%`; }
function updateBoard() {
  el('board-evidence-total').textContent = found.size;
  el('evidence-list').innerHTML = clueData.filter(c => found.has(c.id)).map(c => `<article class="evidence-card"><span class="evidence-tag">${c.room.toUpperCase()}</span><strong>${c.name}</strong><p>${c.text}</p></article>`).join('') || '<div class="empty-state">No evidence collected yet.<br>Search the rooms for the golden markers.</div>';
  el('suspect-list').innerHTML = suspects.map(s => `<article class="suspect-card"><span class="suspect-avatar" style="--avatar:${new THREE.Color(s.color).getStyle()}">${s.name[0]}</span><div><strong>${s.name}</strong><small>${s.role}</small><p>${s.motive}</p><span class="questioned ${questioned.has(s.id) ? 'done' : ''}">${questioned.has(s.id) ? '✓ QUESTIONED' : 'NOT QUESTIONED'}</span></div></article>`).join('');
  el('accuse-button').disabled = found.size < 2 || questioned.size < 2;
  el('board-hint').textContent = found.size < 2 || questioned.size < 2 ? `Collect at least 2 clues and question 2 suspects to unlock accusation. (${found.size}/2 clues · ${questioned.size}/2 questioned)` : 'The team has enough evidence to make an accusation.';
}
function interact() {
  if (!activeTarget || !started || finished) return;
  if (activeTarget.kind === 'clue') {
    const c = activeTarget.data; if (found.has(c.id)) return;
    found.add(c.id); scene.remove(clues.get(c.id)); clues.delete(c.id); updateClueCount(); showToast(`Evidence collected: ${c.name}`); updateBoard();
  } else {
    const s = activeTarget.data; questioned.add(s.id); el('dialog-kicker').textContent = `INTERROGATION · ${s.role.toUpperCase()}`; el('dialog-title').textContent = s.name;
    const contradiction = s.id === 'aman' && found.has('letter') ? 'You show him the torn letter. His confidence falters. “I... I didn’t know he had changed it,” he says. His alibi is starting to crack.' : s.id === 'aman' && found.has('cctv') ? 'You mention the signet ring in the CCTV log. Aman instinctively covers his hand. “That could be anyone,” he insists.' : `${s.statement} ${found.size ? 'The evidence board may help you ask better questions.' : 'You should search the mansion before drawing conclusions.'}`;
    el('dialog-copy').textContent = `“${s.statement}”\n\n${contradiction}`;
    el('dialog-options').innerHTML = `<button class="dialog-option" id="ask-motive">Ask about the motive <span>→</span></button><button class="dialog-option" id="ask-alibi">Challenge the alibi <span>→</span></button><button class="dialog-option subtle" data-close="dialog-modal">End conversation <span>×</span></button>`;
    openModal('dialog-modal'); updateBoard();
    el('ask-motive').onclick = () => { el('dialog-copy').textContent = `“${s.motive}” ${s.id === 'aman' ? 'Aman looks away. “The will was a family matter. I never wanted Arjun harmed.”' : `“That does not mean I would hurt him,” ${s.name.split(' ')[0]} replies.`}`; };
    el('ask-alibi').onclick = () => { const response = s.id === 'aman' && (found.has('letter') || found.has('cctv')) ? 'Aman hesitates. The timeline and the evidence contradict his story. He was in the study, and he had a reason to confront Arjun.' : `“I have told you where I was,” ${s.name.split(' ')[0]} says. Find more evidence before pressing further.`; el('dialog-copy').textContent = response; };
    document.querySelectorAll('[data-close="dialog-modal"]').forEach(b => b.onclick = () => closeModal('dialog-modal'));
  }
}

el('begin-button').addEventListener('click', () => { closeModal('welcome'); started = true; showToast('Inspector Rao: Search every room. Trust the evidence.'); });
el('board-button').addEventListener('click', () => { updateBoard(); openModal('board-modal'); });
document.querySelectorAll('.close-button').forEach(b => b.addEventListener('click', () => closeModal(b.dataset.close)));
el('accuse-button').addEventListener('click', () => {
  if (found.size < 2 || questioned.size < 2) return;
  el('dialog-kicker').textContent = 'FINAL ACCUSATION · SELECT ONE SUSPECT'; el('dialog-title').textContent = 'Who killed Arjun?';
  el('dialog-copy').textContent = 'Present your team’s conclusion. Once you accuse, the case will be closed.';
  el('dialog-options').innerHTML = suspects.map(s => `<button class="dialog-option accusation" data-suspect="${s.id}">${s.name}<span>→</span></button>`).join('');
  closeModal('board-modal'); openModal('dialog-modal');
  document.querySelectorAll('[data-suspect]').forEach(b => b.addEventListener('click', () => finishCase(b.dataset.suspect)));
});
function finishCase(id) {
  finished = true; closeModal('dialog-modal'); const won = id === 'aman';
  const score = won ? Math.max(100, 1000 + found.size * 125 + questioned.size * 75 - wrongGuesses * 250) : Math.max(0, found.size * 50 + questioned.size * 25);
  el('result-stamp').textContent = won ? 'CASE SOLVED' : 'WRONG ACCUSATION'; el('result-stamp').className = `result-stamp ${won ? 'success' : 'failure'}`;
  el('result-title').textContent = won ? 'The nephew did it.' : 'The real killer is still free.';
  el('result-copy').textContent = won ? 'Aman confronted Arjun about the changed will in the study. The CCTV timeline, his family signet in the garden, and the fresh letter expose his lie. Inspector Rao takes him into custody.' : 'The evidence points elsewhere. Aman’s changed inheritance, the study timeline, and the Blackwood signet reveal the truth. Inspector Rao reopens the case.';
  el('score-value').textContent = score.toLocaleString(); openModal('result-modal');
}
el('replay-button').addEventListener('click', () => location.reload());

function getRoom(x, z) {
  if (x < -6) return z < 0 ? 'THE STUDY' : z > 0 ? 'THE KITCHEN' : 'WEST WING';
  if (x > 6) return z < 0 ? 'ARJUN’S BEDROOM' : z > 0 ? 'THE GARDEN ROOM' : 'EAST WING';
  return Math.abs(z) < 3.4 ? 'MAIN HALL' : z < 0 ? 'NORTH CORRIDOR' : 'SOUTH CORRIDOR';
}
function findTarget() {
  let nearest = null; let min = 1.8;
  for (const [id, group] of clues) { const c = clueData.find(item => item.id === id); const d = player.position.distanceTo(group.position); if (d < min) { min = d; nearest = { kind: 'clue', data: c, distance: d }; } }
  for (const s of suspects) { const group = suspectMeshes.get(s.id); const d = player.position.distanceTo(group.position); if (d < min + 0.45) { min = d; nearest = { kind: 'suspect', data: s, distance: d }; } }
  return nearest;
}
function movePlayer(dt) {
  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  const direction = new THREE.Vector3();
  if (keys.has('KeyW')) direction.add(forward); if (keys.has('KeyS')) direction.sub(forward);
  if (keys.has('KeyD')) direction.add(right); if (keys.has('KeyA')) direction.sub(right);
  if (direction.lengthSq()) {
    direction.normalize(); const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? 6.2 : 3.7;
    const nextX = THREE.MathUtils.clamp(player.position.x + direction.x * speed * dt, -12.2, 12.2);
    const nextZ = THREE.MathUtils.clamp(player.position.z + direction.z * speed * dt, -9.2, 9.2);
    // Simple collision against major interior partitions and furniture.
    const blocked = (x, z) => (Math.abs(x + 6) < 0.62 && Math.abs(z) > 3.2) || (Math.abs(x - 6) < 0.62 && Math.abs(z) > 3.2) || (Math.abs(z + 3.2) < 0.55 && (x < -6.1 || x > 6.1)) || (Math.abs(z - 3.2) < 0.55 && (x < -6.1 || x > 6.1)) || Math.abs(x) > 12.1 || Math.abs(z) > 9.1;
    if (!blocked(nextX, player.position.z)) player.position.x = nextX;
    if (!blocked(player.position.x, nextZ)) player.position.z = nextZ;
    player.rotation.y = Math.atan2(direction.x, direction.z);
  }
}
function animate() {
  requestAnimationFrame(animate); const dt = Math.min(clock.getDelta(), 0.05);
  if (started && !finished && el('dialog-modal').classList.contains('hidden') && el('board-modal').classList.contains('hidden')) movePlayer(dt);
  const target = new THREE.Vector3(player.position.x, player.position.y + 1.5, player.position.z);
  const horizontal = 7.6 * Math.cos(pitch); const vertical = 7.6 * Math.sin(pitch) + 1.9;
  const desired = new THREE.Vector3(target.x + Math.sin(yaw) * horizontal, target.y + vertical, target.z + Math.cos(yaw) * horizontal);
  camera.position.lerp(desired, 1 - Math.exp(-5 * dt)); camera.lookAt(target);
  for (const group of clues.values()) { group.rotation.y += dt * 0.65; group.children[1].position.y = 0.55 + Math.sin(performance.now() * 0.002 + group.position.x) * 0.08; }
  for (const group of suspectMeshes.values()) { if (group.children[2]) group.children[2].rotation.y += dt * 0.7; }
  if (started && !finished) {
    roomLabel.textContent = getRoom(player.position.x, player.position.z);
    activeTarget = findTarget(); const prompt = el('interaction');
    if (activeTarget) { prompt.classList.remove('hidden'); el('interaction-label').textContent = activeTarget.kind === 'clue' ? `Collect ${activeTarget.data.name}` : `Talk to ${activeTarget.data.name}`; }
    else prompt.classList.add('hidden');
  }
  renderer.render(scene, camera);
}
const clock = new THREE.Clock();
window.addEventListener('keydown', e => {
  if (['Tab', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'Tab' && started) { if (el('board-modal').classList.contains('hidden')) { updateBoard(); openModal('board-modal'); } else closeModal('board-modal'); return; }
  if (e.code === 'Escape') { closeModal('dialog-modal'); closeModal('board-modal'); }
  if (e.code === 'KeyE' && !e.repeat && el('dialog-modal').classList.contains('hidden') && el('board-modal').classList.contains('hidden')) interact();
  keys.add(e.code);
});
window.addEventListener('keyup', e => keys.delete(e.code));
canvas.addEventListener('pointerdown', e => { if (!started || !el('dialog-modal').classList.contains('hidden') === false || !el('board-modal').classList.contains('hidden') === false) return; dragging = true; lastPointer = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => { if (!dragging) return; yaw -= (e.clientX - lastPointer.x) * 0.005; pitch = THREE.MathUtils.clamp(pitch + (e.clientY - lastPointer.y) * 0.003, -0.05, 0.72); lastPointer = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', () => dragging = false);
window.addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7)); });
setTimeout(() => el('loading').classList.add('gone'), 700);
updateBoard(); animate();
