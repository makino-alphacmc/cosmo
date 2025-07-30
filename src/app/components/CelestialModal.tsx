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
	console.log("CelestialModal props:", { celestial, isOpen });
	const [imageError, setImageError] = React.useState(false);

	// 画像読み込みエラー時にリセット
	React.useEffect(() => {
		if (celestial) {
			setImageError(false);
		}
	}, [celestial]);

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

	if (!isOpen || !celestial) {
		console.log("Modal not showing:", { isOpen, celestial });
		return null;
	}

	console.log("Modal showing for:", celestial.name);

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

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 50,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "1rem",
				background:
					"linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(30,41,59,0.95) 100%)",
				backdropFilter: "blur(20px)",
			}}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div
				style={{
					position: "relative",
					background:
						"linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 50%, rgba(51,65,85,0.95) 100%)",
					borderRadius: "2rem",
					maxWidth: "48rem",
					width: "100%",
					maxHeight: "85vh",
					overflow: "hidden",
					boxShadow:
						"0 0 50px rgba(59,130,246,0.3), 0 25px 50px -12px rgba(0,0,0,0.5)",
					border: "1px solid rgba(59,130,246,0.2)",
					backdropFilter: "blur(30px)",
					transform: "scale(1)",
					transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* ヘッダー */}
				<div
					style={{
						position: "relative",
						padding: "2rem 2rem 1rem 2rem",
						background:
							"linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)",
						borderBottom: "1px solid rgba(59,130,246,0.2)",
					}}
				>
					<h2
						id="modal-title"
						style={{
							fontSize: "2.5rem",
							fontWeight: "800",
							background:
								"linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)",
							backgroundClip: "text",
							WebkitBackgroundClip: "text",
							color: "transparent",
							margin: 0,
							textShadow: "0 0 30px rgba(96,165,250,0.5)",
						}}
					>
						{celestial.name}
					</h2>

					{/* 閉じるボタン */}
					<button
						onClick={onClose}
						style={{
							position: "absolute",
							top: "1.5rem",
							right: "1.5rem",
							width: "3rem",
							height: "3rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "#94a3b8",
							background:
								"linear-gradient(135deg, rgba(51,65,85,0.8) 0%, rgba(71,85,105,0.8) 100%)",
							borderRadius: "50%",
							border: "1px solid rgba(59,130,246,0.3)",
							transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
							cursor: "pointer",
							boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.color = "#ffffff";
							e.currentTarget.style.background =
								"linear-gradient(135deg, rgba(59,130,246,0.8) 0%, rgba(147,51,234,0.8) 100%)";
							e.currentTarget.style.transform = "scale(1.1)";
							e.currentTarget.style.boxShadow =
								"0 8px 25px rgba(59,130,246,0.4)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.color = "#94a3b8";
							e.currentTarget.style.background =
								"linear-gradient(135deg, rgba(51,65,85,0.8) 0%, rgba(71,85,105,0.8) 100%)";
							e.currentTarget.style.transform = "scale(1)";
							e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
						}}
						aria-label="モーダルを閉じる"
					>
						<svg
							style={{ width: "1.25rem", height: "1.25rem" }}
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2.5"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* コンテンツ */}
				<div
					style={{
						padding: "2rem",
						display: "flex",
						flexDirection: "column",
						gap: "1.5rem",
						maxHeight: "calc(85vh - 120px)",
						overflowY: "auto",
					}}
				>
					{/* 画像 */}
					<div
						style={{
							position: "relative",
							width: "100%",
							height: "16rem",
							background:
								"linear-gradient(135deg, rgba(51,65,85,0.5) 0%, rgba(71,85,105,0.5) 100%)",
							borderRadius: "1.5rem",
							overflow: "hidden",
							backdropFilter: "blur(10px)",
							boxShadow: "inset 0 0 30px rgba(59,130,246,0.3)",
							border: "1px solid rgba(59,130,246,0.2)",
						}}
					>
						{!imageError ? (
							<div
								style={{
									position: "relative",
									width: "100%",
									height: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									padding: "2rem",
								}}
							>
								{/* 天体の3D風表現 */}
								<div
									style={{
										position: "relative",
										width: "12rem",
										height: "12rem",
									}}
								>
									<div
										className={`absolute inset-0 rounded-full ${getModalPlanetStyle()}`}
									/>
									{getSurfaceDetails()}
									<div
										style={{
											position: "absolute",
											inset: 0,
											borderRadius: "50%",
											background:
												"linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
										}}
									/>
									<div
										style={{
											position: "absolute",
											inset: 0,
											borderRadius: "50%",
											background:
												"linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.4) 100%)",
										}}
									/>
								</div>
							</div>
						) : (
							<div
								style={{
									width: "100%",
									height: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "4rem",
								}}
							>
								{celestial.type === "star"
									? "⭐"
									: celestial.type === "satellite"
									? "🌙"
									: "🌍"}
							</div>
						)}
					</div>

					{/* タイプバッジ */}
					<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
						<span
							style={{
								display: "inline-block",
								padding: "0.5rem 1rem",
								background:
									"linear-gradient(135deg, rgba(147,51,234,0.2) 0%, rgba(59,130,246,0.2) 100%)",
								color: "#a78bfa",
								fontSize: "0.875rem",
								fontWeight: "600",
								borderRadius: "9999px",
								border: "1px solid rgba(147,51,234,0.3)",
								backdropFilter: "blur(10px)",
								boxShadow: "0 0 20px rgba(147,51,234,0.3)",
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
					<div
						style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
					>
						<p
							style={{
								color: "#d1d5db",
								lineHeight: "1.75",
								fontSize: "1.125rem",
								margin: 0,
							}}
						>
							{celestial.description}
						</p>
					</div>

					{/* 追加情報（将来の拡張用） */}
					<div
						style={{
							paddingTop: "1rem",
							borderTop: "1px solid rgba(59,130,246,0.2)",
						}}
					>
						<p
							style={{
								fontSize: "0.875rem",
								color: "#6b7280",
								margin: 0,
								fontStyle: "italic",
							}}
						>
							※ より詳しい情報は今後追加予定です
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CelestialModal;
