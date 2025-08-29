import OperatorNode from "three/src/nodes/math/OperatorNode.js";
import { ShaderCallNodeInternal } from "three/src/nodes/TSL.js";
import {
	abs,
	Break,
	clamp,
	cos,
	cross,
	dot,
	Fn,
	float,
	If,
	Loop,
	length,
	max,
	min,
	normalize,
	positionLocal,
	pow,
	reflect,
	ShaderNodeObject,
	shininess,
	sin,
	time,
	vec2,
	vec3,
} from "three/tsl";
import { ConstNode, Node, VarNode, Vector3 } from "three/webgpu";
import { getGui } from "./gui";

export const getShader = () => {
	const {
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
		diffuseColor,
	} = getGui();

	const rotateAroundAxis = (
		position: ShaderNodeObject<OperatorNode>,
		axis: ShaderNodeObject<ConstNode<Vector3>>,
		radians: number,
	) => {
		const fn = Fn(() => {
			const _axis = normalize(axis);
			const cosTheta = cos(radians);
			const sinTheta = sin(radians);

			const rotatedPoint = position
				.mul(cosTheta)
				.add(cross(axis, position).mul(sinTheta))
				.add(axis.mul(dot(axis, position).mul(cosTheta.oneMinus())));

			return rotatedPoint;
		});
		return fn();
	};

	const Box = (
		position: ShaderNodeObject<ShaderCallNodeInternal>,
		dimensions: ShaderNodeObject<ConstNode<Vector3>>,
	) => {
		const fn = Fn(() => {
			const distance = abs(position).sub(dimensions);
			return length(max(distance, 0.0)).add(
				min(max(distance.x, max(distance.y, distance.z)), 0.0),
			);
		});

		return fn();
	};

	const Sphere = (position: ShaderNodeObject<OperatorNode>, radius: number) => {
		const fn = Fn(() => {
			return length(position).sub(radius);
		});
		return fn();
	};

	const sdfScene = (position: ShaderNodeObject<VarNode | OperatorNode>) => {
		const fn = Fn(() => {
			const t = 0;
			const floor = position.y;
			const sphere = Sphere(position.sub(vec3(1.5, 1, 1.5)), 1);
			const box = Box(
				rotateAroundAxis(position.sub(vec3(1.5, 1, -1.5)), vec3(1, 1, 0), t),
				vec3(1),
			);

			const distance = floor.toVar();
			distance.assign(min(distance, sphere));
			distance.assign(min(distance, box));

			return distance;
		});

		return fn();
	};

	const getNormal = (
		position: ShaderNodeObject<VarNode>,
		distance: ShaderNodeObject<VarNode>,
	) => {
		const fn = Fn(() => {
			const offset = vec2(0.0025, 0);

			return normalize(
				distance.sub(
					vec3(
						sdfScene(position.sub(offset.xyy)),
						sdfScene(position.sub(offset.yxy)),
						sdfScene(position.sub(offset.yyx)),
					),
				),
			);
		});

		return fn();
	};

	const shadowMarcher = (
		rayOrigin: ShaderNodeObject<OperatorNode>,
		rayDirection: ShaderNodeObject<Node>,
	) => {
		const fn = Fn(() => {
			const shadow = float(1).toVar();
			const accumulatedDistance = float(cameraNear).toVar();

			Loop({ start: 0, end: shadowMaxSteps }, () => {
				const distance = sdfScene(
					rayOrigin.add(rayDirection.mul(accumulatedDistance)),
				);

				If(abs(distance).lessThan(surfaceDistance), () => {
					shadow.assign(0);
					Break();
				}).Else(() => {
					shadow.assign(
						min(shadow, shadowSoftness.mul(distance).div(accumulatedDistance)),
					);
					accumulatedDistance.addAssign(
						clamp(distance, surfaceDistance, 0.025),
					);

					If(accumulatedDistance.greaterThan(shadowFar), () => {
						Break();
					});
				});
			});

			return shadow;
		});
		return fn();
	};

	const main = Fn(() => {
		const p = positionLocal;
		const rayOrigin = camPos;
		const lookAt = camTarget;

		const forward = normalize(lookAt.sub(rayOrigin));
		const rayDirection = normalize(p.add(forward.mul(zoom)));

		const accumulatedDistance = float(cameraNear).toVar();
		const distance = float(0).toVar();
		const position = vec3(0).toVar();

		Loop({ start: 0, end: maxSteps }, () => {
			position.assign(rayOrigin.add(rayDirection.mul(accumulatedDistance)));
			distance.assign(sdfScene(position));

			If(
				abs(distance)
					.lessThan(surfaceDistance)
					.or(accumulatedDistance.greaterThan(cameraFar)),
				() => {
					Break();
				},
			);

			accumulatedDistance.addAssign(distance);
		});

		const finalColor = vec3(0).toVar();
		If(accumulatedDistance.lessThan(cameraFar), () => {
			const normal = getNormal(position, distance).toVar();

			const lightPosition = vec3(sin(time).mul(5), 3, cos(time).mul(5));
			const lightDirection = normalize(lightPosition.sub(position));
			const diffuse = clamp(dot(normal, lightDirection), 0, 1).toVar();

			const shadow = shadowMarcher(
				position.add(normal.mul(surfaceDistance)),
				vec3(lightDirection),
			);
			shadow.assign(max(shadowIntensity, shadow));
			diffuse.mulAssign(shadow);

			const ambient = vec3(1).mul(ambientStrength);
			const viewDireaction = normalize(rayOrigin.sub(position));
			const shineDirection = reflect(lightDirection.negate(), normal);

			const specularIntensity = pow(
				clamp(dot(viewDireaction, shineDirection), 0.0, 1.0),
				shininess,
			).mul(specularStrength);

			const specularComponent = specularColor.mul(specularIntensity);

			finalColor.assign(
				ambientColor
					.mul(ambient)
					.add(diffuseColor.mul(diffuse))
					.add(specularComponent),
			);
		});
		return finalColor;
	});

	return {
		camPos,
		camTarget,
		backgroundShader: main(),
	};
};
