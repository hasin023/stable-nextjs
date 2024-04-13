"use client"

import { useState, ChangeEvent, FormEvent, useRef } from "react"
import Link from "next/link"
import { transcribeAudio } from "@/utils/hf-handlers"

interface TranscribeResponse {
  text: string
}

function AudioUpload(): JSX.Element {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [transcribedText, setTranscribedText] =
    useState<TranscribeResponse | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setTranscribedText(null)
    }
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    if (!audioFile) return

    setLoading(true)
    const response = await transcribeAudio(audioFile)

    if (response) {
      setTranscribedText(response)
    } else {
      console.error("Error:", response)
      setTranscribedText(null)
    }

    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-gray-200 py-4 flex flex-col justify-center sm:py-10'>
      <div className='relative py-1 sm:max-w-xl sm:mx-auto'>
        <div className='relative px-6 py-8 bg-white shadow-lg sm:rounded-lg sm:py-6 sm:px-4'>
          <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
            <input
              type='file'
              accept='audio/*'
              onChange={handleFileChange}
              className='w-full px-5 py-3 text-gray-700 bg-gray-200 rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-cyan-500 hover:file:bg-gradient-to-r to-cyan-400 from-green-500 hover:file:text-cyan-50'
            />
            <button
              type='submit'
              className='w-full mt-5 mb-1 px-3 py-2 text-white bg-gradient-to-r from-green-500 to-cyan-500 rounded-md focus:outline-none'
              disabled={!audioFile || loading}
            >
              Transcribe Audio
            </button>
          </form>
          <Link
            href='/'
            className='text-gray-600 text-sm px-2 py-1 mt-4 hover:underline hover:text-cyan-700'
          >
            Back to Home &rarr;
          </Link>
        </div>
      </div>
      {loading && (
        <div className='mt-12 flex justify-center'>
          <div className='loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12'></div>
        </div>
      )}

      {transcribedText && (
        <div className='mt-8 text-gray-800 flex flex-col items-center gap-4'>
          <div className='w-94 rounded-lg border-2 border-dashed border-lime-600/30 bg-teal-100/50 px-4 py-4 text-teal-800'>
            <h4 className='text-center'>{transcribedText.text}</h4>
          </div>
        </div>
      )}

      {audioFile && (
        <div className='mt-8 flex justify-center relative'>
          <audio key={audioFile?.name} ref={audioRef} controls>
            <source src={URL.createObjectURL(audioFile)} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <style jsx>{`
        .loader {
          animation: spin 1s linear infinite;
          border-top-color: #3498db;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default AudioUpload
