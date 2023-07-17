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

app.post('/auth/register', registerValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      hash,
      fullname: req.body.fullname,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = user;

    return res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Registration failed',
    });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isUserValid = bcrypt.compare(user.passwordHash, req.body.password);
    if (!isUserValid) {
      return res.status(400).json({
        message: 'Incorrect login or password',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = user;
    console.log({ ...userData });

    return res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Login failed',
    });
  }
});

app.listen(3333);
