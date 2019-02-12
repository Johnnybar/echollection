export function gameChangeLevel(level, speed) {
    return {
      type:'GAME_CHANGE_LEVEL',
          level: level,
          speed: speed

    };
}
export function gameSetSound(muted) {
    return {
      type:'GAME_SET_SOUND',
          muted: muted
    };
}
export function gameRestart(restart) {
    return {
      type:'GAME_RESTART',
          restart: restart
    };
}
