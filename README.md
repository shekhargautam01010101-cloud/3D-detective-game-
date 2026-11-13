# Blackwood Mystery 3D

A small, playable browser-based 3D detective game prototype for the Blackwood Mansion case. Explore the mansion, collect six pieces of evidence, question four suspects, and make the final accusation.

## Play

Open `index.html` in a modern browser while connected to the internet. The game uses Three.js from jsDelivr and Google Fonts, so those CDN resources must be reachable. For local development, serve the repository with any static HTTP server, for example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Controls

- **WASD** — move
- **Shift** — run
- **Drag the mouse** — rotate the third-person camera
- **E** — collect nearby evidence or talk to a suspect
- **Tab** — open/close the case evidence board
- **Escape** — close a conversation or the evidence board

## Current prototype scope

- Procedurally assembled low-poly mansion interior with a study, bedroom, kitchen, hall, and garden room
- Third-person detective character, camera controls, room labels, and interaction prompts
- Six collectible clues, suspect dialogue, an evidence board, and an accusation/result flow
- The intended culprit is Aman; clues and dialogue are designed to connect his motive and alibi to the case

This version is a **single-player browser prototype**. Firebase accounts, online co-op, live shared evidence, chat, persistent scores/leaderboards, Unity project files, and the cinematic are not implemented. Those require separate backend/network and Unity work; the prototype does not claim multiplayer functionality.

## Project files

- `index.html` — game interface and overlays
- `game.js` — Three.js scene, movement, interactions, and case logic
- `style.css` — responsive visual design
