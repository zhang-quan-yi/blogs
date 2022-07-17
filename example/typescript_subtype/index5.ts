export const title = "";

class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

function deserialize(input: string): any {
  return JSON.parse(input);
}

function greet(user: User) {
  console.log(`Hi ${user.name}`);
}

function isUser(user: any): user is User {
  if (user === null || user === undefined) {
    return false;
  }
  return typeof user.name === "string";
}

let user: any = deserialize('{"name": "zhao yi"}');
if (isUser(user)) {
  greet(user);
}

user = deserialize("{}");
if (isUser(user)) {
  greet(user);
}

// 这里的问题是，在调用 greet 的时候，我们无法强制要求使用者使用 isUser 函数进行安全检查。
// 那么有没有另外一种方式，可以表达“这个对象可以是任意类型”，但是没有 any 类型暗含的“相信我，我知道我在做什么”的意义，这不是更好吗？
// 我们可以使用顶层类型 unknown 来改写上述实例，来看下有何不一样。
