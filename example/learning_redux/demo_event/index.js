const gameEvent = require('./gameEvent.js'); 

// state
let gameState = {
    hp: 1000,
    exp: 0
}

// UI
function renderUI(state){
    // ...
    // renderHp(state.hp)
    // renderExp(state.exp)
    // ...
    console.log('render UI success,new state is:',state);
}

// 动作
gameEvent.on('drop_hp',function(e){
    // update state
    gameState.hp -= e.hurt;

    renderUI(gameState);
});
gameEvent.on('add_exp',function(e){
    // update state
    gameState.exp += e.exp;

    renderUI(gameState);
});

// 下面是交互代码
let e;
e = {
    type: 'drop_hp',
    hurt: 10,
}
// 受到1次伤害，触发 drop_hp 动作
gameEvent.dispatch(e);

// 经验值增加，触发 add_exp 动作
e = {
    type: 'add_exp',
    exp: 2,
}
gameEvent.dispatch(e);