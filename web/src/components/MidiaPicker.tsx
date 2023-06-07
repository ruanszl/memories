'use client'
import { ChangeEvent, useState } from 'react'

export function MidiaPicker() {
  const [preview, setPreview] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])
    setPreview(previewURL)
  }

  return (
    <>
      <input
        name="coverUrl"
        onChange={onFileSelected}
        type="file"
        id="midia"
        className="invisible w-0 h-0"
      ></input>

      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="w-96 h-96 rounded-lg object-cover"
        />
      )}
    </>
  )
}
