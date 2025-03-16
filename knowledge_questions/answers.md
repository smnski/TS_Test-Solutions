### Explain what are prototypes and how does class inheritance make use of them?
Prototypes are a mechanism that allows objects to inherit methods and properties from other objects.

Every object in JavaScript has a built-in property, called its prototype. Every prototype also has its own prototype, creating a chain, that continues until a prototype with "null" as its own prototype is reached.

When we try to access a property of an object and it can't be found on the object itself, its prototype is searched for it instead. If the prototype also doesn't have that property, we continue the search further up the earlier explained chain until it's either found or we reach the null prototype and "undefined" is returned instead. That's how class inheritance makes use of prototypes.

### When starting a new project how would you choose between OOP and Functional Programming?
First of all, I would consider the following factors in a given project:
- Frameworks and libraries best suited for the project and their focus.
- Scale, complexity and maintenance.
- How important is performance.

I would choose OOP if:
- The project utilizes class-based frameworks (e.g Angular).
- The project will be on a large scale and must be easy easily maintained.
- The project involves multiple systems and objects that must interact with each other on a regular basis.

I would choose FP if:
- The project utilizes FP-focused libraries (e.g Ramda).
- The project must guarantee fast performance and high parallelism handling.
- The project is on a smaller scale, such that OOP would only introduce unneeded boilerplate code, without necessarily
  making it more readable.

### How does Proxy work in Typescript and when is it useful?
Proxy is an object that allows defining custom behavior for fundamental operations (e.g property manipulation, function invocation).
It wraps a chosen object and intercepts incoming operations, using handler functions.

Proxies are a useful tool when we want to impose certain responses or behaviours when data in our project is changed.
For example:
- Validating data (Preventing setting invalid values)
- Returning default values for missing properties
- Security (Preventing access to given properties)

### What patterns/practices/tools would you use to implement simple cache for NoSQL database?
First, I would consider the following patterns:
- Read-through cache - Data is retrieved from the cache. If it's absent, data from the database is fetched instead, then the cache 
  is updated.
- Write-back cache - Data is first written to the cache, then asynchronously  to the database.
- Write-through cache - Data is written to the cache and database at the same time.

I would keep in mind the following practices:
- Appopriate TTL values, preventing the cache from becoming bloated.
- Cache purging, preventing outdated data.
- Code with focus on performance, to allow quick data retrieval.

As my tool of preference, I would choose Redis.
But most importantly, first ask more experienced software engineers what might be the most appopriate tool for the given project.

### What libraries do you consider necessary for any application? Which ones do you use most commonly?
Each application has its own necessary libraries that should be chosen after considering our end goal.

However, if possible I most commonly use:
- Express - For HTTP server routing.
- Bootstrap - For designing responsive frontend.
- Mongoose - For simplifed database management in projects that utilize MongoDB.
- Socket.IO - For real-time, bidirectional communication between clients and servers.

### How would you choose a backend? When would you use HTTP server, serverless functions or Websockets?
1. I would use an HTTP server in applications utilizing REST APIs. This is my prefered choice, when building backend for projects based
  on request-response principles.

2. I would use serverless functions when dealing with lightweight applications that are event-driven. This approach is best suited for
  handling non time sensitive, background tasks.

3. I would utilize Websockets in applications constantly managing real-time updates and requiring persistent connections.

### Explain why the provided code doesn't work and how you would fix it.
- Supposed to print: [{name: "Tom", id: 0}, {name: "Kate", id: 1}]

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

#### Why the code doesn't work
The line causing issues in this code is:
```ts
const { getId }: { getId: () => number } = new IdGenerator();
```
By deconstructing getId, the function no longer has a reference to the original IdGenerator instance.
As a result, when `getId()` is called `this` isn't bound to the IdGenerator object.
This causes an error, as `this` is `undefined` when using strict mode or starts refering to the global object, causing unintended behavior.

#### My solution
I would solve this problem by using a direct method call, to avoid this issue completely and make the code more readable.
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

const idGenerator = new IdGenerator();

const people: Person[] = ["Tom", "Kate"].map((name) => ({
  name,
  id: idGenerator.getId(),
}));
console.log(people);
```

result:
```ts
[ { name: 'Tom', id: 0 }, { name: 'Kate', id: 1 } ]
```

#### Other possible solutions
1. Using ```bind``` to make sure ```this``` always refers to this specific IdGenerator instane:
```ts
const { getId } = new IdGenerator();
const boundGetId = getId.bind(new IdGenerator());

const people: Person[] = ["Tom", "Kate"].map((name) => ({
  name,
  id: boundGetId(),
}));
```

2. Using an arrow functions - As they preserve ```this```.
```ts
class IdGenerator {
  lastId: number = 0;
  getId = (): number => this.lastId++;
}
```