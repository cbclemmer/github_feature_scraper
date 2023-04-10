const http = require('http')
import { config } from './config'

export enum FetchStatus {
    All = 'all',
    Published = 'published',
    NotPublished = 'notpublished',
}

export enum FetchSort {
    Number,
    Status,
    Name,
    Popularity,
    CreatedAt,
    UpdatedAt
}

export type FetchOptions = {
    page?: number,
    status?: FetchStatus,
    sort?: FetchSort,
    order?: 'asc' | 'desc',
    pageSize?: number
}

export interface ArticleRef {
    id: string;
    number: number;
    collectionId: string;
    status: string;
    hasDraft: boolean;
    name: string;
    publicUrl: string;
    popularity: number;
    viewCount: number;
    createdBy: number;
    updatedBy: number | null;
    createdAt: string;
    updatedAt: string | null;
    lastPublishedAt: string;
  }
  
  export interface ArticlesResponse {
    articles: {
      page: number;
      pages: number;
      count: number;
      items: ArticleRef[];
    };
  }

export function fetchArticles(categoryId: number, options: FetchOptions = { }): Promise<ArticlesResponse> {
    return new Promise<ArticlesResponse>((res: any, rej: any) => {
        const queryParams = new URLSearchParams({
            page: (options.page || 1).toString(),
            status: options.status || 'all',
            sort: (options.sort || 'order').toString(),
            order: options.order || 'desc',
            pageSize: (options.pageSize || 50).toString(),
        });
    
        const path = `/v1/collections/${categoryId}/articles?${queryParams.toString()}`
        const requestOptions = {
            hostname: 'docsapi.helpscout.net',
            path: path,
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `${config.helpscout_key}:X`,
            }
        }
    
        const req = http.request(requestOptions, (res: any) => {
            let data = ''
    
            res.on('data', (chunk: string) => {
                console.log(chunk.toString())
                data += chunk
            })
    
            res.on('end', () => {
                res(JSON.parse(data))
            })
        })
    
        req.on('error', (error: string) => {
            rej(error)
        })
    
        req.end()
    })
}