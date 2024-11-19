import express from 'express';
import connectToMongoDB from './db/db';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const app = express();
const port = 3000;

const serviceAccount = require('../');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    connectToMongoDB();
    console.log(`Server is running at http://localhost:${port}`);
});