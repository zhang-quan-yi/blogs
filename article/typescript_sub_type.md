# Typescript 子类型之 unknown 与 never 介绍

## 子类型定义

如果在期望类型 **T** 实列的任何地方，都可以安全地使用类型 **S** 的实例，那么称类型 **S** 是类型 **T** 的子类型。

### 在 Typescript 中实现父子类型

可以通过 class 的继承机制实现父子类型：

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

这种父子类型称之为名义子类型。而 Typescript 中的子类型是结构子类型。

## Typescript 中的结构子类型。
