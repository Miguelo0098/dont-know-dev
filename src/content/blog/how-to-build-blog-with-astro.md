---
title: "How to build a blog with Astro"
description: "This post will share my experience building a blog using Astro, from generating the project's boilerplate using a template to deploying it with Netlify."
pubDate: "Mar 05 2024"
heroImage: "/blog-placeholder-1.jpg"
---

I first heard about [Astro](https://astro.build/) a couple of years ago when it became more popular among the JavaScript frameworks ecosystem. At first, it looked like a great framework to build a landing page, maybe a tiny, interactive web app.

This post will share my experience building a blog using Astro, from generating the project's boilerplate using a template to deploying it with Netlify.

## What is Astro?

"The web framework for content-driven websites". That is how the Astro website describes it. You can create anything, like a landing page or client-side web applications. It reduces JavaScript overhead and complexity compared to other frameworks because it renders as much as possible on the server.

An amazing thing I discovered about Astro is that you can still use any UI framework you like, such as React, Svelte, or Vue (you can even mix them!). It helps a lot when migrating from other frameworks, making Astro appealing to curious devs who want to try it out.

## Building an Astro blog

I did some research and found an [Astro template for a blog](https://github.com/withastro/astro/tree/latest/examples/blog). Setting it up was easy as pie.

```sh
$ npx create astro@latest -- --template blog
```

This template was simple enough to create a simple markdown blog from scratch with MDX support. After some tweaks, it was ready to go!

## Using the Astro CLI

Astro provides its own CLI to simplify the development workflow. Apart from the typical 'dev' or build commands, the CLI provides a command to add integrations.

There are many [official integrations](https://astro.build/integrations/) for Astro. The `add` command adds them to your project with ease. For example, there is an integration that automatically installs Tailwindcss as a dependency and sets up the configuration file.

```sh
$ npx astro add tailwind
```

Some integrations need you to do a few tweaks, but most are just plug-and-play.

## The Astro dev toolbar

Astro has a developer toolbar that can be seen in the browser when you open your project in development mode. It has utilities like Client UI Components inspection, audit tools, and quick links to docs and the community. You can hide it using the Astro CLI if you don't need it, but the audit tools come in handy from time to time.

## Content Collections

It is a built-in functionality to manage content inside an Astro project. The blog template had a `content` folder with these files:

```
/content/config.ts
/content/blog/blog-post-1.md
```

Astro manages the content folder and its directories as different collections. In this case, a `blog` directory contains every blog post as a Markdown file. The config.ts file defines the schemas of each collection and its metadata. You can define as many collections as you want.

```ts
// config.ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
```

Astro uses [Zod](https://zod.dev/), a Typescript-first schema validation library, to type-check the collections' schemas. It helps validate data types when using collections inside UI components.

## Routing and collection rendering

Astro uses file-based routing to generate the URLs. It supports static and dynamic routes. In this case, blog post routes are dynamic, using the post's slug.

Providing the post content to the route's component is very simple. Create a `getStaticPaths` function and fetch the collection content.

```ts
// pages/blog/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}
// ...
```

The function generates a route for each post, replacing the dynamic parameter [...slug] with the post's slug. It also provides the post as a prop for the page component.

## Deploying

I chose Netlify to deploy the blog because it's the platform I'm most familiar with. You can add the Netlify integration with the Astro CLI.

```sh
$ npx astro add netlify
```

After that, you can set up the deployment using the Netlify website or the CLI with the following settings:

- Build command: `astro build` or `npm run build`
- Publish directory: `dist`

## Conclusion

It is surprisingly simple to build stuff with Astro. There are no limits to what you can do with it. The docs are very well structured and provide a lot of guides, resources, and API references. I'm definitely going to use it more often in the future to build apps.

What do you think about Astro? What has been your experience so far? Feel free to let me know!
