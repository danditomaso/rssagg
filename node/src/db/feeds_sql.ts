import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createFeedQuery = `-- name: CreateFeed :one
INSERT INTO feeds (id, created_at, updated_at, name, url, user_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, created_at, updated_at, name, url, last_fetched_at, user_id`;

export interface CreateFeedArgs {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url: string;
    userId: string;
}

export interface CreateFeedRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url: string;
    lastFetchedAt: Date | null;
    userId: string;
}

export async function createFeed(client: Client, args: CreateFeedArgs): Promise<CreateFeedRow | null> {
    const result = await client.query({
        text: createFeedQuery,
        values: [args.id, args.createdAt, args.updatedAt, args.name, args.url, args.userId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        createdAt: row[1],
        updatedAt: row[2],
        name: row[3],
        url: row[4],
        lastFetchedAt: row[5],
        userId: row[6]
    };
}

export const getFeedsQuery = `-- name: GetFeeds :many
SELECT id, created_at, updated_at, name, url, last_fetched_at, user_id from feeds`;

export interface GetFeedsRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url: string;
    lastFetchedAt: Date | null;
    userId: string;
}

export async function getFeeds(client: Client): Promise<GetFeedsRow[]> {
    const result = await client.query({
        text: getFeedsQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            createdAt: row[1],
            updatedAt: row[2],
            name: row[3],
            url: row[4],
            lastFetchedAt: row[5],
            userId: row[6]
        };
    });
}

export const getNextFeedsToFetchQuery = `-- name: GetNextFeedsToFetch :many
SELECT id, created_at, updated_at, name, url, last_fetched_at, user_id from feeds 
ORDER BY last_fetched_at ASC NULLS FIRST
LIMIT $1`;

export interface GetNextFeedsToFetchArgs {
    limit: string;
}

export interface GetNextFeedsToFetchRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url: string;
    lastFetchedAt: Date | null;
    userId: string;
}

export async function getNextFeedsToFetch(client: Client, args: GetNextFeedsToFetchArgs): Promise<GetNextFeedsToFetchRow[]> {
    const result = await client.query({
        text: getNextFeedsToFetchQuery,
        values: [args.limit],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            createdAt: row[1],
            updatedAt: row[2],
            name: row[3],
            url: row[4],
            lastFetchedAt: row[5],
            userId: row[6]
        };
    });
}

export const markFeedAsFetchedQuery = `-- name: MarkFeedAsFetched :one
UPDATE feeds
SET last_fetched_at = NOW(),
updated_at = NOW()
WHERE id = $1
RETURNING id, created_at, updated_at, name, url, last_fetched_at, user_id`;

export interface MarkFeedAsFetchedArgs {
    id: string;
}

export interface MarkFeedAsFetchedRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url: string;
    lastFetchedAt: Date | null;
    userId: string;
}

export async function markFeedAsFetched(client: Client, args: MarkFeedAsFetchedArgs): Promise<MarkFeedAsFetchedRow | null> {
    const result = await client.query({
        text: markFeedAsFetchedQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        createdAt: row[1],
        updatedAt: row[2],
        name: row[3],
        url: row[4],
        lastFetchedAt: row[5],
        userId: row[6]
    };
}

