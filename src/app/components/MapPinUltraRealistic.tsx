"use client";

import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
	Sphere,
	Ring,
	Float,
	Stars,
	Cloud,
	useTexture,
	shaderMaterial,
	Clouds,
} from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { CelestialBody } from "../types";

// 高品質テクスチャURL（複数のソースから選択可能）
const HD_TEXTURE_URLS = {
	// Solar System Scope の高解像度テクスチャ（2K/4K）
	sun: {
		map: "https://www.solarsystemscope.com/textures/download/2k_sun.jpg",
		// 代替: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/sun.jpg'
	},
	mercury: {
		map: "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg",
	},
	venus: {
		map: "https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg",
		atmosphere:
			"https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg",
	},
	earth: {
		map: "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
		normal:
			"https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.jpg",
		specular:
			"https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.jpg",
		clouds:
			"https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg",
		night:
			"https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg",
	},
	moon: {
		map: "https://www.solarsystemscope.com/textures/download/2k_moon.jpg",
		normal:
			"https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/moon_normal.jpg",
	},
	mars: {
		map: "https://www.solarsystemscope.com/textures/download/2k_mars.jpg",
		normal:
			"https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/mars_normal.jpg",
	},
	jupiter: {
		map: "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg",
	},
	saturn: {
		map: "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
		ring: "https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png",
	},
	uranus: {
		map: "https://www.solarsystemscope.com/textures/download/2k_uranus.jpg",
	},
	neptune: {
		map: "https://www.solarsystemscope.com/textures/download/2k_neptune.jpg",
	},
};

// 地球用の特別なシェーダー（昼夜表現）
const EarthShaderMaterial = shaderMaterial(
	{
		dayTexture: null,
		nightTexture: null,
		sunDirection: new THREE.Vector3(5, 0, 5).normalize(),
	},
	// Vertex Shader
	`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	// Fragment Shader
	`
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform vec3 sunDirection;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float sunLight = dot(vNormal, sunDirection);
      
      vec3 dayColor = texture2D(dayTexture, vUv).rgb;
      vec3 nightColor = texture2D(nightTexture, vUv).rgb;
      
      float twilightWidth = 0.3;
      float dayAmount = smoothstep(-twilightWidth, twilightWidth, sunLight);
      
      vec3 color = mix(nightColor, dayColor, dayAmount);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ EarthShaderMaterial });

// 超リアルな地球コンポーネント
function UltraRealisticEarth({ scale }: { scale: number }) {
	const meshRef = useRef<THREE.Mesh>(null);
	const cloudsRef = useRef<THREE.Mesh>(null);

	// テクスチャの読み込み
	const textures = useTexture({
		map: HD_TEXTURE_URLS.earth.map,
		normalMap: HD_TEXTURE_URLS.earth.normal,
		specularMap: HD_TEXTURE_URLS.earth.specular,
		cloudsMap: HD_TEXTURE_URLS.earth.clouds,
		nightMap: HD_TEXTURE_URLS.earth.night,
	});

	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += delta * 0.1;
		}
		if (cloudsRef.current) {
			cloudsRef.current.rotation.y += delta * 0.12;
		}
	});

	return (
		<group scale={scale}>
			{/* 地球本体 */}
			<Sphere ref={meshRef} args={[1, 64, 64]}>
				<meshPhongMaterial
					map={textures.map}
					normalMap={textures.normalMap}
					specularMap={textures.specularMap}
					specular={new THREE.Color("grey")}
					shininess={10}
				/>
			</Sphere>

			{/* 雲レイヤー */}
			<Sphere ref={cloudsRef} args={[1.01, 64, 64]}>
				<meshPhongMaterial
					map={textures.cloudsMap}
					transparent
					opacity={0.4}
					depthWrite={false}
				/>
			</Sphere>

			{/* 大気 */}
			<Sphere args={[1.03, 64, 64]}>
				<meshPhongMaterial
					color="#4B9BFF"
					transparent
					opacity={0.1}
					depthWrite={false}
				/>
			</Sphere>
		</group>
	);
}

// 超リアルな3D天体コンポーネント
function UltraRealisticPlanet({ celestial }: { celestial: CelestialBody }) {
	const meshRef = useRef<THREE.Mesh>(null);
	const ringRef = useRef<THREE.Mesh>(null);

	// 基本テクスチャURL
	const textureUrls =
		HD_TEXTURE_URLS[celestial.id as keyof typeof HD_TEXTURE_URLS];

	// フォールバック用の単純なテクスチャURL
	const simpleTextureUrl = `https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/${celestial.id}.jpg`;

	// テクスチャの読み込み（エラーハンドリング付き）
	let texture = null;
	let normalTexture = null;
	let ringTexture = null;

	try {
		if (
			textureUrls &&
			typeof textureUrls === "object" &&
			"map" in textureUrls
		) {
			texture = useLoader(THREE.TextureLoader, textureUrls.map);

			// 法線マップがある場合
			if ("normal" in textureUrls && textureUrls.normal) {
				normalTexture = useLoader(THREE.TextureLoader, textureUrls.normal);
			}

			// 土星の環
			if (
				celestial.id === "saturn" &&
				"ring" in textureUrls &&
				textureUrls.ring
			) {
				ringTexture = useLoader(THREE.TextureLoader, textureUrls.ring);
			}
		} else {
			// フォールバック
			texture = useLoader(THREE.TextureLoader, simpleTextureUrl);
		}
	} catch (error) {
		console.error(`Failed to load texture for ${celestial.name}:`, error);
	}

	// 回転アニメーション
	useFrame((state, delta) => {
		if (meshRef.current) {
			const rotationSpeed =
				{
					jupiter: 2.4,
					saturn: 2.2,
					sun: 0.5,
					venus: -0.1, // 金星は逆回転
					uranus: 1.5,
				}[celestial.id] || 1;

			meshRef.current.rotation.y += delta * 0.5 * rotationSpeed;
		}

		if (ringRef.current && celestial.id === "saturn") {
			ringRef.current.rotation.z += delta * 0.1;
		}
	});

	// 天体サイズ（実際の比率により近い）
	const getScale = () => {
		const scales = {
			sun: 3.0,
			jupiter: 1.8,
			saturn: 1.6,
			uranus: 0.9,
			neptune: 0.9,
			earth: 0.8,
			venus: 0.75,
			mars: 0.6,
			mercury: 0.4,
			moon: 0.35,
		};
		return scales[celestial.id as keyof typeof scales] || 1;
	};

	const scale = getScale();

	// 特別な処理が必要な天体
	if (celestial.id === "earth" && typeof textureUrls === "object") {
		return <UltraRealisticEarth scale={scale} />;
	}

	return (
		<group>
			{/* 天体本体 */}
			<Float
				speed={celestial.type === "star" ? 0.5 : 0} // 太陽だけ浮遊
				rotationIntensity={0}
				floatIntensity={celestial.type === "star" ? 0.2 : 0}
			>
				<Sphere ref={meshRef} args={[1, 128, 128]} scale={scale}>
					{celestial.id === "sun" ? (
						<meshBasicMaterial
							map={texture}
							emissive="#FDB813"
							emissiveIntensity={1}
						/>
					) : (
						<meshPhongMaterial
							map={texture}
							normalMap={normalTexture}
							bumpScale={0.05}
							specular={new THREE.Color("#333333")}
							shininess={celestial.id === "moon" ? 5 : 25}
						/>
					)}
				</Sphere>
			</Float>

			{/* 土星の環 */}
			{celestial.id === "saturn" && (
				<group ref={ringRef} rotation={[Math.PI / 2, 0, 0.2]}>
					<Ring args={[1.4, 2.5, 128]} scale={scale}>
						<meshPhongMaterial
							map={ringTexture}
							transparent
							opacity={0.8}
							side={THREE.DoubleSide}
							emissive="#E4D4A8"
							emissiveIntensity={0.1}
						/>
					</Ring>
				</group>
			)}

			{/* 太陽のコロナ */}
			{celestial.id === "sun" && (
				<>
					<Sphere args={[1.3, 64, 64]} scale={scale}>
						<meshBasicMaterial
							color="#FFF5B8"
							transparent
							opacity={0.2}
							blending={THREE.AdditiveBlending}
						/>
					</Sphere>
					<pointLight
						position={[0, 0, 0]}
						intensity={3}
						color="#FDB813"
						distance={10}
					/>
				</>
			)}

			{/* 金星の厚い大気 */}
			{celestial.id === "venus" && (
				<Sphere args={[1.02, 64, 64]} scale={scale}>
					<meshPhongMaterial
						color="#FFC94C"
						transparent
						opacity={0.3}
						depthWrite={false}
					/>
				</Sphere>
			)}

			{/* 木星の嵐（大赤斑）効果 */}
			{celestial.id === "jupiter" && (
				<Clouds texture={null}>
					<Cloud
						position={[0.3, -0.2, 0.8]}
						speed={0.2}
						opacity={0.3}
						color="#CD5C5C"
					/>
				</Clouds>
			)}
		</group>
	);
}

// ローディング中の表示
function LoadingPlanet() {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += delta;
			meshRef.current.rotation.x += delta * 0.5;
		}
	});

	return (
		<>
			<Sphere ref={meshRef} args={[1, 16, 16]}>
				<meshBasicMaterial color="#444" wireframe />
			</Sphere>
			<Stars
				radius={5}
				depth={5}
				count={100}
				factor={2}
				saturation={0}
				fade
				speed={1}
			/>
		</>
	);
}

interface MapPinUltraRealisticProps {
	celestial: CelestialBody;
	onClick: (celestial: CelestialBody) => void;
}

const MapPinUltraRealistic: React.FC<MapPinUltraRealisticProps> = ({
	celestial,
	onClick,
}) => {
	// 天体タイプに応じたサイズ
	const getSize = () => {
		switch (celestial.type) {
			case "star":
				return "w-40 h-40 md:w-56 md:h-56";
			case "planet":
				if (celestial.id === "jupiter" || celestial.id === "saturn") {
					return "w-28 h-28 md:w-36 md:h-36";
				}
				return "w-20 h-20 md:w-28 md:h-28";
			case "satellite":
				return "w-12 h-12 md:w-16 md:h-16";
			default:
				return "w-16 h-16 md:w-24 md:h-24";
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
						camera={{ position: [0, 0, 3], fov: 45 }}
						gl={{
							alpha: true,
							antialias: true,
							toneMapping: THREE.ACESFilmicToneMapping,
							toneMappingExposure: 1.2,
							powerPreference: "high-performance",
						}}
						dpr={[1, 2]}
					>
						{/* 環境光 */}
						<ambientLight intensity={0.2} />

						{/* 太陽光源（太陽以外） */}
						{celestial.id !== "sun" && (
							<directionalLight
								position={[5, 3, 5]}
								intensity={1.2}
								color="#FFF5E1"
								castShadow
							/>
						)}

						{/* 補助光 */}
						<pointLight
							position={[-5, -5, -5]}
							intensity={0.4}
							color="#B0C4DE"
						/>

						{/* 背景の星 */}
						<Stars
							radius={100}
							depth={50}
							count={1000}
							factor={4}
							saturation={0}
							fade
							speed={0.5}
						/>

						<Suspense fallback={<LoadingPlanet />}>
							<UltraRealisticPlanet celestial={celestial} />
						</Suspense>
					</Canvas>
				</div>

				{/* 太陽のグロー効果 */}
				{celestial.type === "star" && (
					<div className="absolute inset-0 rounded-full">
						<div className="absolute inset-0 rounded-full bg-yellow-300/30 blur-2xl scale-150 animate-pulse" />
						<div className="absolute inset-0 rounded-full bg-orange-400/20 blur-3xl scale-125" />
					</div>
				)}

				{/* ホバーエフェクト */}
				<div
					className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 pointer-events-none"
				>
					<div className="absolute inset-0 rounded-full bg-white/5 blur-md scale-110" />
				</div>

				{/* 天体名ラベル */}
				<div
					className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
          opacity-0 group-hover:opacity-100 transition-all duration-300 
          bg-gray-900/95 backdrop-blur-sm px-4 py-2 rounded-full
          text-white text-sm font-medium whitespace-nowrap
          shadow-2xl border border-gray-600/50 z-10"
				>
					<div className="flex items-center gap-2">
						<span>{celestial.name}</span>
						<span className="text-xs text-gray-400">
							{celestial.type === "star"
								? "⭐"
								: celestial.type === "satellite"
								? "🌙"
								: "🪐"}
						</span>
					</div>
				</div>
			</button>
		</div>
	);
};

export default MapPinUltraRealistic;
