export const title = "";

interface User {
  name: string;
}

function deserialize(input: string): unknown {
  return JSON.parse(input);
}

function greet(user: User) {
  console.log(`Hi ${user.name}`);
}

const isUser = (user: any): user is User => {
  if (user === null || user === undefined) {
    return false;
  }
  return typeof user.name === "string";
};

let user: unknown = deserialize('{"name": "zhao yi"}');

if (isUser(user)) {
  greet(user);
}
// greet(user);
