import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login, getProfile } from './controllers/userController';
import { createPost, getFeed, likePost, commentPost } from './controllers/postController';
import { followUser } from './controllers/followController';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas de usuário
app.post('/auth/register', register);
app.post('/auth/login', login);
app.get('/users/:id', getProfile);

// Rotas de posts
app.post('/posts', createPost);
app.get('/feed', getFeed);
app.post('/posts/like', likePost);
app.post('/posts/comment', commentPost);

// Rotas de follow
app.post('/follow', followUser);

app.get('/', (req, res) => {
  res.json({ message: 'EduVaga API funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;