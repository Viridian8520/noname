import { lib, get, _status, ui, game, ai } from "./noname.js";

export const CONFIG = {
	version: {
		nopointer: true,
		clear: true,
		name: "更新日期: 2025-2-23",
	},
	github: {
		clear: true,
		name: '<span style="text-decoration: underline;">点击前往项目Github地址<span>',
		onclick(item) {
			window.open("https://github.com/Viridian8520/noname");
		},
	},
	videoBg: {
		name: "视频背景",
		init: true,
		intro: "开启视频背景",
	},
};
