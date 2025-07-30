"use client";

import React from "react";
import { CelestialBody } from "../types";

interface MapPinProps {
	celestial: CelestialBody;
	onClick: (celestial: CelestialBody) => void;
}

const MapPin: React.FC<MapPinProps> = ({ celestial, onClick }) => {
	// 天体タイプに応じたスタイルを決定
	const getPinStyle = () => {
		switch (celestial.type) {
			case "star":
				return "w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40";
			case "planet":
				return "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24";
			case "satellite":
				return "w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16";
			default:
				return "w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20";
		}
	};

	// 天体タイプに応じた特殊効果
	const getSpecialEffects = () => {
		if (celestial.type === "star") {
			return (
				<>
					{/* 太陽のコロナ効果 */}
					<div className="absolute inset-0 rounded-full animate-pulse-slow">
						<div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 blur-xl scale-150" />
						<div className="absolute inset-0 rounded-full bg-orange-400 opacity-20 blur-2xl scale-125" />
					</div>
				</>
			);
		}
		return null;
	};

	// 天体の色とグラデーション
	const getPlanetStyle = () => {
		const baseClasses = "absolute inset-0 rounded-full";

		switch (celestial.id) {
			case "sun":
				return `${baseClasses} bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 shadow-[0_0_60px_rgba(255,204,0,0.8)]`;
			case "mercury":
				return `${baseClasses} bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 shadow-[0_0_20px_rgba(156,163,175,0.6)]`;
			case "venus":
				return `${baseClasses} bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-200 shadow-[0_0_30px_rgba(254,240,138,0.6)]`;
			case "earth":
				return `${baseClasses} bg-gradient-to-br from-blue-400 via-blue-500 to-green-400 shadow-[0_0_30px_rgba(59,130,246,0.6)]`;
			case "moon":
				return `${baseClasses} bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-[0_0_20px_rgba(229,231,235,0.6)]`;
			case "mars":
				return `${baseClasses} bg-gradient-to-br from-red-400 via-red-500 to-orange-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]`;
			case "jupiter":
				return `${baseClasses} bg-gradient-to-br from-yellow-600 via-orange-300 to-red-300 shadow-[0_0_40px_rgba(251,191,36,0.6)]`;
			case "saturn":
				return `${baseClasses} bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 shadow-[0_0_35px_rgba(254,243,199,0.6)]`;
			case "uranus":
				return `${baseClasses} bg-gradient-to-br from-cyan-300 via-cyan-400 to-teal-400 shadow-[0_0_30px_rgba(34,211,238,0.6)]`;
			case "neptune":
				return `${baseClasses} bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-[0_0_30px_rgba(59,130,246,0.6)]`;
			default:
				return `${baseClasses} bg-gradient-to-br from-gray-400 to-gray-600`;
		}
	};

	// 土星の環
	const getSaturnRing = () => {
		if (celestial.id === "saturn") {
			return (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div
						className="absolute w-[150%] h-[150%] rounded-full border-8 border-yellow-200/40 
            transform rotate-12 shadow-[0_0_20px_rgba(254,240,138,0.4)]"
					/>
					<div
						className="absolute w-[170%] h-[170%] rounded-full border-4 border-yellow-100/30 
            transform rotate-12"
					/>
				</div>
			);
		}
		return null;
	};

	// 天体表面のテクスチャ効果
	const getSurfacePattern = () => {
		switch (celestial.id) {
			case "jupiter":
				return (
					<div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/50 to-transparent transform scale-x-150" />
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/50 to-transparent transform translate-y-2" />
					</div>
				);
			case "earth":
				return (
					<div className="absolute inset-0 rounded-full overflow-hidden">
						<div className="absolute top-1/4 left-1/4 w-1/3 h-1/4 bg-green-600/40 rounded-full blur-md" />
						<div className="absolute bottom-1/3 right-1/4 w-1/4 h-1/3 bg-green-500/30 rounded-full blur-md" />
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div
			className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getPinStyle()}`}
			style={{
				top: celestial.position.top,
				left: celestial.position.left,
			}}
		>
			<button
				className="relative w-full h-full group cursor-pointer"
				onClick={() => onClick(celestial)}
				aria-label={`${celestial.name}の詳細を表示`}
				data-testid="map-pin"
			>
				{/* 特殊効果（太陽のコロナなど） */}
				{getSpecialEffects()}

				{/* 天体本体 */}
				<div
					className="relative w-full h-full transform transition-all duration-300 
          group-hover:scale-110 group-focus:scale-110"
				>
					{/* ベースの球体 */}
					<div className={getPlanetStyle()} />

					{/* 表面パターン */}
					{getSurfacePattern()}

					{/* 土星の環 */}
					{getSaturnRing()}

					{/* 光沢効果 */}
					<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-50" />

					{/* 影効果 */}
					<div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/30" />
				</div>

				{/* ホバーエフェクト */}
				<div
					className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 pointer-events-none"
				>
					<div className="absolute inset-0 rounded-full bg-white/10 blur-md scale-110" />
				</div>

				{/* 天体名ラベル */}
				<div
					className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
          opacity-0 group-hover:opacity-100 transition-all duration-300 
          bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full
          text-white text-sm font-medium whitespace-nowrap
          shadow-lg border border-gray-700/50"
				>
					{celestial.name}
				</div>
			</button>

			{/* アニメーション軌道線（オプション） */}
			{celestial.type === "planet" && (
				<div className="absolute inset-0 pointer-events-none">
					<div
						className="absolute inset-0 rounded-full border border-white/5 
            scale-[3] animate-pulse-slow"
					/>
				</div>
			)}
		</div>
	);
};

export default MapPin;
