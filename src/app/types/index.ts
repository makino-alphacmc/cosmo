// 座標型
export interface Position {
	top: string;
	left: string;
}

// 天体型
export interface CelestialBody {
	id: string;
	name: string;
	type: "planet" | "satellite" | "star" | "asteroid";
	position: Position;
	image: string;
	description: string;
}

// モーダル状態型
export interface ModalState {
	isOpen: boolean;
	celestial: CelestialBody | null;
}
