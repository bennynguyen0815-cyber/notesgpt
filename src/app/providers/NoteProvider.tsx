"use client"

import { Note } from "@prisma/client";
import { createContext, useState } from "react";

type NoteProviderContextType = {
  noteText: string;
  setNoteText: (text: string) => void;
}

export const NoteContext = createContext<NoteProviderContextType>({
    noteText: "",
    setNoteText: () => {},
});

function NoteProvider({children}: {children: React.ReactNode}) {
  const [noteText, setNoteText] = useState("");

  return (
    <NoteContext.Provider value={{noteText, setNoteText}}>
      {children}
    </NoteContext.Provider>
  );
}

export default NoteProvider;