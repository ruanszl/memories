import Image from 'next/image'
import logo from '../../public/logo.png'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="space-y-5">
      <div>
        <Image src={logo} alt="logo" className="max-w-[100px]" />
      </div>
      <div className="max-w-[420px] space-y-1">
        <h1 className="text-4xl font-bold leading-tight text-gray-50">
          Crie um novo Post
        </h1>
      </div>
      <Link
        href="/memories/new"
        className="inline-block rounded-full bg-pink-500 px-5 py-3 font-alt text-[10px] uppercase leading-none text-white hover:bg-pink-400 transition-colors"
      >
        Criar
      </Link>
    </div>
  )
}
