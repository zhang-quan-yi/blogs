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

greet(deserialize('{"name": "zhao yi"}'));
// 当反序列化一个不是 user 对象的对象，类型检查器无法检测出类型问题。
greet(deserialize("{}"));
