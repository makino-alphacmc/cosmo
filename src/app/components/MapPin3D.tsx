"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Ring } from "@react-three/drei";
import * as THREE from "three";
import { CelestialBody } from "../types";

// 3D球体コンポーネント
function Planet3D({ celestial }: { celestial: CelestialBody }) {
	console.log("Planet3D rendering:", celestial.name);

	const meshRef = useRef<THREE.Mesh>(null);
	const ringRef = useRef<THREE.Mesh>(null);

	// 回転アニメーション
	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += delta * 0.5;
		}
		if (ringRef.current && celestial.id === "saturn") {
			ringRef.current.rotation.z += delta * 0.2;
		}
	});

	// 天体のマテリアル設定（シンプル化）
	const material = useMemo(() => {
		switch (celestial.id) {
			case "sun":
				return <meshBasicMaterial color="#FDB813" />;
			case "mercury":
				return (
					<meshStandardMaterial
						color="#8C8C8C"
						roughness={0.7}
						metalness={0.3}
					/>
				);
			case "venus":
				return (
					<meshStandardMaterial
						color="#FFC94C"
						roughness={0.8}
						metalness={0.2}
					/>
				);
			case "earth":
				return (
					<meshStandardMaterial
						color="#4B9BFF"
						roughness={0.5}
						metalness={0.1}
					/>
				);
			case "moon":
				return (
					<meshStandardMaterial
						color="#E6E6E6"
						roughness={0.9}
						metalness={0.1}
					/>
				);
			case "mars":
				return (
					<meshStandardMaterial
						color="#CD5C5C"
						roughness={0.8}
						metalness={0.2}
					/>
				);
			case "jupiter":
				return (
					<meshStandardMaterial
						color="#DAA520"
						roughness={0.6}
						metalness={0.2}
					/>
				);
			case "saturn":
				return (
					<meshStandardMaterial
						color="#FADA5E"
						roughness={0.6}
						metalness={0.2}
					/>
				);
			case "uranus":
				return (
					<meshStandardMaterial
						color="#4FD0E0"
						roughness={0.5}
						metalness={0.3}
					/>
				);
			case "neptune":
				return (
					<meshStandardMaterial
						color="#4B70DD"
						roughness={0.5}
						metalness={0.3}
					/>
				);
			default:
				return <meshStandardMaterial color="#808080" />;
		}
	}, [celestial.id]);

	// 天体サイズ
	const scale =
		celestial.type === "star" ? 1.5 : celestial.type === "satellite" ? 0.5 : 1;

	return (
		<group>
			{/* 天体本体 */}
			<Sphere ref={meshRef} args={[1, 32, 32]} scale={scale}>
				{material}
			</Sphere>

			{/* 土星の環（簡素化） */}
			{celestial.id === "saturn" && (
				<Ring
					ref={ringRef}
					args={[1.5, 2.5, 32]}
					rotation={[Math.PI / 2, 0, 0]}
				>
					<meshBasicMaterial color="#FADA5E" opacity={0.6} transparent />
				</Ring>
			)}
		</group>
	);
}

interface MapPin3DProps {
	celestial: CelestialBody;
	onClick: (celestial: CelestialBody) => void;
}

const MapPin3D: React.FC<MapPin3DProps> = ({ celestial, onClick }) => {
	console.log("MapPin3D rendering:", celestial.name);

	// 天体タイプに応じたサイズ
	const getSize = () => {
		switch (celestial.type) {
			case "star":
				return "w-32 h-32 md:w-40 md:h-40";
			case "planet":
				return "w-20 h-20 md:w-24 md:h-24";
			case "satellite":
				return "w-12 h-12 md:w-16 md:h-16";
			default:
				return "w-16 h-16 md:w-20 md:h-20";
		}
	};

	return (
		<div
			style={{
				position: "absolute",
				top: celestial.position.top,
				left: celestial.position.left,
				transform: "translate(-50%, -50%)",
				width: getSize().includes("w-32")
					? "8rem"
					: getSize().includes("w-20")
					? "5rem"
					: "3rem",
				height: getSize().includes("h-32")
					? "8rem"
					: getSize().includes("h-20")
					? "5rem"
					: "3rem",
			}}
		>
			<button
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					cursor: "pointer",
				}}
				onClick={() => onClick(celestial)}
				aria-label={`${celestial.name}の詳細を表示`}
			>
				{/* 3Dキャンバス */}
				<div
					style={{
						width: "100%",
						height: "100%",
						pointerEvents: "none",
					}}
				>
					<Canvas
						camera={{ position: [0, 0, 3], fov: 50 }}
						gl={{ alpha: true }}
						onError={(error) => {
							console.error("Canvas error:", error);
						}}
					>
						<ambientLight intensity={0.6} />
						<Planet3D celestial={celestial} />
					</Canvas>
				</div>

				{/* ホバーエフェクト */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						borderRadius: "50%",
						opacity: 0,
						transition: "opacity 0.3s ease",
						pointerEvents: "none",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.opacity = "1";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.opacity = "0";
					}}
				>
					<div
						style={{
							position: "absolute",
							inset: 0,
							borderRadius: "50%",
							backgroundColor: "rgba(255, 255, 255, 0.1)",
							filter: "blur(4px)",
							transform: "scale(1.1)",
						}}
					/>
				</div>

				{/* 天体名ラベル */}
				<div
					style={{
						position: "absolute",
						bottom: "-2rem",
						left: "50%",
						transform: "translateX(-50%)",
						opacity: 0,
						transition: "all 0.3s ease",
						backgroundColor: "rgba(17, 24, 39, 0.9)",
						backdropFilter: "blur(4px)",
						padding: "0.375rem 0.75rem",
						borderRadius: "9999px",
						color: "white",
						fontSize: "0.875rem",
						fontWeight: "500",
						whiteSpace: "nowrap",
						boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
						border: "1px solid rgba(55, 65, 81, 0.5)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.opacity = "1";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.opacity = "0";
					}}
				>
					{celestial.name}
				</div>
			</button>
		</div>
	);
};

export default MapPin3D;
