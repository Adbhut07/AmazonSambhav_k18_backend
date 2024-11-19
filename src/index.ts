import express from 'express';
import connectToMongoDB from './db/db';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

import authRoutes from './routes/auth.route';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.GOOGLE_CREDS) {
  throw new Error("GOOGLE_CREDS environment variable is not defined");
}
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
console.log("Firebase Admin initialized");

app.use(express.json()); // For parsing JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/test-firebase', async (req, res) => {
  try {
      const users = await admin.auth().listUsers();
      res.status(200).json({ success: true, users });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Firebase operation failed" });
  }
});

app.listen(port, () => {
    connectToMongoDB();   
    console.log(`Server is running at http://localhost:${port}`);
});






