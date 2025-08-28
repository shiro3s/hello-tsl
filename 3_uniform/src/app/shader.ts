import {
	abs,
	Fn,
	fract,
	length,
	max,
	positionLocal,
	pow,
	sin,
	time,
	vec3,
} from "three/tsl";
import { Node } from "three/webgpu";
import { getGui } from "./gui";

export const getShader = () => {
	const { radius, zoom, layerZoom, rings, intensity, colors } = getGui();

	const main = Fn(() => {
		const p = positionLocal.toVar();
		p.mulAssign(zoom);

		const finalColors = vec3().toVar();
		for (let i = 0; i < 3; i += 1) {
			p.mulAssign(sin(i).add(layerZoom));
			p.assign(fract(p).sub(0.5));

			const distance = length(p);
			distance.assign(sin(distance.mul(rings).sub(time)));
			distance.assign(abs(distance));
			distance.assign(pow(radius.div(distance), intensity));

			const node = i as unknown as Node;
			finalColors.assign(max(finalColors, colors.element(node).mul(distance)));
		}

		return finalColors;
	});

	return {
		backgroundShader: main(),
	};
};
