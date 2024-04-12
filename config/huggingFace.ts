import { HfInference } from "@huggingface/inference"

const HF_ACCESS_TOKEN = "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"

const hf = new HfInference(HF_ACCESS_TOKEN)

export default hf
