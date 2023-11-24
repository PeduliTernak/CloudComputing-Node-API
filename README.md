#

## How to Use

1. Place Firestore service account in the root directory named `firestore.json`

2. Add this values to Environment Variables or file `.env`

    ```bash
    FIRESTORE_PROJECT_ID=your-GCP-project-id
    FIRESTORE_SERVICE_ACCOUNT_KEY_FILE=firestore.json
    SECRET=something-secret
    ```

3. Start the application

    ```bash
    npm install
    npm start
    ```

## API Documentation

### Summary

Base URL: *soon*

| Route | HTTP Method | Description | Token Required?
| - | - | - | :-:
| /api/register       | POST | Sign up a new user | -
| /api/login          | POST | Login user | -
| /api/users          | GET | Get user data | Yes
| /api/users          | PUT | Change user data | Yes
| /api/users          | DELETE | Delete user | Yes
| /api/prediction     | POST | Predict the image | Yes
| /api/prediction     | GET | Get all the user's prediction history | Yes
| /api/prediction/:id | GET | Get prediction history by id | Yes
| /api/prediction/:id | DELETE | Delete prediction history by id | Yes

### Token Authorization

You will receive the token after succesfully request to `/api/register` or `/api/login`.

#### Usage

Put the token in the **Header** with `Authorization` key and `Bearer <token>` value.

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Otherwise, the request will response 401 Unauthorized

```json
{
  "status": false,
  "error": "unauthorized access"
}
```

------------------------------------------------------
------------------------------------------------------

### Endpoints (User, Login, Register)

#### **POST `/api/register` - Sign up a new user**

##### Request
- **Method:** POST
- **Path:** `/api/register`
- **Body:**
    ```json
    {
      "username": "john_doe",
      "name": "John Doe",
      "noTelepon": "6285123456",
      "password": "password123"
    }
    ```

##### Response
- **Status: 200 OK**
    ```json
    {
      "status": true,
      "message": "register success",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "username": "john_doe",
        "name": "John Doe",
        "noTelepon": "6285123456",
      }
    }
    ```

- **Status: 400 Bad Request**
    ```json
    {
      "status": false,
      "error": "invalid request argument"
    }
    ```

- **Status: 409 Conflict**
    ```json
    {
      "status": false,
      "error": "username is already exist"
    }
    ```

------------------------------------------------------

#### **POST `/api/login` - Login user**

##### Request
- **Method:** POST
- **Path:** `/api/login`
- **Body:**
    ```json
    {
      "username": "john_doe",
      "password": "password123"
    }
    ```

##### Response
- **Status: 200 OK**
    ```json
    {
      "status": true,
      "message": "login success",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "username": "john_doe",
        "name": "John Doe",
        "noTelepon": "6285123456",
      }
    }
    ```

- **Status: 400 Bad Request**
    ```json
    {
      "status": false,
      "error": "invalid request argument"
    }
    ```

- **Status: 401 Unauthorized**
    ```json
    {
      "status": false,
      "error": "invalid username or password"
    }
    ```

------------------------------------------------------

#### **GET `/api/users` - Get user data**

##### Request
- **Method:** GET
- **Path:** `/api/users`

##### Response
- **Status: 200 OK**
    ```json
    {
      "status": true,
      "user": {
        "username": "john_doe",
        "name": "John Doe",
        "noTelepon": "6285123456",
      }
    }

- **Status: 404 Not Found**
    ```json
    {
      "status": false,
      "error": "user not found"
    }
    ```

------------------------------------------------------

#### **PUT `/api/users` - Change user data**

##### Request
- **Method:** PUT
- **Path:** `/api/users`
- **Body:**
    ```json
    {
      "name": "Updated Name",
      "noTelepon": "6285123456",
      "password": "new_password"
    }
    ```

##### Response
- **Status: 200 OK**
    ```json
    {
      "status": true,
      "message": "user data updated successfully"
    }
    ```

- **Status: 400 Bad Request**
    ```json
    {
      "status": false,
      "error": "invalid request argument"
    }
    ```

------------------------------------------------------

#### **DELETE `/api/users` - Delete user**

##### Request
- **Method:** DELETE
- **Path:** `/api/users`

##### Response
- **Status: 204 No Content**

------------------------------------------------------
------------------------------------------------------

### Endpoints (Prediction)

*soon*
