import { useEffect, useRef } from "react";
import { getViewerState } from "./getViewerState";

export const useCanvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const el = canvasRef.current;
		if (el) {
			const { animate, renderer } = getViewerState(el);
			renderer.setAnimationLoop(animate);
		}
	}, []);

	return {
		canvasRef,
	};
};
