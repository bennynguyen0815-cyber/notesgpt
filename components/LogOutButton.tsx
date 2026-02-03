"use client"

import { logOutAction } from '@/src/actions/users'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

function LogOutButton() {
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleLogOut = async () => {
    setLoading(true);
    const {errorMessage} = await logOutAction();

    if (!errorMessage) {
       toast.success("Logged out successfully", {
        description: "You have been logged out.",
      })
      router.push("/");
    } else {
        toast.error("Error logging out", {
        description: "Failed to log out. Please try again.",
        })
    }

    setLoading(false); 
  }
  return ( 
    <Button 
    variant="outline"
    onClick={handleLogOut}
    disabled={loading}
    className='w-24'>
        {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
    </Button>
  )
}

export default LogOutButton
