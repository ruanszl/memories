import { getUser } from '@/lib/auth'
import Image from 'next/image'

export function Profile() {
  const { name, avatar_url } = getUser()
  return (
    <div className="flex items-center gap-3 text-left">
      <Image
        src={avatar_url}
        alt=""
        width={592}
        height={288}
        className="h-16 w-16 rounded-full"
      />
      <p className="text-sm leading-snug max-w-[140px]">
        {name}
        <a
          href="/api/auth/logout"
          className="block text-xs text-red-500 hover:text-red-600"
        >
          Sair
        </a>
      </p>
    </div>
  )
}
