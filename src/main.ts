import { flatten } from 'lodash'
import { fetchArticles } from './helpscout'
import { fetchGitHubIssues } from './github'
import { extractFeatureInfo } from './gpt'
// import { createOrUpdateArticle } from './helpscout'

(async () => {
  const similarityThreshold = 0.75

  console.log('Fetching issues')
  const issues = await fetchGitHubIssues(1)
  console.log('Fetched issues')
  console.log(issues.length)

  let features = []
  const articles = await fetchArticles(1)
  console.log(articles)
  return
  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i]
    features.push(extractFeatureInfo(issue.text, issue.id))
  }
  features = flatten(features)
  
  console.log('Extracted Features')

  console.log('DATA:')
  // console.log(featuresInfo)


  // const articlesText = articles.map(article => article.text);
  // const embeddingModel = await trainEmbeddings(articlesText);

  // for (const featureInfo of featuresInfo) {
  //   const mostRelevantArticleIndex = await findMostRelevantArticle(embeddingModel, featureInfo, similarityThreshold);

  //   if (mostRelevantArticleIndex >= 0) {
  //     // Update existing article
  //     const updatedArticle = {
  //       ...articles[mostRelevantArticleIndex],
  //       text: articles[mostRelevantArticleIndex].text + '\n\n' + featureInfo
  //     };

  //     await createOrUpdateArticle(helpScoutCategoryId, updatedArticle);
  //   } else {
  //     // Create a new article
  //     const newArticle = {
  //       title: 'New Feature: ' + featureInfo.substring(0, 30),
  //       text: featureInfo
  //     };

  //     await createOrUpdateArticle(helpScoutCategoryId, newArticle);
  //   }
  // }
})();
