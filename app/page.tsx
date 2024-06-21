"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { MdOutlineDownloading } from "react-icons/md";

import { generateImage } from "@/utils/hf-handlers";

function Home(): JSX.Element {
	const [inputValue, setInputValue] = useState<string>(
		"An astronaut riding a rainbow unicorn, cinematic, dramatic",
	);
	const [negativeInput, setnegativeInput] = useState<string>("");
	const [imageUrl, setImageUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false);

	const downloadImage = () => {
		const a = document.createElement("a");
		a.href = imageUrl;
		a.download = `generated-${new Date().getTime()}.png`;
		a.click();
	};

	const handleSubmit = async (
		event: FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();
		setLoading(true);

		const response = await generateImage(inputValue, negativeInput);

		if (response) {
			const imageUrl = URL.createObjectURL(response);
			setImageUrl(imageUrl);
		} else {
			console.error("Error:", response);
		}
		setLoading(false);
	};

	const handleTextareaFocus = () => {
		setIsTextareaFocused(true);
	};

	const handleTextareaBlur = () => {
		setIsTextareaFocused(false);
	};

	return (
		<div className="min-h-screen bg-gray-200 py-4 flex flex-col justify-center sm:py-10">
			<div className="relative py-1 sm:max-w-xl sm:mx-auto">
				<div className="relative px-6 py-8 bg-white shadow-lg sm:rounded-lg sm:py-6 sm:px-4">
					<form onSubmit={handleSubmit} className="max-w-md mx-auto">
						<textarea
							rows={2}
							cols={20}
							wrap=""
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onFocus={handleTextareaFocus}
							onBlur={handleTextareaBlur}
							className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded focus:outline-none focus:ring focus:border-cyan-400"
							placeholder="Enter your imagination..."
						/>
						<input
							type="text"
							value={negativeInput}
							onChange={(e) => setnegativeInput(e.target.value)}
							className="w-full px-5 py-3 text-gray-700 bg-gray-200 rounded focus:outline-none focus:ring focus:border-cyan-400"
							placeholder="Enter a negative prompt"
						/>
						<button
							type="submit"
							className={`w-full mt-5 mb-1 px-3 py-2 text-white bg-gradient-to-r from-cyan-400 to-green-500 rounded-md focus:outline-none ${
								isTextareaFocused ? "mt-2" : "mt-0"
							}`}
							disabled={loading}
						>
							Generate
						</button>
					</form>
					<div className="flex justify-between -mb-2">
						<Link
							href="/image/refine"
							className="text-gray-600 text-sm px-2 py-1 hover:underline hover:text-lime-700"
						>
							Refine an image &rarr;
						</Link>
						<Link
							href="/image/detect"
							className="text-gray-600 text-sm px-2 py-1 hover:underline hover:text-lime-700"
						>
							Detect an image &rarr;
						</Link>
						<Link
							href="/image/answer"
							className="text-gray-600 text-sm px-2 py-1 hover:underline hover:text-lime-700"
						>
							Answer question &rarr;
						</Link>
					</div>

					<div className="flex justify-center -mb-2 mt-1">
						<Link
							href="/audio/transcriber"
							className="text-gray-600 text-sm px-2 py-1 hover:underline hover:text-cyan-700"
						>
							Audio transcriber &rarr;
						</Link>
						<Link
							href="/audio/generate"
							className="text-gray-600 text-sm px-2 py-1 hover:underline hover:text-cyan-700"
						>
							Generate audio &rarr;
						</Link>
					</div>
				</div>
			</div>
			{loading && (
				<div className="mt-12 flex justify-center">
					<div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12" />
				</div>
			)}
			{imageUrl && !loading && (
				<div className="relative mt-8 flex flex-col items-center justify-center gap-4">
					<div className="group relative">
						<Image
							src={imageUrl}
							alt="Generated image"
							className="rounded-lg shadow-lg transition-shadow duration-300"
							height={350}
							width={350}
						/>
						<button
							className="absolute bottom-4 right-4 bg-white font-semibold rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							type="button"
							onClick={downloadImage}
						>
							<MdOutlineDownloading size={20} color="black" />
						</button>
					</div>
				</div>
			)}
			<style jsx>{`
        .loader {
          animation: spin 1s linear infinite;
          border-top-color: #5BC880;
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
	);
}

export default Home;
