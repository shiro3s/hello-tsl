import {
	Mesh,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
} from "three";
import { color } from "three/tsl";
import { NodeMaterial, WebGPURenderer } from "three/webgpu";

export const getViewerState = (el: HTMLCanvasElement) => {
	const { innerWidth, innerHeight } = window;

	const aspect = innerWidth / innerHeight;

	// camera
	const camera = new PerspectiveCamera(75, aspect, 0.1, 10);
	camera.position.z = 1;
	camera.lookAt(0, 0, 0);

	// renderer
	const renderer = new WebGPURenderer({ canvas: el, antialias: true });
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	// scene
	const scene = new Scene();

	const material = new NodeMaterial();
	material.fragmentNode = color("#ed1c24");

	const geometry = new PlaneGeometry();
	const mesh = new Mesh(geometry, material);

	scene.add(mesh);

	const animate = () => {
		renderer.render(scene, camera);
	};

	return {
		camera,
		scene,
		renderer,
		animate,
	};
};
