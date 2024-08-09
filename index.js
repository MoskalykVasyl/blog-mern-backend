import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidation, loginValidation } from './validations/auth.js';
import { postCreateValidation } from './validations/post.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';

import { UserContoler, PostContoler } from './controllers/index.js';

mongoose
  .connect(
    'mongodb+srv://moskalikvasiok:wwwwww@cluster0.kwq6eys.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

//створення сховища для файлів
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const app = express();

// дозволяє читати JSON, який буде приходити
app.use(express.json());
// Обслуговування статичних файлів з каталогу "uploads"
app.use('/uploads', express.static('uploads'));

app.use(cors());

//Авторизація
app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserContoler.login
);
app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserContoler.register
);
app.get('/auth/me', checkAuth, UserContoler.getMe);

//Загрузка фото
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.post('/uploadAvatar', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//Для посту
app.get('/tags', PostContoler.getLastTags);
app.get('/tags/:tagName', PostContoler.getTagsByName);
app.get('/posts', PostContoler.getAllPosts);
app.get('/posts/:id', PostContoler.getOnePost);
app.delete('/posts/:id', checkAuth, PostContoler.deletePost);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostContoler.createPost
);
app.patch(
  '/posts/:id',
  checkAuth,
  handleValidationErrors,
  PostContoler.updatePost
);
app.patch('/posts/:id/comments', checkAuth, PostContoler.addComment);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
