export const title = "";
/**
 * unknown
 */
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

function deserialize(input) {
  return JSON.parse(input);
}

function greet(user) {
  console.log(`Hi ${user.name}`);
}

const user = deserialize('{"name": "zhao yi"}');
greet(user);
