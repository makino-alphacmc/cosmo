"use client";

import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-black flex items-center justify-center p-4">
			<div className="bg-gray-900 bg-opacity-90 rounded-2xl p-8 max-w-md w-full text-center">
				<h2 className="text-2xl font-bold text-red-500 mb-4">
					エラーが発生しました
				</h2>
				<p className="text-gray-300 mb-6">
					申し訳ございません。アプリケーションでエラーが発生しました。
				</p>
				<button
					onClick={reset}
					className="px-6 py-3 bg-blue-600 hover:bg-blue-700 
            text-white font-medium rounded-lg 
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
				>
					もう一度試す
				</button>
			</div>
		</div>
	);
}
