"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { generateAudio } from "@/utils/hf-handlers"

function GenerateSpeech(): JSX.Element {
  const [inputValue, setInputValue] = useState<string>("")
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setLoading(true)
    setAudioUrl("")

    const response = await generateAudio(inputValue)
    if (response) {
      const url = URL.createObjectURL(response)
      setAudioUrl(url)
    } else {
      console.error("Error:", response)
    }

    setLoading(false)
  }

  const handleTextareaFocus = () => {
    setIsTextareaFocused(true)
  }

  const handleTextareaBlur = () => {
    setIsTextareaFocused(false)
  }

  return (
    <div className='min-h-screen bg-gray-200 py-4 flex flex-col justify-center sm:py-10'>
      <div className='relative py-1 sm:max-w-xl sm:mx-auto'>
        <div className='relative px-6 py-8 bg-white shadow-lg sm:rounded-lg sm:py-6 sm:px-4'>
          <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
            <textarea
              rows={2}
              cols={20}
              wrap=''
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleTextareaFocus}
              onBlur={handleTextareaBlur}
              className='w-full px-3 py-2 text-gray-700 bg-gray-200 rounded focus:outline-none focus:ring focus:border-cyan-400'
              placeholder='Enter text to generate audio'
            />
            <button
              type='submit'
              className={`w-full mt-5 mb-1 px-3 py-2 text-white bg-gradient-to-r from-cyan-400 to-green-500 rounded-md focus:outline-none ${
                isTextareaFocused ? "mt-2" : "mt-0"
              }`}
              disabled={loading}
            >
              Generate Audio
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

      {audioUrl && (
        <div className='mt-8 flex justify-center relative'>
          <audio key={audioUrl} controls>
            <source src={audioUrl} />
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

export default GenerateSpeech
