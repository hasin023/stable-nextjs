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
      // SDXL Lightning 4-step
      // "bytedance/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a",
      // {
      //   input: {
      //     width: 1024,
      //     height: 1024,
      //     prompt: value,
      //     scheduler: "K_EULER",
      //     num_outputs: 1,
      //     guidance_scale: 0,
      //     negative_prompt: "worst quality, low quality",
      //     num_inference_steps: 4,
      //   },
      // }

      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          width: 768,
          height: 768,
          prompt: value,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: "",
          prompt_strength: 0.8,
          num_inference_steps: 25,
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
