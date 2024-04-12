"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import hf from "@/config/huggingFace"

function ImageUpload(): JSX.Element {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [detectedImageUrl, setDetectedImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      setDetectedImageUrl(null)
    }
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    if (!imageFile) return

    setLoading(true)
    setDetectedImageUrl(null)

    const imageToDetect = await convertImageToBlob(imageFile)
    const response = await detectImage(imageFile)

    if (response) {
      console.log(response)

      const imageUrl = URL.createObjectURL(imageToDetect)
      setDetectedImageUrl(imageUrl)
    } else {
      console.error("Error:", response)
    }

    setLoading(false)
  }

  const detectImage = async (imageFile: File) => {
    try {
      if (!imageFile) return

      const imageBlob = await convertImageToBlob(imageFile)

      const output = await hf.objectDetection({
        data: imageBlob,
        model: "facebook/detr-resnet-50",
      })

      return output
    } catch (error) {
      console.error(error)
    }
  }

  const convertImageToBlob = async (imageFile: File) => {
    const imageBlob = await new Promise<Blob>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer
        const type = imageFile?.type || "image/png"
        const blob = new Blob([arrayBuffer], { type })
        resolve(blob)
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(imageFile)
    })

    return imageBlob
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
            <button
              type='submit'
              className='w-full mt-5 px-3 py-2 text-white bg-gradient-to-r from-cyan-400 to-green-500 rounded-md focus:outline-none'
              disabled={!imageFile || loading}
            >
              Detect Objects
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
      {detectedImageUrl && (
        <div className='mt-12 flex justify-center'>
          <Image
            src={detectedImageUrl}
            alt='Refined image'
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
