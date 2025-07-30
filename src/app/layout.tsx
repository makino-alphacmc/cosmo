import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "CosmoMap - 宇宙地図アプリ",
	description: "宇宙の天体を視覚的に探索できるインタラクティブな地図アプリ",
	keywords: "宇宙, 惑星, 天体, 地図, 教育, 学習",
	authors: [{ name: "CosmoMap Team" }],
	openGraph: {
		title: "CosmoMap - 宇宙地図アプリ",
		description: "宇宙の天体を視覚的に探索できるインタラクティブな地図アプリ",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body className={`${inter.className} bg-black text-white`}>
				{children}
			</body>
		</html>
	);
}
