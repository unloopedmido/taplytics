interface FinishScreenProps {
	time: number;
	stats: { wpm: number; accuracy: number };
	wordsCount: number;
	startGame: () => void;
	handleGoBack: () => void;
}

export default function FinishScreen(props: FinishScreenProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-indigo-950/80 backdrop-blur-sm">
			<div className="w-full max-w-md bg-gradient-to-b from-slate-800 to-indigo-900 rounded-3xl p-8 border border-white/10 shadow-[0_20px_80px_-15px_rgba(79,70,229,0.45)]">
				<div className="mb-6 text-center">
					<h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
						Test Finished
					</h2>
					<p className="text-slate-400 mt-2">Here&apos;s how you performed</p>
				</div>

				<div className="grid grid-cols-2 gap-4 mb-8">
					<div className="rounded-xl bg-white/5 p-4 border border-white/5">
						<div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
							WPM
						</div>
						<div className="text-4xl font-bold text-white">
							{props.stats.wpm}
						</div>
					</div>

					<div className="rounded-xl bg-white/5 p-4 border border-white/5">
						<div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
							Accuracy
						</div>
						<div className="text-4xl font-bold text-white">
							{props.stats.accuracy}
							<span className="text-purple-300 text-2xl">%</span>
						</div>
					</div>

					<div className="rounded-xl bg-white/5 p-4 border border-white/5">
						<div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
							Time
						</div>
						<div className="text-4xl font-bold text-white">
							{props.time}
							<span className="text-cyan-300 text-2xl">s</span>
						</div>
					</div>

					<div className="rounded-xl bg-white/5 p-4 border border-white/5">
						<div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
							Words
						</div>
						<div className="text-4xl font-bold text-white">
							{props.wordsCount}
						</div>
					</div>
				</div>

				<div className="flex gap-4">
					<button
						onClick={() => props.handleGoBack()}
						className="w-full py-4 px-6 transition-colors bg-pink-600 hover:bg-pink-500 rounded-xl font-semibold text-lg relative overflow-hidden group"
					>
						Go Back
					</button>

					<button
						onClick={props.startGame}
						className="w-full py-4 px-6 transition-colors bg-purple-600 hover:bg-violet-500 rounded-xl font-semibold text-lg relative overflow-hidden group"
					>
						Try Again
					</button>
				</div>
			</div>
		</div>
	);
}
