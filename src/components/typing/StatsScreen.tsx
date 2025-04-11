import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

const calculateTrendline = (
	data: number[],
): { slope: number; intercept: number } => {
	const n = data.length;
	if (n <= 1) return { slope: 0, intercept: data[0] || 0 };

	const xValues = Array.from({ length: n }, (_, i) => i);
	const xSum = xValues.reduce((sum, x) => sum + x, 0);
	const ySum = data.reduce((sum, y) => sum + y, 0);
	const xySum = xValues.reduce((sum, x, i) => sum + x * data[i], 0);
	const xSquaredSum = xValues.reduce((sum, x) => sum + x * x, 0);

	const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
	const intercept = (ySum - slope * xSum) / n;

	return { slope, intercept };
};

const generateTrendlineData = (
	data: number[],
	projectionPoints: number = 3,
): number[] => {
	const { slope, intercept } = calculateTrendline(data);
	const result = data.map((_, i) => intercept + slope * i);

	for (let i = data.length; i < data.length + projectionPoints; i++) {
		result.push(intercept + slope * i);
	}

	return result;
};

export default function StatsScreen() {
	const [stats, setStats] = useState<
		{ wpm: number; accuracy: number; time: number }[]
	>([]);
	const completed = stats.length;

	useEffect(() => {
		setStats(JSON.parse(localStorage.getItem("history") || "[]"));
	}, []);

	const wpm = useMemo(() => {
		if (completed === 0) return 0;
		const totalWPM = stats.reduce(
			(acc: number, stat: { wpm: number }) => acc + stat.wpm,
			0,
		);
		return Math.floor(totalWPM / completed);
	}, [completed, stats]);

	const accuracy = useMemo(() => {
		if (completed === 0) return 0;
		const totalAccuracy = stats.reduce(
			(acc: number, stat: { accuracy: number }) => acc + stat.accuracy,
			0,
		);
		return Math.floor(totalAccuracy / completed);
	}, [completed, stats]);

	const chartData = useMemo(() => {
		const labels = stats.map((_, idx) => `Test ${idx + 1}`);

		const wpmValues = stats.map((stat) => stat.wpm);
		const accuracyValues = stats.map((stat) => stat.accuracy);

		return {
			wpmData: {
				labels,
				datasets: [
					{
						label: "WPM",
						data: wpmValues,
						borderColor: "rgb(56, 189, 248)", // cyan-400
						backgroundColor: "rgba(56, 189, 248, 0.5)",
						tension: 0.2,
					},
					{
						label: "Trend",
						data: generateTrendlineData(wpmValues),
						borderColor: "rgb(34, 197, 94)", // green-500
						backgroundColor: "rgba(34, 197, 94, 0.5)",
						borderDash: [10, 10],
						tension: 0.2,
					},
				],
			},
			accuracyData: {
				labels,
				datasets: [
					{
						label: "Accuracy (%)",
						data: accuracyValues,
						borderColor: "rgb(34, 211, 238)", // cyan-300
						backgroundColor: "rgba(34, 211, 238, 0.5)",
						tension: 0.2,
					},
					{
						label: "Trend",
						data: generateTrendlineData(accuracyValues),
						borderColor: "rgb(34, 197, 94)", // green-500
						backgroundColor: "rgba(34, 197, 94, 0.5)",
						borderDash: [10, 10],
						tension: 0.2,
					},
				],
			},
		};
	}, [stats]);

	// Chart options
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
				labels: {
					color: "rgb(165, 243, 252)", // cyan-200
				},
			},
			title: {
				display: true,
				color: "rgb(165, 243, 252)", // cyan-200
			},
		},
		scales: {
			y: {
				ticks: { color: "rgb(165, 243, 252)" }, // cyan-200
				grid: { color: "rgba(165, 243, 252, 0.1)" },
				title: {
					display: true,
					text: "WPM",
					color: "rgb(165, 243, 252)", // cyan-200
					font: {
						size: 16,
					},
				},
			},
			x: {
				ticks: { color: "rgb(165, 243, 252)", display: false }, // cyan-200
				grid: { color: "rgba(165, 243, 252, 0.1)" },
			},
		},
	};

	return (
		<div className="max-w-xl w-full bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] mb-6">
			<h2 className="text-4xl font-bold text-cyan-200 mb-8 text-center">
				Typing Stats
			</h2>

			{/* Stats summary section */}
			<div className="grid grid-cols-3 gap-4 mb-8">
				<div className="text-center">
					<p className="text-cyan-200 uppercase font-semibold">
						Tests completed
					</p>
					<p className="text-3xl font-bold text-cyan-300">{completed}</p>
				</div>
				<div className="text-center">
					<p className="text-cyan-200 uppercase font-semibold">Average WPM</p>
					<p className="text-3xl font-bold text-cyan-300">{wpm}</p>
				</div>
				<div className="text-center">
					<p className="text-cyan-200 uppercase font-semibold">
						Average Accuracy
					</p>
					<p className="text-3xl font-bold text-cyan-300">{accuracy}%</p>
				</div>
			</div>

			{/* Charts section */}
			{completed > 0 ? (
				<div className="space-y-8">
					<div className="h-64">
						<Line
							options={{
								...chartOptions,
								plugins: {
									...chartOptions.plugins,
									title: {
										...chartOptions.plugins.title,
										text: "Words Per Minute",
										font: {
											size: 20,
										},
									},
								},
							}}
							data={chartData.wpmData}
						/>
					</div>

					<div className="h-64 mb-10">
						<Line
							options={{
								...chartOptions,
								plugins: {
									...chartOptions.plugins,
									title: {
										...chartOptions.plugins.title,
										text: "Accuracy History",
										font: {
											size: 20,
										},
									},
								},
								scales: {
									...chartOptions.scales,
									y: {
										...chartOptions.scales.y,
										title: {
											...chartOptions.scales.y.title,
											text: "Accuracy (%)",
										},
									},
								},
							}}
							data={chartData.accuracyData}
						/>
					</div>
				</div>
			) : (
				<p className="text-center text-cyan-200">
					Complete some typing tests to see your progress charts
				</p>
			)}
		</div>
	);
}
