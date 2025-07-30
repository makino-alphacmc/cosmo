"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// import MapPin from "./MapPin";
// import MapPin3D from "./MapPin3D";
// import MapPinRealistic from "./MapPinRealistic";
import { CelestialBody } from "../types";
import celestialBodiesData from "../data/celestialBodies.json";

// 3Dコンポーネントを動的インポート（エラーハンドリング付き）
const MapPin3D = dynamic(() => import("./MapPin3D"), {
	loading: () => (
		<div className="w-20 h-20 bg-gray-600 rounded-full animate-pulse" />
	),
	ssr: false,
});

// モーダルは動的インポート（パフォーマンス最適化）
const CelestialModal = dynamic(() => import("./CelestialModal"), {
	loading: () => <div className="fixed inset-0 bg-black bg-opacity-50" />,
	ssr: false,
});

const SpaceMap: React.FC = () => {
	const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>([]);
	const [selectedCelestial, setSelectedCelestial] =
		useState<CelestialBody | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);

	// 天体データの読み込み
	useEffect(() => {
		try {
			setCelestialBodies(celestialBodiesData as CelestialBody[]);
			setIsLoading(false);
		} catch (error) {
			console.error("Failed to load celestial data:", error);
			setIsLoading(false);
		}
	}, []);

	// ピンクリック時の処理
	const handlePinClick = (celestial: CelestialBody) => {
		console.log("Pin clicked:", celestial.name);
		setSelectedCelestial(celestial);
		setIsModalOpen(true);
	};

	// モーダルを閉じる処理
	const handleCloseModal = () => {
		console.log("Closing modal");
		setIsModalOpen(false);
		setTimeout(() => {
			setSelectedCelestial(null);
		}, 300);
	};

	// デバッグ用：モーダル状態をログ出力
	console.log("Modal state:", {
		isModalOpen,
		selectedCelestial: selectedCelestial?.name,
	});

	// 初期化時にモーダルを確実に閉じる
	useEffect(() => {
		setIsModalOpen(false);
		setSelectedCelestial(null);
	}, []);

	if (isLoading) {
		return (
			<div className="fixed inset-0 bg-black flex items-center justify-center">
				<div className="text-center">
					<div className="relative w-24 h-24 mx-auto mb-6">
						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 animate-pulse" />
						<div className="absolute inset-2 rounded-full bg-black" />
						<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
					</div>
					<div className="text-white text-xl font-light tracking-wider animate-pulse">
						宇宙地図を読み込んでいます...
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-screen overflow-hidden bg-black">
			{/* 宇宙背景のグラデーション */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-indigo-950" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
			</div>

			{/* 星空エフェクト */}
			<div className="absolute inset-0">
				{/* 大きな星 */}
				{[...Array(50)].map((_, i) => (
					<div
						key={`star-large-${i}`}
						className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
						style={{
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
							animationDuration: `${3 + Math.random() * 4}s`,
							opacity: 0.6 + Math.random() * 0.4,
						}}
					/>
				))}

				{/* 小さな星 */}
				{[...Array(200)].map((_, i) => (
					<div
						key={`star-small-${i}`}
						className="absolute w-px h-px bg-white rounded-full"
						style={{
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							opacity: 0.3 + Math.random() * 0.7,
						}}
					/>
				))}

				{/* 流れ星エフェクト */}
				<div className="absolute top-10 right-20 w-32 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-shooting-star" />
			</div>

			{/* 星雲エフェクト */}
			<div className="absolute inset-0 opacity-30">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 animate-float" />
				<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20 animate-float-delayed" />
				<div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600 rounded-full blur-3xl opacity-10 animate-float-slow" />
			</div>

			{/* ヘッダー */}
			<header className="relative z-10 p-6 md:p-8">
				<div className="max-w-4xl">
					<h1
						className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text 
            bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-3 tracking-tight"
					>
						CosmoMap
					</h1>
					<p className="text-gray-400 text-lg md:text-xl font-light tracking-wide">
						宇宙の天体をクリックして詳細を探索しよう
					</p>
				</div>
			</header>

			{/* 天体マップエリア */}
			<div className="relative w-full h-full">
				{/* 太陽系の中心線（装飾） */}
				<div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
				<div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

				{/* 天体配置 */}
				{celestialBodies.map((celestial) => (
					<MapPin3D
						key={celestial.id}
						celestial={celestial}
						onClick={handlePinClick}
					/>
				))}
			</div>

			{/* モーダル */}
			<CelestialModal
				celestial={selectedCelestial}
				isOpen={isModalOpen}
				onClose={handleCloseModal}
			/>

			{/* フッター */}
			<footer
				className="absolute bottom-0 left-0 right-0 p-6 
        text-center text-sm text-gray-600 pointer-events-none"
			>
				<p className="backdrop-blur-sm bg-black/30 inline-block px-4 py-2 rounded-full">
					Powered by NASA Public Domain Images
				</p>
			</footer>
		</div>
	);
};

// カスタムアニメーション用のCSS
const styles = `
  @keyframes shooting-star {
    0% {
      transform: translateX(-100px) translateY(0);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(500px) translateY(100px);
      opacity: 0;
    }
  }
  
  @keyframes float-delayed {
    0%, 100% {
      transform: translateY(0px) scale(1);
    }
    50% {
      transform: translateY(-30px) scale(1.1);
    }
  }
  
  @keyframes float-slow {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
    }
    33% {
      transform: translateY(-20px) translateX(20px);
    }
    66% {
      transform: translateY(20px) translateX(-20px);
    }
  }
  
  .animate-shooting-star {
    animation: shooting-star 8s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite;
    animation-delay: 2s;
  }
  
  .animate-float-slow {
    animation: float-slow 12s ease-in-out infinite;
  }
`;

if (typeof document !== "undefined") {
	const styleSheet = document.createElement("style");
	styleSheet.textContent = styles;
	document.head.appendChild(styleSheet);
}

export default SpaceMap;
