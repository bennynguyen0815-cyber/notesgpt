import AskAIButton from "@/components/AskAIButton";
import { prisma } from "../../db/prisma";
import { getUser } from "../auth/server";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
type Props = {
  searchParams: Promise<{[key : string]: string | string[] | undefined }>
}


async function DashboardPage({searchParams}: Props) {
  const user = await getUser();
  const noteIdParam = (await searchParams).noteId

  const noteId = Array.isArray(noteIdParam) 
  ? noteIdParam![0] 
  : noteIdParam || "";

  let note = null;
  
  if (user && noteId) {
    try {
      note = await prisma.note.findUnique({
        where: {
          id: noteId,
          authorId: user.id
        }
      });
    } catch (error) {
      console.error('Database connection failed:', error);
      // Continue without the note data
    }
  }

  return (
    <div className ="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} />
        <NewNoteButton user={user}/>
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  )
}

export default DashboardPage
