'use client'

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

import { createNoteAction } from "@/src/actions/notes";

type Props = {
  user: User | null;
}

function NewNoteButton({user}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const handleClickNewNoteButton = async () => {
      if (!user) {
        router.push("/login");
      } else  {
        setLoading(true);
        const uuid = uuidv4();
        const result = await createNoteAction(uuid);
        if (result.errorMessage) {
          toast.error(result.errorMessage);
        } else {
          router.push(`/?noteId=${uuid}`);
          toast("New note created");
        }
        setLoading(false);
      }
    }

    return (
    <Button
    onClick={handleClickNewNoteButton}
    variant="secondary"
    className="w-24"
    disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  )
}

export default NewNoteButton
