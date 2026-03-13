'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { getNewestNoteAction } from '@/src/actions/notes'

function LogoLink() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { newestNoteId } = await getNewestNoteAction();
      if (newestNoteId) {
        router.push(`/?noteId=${newestNoteId}`);
      } else {
        router.push('/');
      }
    });
  };

  return (
    <a className="flex items-end gap-2 cursor-pointer" onClick={handleLogoClick}>
      <Image 
        src="/monkey.png" 
        height={60} 
        width={60} 
        alt="logo" 
        className="rounded-full" 
        priority
      />
      <h1 className='flex flex-col pb-1 text-2xl font-bold leading-6'>
        Notes<span>GPT</span>
      </h1>
    </a>
  );
}

export default LogoLink;