export const title = "";
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
  console.log(`Hi ${people.name}`);
}

greet(new People("zhao yi"));
greet(new Staff("qian er", "IT"));
