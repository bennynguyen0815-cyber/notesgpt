"use server"

import { handleError } from "@/lib/utils";
import { getUser } from "../app/auth/server";
import { prisma } from "../db/prisma";

export const createNoteAction = async (noteId: string) => {
  try {
   const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");

    // Ensure user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || '',
        },
      });
    }

    await prisma.note.create({
        data: {
            id: noteId,
            authorId: user.id,
            text: "",
        },
    });

    return { errorMessage: null };
  } catch (error) {
    console.error('Create note failed:', error);
    return handleError(error);
  }
};
export const updateNoteAction = async (noteId: string, text: string) => {
  try {
   const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a note");

    await prisma.note.update({
        where: { id: noteId },
        data: { text },
    });

    return { errorMessage: null };
  } catch (error) {
    console.error('Update note failed:', error);
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    console.error('Delete note failed:', error);
    return handleError(error);
  }
};