"use client";

import React, { useEffect, useCallback } from "react";
import { CelestialBody } from "../types";

interface CelestialModalProps {
	celestial: CelestialBody | null;
	isOpen: boolean;
	onClose: () => void;
}

const CelestialModal: React.FC<CelestialModalProps> = ({
	celestial,
	isOpen,
	onClose,
}) => {
	const [imageError, setImageError] = React.useState(false);

	// モーダル内の天体スタイル
	const getModalPlanetStyle = () => {
		if (!celestial) return "";

		switch (celestial.id) {
			case "sun":
				return "bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 shadow-[0_0_80px_rgba(255,204,0,0.8)]";
			case "mercury":
				return "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600";
			case "venus":
				return "bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-200";
			case "earth":
				return "bg-gradient-to-br from-blue-400 via-blue-500 to-green-400";
			case "moon":
				return "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400";
			case "mars":
				return "bg-gradient-to-br from-red-400 via-red-500 to-orange-500";
			case "jupiter":
				return "bg-gradient-to-br from-yellow-600 via-orange-300 to-red-300";
			case "saturn":
				return "bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200";
			case "uranus":
				return "bg-gradient-to-br from-cyan-300 via-cyan-400 to-teal-400";
			case "neptune":
				return "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600";
			default:
				return "bg-gradient-to-br from-gray-400 to-gray-600";
		}
	};

	// 表面の詳細
	const getSurfaceDetails = () => {
		if (!celestial) return null;

		if (celestial.id === "saturn") {
			return (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="absolute w-[150%] h-[150%] rounded-full border-8 border-yellow-200/60 transform rotate-12" />
					<div className="absolute w-[170%] h-[170%] rounded-full border-4 border-yellow-100/40 transform rotate-12" />
				</div>
			);
		}

		if (celestial.id === "jupiter") {
			return (
				<div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/70 to-transparent transform scale-x-150" />
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/70 to-transparent transform translate-y-2" />
				</div>
			);
		}

		if (celestial.id === "earth") {
			return (
				<div className="absolute inset-0 rounded-full overflow-hidden">
					<div className="absolute top-1/4 left-1/4 w-1/3 h-1/4 bg-green-600/30 rounded-full blur-md" />
					<div className="absolute bottom-1/3 right-1/4 w-1/4 h-1/3 bg-green-500/20 rounded-full blur-md" />
					<div className="absolute top-1/2 right-1/3 w-1/5 h-1/5 bg-green-700/25 rounded-full blur-sm" />
				</div>
			);
		}

		if (celestial.id === "sun") {
			return (
				<div className="absolute inset-0 rounded-full animate-pulse-slow">
					<div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl scale-110" />
				</div>
			);
		}

		return null;
	};

	// ESCキーでモーダルを閉じる
	const handleEscKey = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("keydown", handleEscKey);
			// スクロールを無効化
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscKey);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, handleEscKey]);

	if (!isOpen || !celestial) return null;

	// 画像読み込みエラー時にリセット
	useEffect(() => {
		setImageError(false);
	}, [celestial]);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 
        bg-black bg-opacity-80 backdrop-blur-sm animate-fadeIn"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div
				className="relative bg-gradient-to-br from-gray-900/95 to-indigo-900/95 rounded-3xl 
          max-w-2xl w-full max-h-[90vh] overflow-hidden
          shadow-2xl transform transition-all duration-300 scale-100
          border border-purple-500/20 backdrop-blur-xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* ヘッダー */}
				<div className="relative p-6 pb-0">
					<h2
						id="modal-title"
						className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text 
              bg-gradient-to-r from-blue-300 to-purple-300 pr-10"
					>
						{celestial.name}
					</h2>

					{/* 閉じるボタン */}
					<button
						onClick={onClose}
						className="absolute top-4 right-4 w-10 h-10 
              flex items-center justify-center
              text-gray-400 hover:text-white 
              bg-gray-800 hover:bg-gray-700 
              rounded-full transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
						aria-label="モーダルを閉じる"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* コンテンツ */}
				<div className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto custom-scrollbar">
					{/* 画像 */}
					<div
						className="relative w-full h-48 md:h-64 bg-gradient-to-br from-gray-800/50 to-indigo-800/50 rounded-2xl overflow-hidden backdrop-blur-sm"
						style={{
							boxShadow: "inset 0 0 30px rgba(139, 92, 246, 0.3)",
						}}
					>
						{!imageError ? (
							<div className="relative w-full h-full flex items-center justify-center p-8">
								{/* 天体の3D風表現 */}
								<div className="relative w-32 h-32 md:w-48 md:h-48">
									<div
										className={`absolute inset-0 rounded-full ${getModalPlanetStyle()}`}
									/>
									{getSurfaceDetails()}
									<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent" />
									<div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/40" />
								</div>
							</div>
						) : (
							<div className="w-full h-full flex items-center justify-center text-6xl">
								{celestial.type === "star"
									? "⭐"
									: celestial.type === "satellite"
									? "🌙"
									: "🌍"}
							</div>
						)}
					</div>

					{/* タイプバッジ */}
					<div className="flex items-center space-x-2">
						<span
							className="inline-block px-4 py-2 
              bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 
              text-sm font-medium rounded-full border border-purple-500/30 
              backdrop-blur-sm shadow-lg"
							style={{
								boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
							}}
						>
							{celestial.type === "star"
								? "恒星"
								: celestial.type === "planet"
								? "惑星"
								: celestial.type === "satellite"
								? "衛星"
								: "小惑星"}
						</span>
					</div>

					{/* 説明文 */}
					<div className="space-y-4">
						<p className="text-gray-300 leading-relaxed text-lg">
							{celestial.description}
						</p>
					</div>

					{/* 追加情報（将来の拡張用） */}
					<div className="pt-4 border-t border-gray-700">
						<p className="text-sm text-gray-500">
							※ より詳しい情報は今後追加予定です
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CelestialModal;
