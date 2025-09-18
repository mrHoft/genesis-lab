# API Documentation

## Base URL
`http://localhost:3000/api`

## Health Check

<details>
<summary><code>GET</code> <code><b>/health</b></code> <code>(Check server status)</code></summary>

### Response
```json
{
  "status": "OK",
  "timestamp": 1700000000000,
  "uptime": 3600
}
```

</details>

---

## User Endpoints

<details>
<summary><code>GET</code> <code><b>/user</b></code> <code>(Get current user or create anonymous)</code></summary>

### Description
Returns the current authenticated user. If no authentication header is provided, creates an anonymous user.

### Headers
- Optional: `Authorization: Bearer <token>`

### Response
```json
{
  "id": "abc123",
  "name": "Anonymous User",
  "login": null,
  "version": 1,
  "createdAt": 1700000000,
  "updatedAt": 1700000000
}
```

</details>

<details>
<summary><code>GET</code> <code><b>/user/all</b></code> <code>(Get all users - development only)</code></summary>

### Description
Returns all users. Disabled in production environment.

### Headers
- Required: `Authorization: Bearer <token>`

### Response
```json
[
  {
    "id": "abc123",
    "name": "John Doe",
    "login": "johndoe",
    "version": 1,
    "createdAt": 1700000000,
    "updatedAt": 1700000000
  }
]
```

</details>

<details>
<summary><code>GET</code> <code><b>/user/:id</b></code> <code>(Get user by ID)</code></summary>

### Parameters
- `id` (path) - User ID

### Response
```json
{
  "id": "abc123",
  "name": "John Doe",
  "login": "johndoe",
  "version": 1,
  "createdAt": 1700000000,
  "updatedAt": 1700000000
}
```

</details>

<details>
<summary><code>POST</code> <code><b>/user</b></code> <code>(Create new user)</code></summary>

### Body
```json
{
  "name": "John Doe",
  "login": "johndoe",
  "password": "securePassword123!"
}
```

### Response
```json
{
  "id": "abc123",
  "name": "John Doe",
  "login": "johndoe",
  "version": 1,
  "createdAt": 1700000000,
  "updatedAt": 1700000000
}
```

</details>

<details>
<summary><code>POST</code> <code><b>/user/login</b></code> <code>(User login)</code></summary>

### Body
```json
{
  "login": "johndoe",
  "password": "securePassword123!"
}
```

### Response
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "login": "johndoe",
    "version": 1,
    "createdAt": 1700000000,
    "updatedAt": 1700000000
  }
}
```

</details>

<details>
<summary><code>POST</code> <code><b>/user/refresh</b></code> <code>(Refresh tokens)</code></summary>

### Body
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

### Response
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

</details>

<details>
<summary><code>PATCH</code> <code><b>/user/:id</b></code> <code>(Update user)</code></summary>

### Parameters
- `id` (path) - User ID

### Headers
- Required: `Authorization: Bearer <token>` OR include current password in body

### Body
```json
{
  "password": "currentPassword",
  "newPassword": "newSecurePassword123!",
  "name": "John Updated",
  "login": "johnupdated"
}
```

### Response
```json
{
  "id": "abc123",
  "name": "John Updated",
  "login": "johnupdated",
  "version": 2,
  "createdAt": 1700000000,
  "updatedAt": 1700001000
}
```

</details>

<details>
<summary><code>DELETE</code> <code><b>/user/:id</b></code> <code>(Delete user - development only)</code></summary>

### Parameters
- `id` (path) - User ID

### Response
- Status: `204 No Content`

</details>

---

## Gallery Endpoints

<details>
<summary><code>GET</code> <code><b>/gallery</b></code> <code>(Get gallery items with pagination)</code></summary>

### Query Parameters
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10, max: 100)
- `user_id` (optional) - Filter by user ID

### Response
```json
[
  {
    "id": 1,
    "user_id": "abc123",
    "thumbnail": "https://example.com/thumb1.jpg",
    "props": { "title": "Artwork 1", "category": "digital" },
    "likes": ["user1", "user2"],
    "views": 150,
    "created_at": 1700000000
  }
]
```

</details>

<details>
<summary><code>GET</code> <code><b>/gallery/:id</b></code> <code>(Get specific gallery item)</code></summary>

### Parameters
- `id` (path) - Gallery item ID

### Response
```json
{
  "id": 1,
  "user_id": "abc123",
  "thumbnail": "https://example.com/thumb1.jpg",
  "props": { "title": "Artwork 1", "category": "digital" },
  "likes": ["user1", "user2"],
  "views": 150,
  "created_at": 1700000000
}
```

</details>

<details>
<summary><code>POST</code> <code><b>/gallery</b></code> <code>(Create gallery item)</code></summary>

### Headers
- Required: `Authorization: Bearer <token>`

### Body
```json
{
  "thumbnail": "https://example.com/thumb1.jpg",
  "props": { "title": "New Artwork", "category": "painting" }
}
```

### Response
```json
{
  "id": 1,
  "user_id": "abc123",
  "thumbnail": "https://example.com/thumb1.jpg",
  "props": { "some" },
  "likes": [],
  "views": 0,
  "created_at": 1700000000
}
```

</details>

<details>
<summary><code>POST</code> <code><b>/gallery/:id/like</b></code> <code>(Toggle like on gallery item)</code></summary>

### Parameters
- `id` (path) - Gallery item ID

### Headers
- Required: `Authorization: Bearer <token>`

### Response
```json
{
  "id": 1,
  "user_id": "abc123",
  "thumbnail": "https://example.com/thumb1.jpg",
  "props": { "some" },
  "likes": ["user1", "user2", "current_user"],
  "views": 150,
  "created_at": 1700000000
}
```

</details>

<details>
<summary><code>DELETE</code> <code><b>/gallery/:id</b></code> <code>(Delete gallery item)</code></summary>

### Parameters
- `id` (path) - Gallery item ID

### Headers
- Required: `Authorization: Bearer <token>`

### Response
- Status: `204 No Content`

</details>

---

## Error Responses

### Common Error Format
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## CORS
- Allowed Origins: `http://localhost:3000`, `http://localhost:3004`
- Allowed Methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- Allowed Headers: `Content-Type, Authorization, X-Requested-With`

---

## Environment Variables
```env
PORT=3004
API_PREFIX=/api
JWT_TOKEN_KEY=your-secret-key
JWT_REFRESH_KEY=your-refresh-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
```

This documentation provides a comprehensive overview of all available API endpoints with examples and requirements.
