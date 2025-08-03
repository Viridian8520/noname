import { lib, get, _status, ui, game, ai } from "./noname.js";

export const CONTENT = function (config, pack) {
	const characterList = Object.keys(lib.characterPack.taffy_character);
	// 武将评级：垃圾junk，精品rare，史诗epic，传说legend
	lib.rank.rarity.legend.addArray(characterList);
	// 适配千幻聆音换肤
	if (!lib.qhlypkg) {
		lib.qhlypkg = [];
	}
	lib.qhlypkg.push(
		{
			isExt: false,
			filterCharacter: function (name) {
				if (characterList.includes(name) && !lib.characterSort.taffy_character.taffy_old_ol.includes(name) && !lib.characterSort.taffy_character.taffy_old_mb.includes(name) && !lib.characterSort.taffy_character.taffy_old_dc.includes(name) && !lib.characterSort.taffy_character.taffy_old_etc.includes(name) && name !== "taffymb_shen_caocao") return true;
			},
			isLutou: lib.config.xwLutou,
			prefix: "extension/永雏塔菲/image/character/",
			lutouPrefix: "extension/永雏塔菲/image/character/lutou/",
			skin: {
				standard: "extension/永雏塔菲/skin/standard/",
				lutou: "extension/永雏塔菲/skin/lutou/",
			},
			audioOrigin: "extension/永雏塔菲/audio/",
			audio: "extension/永雏塔菲/skin/audio/",
		},
		{
			isExt: false,
			filterCharacter: function (name) {
				if (!characterList.includes(name) || lib.characterSort.taffy_character.taffy_old_ol.includes(name) || lib.characterSort.taffy_character.taffy_old_mb.includes(name) || lib.characterSort.taffy_character.taffy_old_dc.includes(name) || lib.characterSort.taffy_character.taffy_old_etc.includes(name) || name === "taffymb_shen_caocao") return true;
			},
			isLutou: lib.config.xwLutou,
			prefix: "image/character/",
			lutouPrefix: "extension/永雏塔菲/image/character/lutou/",
			skin: {
				standard: "extension/永雏塔菲/skin/standard/",
				lutou: "extension/永雏塔菲/skin/lutou/",
			},
			audioOrigin: "audio/die/",
			audio: "extension/永雏塔菲/skin/audio/",
		}
	);
	// 武将配音audioname2添加
	const setAudioname2 = function (skills, map) {
		if (!Array.isArray(skills)) skills = [skills];
		skills.forEach(skill => {
			if (!lib.skill[skill]) return;
			if (!lib.skill[skill].audioname2) lib.skill[skill].audioname2 = {};
			for (let i in map) {
				lib.skill[skill].audioname2[i] = map[i];
				// 适配千幻聆音
				if (!lib.skill[map[i]]) {
					lib.skill[map[i]] = { audio: 2 };
					lib.skill[map[i]].audio = skill.audio;
				}
			}
		});
	};
	setAudioname2("clanbaozu", { taffyold_clan_zhonghui: "clanbaozu_clan_zhonghui" });
	setAudioname2("clandaojie", { taffyold_clan_xuncai: "clandaojie_clan_xuncai" });
	setAudioname2("nzry_cunmu", { taffyold_ol_pengyang: "nzry_cunmu_ol_pengyang" });
	setAudioname2("reguicai", { taffyold_xin_simayi: "reguicai_new_simayi", taffyold_new_simayi: "reguicai_new_simayi" });
	setAudioname2("fangzhu", { taffyold_xin_simayi: "fangzhu_new_simayi" });
	setAudioname2("rejizhi", { taffyold_xin_simayi: "rejizhi_new_simayi" });
	setAudioname2("rezhiheng", { taffyold_xin_simayi: "rezhiheng_new_simayi", taffyold_shen_caopi: "rezhiheng_shen_caopi" });
	setAudioname2("rewansha", { taffyold_xin_simayi: "wansha_new_simayi", taffyold_new_simayi: "wansha_new_simayi" });
	setAudioname2("lianpo", { taffyold_xin_simayi: "lianpo_new_simayi", taffyold_new_simayi: "lianpo_new_simayi" });
	setAudioname2("rejianxiong", { taffyold_shen_caopi: "rejianxiong_shen_caopi" });
	setAudioname2("rerende", { taffyold_shen_caopi: "rerende_shen_caopi" });
	setAudioname2("olluanji", { taffyold_shen_caopi: "olluanji_shen_caopi" });
	setAudioname2("olfangquan", { taffyold_shen_caopi: "olfangquan_shen_caopi" });
	setAudioname2("dcfencheng", { taffyold_ol_sb_dongzhuo: "dcfencheng_ol_sb_dongzhuo" });
	setAudioname2("benghuai", { taffyold_ol_sb_dongzhuo: "benghuai_re_dongzhuo" });
	setAudioname2("liegong", { taffy_liubianxing: "liegong_re_huangzhong" });
	setAudioname2("clanquhuo", { taffyold_clan_yangxiu: "clanquhuo_clan_yangxiu" });
	// OL虎牢关
	const addCharacter = function (name, character, packss) {
		if (lib.character[name]) delete lib.character[name];
		var packs = Object.keys(lib.characterPack).filter(pack => lib.characterPack[pack][name]);
		if (packs.length) packs.forEach(pack => delete lib.characterPack[pack][name]);
		if (!packss) lib.character[name] = character;
		else {
			var packs = packss.split(":").filter(p => lib.config.all.characters.includes(p));
			packs.forEach(pack => (lib.characterPack[pack][name] = character));
			if (packs.some(p => lib.config.characters.includes(p))) lib.character[name] = character;
		}
	};
	if (get.mode() != "boss" && (!lib.config.plays || !lib.config.plays.includes("boss"))) {
		game.loadModeAsync("boss", mode => {
			["skill", "translate"].forEach(i => {
				for (var j in mode[i]) {
					if (!lib[i][j] && !j.startsWith("_")) lib[i][j] = mode[i][j];
					if (i == "skill") game.finishSkill(j);
				}
			});
			["boss_lvbu1", "boss_lvbu2", "boss_lvbu3"].forEach(name => {
				lib.rank.rarity.legend.add(name);
				if (!lib.characterIntro[name] && lib.characterIntro.lvbu) lib.characterIntro[name] = lib.characterIntro.lvbu;
			});
			lib.characterSort.taffy_character.taffy_ol.push("boss_lvbu1", "boss_lvbu2", "boss_lvbu3");
			addCharacter("boss_lvbu1", ["male", "shen", 8, ["wushuang", "mashu", "taffyboss_baonu", "taffyboss_jingjia", "boss_aozhan"], ["qun", "mode:boss"]], "taffy_character");
			addCharacter("boss_lvbu2", ["male", "shen", 6, ["wushuang", "mashu", "xiuluo", "shenwei", "shenji"], ["qun", "mode:boss"]], "taffy_character");
			addCharacter("boss_lvbu3", ["male", "shen", 6, ["wushuang", "shenqu", "jiwu"], ["qun", "mode:boss"]], "taffy_character");
		});
	}
	// 修正本体武将的技能
	// 曲阿小将
	lib.skill.peaoyong.filter = function (event, player) {
		return event.getParent(2, true)?.name != "peaoyong" && event.getg(player)?.length;
	};
	// 一些全局技能
	lib.skill._taffy_dieKillEffect = {
		trigger: {
			source: ["dieBegin"],
		},
		filter: function () {
			if (game.hasExtension("标记补充")) return false;
		},
		forced: true,
		popup: false,
		priority: -99,
		lastDo: true,
		content: function () {
			if (!(trigger.source && trigger.player)) return;
			game.broadcastAll(function (source) {
				if (!window.decadeUI) return;
				var kill_count = 0;
				for (i = 0; i < source.stat.length; i++) {
					if (source.stat[i].kill != undefined) kill_count += source.stat[i].kill;
				}
				if (kill_count + 1 == 1) {
					source.$fullscreenpop("一破 · 卧龙出山", "fire");
					game.playAudio("../extension", "永雏塔菲", "audio/shousha_audio/01【播报】一破 卧龙出山.mp3");
				}
				if (kill_count + 1 == 2) {
					source.$fullscreenpop("双连 · 一战成名", "water");
					game.playAudio("../extension", "永雏塔菲", "audio/shousha_audio/02【播报】双连 一战成名.mp3");
				}
				if (kill_count + 1 == 3) {
					source.$fullscreenpop("三连 · 举世皆惊", "thunder");
					game.playAudio("../extension", "永雏塔菲", "audio/shousha_audio/03【播报】三连 举世皆惊.mp3");
				}
				if (kill_count + 1 == 4) {
					source.$fullscreenpop("四连 · 天下无敌", "fire");
					game.playAudio("../extension", "永雏塔菲", "audio/shousha_audio/04【播报】四连 天下无敌.mp3");
				}
				if (kill_count + 1 == 5) {
					source.$fullscreenpop("五连 · 诛天灭地", "thunder");
					game.playAudio("../extension", "永雏塔菲", "audio/shousha_audio/05【播报】五连 诛天灭地.mp3");
				}
				if (kill_count + 1 == 6) {
					source.$fullscreenpop("六连 · 诛天灭地", "water");
					game.playAudio("../extension", "永雏塔菲", "audio/shousha_audio/06【播报】六连 诛天灭地.mp3");
				}
				if (kill_count + 1 == 7) {
					source.$fullscreenpop("七连 · 诛天灭地", "fire");
					game.playAudio("../extension", "永雏塔菲", "audio/shousha_audio/07【播报】七连 诛天灭地.mp3");
				}
				if (kill_count + 1 > 7) {
					source.$fullscreenpop("七连 · 诛天灭地", "fire");
					game.playAudio("../extension", "永雏塔菲", "audio/shousha_audio/07【播报】七连 诛天灭地.mp3");
				}
			}, trigger.source);
		},
	};
	lib.skill._jstx_recovertrigger = {
		trigger: {
			global: "recoverEnd",
		},
		filter: function (event, player) {
			if (game.hasExtension("标记补充")) return false;
			if (_status.currentPhase != player) {
				return event.player != event.source && event.source == player;
			}
			return true;
		},
		direct: true,
		content: function () {
			if (_status.currentPhase != player) {
				if (player.storage.jstxyishugaochao == undefined) {
					player.storage.jstxyishugaochao = trigger.num;
				} else {
					player.storage.jstxyishugaochao += trigger.num;
				}
				if (player.storage.jstxyishugaochao == undefined || player.storage.jstxyishugaochao < 3) {
					game.broadcastAll(function (player) {
						if (!window.decadeUI) return;
						player.$fullscreenpop("妙手回春", "water");
						game.playAudio("../extension", "永雏塔菲", "audio/jstx_audio/jstxmiaoshouhuichun.mp3");
					}, player);
				} else {
					player.storage.jstxyishugaochao -= 3;
					game.broadcastAll(function (player) {
						if (!window.decadeUI) return;
						player.$fullscreenpop("医术高超", "water");
						game.playAudio("../extension", "永雏塔菲", "audio/jstx_audio/jstxyishugaochao.mp3");
					}, player);
				}
			}
		},
		group: "_jstx_recovertrigger_Delete",
		subSkill: {
			Delete: {
				trigger: {
					player: "phaseEnd",
				},
				direct: true,
				content: function () {
					delete player.storage.jstxyishugaochao;
				},
			},
		},
	};
	lib.skill._taffy_onCause3Damage = {
		trigger: {
			source: "damage",
		},
		forced: true,
		popup: false,
		priority: -100,
		lastDo: true,
		filter: function (event, player) {
			if (game.hasExtension("标记补充")) return false;
			return event.num == 3;
		},
		content: function () {
			if (!(trigger.source && trigger.player)) return;
			game.broadcastAll(function (source) {
				if (!window.decadeUI) return;
				source.$fullscreenpop("癫狂屠戮", "fire");
				game.playAudio("../extension", "永雏塔菲", "audio/jstx_audio/diankuangtulu.mp3");
			}, trigger.source);
		},
	};
	lib.skill._taffy_onCause4Damage = {
		trigger: {
			source: "damage",
		},
		forced: true,
		priority: -100,
		lastDo: true,
		filter: function (event, player) {
			if (game.hasExtension("标记补充")) return false;
			return event.num >= 4;
		},
		content: function () {
			if (!(trigger.source && trigger.player)) return;
			game.broadcastAll(function (source) {
				if (!window.decadeUI) return;
				source.$fullscreenpop("无双  万军取首", "fire");
				game.playAudio("../extension", "永雏塔菲", "audio/jstx_audio/jstx_jisha7.mp3");
			}, trigger.source);
		},
	};
	// 如果有标记补充的连杀动画就不播放十周年UI的连杀动画了
	lib.skill._taffy_dieKillEffect_Delete = {
		trigger: {
			source: ["dieBefore"],
		},
		forced: true,
		popup: false,
		priority: -100,
		lastDo: true,
		silent: true,
		content: function () {
			if (game.hasExtension("十周年UI") && game.hasExtension("标记补充")) {
				lib.skill.decadeUI_dieKillEffect.content = function () {};
			}
		},
	};
	// 骨骼播放暂停
	lib.skill._taffy_player_baoji_delay = {
		trigger: {
			player: "damage",
		},
		forced: true,
		priority: -100,
		filter: function (event) {
			if (!game.hasExtension("标记补充")) return false;
			return event.num > 2;
		},
		content: function () {
			if (!trigger.source) return;
			if (trigger.num === 3) {
				game.delay(3.5);
			} else if (trigger.num > 3) {
				game.delay(5.8);
			}
		},
	};
	// 视频背景
	if (config.videoBg) {
		lib.skill._taffy_videoBg = {
			direct: true,
			trigger: {
				global: "gameStart",
			},
			filter: function (event, player) {
				return player == game.me;
			},
			content: function () {
				"step 0";
				var div = ui.create.div();
				div.style.width = "100%";
				div.style.height = "100%";
				div.style.left = "0px";
				div.style.top = "0px";
				div.innerHTML = "<video width='320' height='240' autoplay loop muted style='width:100%;height:100%;object-fit:fill;transition:all 0.5s;opacity:0;'><source src='" + lib.assetURL + "extension/永雏塔菲/video/bg.mp4' type='video/mp4'></video>";
				div.firstChild.oncanplay = e => {
					e.srcElement.style.opacity = 1;
				};
				document.body.insertBefore(div, ui.window);
			},
		};
	}
};
