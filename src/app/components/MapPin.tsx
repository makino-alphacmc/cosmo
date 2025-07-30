"use client";

import React from "react";
import { CelestialBody } from "../types";

interface MapPinProps {
	celestial: CelestialBody;
	onClick: (celestial: CelestialBody) => void;
}

const MapPin: React.FC<MapPinProps> = ({ celestial, onClick }) => {
	console.log("MapPin rendering:", celestial.name, celestial.position);

	// 天体タイプに応じた色を決定
	const getPlanetColor = () => {
		switch (celestial.id) {
			case "sun":
				return "bg-yellow-500";
			case "mercury":
				return "bg-gray-500";
			case "venus":
				return "bg-yellow-300";
			case "earth":
				return "bg-blue-500";
			case "moon":
				return "bg-gray-300";
			case "mars":
				return "bg-red-500";
			case "jupiter":
				return "bg-orange-500";
			case "saturn":
				return "bg-yellow-400";
			case "uranus":
				return "bg-cyan-400";
			case "neptune":
				return "bg-blue-600";
			default:
				return "bg-blue-500";
		}
	};

	return (
		<div
			className="absolute transform -translate-x-1/2 -translate-y-1/2 w-20 h-20"
			style={{
				top: celestial.position.top,
				left: celestial.position.left,
			}}
		>
			<button
				className={`w-full h-full ${getPlanetColor()} rounded-full border-4 border-white 
          hover:scale-110 transition-all duration-200 cursor-pointer
          flex items-center justify-center text-white text-xs font-bold shadow-lg
          hover:shadow-xl`}
				onClick={() => onClick(celestial)}
				aria-label={`${celestial.name}の詳細を表示`}
			>
				{celestial.name}
			</button>
		</div>
	);
};

export default MapPin;
