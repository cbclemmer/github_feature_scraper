import { openai, pinecone } from './api'

export async function getEmbedding(s: string): Promise<number[]> {
  const embed_res = await openai.createEmbedding({
    input: s,
    model: 'text-embedding-ada-002'
  })
  return embed_res.data.data[0].embedding
}

export async function createEmbedding(s: string): Promise<string> {
  const vec = await getEmbedding(s)
  await pinecone.upsert({
    vectors: [ { 
      values: vec,
      metadata: s
    } ]
  })

  const { matches } = await pinecone.query({
    vector: vec
  })

  return matches[0].id;
}

export async function queryEmbeddings(text: string, threshold: number): Promise<string | null> {
  const query_vec = await getEmbedding(text)
  const { matches } = await pinecone.query({
    topK: 1,
    vector: query_vec
  })

  if (matches[0].score < threshold) {
    return null
  }
  
  const id = matches[0].id
  const res = await pinecone.fetch({ ids: [ id ] })
  return res.vectors[id].metadata
}