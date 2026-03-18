# Fake API

Simple fake REST API built with Hono, TypeScript, and Cloudflare Workers.

It is intended for frontend practice, demos, and testing UI states without setting up a real backend. The API serves seeded JSON data and also supports basic create, update, and delete flows for selected resources.

## Base URL

```txt
https://api.sumitdoescode.me
```

## What It Has

- Users
- Posts
- Comments
- Animals
- Health check
- Delay endpoint for testing loaders and skeleton states

## Tech Stack

- Hono
- TypeScript
- Cloudflare Workers
- Zod for validation

## How It Works

- Seed data is loaded from local JSON files.
- Most responses are JSON with standard REST-style status codes.
- CORS is enabled for all origins, so it can be used directly from frontend apps.
- This API is useful for prototyping, mock integrations, and UI testing.

## Important Notes

- Seed data comes from local JSON files.
- New data is stored in memory at runtime.
- Runtime changes are not guaranteed to persist after restart or redeploy.
- Some seeded records with IDs `<= 100` cannot be updated or deleted.
- There is no authentication.

## Main Endpoints

### Root

- `GET /`
- `GET /health`

### Users

- `GET /users`
- `GET /users/random`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /users/:id/posts`
- `POST /users/:id/posts`
- `GET /users/:id/comments`
- `POST /users/:userId/posts/:postId/comments`

### Posts

- `GET /posts`
- `GET /posts/random`
- `GET /posts/search?q=term`
- `GET /posts/:id`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `GET /posts/:id/comments`

### Comments

- `GET /comments`
- `GET /comments/random`
- `GET /comments/:id`
- `DELETE /comments/:id`

### Animals

- `GET /animals`
- `GET /animals/random`
- `GET /animals/:id`

### Delay

- `GET /delay`
- `GET /delay/:ms`

## Quick Examples

```bash
curl https://api.sumitdoescode.me/health
curl https://api.sumitdoescode.me/users
curl https://api.sumitdoescode.me/posts/search?q=api
curl https://api.sumitdoescode.me/delay/2000
```
