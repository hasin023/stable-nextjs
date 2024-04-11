"use client"

import { useState, FormEvent } from "react"
import Image from "next/image"

function Home(): JSX.Element {
  const [inputValue, setInputValue] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setLoading(true)

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: inputValue }),
    })

    if (response.ok) {
      const data: string[] = await response.json()
      setImageUrl(data[0])
    } else {
      console.error("Error:", response.statusText)
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
    <div className='min-h-screen bg-gray-100 py-4 flex flex-col justify-center sm:py-10'>
      <div className='relative py-1 sm:max-w-xl sm:mx-auto'>
        <div className='relative px-4 py-8 bg-white shadow-lg sm:rounded-lg sm:p-8'>
          <form onSubmit={handleSubmit} className='max-w-md mx-auto space-y-2'>
            <textarea
              rows={2}
              cols={20}
              wrap=''
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleTextareaFocus}
              onBlur={handleTextareaBlur}
              className='w-full px-3 py-2 mb-3 text-gray-700 bg-gray-200 rounded focus:outline-none focus:ring focus:border-cyan-400'
              placeholder='Enter your imagination...'
            />
            <button
              type='submit'
              className={`w-full px-3 py-2 text-white bg-gradient-to-r from-cyan-400 via-green-500 to-cyan-400 rounded-md focus:outline-none ${
                isTextareaFocused ? "mt-2" : "mt-0"
              }`}
              disabled={loading}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      {loading && (
        <div className='mt-12 flex justify-center'>
          <div className='loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12'></div>
        </div>
      )}
      {imageUrl && !loading && (
        <div className='mt-12 flex justify-center'>
          <Image
            src={imageUrl}
            alt='Generated image'
            className='rounded-xl shadow-lg'
            height={300}
            width={300}
          />
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

export default Home
