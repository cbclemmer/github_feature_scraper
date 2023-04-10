import { flatten } from 'lodash'
import { fetchArticles } from './helpscout'
import { getIssuesToParse } from './github'
import { extractFeatureInfo } from './gpt'
import { groupBy } from 'lodash'
import { getEmbedding } from './embeddings'
import { queryEmbeddings } from './embeddings'

(async () => {
  const similarityThreshold = 0.75

  console.log('Fetching issues')
  const issues = await getIssuesToParse()
  console.log('Fetched issues')
  console.log(issues.length)

  let features = []
  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i]
    features.push(await extractFeatureInfo(issue))
  }
  const articles = await fetchArticles(1)
  const groupedFeatures = groupBy(flatten(features), (f) => f.page)
  for (let i = 0; i < Object.keys(groupedFeatures).length; i++) {
    const groupName = Object.keys(groupedFeatures)[i]
    const group = groupedFeatures[groupName]
    const groupEmbedding = await getEmbedding(groupName)
    const closestPage = await queryEmbeddings(groupEmbedding, similarityThreshold)
    if (closestPage == null) {
      
    }
  }
  
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
