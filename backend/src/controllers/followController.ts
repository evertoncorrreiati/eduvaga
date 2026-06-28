import { Request, Response } from 'express';
import prisma from '../prisma';

export const followUser = async (req: Request, res: Response) => {
  try {
    const { followerId, followingId } = req.body;
    const existing = await prisma.follow.findFirst({
      where: { followerId: Number(followerId), followingId: Number(followingId) }
    });
    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return res.json({ message: 'Deixou de seguir' });
    }
    const follow = await prisma.follow.create({
      data: { followerId: Number(followerId), followingId: Number(followingId) }
    });
    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao seguir usuário' });
  }
};