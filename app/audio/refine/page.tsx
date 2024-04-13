"use client"

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
  LegacyRef,
} from "react"
import Link from "next/link"
import { refineAudio } from "@/utils/hf-handlers"

function RefineAudio(): JSX.Element {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [refinedAudioBlobs, setRefinedAudioBlobs] = useState<Blob[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([])

  // Function to handle file change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
    }
  }

  // Function to handle form submission
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    if (!audioFile) return

    setLoading(true)
    const response = await refineAudio(audioFile)

    if (Array.isArray(response)) {
      const audioBlobs = response.map((audioData) => {
        return new Blob([audioData.blob], {
          type: audioData["content-type"],
        })
      })
      setRefinedAudioBlobs(audioBlobs)
    } else {
      console.error("Error:", response)
    }

    setLoading(false)
  }

  // Clean up audioRefs on refinedAudioBlobs change
  useEffect(() => {
    audioRefs.current = audioRefs.current.slice(0, refinedAudioBlobs.length)
  }, [refinedAudioBlobs])

  // Function to play audio
  const playAudio = (index: number): void => {
    if (audioRefs.current[index]) {
      audioRefs.current[index]?.play()
    }
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
              Refine Audio
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

      {audioFile && (
        <div className='mt-8 flex justify-center relative'>
          <audio key={audioFile?.name} controls>
            <source src={URL.createObjectURL(audioFile)} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {refinedAudioBlobs.length > 0 && (
        <div className='text-center text-gray-500 mt-8 text-sm'>
          Refined audio &darr;
        </div>
      )}
      <div className='mt-8 flex justify-center gap-3'>
        {refinedAudioBlobs.map((blob, index) => (
          <div key={index} className='flex justify-center relative'>
            <audio
              key={index}
              controls
              ref={(audioRef: HTMLAudioElement | null) =>
                (audioRefs.current[index] = audioRef)
              }
            >
              <source src={URL.createObjectURL(blob)} />
              Your browser does not support the audio element.
            </audio>
            <button
              onClick={() => playAudio(index)}
              className='text-sm text-gray-600 hover:text-gray-900'
            >
              Play
            </button>
          </div>
        ))}
      </div>

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

export default RefineAudio
