"use strict";
decadeModule.import(function (lib, game, ui, get, ai, _status) {
	/*
	十周年UI动皮使用说明：
	- 首先打开动态皮肤的开关，直接替换原有武将皮肤显示；
	- 目前不支持动态皮肤的切换功能；
	- 动态皮肤参数表在线文档链接：https://docs.qq.com/sheet/DS2Vaa0ZGWkdMdnZa；可以在群在线文档提供你设置好的参数
	- 所有相关的文件请放到	十周年UI/assets/dynamic目录下；
	- 关于格式请参考下面示例：
		武将名:{
			皮肤名:{
				name: "xxx",	//	必★填	骨骼名称，一般是yyy.skel，注意xxx不带后缀名.skel；
				action: "xxx",	//	可删掉	播放动作，xxx 一般是 DaiJi，目前手杀的骨骼文件需要填；
				x: [10, 0.5],	//	可删掉	[10, 0.5]相当于 left: calc(10px + 50%)，不填默认为[0, 0.5]；
				y: [10, 0.5],	//	可删掉	[10, 0.5]相当于 bottom: calc(10px + 50%)，不填默认为[0, 0.5]；
				scale: 0.5,		//	可删掉	缩放大小，不填默认为1；
				angle: 0,		//	可删掉	旋转角度，不填默认为0；
				speed: 1,		//	可删掉	播放速度，不填默认为1；
				hideSlots: ['隐藏的部件'],	// 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				clipSlots: ['裁剪的部件'],	// 剪掉超出头的部件，仅针对露头动皮，其他勿用
				background: "xxx.jpg",	//	可删掉	背景图片，注意后面要写后缀名，如.jpg .png等
			}
		},
	- 为了方便得到动皮的显示位置信息，请在游戏选将后，用控制台或调试助手小齿轮执行以下代码(没用到的属性请删掉以免报错):
		game.me.stopDynamic();
		game.me.playDynamic({
			name: 'xxxxxxxxx',		// 勿删
			action: undefined,
			speed: 1,
			loop: true,				// 勿删
			x: [0, 0.5],
			y: [0, 0.5],
			scale: 0.5,
			angle: 0,
			hideSlots: ['隐藏的部件'],	// 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
			clipSlots: ['裁剪的部件'],	// 剪掉超出头的部件，仅针对露头动皮，其他勿用
		});
		// 这里可以改成  }, true);  设置右将动皮
	*/

	decadeUI.dynamicSkin = {
		baosanniang: {
			// 鲍三娘
			虎年七夕: {
				name: "鲍三娘/虎年七夕/XingXiang",
				x: [0, 0.46],
				y: [0, 0.36],
				scale: 0.42,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				gongji: {
					action: "TeShu",
					scale: 0.6,
					speed: 2,
					x: [0, 0.8],
					y: [0, 0.4],
				},
				beijing: {
					name: "鲍三娘/虎年七夕/BeiJing",
					scale: 0.3,
					x: [0, 0.69],
					y: [0, 0.5],
				},
			},
			漫花剑俏: {
				name: "鲍三娘/漫花剑俏/daiji2",
				x: [0, 0.4],
				y: [0, 0.6],
				scale: 0.6,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "鲍三娘/漫花剑俏/chuchang",
					scale: 0.8,
					action: "play",
				},
				gongji: {
					name: "鲍三娘/漫花剑俏/chuchang",
					scale: 0.95,
					action: "play",
				},
				beijing: {
					name: "鲍三娘/漫花剑俏/beijing",
					x: [0, 0.29],
					y: [0, 0.48],
					scale: 0.4,
				},
			},
			兔娇春浓: {
				name: "鲍三娘/兔娇春浓/daiji2",
				teshu: {
					name: "鲍三娘/兔娇春浓/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.4],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "鲍三娘/兔娇春浓/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "鲍三娘/兔娇春浓/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				beijing: {
					name: "鲍三娘/兔娇春浓/beijing",
					x: [0, 0.29],
					y: [0, 0.5],
					scale: 0.4,
				},
				zhishixian: {
					name: "鲍三娘/兔娇春浓/shouji2",
					scale: 0.5,
					speed: 0.8,
					delay: 0.4,
					effect: {
						name: "鲍三娘/兔娇春浓/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.25,
					},
				},
			},
			嫣然一笑: {
				name: "鲍三娘/嫣然一笑/XingXiang",
				x: [0, -0.3],
				y: [0, 0.2],
				scale: 0.45,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "鲍三娘/嫣然一笑/BeiJing",
					x: [0, 0.5],
					y: [0, 0.47],
					scale: 0.3,
				},
			},
			凤舞龙翔: {
				name: "鲍三娘/凤舞龙翔/daiji2",
				teshu: {
					name: "鲍三娘/凤舞龙翔/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "鲍三娘/凤舞龙翔/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "鲍三娘/凤舞龙翔/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				audio: {
					skill: "鲍三娘/凤舞龙翔/audio",
				},
				beijing: {
					name: "鲍三娘/凤舞龙翔/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "鲍三娘/凤舞龙翔/shouji2",
					scale: 0.7,
					speed: 0.8,
					delay: 0.3,
					effect: {
						name: "鲍三娘/凤舞龙翔/shouji",
						scale: 0.65,
						speed: 0.6,
						delay: 0.4,
					},
				},
				special: {
					变身: {
						// hp: 2,
						name: "baosanniang/凤舞龙翔2",
					},
					condition: {
						// 限定技
						xiandingji: {
							transform: "变身",
							effect: "shaohui",
						},
					},
				},
			},
			凤舞龙翔2: {
				name: "鲍三娘/凤舞龙翔2/daiji2",
				teshu: {
					name: "鲍三娘/凤舞龙翔2/chuchang2",
					action: ["jineng"],
					scale: 0.8,
					hideSlots: ["ren_moanbutouying"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				hideSlots: ["ren_moanbutouying"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "鲍三娘/凤舞龙翔2/chuchang",
					action: "play",
					scale: 0.8,
					hideSlots: ["ren_moanbutouying"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
				gongji: {
					name: "鲍三娘/凤舞龙翔2/chuchang2",
					action: ["gongji"],
					scale: 0.8,
					hideSlots: ["ren_moanbutouying"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
				audio: {
					skill: "鲍三娘/凤舞龙翔2/audio",
				},
				beijing: {
					name: "鲍三娘/凤舞龙翔2/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "鲍三娘/凤舞龙翔2/shouji2",
					scale: 0.6,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "鲍三娘/凤舞龙翔2/shouji",
						scale: 0.6,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		bianxi: {
			// 卞喜
			夺关袭寨: {
				name: "卞喜/夺关袭寨/daiji2",
				x: [0, 0.55],
				y: [0, 0.45],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "卞喜/夺关袭寨/chuchang",
					scale: 0.8,
					action: "play",
				},
				gongji: {
					name: "卞喜/夺关袭寨/chuchang",
					scale: 1,
					action: "play",
				},
				beijing: {
					name: "卞喜/夺关袭寨/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		caiwenji: {
			// 蔡文姬
			以身证道: {
				name: "蔡文姬/以身证道/XingXiang",
				x: [0, 0.3],
				y: [0, 0.35],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "蔡文姬/以身证道/BeiJing",
					x: [0, 0.3],
					y: [0, 0.35],
					scale: 0.5,
				},
			},
		},
		huan_caoang: {
			// 幻曹昂
			经典形象: {
				name: "幻曹昂/经典形象/XingXiang",
				x: [0, 0.25],
				y: [0, 0.25],
				scale: 0.55,
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.55,
				},
				angle: 0,
				//speed: 1,
				//action: 'DaiJi',
				beijing: {
					name: "幻曹昂/经典形象/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				audio: {
					skill: "幻曹昂/经典形象/audio",
					card: "幻曹昂/经典形象/audio",
				},
				special: {
					变身: {
						hp: 2,
						name: "huan_caoang/经典形象2",
					},
					condition: {
						lowhp: {
							transform: ["变身"],
							recover: true,
						},
					},
				},
			},
			经典形象2: {
				name: "幻曹昂/经典形象2/XingXiang",
				x: [0, 0.95],
				y: [0, -0.1],
				scale: 0.8,
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.8,
				},
				angle: 0,
				//speed: 1,
				//action: 'DaiJi',
				audio: {
					skill: "幻曹昂/经典形象2/audio",
					card: "幻曹昂/经典形象2/audio",
				},
				beijing: {
					name: "幻曹昂/经典形象2/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		caocao: {
			// 曹操
			雄吞天下: {
				name: "曹操/雄吞天下/XingXiang",
				x: [0, 0.3],
				y: [0, 0.25],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "曹操/雄吞天下/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			逐鹿天下: {
				name: "曹操/逐鹿天下/XingXiang",
				x: [0, 0.5],
				y: [0, 0.15],
				scale: 0.45,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "曹操/逐鹿天下/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		caochun: {
			// 曹纯
			虎啸龙渊: {
				name: "曹纯/虎啸龙渊/daiji2",
				teshu: {
					name: "曹纯/虎啸龙渊/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.45],
				scale: 1.14,
				angle: -10,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "曹纯/虎啸龙渊/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "曹纯/虎啸龙渊/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				audio: {
					skill: "曹纯/虎啸龙渊/audio",
				},
				beijing: {
					name: "曹纯/虎啸龙渊/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "曹纯/虎啸龙渊/shouji2",
					scale: 0.7,
					speed: 0.8,
					delay: 0.3,
					effect: {
						name: "曹纯/虎啸龙渊/shouji",
						scale: 0.65,
						speed: 0.6,
						delay: 0.4,
					},
				},
				special: {
					变身: {
						hp: 2,
						name: "caochun/虎啸龙渊2",
					},
					condition: {
						lowhp: {
							transform: ["变身"],
							recover: true,
						},
					},
				},
			},
			虎啸龙渊2: {
				name: "曹纯/虎啸龙渊2/daiji2",
				teshu: {
					name: "曹纯/虎啸龙渊2/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.35],
				scale: 1.14,
				angle: 10,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "曹纯/虎啸龙渊2/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "曹纯/虎啸龙渊2/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				audio: {
					skill: "曹纯/虎啸龙渊2/audio",
				},
				beijing: {
					name: "曹纯/虎啸龙渊2/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "曹纯/虎啸龙渊2/shouji2",
					scale: 0.6,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "曹纯/虎啸龙渊2/shouji",
						scale: 0.6,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		caohua: {
			// 曹华
			彩蝶恋花: {
				name: "曹华/彩蝶恋花/daiji2",
				teshu: {
					name: "曹华/彩蝶恋花/chuchang2",
					action: ["jineng"],
					scale: 0.6,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.45],
				y: [0, 0.55],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "曹华/彩蝶恋花/chuchang",
					action: "play",
					scale: 0.75,
				},
				gongji: {
					name: "曹华/彩蝶恋花/chuchang2",
					action: ["gongji"],
					scale: 0.6,
				},
				beijing: {
					name: "曹华/彩蝶恋花/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "曹华/彩蝶恋花/shouji2",
					scale: 0.5,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "曹华/彩蝶恋花/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
			彩蝶恋花涩: {
				name: "曹华/彩蝶恋花涩/daiji2",
				teshu: {
					name: "曹华/彩蝶恋花涩/chuchang2",
					action: ["jineng"],
					scale: 0.6,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.45],
				y: [0, 0.55],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "曹华/彩蝶恋花涩/chuchang",
					action: "play",
					scale: 0.75,
				},
				gongji: {
					name: "曹华/彩蝶恋花涩/chuchang2",
					action: ["gongji"],
					scale: 0.6,
				},
				beijing: {
					name: "曹华/彩蝶恋花涩/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "曹华/彩蝶恋花涩/shouji2",
					scale: 0.5,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "曹华/彩蝶恋花涩/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		caojinyu: {
			// 曹金玉
			瓷语青花: {
				name: "曹金玉/瓷语青花/daiji2",
				teshu: {
					name: "曹金玉/瓷语青花/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.45],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				clipSlots: ["r111"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "曹金玉/瓷语青花/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "曹金玉/瓷语青花/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				beijing: {
					name: "曹金玉/瓷语青花/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
					angle: 0,
				},
				zhishixian: {
					name: "曹金玉/瓷语青花/shouji2",
					scale: 0.5,
					speed: 0.8,
					delay: 0.3,
					effect: {
						name: "曹金玉/瓷语青花/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.2,
					},
				},
			},
			瑞雪纷华: {
				name: "曹金玉/瑞雪纷华/daiji2",
				x: [0, 0.4],
				y: [0, 0.43],
				scale: 1,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "曹金玉/瑞雪纷华/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "曹金玉/瑞雪纷华/chuchang",
					scale: 0.85,
					action: "play",
				},
				beijing: {
					name: "曹金玉/瑞雪纷华/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
		},
		caomao: {
			经典形象2: {
				name: "曹髦/经典形象2/XingXiang",
				x: [0, -0.8],
				y: [0, 0.2],
				scale: 0.7,
				angle: 0,
				//speed: 1,
				//action: 'DaiJi',
				beijing: {
					name: "曹髦/经典形象2/BeiJing",
					scale: 0.3,
					x: [0, -0.8],
					y: [0, 0.5],
				},
				special: {
					xiandingji: {
						name: "曹髦/经典形象2/SS_cmskill",
						x: [0, 0.5],
						y: [0, 0.5],
						scale: 0.9,
						speed: 1,
						delay: 2,
					},
					condition: {
						xiandingji: {
							play: "xiandingji",
							// audio: '神郭嘉/audio/skill/victory', // 触发限定技时候播放的语音
						},
					},
				},
			},
		},
		caopi: {
			// 曹丕
			气荡山河: {
				name: "曹丕/气荡山河/XingXiang",
				x: [0, -0.3],
				y: [0, 0.1],
				scale: 0.55,
				angle: 0,
				clipSlots: ["flag1"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				// action: 'DaiJi',
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.5,
				},
				beijing: {
					name: "曹丕/气荡山河/BeiJing",
					scale: 0.3,
					x: [0, 1.7],
					y: [0, 0.5],
				},
				audio: {
					skill: "曹丕/气荡山河/audio",
				},
			},
		},
		caoren: {
			// 曹仁
			国之柱石: {
				name: "曹仁/国之柱石/XingXiang",
				x: [0, 0.1],
				y: [0, 0.5],
				scale: 0.35,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "曹仁/国之柱石/BeiJing",
					scale: 0.4,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		caoxian: {
			// 曹宪
			元春呈祥: {
				name: "曹宪/元春呈祥/daiji2",
				teshu: {
					name: "曹宪/元春呈祥/chuchang2",
					action: ["jineng"],
					scale: 0.6,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.45],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "曹宪/元春呈祥/chuchang",
					action: "play",
					scale: 0.75,
				},
				gongji: {
					name: "曹宪/元春呈祥/chuchang2",
					action: ["gongji"],
					scale: 0.6,
				},
				beijing: {
					name: "曹宪/元春呈祥/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "曹宪/元春呈祥/shouji2",
					scale: 0.5,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "曹宪/元春呈祥/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		caoxiancaohua: {
			// 曹宪曹华
			锦瑟良缘: {
				name: "曹宪曹华/锦瑟良缘/daiji",
				ss_jinchang: "ChuChang",
				action: "DaiJi",
				x: [0, 0.45],
				y: [0, 0.35],
				scale: 0.8,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "曹宪曹华/锦瑟良缘/xingxiang",
					scale: 0.8,
					version: "4.0",
					json: true,
					action: "HuDong",
				},
				qianjing: {
					name: "曹宪曹华/锦瑟良缘/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					scale: 0.8,
				},
				gongji: {
					name: "曹宪曹华/锦瑟良缘/xingxiang",
					action: "GongJi",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				teshu: {
					name: "曹宪曹华/锦瑟良缘/xingxiang",
					scale: 0.9,
					version: "4.0",
					json: true,
					action: "JiNeng",
				},
				beijing: {
					name: "曹宪曹华/锦瑟良缘/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.55],
					y: [0, 0.55],
					scale: 0.55,
				},
				special: {
					变身: {
						name: "caoxiancaohua/锦瑟良缘2",
					},
					condition: {
						// 限定技
						xiandingji: {
							transform: "变身",
							effect: "shaohui",
						},
					},
				},
			},
			锦瑟良缘2: {
				name: "曹宪曹华/锦瑟良缘2/daiji",
				ss_jinchang: "ChuChang",
				action: "DaiJi",
				x: [0, 0.2],
				y: [0, 0.4],
				scale: 0.8,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "曹宪曹华/锦瑟良缘2/xingxiang",
					scale: 0.8,
					version: "4.0",
					json: true,
					action: "HuDong",
				},
				qianjing: {
					name: "曹宪曹华/锦瑟良缘2/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.45],
					y: [0, 0.55],
					scale: 0.8,
				},
				gongji: {
					name: "曹宪曹华/锦瑟良缘2/xingxiang",
					action: "GongJi",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				teshu: {
					name: "曹宪曹华/锦瑟良缘2/xingxiang",
					scale: 0.9,
					version: "4.0",
					json: true,
					action: "JiNeng",
				},
				beijing: {
					name: "曹宪曹华/锦瑟良缘2/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.55],
					y: [0, 0.55],
					scale: 0.55,
				},
				special: {
					变身: {
						name: "caoxiancaohua/锦瑟良缘",
					},
					condition: {
						// 限定技
						xiandingji: {
							transform: "变身",
							effect: "shaohui",
						},
					},
				},
			},
		},
		cenhun: {
			// 岑昏
			铁锁封江: {
				name: "岑昏/铁锁封江/xingxiang",
				version: "4.0",
				json: true,
				x: [0, 0.65],
				y: [0, 0.45],
				scale: 0.6,
				angle: 0,
				// speed: 1,
				beijing: {
					name: "岑昏/铁锁封江/beijing",
					version: "4.0",
					json: true,
					scale: 0.5,
					x: [0, 0.3],
					y: [0, 0.5],
				},
			},
		},
		chengui: {
			//陈珪
			战场荣耀: {
				name: "陈珪/战场荣耀/daiji2",
				play2: "play2",
				shan: "play3",
				version: "3.6",
				x: [0, 0.53],
				y: [0, 0.57],
				scale: 0.67,
				angle: 0,
				//speed: 1,
				shizhounian: true,
				chuchang: {
					name: "陈珪/战场荣耀/chuchang",
					version: "3.6",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "陈珪/战场荣耀/chuchang2",
					version: "3.6",
					action: "gongji",
					scale: 0.8,
				},
				teshu: {
					name: "陈珪/战场荣耀/chuchang2",
					version: "3.6",
					action: "jineng",
					scale: 0.8,
				},
				beijing: {
					name: "陈珪/战场荣耀/beijing",
					version: "3.6",
					x: [0, 0.29],
					y: [0, 0.5],
					scale: 0.4,
				},
				audio: {
					skill: "陈珪/战场荣耀/audio",
				},
				zhishixian: {
					name: "陈珪/战场荣耀/shouji2",
					version: "3.6",
					scale: 0.5,
					speed: 0.8,
					delay: 0.4,
					effect: {
						name: "陈珪/战场荣耀/shouji",
						version: "3.6",
						scale: 0.5,
						speed: 0.8,
						delay: 0.25,
					},
				},
			},
		},
		daqiao: {
			// 大乔
			花好月圆: {
				// 出场错误
				name: "大乔/花好月圆/daiji2",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 10,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "大乔/花好月圆/ChuChang",
					version: "4.0",
					scale: 0.8,
					action: "play",
				},
				gongji: {
					name: "大乔/花好月圆/ChuChang",
					version: "4.0",
					scale: 1,
					action: "play",
				},
				beijing: {
					name: "大乔/花好月圆/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
				special: {
					击杀: {},
					jisha: {
						name: "大乔/花好月圆/JiSha",
						x: [0, 0.54],
						version: "4.0",
						scale: 0.9,
						speed: 1,
						delay: 2,
					},
					condition: {
						jisha: {
							transform: "击杀",
							play: "jisha",
						},
					},
				},
			},
			绝世之姿: {
				name: "大乔/绝世之姿/XingXiang",
				x: [0, 0.44],
				y: [0, 0.23],
				scale: 0.5,
				angle: 12,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "大乔/绝世之姿/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		dianwei: {
			// 典韦
			蹈锋睥世: {
				name: "典韦/蹈锋睥世/daiji",
				x: [0, 0.5],
				y: [0, 0.3],
				scale: 1,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "典韦/蹈锋睥世/xingxiang",
					scale: 1,
					json: true,
					action: "HuDong",
				},
				gongji: {
					name: "典韦/蹈锋睥世/xingxiang",
					scale: 1,
					json: true,
					action: "GongJi",
				},
				teshu: {
					name: "典韦/蹈锋睥世/xingxiang",
					scale: 1,
					json: true,
					action: "JiNeng",
				},
				qianjing: {
					name: "典韦/蹈锋睥世/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 1,
				},
				beijing: {
					name: "典韦/蹈锋睥世/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					x: [0, 0.8],
					y: [0, 0.6],
					scale: 0.4,
					version: "4.0",
					json: true,
				},
			},
		},
		diaochan: {
			// 貂蝉
			花好月圆: {
				name: "貂蝉/花好月圆/daiji2",
				x: [0, 0.64],
				y: [0, 0.53],
				scale: 0.94,
				angle: 10,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "貂蝉/花好月圆/chuchang",
					scale: 0.9,
					action: "play",
				},
				gongji: {
					name: "貂蝉/花好月圆/chuchang",
					scale: 1.1,
					action: "play",
				},
				beijing: {
					name: "貂蝉/花好月圆/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
			绝世倾城: {
				name: "貂蝉/绝世倾城/XingXiang",
				x: [0, 0.42],
				y: [0, 0.16],
				scale: 0.52,
				angle: -15,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "貂蝉/绝世倾城/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			文和乱武: {
				name: "貂蝉/文和乱武/daiji2",
				x: [0, 0.4],
				y: [0, 0.57],
				scale: 0.8,
				angle: -20,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "貂蝉/文和乱武/chuchang",
					scale: 0.9,
					action: "play",
				},
				gongji: {
					name: "貂蝉/文和乱武/chuchang",
					scale: 1.1,
					action: "play",
				},
				beijing: {
					name: "貂蝉/文和乱武/beijing",
					x: [0, 1.11],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
			驭魂千机: {
				name: "貂蝉/驭魂千机/XingXiang",
				x: [0, 0.54],
				y: [0, 0.23],
				scale: 0.6,
				angle: 15,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "貂蝉/驭魂千机/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			舞惑群心: {
				name: "貂蝉/舞惑群心/XingXiang",
				x: [0, -0.5],
				y: [0, 0.2],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "貂蝉/舞惑群心/BeiJing",
					x: [0, -0.5],
					y: [0, 0.2],
					scale: 0.5,
				},
			},
		},
		dingshangwan: {
			// 丁尚涴
			夜阑扰梦: {
				name: "丁尚涴/夜阑扰梦/daiji2",
				x: [0, 0.45],
				y: [0, 0.47],
				scale: 0.77,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "丁尚涴/夜阑扰梦/chuchang",
					scale: 0.8,
					action: "play",
				},
				gongji: {
					name: "丁尚涴/夜阑扰梦/chuchang",
					scale: 1,
					action: "play",
				},
				beijing: {
					name: "丁尚涴/夜阑扰梦/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		dongbai: {
			// 董白
			娇巧伶俐: {
				name: "董白/娇巧伶俐/daiji2",
				x: [0, 0.34],
				y: [0, 0.56],
				scale: 0.88,
				angle: -20,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "董白/娇巧伶俐/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "董白/娇巧伶俐/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "董白/娇巧伶俐/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
			猪年春节: {
				name: "董白/猪年春节/XingXiang",
				x: [0, 0.67],
				y: [0, 0.47],
				scale: 0.48,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "董白/猪年春节/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		dongzhuo: {
			// 董卓
			踞京问鼎: {
				name: "董卓/踞京问鼎/daiji",
				ss_jinchang: "ChuChang",
				action: "DaiJi",
				x: [0, 0.25],
				y: [0, 0.25],
				scale: 0.9,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "董卓/踞京问鼎/xingxiang",
					action: "HuDong",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				qianjing: {
					name: "董卓/踞京问鼎/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.55],
					y: [0, 0.3],
					scale: 0.9,
				},
				gongji: {
					name: "董卓/踞京问鼎/xingxiang",
					action: "GongJi",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				teshu: {
					name: "董卓/踞京问鼎/xingxiang",
					action: "JiNeng",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				beijing: {
					name: "董卓/踞京问鼎/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.7,
				},
			},
			踞京问鼎2: {
				name: "董卓/踞京问鼎2/daiji",
				ss_jinchang: "ChuChang",
				action: "DaiJi",
				x: [0, 0.25],
				y: [0, 0.25],
				scale: 0.9,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "董卓/踞京问鼎2/xingxiang",
					action: "HuDong",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				qianjing: {
					name: "董卓/踞京问鼎2/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.55],
					y: [0, 0.3],
					scale: 0.9,
				},
				gongji: {
					name: "董卓/踞京问鼎2/xingxiang",
					action: "GongJi",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				teshu: {
					name: "董卓/踞京问鼎2/xingxiang",
					action: "JiNeng",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				beijing: {
					name: "董卓/踞京问鼎2/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.7,
				},
				special: {
					变身: {
						hp: 3,
						name: "dongzhuo/踞京问鼎",
						// audio: "baorubianshen", // 触发变身, 可以播放语音
					},
					condition: {
						lowhp: {
							transform: ["变身"],
							recover: true,
							effect: "shaohui",
							play: "play",
						},
					},
				},
			},
			踞京问鼎3: {
				name: "董卓/踞京问鼎3/daiji",
				ss_jinchang: "ChuChang",
				action: "DaiJi",
				x: [0, 0.25],
				y: [0, 0.25],
				scale: 0.9,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "董卓/踞京问鼎3/xingxiang",
					action: "HuDong",
					version: "4.0",
					json: true,
					scale: 1,
				},
				qianjing: {
					name: "董卓/踞京问鼎3/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.55],
					y: [0, 0.3],
					scale: 1,
				},
				gongji: {
					name: "董卓/踞京问鼎3/xingxiang",
					action: "GongJi",
					version: "4.0",
					json: true,
					scale: 1,
				},
				teshu: {
					name: "董卓/踞京问鼎3/xingxiang",
					action: "JiNeng",
					version: "4.0",
					json: true,
					scale: 1,
				},
				beijing: {
					name: "董卓/踞京问鼎3/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.7,
				},
				special: {
					变身: {
						hp: 6,
						name: "dongzhuo/踞京问鼎2",
						// audio: "baorubianshen", // 触发变身, 可以播放语音
					},
					condition: {
						lowhp: {
							transform: ["变身"],
							recover: true,
							effect: "shaohui",
							play: "play",
						},
					},
				},
			},
		},
		duyu: {
			// 杜预
			弼朝博虬: {
				name: "杜预/弼朝博虬/XingXiang",
				x: [0, 0.5],
				y: [0, 0.45],
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.5,
				},
				scale: 0.45,
				angle: 0,
				//speed: 1,
				//action: 'DaiJi',
				beijing: {
					name: "杜预/弼朝博虬/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				audio: {
					skill: "杜预/弼朝博虬/audio",
					card: "杜预/弼朝博虬/audio",
				},
				special: {
					觉醒: {
						name: "duyu/弼朝博虬2",
					},
					condition: {
						juexingji: {
							transform: "觉醒",
							effect: "shaohui",
							//play: 'play',
						},
					},
				},
			},
			弼朝博虬2: {
				name: "杜预/弼朝博虬2/XingXiang",
				x: [0, 0.45],
				y: [0, 0.35],
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
				},
				scale: 0.5,
				angle: 0,
				clipSlots: ["longtou", "longshenti1", "longshenti2", "longshenti3", "longshenti4", "longfa1", "longfa2", "longfa3", "longfa4", "longfa5", "longfa6", "longfa7", "longfa8", "longfa9", "longfa10", "longfa11", "longfa12", "longhuzi1", "longhuzi2", "longhuzi3", "longhuzi4", "longhuzi5", "longhuzi6", "longhuzi7", "longhuzi8", "longjiao1", "longjiao2", "longzuobi", "longxiaba1", "longxiaba2"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				//speed: 1,
				//action: 'DaiJi',
				audio: {
					skill: "杜预/弼朝博虬2/audio",
					card: "杜预/弼朝博虬2/audio",
				},
				beijing: {
					name: "杜预/弼朝博虬2/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		feiyi: {
			// 费祎
			安民护祚: {
				name: "费祎/安民护祚/XingXiang",
				x: [0, 0.85],
				y: [0, 0.2],
				scale: 0.5,
				angle: 0,
				gongji: {
					action: "TeShu",
					scale: 0.5,
					speed: 1,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "费祎/安民护祚/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		fuqian: {
			// 傅佥
			爆料皮肤: {
				name: "傅佥/爆料皮肤/XingXiang",
				x: [0, 0.05],
				y: [0, 0.25],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "傅佥/爆料皮肤/BeiJing",
					x: [0, 0.05],
					y: [0, 0.25],
					scale: 0.7,
				},
			},
		},
		guanyu: {
			// 关羽
			以身证道: {
				name: "关羽/以身证道/XingXiang",
				x: [0, 0.3],
				y: [0, 0],
				scale: 0.65,
				angle: 0,
				clipSlots: ["zhangliao", "xuhuang", "vfx/daiji/zhangliao1_00", "vfx/daiji/xuhuang1_00"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "关羽/以身证道/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		guanning: {
			// 管宁
			墨韵荷香: {
				name: "管宁/墨韵荷香/daiji2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "管宁/墨韵荷香/chuchang",
					action: "play",
					scale: 0.5,
				},
				gongji: {
					name: "管宁/墨韵荷香/chuchang2",
					action: "gongji",
					scale: 0.5,
				},
				teshu: {
					name: "管宁/墨韵荷香/chuchang2",
					action: "jineng",
					scale: 0.5,
					whitelist: ["dunshi", "dunshi_backup", "dunshi_damage", "taffydc_dunshi", "taffydc_dunshi_backup", "taffydc_dunshi_damage"],
				},
				beijing: {
					name: "管宁/墨韵荷香/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.25,
				},
				zhishixian: {
					name: "管宁/墨韵荷香/shouji2",
					scale: 0.8,
					speed: 1,
					delay: 0.5,
					effect: {
						name: "管宁/墨韵荷香/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.6,
					},
				},
			},
		},
		guansuo: {
			// 关索
			虎年七夕: {
				name: "关索/虎年七夕/XingXiang",
				x: [0, 0.73],
				y: [0, 0.41],
				scale: 0.42,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				gongji: {
					action: "TeShu",
					scale: 0.6,
					speed: 2,
					x: [0, 0.8],
					y: [0, 0.4],
				},
				beijing: {
					name: "关索/虎年七夕/BeiJing",
					scale: 0.3,
					x: [0, 0.69],
					y: [0, 0.5],
				},
			},
			龙战玄黄: {
				name: "关索/龙战玄黄/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.4],
				scale: 1,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "关索/龙战玄黄/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "关索/龙战玄黄/chuchang2",
					action: "gongji",
					scale: 0.8,
				},
				teshu: {
					name: "关索/龙战玄黄/chuchang2",
					action: "jineng",
					scale: 0.8,
				},
				audio: {
					skill: "关索/龙战玄黄/audio",
				},
				beijing: {
					name: "关索/龙战玄黄/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "关索/龙战玄黄/shouji2",
					scale: 0.7,
					speed: 0.8,
					delay: 0.3,
					effect: {
						name: "关索/龙战玄黄/shouji",
						scale: 0.65,
						speed: 0.6,
						delay: 0.4,
					},
				},
				special: {
					变身: {
						hp: 2,
						name: "guansuo/龙战玄黄2",
					},
					condition: {
						lowhp: {
							transform: ["变身"],
							recover: true,
						},
					},
				},
			},
			龙战玄黄2: {
				name: "关索/龙战玄黄2/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.4],
				scale: 1,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "关索/龙战玄黄2/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "关索/龙战玄黄2/chuchang2",
					action: "gongji",
					scale: 0.8,
				},
				teshu: {
					name: "关索/龙战玄黄2/chuchang2",
					action: "jineng",
					scale: 0.8,
				},
				audio: {
					skill: "关索/龙战玄黄2/audio",
				},
				beijing: {
					name: "关索/龙战玄黄2/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "关索/龙战玄黄2/shouji2",
					scale: 0.6,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "关索/龙战玄黄2/shouji",
						scale: 0.6,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		guojia: {
			// 郭嘉
			以身证道: {
				name: "郭嘉/以身证道/XingXiang",
				x: [0, -0.3],
				y: [0, 0.6],
				scale: 0.5,
				angle: 0,
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.5,
				},
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "郭嘉/以身证道/BeiJing",
					scale: 0.4,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				audio: {
					skill: "郭嘉/以身证道/audio",
					card: "郭嘉/以身证道/audio",
				},
			},
		},
		guozhao: {
			// 郭照
			瓷语青花: {
				name: "郭照/瓷语青花/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.45],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "郭照/瓷语青花/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "郭照/瓷语青花/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "郭照/瓷语青花/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "郭照/瓷语青花/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "郭照/瓷语青花/shouji2",
					scale: 0.5,
					speed: 1.5,
					delay: 0.3,
					effect: {
						name: "郭照/瓷语青花/shouji",
						scale: 0.5,
						speed: 0.9,
						delay: 0.6,
					},
				},
			},
			阙寒惊凤: {
				name: "郭照/阙寒惊凤/XingXiang",
				x: [0, -0.15],
				y: [0, 0.5],
				scale: 0.4,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "郭照/阙寒惊凤/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		hujinding: {
			//胡金定
			金粉福颜: {
				name: "胡金定/金粉福颜/daiji2",
				play2: "play2",
				teshu: {
					name: "胡金定/金粉福颜/chuchang2",
					action: "jineng",
					scale: 0.8,
				},
				shan: "play3",
				x: [0, 0.45],
				y: [0, 0.5],
				scale: 0.8,
				//speed: 1,
				shizhounian: true,
				chuchang: {
					name: "胡金定/金粉福颜/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "胡金定/金粉福颜/chuchang2",
					action: "gongji",
					scale: 0.8,
				},
				beijing: {
					name: "胡金定/金粉福颜/beijing",
					x: [0, 0.7],
					y: [0, 0.43],
					scale: 0.4,
				},
				zhishixian: {
					name: "胡金定/金粉福颜/shouji2",
					scale: 0.6,
					speed: 1.1,
					delay: 0.3,
					effect: {
						name: "胡金定/金粉福颜/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.35,
					},
				},
			},
		},
		huan_zhugeliang: {
			// 幻诸葛亮
			经典形象: {
				name: "幻诸葛亮/经典形象/XingXiang",
				x: [0, -0.1],
				y: [0, 0.1],
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.5,
				},
				scale: 0.6,
				angle: 0,
				//speed: 1,
				//action: 'DaiJi',
				beijing: {
					name: "幻诸葛亮/经典形象/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				audio: {
					skill: "幻诸葛亮/经典形象/audio",
					card: "幻诸葛亮/经典形象/audio",
				},
				special: {
					变身: {
						name: "huan_zhugeliang/经典形象2",
					},
					condition: {
						// 限定技
						xiandingji: {
							transform: "变身",
							effect: "shaohui",
						},
					},
				},
			},
			经典形象2: {
				name: "幻诸葛亮/经典形象2/XingXiang",
				x: [0, 0.7],
				y: [0, 0.05],
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
				},
				scale: 0.5,
				angle: 0,
				//speed: 1,
				//action: 'DaiJi',
				audio: {
					skill: "幻诸葛亮/经典形象2/audio",
					card: "幻诸葛亮/经典形象2/audio",
				},
				beijing: {
					name: "幻诸葛亮/经典形象2/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		huaman: {
			// 花鬘
			依心缱绻: {
				name: "花鬘/依心缱绻/XingXiang",
				x: [0, 0.5],
				y: [0, 0.4],
				scale: 0.4,
				angle: 0,
				gongji: {
					action: "TeShu",
					scale: 0.6,
					x: [0, 0.8],
					y: [0, 0.4],
				},
				// speed: 1,
				ss_jinchang: "Chuchang",
				action: "DaiJi",
				beijing: {
					name: "花鬘/依心缱绻/BeiJing",
					scale: 0.3,
					x: [0, 0.7],
					y: [0, 0.5],
				},
			},
		},
		huangchengyan: {
			// 黄承彦
			夜占吉凶: {
				name: "黄承彦/夜占吉凶/xingxiang",
				version: "4.0",
				json: true,
				x: [0, 0.75],
				y: [0, 0.55],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				beijing: {
					name: "黄承彦/夜占吉凶/beijing",
					version: "4.0",
					json: true,
					scale: 0.6,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		huangfusong: {
			// 皇甫嵩
			爆料皮肤: {
				name: "皇甫嵩/爆料皮肤/XingXiang",
				x: [0, 1.05],
				y: [0, 0],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.7,
				},
				beijing: {
					name: "皇甫嵩/爆料皮肤/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		huanggai: {
			// 黄盖
			以身证道: {
				name: "黄盖/以身证道/XingXiang",
				x: [0, 0.5],
				y: [0, 0.3],
				scale: 0.45,
				//speed: 1,
				//action: 'DaiJi',
				beijing: {
					name: "黄盖/以身证道/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		huangwudie: {
			// 黄舞蝶
			云螭献瑞: {
				name: "黄舞蝶/云螭献瑞/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.55],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "黄舞蝶/云螭献瑞/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "黄舞蝶/云螭献瑞/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "黄舞蝶/云螭献瑞/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "黄舞蝶/云螭献瑞/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "黄舞蝶/云螭献瑞/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "黄舞蝶/云螭献瑞/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		huangzhong: {
			// 黄忠
			烈箭贯云: {
				name: "黄忠/烈箭贯云/XingXiang",
				x: [0, 0.5],
				y: [0, 0.4],
				scale: 0.35,
				angle: 0,
				//speed: 1,
				//action: 'DaiJi',
				beijing: {
					name: "黄忠/烈箭贯云/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		jiachong: {
			// 贾充
			妄锋斩龙: {
				name: "贾充/妄锋斩龙/daiji2",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				clipSlots: ["ren_61", "ren_62"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "贾充/妄锋斩龙/chuchang",
					scale: 0.8,
					action: "play",
				},
				gongji: {
					name: "贾充/妄锋斩龙/chuchang",
					scale: 1.0,
					action: "play",
				},
				beijing: {
					name: "贾充/妄锋斩龙/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
		},
		yj_jushou: {
			// 沮授
			落定天元: {
				name: "沮授/落定天元/XingXiang",
				x: [0, -0.35],
				y: [0, 0.35],
				scale: 0.4,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "沮授/落定天元/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		liru: {
			// 李儒
			烈火焚城: {
				name: "李儒/烈火焚城/daiji2",
				x: [0, 0.42],
				y: [0, 0.51],
				scale: 0.72,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "李儒/烈火焚城/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "李儒/烈火焚城/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "李儒/烈火焚城/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
			鸩杀少帝: {
				name: "李儒/鸩杀少帝/XingXiang",
				x: [0, 0.2],
				y: [0, 0.17],
				scale: 0.5,
				angle: 10,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "李儒/鸩杀少帝/BeiJing",
					scale: 0.3,
					x: [0, 1.7],
					y: [0, 0.5],
				},
			},
		},
		lingtong: {
			// 凌统
			转战回击: {
				name: "凌统/转战回击/xingxiang",
				version: "4.0",
				json: true,
				x: [0, 0.3],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				beijing: {
					name: "凌统/转战回击/beijing",
					version: "4.0",
					json: true,
					scale: 0.5,
					x: [0, 0.3],
					y: [0, 0.5],
				},
			},
		},
		liubei: {
			// 刘备
			逐鹿天下: {
				name: "刘备/逐鹿天下/XingXiang",
				x: [0, 1.2],
				y: [0, 0.3],
				scale: 0.45,
				angle: 0,
				clipSlots: ["longshenti", "longshenti01", "bgyun6"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "刘备/逐鹿天下/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
			阑珊灯火: {
				name: "刘备/阑珊灯火/xingxiang",
				version: "4.0",
				json: true,
				x: [0, 1],
				y: [0, 0.25],
				scale: 1,
				angle: 0,
				// speed: 1,
				beijing: {
					name: "刘备/阑珊灯火/beijing",
					version: "4.0",
					json: true,
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.5,
				},
			},
		},
		liuyan: {
			// 刘焉
			秋霜金枫: {
				name: "刘焉/秋霜金枫/daiji2",
				teshu: {
					name: "刘焉/秋霜金枫/chuchang2",
					action: ["jineng"],
					scale: 0.65,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.31],
				y: [0, 0.37],
				scale: 1.1,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "刘焉/秋霜金枫/chuchang",
					action: "play",
					scale: 0.75,
				},
				gongji: {
					name: "刘焉/秋霜金枫/chuchang2",
					action: ["gongji"],
					scale: 0.65,
				},
				beijing: {
					name: "刘焉/秋霜金枫/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
				zhishixian: {
					name: "刘焉/秋霜金枫/shouji2",
					scale: 0.5,
					speed: 0.5,
					delay: 0.4,
					effect: {
						name: "刘焉/秋霜金枫/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.25,
					},
				},
			},
			雄踞益州: {
				name: "刘焉/雄踞益州/XingXiang",
				x: [0, 0.5],
				y: [0, 0.11],
				scale: 0.56,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "刘焉/雄踞益州/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		liuzan: {
			// 留赞
			灵魂歌王: {
				name: "留赞/灵魂歌王/XingXiang",
				x: [0, -0.2],
				y: [0, 0.0],
				scale: 0.5,
				angle: 15,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "留赞/灵魂歌王/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		lukai: {
			// 陆凯
			雷骁斥遒: {
				name: "陆凯/雷骁斥遒/daiji2",
				x: [0, 0.5],
				y: [0, 0.4],
				scale: 1,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "陆凯/雷骁斥遒/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "陆凯/雷骁斥遒/chuchang",
					action: "play",
					scale: 0.9,
				},
				beijing: {
					name: "陆凯/雷骁斥遒/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		luyi: {
			// 卢弈
			姝丽风华: {
				name: "卢弈/姝丽风华/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.55],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "卢弈/姝丽风华/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "卢弈/姝丽风华/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "卢弈/姝丽风华/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "卢弈/姝丽风华/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "卢弈/姝丽风华/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "卢弈/姝丽风华/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		luxun: {
			//陆逊
			烈火烛天: {
				name: "陆逊/烈火烛天/XingXiang",
				x: [0, -0.5],
				y: [0, 0.25],
				scale: 0.5,
				angle: 0,
				//speed: 1,
				//action: 'DaiJi',
				beijing: {
					name: "陆逊/烈火烛天/BeiJing",
					scale: 0.3,
					x: [0, 0.76],
					y: [0, 0.5],
				},
			},
		},
		luyusheng: {
			// 陆郁生
			战场绝版: {
				name: "陆郁生/战场绝版/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.55],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "陆郁生/战场绝版/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "陆郁生/战场绝版/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "陆郁生/战场绝版/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "陆郁生/战场绝版/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "陆郁生/战场绝版/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "陆郁生/战场绝版/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		luzhi: {
			// 卢植
			抒墨谏策: {
				name: "卢植/抒墨谏策/daiji2",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "卢植/抒墨谏策/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "卢植/抒墨谏策/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "卢植/抒墨谏策/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		lvbu: {
			// 吕布
			傲睨万物: {
				name: "吕布/傲睨万物/XingXiang",
				x: [0, 0.3],
				y: [0, 0.4],
				scale: 0.45,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "吕布/傲睨万物/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		lvlingqi: {
			// 吕玲绮
			炽焱流金: {
				name: "吕玲绮/炽焱流金/daiji2",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "吕玲绮/炽焱流金/chuchang",
					scale: 1,
					action: "play",
				},
				gongji: {
					name: "吕玲绮/炽焱流金/chuchang",
					scale: 1.2,
					action: "play",
				},
				beijing: {
					name: "吕玲绮/炽焱流金/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
			冰魄映雪: {
				name: "吕玲绮/冰魄映雪/daiji2",
				teshu: {
					name: "吕玲绮/冰魄映雪/chuchang2",
					action: ["jineng"],
					scale: 0.7,
				},
				shan: "play3",
				play2: "play2",
				x: [0, 0.5],
				y: [0, 0.55],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "吕玲绮/冰魄映雪/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "吕玲绮/冰魄映雪/chuchang2",
					action: ["gongji"],
					scale: 0.7,
				},
				beijing: {
					name: "吕玲绮/冰魄映雪/beijing",
					x: [0, 0.3],
					y: [0, 0.5],
					scale: 0.4,
				},
				zhishixian: {
					name: "吕玲绮/冰魄映雪/shouji2",
					scale: 0.5,
					speed: 0.6,
					delay: 0.4,
					effect: {
						name: "吕玲绮/冰魄映雪/shouji",
						scale: 0.5,
						speed: 0.6,
						delay: 0.25,
					},
				},
			},
		},
		luotong: {
			// 骆统
			落笔生花: {
				name: "骆统/落笔生花/XingXiang",
				x: [0, 0.3],
				y: [0, 0.1],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "骆统/落笔生花/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		majun: {
			// 马钧
			能工巧匠: {
				name: "马钧/能工巧匠/XingXiang",
				x: [0, 0.4],
				y: [0, 0.2],
				scale: 0.4,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "马钧/能工巧匠/BeiJing",
					scale: 0.3,
					x: [0, -0.8],
					y: [0, 0.5],
				},
			},
		},
		miheng: {
			// 祢衡
			击鼓骂曹: {
				name: "祢衡/击鼓骂曹/XingXiang",
				x: [0, 0.3],
				y: [0, 0.2],
				scale: 0.55,
				angle: 0,
				clipSlots: ["JS_tou", "JS_shen", "JS_youtui", "JS_zuotui"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "祢衡/击鼓骂曹/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		moqiongshu: {
			// 莫琼树
			姝丽风华: {
				name: "莫琼树/姝丽风华/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.55],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "莫琼树/姝丽风华/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "莫琼树/姝丽风华/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "莫琼树/姝丽风华/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "莫琼树/姝丽风华/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "莫琼树/姝丽风华/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "莫琼树/姝丽风华/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		nanhualaoxian: {
			// 南华老仙
			丰年映雪: {
				name: "南华老仙/丰年映雪/daiji2",
				teshu: {
					name: "南华老仙/丰年映雪/chuchang2",
					action: ["jineng"],
					scale: 0.6,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.55],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "南华老仙/丰年映雪/chuchang",
					action: "play",
					scale: 0.6,
				},
				gongji: {
					name: "南华老仙/丰年映雪/chuchang2",
					action: ["gongji"],
					scale: 0.6,
				},
				beijing: {
					name: "南华老仙/丰年映雪/beijing",
					x: [0, 1],
					y: [0, 0.5],
					scale: 0.4,
				},
				zhishixian: {
					name: "南华老仙/丰年映雪/shouji2",
					scale: 0.7,
					speed: 0.8,
					delay: 0.4,
					effect: {
						name: "南华老仙/丰年映雪/shouji",
						scale: 0.5,
						speed: 1,
						delay: 0.4,
					},
				},
			},
			野鹤闲云: {
				name: "南华老仙/野鹤闲云/XingXiang",
				x: [0, 1.7],
				y: [0, 0.0],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "南华老仙/野鹤闲云/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			冠绝天下: {
				name: "南华老仙/冠绝天下/XingXiang",
				x: [0, 0.6],
				y: [0, 0.3],
				scale: 0.45,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "南华老仙/冠绝天下/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
			着墨山河: {
				name: "南华老仙/着墨山河/daiji",
				x: [0, 0.55],
				y: [0, 0.3],
				scale: 0.9,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "南华老仙/着墨山河/xingxiang",
					scale: 1,
					json: true,
					action: "HuDong",
				},
				gongji: {
					name: "南华老仙/着墨山河/xingxiang",
					scale: 1,
					json: true,
					action: "GongJi",
				},
				teshu: {
					name: "南华老仙/着墨山河/xingxiang",
					scale: 1,
					json: true,
					action: "JiNeng",
				},
				qianjing: {
					name: "南华老仙/着墨山河/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 1,
				},
				beijing: {
					name: "南华老仙/着墨山河/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					x: [0, 0.55],
					y: [0, 0.3],
					scale: 0.9,
					version: "4.0",
					json: true,
				},
			},
		},
		panshu: {
			// 潘淑
			江东锦绣: {
				name: "潘淑/江东锦绣/xingxiang",
				version: "4.0",
				shizhounian: true,
				x: [0, 0.4],
				y: [0, 0.5],
				scale: 0.65,
				angle: 0,
				// speed: 1,
				chuchang: {
					name: "潘淑/江东锦绣/jineng01",
					version: "4.0",
					scale: 0.6,
					action: "play",
				},
				gongji: {
					name: "潘淑/江东锦绣/jineng01",
					version: "4.0",
					scale: 0.7,
					action: "play",
				},
				beijing: {
					name: "潘淑/江东锦绣/beijing",
					version: "4.0",
					scale: 0.7,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				zhishixian: {
					name: "潘淑/江东锦绣/jineng02",
					version: "4.0",
					scale: 0.5,
					speed: 0.8,
					delay: 0.3,
				},
			},
		},
		puyuan: {
			// 蒲元
			战场绝版: {
				name: "蒲元/战场绝版/daiji2",
				teshu: {
					name: "蒲元/战场绝版/chuchang2",
					action: ["jineng"],
					scale: 0.7,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.41],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "蒲元/战场绝版/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "蒲元/战场绝版/chuchang2",
					action: ["gongji"],
					scale: 0.7,
				},
				beijing: {
					name: "蒲元/战场绝版/beijing",
					x: [0, 0.4],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "蒲元/战场绝版/shouji2",
					scale: 0.5,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "蒲元/战场绝版/shouji",
						scale: 0.6,
						speed: 0.8,
						delay: 0.5,
					},
				},
			},
			百战神机: {
				name: "蒲元/百战神机/daiji",
				x: [0, 0.55],
				y: [0, 0.2],
				scale: 1.2,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "蒲元/百战神机/xingxiang",
					scale: 1.2,
					json: true,
					action: "HuDong",
				},
				gongji: {
					name: "蒲元/百战神机/xingxiang",
					scale: 1.2,
					json: true,
					action: "GongJi",
				},
				teshu: {
					name: "蒲元/百战神机/xingxiang",
					showTime: 1.6,
					scale: 1.2,
					json: true,
					action: "JiNeng",
				},
				qianjing: {
					name: "蒲元/百战神机/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 1.2,
				},
				beijing: {
					name: "蒲元/百战神机/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					x: [0, 0.69],
					y: [0, 0.42],
					version: "4.0",
					json: true,
					scale: 0.82,
				},
			},
		},
		qinghegongzhu: {
			//清河公主
			荷怜清盈: {
				name: "清河公主/荷怜清盈/xingxiang",
				version: "4.0",
				json: true,
				x: [0, 0.5],
				y: [0, 0.3],
				scale: 0.9,
				angle: 0,
				// speed: 1,
				beijing: {
					name: "清河公主/荷怜清盈/beijing",
					version: "4.0",
					json: true,
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.9,
				},
			},
		},
		ruanyu: {
			// 阮瑀
			墨卷浩瀚: {
				name: "阮瑀/墨卷浩瀚/daiji2",
				x: [0, 0.41],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "阮瑀/墨卷浩瀚/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "阮瑀/墨卷浩瀚/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "阮瑀/墨卷浩瀚/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		ruiji: {
			// 芮姬
			玉芮花意: {
				name: "芮姬/玉芮花意/xingxiang",
				version: "4.0",
				json: true,
				shizhounian: true,
				x: [0, 0.9],
				y: [0, 0.5],
				scale: 0.7,
				angle: 0,
				clipSlots: ["ruiji_mawei3", "ruiji_mawei4", "ruiji_mawei5", "ruiji_mawei6", "ruiji_mawei7"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				chuchang: {
					name: "芮姬/玉芮花意/jineng01",
					version: "4.0",
					json: true,
					scale: 1.3,
					action: "play",
				},
				gongji: {
					name: "芮姬/玉芮花意/jineng01",
					version: "4.0",
					json: true,
					scale: 1.5,
					action: "play",
				},
				beijing: {
					name: "芮姬/玉芮花意/beijing",
					version: "4.0",
					json: true,
					scale: 0.6,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				zhishixian: {
					name: "芮姬/玉芮花意/jineng02",
					version: "4.0",
					json: true,
					scale: 0.5,
					speed: 0.4,
					delay: 0.4,
				},
			},
		},
		// taffy: 十常侍动皮显示异常
		scs_zhangrang: {
			// 十常侍张让
			爆料皮肤: {
				name: "十常侍/爆料皮肤/张让/XingXiang",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "十常侍/爆料皮肤/张让/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		scs_zhaozhong: {
			// 十常侍赵忠
			爆料皮肤: {
				name: "十常侍/爆料皮肤/赵忠/XingXiang",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "十常侍/爆料皮肤/赵忠/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		scs_sunzhang: {
			// 十常侍孙璋
			爆料皮肤: {
				name: "十常侍/爆料皮肤/孙璋/XingXiang",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "十常侍/爆料皮肤/孙璋/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		scs_bilan: {
			// 十常侍毕岚
			爆料皮肤: {
				name: "十常侍/爆料皮肤/毕岚/XingXiang",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "十常侍/爆料皮肤/毕岚/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		scs_xiayun: {
			// 十常侍夏恽
			爆料皮肤: {
				name: "十常侍/爆料皮肤/夏恽/XingXiang",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "十常侍/爆料皮肤/夏恽/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		scs_hankui: {
			// 十常侍韩悝
			爆料皮肤: {
				name: "十常侍/爆料皮肤/韩悝/XingXiang",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "十常侍/爆料皮肤/韩悝/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		scs_lisong: {
			// 十常侍栗嵩
			爆料皮肤: {
				name: "十常侍/爆料皮肤/栗嵩/XingXiang",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "十常侍/爆料皮肤/栗嵩/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		scs_duangui: {
			// 十常侍段珪
			爆料皮肤: {
				name: "十常侍/爆料皮肤/段珪/XingXiang",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "十常侍/爆料皮肤/段珪/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		scs_guosheng: {
			// 十常侍郭胜
			爆料皮肤: {
				name: "十常侍/爆料皮肤/郭胜/XingXiang",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "十常侍/爆料皮肤/郭胜/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		scs_gaowang: {
			// 十常侍高望
			爆料皮肤: {
				name: "十常侍/爆料皮肤/高望/XingXiang",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "十常侍/爆料皮肤/高望/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		shamoke: {
			// 沙摩柯
			骁勇金衔: {
				name: "沙摩柯/骁勇金衔/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.7],
				y: [0, 0.45],
				scale: 0.9,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "沙摩柯/骁勇金衔/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "沙摩柯/骁勇金衔/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "沙摩柯/骁勇金衔/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "沙摩柯/骁勇金衔/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "沙摩柯/骁勇金衔/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "沙摩柯/骁勇金衔/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		shen_caocao: {
			// 神曹操
			四方归心: {
				name: "神曹操/四方归心/XingXiang",
				x: [0, 0.4],
				y: [0, 0],
				scale: 0.6,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神曹操/四方归心/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		shen_dengai: {
			// 神邓艾
			巨灵撼宇: {
				name: "神邓艾/巨灵撼宇/daiji2",
				teshu: {
					name: "神邓艾/巨灵撼宇/chuchang2",
					action: ["jineng"],
					scale: 0.7,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.45],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				clipSlots: ["texiao/pan00"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "神邓艾/巨灵撼宇/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "神邓艾/巨灵撼宇/chuchang2",
					action: ["gongji"],
					scale: 0.7,
				},
				beijing: {
					name: "神邓艾/巨灵撼宇/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "神邓艾/巨灵撼宇/shouji2",
					scale: 0.5,
					speed: 0.6,
					delay: 0.2,
					factor: 0.5,
					effect: {
						name: "神邓艾/巨灵撼宇/shouji",
						scale: 0.4,
						speed: 0.8,
						delay: 0.3,
						factor: 0.5,
					},
				},
			},
		},
		shen_ganning: {
			// 神甘宁
			万人辟易: {
				name: "神甘宁/万人辟易/XingXiang",
				x: [0, 0.1],
				y: [0, 0.3],
				scale: 0.4,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神甘宁/万人辟易/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		shen_guanyu: {
			// 神关羽
			血海罗刹: {
				name: "神关羽/血海罗刹/XingXiang",
				x: [0, 2.3],
				y: [0, 0.2],
				scale: 0.6,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神关羽/血海罗刹/BeiJing",
					scale: 0.6,
					x: [0, 2.3],
					y: [0, 0.2],
				},
			},
		},
		shen_guojia: {
			// 神郭嘉
			倚星折月: {
				name: "神郭嘉/倚星折月/XingXiang",
				x: [0, -0.05],
				y: [0, 0.45],
				scale: 0.4,
				angle: 0,
				clipSlots: ["yue", "lun"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神郭嘉/倚星折月/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				audio: {
					skill: "神郭嘉/倚星折月/audio",
					card: "神郭嘉/倚星折月/audio",
				},
				special: {
					觉醒: {
						name: "shen_guojia/倚星折月2",
					},
					play: {
						name: "神郭嘉/倚星折月2/XingXiang-1",
						action: "TeShu",
						x: [0, 0.5],
						y: [0, 0.5],
						scale: 0.6,
						// audio: '神郭嘉/倚星折月2/audio/victory',
						delay: 1,
					},
					condition: {
						juexingji: {
							transform: "觉醒",
							effect: "shaohui",
							play: "play",
						},
					},
				},
			},
			倚星折月2: {
				name: "神郭嘉/倚星折月2/XingXiang-1",
				x: [0, -0.05],
				y: [0, 0.45],
				scale: 0.4,
				angle: 0,
				clipSlots: ["yue", "yuelunzhuangshi1", "yuelunzhuangshi2"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				// action: 'DaiJi',
				audio: {
					skill: "神郭嘉/倚星折月2/audio",
					card: "神郭嘉/倚星折月2/audio",
				},
				beijing: {
					name: "神郭嘉/倚星折月2/BeiJing-1",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		shen_huatuo: {
			// 神华佗
			五灵济世: {
				name: "神华佗/五灵济世/XingXiang",
				x: [0, 0.1],
				y: [0, 0.2],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神华佗/五灵济世/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		shen_jiangwei: {
			// 神姜维
			炽剑补天: {
				name: "神姜维/炽剑补天/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "神姜维/炽剑补天/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "神姜维/炽剑补天/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "神姜维/炽剑补天/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "神姜维/炽剑补天/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				audio: {
					skill: "神姜维/炽剑补天/audio",
				},
				zhishixian: {
					name: "神姜维/炽剑补天/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "神姜维/炽剑补天/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		shen_lvmeng: {
			// 神吕蒙
			兼资文武: {
				name: "神吕蒙/兼资文武/XingXiang",
				x: [0, 0.1],
				y: [0, 0.36],
				scale: 0.4,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神吕蒙/兼资文武/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
					hideSlots: ["beijing_00", "beijing_01", "beijing_02", "beijing_03", "beijing_04", "beijing_05", "beijing_06", "beijing_07", "beijing_08", "beijing_09", "beijing_10", "beijing_11", "beijing_12", "beijing_13", "beijing_14"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
			},
		},
		shen_machao: {
			// 神马超
			迅骛惊雷: {
				name: "神马超/迅骛惊雷/daiji2",
				teshu: {
					name: "神马超/迅骛惊雷/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.45],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "神马超/迅骛惊雷/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "神马超/迅骛惊雷/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				beijing: {
					name: "神马超/迅骛惊雷/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "神马超/迅骛惊雷/shouji2",
					scale: 0.5,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "神马超/迅骛惊雷/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		shen_pangtong: {
			// 神庞统
			臻华福天: {
				name: "神庞统/臻华福天/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.4],
				scale: 1,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "神庞统/臻华福天/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "神庞统/臻华福天/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "神庞统/臻华福天/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "神庞统/臻华福天/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "神庞统/臻华福天/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "神庞统/臻华福天/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		shen_simayi: {
			// 神司马懿
			鉴往知来: {
				name: "神司马懿/鉴往知来/XingXiang",
				x: [0, 0.46],
				y: [0, 0.07],
				scale: 0.58,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神司马懿/鉴往知来/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		shen_sunce: {
			// 神孙策
			霸王再世: {
				name: "神孙策/霸王再世/XingXiang",
				x: [0, 0.23],
				y: [0, 0.54],
				scale: 0.3,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神孙策/霸王再世/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		shen_xuzhu: {
			// 神许褚
			摧城拔山: {
				name: "神许褚/摧城拔山/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "神许褚/摧城拔山/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "神许褚/摧城拔山/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "神许褚/摧城拔山/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "神许褚/摧城拔山/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "神许褚/摧城拔山/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "神许褚/摧城拔山/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		shen_xunyu: {
			// 神荀彧
			匡汉延祚: {
				name: "神荀彧/匡汉延祚/XingXiang",
				x: [0, 0.5],
				y: [0, 0],
				scale: 0.5,
				angle: 0,
				hideSlots: ["guangxian"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				clipSlots: ["qiu"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神荀彧/匡汉延祚/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		shen_zhangfei: {
			// 神张飞
			傲睨山河: {
				name: "神张飞/傲睨山河/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "神张飞/傲睨山河/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "神张飞/傲睨山河/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "神张飞/傲睨山河/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "神张飞/傲睨山河/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				audio: {
					skill: "神张飞/傲睨山河/audio",
				},
				zhishixian: {
					name: "神张飞/傲睨山河/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "神张飞/傲睨山河/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		shen_zhangjiao: {
			// 神张角
			驭道震泽: {
				name: "神张角/驭道震泽/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "神张角/驭道震泽/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "神张角/驭道震泽/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "神张角/驭道震泽/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "神张角/驭道震泽/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				audio: {
					skill: "神张角/驭道震泽/audio",
				},
				zhishixian: {
					name: "神张角/驭道震泽/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "神张角/驭道震泽/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		shen_zhaoyun: {
			// 神赵云
			神龙佑主: {
				name: "神赵云/神龙佑主/daiji2",
				x: [0, 0.4],
				y: [0, 0.52],
				scale: 0.8,
				angle: 10,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "神赵云/神龙佑主/chuchang",
					scale: 1,
					action: "play",
				},
				gongji: {
					name: "神赵云/神龙佑主/chuchang",
					scale: 1.2,
					action: "play",
				},
				beijing: {
					name: "神赵云/神龙佑主/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
			战龙在野: {
				name: "神赵云/战龙在野/XingXiang",
				x: [0, 0.5],
				y: [0, 0.2],
				scale: 0.76,
				angle: -10,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神赵云/战龙在野/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			龙腾虎跃: {
				name: "神赵云/龙腾虎跃/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.45],
				y: [0, 0.55],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "神赵云/龙腾虎跃/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "神赵云/龙腾虎跃/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "神赵云/龙腾虎跃/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "神赵云/龙腾虎跃/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "神赵云/龙腾虎跃/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "神赵云/龙腾虎跃/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		shen_zhouyu: {
			// 神周瑜
			红莲业火: {
				name: "神周瑜/红莲业火/daiji2",
				x: [0, 0.43],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "神周瑜/红莲业火/chuchang",
					scale: 0.8,
					action: "play",
				},
				gongji: {
					name: "神周瑜/红莲业火/chuchang",
					scale: 1,
					action: "play",
				},
				beijing: {
					name: "神周瑜/红莲业火/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
			陵光引灵: {
				name: "神周瑜/陵光引灵/XingXiang",
				x: [0, 0.34],
				y: [0, -0.18],
				scale: 0.76,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神周瑜/陵光引灵/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			焰腾麒麟: {
				name: "神周瑜/焰腾麒麟/XingXiang",
				x: [0, -0.3],
				y: [0, 0.44],
				scale: 0.6,
				angle: -10,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "神周瑜/焰腾麒麟/BeiJing",
					scale: 0.25,
					x: [0, 0.75],
					y: [0, 0.5],
				},
			},
		},
		simahui: {
			// 司马徽
			教诲不倦: {
				name: "司马徽/教诲不倦/daiji2",
				x: [0, 0.5],
				y: [0, 0.65],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "司马徽/教诲不倦/chuchang",
					scale: 0.9,
					action: "play",
				},
				gongji: {
					name: "司马徽/教诲不倦/chuchang",
					scale: 1.1,
					action: "play",
				},
				beijing: {
					name: "司马徽/教诲不倦/beijing",
					x: [0, 0.25],
					y: [0, 0.48],
					scale: 0.3,
				},
			},
		},
		simashi: {
			//司马师
			目痛欲狂: {
				name: "司马师/目痛欲狂/XingXiang",
				x: [0, 0.8],
				y: [0, 0.5],
				scale: 0.45,
				//speed: 1,
				//action: 'DaiJi',
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.8,
				},
				beijing: {
					name: "司马师/目痛欲狂/BeiJing",
					x: [0, 0.8],
					y: [0, 0.4],
					scale: 0.3,
				},
			},
		},
		simayi: {
			// 司马懿
			重张区宇: {
				name: "司马懿/重张区宇/XingXiang",
				x: [0, -0.25],
				y: [0, 0.1],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "司马懿/重张区宇/BeiJing",
					x: [0, -0.25],
					y: [0, 0.1],
					scale: 0.5,
				},
			},
		},
		sb_simayi: {
			// 谋司马懿
			隐龙如晦: {
				name: "谋司马懿/隐龙如晦/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.4],
				scale: 1,
				angle: 0,
				// speed: 1,
				// shizhounian: true,
				ss_jinchang: "play4",
				chuchang: {
					name: "谋司马懿/隐龙如晦/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "谋司马懿/隐龙如晦/chuchang2",
					action: "gongji",
					scale: 0.8,
				},
				teshu: {
					name: "谋司马懿/隐龙如晦/chuchang2",
					action: "jineng",
					scale: 0.8,
				},
				audio: {
					skill: "谋司马懿/隐龙如晦/audio",
				},
				beijing: {
					name: "谋司马懿/隐龙如晦/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
					ss_jinchang: "play3",
				},
				zhishixian: {
					name: "谋司马懿/隐龙如晦/shouji2",
					scale: 0.7,
					speed: 0.8,
					delay: 0.3,
					effect: {
						name: "谋司马懿/隐龙如晦/shouji",
						scale: 0.65,
						speed: 0.6,
						delay: 0.4,
					},
				},
				special: {
					转换: {
						name: "sb_simayi/隐龙如晦2",
					},
					condition: {
						zhuanhuanji: {
							transform: ["转换"],
							effect: "shaohui",
						},
					},
				},
			},
			隐龙如晦2: {
				name: "谋司马懿/隐龙如晦2/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.4],
				scale: 1,
				angle: 0,
				// speed: 1,
				// shizhounian: true,
				ss_jinchang: "play4",
				chuchang: {
					name: "谋司马懿/隐龙如晦2/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "谋司马懿/隐龙如晦2/chuchang2",
					action: "gongji",
					scale: 0.8,
				},
				teshu: {
					name: "谋司马懿/隐龙如晦2/chuchang2",
					action: "jineng",
					scale: 0.8,
				},
				audio: {
					skill: "谋司马懿/隐龙如晦2/audio",
				},
				beijing: {
					name: "谋司马懿/隐龙如晦2/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
					ss_jinchang: "play3",
				},
				zhishixian: {
					name: "谋司马懿/隐龙如晦2/shouji2",
					scale: 0.6,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "谋司马懿/隐龙如晦2/shouji",
						scale: 0.6,
						speed: 0.8,
						delay: 0.4,
					},
				},
				special: {
					转换: {
						name: "sb_simayi/隐龙如晦",
					},
					condition: {
						zhuanhuanji: {
							transform: ["转换"],
							effect: "shaohui",
						},
					},
				},
			},
		},
		simazhao: {
			// 司马昭
			昭威淮南: {
				name: "司马昭/昭威淮南/XingXiang",
				x: [0, 0.7],
				y: [0, 0.1],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "司马昭/昭威淮南/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				special: {
					变身: {
						name: "simazhao/昭威淮南2",
					},
					condition: {
						// 限定技
						xiandingji: {
							transform: "变身",
							effect: "shaohui",
						},
					},
				},
			},
			昭威淮南2: {
				name: "司马昭/昭威淮南2/XingXiang",
				x: [0, 0],
				y: [0, 0.5],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "司马昭/昭威淮南2/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		sunce: {
			// 孙策
			虎踞江东: {
				name: "孙策/虎踞江东/XingXiang",
				x: [0, 0.4],
				y: [0, 0.25],
				scale: 0.4,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "孙策/虎踞江东/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		sunhanhua: {
			// 孙寒华
			威灵尽显: {
				name: "孙寒华/威灵尽显/XingXiang",
				x: [0, 0.55],
				y: [0, 0.35],
				scale: 0.45,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "孙寒华/威灵尽显/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		sunjian: {
			// 孙坚
			武烈开疆: {
				name: "孙坚/武烈开疆/XingXiang",
				x: [0, -0.05],
				y: [0, 0.25],
				scale: 0.45,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "孙坚/武烈开疆/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		sunlingluan: {
			// 孙翎鸾
			鸾心初动: {
				name: "孙翎鸾/鸾心初动/daiji2",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "孙翎鸾/鸾心初动/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "孙翎鸾/鸾心初动/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "孙翎鸾/鸾心初动/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
		},
		sunluyu: {
			// 孙鲁育
			娇巧伶俐: {
				name: "孙鲁育/娇巧伶俐/daiji2",
				x: [0, 0.4],
				y: [0, 0.41],
				scale: 0.88,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "孙鲁育/娇巧伶俐/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "孙鲁育/娇巧伶俐/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "孙鲁育/娇巧伶俐/beijing",
					x: [0, 1.2],
					y: [0, 0.39],
					scale: 0.4,
				},
			},
			牛年端午: {
				name: "孙鲁育/牛年端午/XingXiang",
				x: [0, 0.02],
				y: [0, 0.3],
				scale: 0.38,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "孙鲁育/牛年端午/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			沅茝香兰: {
				name: "孙鲁育/沅茝香兰/daiji2",
				x: [0, 0.38],
				y: [0, 0.36],
				scale: 1.05,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "孙鲁育/沅茝香兰/chuchang",
					scale: 0.6,
					action: "play",
				},
				gongji: {
					name: "孙鲁育/沅茝香兰/chuchang",
					scale: 0.8,
					action: "play",
				},
				beijing: {
					name: "孙鲁育/沅茝香兰/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
			猪年春节: {
				name: "孙鲁育/猪年春节/XingXiang",
				x: [0, 0.26],
				y: [0, 0.28],
				scale: 0.46,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "孙鲁育/猪年春节/BeiJing",
					scale: 0.25,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		sunquan: {
			// 孙权
			永开吴祚: {
				name: "孙权/永开吴祚/XingXiang",
				x: [0, 0.5],
				y: [0, 0.15],
				scale: 0.45,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "孙权/永开吴祚/BeiJing",
					scale: 0.25,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		sunru: {
			// 孙茹
			花容月貌: {
				name: "孙茹/花容月貌/XingXiang",
				x: [0, 0.58],
				y: [0, 0.13],
				scale: 0.55,
				angle: 10,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "孙茹/花容月貌/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			烟水悠悠: {
				name: "孙茹/烟水悠悠/XingXiang",
				x: [0, 0.3],
				y: [0, -0.32],
				scale: 0.76,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "孙茹/烟水悠悠/BeiJing",
					scale: 0.25,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			鱼游濠水: {
				name: "孙茹/鱼游濠水/XingXiang",
				x: [0, 0.78],
				y: [0, 0.08],
				scale: 0.6,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "孙茹/鱼游濠水/BeiJing",
					scale: 0.25,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
			月兔琼香: {
				name: "孙茹/月兔琼香/daiji2",
				teshu: {
					name: "孙茹/月兔琼香/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "孙茹/月兔琼香/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "孙茹/月兔琼香/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				beijing: {
					name: "孙茹/月兔琼香/beijing",
					x: [0, 0.8],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "孙茹/月兔琼香/shouji2",
					scale: 0.5,
					speed: 0.8,
					delay: 0.4,
					effect: {
						name: "孙茹/月兔琼香/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		sunyi: {
			// 孙翊
			腾龙翻江: {
				name: "孙翊/腾龙翻江/daiji2",
				x: [0, 0.6],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "孙翊/腾龙翻江/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "孙翊/腾龙翻江/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "孙翊/腾龙翻江/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
		},
		tengfanglan: {
			// 滕芳兰
			脂车香姝: {
				name: "滕芳兰/脂车香姝/xingxiang",
				version: "4.0",
				json: true,
				shizhounian: true,
				x: [0, 0.5],
				y: [0, 0.45],
				scale: 0.7,
				angle: 0,
				clipSlots: ["tengfanglan181", "tengfanglan180", "tengfanglan178", "tengfanglan179", "tengfanglan177", "tengfanglan169", "tengfanglan174", "tengfanglan173", "tengfanglan172", "tengfanglan171", "tengfanglan176", "tengfanglan175", "tengfanglan170", "tengfanglan168", "tengfanglan167", "tengfanglan166", "tengfanglan165", "tengfanglan164", "tengfanglan163", "tengfanglan162", "tengfanglan161", "tengfanglan160", "tengfanglan159", "tengfanglan158", "tengfanglan157", "tengfanglan156", "tengfanglan155", "tengfanglan154", "tengfanglan153", "tengfanglan152", "tengfanglan151"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				chuchang: {
					name: "滕芳兰/脂车香姝/jineng01",
					version: "4.0",
					json: true,
					scale: 1.3,
					action: "play",
				},
				gongji: {
					name: "滕芳兰/脂车香姝/jineng01",
					version: "4.0",
					json: true,
					scale: 1.5,
					action: "play",
				},
				beijing: {
					name: "滕芳兰/脂车香姝/beijing",
					version: "4.0",
					json: true,
					scale: 0.6,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				zhishixian: {
					name: "滕芳兰/脂车香姝/jineng02",
					version: "4.0",
					json: true,
					scale: 0.8,
					speed: 0.9,
					delay: 0.3,
				},
			},
			皓露沁兰: {
				name: "滕芳兰/皓露沁兰/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "滕芳兰/皓露沁兰/chuchang",
					action: "play",
					scale: 0.65,
				},
				gongji: {
					name: "滕芳兰/皓露沁兰/chuchang2",
					action: "gongji",
					scale: 0.65,
				},
				teshu: {
					name: "滕芳兰/皓露沁兰/chuchang2",
					action: "jineng",
					scale: 0.65,
				},
				beijing: {
					name: "滕芳兰/皓露沁兰/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "滕芳兰/皓露沁兰/shouji2",
					scale: 0.5,
					speed: 0.8,
					delay: 0.5,
					effect: {
						name: "滕芳兰/皓露沁兰/shouji",
						scale: 0.5,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		tenggongzhu: {
			// 滕公主
			菡萏慕卿: {
				name: "滕公主/菡萏慕卿/daiji2",
				teshu: {
					name: "滕公主/菡萏慕卿/chuchang2",
					action: ["jineng"],
					scale: 0.7,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.52],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "滕公主/菡萏慕卿/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "滕公主/菡萏慕卿/chuchang2",
					action: ["gongji"],
					scale: 0.7,
				},
				beijing: {
					name: "滕公主/菡萏慕卿/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "滕公主/菡萏慕卿/shouji2",
					scale: 0.5,
					speed: 0.8,
					delay: 0.3,
					effect: {
						name: "滕公主/菡萏慕卿/shouji",
						scale: 0.6,
						speed: 0.8,
						delay: 0.6,
					},
				},
			},
		},
		wanglang: {
			// 王朗
			骧龙御宇: {
				name: "王朗/骧龙御宇/daiji2",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "王朗/骧龙御宇/chuchang",
					scale: 0.9,
					action: "play",
				},
				gongji: {
					name: "王朗/骧龙御宇/chuchang",
					scale: 1.1,
					action: "play",
				},
				beijing: {
					name: "王朗/骧龙御宇/beijing",
					x: [0, -0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
		},
		wangyuanji: {
			// 王元姬
			鼠年冬至: {
				name: "王元姬/鼠年冬至/XingXiang",
				x: [0, 0.22],
				y: [0, 0.58],
				scale: 0.58,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "王元姬/鼠年冬至/BeiJing",
					scale: 0.3,
					x: [0, 0.1],
					y: [0, 0.5],
				},
			},
		},
		wenyang: {
			// 文鸯
			势若万钧: {
				name: "文鸯/势若万钧/XingXiang",
				x: [0, 0.5],
				y: [0, 0.35],
				scale: 0.45,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "文鸯/势若万钧/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			破云翔宇魏: {
				name: "文鸯/破云翔宇魏/XingXiang",
				x: [0, 0.2],
				y: [0, 0],
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.5,
				},
				scale: 0.6,
				angle: 0,
				//speed: 1,
				//action: 'DaiJi',
				beijing: {
					name: "文鸯/破云翔宇魏/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				audio: {
					skill: "文鸯/破云翔宇魏/audio",
					card: "文鸯/破云翔宇魏/audio",
				},
			},
			破云翔宇吴: {
				name: "文鸯/破云翔宇吴/XingXiang",
				x: [0, 0.35],
				y: [0, 0.6],
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
				},
				scale: 0.45,
				angle: 0,
				//speed: 1,
				//action: 'DaiJi',
				audio: {
					skill: "文鸯/破云翔宇吴/audio",
					card: "文鸯/破云翔宇吴/audio",
				},
				beijing: {
					name: "文鸯/破云翔宇吴/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		wolongfengchu: {
			// 卧龙凤雏
			赤壁链火: {
				name: "卧龙凤雏/赤壁链火/xingxiang",
				version: "4.0",
				x: [0, 0.45],
				y: [0, 0.5],
				scale: 0.6,
				angle: 0,
				clipSlots: ["longmao", "longshen", "longxu01", "longxu02", "longhoutui", "longqiantui", "longtou", "longzui", "fengchiyou", "fengwei01", "fengwei02", "fengchiyou02", "fengchizuo", "fengnaodai"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				beijing: {
					name: "卧龙凤雏/赤壁链火/beijing",
					version: "4.0",
					scale: 0.8,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
			赤壁链火卧龙: {
				name: "卧龙凤雏/赤壁链火/xingxiang",
				version: "4.0",
				x: [0, 0.95],
				y: [0, 0.4],
				scale: 1.15,
				angle: 10,
				// speed: 1,
				beijing: {
					name: "卧龙凤雏/赤壁链火/beijing",
					version: "4.0",
					scale: 0.6,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
			赤壁链火凤雏: {
				name: "卧龙凤雏/赤壁链火/xingxiang",
				version: "4.0",
				x: [0, -0.4],
				y: [0, 0.23],
				scale: 1.25,
				angle: 0,
				// speed: 1,
				beijing: {
					name: "卧龙凤雏/赤壁链火/beijing",
					version: "4.0",
					scale: 0.6,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		wu_guanyu: {
			// 武关羽
			经典形象: {
				name: "武关羽/经典形象/zhujiemian_wuguanyu1",
				teshu: {
					name: "武关羽/经典形象/zhujiemian_wuguanyu1",
					action: "play",
					scale: 0.4,
					showTime: 2,
				},
				x: [0, 1.2],
				y: [0, 0.2],
				scale: 0.5,
				angle: 0,
				shizhounian: true,
				speed: 1,
				background: "武关羽/经典形象/beijing.png",
				chuchang: {
					name: "武关羽/经典形象/zhujiemian_wuguanyu1",
					action: "play",
					scale: 0.4,
					showTime: 2,
				},
				gongji: {
					name: "武关羽/经典形象/zhujiemian_wuguanyu1",
					action: ["play"],
					scale: 0.4,
					showTime: 2,
				},
				beijing: {
					name: "武关羽/经典形象/zhujiemian_wuguanyu2",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
				version: "4.0",
			},
		},
		wu_luxun: {
			// 武陆逊
			经典形象: {
				name: "武陆逊/经典形象/wumiao_luxun",
				teshu: "play2",
				x: [0, -0.35],
				y: [0, 0.4],
				scale: 0.42,
				angle: 0,
				shizhounian: true,
				flipX: true,
				// speed: 1,
				background: "武陆逊/经典形象/beijing.png",
				chuchang: {
					name: "武陆逊/经典形象/wumiao_luxun",
					action: "play2",
					scale: 0.5,
				},
				gongji: {
					name: "武陆逊/经典形象/wumiao_luxun",
					action: ["play2"],
					scale: 0.5,
					speed: 2.0,
				},
			},
		},
		wuxian: {
			// 吴苋
			芳泽沐鲤: {
				name: "吴苋/芳泽沐鲤/daiji",
				x: [0, 0.1],
				y: [0, 0.45],
				scale: 0.8,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "吴苋/芳泽沐鲤/xingxiang",
					scale: 1,
					json: true,
					action: "HuDong",
				},
				gongji: {
					name: "吴苋/芳泽沐鲤/xingxiang",
					scale: 1,
					json: true,
					action: "GongJi",
				},
				teshu: {
					name: "吴苋/芳泽沐鲤/xingxiang",
					scale: 1,
					json: true,
					action: "JiNeng",
				},
				qianjing: {
					name: "吴苋/芳泽沐鲤/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 1,
				},
				beijing: {
					name: "吴苋/芳泽沐鲤/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					x: [0, 0.1],
					y: [0, 0.45],
					scale: 0.8,
					version: "4.0",
					json: true,
				},
			},
		},
		wuyi: {
			骁勇金衔: {
				name: "吴懿/骁勇金衔/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "吴懿/骁勇金衔/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "吴懿/骁勇金衔/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "吴懿/骁勇金衔/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "吴懿/骁勇金衔/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "吴懿/骁勇金衔/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "吴懿/骁勇金衔/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		wu_zhugeliang: {
			// 武诸葛亮
			经典形象: {
				name: "武诸葛亮/经典形象/wumiao_zhugeliang",
				teshu: "play2",
				x: [0, 1.45],
				y: [0, 0.35],
				scale: 0.5,
				angle: 0,
				shizhounian: true,
				// speed: 1,
				background: "武诸葛亮/经典形象/beijing.png",
				chuchang: {
					name: "武诸葛亮/经典形象/wumiao_zhugeliang",
					action: "play2",
					scale: 0.5,
				},
				gongji: {
					name: "武诸葛亮/经典形象/wumiao_zhugeliang",
					action: ["play2"],
					scale: 0.5,
					speed: 1.5,
				},
			},
		},
		xiahoushi: {
			// 夏侯氏
			明良千古: {
				name: "夏侯氏/明良千古/XingXiang",
				x: [0, 0.35],
				y: [0, 0.25],
				scale: 0.5,
				angle: 0,
				clipSlots: ["xhsyun1", "xhsyun2", "xhsyun3", "xhsyun4", "xhsyun5", "xhsyun6", "xhsyun7", "xhsyun8", "xhsyun9", "xhsyun10", "xhsyun11", "xhsyun12", "xhsyun13", "xhsyun14", "xhsyun15", "xhsyun16", "xhsyun17", "xhsyun18", "xhsyun19", "xhsyun20", "xhsyun21", "xhsyun22", "xhsyun23", "xhsyun24", "xhsyun25", "xhsyun26", "xhsyun27", "xhsyun28", "xhsyun29", "xhsyun30", "xhsyun31", "xhsyun32", "xhsyun33", "xhsyun34"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "夏侯氏/明良千古/BeiJing",
					scale: 0.3,
					x: [0, 1.8],
					y: [0, 0.5],
				},
			},
		},
		xizhicai: {
			// 戏志才
			举棋若定: {
				name: "戏志才/举棋若定/XingXiang",
				x: [0, 0.5],
				y: [0, 0.33],
				scale: 0.5,
				angle: -28,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "戏志才/举棋若定/BeiJing",
					scale: 0.3,
					angle: -28,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		xuelingyun: {
			// 薛灵芸
			金蛟巧刻: {
				name: "薛灵芸/金蛟巧刻/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "薛灵芸/金蛟巧刻/chuchang",
					action: "play",
				},
				gongji: {
					name: "薛灵芸/金蛟巧刻/chuchang2",
					action: "gongji",
					scale: 0.7,
					audio: "薛灵芸/金蛟巧刻/chuchang2",
				},
				teshu: {
					name: "薛灵芸/金蛟巧刻/chuchang2",
					action: "jineng",
					scale: 0.7,
					audio: "薛灵芸/金蛟巧刻/daiji2_2",
				},
				beijing: {
					name: "薛灵芸/金蛟巧刻/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				audio: {
					skill: "薛灵芸/金蛟巧刻/audio",
				},
				zhishixian: {
					name: "薛灵芸/金蛟巧刻/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "薛灵芸/金蛟巧刻/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		xujing: {
			// 许靖
			丹枫盈瞳: {
				name: "许靖/丹枫盈瞳/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.55],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "许靖/丹枫盈瞳/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "许靖/丹枫盈瞳/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "许靖/丹枫盈瞳/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "许靖/丹枫盈瞳/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "许靖/丹枫盈瞳/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "许靖/丹枫盈瞳/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		xurong: {
			// 徐荣
			怒燎横空: {
				name: "徐荣/怒燎横空/daiji2",
				teshu: {
					name: "徐荣/怒燎横空/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "徐荣/怒燎横空/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "徐荣/怒燎横空/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				audio: {
					skill: "徐荣/怒燎横空/audio",
				},
				beijing: {
					name: "徐荣/怒燎横空/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "徐荣/怒燎横空/shouji2",
					scale: 0.7,
					speed: 0.8,
					delay: 0.3,
					effect: {
						name: "徐荣/怒燎横空/shouji",
						scale: 0.65,
						speed: 0.6,
						delay: 0.4,
					},
				},
				special: {
					变身: {
						hp: 2,
						name: "xurong/怒燎横空2",
					},
					condition: {
						lowhp: {
							transform: ["变身"],
							recover: true,
						},
					},
				},
			},
			怒燎横空2: {
				name: "徐荣/怒燎横空2/daiji2",
				teshu: {
					name: "徐荣/怒燎横空2/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "徐荣/怒燎横空2/chuchang",
					action: "play",
					scale: 0.9,
				},
				gongji: {
					name: "徐荣/怒燎横空2/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				audio: {
					skill: "徐荣/怒燎横空2/audio",
				},
				beijing: {
					name: "徐荣/怒燎横空2/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "徐荣/怒燎横空2/shouji2",
					scale: 0.6,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "徐荣/怒燎横空2/shouji",
						scale: 0.6,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		xusheng: {
			// 徐盛
			破军杀将: {
				name: "徐盛/破军杀将/XingXiang",
				x: [0, 0.4],
				y: [0, 0],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "徐盛/破军杀将/BeiJing",
					scale: 0.3,
					x: [0, 1],
					y: [0, 0.5],
				},
			},
		},
		xushi: {
			// 徐氏
			巾帼花武: {
				name: "徐氏/巾帼花武/daiji2",
				teshu: {
					name: "徐氏/巾帼花武/chuchang2",
					action: ["jineng"],
					scale: 0.85,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.4],
				y: [0, 0.34],
				scale: 1.12,
				angle: 10,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "徐氏/巾帼花武/chuchang",
					action: "play",
					scale: 0.65,
				},
				gongji: {
					name: "徐氏/巾帼花武/chuchang2",
					action: ["gongji"],
					scale: 0.85,
				},
				beijing: {
					name: "徐氏/巾帼花武/beijing",
					x: [0, 0.2],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "徐氏/巾帼花武/shouji2",
					scale: 0.3,
					speed: 0.6,
					delay: 0.2,
					effect: {
						name: "徐氏/巾帼花武/shouji",
						scale: 0.5,
						speed: 0.6,
						delay: 0.3,
					},
				},
			},
			拈花思君: {
				name: "徐氏/拈花思君/daiji2",
				x: [0, 0.42],
				y: [0, 0.52],
				scale: 0.9,
				angle: -10,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "徐氏/拈花思君/chuchang",
					scale: 0.9,
					action: "play",
				},
				gongji: {
					name: "徐氏/拈花思君/chuchang",
					scale: 1.1,
					action: "play",
				},
				beijing: {
					name: "徐氏/拈花思君/beijing",
					x: [0, 0.1],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
			琪花瑶草: {
				name: "徐氏/琪花瑶草/XingXiang",
				x: [0, 0.76],
				y: [0, 0.22],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "徐氏/琪花瑶草/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			为夫弑敌: {
				name: "徐氏/为夫弑敌/daiji2",
				x: [0, 0.27],
				y: [0, 0.52],
				scale: 0.85,
				angle: -10,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "徐氏/为夫弑敌/chuchang",
					scale: 0.9,
					action: "play",
				},
				gongji: {
					name: "徐氏/为夫弑敌/chuchang",
					scale: 1.1,
					action: "play",
				},
				beijing: {
					name: "徐氏/为夫弑敌/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
		},
		xushao: {
			// 许劭
			评世雕龙: {
				name: "许劭/评世雕龙/daiji2",
				teshu: {
					name: "许劭/评世雕龙/chuchang2",
					action: ["jineng"],
					scale: 0.7,
					whitelist: ["pingjian", "pingjian_use", "taffyboss_pingjian", "taffyboss_pingjian_use", "taffydc_pingjian", "taffydc_pingjian_use", "taffyhuiwan_pingjian", "taffyhuiwan_pingjian_use", "taffyre_pingjian", "taffyre_pingjian_use", "taffyshen_pingjian", "taffyshen_pingjian_use"],
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.45],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				background: "许劭/评世雕龙/static_bg.png",
				shizhounian: true,
				chuchang: {
					name: "许劭/评世雕龙/chuchang",
					action: "play",
					scale: 0.5,
				},
				gongji: {
					name: "许劭/评世雕龙/chuchang2",
					action: ["gongji"],
					scale: 0.7,
				},
				beijing: {
					name: "许劭/评世雕龙/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "许劭/评世雕龙/shouji2",
					scale: 0.5,
					speed: 0.6,
					delay: 0.2,
					factor: 0.5,
					effect: {
						name: "许劭/评世雕龙/shouji",
						scale: 0.4,
						speed: 0.8,
						delay: 0.3,
						factor: 0.5,
					},
				},
			},
			声名鹊起: {
				name: "许劭/声名鹊起/daiji2",
				teshu: {
					name: "许劭/声名鹊起/chuchang",
					scale: 0.8,
					action: "play",
					whitelist: ["pingjian", "pingjian_use", "taffyboss_pingjian", "taffyboss_pingjian_use", "taffydc_pingjian", "taffydc_pingjian_use", "taffyhuiwan_pingjian", "taffyhuiwan_pingjian_use", "taffyre_pingjian", "taffyre_pingjian_use"],
				},
				x: [0, 0.45],
				y: [0, 0.5],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "许劭/声名鹊起/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "许劭/声名鹊起/chuchang",
					scale: 0.8,
					action: "play",
				},
				beijing: {
					name: "许劭/声名鹊起/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
			战场荣耀: {
				name: "许劭/战场荣耀/daiji2",
				teshu: {
					name: "许劭/战场荣耀/chuchang2",
					action: ["jineng"],
					scale: 0.7,
					whitelist: ["pingjian", "pingjian_use", "taffyboss_pingjian", "taffyboss_pingjian_use", "taffydc_pingjian", "taffydc_pingjian_use", "taffyhuiwan_pingjian", "taffyhuiwan_pingjian_use", "taffyre_pingjian", "taffyre_pingjian_use"],
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.55],
				scale: 0.7,
				angle: 0,
				clipSlots: ["liuhuow", "effects/daiji/huod/huod_00", "effects/daiji/huod/huod_01", "effects/daiji/huod/huod_02", "effects/daiji/huod/huod_03", "effects/daiji/huod/huod_04", "effects/daiji/huod/huod_05", "effects/daiji/huod/huod_06", "effects/daiji/huod/huod_07", "effects/daiji/huod/huod_08", "effects/daiji/huod/huod_09", "effects/daiji/huod/huod_10", "effects/daiji/huod/huod_11", "effects/daiji/huod/huod_12", "effects/daiji/huod/huod_13", "effects/daiji/huod/huod_14", "effects/daiji/huod/huod_15", "effects/daiji/huod/huod_16", "effects/daiji/huod/huod_17", "effects/daiji/huod/huod_18", "effects/daiji/huod/huod_19", "effects/daiji/huod/huod_20", "effects/daiji/huod/huod_21", "effects/daiji/huod/huod_22", "effects/daiji/huod/huod_23", "effects/daiji/huod/huod_24", "effects/daiji/huod/huod_25", "effects/daiji/huod/huod_26", "effects/daiji/huod/huod_27", "effects/daiji/huod/huod_28", "effects/daiji/huod/huod_29"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "许劭/战场荣耀/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "许劭/战场荣耀/chuchang2",
					action: ["gongji"],
					scale: 0.7,
				},
				beijing: {
					name: "许劭/战场荣耀/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "许劭/战场荣耀/shouji2",
					scale: 0.5,
					speed: 0.6,
					delay: 0.2,
					factor: 0.5,
					effect: {
						name: "许劭/战场荣耀/shouji",
						scale: 0.8,
						speed: 0.8,
						delay: 0.3,
						factor: 0.5,
					},
				},
			},
		},
		xuncai: {
			//荀采
			雅柔映采: {
				name: "荀采/雅柔映采/xingxiang",
				version: "4.0",
				json: true,
				x: [0, 0.7],
				y: [0, 0.4],
				scale: 0.7,
				//speed: 1,
				beijing: {
					name: "荀采/雅柔映采/beijing",
					version: "4.0",
					json: true,
					x: [0, 0.75],
					y: [0, 0.4],
					scale: 0.6,
				},
			},
		},
		xunyu: {
			// 荀彧
			书剑定远: {
				name: "荀彧/书剑定远/daiji",
				ss_jinchang: "ChuChang",
				action: "DaiJi",
				x: [0, 0.45],
				y: [0, 0.35],
				scale: 0.9,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "荀彧/书剑定远/xingxiang",
					action: "HuDong",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				qianjing: {
					name: "荀彧/书剑定远/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.55],
					y: [0, 0.3],
					scale: 0.9,
				},
				gongji: {
					name: "荀彧/书剑定远/xingxiang",
					action: "GongJi",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				teshu: {
					name: "荀彧/书剑定远/xingxiang",
					action: "JiNeng",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				beijing: {
					name: "荀彧/书剑定远/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.42],
					y: [0, 0.56],
					scale: 0.7,
				},
				special: {
					变身: {
						hp: 1,
						name: "xunyu/书剑定远2",
						audio: "baorubianshen", // 触发变身, 可以播放语音
					},
					condition: {
						lowhp: {
							transform: ["变身"],
							recover: true,
							effect: "shaohui",
							play: "play",
						},
					},
				},
			},
			书剑定远2: {
				name: "荀彧/书剑定远2/daiji",
				ss_jinchang: "ChuChang",
				action: "DaiJi",
				x: [0, 0.05],
				y: [0, 0.25],
				scale: 1,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "荀彧/书剑定远2/xingxiang",
					action: "HuDong",
					version: "4.0",
					json: true,
					scale: 1,
				},
				qianjing: {
					name: "荀彧/书剑定远2/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.55],
					y: [0, 0.3],
					scale: 1,
				},
				gongji: {
					name: "荀彧/书剑定远2/xingxiang",
					action: "GongJi",
					version: "4.0",
					json: true,
					scale: 1,
				},
				teshu: {
					name: "荀彧/书剑定远2/xingxiang",
					action: "JiNeng",
					version: "4.0",
					json: true,
					scale: 1,
				},
				beijing: {
					name: "荀彧/书剑定远2/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.42],
					y: [0, 0.56],
					scale: 0.7,
				},
			},
		},
		xuyou: {
			// 许攸
			附势而为: {
				name: "许攸/附势而为/xingxiang",
				ss_jinchang: "ChuChang",
				action: "DaiJi",
				x: [0, 0.55],
				y: [0, 0.3],
				scale: 0.8,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "许攸/附势而为/xingxiang",
					scale: 0.8,
					version: "4.0",
					json: true,
					action: "HuDong",
				},
				qianjing: {
					name: "许攸/附势而为/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					scale: 0.8,
				},
				gongji: {
					name: "许攸/附势而为/xingxiang",
					action: "GongJi",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				teshu: {
					name: "许攸/附势而为/xingxiang",
					scale: 1.2,
					version: "4.0",
					json: true,
					action: "JiNeng",
				},
				beijing: {
					name: "许攸/附势而为/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.55],
					y: [0, 0.55],
					scale: 0.55,
				},
				special: {
					转换: {
						name: "xuyou/附势而为2",
					},
					condition: {
						zhuanhuanji: {
							transform: ["转换"],
						},
					},
				},
			},
			附势而为2: {
				name: "许攸/附势而为2/xingxiang",
				ss_jinchang: "ChuChang",
				action: "DaiJi",
				x: [0, 0.45],
				y: [0, 0.55],
				scale: 0.8,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "许攸/附势而为2/xingxiang",
					scale: 0.8,
					version: "4.0",
					json: true,
					action: "HuDong",
				},
				qianjing: {
					name: "许攸/附势而为2/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.45],
					y: [0, 0.55],
					scale: 0.8,
				},
				gongji: {
					name: "许攸/附势而为2/xingxiang",
					action: "GongJi",
					version: "4.0",
					json: true,
					scale: 0.9,
				},
				teshu: {
					name: "许攸/附势而为2/xingxiang",
					scale: 0.9,
					version: "4.0",
					json: true,
					action: "JiNeng",
				},
				beijing: {
					name: "许攸/附势而为2/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.55],
					y: [0, 0.55],
					scale: 0.55,
				},
				special: {
					转换: {
						name: "xuyou/附势而为",
					},
					condition: {
						zhuanhuanji: {
							transform: ["转换"],
						},
					},
				},
			},
		},
		yangbiao: {
			// 杨彪
			国之柱石: {
				name: "杨彪/国之柱石/XingXiang",
				x: [0, 0.45],
				y: [0, 0.3],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				audio: {
					skill: "杨彪/国之柱石/audio",
				},
				beijing: {
					name: "杨彪/国之柱石/BeiJing",
					scale: 0.5,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		yuantanyuanshang: {
			// 袁谭袁尚
			常棣失华: {
				name: "袁谭袁尚/常棣失华/xingxiang",
				version: "4.0",
				json: true,
				shizhounian: true,
				x: [0, 0.45],
				y: [0, 0.55],
				scale: 0.4,
				angle: 0,
				// speed: 1,
				chuchang: {
					name: "袁谭袁尚/常棣失华/jineng01",
					version: "4.0",
					json: true,
					scale: 0.9,
					action: "play",
				},
				gongji: {
					name: "袁谭袁尚/常棣失华/jineng01",
					version: "4.0",
					json: true,
					scale: 1.2,
					action: "play",
				},
				beijing: {
					name: "袁谭袁尚/常棣失华/beijing",
					version: "4.0",
					json: true,
					scale: 0.6,
					x: [0, 0.7],
					y: [0, 0.5],
				},
			},
		},
		yuji: {
			// 于吉
			虚拟天团: {
				name: "于吉/虚拟天团/daiji2",
				x: [0, 0.45],
				y: [0, 0.5],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "于吉/虚拟天团/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "于吉/虚拟天团/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "于吉/虚拟天团/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		zerong: {
			// 笮融
			一念佛魔: {
				name: "笮融/一念佛魔/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "笮融/一念佛魔/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "笮融/一念佛魔/chuchang2",
					action: "gongji",
					scale: 0.8,
				},
				teshu: {
					name: "笮融/一念佛魔/chuchang2",
					action: "gongji",
					scale: 0.8,
				},
				audio: {
					skill: "笮融/一念佛魔/audio",
				},
				beijing: {
					name: "笮融/一念佛魔/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.8,
				},
				zhishixian: {
					name: "笮融/一念佛魔/shouji2",
					scale: 0.7,
					speed: 0.8,
					delay: 0.3,
					effect: {
						name: "笮融/一念佛魔/shouji",
						scale: 0.65,
						speed: 0.6,
						delay: 0.4,
					},
				},
				special: {
					变身: {
						hp: 2,
						name: "zerong/一念佛魔2",
					},
					condition: {
						lowhp: {
							transform: ["变身"],
							recover: true,
						},
					},
				},
			},
			一念佛魔2: {
				name: "笮融/一念佛魔2/daiji2",
				teshu: {
					name: "笮融/一念佛魔2/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "笮融/一念佛魔2/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "笮融/一念佛魔2/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				audio: {
					skill: "笮融/一念佛魔2/audio",
				},
				beijing: {
					name: "笮融/一念佛魔2/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.8,
				},
				zhishixian: {
					name: "笮融/一念佛魔2/shouji2",
					scale: 0.6,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "笮融/一念佛魔2/shouji",
						scale: 0.6,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		zhangchunhua: {
			// 张春华
			绰约多姿: {
				name: "张春华/绰约多姿/daiji2",
				x: [0, 0.55],
				y: [0, 0.6],
				scale: 0.65,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "张春华/绰约多姿/chuchang",
					scale: 0.65,
					action: "play",
				},
				gongji: {
					name: "张春华/绰约多姿/chuchang",
					scale: 0.85,
					action: "play",
				},
				beijing: {
					name: "张春华/绰约多姿/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
			宣穆夜袭: {
				name: "张春华/宣穆夜袭/XingXiang",
				x: [0, 0.23],
				y: [0, 0.18],
				scale: 0.54,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "张春华/宣穆夜袭/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		zhangliao: {
			// 张辽
			龙生九子: {
				name: "张辽/龙生九子/XingXiang",
				x: [0, 1.45],
				y: [0, 0.05],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "张辽/龙生九子/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		zhangqiying: {
			// 张琪瑛
			岁稔年丰: {
				name: "张琪瑛/岁稔年丰/daiji2",
				x: [0, 0.5],
				y: [0, 0.35],
				scale: 1.15,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "张琪瑛/岁稔年丰/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "张琪瑛/岁稔年丰/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "张琪瑛/岁稔年丰/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
			逐鹿天下: {
				name: "张琪瑛/逐鹿天下/daiji2",
				x: [0, 0.36],
				y: [0, 0.5],
				scale: 0.85,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "张琪瑛/逐鹿天下/chuchang",
					scale: 0.9,
					action: "play",
				},
				gongji: {
					name: "张琪瑛/逐鹿天下/chuchang",
					scale: 1.1,
					action: "play",
				},
				beijing: {
					name: "张琪瑛/逐鹿天下/beijing",
					x: [0, 0],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
		},
		zhangrang: {
			//张让
			窃政聚敛: {
				name: "张让/窃政聚敛/daiji2",
				x: [0, 0.45],
				y: [0, 0.5],
				scale: 0.8,
				//speed: 1,
				shizhounian: true,
				chuchang: {
					name: "张让/窃政聚敛/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "张让/窃政聚敛/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "张让/窃政聚敛/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		zhangxingcai: {
			// 张星彩
			父志耀星: {
				name: "张星彩/父志耀星/daiji2",
				x: [0, 0.4],
				y: [0, 0.47],
				scale: 0.85,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "张星彩/父志耀星/chuchang",
					scale: 0.8,
					action: "play",
				},
				gongji: {
					name: "张星彩/父志耀星/chuchang",
					scale: 1,
					action: "play",
				},
				beijing: {
					name: "张星彩/父志耀星/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
			临军对阵: {
				name: "张星彩/临军对阵/XingXiang",
				x: [0, 0.92],
				y: [0, 0.3],
				scale: 0.48,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "张星彩/临军对阵/BeiJing",
					scale: 0.3,
					x: [0, -0.55],
					y: [0, 0.4],
				},
			},
			星春侯福: {
				name: "张星彩/星春侯福/daiji2",
				x: [0, 0.45],
				y: [0, 0.45],
				scale: 0.88,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "张星彩/星春侯福/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "张星彩/星春侯福/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "张星彩/星春侯福/beijing",
					x: [0, 0],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
			猪年中秋: {
				name: "张星彩/猪年中秋/XingXiang",
				x: [0, 0.55],
				y: [0, 0.4],
				scale: 0.45,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "张星彩/猪年中秋/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		zhangxuan: {
			// 张嫙
			涟漪夏梦: {
				name: "张嫙/涟漪夏梦/daiji2",
				x: [0, 0.45],
				y: [0, 0.47],
				scale: 0.77,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "张嫙/涟漪夏梦/chuchang",
					scale: 0.8,
					action: "play",
				},
				gongji: {
					name: "张嫙/涟漪夏梦/chuchang",
					scale: 1,
					action: "play",
				},
				beijing: {
					name: "张嫙/涟漪夏梦/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		zhaoxiang: {
			// 赵襄
			芳芷飒敌: {
				name: "赵襄/芳芷飒敌/daiji2",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "赵襄/芳芷飒敌/chuchang",
					scale: 0.75,
					action: "play",
				},
				gongji: {
					name: "赵襄/芳芷飒敌/chuchang",
					scale: 0.95,
					action: "play",
				},
				beijing: {
					name: "赵襄/芳芷飒敌/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
			},
			月痕芳影: {
				name: "赵襄/月痕芳影/daiji2",
				teshu: {
					name: "赵襄/月痕芳影/chuchang2",
					action: ["jineng"],
					scale: 0.8,
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "赵襄/月痕芳影/chuchang",
					action: "play",
					scale: 0.8,
				},
				gongji: {
					name: "赵襄/月痕芳影/chuchang2",
					action: ["gongji"],
					scale: 0.8,
				},
				audio: {
					skill: "赵襄/月痕芳影/audio",
				},
				beijing: {
					name: "赵襄/月痕芳影/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "赵襄/月痕芳影/shouji2",
					scale: 0.7,
					speed: 0.8,
					delay: 0.3,
					effect: {
						name: "赵襄/月痕芳影/shouji",
						scale: 0.65,
						speed: 0.6,
						delay: 0.4,
					},
				},
				special: {
					变身: {
						// hp: 2,
						name: "zhaoxiang/月痕芳影2",
					},
					condition: {
						// 限定技
						xiandingji: {
							transform: "变身",
							effect: {
								scale: 0.5, // 播放变换骨骼的参数
								speed: 1.5,
								name: "juexing_zhaoxiang", // 换肤文件
							}, // 变身播放更换骨骼的特效, 变身特效文件放入 皮肤切换/effects/transform下面, 不填写默认播放曹纯的换肤特效骨骼
						},
					},
				},
			},
			月痕芳影2: {
				name: "赵襄/月痕芳影2/daiji2",
				teshu: {
					name: "赵襄/月痕芳影2/chuchang2",
					action: ["jineng"],
					scale: 0.8,
					hideSlots: ["ren_moanbutouying"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.8,
				angle: 0,
				hideSlots: ["ren_moanbutouying"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "赵襄/月痕芳影2/chuchang",
					action: "play",
					scale: 0.9,
					hideSlots: ["ren_moanbutouying"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
				gongji: {
					name: "赵襄/月痕芳影2/chuchang2",
					action: ["gongji"],
					scale: 0.8,
					hideSlots: ["ren_moanbutouying"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
				audio: {
					skill: "赵襄/月痕芳影2/audio",
				},
				beijing: {
					name: "赵襄/月痕芳影2/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "赵襄/月痕芳影2/shouji2",
					scale: 0.6,
					speed: 0.6,
					delay: 0.3,
					effect: {
						name: "赵襄/月痕芳影2/shouji",
						scale: 0.6,
						speed: 0.8,
						delay: 0.4,
					},
				},
			},
		},
		zhaoyǎn: {
			// 赵俨
			遐迩一体: {
				name: "赵俨/遐迩一体/xingxiang",
				version: "4.0",
				json: true,
				x: [0, 1],
				y: [0, 0.25],
				scale: 1,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "赵俨/遐迩一体/jineng01",
					version: "4.0",
					json: true,
					scale: 0.9,
					action: "play",
				},
				gongji: {
					name: "赵俨/遐迩一体/jineng01",
					version: "4.0",
					json: true,
					scale: 1.2,
					action: "play",
				},
				beijing: {
					name: "赵俨/遐迩一体/beijing",
					version: "4.0",
					json: true,
					scale: 0.6,
					x: [0, 0.7],
					y: [0, 0.5],
				},
			},
		},
		zhaoyun: {
			// 赵云
			战宇龙腾: {
				name: "赵云/战宇龙腾/daiji",
				x: [0, 0.25],
				y: [0, 0],
				scale: 1.2,
				version: "4.0",
				json: true,
				shizhounian: true,
				chuchang: {
					name: "赵云/战宇龙腾/xingxiang",
					scale: 0.8,
					json: true,
					action: "HuDong",
				},
				gongji: {
					name: "赵云/战宇龙腾/xingxiang",
					scale: 0.8,
					json: true,
					action: "GongJi",
				},
				teshu: {
					name: "赵云/战宇龙腾/xingxiang",
					scale: 0.8,
					json: true,
					action: "JiNeng",
				},
				qianjing: {
					name: "赵云/战宇龙腾/qianjing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					version: "4.0",
					json: true,
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.8,
				},
				beijing: {
					name: "赵云/战宇龙腾/beijing",
					ss_jinchang: "ChuChang",
					action: "DaiJi",
					x: [0, 0.69],
					y: [0, 0.42],
					version: "4.0",
					json: true,
					scale: 0.82,
				},
			},
		},
		sp_zhenji: {
			// SP甄姬
			芳菲栉雨: {
				name: "甄姬/芳菲栉雨/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.5],
				y: [0, 0.55],
				scale: 0.75,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "甄姬/芳菲栉雨/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "甄姬/芳菲栉雨/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "甄姬/芳菲栉雨/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "甄姬/芳菲栉雨/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "甄姬/芳菲栉雨/shouji2",
					scale: 0.5,
					speed: 1.2,
					delay: 0.3,
					effect: {
						name: "甄姬/芳菲栉雨/shouji",
						scale: 0.6,
						speed: 0.6,
						delay: 0.7,
					},
				},
			},
		},
		zhonghui: {
			// 钟会
			钟桂香蒲: {
				// 出场错误
				name: "钟会/钟桂香蒲/daiji2",
				x: [0, 0.35],
				y: [0, 0.6],
				scale: 0.6,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "钟会/钟桂香蒲/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "钟会/钟桂香蒲/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "钟会/钟桂香蒲/beijing",
					x: [0, -0.35],
					y: [0, 0.55],
					scale: 0.35,
				},
			},
			潜蛟觊天: {
				name: "钟会/潜蛟觊天/XingXiang",
				x: [0, -0.5],
				y: [0, 0.3],
				scale: 0.45,
				angle: 0,
				clipSlots: ["ganzi1qizi"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "钟会/潜蛟觊天/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				audio: {
					skill: "钟会/潜蛟觊天/audio",
					card: "钟会/潜蛟觊天/audio",
				},
				special: {
					觉醒: {
						name: "zhonghui/潜蛟觊天2",
					},
					condition: {
						juexingji: {
							transform: "觉醒",
							effect: "shaohui",
							// play: 'play',
						},
					},
				},
			},
			潜蛟觊天1: {
				name: "钟会/潜蛟觊天/XingXiang",
				x: [0, -0.5],
				y: [0, 0.3],
				scale: 0.45,
				angle: 0,
				clipSlots: ["ganzi1qizi"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "钟会/潜蛟觊天/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
				audio: {
					skill: "钟会/潜蛟觊天/audio",
					card: "钟会/潜蛟觊天/audio",
				},
				special: {
					变身: {
						hp: 2,
						name: "zhonghui/潜蛟觊天2",
					},
					condition: {
						lowhp: {
							transform: ["变身"],
							effect: "shaohui",
							recover: true,
						},
					},
				},
			},
			潜蛟觊天2: {
				name: "钟会/潜蛟觊天2/XingXiang-1",
				x: [0, -0.8],
				y: [0, 0.3],
				scale: 0.5,
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.5,
				},
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				audio: {
					skill: "钟会/潜蛟觊天2/audio",
					card: "钟会/潜蛟觊天2/audio",
				},
				beijing: {
					name: "钟会/潜蛟觊天2/BeiJing-1",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		zhongyan: {
			// 钟琰
			雪荣钟情: {
				name: "钟琰/雪荣钟情/xingxiang",
				version: "4.0",
				x: [0, 0.8],
				y: [0, 0.4],
				scale: 0.9,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "钟琰/雪荣钟情/jineng01",
					version: "4.0",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "钟琰/雪荣钟情/jineng01",
					version: "4.0",
					scale: 0.9,
					action: "play",
				},
				zhishixian: {
					name: "钟琰/雪荣钟情/jineng02",
					version: "4.0",
					scale: 0.5,
					speed: 0.5,
					delay: 0.4,
				},
				beijing: {
					name: "钟琰/雪荣钟情/beijing",
					version: "4.0",
					scale: 1.45,
					x: [0, 1.22],
					y: [0, 0.11],
				},
			},
		},
		zhouchu: {
			// 周处
			义除三害: {
				name: "周处/义除三害/XingXiang",
				x: [0, 0.6],
				y: [0, 0.3],
				scale: 0.4,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "周处/义除三害/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		zhoushan: {
			// 周善
			骁勇金衔: {
				name: "周善/骁勇金衔/daiji2",
				play2: "play2",
				shan: "play3",
				x: [0, 0.55],
				y: [0, 0.45],
				scale: 1,
				shizhounian: true,
				chuchang: {
					name: "周善/骁勇金衔/chuchang",
					action: "play",
					scale: 0.7,
				},
				gongji: {
					name: "周善/骁勇金衔/chuchang2",
					action: "gongji",
					scale: 0.7,
				},
				teshu: {
					name: "周善/骁勇金衔/chuchang2",
					action: "jineng",
					scale: 0.7,
				},
				beijing: {
					name: "周善/骁勇金衔/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.3,
				},
				zhishixian: {
					name: "周善/骁勇金衔/shouji2",
					scale: 0.7,
					speed: 0.9,
					delay: 0.7,
					effect: {
						name: "周善/骁勇金衔/shouji",
						scale: 0.8,
						speed: 0.8,
						delay: 0.7,
					},
				},
			},
		},
		zhouxuān: {
			// 周宣
			枕梦南柯: {
				name: "周宣/枕梦南柯/daiji",
				x: [0, 0.5],
				y: [0, 0.4],
				scale: 0.55,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "周宣/枕梦南柯/chuchang",
					scale: 0.5,
					action: "play",
				},
				gongji: {
					name: "周宣/枕梦南柯/chuchang",
					scale: 0.5,
					action: "play",
				},
				beijing: {
					name: "周宣/枕梦南柯/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		zhouyi: {
			// 周夷
			剑舞浏漓: {
				name: "周夷/剑舞浏漓/daiji2",
				x: [0, 0.4],
				y: [0, 0.5],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "周夷/剑舞浏漓/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "周夷/剑舞浏漓/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "周夷/剑舞浏漓/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		zhouyu: {
			// 周瑜
			运筹帷幄: {
				name: "周瑜/运筹帷幄/XingXiang",
				x: [0, 0.95],
				y: [0, 0.4],
				scale: 0.3,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				gongji: {
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
				beijing: {
					name: "周瑜/运筹帷幄/BeiJing",
					scale: 0.3,
					x: [0, 0.5],
					y: [0, 0.5],
				},
			},
		},
		zhujianping: {
			// 朱建平
			命镜幻生: {
				name: "朱建平/命镜幻生/daiji2",
				x: [0, 0.5],
				y: [0, 0.5],
				scale: 0.7,
				angle: 0,
				// speed: 1,
				shizhounian: true,
				chuchang: {
					name: "朱建平/命镜幻生/chuchang",
					scale: 0.7,
					action: "play",
				},
				gongji: {
					name: "朱建平/命镜幻生/chuchang",
					scale: 0.9,
					action: "play",
				},
				beijing: {
					name: "朱建平/命镜幻生/beijing",
					x: [0, 0.5],
					y: [0, 0.5],
					scale: 0.4,
				},
			},
		},
		zhugeliang: {
			// 诸葛亮
			龙跃凤鸣: {
				name: "诸葛亮/龙跃凤鸣/XingXiang",
				x: [0, 0.6],
				y: [0, 0.15],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "诸葛亮/龙跃凤鸣/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
			国之柱石: {
				name: "诸葛亮/国之柱石/XingXiang",
				x: [0, -0.1],
				y: [0, 0.15],
				scale: 0.5,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "诸葛亮/国之柱石/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		zuoci: {
			// 左慈
			役使鬼神: {
				name: "左慈/役使鬼神/XingXiang",
				x: [0, 0.98],
				y: [0, 0.03],
				scale: 0.78,
				angle: 0,
				// speed: 1,
				// action: 'DaiJi',
				beijing: {
					name: "左慈/役使鬼神/BeiJing",
					scale: 0.3,
					x: [0, 0.4],
					y: [0, 0.5],
				},
			},
		},
		hoshino: {
			// 小鸟游星野
			静态经典: {
				name: "小鸟游星野/静态经典/hoshino_spr",
				x: [0, 0.5],
				y: [0, 0],
				scale: 0.15,
				angle: 0,
				action: "00",
				background: "小鸟游星野/静态经典/BG_Abydos.jpg",
				version: "3.8",
			},
			动态经典: {
				name: "小鸟游星野/动态经典/Hoshino_home",
				x: [0, 0.3],
				y: [0, 0.05],
				scale: 0.1,
				angle: 0,
				action: "Idle_01",
				ss_jinchang: "Start_Idle_01",
				gongji: {
					x: [0, 0.5],
					y: [0, 0.2],
					scale: 0.25,
					action: "Dev_Talk_01_All",
					showTime: 2,
					hideSlots: ["floor_00", "flush_plus", "light 1(floor)_guide_00", "window frame_H1_00", "window frame_H2_00", "window frame_V1_00", "window frame_V2_00", "window frame_V3_00", "window frame_V4_00", "window gradation"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
				beijing: {
					name: "小鸟游星野/动态经典/Hoshino_home_background",
					x: [0, 0.5],
					y: [0, -0.05],
					scale: 0.1,
					action: "Dev_Test",
					version: "3.8",
				},
				// clipSlots: [], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				// background: "小鸟游星野/静态经典/BG_Abydos.jpg",
				version: "3.8",
			},
			静态泳装: {
				name: "小鸟游星野/静态泳装/hoshino_swimsuit_spr",
				x: [0, 0.5],
				y: [0, 0],
				scale: 0.15,
				angle: 0,
				action: "Idle_01",
				background: "小鸟游星野/静态泳装/BG_IslandBeach.png",
				version: "3.8",
			},
			动态泳装: {
				name: "小鸟游星野/动态泳装/Hoshino_swimsuit_home",
				x: [0, 0.1],
				y: [0, 0],
				scale: 0.1,
				angle: 0,
				action: "Dev_Idle_01",
				ss_jinchang: "Start_Idle_01",
				gongji: {
					x: [0, 0.51],
					y: [0, 0.2],
					scale: 0.2,
					action: "Dev_Idle_01",
					showTime: 2,
					hideSlots: ["B/B_island", "B/B_sand", "B/B_sea", "B/B_sky", "Layer 190", "L_calf_cover_intro", "L_calf_intro", "L_foot_01_intro", "L_foot_big toe_intro", "L_foot_other toes_intro", "R_calf_intro", "R_foot_01_intro", "R_foot_other toes_intro", "R_foot_pinky toe_intro"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
				clipSlots: ["B/B_sky"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				background: "小鸟游星野/静态泳装/BG_IslandBeach.png",
				version: "3.8",
			},
			静态临战: {
				name: "小鸟游星野/静态临战/CH0258_spr",
				x: [0, 0.5],
				y: [0, 0],
				scale: 0.15,
				angle: 0,
				action: "Idle_01",
				background: "小鸟游星野/静态临战/467743.jpg",
				version: "3.8",
			},
			动态临战: {
				name: "小鸟游星野/动态临战/CH0258_home",
				x: [0, 0.2],
				y: [0, 0.05],
				scale: 0.1,
				angle: 0,
				action: "Idle_01",
				ss_jinchang: "Start_Idle_01",
				gongji: {
					x: [0, 0.5],
					y: [0, 0.2],
					scale: 0.2,
					action: "Idle_01",
					showTime: 2,
					hideSlots: ["FX_SunFlare_01", "flares01", "L_Finger_Shadow_01", "L_Finger_Shadow_02", "L_Finger_Shadow_03", "L_Finger_Shadow_04", "L_forearm_shadow", "L_hand_shadow", "acc_shadow", "bdoy_shadow", "desert_floor", "desert_hills", "sky", "sun", "roof_Base", "roof_dust_01", "roof_dust_02", "roof_dust_03", "roof_dust_04", "roof_dust_05", "roof_dust_06", "roof_dust_07", "roof_line", "train shadow", "train_01", "train_02", "train_03", "train_04"], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
				clipSlots: ["sky"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				background: "小鸟游星野/静态临战/467743.jpg",
				version: "3.8",
			},
		},
		himari: {
			// 明星日鞠
			静态经典: {
				name: "明星日鞠/静态经典/CH0159_spr",
				x: [0, 0.4],
				y: [0, 0.05],
				scale: 0.13,
				angle: 0,
				action: "Idle_01",
				background: "明星日鞠/静态经典/329424.jpg",
				version: "3.8",
			},
			动态经典: {
				name: "明星日鞠/动态经典/CH0159_home",
				x: [0, 0.75],
				y: [0, 0],
				scale: 0.12,
				angle: 0,
				action: "Idle_01",
				ss_jinchang: "Start_Idle_01",
				gongji: {
					x: [0, 0.5],
					y: [0, 0.2],
					scale: 0.25,
					action: "Idle_01",
					showTime: 2,
					hideSlots: [
						"01/bg topdark fx_01",
						"01/bg topdark fx_02",
						"01/bg toplight",
						"01/light",
						"01/monitor lights_01",
						"01/monitor lights_02",
						"01/monitor lights_03",
						"01/monitor lights_04",
						"01/monitor lights_05",
						"01/monitor shadow",
						"01/monitor_04",
						"01/monitor_05",
						"01/server light1_01",
						"01/server light1_02",
						"01/server light1_03",
						"01/server light1_04",
						"01/server light1_05",
						"01/server light1_06",
						"01/server light1_07",
						"01/server light1_08",
						"01/server light1_09",
						"01/server light1_10",
						"01/server light1_11",
						"01/server light1_12",
						"01/shelf",
						"01/table",
						"02/L_calf",
						"02/L_foot",
						"02/L_foot finger",
						"02/R_calf",
						"02/R_foot",
						"02/R_foot finger",
						"02/chair",
						"02/chair pipe_01",
						"02/chair pipe_02",
						"02/chair pipe_03",
						"02/chair pipe_04",
						"02/chair pipe_05",
						"02/chair pipe_06",
						"02/chair pipe_07",
						"02/chair_copy",
						"02/drop_01",
						"02/drop_02",
						"02/drop_03",
						"02/drop_04",
						"02/drop_05",
						"02/drop_06",
						"02/drop_07",
						"02/drop_08",
						"02/drop_09",
						"02/drop_10",
						"02/drop_11",
						"02/drop_12",
						"02/drop_13",
						"02/drop_14",
						"02/drop_15",
						"02/floor",
						"02/toplight",
						"02/towel_01",
						"02/towel_01_wet",
						"02/towel_02",
						"02/water_02_4",
						"02/wheelchair light_1",
						"02/wheelchair light_2",
					], // 隐藏不需要的部件，想知道具体部件名称请使用SpineAltasSplit工具查看
				},
				clipSlots: ["01/bg topdark fx_01", "01/bg topdark fx_02", "01/bg toplight", "01/light", "01/monitor lights_01", "01/monitor lights_02", "01/monitor lights_03", "01/monitor lights_04", "01/monitor lights_05", "01/monitor shadow", "01/monitor_04", "01/monitor_05", "01/server light1_01", "01/server light1_02", "01/server light1_03", "01/server light1_04", "01/server light1_05", "01/server light1_06", "01/server light1_07", "01/server light1_08", "01/server light1_09", "01/server light1_10", "01/server light1_11", "01/server light1_12", "01/shelf", "01/table"], // 剪掉超出头的部件，仅针对露头动皮，其他勿用
				background: "明星日鞠/静态经典/329424.jpg",
				version: "3.8",
			},
		},
	};

	var extend = {
		// 共用
		// 鲍三娘
		re_baosanniang: decadeUI.dynamicSkin.baosanniang,
		xin_baosanniang: decadeUI.dynamicSkin.baosanniang,

		// 蔡文姬
		ol_caiwenji: decadeUI.dynamicSkin.caiwenji,
		re_caiwenji: decadeUI.dynamicSkin.caiwenji,
		yue_caiwenji: decadeUI.dynamicSkin.caiwenji,
		sp_caiwenji: decadeUI.dynamicSkin.caiwenji,

		// 幻曹昂
		taffyold_huan_caoang: decadeUI.dynamicSkin.huan_caoang,

		// 曹操
		re_caocao: decadeUI.dynamicSkin.caocao,
		sb_caocao: decadeUI.dynamicSkin.caocao,
		dc_caocao: decadeUI.dynamicSkin.caocao,
		jd_sb_caocao: decadeUI.dynamicSkin.caocao,
		tw_caocao: decadeUI.dynamicSkin.caocao,
		jsrg_caocao: decadeUI.dynamicSkin.caocao,
		yj_caocao: decadeUI.dynamicSkin.caocao,

		// 曹髦
		mb_caomao: decadeUI.dynamicSkin.caomao,

		// 曹丕
		re_caopi: decadeUI.dynamicSkin.caopi,
		ps_caopi: decadeUI.dynamicSkin.caopi,
		sb_caopi: decadeUI.dynamicSkin.caopi,
		taffyold_sb_caopi: decadeUI.dynamicSkin.caopi,

		// 曹仁
		old_caoren: decadeUI.dynamicSkin.caoren,
		sb_caoren: decadeUI.dynamicSkin.caoren,
		new_caoren: decadeUI.dynamicSkin.caoren,
		star_caoren: decadeUI.dynamicSkin.caoren,
		sp_caoren: decadeUI.dynamicSkin.caoren,
		jsp_caoren: decadeUI.dynamicSkin.caoren,
		drag_caoren: decadeUI.dynamicSkin.caoren,

		// 岑昏
		std_cenhun: decadeUI.dynamicSkin.cenhun,
		shi_cenhun: decadeUI.dynamicSkin.cenhun,

		// 陈珪
		mb_chengui: decadeUI.dynamicSkin.chengui,
		taffyshen_chengui: decadeUI.dynamicSkin.chengui,

		// 大乔
		re_daqiao: decadeUI.dynamicSkin.daqiao,
		sb_daqiao: decadeUI.dynamicSkin.daqiao,
		jd_sb_daqiao: decadeUI.dynamicSkin.daqiao,
		// yue_daqiao: decadeUI.dynamicSkin.daqiao,
		sp_daqiao: decadeUI.dynamicSkin.daqiao,

		// 典韦
		ol_dianwei: decadeUI.dynamicSkin.dianwei,
		re_dianwei: decadeUI.dynamicSkin.dianwei,
		dc_sb_dianwei: decadeUI.dynamicSkin.dianwei,
		xia_dianwei: decadeUI.dynamicSkin.dianwei,

		// 貂蝉
		re_diaochan: decadeUI.dynamicSkin.diaochan,
		sb_diaochan: decadeUI.dynamicSkin.diaochan,
		sp_diaochan: decadeUI.dynamicSkin.diaochan,
		yue_diaochan: decadeUI.dynamicSkin.diaochan,

		// 丁尚涴
		ol_dingshangwan: decadeUI.dynamicSkin.dingshangwan,

		// 董白
		re_dongbai: decadeUI.dynamicSkin.dongbai,
		jsrg_dongbai: decadeUI.dynamicSkin.dongbai,

		// 董卓
		ol_dongzhuo: decadeUI.dynamicSkin.dongzhuo,
		re_dongzhuo: decadeUI.dynamicSkin.dongzhuo,
		star_dongzhuo: decadeUI.dynamicSkin.dongzhuo,
		jsrg_dongzhuo: decadeUI.dynamicSkin.dongzhuo,
		ol_sb_dongzhuo: decadeUI.dynamicSkin.dongzhuo,
		sp_dongzhuo: decadeUI.dynamicSkin.dongzhuo,
		yj_dongzhuo: decadeUI.dynamicSkin.dongzhuo,
		new_yj_dongzhuo: decadeUI.dynamicSkin.dongzhuo,
		taffyold_new_yj_dongzhuo: decadeUI.dynamicSkin.dongzhuo,
		taffyold_ol_sb_dongzhuo: decadeUI.dynamicSkin.dongzhuo,

		// 杜预
		dc_duyu: decadeUI.dynamicSkin.duyu,
		sp_duyu: decadeUI.dynamicSkin.duyu,
		pk_sp_duyu: decadeUI.dynamicSkin.duyu,
		taffyshen_duyu: decadeUI.dynamicSkin.duyu,

		// 费祎
		ol_feiyi: decadeUI.dynamicSkin.feiyi,
		tw_feiyi: decadeUI.dynamicSkin.feiyi,
		std_feiyi: decadeUI.dynamicSkin.feiyi,
		taffyold_ol_feiyi: decadeUI.dynamicSkin.feiyi,

		// 傅佥
		taffyold_fuqian: decadeUI.dynamicSkin.fuqian,

		// 管宁
		taffydc_guanning: decadeUI.dynamicSkin.guanning,
		taffyshendc_guanning: decadeUI.dynamicSkin.guanning,

		// 关羽
		re_guanyu: decadeUI.dynamicSkin.guanyu,
		ol_sb_guanyu: decadeUI.dynamicSkin.guanyu,
		sb_guanyu: decadeUI.dynamicSkin.guanyu,
		ps_guanyu: decadeUI.dynamicSkin.guanyu,
		old_guanyu: decadeUI.dynamicSkin.guanyu,
		junk_guanyu: decadeUI.dynamicSkin.guanyu,
		jx_guanyu: decadeUI.dynamicSkin.guanyu,
		jd_sb_guanyu: decadeUI.dynamicSkin.guanyu,
		ty_guanyu: decadeUI.dynamicSkin.guanyu,
		xia_guanyu: decadeUI.dynamicSkin.guanyu,
		drag_guanyu: decadeUI.dynamicSkin.guanyu,
		taffyold_sb_guanyu: decadeUI.dynamicSkin.guanyu,
		taffyold_ol_sb_guanyu: decadeUI.dynamicSkin.guanyu,
		jsp_guanyu: decadeUI.dynamicSkin.guanyu,
		dc_jsp_guanyu: decadeUI.dynamicSkin.guanyu,
		jsrg_guanyu: decadeUI.dynamicSkin.guanyu,

		// 关索
		dc_guansuo: decadeUI.dynamicSkin.guansuo,

		// 郭嘉
		re_guojia: decadeUI.dynamicSkin.guojia,
		yj_sb_guojia: decadeUI.dynamicSkin.guojia,
		ps1059_guojia: decadeUI.dynamicSkin.guojia,
		ps2070_guojia: decadeUI.dynamicSkin.guojia,
		huan_guojia: decadeUI.dynamicSkin.guojia,
		jsrg_guojia: decadeUI.dynamicSkin.guojia,

		// 郭照
		xin_guozhao: decadeUI.dynamicSkin.guozhao,
		jsrg_guozhao: decadeUI.dynamicSkin.guozhao,
		ol_guozhao: decadeUI.dynamicSkin.guozhao,
		taffyold_xin_guozhao: decadeUI.dynamicSkin.guozhao,
		taffype_guozhao: decadeUI.dynamicSkin.guozhao,

		// 胡金定
		dc_hujinding: decadeUI.dynamicSkin.hujinding,
		ol_hujinding: decadeUI.dynamicSkin.hujinding,
		taffyold_ol_hujinding: decadeUI.dynamicSkin.hujinding,

		// 黄承彦
		dc_huangchengyan: decadeUI.dynamicSkin.huangchengyan,

		// 皇甫嵩
		sp_huangfusong: decadeUI.dynamicSkin.huangfusong,
		jsrg_huangfusong: decadeUI.dynamicSkin.huangfusong,
		old_huangfusong: decadeUI.dynamicSkin.huangfusong,
		hm_shen_huangfusong: decadeUI.dynamicSkin.huangfusong,

		// 黄盖
		re_huanggai: decadeUI.dynamicSkin.huanggai,
		sb_huanggai: decadeUI.dynamicSkin.huanggai,
		taffyold_sb_huanggai: decadeUI.dynamicSkin.huanggai,
		dc_sb_huanggai: decadeUI.dynamicSkin.huanggai,

		// 黄舞蝶
		dc_huangwudie: decadeUI.dynamicSkin.huangwudie,

		// 黄忠
		re_huangzhong: decadeUI.dynamicSkin.huangzhong,
		ol_huangzhong: decadeUI.dynamicSkin.huangzhong,
		sb_huangzhong: decadeUI.dynamicSkin.huangzhong,
		jsrg_huangzhong: decadeUI.dynamicSkin.huangzhong,
		yj_huangzhong: decadeUI.dynamicSkin.huangzhong,
		taffyold_sb_huangzhong: decadeUI.dynamicSkin.huangzhong,

		// 贾充
		dc_jiachong: decadeUI.dynamicSkin.jiachong,
		jin_jiachong: decadeUI.dynamicSkin.jiachong,
		mb_jiachong: decadeUI.dynamicSkin.jiachong,

		// 沮授
		re_jushou: decadeUI.dynamicSkin.yj_jushou,
		xin_jushou: decadeUI.dynamicSkin.yj_jushou,
		dc_sb_jushou: decadeUI.dynamicSkin.yj_jushou,
		taffyred_xin_jushou: decadeUI.dynamicSkin.yj_jushou,

		// 李儒
		xin_liru: decadeUI.dynamicSkin.liru,
		dc_liru: decadeUI.dynamicSkin.liru,
		re_liru: decadeUI.dynamicSkin.liru,
		yj_liru: decadeUI.dynamicSkin.liru,
		ol_liru: decadeUI.dynamicSkin.liru,

		// 凌统
		xin_lingtong: decadeUI.dynamicSkin.lingtong,
		ol_lingtong: decadeUI.dynamicSkin.lingtong,
		re_lingtong: decadeUI.dynamicSkin.lingtong,
		old_lingtong: decadeUI.dynamicSkin.lingtong,

		// 刘备
		re_liubei: decadeUI.dynamicSkin.liubei,
		sb_liubei: decadeUI.dynamicSkin.liubei,
		dc_liubei: decadeUI.dynamicSkin.liubei,
		junk_liubei: decadeUI.dynamicSkin.liubei,
		jd_sb_liubei: decadeUI.dynamicSkin.liubei,
		ty_liubei: decadeUI.dynamicSkin.liubei,
		xia_liubei: decadeUI.dynamicSkin.liubei,
		sp_liubei: decadeUI.dynamicSkin.liubei,
		sp_ol_liubei: decadeUI.dynamicSkin.liubei,
		jsrg_liubei: decadeUI.dynamicSkin.liubei,
		jsp_liubei: decadeUI.dynamicSkin.liubei,

		// 刘永
		jsrg_liuyong: decadeUI.dynamicSkin.liuyong,

		// 留赞
		re_liuzan: decadeUI.dynamicSkin.liuzan,

		// 陆凯
		ol_lukai: decadeUI.dynamicSkin.lukai,
		taffyold_lukai: decadeUI.dynamicSkin.lukai,

		// 陆逊
		re_luxun: decadeUI.dynamicSkin.luxun,
		jsrg_luxun: decadeUI.dynamicSkin.luxun,
		sb_luxun: decadeUI.dynamicSkin.luxun,
		ty_luxun: decadeUI.dynamicSkin.luxun,
		huan_luxun: decadeUI.dynamicSkin.luxun,

		// 陆郁生
		ol_luyusheng: decadeUI.dynamicSkin.luyusheng,
		taffyold_ol_luyusheng: decadeUI.dynamicSkin.luyusheng,

		// 吕布
		re_lvbug: decadeUI.dynamicSkin.lvbu,
		jsrg_lvbu: decadeUI.dynamicSkin.lvbu,
		ps_lvbu: decadeUI.dynamicSkin.lvbu,
		ol_jsrg_lvbu: decadeUI.dynamicSkin.lvbu,
		v_lvbu: decadeUI.dynamicSkin.lvbu,

		// 骆统
		dc_luotong: decadeUI.dynamicSkin.luotong,
		std_dc_luotong: decadeUI.dynamicSkin.luotong,

		// 卢植
		yl_luzhi: decadeUI.dynamicSkin.luzhi,
		jsrg_yl_luzhi: decadeUI.dynamicSkin.luzhi,
		sb_yl_luzhi: decadeUI.dynamicSkin.luzhi,
		tw_yl_luzhi: decadeUI.dynamicSkin.luzhi,
		hm_shen_luzhi: decadeUI.dynamicSkin.luzhi,

		// 马钧
		yj_majun: decadeUI.dynamicSkin.majun,
		cx_majun: decadeUI.dynamicSkin.majun,
		qq_majun: decadeUI.dynamicSkin.majun,
		old_majun: decadeUI.dynamicSkin.majun,
		taffyold_yj_majun: decadeUI.dynamicSkin.majun,

		// 祢衡
		re_miheng: decadeUI.dynamicSkin.miheng,
		// yue_miheng: decadeUI.dynamicSkin.miheng,
		scl_miheng: decadeUI.dynamicSkin.miheng,

		// 南华老仙
		re_nanhualaoxian: decadeUI.dynamicSkin.nanhualaoxian,
		ol_nanhualaoxian: decadeUI.dynamicSkin.nanhualaoxian,
		jsrg_nanhualaoxian: decadeUI.dynamicSkin.nanhualaoxian,
		taffyold_ol_nanhualaoxian: decadeUI.dynamicSkin.nanhualaoxian,

		// 潘淑
		re_panshu: decadeUI.dynamicSkin.panshu,

		// 蒲元
		ol_puyuan: decadeUI.dynamicSkin.puyuan,

		// 清河公主
		dc_qinghegongzhu: decadeUI.dynamicSkin.qinghegongzhu,

		// 阮瑀
		taffyold_ruanyu: decadeUI.dynamicSkin.ruanyu,

		// 芮姬
		dc_ruiji: decadeUI.dynamicSkin.ruiji,
		taffyold_ruiji: decadeUI.dynamicSkin.ruiji,

		// 十常侍
		taffyold_scs_zhangrang: decadeUI.dynamicSkin.scs_zhangrang,
		taffyold_scs_zhaozhong: decadeUI.dynamicSkin.scs_zhaozhong,
		taffyold_scs_sunzhang: decadeUI.dynamicSkin.scs_sunzhang,
		taffyold_scs_bilan: decadeUI.dynamicSkin.scs_bilan,
		taffyold_scs_xiayun: decadeUI.dynamicSkin.scs_xiayun,
		taffyold_scs_hankui: decadeUI.dynamicSkin.scs_hankui,
		taffyold_scs_lisong: decadeUI.dynamicSkin.scs_lisong,
		taffyold_scs_duangui: decadeUI.dynamicSkin.scs_duangui,
		taffyold_scs_guosheng: decadeUI.dynamicSkin.scs_guosheng,
		taffyold_scs_gaowang: decadeUI.dynamicSkin.scs_gaowang,

		// 沙摩柯
		ty_shamoke: decadeUI.dynamicSkin.shamoke,
		taffyshen_shamoke: decadeUI.dynamicSkin.shamoke,
		taffyre_shamoke: decadeUI.dynamicSkin.shamoke,

		// 神曹操
		old_caocao: decadeUI.dynamicSkin.shen_caocao,
		taffymb_shen_caocao: decadeUI.dynamicSkin.shen_caocao,

		// 神关羽
		tw_shen_guanyu: decadeUI.dynamicSkin.shen_guanyu,
		ty_shen_guanyu: decadeUI.dynamicSkin.shen_guanyu,

		// 神华佗
		dc_shen_huatuo: decadeUI.dynamicSkin.shen_huatuo,
		taffyold_dc_shen_huatuo: decadeUI.dynamicSkin.shen_huatuo,

		// 神姜维
		taffyps_shen_jiangwei: decadeUI.dynamicSkin.shen_jiangwei,

		// 神吕蒙
		tw_shen_lvmeng: decadeUI.dynamicSkin.shen_lvmeng,
		taffyold_tw_shen_lvmeng: decadeUI.dynamicSkin.shen_lvmeng,

		// 神马超
		ps_shen_machao: decadeUI.dynamicSkin.shen_machao,

		// 神庞统
		taffyold_shen_pangtong: decadeUI.dynamicSkin.shen_pangtong,

		// 神司马懿
		xin_simayi: decadeUI.dynamicSkin.shen_simayi,
		new_simayi: decadeUI.dynamicSkin.shen_simayi,
		taffyold_baby_shen_simayi: decadeUI.dynamicSkin.shen_simayi,
		taffyold_xin_simayi: decadeUI.dynamicSkin.shen_simayi,
		taffyold_new_simayi: decadeUI.dynamicSkin.shen_simayi,

		// 神荀彧
		taffyold_shen_xunyu: decadeUI.dynamicSkin.shen_xunyu,

		// 神许褚
		taffyold_shen_xuzhu: decadeUI.dynamicSkin.shen_xuzhu,

		// 神赵云
		dc_zhaoyun: decadeUI.dynamicSkin.shen_zhaoyun,
		old_shen_zhaoyun: decadeUI.dynamicSkin.shen_zhaoyun,
		// boss_zhaoyun: decadeUI.dynamicSkin.shen_zhaoyun,

		// 神张飞
		ty_shen_zhangfei: decadeUI.dynamicSkin.shen_zhangfei,

		// 司马师
		dc_simashi: decadeUI.dynamicSkin.simashi,
		jin_simashi: decadeUI.dynamicSkin.simashi,
		std_simashi: decadeUI.dynamicSkin.simashi,
		jd_jin_simashi: decadeUI.dynamicSkin.simashi,

		// 司马懿
		re_simayi: decadeUI.dynamicSkin.simayi,
		jsrg_simayi: decadeUI.dynamicSkin.simayi,
		ps_simayi: decadeUI.dynamicSkin.simayi,
		ps2068_simayi: decadeUI.dynamicSkin.simayi,
		yy_simayi: decadeUI.dynamicSkin.simayi,

		// 谋司马懿
		dc_sb_simayi: decadeUI.dynamicSkin.sb_simayi,

		// 司马昭
		jin_simazhao: decadeUI.dynamicSkin.simazhao,
		sp_simazhao: decadeUI.dynamicSkin.simazhao,
		jd_jin_simazhao: decadeUI.dynamicSkin.simazhao,
		jsrg_simazhao: decadeUI.dynamicSkin.simazhao,
		jin_jsrg_simazhao: decadeUI.dynamicSkin.simazhao,

		// 孙策
		re_sunce: decadeUI.dynamicSkin.sunce,
		re_sunben: decadeUI.dynamicSkin.sunce,
		sb_sunce: decadeUI.dynamicSkin.sunce,
		dc_sunce: decadeUI.dynamicSkin.sunce,
		jsrg_sunce: decadeUI.dynamicSkin.sunce,
		sp_sunce: decadeUI.dynamicSkin.sunce,

		// 孙寒华
		dc_sunhanhua: decadeUI.dynamicSkin.sunhanhua,

		// 孙坚
		re_sunjian: decadeUI.dynamicSkin.sunjian,
		ol_sunjian: decadeUI.dynamicSkin.sunjian,
		ns_sunjian: decadeUI.dynamicSkin.sunjian,
		jsrg_sunjian: decadeUI.dynamicSkin.sunjian,

		// 孙鲁育
		re_sunluyu: decadeUI.dynamicSkin.sunluyu,
		mb_sunluyu: decadeUI.dynamicSkin.sunluyu,

		// 孙权
		re_sunquan: decadeUI.dynamicSkin.sunquan,
		sb_sunquan: decadeUI.dynamicSkin.sunquan,
		dc_sunquan: decadeUI.dynamicSkin.sunquan,
		xin_sunquan: decadeUI.dynamicSkin.sunquan,
		jd_sb_sunquan: decadeUI.dynamicSkin.sunquan,
		ty_sunquan: decadeUI.dynamicSkin.sunquan,
		v_sunquan: decadeUI.dynamicSkin.sunquan,
		taffyhuiwan_sunquan: decadeUI.dynamicSkin.sunquan,
		taffyhuiwanplus_sunquan: decadeUI.dynamicSkin.sunquan,
		taffyold_v_sunquan: decadeUI.dynamicSkin.sunquan,

		// 孙茹
		dc_sunru: decadeUI.dynamicSkin.sunru,
		ol_sunru: decadeUI.dynamicSkin.sunru,

		// 孙翊
		re_sunyi: decadeUI.dynamicSkin.sunyi,
		tw_sunyi: decadeUI.dynamicSkin.sunyi,

		// 滕芳兰
		dc_tengfanglan: decadeUI.dynamicSkin.tengfanglan,
		taffyold_tengfanglan: decadeUI.dynamicSkin.tengfanglan,

		// 滕公主
		taffyold_tenggongzhu: decadeUI.dynamicSkin.tenggongzhu,

		// 王元姬
		jin_wangyuanji: decadeUI.dynamicSkin.wangyuanji,
		sp_wangyuanji: decadeUI.dynamicSkin.wangyuanji,
		std_wangyuanji: decadeUI.dynamicSkin.wangyuanji,
		jd_jin_wangyuanji: decadeUI.dynamicSkin.wangyuanji,

		// 文鸯
		db_wenyang: decadeUI.dynamicSkin.wenyang,
		diy_wenyang: decadeUI.dynamicSkin.wenyang,
		std_db_wenyang: decadeUI.dynamicSkin.wenyang,
		taffyold_db_wenyang: decadeUI.dynamicSkin.wenyang,

		// 吴苋
		clan_wuxian: decadeUI.dynamicSkin.wuxian,

		// 吴懿
		re_wuyi: decadeUI.dynamicSkin.wuyi,
		xin_wuyi: decadeUI.dynamicSkin.wuyi,
		dc_wuyi: decadeUI.dynamicSkin.wuyi,

		// 武关羽
		taffyold_wu_guanyu: decadeUI.dynamicSkin.wu_guanyu,

		// 武诸葛亮
		taffyold_wu_zhugeliang: decadeUI.dynamicSkin.wu_zhugeliang,

		// 夏侯氏
		re_xiahoushi: decadeUI.dynamicSkin.xiahoushi,
		sb_xiahoushi: decadeUI.dynamicSkin.xiahoushi,
		sp_xiahoushi: decadeUI.dynamicSkin.xiahoushi,

		// 薛灵芸
		ol_xuelingyun: decadeUI.dynamicSkin.xuelingyun,
		ddd_xuelingyun: decadeUI.dynamicSkin.xuelingyun,

		// 许靖
		dc_xujing: decadeUI.dynamicSkin.xujing,
		sp_xujing: decadeUI.dynamicSkin.xujing,
		tw_xujing: decadeUI.dynamicSkin.xujing,

		// 徐荣
		taffyold_xurong: decadeUI.dynamicSkin.xurong,

		// 徐盛
		re_xusheng: decadeUI.dynamicSkin.xusheng,
		xin_xusheng: decadeUI.dynamicSkin.xusheng,
		old_xusheng: decadeUI.dynamicSkin.xusheng,

		// 许劭
		jsrg_xushao: decadeUI.dynamicSkin.xushao,
		taffyboss_xushao: decadeUI.dynamicSkin.xushao,
		taffydc_xushao: decadeUI.dynamicSkin.xushao,
		taffyhuiwan_xushao: decadeUI.dynamicSkin.xushao,
		taffyre_xushao: decadeUI.dynamicSkin.xushao,
		taffyshen_xushao: decadeUI.dynamicSkin.xushao,

		// 荀采
		clan_xuncai: decadeUI.dynamicSkin.xuncai,
		taffyold_clan_xuncai: decadeUI.dynamicSkin.xuncai,

		// 许攸
		sp_xuyou: decadeUI.dynamicSkin.xuyou,
		jsrg_xuyou: decadeUI.dynamicSkin.xuyou,
		yj_xuyou: decadeUI.dynamicSkin.xuyou,
		junk_xuyou: decadeUI.dynamicSkin.xuyou,
		taffyre_xuyou: decadeUI.dynamicSkin.xuyou,

		// 荀彧
		ol_xunyu: decadeUI.dynamicSkin.xunyu,
		re_xunyu: decadeUI.dynamicSkin.xunyu,
		sb_xunyu: decadeUI.dynamicSkin.xunyu,
		star_xunyu: decadeUI.dynamicSkin.xunyu,

		// 袁谭袁尚
		// yuantanyuanxiyuanshang: decadeUI.dynamicSkin.yuantanyuanshang,
		taffyold_yuantanyuanshang: decadeUI.dynamicSkin.yuantanyuanshang,

		// 于吉
		xin_yuji: decadeUI.dynamicSkin.yuji,
		re_yuji: decadeUI.dynamicSkin.yuji,
		taffyshen_yuji: decadeUI.dynamicSkin.yuji,

		// 张春华
		re_zhangchunhua: decadeUI.dynamicSkin.zhangchunhua,
		ol_zhangchunhua: decadeUI.dynamicSkin.zhangchunhua,
		jin_zhangchunhua: decadeUI.dynamicSkin.zhangchunhua,
		star_zhangchunhua: decadeUI.dynamicSkin.zhangchunhua,

		// 张辽
		re_zhangliao: decadeUI.dynamicSkin.zhangliao,
		sp_zhangliao: decadeUI.dynamicSkin.zhangliao,
		v_zhangliao: decadeUI.dynamicSkin.zhangliao,
		yj_zhangliao: decadeUI.dynamicSkin.zhangliao,
		jsrg_zhangliao: decadeUI.dynamicSkin.zhangliao,

		// 张琪瑛
		old_zhangqiying: decadeUI.dynamicSkin.zhangqiying,

		// 张让
		ol_zhangrang: decadeUI.dynamicSkin.zhangrang,
		junk_zhangrang: decadeUI.dynamicSkin.zhangrang,
		taffyold_zhangrang: decadeUI.dynamicSkin.zhangrang,

		// 张嫙
		jsrg_zhangxuan: decadeUI.dynamicSkin.zhangxuan,

		// 赵襄
		tw_zhaoxiang: decadeUI.dynamicSkin.zhaoxiang,
		dc_zhaoxiang: decadeUI.dynamicSkin.zhaoxiang,

		// 赵俨
		dc_zhaoyǎn: decadeUI.dynamicSkin.zhaoyǎn,
		taffyold_dc_zhaoyǎn: decadeUI.dynamicSkin.zhaoyǎn,

		// 赵云
		re_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		old_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		sb_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		jsrg_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		ps2063_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		ps2067_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		huan_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		jd_sb_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		ol_sb_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		sp_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		jsp_zhaoyun: decadeUI.dynamicSkin.zhaoyun,
		yy_zhaoyun: decadeUI.dynamicSkin.zhaoyun,

		// SP甄姬
		jsrg_zhenji: decadeUI.dynamicSkin.sp_zhenji,
		mb_sp_zhenji: decadeUI.dynamicSkin.sp_zhenji,

		// 钟会
		xin_zhonghui: decadeUI.dynamicSkin.zhonghui,
		re_zhonghui: decadeUI.dynamicSkin.zhonghui,
		old_zhonghui: decadeUI.dynamicSkin.zhonghui,
		pe_zhonghui: decadeUI.dynamicSkin.zhonghui,
		clan_zhonghui: decadeUI.dynamicSkin.zhonghui,
		yj_zhonghui: decadeUI.dynamicSkin.zhonghui,
		std_zhonghui: decadeUI.dynamicSkin.zhonghui,
		taffyold_clan_zhonghui: decadeUI.dynamicSkin.zhonghui,

		// 钟琰
		clan_zhongyan: decadeUI.dynamicSkin.zhongyan,

		// 周处
		jin_zhouchu: decadeUI.dynamicSkin.zhouchu,
		tw_zhouchu: decadeUI.dynamicSkin.zhouchu,
		std_zhouchu: decadeUI.dynamicSkin.zhouchu,

		// 周宣
		dc_zhouxuān: decadeUI.dynamicSkin.zhouxuān,

		// 乐周瑜
		re_zhouyu: decadeUI.dynamicSkin.zhouyu,
		dc_sb_zhouyu: decadeUI.dynamicSkin.zhouyu,
		yue_zhouyu: decadeUI.dynamicSkin.zhouyu,
		sb_zhouyu: decadeUI.dynamicSkin.zhouyu,
		ps1062_zhouyu: decadeUI.dynamicSkin.zhouyu,
		ps2080_zhouyu: decadeUI.dynamicSkin.zhouyu,
		jx_zhouyu: decadeUI.dynamicSkin.zhouyu,

		// 诸葛亮
		re_zhugeliang: decadeUI.dynamicSkin.zhugeliang,
		ps2066_zhugeliang: decadeUI.dynamicSkin.zhugeliang,
		ps_zhugeliang: decadeUI.dynamicSkin.zhugeliang,
		taffyold_sb_zhugeliang: decadeUI.dynamicSkin.zhugeliang,
		sp_zhugeliang: decadeUI.dynamicSkin.zhugeliang,
		ol_sp_zhugeliang: decadeUI.dynamicSkin.zhugeliang,
		re_sp_zhugeliang: decadeUI.dynamicSkin.zhugeliang,
		sb_sp_zhugeliang: decadeUI.dynamicSkin.zhugeliang,
		jd_sb_sp_zhugeliang: decadeUI.dynamicSkin.zhugeliang,
		taffyold_sb_sp_zhugeliang: decadeUI.dynamicSkin.zhugeliang,

		// 幻诸葛亮
		jsrg_zhugeliang: decadeUI.dynamicSkin.huan_zhugeliang,

		// 左慈
		re_zuoci: decadeUI.dynamicSkin.zuoci,

		// 大叔
		swimsuit_hoshino: decadeUI.dynamicSkin.hoshino,
	};
	decadeUI.get.extend(decadeUI.dynamicSkin, extend);
});
