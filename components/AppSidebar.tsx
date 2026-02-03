import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { getUser } from "@/src/app/auth/server";
import { prisma } from "@/src/db/prisma";
import { Note } from "@prisma/client";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
  const user = await getUser();
  let notes: Note[] = [];

  if (user) {
    try {
      notes = await prisma.note.findMany({
          where: {
              authorId: user.id
          },
          orderBy: {
              updatedAt: "desc"
          },
      })
    } catch (error) {
      console.error('Database connection failed:', error);
      // notes remains empty array
    }
  }
  return (
    <Sidebar>
      <SidebarContent className = "custom-scrollbar">
        <SidebarGroup>
            <SidebarGroupLabel className="mb-2 mt-2 text-lg">
                {user ? "Your Notes": (
                    <p>
                        <Link href="/login" className="underline">Login</Link>{" "} to view your notes
                    </p>
                )}
            </SidebarGroupLabel>
            {user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar