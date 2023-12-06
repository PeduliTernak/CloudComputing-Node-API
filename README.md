# PeduliTernak - Node.js Backend

## How to Use

1. Place Firestore and Cloud Storage service account key file in the root directory

    Roles:
    - Firestore: Cloud Datastore User
    - Cloud Storage: Cloud Storage Object User

2. Add this values to Environment Variables or file `.env`

    ```.env
    PROJECT_ID=your-project-id
    FIRESTORE_SERVICE_ACCOUNT_KEY_FILE=firestore-sa.json
    CLOUD_STORAGE_SERVICE_ACCOUNT_KEY_FILE=cloudStorage-sa.json
    BUCKET=bucket-name
    SECRET=something-secret
    PREDICTION_MICRO_SERVICE_URL=http://url.com/
    ```

3. Start the application

    ```bash
    npm install
    npm start
    ```

## Testing

1. Do all things on the [How to Use](#how-to-use) section (except `npm start`)
2. Add test values to Environment Variables or file `.env` (or just keep the same values as *non-testing* variables above)

    ```.env
    TEST_PROJECT_ID=test-gcp-capstone
    TEST_FIRESTORE_SERVICE_ACCOUNT_KEY_FILE=test-firestore-sa.json
    TEST_CLOUD_STORAGE_SERVICE_ACCOUNT_KEY_FILE=test-cloudStorage-sa.json
    TEST_BUCKET=test-bucket-name
    ```

3. Place an image on the `tests/` directory named `image.jpg` (to perform image recognition/prediction testing)
4. Run the tests

    ```bash
    npm test
    ```

## API Documentation

### Summary

Base URL: <https://node-api-74e64w7rga-et.a.run.app>

| Route | HTTP Method | Description | Token Required?
| - | - | - | :-:
| /api/register       | POST | Sign up a new user | -
| /api/login          | POST | Login user | -
| /api/user           | GET | Get user data | Yes
| /api/user           | PUT | Change user data | Yes
| /api/user           | DELETE | Delete user | Yes
| /api/prediction     | POST | Predict the image and save it to database | Yes
| /api/prediction     | GET | Get all the user's prediction history | Yes
| /api/prediction/:id | GET | Get prediction history by id | Yes
| /api/prediction/:id | DELETE | Delete prediction history by id | Yes

*tip: just use `crtl+f`*

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
  "message": "unauthorized access"
}
```

------------------------------------------------------
------------------------------------------------------

### Endpoints (Login, Register)

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
      "message": "invalid request argument"
    }
    ```

- **Status: 400 Bad Request**
  - Password must at least 8 characters
  - Password must be part of the ASCII character

    ```json
    {
      "status": false,
      "message": "invalid password"
    }
    ```

- **Status: 400 Bad Request**
  - Phone number must start with +62 or 62
  - Phone number minimum length must be to 9 characters
  - Phone number maximum length must be to 15 characters

    ```json
    {
      "status": false,
      "message": "invalid phone number"
    }
    ```

- **Status: 409 Conflict**
    ```json
    {
      "status": false,
      "message": "username is already exist"
    }
    ```

- **Status: 409 Conflict**
    ```json
    {
      "status": false,
      "message": "noTelepon is already exist"
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
    or
    ```json
    {
      "noTelepon": "6285123456",
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
      "message": "invalid request argument"
    }
    ```

- **Status: 401 Unauthorized**
    ```json
    {
      "status": false,
      "message": "invalid username"
    }
    ```

- **Status: 401 Unauthorized**
    ```json
    {
      "status": false,
      "message": "invalid noTelepon"
    }
    ```

- **Status: 401 Unauthorized**
    ```json
    {
      "status": false,
      "message": "invalid password"
    }
    ```

------------------------------------------------------
------------------------------------------------------

### Endpoints (User)

#### **GET `/api/user` - Get user data**

##### Request
- **Method:** GET
- **Path:** `/api/user`

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

------------------------------------------------------

#### **PUT `/api/user` - Change user data**

##### Request
- **Method:** PUT
- **Path:** `/api/user`
- **Body:** *(no need to specify all fields)*
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
      "message": "user data updated successfully",
      "user": {
        "username": "john_doe",
        "name": "Updated Name",
        "noTelepon": "6285123456",
      }
    }
    ```

- **Status: 400 Bad Request**
    ```json
    {
      "status": false,
      "message": "invalid request argument"
    }
    ```

------------------------------------------------------

#### **DELETE `/api/user` - Delete user**

##### Request
- **Method:** DELETE
- **Path:** `/api/user`

##### Response
- **Status: 204 No Content**

------------------------------------------------------
------------------------------------------------------

### Endpoints (Prediction)

#### **POST `/api/prediction` - Predict the image and save it to the database**

##### Request
- **Method:** POST
- **Path:** `/api/prediction`
- **Body:**

  - **Form-Data** with a **single file** field named `file`
  - The file must be part of `image/*` mime types (an image like .jpg, .png)
  - Maximum file size is 5 MB

    ```yaml
    "file": image.jpg
    ```

##### Response
- **Status: 200 OK**
    ```json
    {
      "status": true,
      "prediction": {
        "id": "john_doe-uniqueId",
        "imageUrl": "https://storage.googleapis.com/bucketName/image.jpg",
        "result": "prediction result"
      }
    }
    ```

- **Status: 400 Bad Request**
    ```json
    {
      "status": false,
      "message": "invalid request argument or file format"
    }
    ```

------------------------------------------------------

#### **GET `/api/prediction` - Get all the user's prediction history**

##### Request
- **Method:** GET
- **Path:** `/api/prediction`

##### Response
- **Status: 200 OK**
    ```yaml
    {
      "status": true,
      "predictions": [
        {
          "id": "john_doe-uniqueId",
          "imageUrl": "https://storage.googleapis.com/bucketName/image.jpg",
          "result": "prediction result"
        },
        {
          "id": "john_doe-uniqueId2",
          "imageUrl": "https://storage.googleapis.com/bucketName/image2.jpg",
          "result": "prediction result 2"
        },
        ... another results
      ]
    }
    ```

------------------------------------------------------

#### **GET `/api/prediction/:id` - Get prediction history by id**

##### Request
- **Method:** GET
- **Path:** `/api/prediction/:id`

##### Response
- **Status: 200 OK**
    ```json
    {
      "status": true,
      "prediction": {
        "id": "john_doe-uniqueId",
        "imageUrl": "https://storage.googleapis.com/bucketName/image.jpg",
        "result": "prediction result"
      }
    }
    ```

- **Status: 404 Not Found**
    ```json
    {
      "status": false,
      "message": "prediction id is not found"
    }
    ```

------------------------------------------------------

#### **DELETE `/api/prediction/:id` - Delete prediction history by id**

##### Request
- **Method:** DELETE
- **Path:** `/api/prediction/:id`

##### Response
- **Status: 204 No Content**

- **Status: 404 Not Found**
    ```json
    {
      "status": false,
      "message": "prediction id is not found"
    }
    ```
