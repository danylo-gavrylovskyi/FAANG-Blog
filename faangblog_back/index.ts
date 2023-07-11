import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();
mongoose
  .connect(`${process.env.DBCONNECTION}`)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log(err));

const app = express();

app.get('/', (req, res) => {
  res.send('Hi');
});

app.post('/auth/login', (req, res) => {
  const token = jwt.sign(req, 'secret123');
});

app.use(express.json());
app.listen(3333);
