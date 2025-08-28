import {
	Fn,
	length,
	positionLocal,
	ShaderNodeObject,
	uniform,
	vec2,
	vec3,
} from "three/tsl";
import { Node } from "three/webgpu";

export const getShader = () => {
	const pointer = uniform(vec2(0, 1));
	const Circle = (position: ShaderNodeObject<Node>, radius: number) =>
		Fn(() => {
			return length(position).sub(radius);
		});

	const radius = 0.5;
	const main = Fn(() => {
		const p = positionLocal.xy;
		const circle = Circle(p, radius)();
		const finalColor = vec3(1).mul(circle);
		return finalColor;
	});

	return {
		pointer,
		radius,
		shaderFragment: main(),
	};
};
