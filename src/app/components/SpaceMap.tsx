"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// import MapPin from './MapPin'
// import MapPin3D from './MapPin3D'
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
	const [isModalOpen, setIsModalOpen] = useState(false);
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

	// デバッグ用：モーダル状態の変更を監視
	useEffect(() => {
		console.log("Modal state changed:", {
			isModalOpen,
			selectedCelestial: selectedCelestial?.name,
		});
	}, [isModalOpen, selectedCelestial]);

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
				{/* 大きな星（煌めく）- 画面全体に均等分布 */}
				{[...Array(150)].map((_, i) => {
					const row = Math.floor(i / 15); // 10行
					const col = i % 15; // 15列
					const baseTop = row * 10 + Math.random() * 8; // 各行の範囲内でランダム
					const baseLeft = col * 6.67 + Math.random() * 4; // 各列の範囲内でランダム

					return (
						<div
							key={`star-large-${i}`}
							className="absolute bg-white rounded-full animate-twinkle"
							style={{
								width: `${2 + Math.random() * 3}px`,
								height: `${2 + Math.random() * 3}px`,
								top: `${baseTop}%`,
								left: `${baseLeft}%`,
								animationDelay: `${Math.random() * 5}s`,
								animationDuration: `${2 + Math.random() * 3}s`,
								opacity: 0.4 + Math.random() * 0.6,
								boxShadow: `0 0 ${
									4 + Math.random() * 6
								}px rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`,
							}}
						/>
					);
				})}

				{/* 中程度の星 - より細かいグリッド */}
				{[...Array(400)].map((_, i) => {
					const row = Math.floor(i / 20); // 20行
					const col = i % 20; // 20列
					const baseTop = row * 5 + Math.random() * 3; // 各行の範囲内でランダム
					const baseLeft = col * 5 + Math.random() * 3; // 各列の範囲内でランダム

					return (
						<div
							key={`star-medium-${i}`}
							className="absolute bg-white rounded-full animate-twinkle"
							style={{
								width: `${1 + Math.random() * 2}px`,
								height: `${1 + Math.random() * 2}px`,
								top: `${baseTop}%`,
								left: `${baseLeft}%`,
								animationDelay: `${Math.random() * 4}s`,
								animationDuration: `${1.5 + Math.random() * 2.5}s`,
								opacity: 0.3 + Math.random() * 0.5,
							}}
						/>
					);
				})}

				{/* 小さな星 - ランダム分布で密度を上げる */}
				{[...Array(800)].map((_, i) => (
					<div
						key={`star-small-${i}`}
						className="absolute bg-white rounded-full"
						style={{
							width: "1px",
							height: "1px",
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							opacity: 0.1 + Math.random() * 0.3,
						}}
					/>
				))}

				{/* 流れ星エフェクト（複数）- 画面全体に分散 */}
				<div className="absolute top-5 right-10 w-32 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-shooting-star" />
				<div className="absolute top-15 left-5 w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shooting-star-delayed" />
				<div className="absolute bottom-15 right-5 w-28 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shooting-star-slow" />
				<div className="absolute top-30 left-20 w-20 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shooting-star" />
				<div className="absolute bottom-5 left-15 w-26 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-45 animate-shooting-star-delayed" />
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
  @keyframes twinkle {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
  
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
  
  @keyframes shooting-star-delayed {
    0% {
      transform: translateX(-80px) translateY(0);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(400px) translateY(80px);
      opacity: 0;
    }
  }
  
  @keyframes shooting-star-slow {
    0% {
      transform: translateX(-120px) translateY(0);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(600px) translateY(120px);
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
  
  .animate-twinkle {
    animation: twinkle 3s ease-in-out infinite;
  }
  
  .animate-shooting-star {
    animation: shooting-star 8s ease-in-out infinite;
  }
  
  .animate-shooting-star-delayed {
    animation: shooting-star-delayed 12s ease-in-out infinite;
    animation-delay: 4s;
  }
  
  .animate-shooting-star-slow {
    animation: shooting-star-slow 15s ease-in-out infinite;
    animation-delay: 8s;
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
