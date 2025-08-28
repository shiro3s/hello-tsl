import { PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { WebGPURenderer } from "three/webgpu";
import { getShader } from "./shader";

export const setupViewer = (el: HTMLCanvasElement) => {
	const { innerWidth, innerHeight } = window;

	const aspect = innerWidth / innerHeight;

	// camera
	const camera = new PerspectiveCamera(53, aspect, 0.1, 10);
	camera.position.set(0, 0, 1);

	// renderer
	const renderer = new WebGPURenderer({ canvas: el, antialias: true });
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	// scene
	const scene = new Scene();
	const { backgroundShader } = getShader();
	scene.backgroundNode = backgroundShader;

	const controller = new OrbitControls(camera, renderer.domElement);
	controller.target.set(1, -1, 0);
	controller.enableDamping = true;

	// animate
	const animate = () => {
		controller.update();
		renderer.render(scene, camera);
	};

	return {
		camera,
		scene,
		renderer,
		animate,
	};
};
