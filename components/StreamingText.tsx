import { useState, useEffect } from "react"

interface StreamingTextProps {
  text: string
}

const StreamingText: React.FC<StreamingTextProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState<string>("")

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.substring(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [text])

  return <h4 className='text-center'>{displayedText}</h4>
}

export default StreamingText
