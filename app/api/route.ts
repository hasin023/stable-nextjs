import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

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
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: value,
          image_dimensions: "512x512",
          num_inference_steps: 12,
          num_outputs: 1,
          guideance_scale: 3.5,
          scheduler: "K_EULER",
        },
      }
    )

    return NextResponse.json(output)
  } catch (error) {
    console.error(error)
    NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function HEAD(request: NextRequest) {}

export async function PUT(request: NextRequest) {}

export async function DELETE(request: NextRequest) {}

export async function PATCH(request: NextRequest) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: NextRequest) {}
