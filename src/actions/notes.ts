"use server"

import { handleError } from "@/lib/utils";
import { getUser } from "../app/auth/server";
import { prisma } from "../db/prisma";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import openai from "../openai";

export const createNoteAction = async (noteId: string) => {
  try {
  const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");

    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email || '',
      },
    });

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

    const newestNote = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });

    return { errorMessage: null, newestNoteId: newestNote?.id || null };
  } catch (error) {
    console.error('Delete note failed:', error);
    return handleError(error);
  }
};

export const getNewestNoteAction = async () => {
  try {
    const user = await getUser();
    if (!user) return { errorMessage: "Not logged in", newestNoteId: null };

    const newestNote = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });

    return { errorMessage: null, newestNoteId: newestNote?.id || null };
  } catch (error) {
    console.error('Get newest note failed:', error);
    return handleError(error);
  }
};

export const askAIAboutNotesAction = async (newQuestions: string[], responses: string[]) => {
  try {
    const user = await getUser();
    if (!user) return "You must be logged in to ask the monkey questions";

    const notes = await prisma.note.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
        select: {text: true, createdAt: true, updatedAt: true},
    });

    if (notes.length === 0) {
      return "Need notes to ask the monkey questions about them!"
    }

    const formattedNotes = notes.map((note) => `
    Text:  ${note.text}
    CreatedAt: ${note.createdAt}
    UpdateAt: ${note.updatedAt}
    `.trim(),
  )
    .join("\n");

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "developer",
      content: `
          You are a helpful assistant that answers questions about a user's notes. 
          Assume all questions are related to the user's notes. 
          Make sure that your answers are not too verbose and you speak succinctly. 
          Your responses MUST be formatted in clean, valid HTML with proper structure. 
          Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
          Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
          Avoid inline styles, JavaScript, or custom attributes.
          
          Rendered like this in JSX:
          <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />
    
          Here are the user's notes:
          ${formattedNotes}
          `,
    },
  ];

  for (let i = 0; i < newQuestions.length; i++) {
    messages.push({ role: "user", content: newQuestions[i] });
    if (responses.length > i) {
      messages.push({ role: "assistant", content: responses[i] });
    }
  } 

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return completion.choices[0].message.content || "A problem has occurred";
  } catch (error: any) {
    console.error('Ask AI failed:', error);
    return `Error: ${error?.message || 'An error occurred. Please try again.'}`;
  }
};