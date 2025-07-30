export default function Loading() {
	return (
		<div className="fixed inset-0 bg-black flex items-center justify-center">
			<div className="text-center">
				<div
					className="inline-block animate-spin rounded-full h-12 w-12 
          border-t-2 border-b-2 border-blue-500 mb-4"
				></div>
				<p className="text-white text-lg animate-pulse">宇宙地図を準備中...</p>
			</div>
		</div>
	);
}
