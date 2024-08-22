import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createPostQuery = `-- name: CreatePost :one
INSERT INTO posts (id, 
created_at, 
updated_at, 
title, 
description, 
url, 
published_at,
feed_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, created_at, updated_at, title, description, published_at, url, feed_id`;

export interface CreatePostArgs {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    url: string;
    publishedAt: Date;
    feedId: string;
}

export interface CreatePostRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    publishedAt: Date;
    url: string;
    feedId: string;
}

export async function createPost(client: Client, args: CreatePostArgs): Promise<CreatePostRow | null> {
    const result = await client.query({
        text: createPostQuery,
        values: [args.id, args.createdAt, args.updatedAt, args.title, args.description, args.url, args.publishedAt, args.feedId],
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
        title: row[3],
        description: row[4],
        publishedAt: row[5],
        url: row[6],
        feedId: row[7]
    };
}

