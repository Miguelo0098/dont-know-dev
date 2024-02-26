import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_SEO_TITLE, SITE_SEO_DESCRIPTION } from "../consts";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: SITE_SEO_TITLE,
    description: SITE_SEO_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
    })),
  });
}
