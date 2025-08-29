import { useEffect, useRef } from "react";
import { setupViewer } from "./setupViewer";

export const useCanvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const coordsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = canvasRef.current;
		if (el) {
			const {
				animate,
				renderer,
			} = setupViewer(el);

			renderer.setAnimationLoop(animate);
		}
	}, []);

	return {
		canvasRef,
		coordsRef,
	};
};
