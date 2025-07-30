"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import MapPin from "./MapPin";
import { CelestialBody } from "../types";
import celestialBodiesData from "../data/celestialBodies.json";

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
	const [stars, setStars] = useState<
		Array<{ id: number; style: React.CSSProperties }>
	>([]);

	// 天体データの読み込み
	useEffect(() => {
		try {
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
		setSelectedCelestial(celestial);
		setIsModalOpen(true);
	};

	// モーダルを閉じる処理
	const handleCloseModal = () => {
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
			{/* 背景画像 */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: "url(/space-bg.jpg)",
					filter: "brightness(0.7)",
				}}
			/>

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
			<div className="relative w-full h-full">
				{celestialBodies.map((celestial) => (
					<MapPin
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

			{/* フッター情報 */}
			<footer className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-500 pointer-events-none">
				<p>画像提供: NASA / パブリックドメイン</p>
			</footer>
		</div>
	);
};

export default SpaceMap;
