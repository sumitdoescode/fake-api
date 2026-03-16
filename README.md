# Fake API

A fake REST API built with Hono and deployed on Cloudflare Workers.

This API exposes seeded `users`, `posts`, `comments`, `animals`, health, and delay endpoints. It is designed for frontend development, testing, demos, and mock integrations.

## Base URL

Replace this with your deployed Worker URL:

```txt
https://your-project.your-subdomain.workers.dev
```

Examples in this README use:

```txt
https://your-project.your-subdomain.workers.dev
```

## Important Behavior

- Seed data is loaded from local JSON files.
- New records are stored in memory at runtime, not in a database.
- Data created, updated, or deleted through the API is not guaranteed to persist across deployments, restarts, or isolate changes.
- Some update and delete operations are intentionally blocked for seed records with IDs `<= 100`.

## Response Format

List endpoints generally return:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

The exact total key varies by resource:

- users: `totalUsers`
- posts: `totalPosts`
- comments: `totalComments`
- animals: `totalAnimals`

Single-resource endpoints return the resource object directly.

Validation and business-rule failures return an `error` field:

```json
{
  "error": "Message here"
}
```

## Root Endpoints

### `GET /`

Returns basic API metadata.

Example:

```bash
curl https://your-project.your-subdomain.workers.dev/
```

### `GET /api/health`

Simple health check endpoint.

Example:

```bash
curl https://your-project.your-subdomain.workers.dev/api/health
```

## Users

Base path:

```txt
/api/users
```

### `GET /api/users`

Get paginated users.

Query params:

- `page` default: `1`
- `limit` default: `10`

Example:

```bash
curl "https://your-project.your-subdomain.workers.dev/api/users?page=1&limit=10"
```

### `GET /api/users/random`

Get one random user.

### `GET /api/users/:id`

Get a user by ID.

### `POST /api/users`

Create a new user.

Request body:

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com"
}
```

Notes:

- `name` must be at least 3 characters
- `username` must be at least 3 characters
- `email` must be valid
- duplicate `username` and `email` are rejected

### `PUT /api/users/:id`

Update a user.

Request body:

```json
{
  "name": "John Doe Updated",
  "username": "johndoeupdated",
  "email": "john.updated@example.com"
}
```

Notes:

- users with IDs `<= 100` cannot be updated

### `DELETE /api/users/:id`

Delete a user.

Notes:

- users with IDs `<= 100` cannot be deleted

## User-Nested Resources

### `GET /api/users/:id/posts`

Get all posts created by a specific user.

Example:

```bash
curl https://your-project.your-subdomain.workers.dev/api/users/1/posts
```

### `POST /api/users/:id/posts`

Create a post for a specific user.

Request body:

```json
{
  "title": "New post",
  "description": "This is a post created for a specific user.",
  "tags": ["api", "demo"]
}
```

Notes:

- `title` must be at least 3 characters
- `description` must be at least 3 characters
- `tags` is optional
- the `userId` comes from the URL, not the body

### `GET /api/users/:id/comments`

Get all comments created by a specific user.

### `POST /api/users/:userId/posts/:postId/comments`

Create a comment authored by a specific user on a specific post.

Request body:

```json
{
  "text": "This post is useful."
}
```

Notes:

- `userId` comes from the URL
- `postId` comes from the URL
- `text` must be at least 3 characters

## Posts

Base path:

```txt
/api/posts
```

### `GET /api/posts`

Get paginated posts.

Query params:

- `page` default: `1`
- `limit` default: `10`

### `GET /api/posts/random`

Get one random post.

### `GET /api/posts/search`

Search posts by `title`, `description`, or `tags`.

Query params:

- `q`
- `query`

At least one of them must be provided.

Example:

```bash
curl "https://your-project.your-subdomain.workers.dev/api/posts/search?q=tech"
```

Response:

```json
{
  "query": "tech",
  "total": 2,
  "data": []
}
```

### `GET /api/posts/:id`

Get a post by ID.

### `PUT /api/posts/:id`

Update a post.

Request body:

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "tags": ["updated", "api"]
}
```

Notes:

- all fields are optional
- posts with IDs `<= 100` cannot be updated

### `DELETE /api/posts/:id`

Delete a post.

Notes:

- posts with IDs `<= 100` cannot be deleted

## Post-Nested Resources

### `GET /api/posts/:id/comments`

Get all comments for a specific post.

Example:

```bash
curl https://your-project.your-subdomain.workers.dev/api/posts/1/comments
```

## Comments

Base path:

```txt
/api/comments
```

### `GET /api/comments`

Get paginated comments.

Query params:

- `page` default: `1`
- `limit` default: `10`

### `GET /api/comments/random`

Get one random comment.

### `GET /api/comments/:id`

Get a comment by ID.

### `DELETE /api/comments/:id`

Delete a comment.

Notes:

- comments with IDs `<= 100` cannot be deleted

## Animals

Base path:

```txt
/api/animals
```

### `GET /api/animals`

Get paginated animals.

Query params:

- `page` default: `1`
- `limit` default: `10`

### `GET /api/animals/random`

Get one random animal.

### `GET /api/animals/:id`

Get an animal by ID.

## Delay

Base path:

```txt
/api/delay
```

### `GET /api/delay`

Responds after the default delay of `1000ms`.

### `GET /api/delay/:ms`

Responds after the specified delay in milliseconds.

Example:

```bash
curl https://your-project.your-subdomain.workers.dev/api/delay/2000
```

Example response:

```json
{
  "message": "Response delayed by 2000ms"
}
```

## Sample cURL Requests

### Create a user

```bash
curl -X POST https://your-project.your-subdomain.workers.dev/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Doe\",\"username\":\"janedoe\",\"email\":\"jane@example.com\"}"
```

### Create a post for a user

```bash
curl -X POST https://your-project.your-subdomain.workers.dev/api/users/101/posts \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Hello\",\"description\":\"Post body\",\"tags\":[\"demo\",\"api\"]}"
```

### Create a comment for a user on a post

```bash
curl -X POST https://your-project.your-subdomain.workers.dev/api/users/101/posts/1/comments \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Nice post\"}"
```

### Search posts

```bash
curl "https://your-project.your-subdomain.workers.dev/api/posts/search?q=api"
```

## Deployment

This project is configured for Cloudflare Workers through Wrangler.

Deploy:

```bash
npm run deploy
```

After deployment, Cloudflare will return your Worker URL. Use that URL as the base URL in this README.

## Tech Stack

- Hono
- Cloudflare Workers
- Wrangler
- TypeScript
- Zod

## Notes

- This is a fake API, not a production persistence layer.
- There is no authentication.
- User identity for comment creation is modeled through the URL, not through auth.
- Because there is no database, runtime mutations should be treated as temporary.
