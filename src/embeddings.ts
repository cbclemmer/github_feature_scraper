import { openai, pinecone } from './api'

export type Embedding = number[]

export async function getEmbedding(s: string): Promise<Embedding> {
  const embed_res = await openai.createEmbedding({
    input: s,
    model: 'text-embedding-ada-002'
  })
  return embed_res.data.data[0].embedding
}

export async function createEmbedding(vec: Embedding, metadata: any): Promise<string> {
  await pinecone.upsert({
    vectors: [ { 
      values: vec,
      metadata
    } ]
  })

  const { matches } = await pinecone.query({
    vector: vec
  })

  return matches[0].id;
}

export async function queryEmbeddings(vec: Embedding, threshold: number): Promise<string | null> {
  const { matches } = await pinecone.query({
    topK: 1,
    vector: vec
  })

  if (matches[0].score < threshold) {
    return null
  }
  
  const id = matches[0].id
  const res = await pinecone.fetch({ ids: [ id ] })
  return res.vectors[id].metadata
}