import { NewMemoryForm } from '@/components/NewMemoryForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function New() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link
        href="/"
        className="flex items-center text-sm gap-1 text-gray-500 hover:text-gray-200 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </Link>
      <NewMemoryForm />
    </div>
  )
}
