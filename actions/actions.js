export function gameChangeLevel(level, speed) {
    return {
      type:'GAME_CHANGE_LEVEL',
          level: level,
          speed: speed

    };
}
