# 浅析 React 组件的状态更新

## `state` 和 `props`

`state` 是组件自身的状态，在组件中可以通过 `setState` 方法修改 `state` 的值。
`props` 是组件从外部获取的状态，在组件中，`props`的值是只读的，不可以修改。

## 组件如何触发自身的更新机制？

当组件的 `state` 或者 `props` 改变时，组件就会更新。但是，对于一个组件来说，`props`是只读、不可更改的。一个组件，要主动触发更新机制，需要使用 `setState` 方法。
下面，通过一个简单的示例，来了解 `setState` 的使用方式。
如图所示，`Root` 组件包含了子组件 `C1` 和 `C2`，组件 `C1` 包含了子组件 `C3`：

![组件结构](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p1.png)

示例代码一：
```jsx
// Root component
class Root extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: 'Root'
        };
        this.update = this.update.bind(this);
    }
    update(){
        this.setState({
            name: 'Root_v' + Math.ceil(Math.random() * 1000)
        });
    }
    render(){
        console.log(`[${this.state.name}] render`);
        return (
            <div className="container">
                <div onClick={this.update}>{this.state.name}</div>
                <div className="children">
                    <C1 father={this.state.name} />
                    <C2 father={this.state.name} />
                </div>
            </div>
        )
    }
}
```

```jsx
// C1 compoent
class C1 extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: 'C1'
        };
        this.update = this.update.bind(this);
    }

    update(){
        this.setState({
            name: 'C1_v' + Math.ceil(Math.random() * 1000)
        });
    }

    render(){
        console.log(`[${this.state.name}] render`);
        return (
            <div className="container">
                <div onClick={this.update}>{this.state.name} (father:{this.props.father})</div>
                <div className="children">
                    <C3 father={this.state.name}/>
                </div>
            </div>
        );
    }
}
```

```jsx
// C3 component
class C3 extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: 'C3'
        };
        this.update = this.update.bind(this);
    }
    update(){
        this.setState({
            name: 'C3_v' + Math.ceil(Math.random() * 1000)
        });
    }
    render(){
        console.log(`[${this.state.name}] render`);
        return (
            <div className="container">
                <div onClick={this.update}>{this.state.name} (father:{this.props.father})</div>
            </div>
        )
    }
}
```

```jsx
// C2 component
class C2 extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: 'C2',
        };
        this.update = this.update.bind(this);
    }
    update(){
        this.setState({
            name: 'C2_v' + Math.ceil(Math.random() * 1000)
        });
    }
    render(){
        console.log(`[${this.state.name}] render`);
        return (
            <div className="container">
                <div onClick={this.update}>{this.state.name} (father:{this.props.father})</div>
            </div>
        );
    }
}
```

此时，如果我们点击 `C3` 组件的标题，就会触发 `update` 方法，执行 `setState` 方法，改变 `state` 中 `name` 的值，在 `C3` 组件的名称后面，出现了一串随机数字。控制台的输出结果表示， `C3` 的 `render` 方法执行了，如下图所示：
![结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p2.png)


如果我们点击组件 `C1` 的标题，组件 `C1` 将会更新，`C1` 名字后面增加了一串随机数字，同时它的子组件 `C3` 的内容也更新了，结果如下：
![结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p3.png)

通过控制台的输出，可以发现，`C1` 和 `C3` 的 `render` 方法都执行了。那么为什么组件 `C2` 没有更新呢？为什么它的 `render` 方法没有执行呢？

接下来，点击组件 `Root` 的标题，可以发现组件树中的所有组件都更新了。也就是说，组件 `Root`，以及它的所有子节点都更新了，结果如下：
![结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p4.png)

**至此，可以得出结论：组件通过调用 `setState` 方法触发自身更新，同时，也会触发它的所有子节点更新。**

## 每次调用 `setState` ，即使没有状态改变，组件也会更新吗？

构建如下组件结构：

![组件结构2](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p2_1.png)

在 `Root` 组件中，有两个按钮 `update nothing` 和 `update name`。
`update nothing` 按钮执行了 `setState({})` 语句，它不改变任何状态。
`update name` 按钮通过调用 `setState` 方法来修改 `Root` 组件的名称。

示例代码二：

```jsx
// Root
class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Root'
        };
        this.update = this.update.bind(this);
        this.updateNothing = this.updateNothing.bind(this);
    }
    componentDidUpdate(){
        console.log(`[${this.state.name}] did update`);
    }
    updateNothing() {
        this.setState({});
    }
    update() {
        this.setState({
            name: 'Root_v' + Math.ceil(Math.random() * 1000)
        });
    }
    render() {
        console.log(`[${this.state.name}] render`);
        return (
            <div className="container">
                <div onClick={this.update}>{this.state.name}</div>
                <div className="children">
                    <C1 father={this.state.name} />
                    <C2 />
                </div>
                <button onClick={this.updateNothing}>update nothing</button>
                <button onClick={this.update}>update name</button>
            </div>
        )
    }
}
```

```jsx
// C1
class C1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'C1'
        };
    }
    componentDidUpdate(){
        console.log(`[${this.state.name}] did update`);
    }

    render() {
        console.log(`[${this.state.name}] render`);
        return (
            <div className="container">
                <div>{this.state.name} (father:{this.props.father})</div>
            </div>
        );
    }
}
```

```jsx
// C2
class C2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'C2',
        };
    }
    componentDidUpdate(){
        console.log(`[${this.state.name}] did update`);
    }

    render() {
        console.log(`[${this.state.name}] render`);
        return (
            <div className="container">
                <div>{this.state.name}</div>
            </div>
        );
    }
}
```
现在，点击按钮 `update nothing`，页面没有任何更新，因为我们没有更改任何状态，仅仅执行了 `setState({})`，但控制台的输出却出乎意料，组件 `Root`、`C1` 和 `C2` 的 `render` 函数都执行了，并且 `componentDidUpdate` 生命周期钩子也都执行了：

![输出结果2_2](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p2_2.png)

那么点击按钮 `update name` 会有什么结果呢？
当然，页面上，组件 `Root` 都名字会更新，并且控制台会输出和之前一样的内容


![输出结果2_3](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p2_3.png)


**结论，即使不改变任何状态，调用 `setState` 方法，也会触发组件，及其子组件的更新。**

>注意：不传入任何参数，仅仅执行 `setState()`，并不会触发组件更新。

如果对于 `setState` 的这种行为有所顾忌，那么该如何优化呢？

## 通过 [PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) 控制组件更新

通过上节，我们知道，只要调用 `setState` 方法并传入参数，组件就会更新，触发一系列生命周期钩子。为了解决这个问题，可以使用 `PureComponent` 来优化性能。

对上面的示例代码二，做以下修改，让所有组件都继承 `PureComponent`：

![修改3_1](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p3_1.png)

再次点击按钮 `update nothing` 和 `update name`，控制台输出分别为：

![update nothing 结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p3_2.png)

![update name 结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p3_3.png)

可以发现，点击 `update nothing` 的时候，由于没有任何状态改变，所以所有组件都没有触发更新，控制台没有输出任何内容。

点击 `update name` 的时候，组件 `Root` 内部的状态 `name` 更改了，而在 `C1` 内部，`props.father` 更改了，所以，组件 `Root` 和 `C1` 需要更新，而 `C2` 的 `state` 或者 `props` 都没有改变，所以没有触发更新。

这样的结果已经让人很满意了。那么它是如何做到的呢？
`React` 通过 `PureComponent` 组件，实现了一种简单有效的更新判断机制，称之为浅比较：比较 `state` 和 `props` 中的每一个属性，看它们是否相等。只有发现有不相等的属性，才更新组件。


既然有浅比较，那么有深比较吗？有什么区别呢？
假如我们有如下两个状态字段：

```js
this.state = {
    a: {
        b: 1,
        c: 1
    }
};

const newState = {
    a: {
        b: 1,
        c: 1
    }
};

this.setState(newState);

```

如果是浅比较的话，对比方式为：`state.a === newState.a` ，结果返回 `false`，组件就会以为状态有改变，触发更新。当然，我们知道 `state.a` 和 `newState.a` 是不同的对象，但是它们的内部结构是一样的，不需要更新 `UI`。

那么，如果是深比较呢？

```js
(state.a.b === newState.a.b && state.a.c === newState.a.c) // true
```

深比较对比了对象的每一个字段，对比的结果返回 `true`，表示组件状态并没有更新。这样的结果符合我们的预期。

那么如何将深比较应用到组件的更新控制中呢？

## 通过 [Shouldcomponentupdate](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate) 生命周期钩子控制组件更新

当 `props` 或 `state` 发生变化时，`shouldComponentUpdate` 会在渲染执行之前被调用。它的返回值将会影响组件是否执行更新。组件状态改变时，如果 `shouldComponentUpdate` 返回 `true` ，组件将会更新，返回 `false` 组件将不再更新。继承 `React.Component` 组件的 `shouldComponentUpdate` 默认返回 `true`

![修改 2](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p4_1.png)

我们将示例代码做了修改，所有组件都改为继承 `React.Component`，同时为 `Root` 组件增加了 `shouldComponentUpdate` 生命周期钩子。在 `shouldComponentUpdate` 中，我们比较了 `state.name` 和  `state.alias` 字段的新值和旧值。

作出更改后，点击按钮 `update nothing` 和 `update name`，控制台输出分别为：

![update nothing 结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p4_2.png)

![update name 结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/react_state_update/p4_3.png)

可以看到，点击按钮 `update nothing` 后，没有组件更新，因为没有状态改变， `shouldComponentUpdate` 函数返回的是 `false`。点击按钮 `update name`，`shouldComponentUpdate` 函数因为 `name` 发生了改变，返回值为 `true`，所以组件更新了。

有了 `shouldComponentUpdate`，可以完全控制组件如何根据状态的改变而更新。但是，大部分情况下，应该遵循默认行为。当组件出现明显的性能瓶颈时，`shouldComponentUpdate` 可以作为性能优化的一种方式。

## `PureComponent` 的潜在问题

在实际使用中，`PureComponent` 会带来一些预料之外的效果，通常是由于浅比较造成的。
请看如下代码片段：

```js
const a = {
    b: 1
};

this.state = {
    a: a
};

a.b = 2;

const newState = {
    a: a
};

this.setState(newState);

```

示例代码中，在不经意间，直接修改了 `a` 对象，并没有在新的对象上处理修改，所以等式 `state.a === newState.a` 的结果是 `true`，在 `PureComponent` 中，也是这样的浅比较，它会误以为组件状态没有改变，不更新 `UI`。

请看正确的示例：

```js
const a = {
    b: 1
};

this.state = {
    a: a
};

// 创建一个新的 a 对象
const new_a = {
    b: a.b + 1
}

const newState = {
    a: new_a
};

this.setState(newState);

```

也就是说，不要在原来的对象上应用修改，正确的做法是，创建新的对象，在新的对象上面应用需要的改动。


## `shouldComponentUpdate` 潜在的性能问题

`React` 官方不建议在 `shouldComponentUpdate` 中进行深层比较或使用 JSON.stringify()。`shouldComponentUpdate` 函数计算量过大非常影响效率，且会损害性能。因为，任何状态的改变，都会触发`shouldComponentUpdate` 的执行，它会被高频率地执行。