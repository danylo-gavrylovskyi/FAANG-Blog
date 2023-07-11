import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import UserModel from './models/User.js';

import { registerValidation } from './validations/auth.js';

config();
mongoose
  .connect(`${process.env.DBCONNECTION}`)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hi');
});

app.post('/auth/register', registerValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const doc = new UserModel({
    email: req.body.email,
    passwordHash,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
  });

  const user = await doc.save();

  return res.json(user);
});

app.listen(3333);
