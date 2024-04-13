import hf from "@/config/huggingFace"
import { convertAudioToBlob, convertImageToBlob } from "./utils"

export const generateImage = async (input: string, negativeInput: string) => {
  try {
    const output = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: input,
      parameters: {
        negative_prompt: negativeInput,
      },
    })

    return output
  } catch (error) {
    console.error(error)
  }
}

export const refineImage = async (prompt: string, imageFile: File) => {
  try {
    if (!imageFile) return

    const imageBlob = await convertImageToBlob(imageFile)

    // Image to Image service is unavailable from HuggingFace JS
    const output = await hf.imageToImage({
      inputs: imageBlob,
      parameters: {
        prompt: prompt,
      },
      model: "stabilityai/stable-diffusion-xl-refiner-1.0",
    })

    return output
  } catch (error) {
    console.error(error)
  }
}

export const detectImage = async (imageFile: File) => {
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

export const answerQuestion = async (question: string, imageFile: File) => {
  try {
    if (!imageFile) return

    const imageBlob = await convertImageToBlob(imageFile)

    const output = await hf.visualQuestionAnswering({
      model: "dandelin/vilt-b32-finetuned-vqa",
      inputs: {
        question: question,
        image: imageBlob,
      },
    })

    return output
  } catch (error) {
    console.error(error)
  }
}

export const transcribeAudio = async (audioFile: File) => {
  try {
    if (!audioFile) return

    const audioBlob = await convertAudioToBlob(audioFile)

    const output = await hf.automaticSpeechRecognition({
      model: "openai/whisper-large-v3",
      data: audioBlob,
    })

    return output
    return audioFile
  } catch (error) {
    console.error(error)
  }
}
