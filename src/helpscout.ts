// import { HelpScout, Article } from 'helpscout';

// const helpscout = new HelpScout(HELPSCOUT_API_KEY);

// export async function createOrUpdateArticle(categoryId: number, article: Article) {
//   // Check if an article with the same title exists
//   const existingArticle = await helpscout.articles.list({ categoryId }).then(articles =>
//     articles.find(a => a.title === article.title)
//   );

//   if (existingArticle) {
//     // Update existing article
//     await helpscout.articles.update(existingArticle.id, article);
//   } else {
//     // Create a new article
//     await helpscout.articles.create(categoryId, article);
//   }
// }