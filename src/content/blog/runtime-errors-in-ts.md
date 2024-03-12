---
title: "You can’t run away from runtime errors using TypeScript"
description: "This post will explain why runtime errors happen when working with external data sources (even using TypeScript) and what we can do as developers to avoid these problems."
pubDate: "Mar 12 2024"
heroImage: "/blog-placeholder-1.jpg"
---

TypeScript helps a lot when dealing with type errors at compile time. However, form inputs or third-party API responses can cause runtime errors when typing incorrectly.

This post will explain why runtime errors happen when working with external data sources (even using TypeScript) and what we can do as developers to avoid these problems.

## The problem

Let's suppose we fetch employee data from an API. The response's body would look something like this:

```json
{
  "id": "1",
  "name": "John Doe",
  "birthDate": "13-03-1984",
  "active": true
}
```

This would be the code that fetches the data:

```ts
type Employee = {
	id: number;
	name: string;
	birthDate: Date;
	active: boolean;
}

const fetchEmployee = async (req: Request): Employee => {
	...
	await return response.json();
}

const employee = await fetchEmployee(...);
```

This code would work as it is. It just fetches data from an API and stores it in a variable. However, there is a catch: the `Employee` type does not match the response. The employee `id` is not a number, and `birthDate` is not a Date. They are both **strings**.

TypeScript is not aware of these errors until runtime. Typescript will trust the `Employee` type and suggest methods and properties as if `id` or `birthDate` were both a number and a Date.

## How to solve this

### Assertions

Assertions in Typescript are a great way to ensure data typing. Taking the previous example, we could assert the employee data like this:

```
const assertIsEmployee = (data: Employee): asserts data is Employee {
	if(typeof data.birthDate !== Date || typeof data.id !== number) {
		throw new AssertionError("Data is not an Employee!");
	}
}
```

The usage would be similar to this:

```ts
const fetchEmployee = async (req: Request): Employee => {
	...
	const data = await response.json();
	assertIsEmployee(data);
	return data;
}

const employee = await fetchEmployee(...);
```

Assertion errors would happen at runtime right after fetching the employee data. E2e tests could detect these before pushing code to production. However, the developer experience is terrible. You might need tests and too much boilerplate to check every possible scenario.

### Introducing Zod

Zod is a TypeScript-first schema declaration and validation library. It helps create schemas for any data type and is very developer-friendly. Zod has the functional approach of "parse, don't validate." It supports coercion in all primitive types.

In this case, we could use Zod to create an Employee schema to parse the data from the API. We could use the `coerce` option on attributes like `id` or `birthDate` to coerce them using the primitive types constructors.

```ts
import { z } from "zod";

const EmployeeSchema = z.object({
  id: z.coerce.number(), // Number(input)
  name: z.string(),
  birthDate: z.coerce.date(), // Date(input)
  active: z.coerce.boolean(), // Boolean(input)
});

// We can also create a type based on the schema
type Employee = z.infer<typeof EmployeeSchema>;
```

Now, we could use it easily like this:

```ts
const fetchEmployee = async (req: Request): Employee => {
	...
	const data = await response.json();
	return EmployeeSchema.parse(data);
}

const employee = await fetchEmployee(...);
```

The `parse` method still throws errors at runtime when validation fails. But compared to assertion, Zod is way easier to handle as a developer.

## Conclusion

We are not safe from runtime errors when using TypeScript. Luckily, there are libraries like Zod that provide solutions to minimize them.

Has this problem ever happened to you? How did you solve it? Did you use a similar library to handle it? Please let me know and _type safely_.
