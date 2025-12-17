# 🌍 Environment Variables

The backend requires the following environment variables to be set in a `.env` file in the root directory.

## Configuration

| Variable | Description | Required | Example |
| :--- | :--- | :--- | :--- |
| `PORT` | The port number on which the server will run. | No (Default: 3000) | `3000` |
| `MONGO_URI` | The connection string for your MongoDB database. | **Yes** | `mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | A secret key used to sign and verify JSON Web Tokens (JWT) for authentication. | **Yes** | `your_super_secret_jwt_key` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name for image hosting. | **Yes** | `dxyz123` |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key. | **Yes** | `1234567890` |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret. | **Yes** | `abc-123-xyz` |

## Setup
1. Create a file named `.env` in the `backend/CampusSyncBackEnd` directory.
2. Copy the keys above and fill in your specific values.
3. **Note**: Never commit your `.env` file to version control.
