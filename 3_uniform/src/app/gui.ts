import { Color } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { uniform, uniformArray } from "three/tsl";

const options = {
	radius: 0.1,
	intensity: 2.0,
	zoom: 5.0,
	layerZoom: 0.5,
	rings: 10,
	colors: [
		new Color(1.0, 0.05, 0.3),
		new Color(0.1, 0.4, 1.0),
		new Color(0.2, 1, 0.2),
	],
};

export const getGui = () => {
	const gui = new GUI();

  // uniform: フラグメントシェーダーの外部で作成・使用出来る変数
  // 各フラグメントが処理されるたびに、その時点の値の同一のコピーが保持される
	const radius = uniform(options.radius);
	const intensity = uniform(options.intensity);
	const zoom = uniform(options.zoom);
	const layerZoom = uniform(options.layerZoom);
	const rings = uniform(options.rings);
	const colors = uniformArray(options.colors);

	gui.add(options, "radius", 0, 1, 0.01).onChange((v) => {
		radius.value = v;
	});
	gui.add(options, "intensity", 0, 10, 0.01).onChange((v) => {
		intensity.value = v;
	});
	gui.add(options, "zoom", 0.2, 50, 0.01).onChange((v) => {
		zoom.value = v;
	});
	gui.add(options, "layerZoom", 0.1, 2, 0.01).onChange((v) => {
		layerZoom.value = v;
	});
	gui.add(options, "rings", 0, 50, 0.01).onChange((v) => {
		rings.value = v;
	});
	gui.addColor(options.colors, 0);
	gui.addColor(options.colors, 1);
	gui.addColor(options.colors, 2);

	return {
		gui,
		options,
		radius,
		intensity,
		zoom,
		layerZoom,
		rings,
		colors,
	};
};
