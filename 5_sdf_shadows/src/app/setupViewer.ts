import { PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { WebGPURenderer } from "three/webgpu";
import { getShader } from "./shader";

export const setupViewer = (el: HTMLCanvasElement) => {
	const { innerWidth, innerHeight } = window;

	const aspect = innerWidth / innerHeight;

	// camera
	const camera = new PerspectiveCamera(53, aspect, 0.1, 10);
	camera.position.set(-5, 5, 4);

	// renderer
	const renderer = new WebGPURenderer({ canvas: el, antialias: true });
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	// scene
	const { backgroundShader, camPos, camTarget } = getShader();
	const scene = new Scene();
	scene.backgroundNode = backgroundShader;

	// controller
	const controller = new OrbitControls(camera, renderer.domElement);
	controller.target.y = 0.25;
	controller.enableDamping = true;

	// animate
	const animate = () => {
		controller.update();

		camPos.value.copy(camera.position);
		camTarget.value.copy(controller.target);
		renderer.render(scene, camera);
	};

	return {
		camera,
		scene,
		renderer,
		animate,
	};
};
