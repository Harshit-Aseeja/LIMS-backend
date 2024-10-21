Step 1-> Create .env file with following entries(Example)<br>
DB_HOST="YOUR HOST" <br>
DB_USER="YOUR USERNAME " <br>
DB_PASSWORD="YOUR PASSWORD" <br>
DB_NAME="YOUR DATABASE NAME" <br>
PORT = "YOUR PORT" <br>
JWT_SECRET_KEY = "Your JWT SECRET" <br>

# routes

> POST /labstaff/login : Handles login of labstaff <br>

| Parameter  | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| `email`    | `string` | **Required**. Email of the user    |
| `password` | `string` | **Required**. Password of the user |

> POST /hod/login : Handles login of hod <br>

| Parameter  | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| `email`    | `string` | **Required**. Email of the user    |
| `password` | `string` | **Required**. Password of the user |
