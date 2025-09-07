import { lib, game, ui, get, ai, _status } from "../extension/noname.js";
import characters from "./character.js";
import cards from "./card.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import characterFilters from "./characterFilter.js";
import characterReplaces from "./characterReplace.js";
import dynamicTranslates from "./dynamicTranslate.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";

export const characterPackFunc = function () {
	game.import("character", function (lib, game, ui, get, ai, _status) {
		const oobj = {
			name: "taffy_character",
			connect: true,
			character: { ...characters },
			characterSort: {
				taffy_character: characterSort,
			},
			characterSubstitute: {
				taffyold_huan_caoang: [["huan_caoang_shadow", []]],
				taffyold_ol_sb_dongzhuo: [
					["ol_sb_dongzhuo_shadow1", ["tempname:ol_sb_dongzhuo", "die:ol_sb_dongzhuo"]],
					["ol_sb_dongzhuo_shadow2", ["tempname:ol_sb_dongzhuo", "die:ol_sb_dongzhuo"]],
				],
				mutsumi: [["mortis"], []],
				mortis: [["mutsumi"], []],
				taffyold_pot_taishici: [
					["pot_taishici_shadow1", ["die:pot_taishici"]],
					["pot_taishici_shadow2", ["die:pot_taishici"]],
					["pot_taishici_shadow3", ["die:pot_taishici"]],
					["pot_taishici_shadow4", ["die:pot_taishici"]],
				],
				taffyold_pot_weiyan: [
					["pot_weiyan_achieve", []],
					["pot_weiyan_fail", []],
				],
				taffyold_pot_yuji: [["pot_yuji_shadow", []]],
				taffyold_sb_sp_zhugeliang: [["sb_zhugeliang", []]],
				taffyoldtwo_sb_sp_zhugeliang: [["sb_zhugeliang", []]],
			},
			characterFilter: { ...characterFilters },
			characterTitle: {
				taffyboss_xushao: "#gViridian",
				acetaffy: "#gViridian",
				minitaffy: "#gViridian",
				taffydc_xushao: "#gViridian",
				taffyhuiwan_xushao: "#gViridian",
				taffyold_tw_niufudongxie: "#gViridian",
				taffyshen_yuji: "#gViridian",
				junko: "#gViridian",
				taffyhuiwan_sunquan: "#gViridian",
				taffyhuiwanplus_sunquan: "#gViridian",
				taffyshen_duyu: "#gViridian",
				taffyshen_chengui: "#gViridian",
				taffyshendc_guanning: "#gViridian",
				taffyre_xushao: "#gViridian",
				taffyold_sb_caopi: "#gViridian",
				taffyold_wu_guanyu: "#gViridian",
				taffyold_dc_shen_huatuo: "#gViridian",
				taffyshen_xushao: "#gViridian",
				taffyold_tenggongzhu: "#gViridian",
				swimsuit_hoshino: "#gViridian",
				taffyre_xuyou: "#gViridian",
				himari: "#gViridian",
				taffyred_xin_jushou: "#gViridian",
				taffy_liubianxing: "#gViridian",
				mutsumi: "#gViridian",
				mortis: "#gViridian",
				taffyshen_shamoke: "#gViridian",
				taffyre_shamoke: "#gViridian",
				taffyzunxiang_xiahouxuan: "#gViridian",
				limulu: "#gLazysun Viridian",
			},
			dynamicTranslate: { ...dynamicTranslates },
			characterIntro: { ...characterIntros },
			characterReplace: { ...characterReplaces },
			card: { ...cards },
			skill: { ...skills },
			translate: { ...translates, ...voices, ...characterSortTranslate },
			pinyins: { ...pinyins },
		};
		const whiteList = new Set([...oobj.characterSort.taffy_character.taffy_old_ol, ...oobj.characterSort.taffy_character.taffy_old_mb, ...oobj.characterSort.taffy_character.taffy_old_dc, ...oobj.characterSort.taffy_character.taffy_old_etc, ...oobj.characterSort.taffy_character.taffy_mobile_changshi, "taffymb_shen_caocao", "taffyre_xuyou", "taffy_liubianxing", "taffyshen_shamoke", "taffyre_shamoke"]);
		["taffyold_baby_shen_simayi", "taffyold_wechat_ji_guanyu", "taffyold_wechat_ji_caocao", "taffyold_wechat_ji_zhugeliang", "taffyold_wechat_ji_sunce", "taffyoldtwo_yao_yuanshu"].forEach(i => {
			whiteList.delete(i);
		});
		const specialDetails = {
			taffydc_guanning: {
				character: "ext:永雏塔菲/image/character/taffydc_guanning.jpg",
				die: "die:../../extension/永雏塔菲/audio/die/taffydc_guanning.mp3",
			},
			taffyhuiwan_xushao: {
				character: "ext:永雏塔菲/image/character/taffyboss_xushao.jpg",
				die: "die:../../extension/永雏塔菲/audio/die/taffyboss_xushao.mp3",
			},
			taffyshen_yuji: {
				character: "ext:永雏塔菲/image/character/taffyshen_yuji.jpg",
				die: "die:yuji",
			},
			taffyhuiwan_sunquan: {
				character: "ext:永雏塔菲/image/character/taffyhuiwan_sunquan.jpg",
				die: "die:re_sunquan",
			},
			taffyhuiwanplus_sunquan: {
				character: "ext:永雏塔菲/image/character/taffyhuiwan_sunquan.jpg",
				die: "die:re_sunquan",
			},
			taffyold_baby_shen_simayi: {
				character: "ext:永雏塔菲/image/character/taffyold_baby_shen_simayi.jpg",
				die: "die:shen_simayi",
			},
			taffyshen_duyu: {
				character: "ext:永雏塔菲/image/character/taffyshen_duyu.jpg",
				die: "die:sp_duyu",
			},
			taffyshen_chengui: {
				character: "ext:永雏塔菲/image/character/taffyshen_chengui.jpg",
				die: "die:../../extension/永雏塔菲/audio/die/taffyshen_chengui.mp3",
			},
			taffyre_xushao: {
				character: "ext:永雏塔菲/image/character/taffyre_xushao.jpg",
				die: "die:../../extension/永雏塔菲/audio/die/taffydc_xushao.mp3",
			},
			taffyshen_xushao: {
				character: "ext:永雏塔菲/image/character/taffyboss_xushao.jpg",
				die: "die:../../extension/永雏塔菲/audio/die/taffyboss_xushao.mp3",
			},
			swimsuit_hoshino: {
				character: "ext:永雏塔菲/image/character/swimsuit_hoshino.jpg",
				die: "die:../../extension/永雏塔菲/audio/die/swimsuit_hoshino.ogg",
			},
			himari: {
				character: "ext:永雏塔菲/image/character/himari.jpg",
				die: "die:../../extension/永雏塔菲/audio/die/himari.ogg",
			},
			mutsumi: {
				character: "ext:永雏塔菲/image/character/mutsumi.png",
				die: "die:../../extension/永雏塔菲/audio/die/mutsumi.mp3",
			},
			mortis: {
				character: "ext:永雏塔菲/image/character/mortis.png",
				die: "die:../../extension/永雏塔菲/audio/die/mortis.mp3",
			},
		};
		const specialList = Object.keys(specialDetails);
		for (let i in oobj.character) {
			if (whiteList.has(i)) continue;
			if (specialList.includes(i)) {
				if (oobj.character[i][4]) {
					oobj.character[i][4].push(specialDetails[i].character, specialDetails[i].die);
				} else {
					oobj.character[i].splice(4, 0, [specialDetails[i].character, specialDetails[i].die]);
				}
				continue;
			}
			if (oobj.character[i][4]) {
				oobj.character[i][4].push("ext:永雏塔菲/image/character/" + i + ".jpg", "die:../../extension/永雏塔菲/audio/die/" + i + ".mp3");
			} else {
				oobj.character[i].splice(4, 0, ["ext:永雏塔菲/image/character/" + i + ".jpg", "die:../../extension/永雏塔菲/audio/die/" + i + ".mp3"]);
			}
		}
		for (let i in oobj.skill) {
			if (typeof oobj.skill[i].audio === "number") {
				oobj.skill[i].audio = `ext:永雏塔菲/audio/skill/:${oobj.skill[i].audio}`;
			}
		}
		return oobj;
	});
};
