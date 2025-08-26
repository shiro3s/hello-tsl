import {
	BoxGeometry,
	Mesh,
	PerspectiveCamera,
	Scene,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import {  positionLocal } from "three/tsl";
import { NodeMaterial, WebGPURenderer } from "three/webgpu";

export const getViewerState = (el: HTMLCanvasElement) => {
	const { innerWidth, innerHeight } = window;

	const aspect = innerWidth / innerHeight;

	// camera
	const camera = new PerspectiveCamera(75, aspect, 0.1, 10);
	camera.position.set(0, 1.5, 0);
	camera.lookAt(0, 0, 0);

	// renderer
	const renderer = new WebGPURenderer({ canvas: el, antialias: true });
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	// scene
	const scene = new Scene();

	const controller = new OrbitControls(camera, renderer.domElement);
	controller.enableDamping = true

	const material = new NodeMaterial();
	// positionLocal: フラグメントシェーダーの現在野市座標を取得
	material.fragmentNode = positionLocal.mul(4.99).fract().step(0.5);

	const geometry = new BoxGeometry();
	const mesh = new Mesh(geometry, material);
	scene.add(mesh);

	// debug
	renderer.debug.getShaderAsync(scene, camera, mesh).then((e) => {
		console.log(e.vertexShader); // 頂点情報
		console.log(e.fragmentShader); // 色の出力管理
	})

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
