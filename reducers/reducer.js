export default function(state = {}, action) {
    if (action.type == 'GAME_CHANGE_LEVEL') {
        state = Object.assign({}, state, {
            level: action.level,
            speed: action.speed
        });
    }
    if (action.type == 'GAME_SET_SOUND') {
        state = Object.assign({}, state, {
            muted: action.muted
        });
    }
    if (action.type == 'GAME_RESTART') {
        state = Object.assign({}, state, {
            restart: action.restart
        });
    }
    return state;
}
