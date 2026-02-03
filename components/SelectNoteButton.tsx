'use client'

import { Note } from "@prisma/client";
import { SidebarMenuButton } from "./ui/sidebar";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import useNote from "@/hooks/useNote";
import Link from "next/link";

type Props = {
  note: Note;
}

function SelectNoteButton({note}: Props) {
  const noteId = useSearchParams().get("noteId") || "";
  const {noteText: selectedNoteText} = useNote();
  const [shouldUseGlobalNoteText, setShouldUseGlobalNoteText] = useState(false);
  const [localNoteText, setLocalNoteText] = useState(note.text);
  const blankNoteText = "EMPTY NOTE";
  
  useEffect(() => {
    if (noteId === note.id) {
        setShouldUseGlobalNoteText(true);
    } else {
        setShouldUseGlobalNoteText(false);
    }
  }, [noteId, note.id]);
  
  useEffect(() => {
    if (shouldUseGlobalNoteText) {
        setLocalNoteText(selectedNoteText);
    }
  }, [selectedNoteText, shouldUseGlobalNoteText]);
  
  let noteText = localNoteText || blankNoteText;
  if (shouldUseGlobalNoteText) {
      noteText = selectedNoteText || blankNoteText; 
  }
  
  return (
    <SidebarMenuButton className={`items-start gap-0 pr-12 ${noteId === note.id ? "bg-sidebar-accent/50" : ""}`}>
      <Link href={`?noteId=${note.id}`}  className="flex h-fit flex-col">
      <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap">
        {noteText}
        </p>
        <p className="text-muted-foreground text-xs">
            {note.updatedAt.toLocaleDateString()}
        </p>
        </Link>
    </SidebarMenuButton>
  )
}

export default SelectNoteButton 
