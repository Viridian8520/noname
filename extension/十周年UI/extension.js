import { ChildNodesWatcher } from "../../noname/library/cache/childNodesWatcher.js";
import { nonameInitialized } from "../../noname/util/index.js";
import { lib, game, ui, get, ai, _status } from "../../noname.js";
import { config as mainConfig } from "./main/config.js";
import { precontent as mainPrecontent } from "./main/precontent.js";
import { content as mainContent } from "./main/content.js";
export const type = "extension";
export default async function () {
	const { name, ...otherInfo } = await lib.init.promises.json(`${lib.assetURL}extension/十周年UI/info.json`);
	const decadeUIName = (window.decadeUIName = name);
	const decadeUIPath = (window.decadeUIPath = `${lib.assetURL}extension/${decadeUIName}/`);
	const decadeUIResolvePath = (window.decadeUIResolvePath = `${nonameInitialized}extension/${decadeUIName}/`);
	return {
		name,
		editable: false,
		content: mainContent,
		precontent: mainPrecontent,
		config: mainConfig,
		package: (() => {
			const pkg = {
				character: {
					character: {},
					translate: {},
				},
				card: {
					card: {},
					translate: {},
					list: [],
				},
				skill: {
					skill: {},
					translate: {},
				},
			};
			const pack = {
				...pkg,
				...otherInfo,
			};
			pack.intro = (pack => {
				let log = [
					`十周年UI 当前版本号${pack.version}`,
					"适配本体：v1.10.17.5 待定",
					"bugfix 待定",
					"函数跟进 待定",
					"UI界面调整",
					"玩家现在可以自由调整卡牌大小",
					"",
				];
				return `<a href="javascript:void(0)" onclick="navigator.clipboard.writeText('https://github.com/diandian157/decadeUI').then(() => alert('已成功复制，粘贴到浏览器打开，部分进不去需要翻墙'))">点击复制十周年UIGithub仓库地址</a><br><p style="color:rgb(210,210,000); font-size:12px; line-height:14px; text-shadow: 0 0 2px black;">${log.join("<br>•")}</p>`;
			})(pack);
			return pack;
		})(),
		files: {
			character: [],
			card: [],
			skill: [],
			audio: [],
		},
	};
}
