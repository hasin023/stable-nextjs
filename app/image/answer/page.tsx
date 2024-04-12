"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { answerQuestion } from "@/utils/hf-handlers"
import ProgressBar from "@/components/ProgressBar"

function ImageUpload(): JSX.Element {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [questionInput, setQuestionInput] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [answer, setAnswer] = useState<string>("")
  const [score, setScore] = useState<number | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      setAnswer("")
      setScore(null)
      const imageUrl = URL.createObjectURL(file)
      setSelectedImageUrl(imageUrl)
    }
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    if (!imageFile) return

    setLoading(true)

    const response = await answerQuestion(questionInput, imageFile)
    if (response) {
      console.log(response)
      setAnswer(response.answer)
      setScore(response.score)
    } else {
      console.error("Error:", response)
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
              accept='image/*'
              onChange={handleFileChange}
              className='w-full px-5 py-3 text-gray-700 bg-gray-200 rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-cyan-500 hover:file:bg-gradient-to-r to-cyan-400 from-green-500 hover:file:text-cyan-50'
            />
            <input
              type='text'
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              className='w-full px-5 py-1 mt-3 text-gray-700 bg-gray-200 rounded focus:outline-none focus:ring focus:border-cyan-400'
              placeholder='Ask your queries'
            />
            <button
              type='submit'
              className='w-full mt-5 mb-1 px-3 py-2 text-white bg-gradient-to-r from-cyan-400 to-green-500 rounded-md focus:outline-none'
              disabled={!imageFile || loading}
            >
              Get Answer
            </button>
          </form>
          <Link
            href='/'
            className='text-gray-600 text-sm px-2 py-1 mt-4 hover:underline hover:text-lime-700'
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
      {answer && score && (
        <div className='mt-4 text-gray-800 flex flex-col items-center gap-4'>
          <div className='w-60 rounded-lg border-2 border-dashed border-lime-600/30 bg-teal-100/50 px-4 py-4 text-teal-800'>
            <h4 className='text-center'>{answer}</h4>
          </div>
          <ProgressBar score={score} />
        </div>
      )}
      {selectedImageUrl && (
        <div className='mt-12 flex justify-center'>
          <Image
            src={selectedImageUrl}
            alt='Uploaded image'
            className='rounded-lg shadow-lg'
            height={350}
            width={350}
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

export default ImageUpload
