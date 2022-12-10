const development = {
  name: "development",
  session_cookie_key: "authsystem",
  mongodb_url: "mongodb://localhost:27017/authentication_system",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "engineeringresurrection",
      pass: process.env.NODEMAILER_AUTH_PASS,
    },
  },
  redis_host: "localhost",
  google_client_id: process.env.PASSPORT_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.PASSPORT_GOOGLE_CLIENT_SECERET,
  google_callback_url: "http://localhost:8000/users/auth/google/callback",
};

const production = {
  name: "production",
  session_cookie_key: process.env.SESSION_COOKIE_KEY,
  mongodb_url: `mongodb+srv://suyashmankar:${process.env.MONGODB_ATLAS_PASS}@cluster0.biqbhsa.mongodb.net/?retryWrites=true&w=majority`,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "engineeringresurrection",
      pass: process.env.NODEMAILER_AUTH_PASS,
    },
  },
  redis_host: process.env.REDIS_HOST,
  google_client_id: process.env.PASSPORT_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.PASSPORT_GOOGLE_CLIENT_SECERET,
  google_callback_url: process.env.PASSPORT_GOOGLE_CALLBACK_URL,
};

module.exports = eval(process.env.AUTH_SYSTEM_ENVIRONMENT);
