# Pong Server

Multiplayer version of pong implemented using Express.js and Socket.IO

https://github.com/henryfok/pong

### Demo

https://pong-henry.herokuapp.com

### Installation

```sh
git clone git@github.com:henryfok/pong-server.git
npm install
node index.js
```

```sh
http://localhost:3000/
```


### Changelog
- Score now handled by the server and synced to clients
- Player side selection menu reset
- Server state reset

### To-Do
- Round reset still sometimes not syncing
- Regen random ball angle every round
- Sync ball location when hitting walls