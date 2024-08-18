import type { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createFeedFollowQuery = `-- name: CreateFeedFollow :one
INSERT INTO feed_follows (id, created_at, updated_at, user_id, feed_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, created_at, updated_at, user_id, feed_id, last_fetched_at`;

export interface CreateFeedFollowArgs {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    feedId: string;
}

export interface CreateFeedFollowRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    feedId: string;
    lastFetchedAt: Date | null;
}

export async function createFeedFollow(client: Client, args: CreateFeedFollowArgs): Promise<CreateFeedFollowRow | null> {
    const result = await client.query({
        text: createFeedFollowQuery,
        values: [args.id, args.createdAt, args.updatedAt, args.userId, args.feedId],
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
        userId: row[3],
        feedId: row[4],
        lastFetchedAt: row[5]
    };
}

export const getFeedFollowsQuery = `-- name: GetFeedFollows :many
SELECT id, created_at, updated_at, user_id, feed_id, last_fetched_at FROM feed_follows WHERE user_id=$1`;

export interface GetFeedFollowsArgs {
    userId: string;
}

export interface GetFeedFollowsRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    feedId: string;
    lastFetchedAt: Date | null;
}

export async function getFeedFollows(client: Client, args: GetFeedFollowsArgs): Promise<GetFeedFollowsRow[]> {
    const result = await client.query({
        text: getFeedFollowsQuery,
        values: [args.userId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            createdAt: row[1],
            updatedAt: row[2],
            userId: row[3],
            feedId: row[4],
            lastFetchedAt: row[5]
        };
    });
}

export const deleteFeedFollowQuery = `-- name: DeleteFeedFollow :exec
DELETE FROM feed_follows WHERE id=$1 AND user_id=$2`;

export interface DeleteFeedFollowArgs {
    id: string;
    userId: string;
}

export async function deleteFeedFollow(client: Client, args: DeleteFeedFollowArgs): Promise<void> {
    await client.query({
        text: deleteFeedFollowQuery,
        values: [args.id, args.userId],
        rowMode: "array"
    });
}

