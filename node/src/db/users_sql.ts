import type { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const createUserQuery = `-- name: CreateUser :one
INSERT INTO users (id, created_at, updated_at, name, api_key)
VALUES ($1, $2, $3, $4, encode(sha256(random()::text::bytea), 'hex'))
RETURNING id, created_at, updated_at, name, api_key`;

export interface CreateUserArgs {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
}

export interface CreateUserRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    apiKey: string;
}

export async function createUser(
    client: Client,
    args: CreateUserArgs,
): Promise<CreateUserRow | null> {
    const result = await client.query({
        text: createUserQuery,
        values: [args.id, args.createdAt, args.updatedAt, args.name],
        rowMode: "array",
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
        apiKey: row[4],
    };
}

export const getUserByAPIKeyQuery = `-- name: GetUserByAPIKey :one
SELECT id, created_at, updated_at, name, api_key FROM users WHERE api_key = $1`;

export interface GetUserByAPIKeyArgs {
    apiKey: string;
}

export interface GetUserByAPIKeyRow {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    apiKey: string;
}

export async function getUserByAPIKey(
    client: Client,
    args: GetUserByAPIKeyArgs,
): Promise<GetUserByAPIKeyRow | null> {
    const result = await client.query({
        text: getUserByAPIKeyQuery,
        values: [args.apiKey],
        rowMode: "array",
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
        apiKey: row[4],
    };
}
