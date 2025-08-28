import { RefObject } from "react";
import { ViewerType } from "./setupViewer";

type Args = Pick<
	ViewerType,
	"mouse" | "raycaster" | "camera" | "scene" | "pointer" | "radius"
> & {
	coords: RefObject<HTMLDivElement | null>;
};

export const events = ({
	coords,
	mouse,
	raycaster,
	camera,
	scene,
	pointer,
	radius,
}: Args) => {
	const handlePointerMove = (ev: PointerEvent) => {
		if (!coords.current) return;

		const el = coords.current;
		const positionX = (ev.clientX / window.innerWidth) * 2 - 1;
		const positionY = -(ev.clientY / window.innerHeight) * 2 + 1;
		mouse.set(positionX, positionY);

		raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObjects(scene.children);
		intersects.forEach((intersect) => {
			if (intersect.object.name !== "mesh") return;

			const distance = intersect.uv;
			if (distance) {
				pointer.value.copy(distance);

				el.style.left = `${ev.pageX + 10}px`;
				el.style.top = `${ev.pageY + 10}px`;

				distance.x = distance.x * 2 - 1;
				distance.y = distance.y * 2 - 1;

				const color =
					Math.round(
						Math.min(Math.max(distance.length() - radius, 0), 1) * 1000,
					) / 1000;

				el.innerHTML =
					// フラグメントシェーダーが使用する位置座標
					"position&nbsp;:&nbsp;[" +
					Math.round(distance.x * 100) / 100 +
					",&nbsp;" +
					+Math.round(distance.y * 100) / 100 +
					"]<br/>length&nbsp;&nbsp;&nbsp;:&nbsp;" +
					// [0, 0] から座標までの長さ
					Math.round(distance.length() * 1000) / 1000 +
					"<br/>length-r&nbsp;:&nbsp;" +
					// 長さから半径(0.5)を引いた値
					Math.round((distance.length() - radius) * 1000) / 1000 +
					"<br/>colour&nbsp;&nbsp;&nbsp;:&nbsp;vec3(" +
					color +
					"," +
					color +
					"," +
					color +
					")";
			}
		});
	};

	return {
		handlePointerMove,
	};
};
