import Link from "next/link";

export default function Navbar() {
	return (
		<header className="p-4 flex justify-between items-center mb-12">
			<div className="flex items-center">
				<Link
					href="/"
					className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400"
				>
					taply<span className="text-white">tics</span>
				</Link>
			</div>
		</header>
	);
}
