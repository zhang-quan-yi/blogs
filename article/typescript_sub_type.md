# Typescript unknown 与 never 类型介绍

新接触 Typescript 的人，都会对 unknown 与 never 这两个类型有所迷惑，因为它们不属于 javascript 基本类型。今天我们就从子类型的视角来了解这两个类型的作用。

## 子类型定义

如果在期望类型 **Type** 实列的任何地方，都可以安全地使用类型 **SubType** 的实例，那么称类型 **SubType** 是类型 **Type** 的子类型。

### 在 Typescript 中通过继承实现父子类型

在下方实例中，我们首先创建了 `People` 类，然后基于 `People` 创建了 `Staff` 类（继承自 `People` 类）。

```typescript
class People {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Staff extends People {
  job: string;
  constructor(name: string, job: string) {
    super(name);
    this.job = job;
  }
}

function greet(people: People) {
  console.log(`Hi ${people}`);
}

greet(new People("zhao yi"));
greet(new Staff("qian er", "IT"));
```

可以看到，虽然函数 `greet` 的定义中只接收 `People` 类，但是由于 `Staff` 是 `People` 类的子类型，所以 `greet` 函数可以安全地接收 `Staff` 类型。

如果了解过面向对象的语言，诸如 Java，会对这段代码感到稀松平常。但实质上，在 Typescript 中不使用继承机制，也是可以实现子类型关系的。只要 P1 类型包含 P0 类型的所有成员，那么我们就可以说 P1 是 P0 的子类型。这称之为 **结构子类型**。

## Typescript 中的通过结构子类型实现父子类型。

与上面实例相似，我们还是会创建 `People` 与 `Staff` 类型，但这次我们不使用 `class`，而是使用 `interface` 来实现：

```typescript
interface People {
  name: string;
}

interface Staff {
  name: string;
  job: string;
}

const people: People = {
  name: "zhao yi",
};

const staff: Staff = {
  name: "qian er",
  job: IT,
};

function greet(people: People) {
  console.log(`Hi ${people}`);
}

greet(people);
greet(staff);
```

可以看到，Staff 接口包含了 People 接口的所有成员。函数 greet 期望接收 People 接口（类型）的参数。如果将参数改为 Staff 接口类型，那么同样可以通过 Typescript 的类型检查。

## 子类型的极端情况

了解了子类型是什么以后，我们来看两种极端情况：顶层类型和底层类型。
顶层类型是其他任何类型的父类型。我们可以定义任何类型，但这些类型都将是顶层类型的子类型。如果将之前的 greet 函数的接收参数改为顶层类型，那么 greet 可以接收任何类型的参数了。因为任何期望父类型的地方，都可以安全使用子类型。
在 Typescript 中，Object 类型是除了 null 和 undefined 之外的大部分类型的父类型。所以，我们可以将这三种类型的和类型作为顶层类型： Object | null | undefined。实际上，Typescript 是有顶层类型的定义的，该类型就是 unknown。
（注：在 Typescript 中 null 类型是 null，而 undefined 类型是 undefined）
