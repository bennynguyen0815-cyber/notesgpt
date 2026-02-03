'use client'

import { Textarea } from "@/components/ui/textarea";
import useNote from "@/hooks/useNote";
import { debounceTimeout } from "@/lib/constants";
import { updateNoteAction } from "@/src/actions/notes";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

type Props = {
  noteId: string;
  startingNoteText: string;
}

let updateTimeout: NodeJS.Timeout;

function NoteTextInput({noteId, startingNoteText}: Props) {
  const noteIdParam = useSearchParams().get("noteId") || "";
  const {noteText, setNoteText} = useNote();

  useEffect(() => {
    if (noteIdParam === noteId){
      setNoteText(startingNoteText);
    }
  }, [startingNoteText, noteIdParam, noteId, setNoteText]);    

  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteText(text);
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => 
      {updateNoteAction(noteId, text);
    }, debounceTimeout);
  }
  
  return (
    <Textarea 
      value={noteText} 
      onChange={handleUpdateNote}
      placeholder="Type your notes here.."
      className="custom-scrollbar mb-4 h-full max-w-4xl resize-none border p-4
      placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  )
}

export default NoteTextInput
