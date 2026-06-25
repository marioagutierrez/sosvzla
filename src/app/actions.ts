"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const compressedImageBase64 = formData.get('compressedImageBase64') as string;

  await prisma.post.create({
    data: {
      name,
      description,
      image: compressedImageBase64 || '',
    },
  });

  revalidatePath('/');
}

export async function createComment(formData: FormData) {
  const postId = parseInt(formData.get('postId') as string, 10);
  const text = formData.get('text') as string;

  await prisma.comment.create({
    data: {
      text,
      postId,
    },
  });

  revalidatePath('/');
}
