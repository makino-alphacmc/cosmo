"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { CelestialBody } from "../types";
import celestialBodiesData from "../data/celestialBodies.json";

// モーダルは動的インポート（パフォーマンス最適化）
const CelestialModal = dynamic(() => import("./CelestialModal"), {
	loading: () => <div className="fixed inset-0 bg-black bg-opacity-50" />,
	ssr: false,
});

// MapPinコンポーネントをインラインで定義
const MapPin: React.FC<{
	celestial: CelestialBody;
	onClick: (celestial: CelestialBody) => void;
}> = ({ celestial, onClick }) => {
	console.log("MapPin rendering:", celestial.name, celestial.position);

	// 天体タイプに応じた色を決定
	const getPlanetColor = () => {
		switch (celestial.id) {
			case "sun":
				return "#f59e0b"; // yellow-500
			case "mercury":
				return "#6b7280"; // gray-500
			case "venus":
				return "#fde047"; // yellow-300
			case "earth":
				return "#3b82f6"; // blue-500
			case "moon":
				return "#d1d5db"; // gray-300
			case "mars":
				return "#ef4444"; // red-500
			case "jupiter":
				return "#f97316"; // orange-500
			case "saturn":
				return "#facc15"; // yellow-400
			case "uranus":
				return "#22d3ee"; // cyan-400
			case "neptune":
				return "#2563eb"; // blue-600
			default:
				return "#3b82f6"; // blue-500
		}
	};

	return (
		<div
			style={{
				position: "absolute",
				width: "96px",
				height: "96px",
				top: celestial.position.top,
				left: celestial.position.left,
				transform: "translate(-50%, -50%)",
				zIndex: 20,
			}}
		>
			<button
				style={{
					width: "100%",
					height: "100%",
					backgroundColor: getPlanetColor(),
					borderRadius: "50%",
					border: "4px solid white",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "white",
					fontSize: "12px",
					fontWeight: "bold",
					boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
					transition: "all 0.2s ease",
				}}
				onClick={() => onClick(celestial)}
				aria-label={`${celestial.name}の詳細を表示`}
			>
				{celestial.name}
			</button>
		</div>
	);
};

const SpaceMap: React.FC = () => {
	const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>([]);
	const [selectedCelestial, setSelectedCelestial] =
		useState<CelestialBody | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [stars, setStars] = useState<
		Array<{ id: number; style: React.CSSProperties }>
	>([]);

	// 天体データの読み込み
	useEffect(() => {
		try {
			console.log("Loading celestial data:", celestialBodiesData);
			setCelestialBodies(celestialBodiesData as CelestialBody[]);
			setIsLoading(false);
		} catch (error) {
			console.error("Failed to load celestial data:", error);
			// フォールバックデータ
			setCelestialBodies([
				{
					id: "earth",
					name: "地球",
					type: "planet",
					position: { top: "50%", left: "50%" },
					image: "/planets/earth.png",
					description: "私たちの住む青い惑星。",
				},
			]);
			setIsLoading(false);
		}
	}, []);

	// 背景の星を生成
	useEffect(() => {
		const generateStars = () => {
			const starArray = [];
			for (let i = 0; i < 100; i++) {
				starArray.push({
					id: i,
					style: {
						top: `${Math.random() * 100}%`,
						left: `${Math.random() * 100}%`,
						animationDelay: `${Math.random() * 3}s`,
						animationDuration: `${3 + Math.random() * 2}s`,
					},
				});
			}
			setStars(starArray);
		};

		generateStars();
	}, []);

	// ピンクリック時の処理
	const handlePinClick = (celestial: CelestialBody) => {
		console.log("Pin clicked:", celestial.name);
		setSelectedCelestial(celestial);
		setIsModalOpen(true);
		console.log("Modal state after click:", {
			selectedCelestial: celestial,
			isModalOpen: true,
		});
	};

	// モーダルを閉じる処理
	const handleCloseModal = () => {
		console.log("Closing modal");
		setIsModalOpen(false);
		// アニメーション完了後に選択をクリア
		setTimeout(() => {
			setSelectedCelestial(null);
		}, 300);
	};

	if (isLoading) {
		return (
			<div className="fixed inset-0 bg-black flex items-center justify-center">
				<div className="text-white text-xl animate-pulse">
					宇宙地図を読み込んでいます...
				</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-screen overflow-hidden bg-black">
			{/* 背景のグラデーション */}
			<div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-indigo-950" />

			{/* アニメーション背景の星 */}
			<div className="stars">
				{stars.map((star) => (
					<div key={star.id} className="star" style={star.style} />
				))}
			</div>

			{/* グラデーションオーバーレイ */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

			{/* ヘッダー */}
			<header className="relative z-10 p-4 md:p-6">
				<h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
					CosmoMap
				</h1>
				<p className="text-gray-300 mt-2 text-sm md:text-base">
					宇宙の天体をクリックして詳細を探索しよう
				</p>
			</header>

			{/* 天体マップエリア */}
			<div className="relative w-full h-full bg-transparent">
				{/* デバッグ情報 */}
				<div className="absolute top-0 left-0 bg-red-500 text-white p-2 text-xs z-50">
					天体数: {celestialBodies.length}
				</div>

				{/* テスト用の固定ボタン */}
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "128px",
						height: "128px",
						backgroundColor: "#ef4444",
						borderRadius: "50%",
						border: "4px solid white",
						zIndex: 30,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
					}}
				>
					テスト
				</div>

				{celestialBodies.map((celestial) => {
					console.log("Rendering MapPin for:", celestial.name);
					return (
						<MapPin
							key={celestial.id}
							celestial={celestial}
							onClick={handlePinClick}
						/>
					);
				})}
			</div>

			{/* モーダル */}
			{console.log("Modal state:", { selectedCelestial, isModalOpen })}
			<CelestialModal
				celestial={selectedCelestial}
				isOpen={isModalOpen}
				onClose={handleCloseModal}
			/>

			{/* フッター情報 */}
			<footer className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-500 pointer-events-none">
				<p>画像提供: NASA / パブリックドメイン</p>
			</footer>
		</div>
	);
};

export default SpaceMap;
