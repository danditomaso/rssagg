import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createFeedQuery = `-- name: CreateFeed :one
INSERT INTO feeds (id, created_at, updated_at, name, url, user_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, created_at, updated_at, name, url, user_id`;

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
        userId: row[5]
    };
}

export const getFeedsQuery = `-- name: GetFeeds :many
SELECT id, created_at, updated_at, name, url, user_id from feeds`;

export interface GetFeedsRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url: string;
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
            userId: row[5]
        };
    });
}

