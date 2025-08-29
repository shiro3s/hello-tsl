import { Color, Vector3 } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { uniform } from "three/tsl";

const options = {
	zoom: 0,
	maxSteps: 256,
	surfaceDistance: 0.0001,
	cameraNear: 0.1,
	cameraFar: 128.0,
	ambientStrength: 0.01,
	shininess: 32,
	specularStrength: 0.5,
	diffuseColor: new Color(0.1, 0.4, 1.0),
	specularColor: new Color(1.0, 0.05, 0.3),
	ambientColor: new Color(0.2, 1, 0.2),
	shadowSoftness: 20,
	shadowIntensity: 0.1,
	shadowMaxSteps: 256,
	shadowFar: 128,
};
export const getGui = () => {
	const gui = new GUI();

	// uniform
	const camPos = uniform(new Vector3());
	const camTarget = uniform(new Vector3());
	const zoom = uniform(options.zoom);
	const maxSteps = uniform(options.maxSteps);
	const surfaceDistance = uniform(options.surfaceDistance);
	const cameraNear = uniform(options.cameraNear);
	const cameraFar = uniform(options.cameraFar);
	const ambientStrength = uniform(options.ambientStrength);
	const shininess = uniform(options.shininess);
	const specularStrength = uniform(options.specularStrength);
	const specularColor = uniform(options.specularColor);
	const diffuseColor = uniform(options.diffuseColor);
	const ambientColor = uniform(options.ambientColor);
	const shadowSoftness = uniform(options.shadowSoftness);
	const shadowIntensity = uniform(options.shadowIntensity);
	const shadowMaxSteps = uniform(options.shadowMaxSteps);
	const shadowFar = uniform(options.shadowFar);

	const raymarchFolder = gui.addFolder("Raymarching");
	raymarchFolder
		.add(options, "zoom", 0, 10, 0.001)
		.name("Zoom")
		.onChange((v) => {
			zoom.value = v;
		});
	raymarchFolder
		.add(options, "maxSteps", 1, 512, 1)
		.name("Raymarch Max Steps")
		.onChange((v) => {
			maxSteps.value = v;
		});
	raymarchFolder
		.add(options, "surfaceDistance", 0, 0.001, 0.0001)
		.name("Surface Distance")
		.onChange((v) => {
			surfaceDistance.value = v;
		});
	raymarchFolder
		.add(options, "cameraNear", 0.0001, 10, 0.1)
		.name("Camera Near")
		.onChange((v) => {
			cameraNear.value = v;
		});
	raymarchFolder
		.add(options, "cameraFar", 1, 512, 0.1)
		.name("Camera Far")
		.onChange((v) => {
			cameraFar.value = v;
		});
	raymarchFolder.close();

	const lightingFolder = gui.addFolder("Lighting");
	lightingFolder
		.add(options, "ambientStrength", 0, 0.2, 0.01)
		.name("Ambient Strength")
		.onChange((v) => {
			ambientStrength.value = v;
		});
	lightingFolder
		.add(options, "shininess", 0, 100, 0.1)
		.name("Shininess")
		.onChange((v) => {
			shininess.value = v;
		});
	lightingFolder
		.add(options, "specularStrength", 0, 1, 0.01)
		.name("SpecularStrength")
		.onChange((v) => {
			specularStrength.value = v;
		});
	lightingFolder.addColor(options, "diffuseColor");
	lightingFolder.addColor(options, "specularColor");
	lightingFolder.addColor(options, "ambientColor");
	lightingFolder.close();

	const shadowFolder = gui.addFolder("Shadows");
	shadowFolder
		.add(options, "shadowSoftness", 0, 100, 0.01)
		.name("Shadow Softness")
		.onChange((v) => {
			shadowSoftness.value = v;
		});
	shadowFolder
		.add(options, "shadowIntensity", 0, 1, 0.01)
		.name("Shadow Intensity")
		.onChange((v) => {
			shadowIntensity.value = v;
		});
	shadowFolder
		.add(options, "shadowMaxSteps", 1, 512, 0.1)
		.name("Shadow Max Steps")
		.onChange((v) => {
			shadowMaxSteps.value = v;
		});
	shadowFolder
		.add(options, "shadowFar", 1, 512, 0.1)
		.name("Shadow Far")
		.onChange((v) => {
			shadowFar.value = v;
		});
	shadowFolder.close();


  return {
    camPos,
    camTarget,
    zoom,
    cameraNear,
    cameraFar,
    maxSteps,
    surfaceDistance,
    shadowMaxSteps,
    shadowSoftness,
    shadowFar,
    shadowIntensity,
    ambientColor,
    ambientStrength,
    specularStrength,
    specularColor,
    diffuseColor
  }
};
