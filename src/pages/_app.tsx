import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
	return (
		<main
			className={
				"min-h-screen bg-gradient-to-br px-2 from-indigo-950 via-slate-900 to-purple-950 text-white p-6" +
				inter.className
			}
		>
			<Navbar />
			<Component {...pageProps} />
		</main>
	);
}
