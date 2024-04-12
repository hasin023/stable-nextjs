import hf from "@/config/huggingFace"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = request.url

  return NextResponse.json({
    message: "Goodbye from the API",
    request: requestUrl,
  })
}

export async function POST(request: NextRequest) {
  const { value } = await request.json()

  try {
    const output = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: value,
      parameters: {
        negative_prompt: "blurry",
      },
    })

    console.log(output)
    return NextResponse.json({ blob: output })
  } catch (error) {
    console.error(error)
    NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {}

export async function DELETE(request: NextRequest) {}

export async function PATCH(request: NextRequest) {}
