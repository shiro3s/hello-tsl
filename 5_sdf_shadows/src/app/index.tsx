import React from "react";
import styles from "./style.module.css";
import { useCanvas } from "./useCanvas";

export const App: React.FC = () => {
	const { canvasRef, coordsRef } = useCanvas();

	return (
		<>
			<canvas ref={canvasRef} className={styles.canvas} />
			<div ref={coordsRef} className={styles.coords} />
		</>
	);
};
