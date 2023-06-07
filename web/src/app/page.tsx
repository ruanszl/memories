import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import dayjs from 'dayjs'
import ptbr from 'dayjs/locale/pt-br'
import Image from 'next/image'

dayjs.locale(ptbr)

interface Memorie {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export default async function Home() {
  const isAuthenticate = cookies().has('token')
  if (!isAuthenticate) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value
  const response = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: Memorie[] = response.data

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-col items-center justify-center gap-24 p-8">
      {memories.map((memories) => {
        return (
          <div key={memories.id} className="space-y-4">
            <time className="-ml-20 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memories.createdAt).format('D[ de ]MMM[, ]YYYY')}
            </time>
            <Image
              src={memories.coverUrl}
              width={592}
              height={288}
              alt=""
              className="w-[50rem] rounded-lg object-cover"
            />
            <p className="text-lg w-[50rem] break-words text-gray-100">
              {memories.excerpt}
            </p>
          </div>
        )
      })}
    </div>
  )
}
