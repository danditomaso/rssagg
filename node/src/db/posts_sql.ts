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
ON CONFLICT (url) DO NOTHING
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

export const getPostsForUserQuery = `-- name: GetPostsForUser :many
SELECT posts.id, posts.created_at, posts.updated_at, posts.title, posts.description, posts.published_at, posts.url, posts.feed_id from posts  
JOIN feed_follows ON posts.feed_id = feed_follows.feed_id
WHERE feed_follows.user_id = $1
ORDER BY posts.published_at DESC
LIMIT $2`;

export interface GetPostsForUserArgs {
    userId: string;
    limit: string;
}

export interface GetPostsForUserRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    publishedAt: Date;
    url: string;
    feedId: string;
}

export async function getPostsForUser(client: Client, args: GetPostsForUserArgs): Promise<GetPostsForUserRow[]> {
    const result = await client.query({
        text: getPostsForUserQuery,
        values: [args.userId, args.limit],
        rowMode: "array"
    });
    return result.rows.map(row => {
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
    });
}

