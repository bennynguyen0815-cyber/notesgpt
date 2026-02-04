"use server";

import { handleError } from "@/lib/utils";
import { createClient } from "../app/auth/server";
import { prisma } from "../db/prisma";

export const loginAction = async (email: string, password: string) => {
  try {
    const client = await createClient();

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const logOutAction = async () => {
  try {
    const client = await createClient();

    const { error } = await client.auth.signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const signUpAction = async (email: string, password: string) => {
  try {
    const client = await createClient();

    const { data, error } = await client.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("Error signing up");
    
    await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            id: userId,
            email: email,
        },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};