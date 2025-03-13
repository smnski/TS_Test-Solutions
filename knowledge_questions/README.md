# Knowledge questions

- Explain what are prototypes and how does class inheritance make use of them?
- When starting a new project how would you choose between OOP and Functional Programming?
- How does `Proxy` work in Typescript and when is it useful?
- What patterns/practices/tools would you use to implement simple cache for NoSQL database?
- What libraries do you consider necessary for any application? Which ones do you use most commonly?
- How would you choose a backend? When would you use HTTP server, serverless functions or Websockets?
- Code below is supposed to print `[{name: "Tom", id: 0}, {name: "Kate", id: 1}]`. Explain why it doesn't and explain how would you fix it.

```ts
interface Person {
  name: string;
  id: number;
}

class IdGenerator {
  lastId: number = 0;

  getId(): number {
    return this.lastId++;
  }
}

const { getId }: { getId: () => number } = new IdGenerator();

const people: Person[] = ["Tom", "Kate"].map((name: string) => ({
  name,
  id: getId(),
}));
console.log(people);
```
