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

## 基于事件机制实现示例

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

首先，更新 `gameState` 的相关代码比较分散，分别处于不同的回调函数中。其次，有重复的代码，`renderUI` 方法重复了两次。当应用变得庞大时，这两个问题就会凸显出来。

接下来我们看看，用 `Redux` 来实现上面的示例，会有哪些不同。

要实现
- 基本介绍：什么是redux；何处听说的redux；redux的作用；

接下来我们的示例均与UI无关。

- 示例：1. 示例的 full picture；2. 示例介绍；代码展示