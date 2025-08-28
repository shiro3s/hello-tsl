import {
	Mesh,
	PerspectiveCamera,
	PlaneGeometry,
	Raycaster,
	Scene,
	Vector2,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { NodeMaterial, WebGPURenderer } from "three/webgpu";
import { getShader } from "./shader";

export const setupViewer = (el: HTMLCanvasElement) => {
	const { innerWidth, innerHeight } = window;

	const aspect = innerWidth / innerHeight;

	// camera
	const camera = new PerspectiveCamera(75, aspect, 0.1, 10);
	camera.position.set(0, 0, 1.5);

	// renderer
	const renderer = new WebGPURenderer({ canvas: el, antialias: true });
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	// scene
	const scene = new Scene();

	// controller
	const controller = new OrbitControls(camera, renderer.domElement);
	controller.enableDamping = true;

	// material
	const { shaderFragment, pointer, radius } = getShader();
	const material = new NodeMaterial();
	material.fragmentNode = shaderFragment;

	const geometry = new PlaneGeometry(2, 2);
	const mesh = new Mesh(geometry, material);
	mesh.name = "mesh";
	scene.add(mesh);

	// raycaster
	const raycaster = new Raycaster();
	const mouse = new Vector2();

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
		raycaster,
		mouse,
		pointer,
		radius,
	};
};

export type ViewerType = ReturnType<typeof setupViewer>;
