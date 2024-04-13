export const convertImageToBlob = async (imageFile: File) => {
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

export const convertAudioToBlob = async (audioFile: File) => {
  const audioBlob = await new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      const blob = new Blob([arrayBuffer], { type: "audio/flac" })
      resolve(blob)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(audioFile)
  })

  return audioBlob
}
