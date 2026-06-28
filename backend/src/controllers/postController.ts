import { Request, Response } from 'express';
import prisma from '../prisma';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, officialUrl, userId } = req.body;
    const post = await prisma.post.create({
      data: { content, officialUrl, userId: Number(userId) },
      include: { user: { select: { id: true, name: true } } }
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar post' });
  }
};

export const getFeed = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        likes: true,
        comments: {
          include: { user: { select: { id: true, name: true } } }
        }
      }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId, userId } = req.body;
    const existing = await prisma.like.findFirst({
      where: { postId: Number(postId), userId: Number(userId) }
    });
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return res.json({ message: 'Like removido' });
    }
    const like = await prisma.like.create({
      data: { postId: Number(postId), userId: Number(userId) }
    });
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao curtir post' });
  }
};

export const commentPost = async (req: Request, res: Response) => {
  try {
    const { content, postId, userId } = req.body;
    const comment = await prisma.comment.create({
      data: { content, postId: Number(postId), userId: Number(userId) },
      include: { user: { select: { id: true, name: true } } }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao comentar' });
  }
}