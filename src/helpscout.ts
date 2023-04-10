const https = require('https')
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

export function fetchArticles(categoryId: number, options: FetchOptions = { }): Promise<ArticleRef[]> {
    return new Promise<ArticleRef[]>((res: any, rej: any) => {
        const queryParams = new URLSearchParams({
            page: (options.page || 1).toString(),
            status: options.status || 'all',
            sort: (options.sort || 'order').toString(),
            order: options.order || 'desc',
            pageSize: (options.pageSize || 50).toString(),
        });
    
        const path = `/v1/categories/${categoryId}/articles?${queryParams.toString()}`
        const requestOptions = {
            hostname: 'docsapi.helpscout.net',
            path: path,
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${config.helpscout_key}:X`).toString('base64')}`,
            }
        }
    
        const req = https.request(requestOptions, (http_res: any) => {
            let data = ''
    
            http_res.on('data', (chunk: string) => {
                console.log(chunk.toString())
                data += chunk
            })
    
            http_res.on('end', () => {
                res(JSON.parse(data).items)
            })
        })
    
        req.on('error', (error: string) => {
            rej(error)
        })
    
        req.end()
    })
}

interface Article {
    name: string
    text: string
}

function parseIdFromLocationString(locationString: string) {
    const parts = locationString.split('/');
    return parts[parts.length - 1];
}

export async function createArticle(params: Article): Promise<string> {
    return new Promise<string>((res: any, rej: any) => {
        const path = `/v1/articles`
        const requestOptions = {
            hostname: 'docsapi.helpscout.net',
            path: path,
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${config.helpscout_key}:X`).toString('base64')}`,
            },
            body: {
                name: params.name,
                text: params.text,
                status: 'unpublished',
                collectionId: 1
            }
        }
    
        const req = https.request(requestOptions, (http_res: any) => {
            let data = ''
    
            http_res.on('data', (chunk: string) => {
                console.log(chunk.toString())
                data += chunk
            })
    
            http_res.on('end', () => {
                res(parseIdFromLocationString(JSON.parse(data).location))
            })
        })
    
        req.on('error', (error: string) => {
            rej(error)
        })
    
        req.end()
    })
}