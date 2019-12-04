# `Redux` 基础教程：通过数据流认识 `Redux`
> Redux教程 Redux数据流

## 序
相当一部分人接触 `Redux` 都是在通过 `React` 应用。将 `React` 与 `Redux` 一起使用，往往又会用到 `react-redux`。这样一来，诸多概念参杂在一起，让人乱了手脚。所以，先暂时将 `React` 和 `react-redux` 搁置一边，来重新认识 `Redux`。

## 什么是 `Redux`？
`Redux` 是一个状态管理器。让我们先忘掉这个概念，来看看有着 `Redux` 的应用的示意图 1_0：

![场景示意图1](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/learn_redux_basic/redux_1_0.png)

过程是：`state数据 --> 渲染 --> UI界面`

而当有人参与到交互中，会变成示意图 1_1：

![场景示意图2](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/learn_redux_basic/redux_1_1.png)

过程是：`触发更改 --> 更新 state --> state数据 --> 渲染 --> UI界面`

这是一个典型的 `Redux` 应用模型，抛开模型中的**渲染**、**UI**部分，剩下的就是 `Redux` 所发挥作用的地方。记住，`Redux` 并不涉及具体的渲染 UI 部分。

## 从一个示例开始
我们的示例很简单，维护两个游戏数据：`hp` 血量 和 `exp` 经验值。`hp` 会在战斗中不断减少，而 `exp` 会不断增加。所以我们会有两个动作，用 `drop_hp` 表示血量减少，用 `add_exp` 表示经验值增加。当然，我们不会涉及任何 `UI` 相关的内容。参照示意图1_1，我们如何自己实现这个应用呢？

很容易想到的一个方案是，通过事件机制实现。

## 基于事件的示例

当我们一进入页面，需要做的就是根据初始数据渲染页面：

```javascript
let gameState = {
    hp: 1000,
    exp: 0
}

// 我们忽略了具体的渲染代码
function renderUI(state){
    // ...
    // renderHp(state.hp)
    // renderExp(state.exp)
    // ...
    console.log('render UI success,new state is:',state);
}
```

接下来让我们为应用添加动作。我们的代码开起来会是这样：

```javascript
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
    add_exp: 'drop_hp',
    exp: 10,
}
gameEvent.dispatch(e);
```

这样我们的应用就完成了。整个过程和浏览器的自定义事件一样，`gameEvent.dispatch`会根据 `e` 对象，触发对应的事件，进而执行 `on` 注册的方法，更新 `state` 数据，渲染 `UI`。

下面是完整的代码：

```javascript
// gameState.js
const gameEvent = {
    handler: {}
};
gameEvent.on = function(type,fn){
    gameEvent.handler[type] = fn;
};

gameEvent.dispatch = function(e){
    const type = e.type;
    const fn = gameEvent.handler[type];
    fn(e);
};

module.exports = gameEvent;
```

```javascript
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
```

输出结果为：
![示例结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/learn_redux_basic/redux_1_2.png)

上面的示例代码有一些问题，请看以下代码：

```javascript
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
```

示例中，更新 `gameState` 的相关代码比较分散，分别处于不同的回调函数中。其次，有重复的代码，`renderUI` 方法重复了两次。当应用变得庞大时，这两个问题就会凸显出来。

接下来我们看看，用 `Redux` 来实现上面的示例，会有哪些不同。

## 基于 `Redux` 的示例
和之前的示例一样，需要设计应用的状态数据，并设置初始值：

```javascript
// state
const gameState = {
    hp: 1000,
    exp: 0
}
```
接下来是设计状态数据的更新。在 `Redux` 中，所有的状态更新都是是由一个函数集中处理的，称之为 `Reducder`。该函数最终返回最新的状态数据。

```javascript
// 参数 state 为当前的状态数据
// 参数 action 是一个对象，表示更新 state 所需要的数据。与上例中 e 对象类似。
function Reducder(state=gameState,action){
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
```

还剩下什么呢？对的，是更新 `UI` 的代码以及触发状态改动的代码。让我们快速补全剩下的部分，来看看示例的全貌。

```javascript
const { createStore } = require('redux');

// 创建 store
const store = createStore(Reducder);

// 注册 UI 更新代码
store.subscribe(function renderUI(state){
    // ...
    // renderHp(state.hp)
    // renderExp(state.exp)
    // ...
    console.log('render UI success,new state is:',state);
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

```

输出结果为：
![示例结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/learn_redux_basic/redux_1_3.png)

完整代码如下：

```javascript
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
```

相同的应用，相同的数据模型，不同的实现方式。先不去细究 `Redux` 的引入的那些概念，来感受一下代码的初印象。

在 `Redux` 中，`Reducder` 函数的职责非常单一、专注，只处理状态的更新，并返回最新的状态对象。我需像事件示例那样，在不同的 `gameEvent.on` 函数中处理不同的状态更新。方便了维护和扩展。
`store.subscribe` 方法接收一个函数，当有状态更新后，`Redux` 会执行这个函数。`UI` 更新的相关操作就可以在这里处理。`UI` 相关的代码并没有与其他代码参杂在一起。

结下就要进入 `Redux` 中学习刚才遇到的 `action` `Reducder` `Store` 等概念。

要实现
- 基本介绍：什么是redux；何处听说的redux；redux的作用；

接下来我们的示例均与UI无关。

- 示例：1. 示例的 full picture；2. 示例介绍；代码展示