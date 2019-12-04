const { createStore } = require('redux');

// state
const gameState = {
    hp: 1000,
    exp: 0
};

// Reducder
function Reducder(state = gameState, action) {
    let newState = null;
    switch (action.type) {
        case 'drop_hp':
            newState = Object.assign({}, state);
            newState.hp -= action.hurt;
            return newState;
        case 'add_exp':
            newState = Object.assign({}, state);
            newState.exp += action.exp;
            return newState;
        default:
            return state;
    }
}

// 创建 store
const store = createStore(Reducder);

// 注册 UI 更新代码
store.subscribe(function renderUI() {
    // ...
    // renderHp(state.hp)
    // renderExp(state.exp)
    // ...
    console.log('render UI success,new state is:', store.getState());
});

// 下面是交互代码，将会触发更新
let action;
action = {
    type: 'drop_hp',
    hurt: 10,
}
// 受到1次伤害，触发 drop_hp 动作
store.dispatch(action);

// 经验值增加，触发 add_exp 动作
action = {
    type: 'add_exp',
    exp: 2,
}
store.dispatch(action);