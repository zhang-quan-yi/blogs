export const title = "";
interface People {
  name: string;
}

interface Staff {
  name: string;
  job: string;
}

const p: People = { name: "zhao yi" };
const s: Staff = { name: "quan er", job: "IT" };

function greet(p: People) {
  console.log(`Hi ${p.name}`);
}
greet(p);
greet(s);
