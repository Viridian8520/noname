//game.import(name: "活动武将",
import { lib, game, ui, get, ai, _status } from '../../noname.js';
import { config } from './js/config.js';
import { precontent } from './js/precontent/index.js';
import { content } from './js/content/index.js';
import { help } from './js/help.js';

lib.init.css(lib.assetURL + 'extension/活动武将', 'extension');

//更新公告
game.bolShowNewPack = function () {
	//更新告示
	var HuoDong_update = [
		'/setPlayer/',
		'bugfix',
		'寝室/肘击群杂谈系列新武将：'
		+ '<br>不好孩子们，我们的群聊都被病毒攻陷了！ ———— 逍遥如云'
		+ '<br>黄月英打了三年的复活赛，终于打赢了…… ———— 睡觉不玻璃',
		'补充寝室/肘击群杂谈系列“眼睛👁👃👁”的append标语',
		'修改名人堂“随性似风”的【多样】，防止与“逍遥如云”重复',
		'对部分音频素材进行音质提升，对部分图片素材进行画质提升，补充捉鬼驱邪的武将介绍。by--逍遥如云',
		'优化仁库拖动逻辑，提高拖动仁库流畅度，修复仁库位置不计算偏移的bug',
		//'技能修改，配音补充',
		'To be continued...',
	];
	//更新武将
	var HuoDong_players = [
		'bilibili_xiaoyaoruyun', 'bilibili_shuijiaobuboli', 'bilibili_yanjing', 'bilibili_suixingsifeng',
	];
	//加载
	var dialog = ui.create.dialog(
		'<span class="text center">' +
		'新人制作扩展，希望大家支持<br>新人技术不足，希望大家包涵' +
		'<br>' +
		'<a href="https://github.com/HuoDong-Update-Organization/HuoDong-update">点击前往活动武将Github仓库</a>' +
		'<br>' +
		'活动武将 ' + lib.extensionPack.活动武将.version + ' 更新内容' +
		'</span>', 'hidden');
	for (var i = 0; i < HuoDong_update.length; i++) {
		if (HuoDong_update[i] == '/setPlayer/') {
			if (HuoDong_players.length) dialog.addSmall([HuoDong_players, 'character']);
		}
		else {
			var li = document.createElement('li');
			li.innerHTML = HuoDong_update[i];
			li.style.textAlign = 'left';
			dialog.content.appendChild(li);
		}
	}
	dialog.open();
	var hidden = false;
	if (!ui.auto.classList.contains('hidden')) {
		ui.auto.hide();
		hidden = true;
	}
	game.pause();
	var control = ui.create.control('确定', function () {
		dialog.close();
		control.close();
		if (hidden) ui.auto.show();
		game.resume();
	});
};

let extensionPackage = {
	name: "活动武将",
	editable: false,
	content: content,
	precontent: precontent,
	config: config,
	help: help,
	package: {
		intro: '新人制作扩展，希望大家支持。' +
			'<br>新人技术不足，希望大家包涵。' +
			'<br><a href="https://github.com/HuoDong-Update-Organization/HuoDong-update">点击前往活动武将Github仓库</a>' +
			'<br><li>欢迎大家进群支持活动武将' +
			//入群二维码图片
			'<br><img style=width:238px src=' + lib.assetURL + 'extension/活动武将/HuoDong_QQ.png>' +
			'',
		author: '萌新（转型中）',
		diskURL: '',
		forumURL: '',
		version: '0.3.8 - 待定',
		//新人制作扩展，希望大家支持。
		//新人技术不足，希望大家包涵。
		//壹、贰、叁、肆、伍、陆、柒、捌、玖、拾
	},
	files: {}
};

export let type = 'extension';
export default extensionPackage;