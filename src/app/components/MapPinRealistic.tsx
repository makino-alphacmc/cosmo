"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sphere, Ring } from "@react-three/drei";
import * as THREE from "three";
import { CelestialBody } from "../types";

// テクスチャマッピング（パブリックドメインのURL）
const TEXTURE_URLS = {
	sun: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/sun.jpg",
	mercury:
		"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury.jpg",
	venus:
		"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus.jpg",
	earth:
		"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth.jpg",
	moon: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon.jpg",
	mars: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars.jpg",
	jupiter:
		"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter.jpg",
	saturn:
		"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn.jpg",
	uranus:
		"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus.jpg",
	neptune:
		"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune.jpg",
};

// リアルな3D天体コンポーネント
function RealisticPlanet({ celestial }: { celestial: CelestialBody }) {
	const meshRef = useRef<THREE.Mesh>(null);
	const ringRef = useRef<THREE.Mesh>(null);

	// テクスチャの読み込み
	const textureUrl = TEXTURE_URLS[celestial.id as keyof typeof TEXTURE_URLS];
	const texture = textureUrl
		? useLoader(THREE.TextureLoader, textureUrl)
		: null;

	// 回転アニメーション
	useFrame((state, delta) => {
		if (meshRef.current) {
			// 各天体の自転速度を調整
			const rotationSpeed =
				celestial.id === "jupiter"
					? 2
					: celestial.id === "saturn"
					? 1.8
					: celestial.id === "sun"
					? 0.5
					: 1;
			meshRef.current.rotation.y += delta * 0.5 * rotationSpeed;
		}
		if (ringRef.current && celestial.id === "saturn") {
			ringRef.current.rotation.z += delta * 0.2;
		}
	});

	// 天体サイズ（実際の比率に近づける）
	const getScale = () => {
		switch (celestial.id) {
			case "sun":
				return 2.5;
			case "jupiter":
				return 1.4;
			case "saturn":
				return 1.2;
			case "uranus":
				return 0.8;
			case "neptune":
				return 0.8;
			case "earth":
				return 0.7;
			case "venus":
				return 0.7;
			case "mars":
				return 0.5;
			case "mercury":
				return 0.4;
			case "moon":
				return 0.3;
			default:
				return 1;
		}
	};

	const scale = getScale();

	return (
		<group>
			{/* 天体本体 */}
			<Sphere ref={meshRef} args={[1, 64, 64]} scale={scale}>
				{celestial.id === "sun" ? (
					<meshBasicMaterial
						map={texture}
						emissive="#FDB813"
						emissiveIntensity={0.5}
					/>
				) : (
					<meshStandardMaterial
						map={texture}
						roughness={celestial.id === "moon" ? 0.9 : 0.7}
						metalness={0.1}
					/>
				)}
			</Sphere>

			{/* 土星の環 */}
			{celestial.id === "saturn" && (
				<Ring
					ref={ringRef}
					args={[1.5, 2.5, 64]}
					rotation={[Math.PI / 2.2, 0, 0]}
					scale={scale}
				>
					<meshStandardMaterial
						color="#E4D4A8"
						opacity={0.7}
						transparent
						side={THREE.DoubleSide}
						roughness={0.8}
						metalness={0.2}
					/>
				</Ring>
			)}

			{/* 太陽のコロナ効果 */}
			{celestial.id === "sun" && (
				<>
					<Sphere args={[1.2, 32, 32]} scale={scale * 1.1}>
						<meshBasicMaterial color="#FFF5B8" opacity={0.3} transparent />
					</Sphere>
					<pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
				</>
			)}

			{/* 地球の大気 */}
			{celestial.id === "earth" && (
				<Sphere args={[1.02, 32, 32]} scale={scale}>
					<meshBasicMaterial color="#4B9BFF" opacity={0.2} transparent />
				</Sphere>
			)}
		</group>
	);
}

// ローディング中の表示
function LoadingPlanet({ celestial }: { celestial: CelestialBody }) {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += delta;
		}
	});

	return (
		<Sphere ref={meshRef} args={[1, 16, 16]}>
			<meshBasicMaterial color="#666" wireframe />
		</Sphere>
	);
}

interface MapPinRealisticProps {
	celestial: CelestialBody;
	onClick: (celestial: CelestialBody) => void;
}

const MapPinRealistic: React.FC<MapPinRealisticProps> = ({
	celestial,
	onClick,
}) => {
	// 天体タイプに応じたサイズ
	const getSize = () => {
		switch (celestial.type) {
			case "star":
				return "w-32 h-32 md:w-48 md:h-48";
			case "planet":
				if (celestial.id === "jupiter" || celestial.id === "saturn") {
					return "w-24 h-24 md:w-32 md:h-32";
				}
				return "w-16 h-16 md:w-24 md:h-24";
			case "satellite":
				return "w-10 h-10 md:w-14 md:h-14";
			default:
				return "w-16 h-16 md:w-20 md:h-20";
		}
	};

	return (
		<div
			className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getSize()}`}
			style={{
				top: celestial.position.top,
				left: celestial.position.left,
			}}
		>
			<button
				className="relative w-full h-full group cursor-pointer"
				onClick={() => onClick(celestial)}
				aria-label={`${celestial.name}の詳細を表示`}
			>
				{/* 3Dキャンバス */}
				<div className="w-full h-full pointer-events-none">
					<Canvas
						camera={{ position: [0, 0, 3], fov: 50 }}
						gl={{
							alpha: true,
							antialias: true,
							toneMapping: THREE.ACESFilmicToneMapping,
							toneMappingExposure: 1.0,
						}}
					>
						<ambientLight intensity={0.3} />
						<directionalLight position={[5, 5, 5]} intensity={1} />
						<directionalLight position={[-5, -5, -5]} intensity={0.5} />

						<Suspense fallback={<LoadingPlanet celestial={celestial} />}>
							<RealisticPlanet celestial={celestial} />
						</Suspense>
					</Canvas>
				</div>

				{/* グロー効果（特に星のため） */}
				{celestial.type === "star" && (
					<div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl scale-150 animate-pulse" />
				)}

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
          shadow-lg border border-gray-700/50 z-10"
				>
					{celestial.name}
				</div>
			</button>
		</div>
	);
};

export default MapPinRealistic;
