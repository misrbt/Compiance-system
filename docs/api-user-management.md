# User Management API Documentation

Base URL: `https://rbtcompliance.rbtbank.com/api`

All requests and responses use `application/json`.

---

## Authentication

This API uses **Laravel Sanctum** token-based authentication. Protected endpoints require a Bearer token in the `Authorization` header.

```
Authorization: Bearer {your-token}
```

Obtain a token by calling the [Login](#post-authlogin) endpoint.

---

## Endpoints Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/auth/login` | No | Login and get a token |
| `POST` | `/auth/logout` | Yes | Logout and revoke token |
| `GET` | `/auth/me` | Yes | Get authenticated user |
| `POST` | `/register` | No | Register a new user (legacy) |
| `GET` | `/users` | Yes | List all users |
| `POST` | `/users` | Yes | Create a new user |
| `GET` | `/users/{id}` | Yes | Get a specific user |
| `PUT` | `/users/{id}` | Yes | Update a user |
| `DELETE` | `/users/{id}` | Yes | Delete a user |
| `POST` | `/users/{id}/reset-password` | Yes | Reset a user's password |

---

## Authentication Endpoints

### POST /auth/login

Authenticates a user and returns a Bearer token.

**Request Body**

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `email` | string | Yes | User's email address |
| `password` | string | Yes | User's password |
| `device_name` | string | No | Label for the token (default: `api-token`) |

**Example Request**

```json
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "your-password",
    "device_name": "my-system"
}
```

**Success Response** `200 OK`

```json
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "user@example.com",
            "email_verified_at": null,
            "created_at": "2025-11-28T06:31:01.000000Z",
            "updated_at": "2025-11-28T06:31:01.000000Z"
        },
        "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "token_type": "Bearer"
    }
}
```

**Error Response** `401 Unauthorized`

```json
{
    "success": false,
    "message": "The provided credentials are incorrect."
}
```

---

### POST /auth/logout

Revokes the current Bearer token.

**Headers**

```
Authorization: Bearer {token}
```

**Success Response** `200 OK`

```json
{
    "success": true,
    "message": "Logged out successfully."
}
```

---

### GET /auth/me

Returns the currently authenticated user.

**Headers**

```
Authorization: Bearer {token}
```

**Success Response** `200 OK`

```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "user@example.com",
            "email_verified_at": null,
            "created_at": "2025-11-28T06:31:01.000000Z",
            "updated_at": "2025-11-28T06:31:01.000000Z"
        }
    }
}
```

---

## User Management Endpoints

> All endpoints below require `Authorization: Bearer {token}`.

---

### GET /users

Returns a list of all users, ordered by name.

**Example Request**

```
GET /api/users
Authorization: Bearer {token}
```

**Success Response** `200 OK`

```json
{
    "success": true,
    "data": {
        "users": [
            {
                "id": 1,
                "name": "Augustin Maputol",
                "email": "augustincabanamaputol@gmail.com",
                "email_verified_at": null,
                "created_at": "2025-11-28T06:31:01.000000Z",
                "updated_at": "2025-11-28T06:31:01.000000Z"
            }
        ]
    }
}
```

---

### POST /users

Creates a new user account.

**Request Body**

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | Yes | Full name (max 255 chars) |
| `email` | string | Yes | Unique email address (max 255 chars) |
| `password` | string | Yes | Password (must meet password policy) |
| `password_confirmation` | string | Yes | Must match `password` |

**Example Request**

```json
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePass@123",
    "password_confirmation": "SecurePass@123"
}
```

**Success Response** `201 Created`

```json
{
    "success": true,
    "message": "User created successfully.",
    "data": {
        "user": {
            "id": 8,
            "name": "Jane Doe",
            "email": "jane@example.com",
            "email_verified_at": null,
            "created_at": "2026-03-17T00:00:00.000000Z",
            "updated_at": "2026-03-17T00:00:00.000000Z"
        }
    }
}
```

**Error Response** `422 Unprocessable Entity`

```json
{
    "message": "This email address is already registered.",
    "errors": {
        "email": ["This email address is already registered."]
    }
}
```

---

### GET /users/{id}

Returns a specific user by ID.

**Example Request**

```
GET /api/users/1
Authorization: Bearer {token}
```

**Success Response** `200 OK`

```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "Augustin Maputol",
            "email": "augustincabanamaputol@gmail.com",
            "email_verified_at": null,
            "created_at": "2025-11-28T06:31:01.000000Z",
            "updated_at": "2025-11-28T06:31:01.000000Z"
        }
    }
}
```

**Error Response** `404 Not Found`

```json
{
    "message": "No query results for model [App\\Models\\User] 99"
}
```

---

### PUT /users/{id}

Updates a user's name and/or email. Only include the fields you want to change.

**Request Body**

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | No | Full name (max 255 chars) |
| `email` | string | No | Unique email address (max 255 chars) |

**Example Request**

```json
PUT /api/users/1
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Augustin C. Maputol",
    "email": "new-email@example.com"
}
```

**Success Response** `200 OK`

```json
{
    "success": true,
    "message": "User updated successfully.",
    "data": {
        "user": {
            "id": 1,
            "name": "Augustin C. Maputol",
            "email": "new-email@example.com",
            "email_verified_at": null,
            "created_at": "2025-11-28T06:31:01.000000Z",
            "updated_at": "2026-03-17T00:00:00.000000Z"
        }
    }
}
```

---

### DELETE /users/{id}

Deletes a user account and revokes all their tokens.

**Example Request**

```
DELETE /api/users/1
Authorization: Bearer {token}
```

**Success Response** `200 OK`

```json
{
    "success": true,
    "message": "User deleted successfully."
}
```

---

### POST /users/{id}/reset-password

Resets a user's password. All existing sessions/tokens for that user are revoked.

**Request Body**

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `password` | string | Yes | New password (must meet password policy) |
| `password_confirmation` | string | Yes | Must match `password` |

**Example Request**

```json
POST /api/users/1/reset-password
Authorization: Bearer {token}
Content-Type: application/json

{
    "password": "NewSecurePass@123",
    "password_confirmation": "NewSecurePass@123"
}
```

**Success Response** `200 OK`

```json
{
    "success": true,
    "message": "Password reset successfully. All existing sessions have been revoked."
}
```

**Error Response** `422 Unprocessable Entity`

```json
{
    "message": "Password confirmation does not match.",
    "errors": {
        "password": ["Password confirmation does not match."]
    }
}
```

---

## Legacy Registration Endpoint

### POST /register

Creates a new user account. This is the legacy endpoint kept for backward compatibility. Prefer `POST /users` for new integrations.

**Request Body**

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | Yes | Full name (max 255 chars) |
| `email` | string | Yes | Unique email address (max 255 chars) |
| `password` | string | Yes | Password (must meet password policy) |
| `password_confirmation` | string | Yes | Must match `password` |

---

## User Object

All user endpoints return a consistent user object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique user ID |
| `name` | string | Full name |
| `email` | string | Email address |
| `email_verified_at` | string\|null | ISO 8601 timestamp or null |
| `created_at` | string | ISO 8601 timestamp |
| `updated_at` | string | ISO 8601 timestamp |

---

## Error Handling

### Validation Errors `422`

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "field_name": ["Error message here."]
    }
}
```

### Unauthenticated `401`

```json
{
    "message": "Unauthenticated."
}
```

### Not Found `404`

```json
{
    "message": "No query results for model [App\\Models\\User] {id}"
}
```

---

## Integration Example (JavaScript / Fetch)

```javascript
const BASE_URL = 'https://rbtcompliance.rbtbank.com/api';

// 1. Login and get token
const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'your-password',
        device_name: 'my-integration'
    })
});
const { data } = await loginResponse.json();
const token = data.token;

// 2. Use token for subsequent requests
const usersResponse = await fetch(`${BASE_URL}/users`, {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
const users = await usersResponse.json();
```

## Integration Example (PHP / cURL)

```php
$baseUrl = 'https://rbtcompliance.rbtbank.com/api';

// 1. Login
$ch = curl_init("{$baseUrl}/auth/login");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode([
        'email' => 'user@example.com',
        'password' => 'your-password',
    ]),
]);
$response = json_decode(curl_exec($ch), true);
$token = $response['data']['token'];

// 2. Get all users
$ch = curl_init("{$baseUrl}/users");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
    ],
]);
$users = json_decode(curl_exec($ch), true);
```
