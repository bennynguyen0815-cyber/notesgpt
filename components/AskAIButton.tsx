'use client'

import { User } from "@supabase/supabase-js"
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState, useTransition } from "react";
import { Textarea } from "./ui/textarea";
import { Arrow } from "@radix-ui/react-tooltip";
import { ArrowUpIcon } from "lucide-react";
import { askAIAboutNotesAction } from "@/src/actions/notes";
import "@/src/styles/ai-response.css"

type Props = {
    user : User | null;
}


function AskAIButton({user}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [questionText, setQuestionText] = useState("")
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);


  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) { 
     router.push("/login") 
    } else {
      setOpen(isOpen)
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
    }
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  } 

  const handleCLickInput = () => {
    textareaRef.current?.focus();
  }

  const handleSubmit = () => {
    if (!questionText.trim()) return;

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      try {
        const response = await askAIAboutNotesAction(newQuestions, responses);
        setResponses([...responses, response]);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error('Submit error:', error);
        setResponses([...responses, "An error occurred. Please try again."]);
      }
    })
  }

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
      });
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }

    return (
       <Dialog open={open} onOpenChange={handleOnOpenChange}>
        <DialogTrigger asChild>
          <Button variant="secondary">Ask Monke</Button>
        </DialogTrigger>
        <DialogContent className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto" ref={contentRef}>
          <DialogHeader>
            <DialogTitle>Ask Monke</DialogTitle>
            <DialogDescription>
              Ask questions about your notes here.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-8">
            {questions.map((question, index) => (
              <Fragment key={index}>
                <p className="ml-auto max-w-[60%] rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                  {question}
                </p>
                {responses[index] && (
                  <p
                    className="bot-response text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: responses[index] }}
                  />
                )}
              </Fragment>
            ))}
            {isPending && <p className="animate-pulse text-sm">The monkey is thinking...</p>}
          </div>

          <div className="mt-auto flex cursor-text flex-col rounded-lg border p-4" onClick={handleCLickInput}>
            <Textarea 
              ref={textareaRef}
              placeholder="Ask the monkey about your notes"
              className="resize-none rounded-none border-none bg-transparent p-0 shadow-none 
              placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{ 
                minHeight: "0",
                lineHeight: "normal"
              }}
              rows={1}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <Button className="ml-auto size-8 rounded-full" onClick={handleSubmit} disabled={isPending}>
              <ArrowUpIcon className="text-background" />
            </Button>
          </div>
        </DialogContent>
    </Dialog>
  )
}

export default AskAIButton
