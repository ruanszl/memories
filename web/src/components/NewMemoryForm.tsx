'use client'
import { Camera } from 'lucide-react'
import { MidiaPicker } from './MidiaPicker'
import { FormEvent } from 'react'
import cookie from 'js-cookie'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export function NewMemoryForm() {
  const router = useRouter()
  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const fileTUpload = formData.get('coverUrl')

    let coverUrl = ''

    if (fileTUpload) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileTUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)

      coverUrl = uploadResponse.data.fileUrl
    }

    const token = cookie.get('token')

    await api.post(
      '/memories',
      {
        coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    router.push('/')
  }
  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex gap-4 items-center">
        <label
          htmlFor="midia"
          className="flex cursor-pointer gap-1.5 items-center text-sm text-gray-300 hover:text-white"
        >
          <Camera className="w-4 h-4" />
          Anexar mídia
        </label>
        <label
          htmlFor="isPublic"
          className="flex gap-1.5 items-center text-sm text-gray-300 hover:text-white"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPuplic"
            value="true"
            className="h-4 w-4 rounded bg-gray-700 border-gray-400 text-purple-700"
          />
          Público
        </label>
      </div>
      <MidiaPicker />
      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-800 focus:ring-0"
        placeholder="Digite aqui"
      />
      <button
        type="submit"
        className="inline-block h-10 w-20  rounded-full bg-pink-900 px-5 py-3 font-alt text-[10px] uppercase leading-none text-white hover:bg-pink-600 transition-colors"
      >
        Salvar
      </button>
    </form>
  )
}
