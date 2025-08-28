import { useEffect, useRef } from "react";
import { events } from "./event";
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
				mouse,
				pointer,
				radius,
				raycaster,
				camera,
				scene,
			} = setupViewer(el);

			const { handlePointerMove } = events({
				mouse,
				pointer,
				raycaster,
				radius,
				camera,
				scene,
				coords: coordsRef,
			});

			renderer.setAnimationLoop(animate);
			renderer.domElement.addEventListener("pointermove", handlePointerMove);
			return () => {
				renderer.domElement.removeEventListener(
					"pointermove",
					handlePointerMove,
				);
			};
		}
	}, []);

	return {
		canvasRef,
		coordsRef,
	};
};
