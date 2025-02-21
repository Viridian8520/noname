// @ts-nocheck
import {lib,get,_status,ui,game,ai} from './noname.js';
import {nonameInitialized} from '../../../noname/util/index.js'
// @ts-ignore
// @ts-ignore
// @ts-ignore
export let CONTENT = function (config, pack) {
    // @ts-ignore
    if((lib.config.qhly_funcLoadInPrecontent || game.qhly_hasExtension("如真似幻")) && !window.qhly_inPercontent){
      return;
    }
    // @ts-ignore
    var skinSwitch = window.skinSwitch;
    const qhlyLib = ['qhly_skinShare', 'qhly_skinEdit', 'qhly_skinChange', 'qhly_changeSkillSkin'];
    for (let l of qhlyLib) if (!lib[l]) lib[l] = {};
    var qhly_DynamicPlayer = (function () {
      function DynamicPlayer(pathPrefix) {
        // @ts-ignore
        this.id = duilib.BUILT_ID++;
        this.dpr = 1;
        this.width = 120;
        this.height = 180;
        this.dprAdaptive = false;
        this.BUILT_ID = 0;
        var offscreen = self.OffscreenCanvas != undefined;
        if (offscreen) {
          offscreen = false;
          // @ts-ignore
          var workers = duilib.DynamicWorkers;
          for (var i = 0; i < workers.length; i++) {
            if (workers[i] == undefined) {
              // @ts-ignore
              workers[i] = new Worker(lib.qhly_path + '/data/dw.js');
              workers[i].capacity = 0;
            } else if (workers[i].capacity >= 4) {
              continue;
            }

            this.renderer = workers[i];
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'animation-player';
            // @ts-ignore
            duilib.observeSize(this.canvas, duilib.throttle(function (newSize) {
              this.height = Math.round(newSize.height);
              this.width = Math.round(newSize.width);
              // @ts-ignore
              this.update();
            }, 100, this));

            var canvas = this.canvas.transferControlToOffscreen();
            // @ts-ignore
            if (decadeUI.isMobile()) {
              pathPrefix = '../../..//十周年UI/' + pathPrefix
            } else {
              pathPrefix = '../../../十周年UI/' + pathPrefix
            }
            workers[i].postMessage({
              message: 'CREATE',
              id: this.id,
              canvas: canvas,
              pathPrefix: pathPrefix,
            }, [canvas]);

            workers[i].capacity++;
            this.offscreen = offscreen = true;
            break;
          }
        }
        if (!offscreen) {
          // @ts-ignore
          var renderer = new duilib.AnimationPlayer(decadeUIPath + pathPrefix);
          this.canvas = renderer.canvas;
          this.renderer = renderer;
          // @ts-ignore
          dui.bodySensor.addListener(duilib.throttle(function () {
            this.renderer.resized = false;
          }, 100, this), true);
        }
      }
      DynamicPlayer.prototype.play = function (sprite) {
        var sprite = (typeof sprite == 'string') ? { name: sprite } : sprite;
        sprite.id = this.BUILT_ID++;
        sprite.loop = true;

        if (this.offscreen) {
          if (!this.initialized) {
            this.initialized = true;
            // @ts-ignore
            this.dpr = Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1);
            this.height = this.canvas.clientHeight;
            this.width = this.canvas.clientWidth;
          }

          if (typeof sprite.oncomplete == 'function')
            sprite.oncomplete = sprite.oncomplete.toString();

          this.renderer.postMessage({
            message: 'PLAY',
            id: this.id,
            dpr: this.dpr,
            dprAdaptive: this.dprAdaptive,
            // @ts-ignore
            outcropMask: this.outcropMask,
            // @ts-ignore
            useMipMaps: this.useMipMaps,
            width: this.width,
            height: this.height,
            sprite: sprite,
          });
        } else {
          var dynamic = this.renderer;
          // @ts-ignore
          dynamic.useMipMaps = this.useMipMaps;
          dynamic.dprAdaptive = this.dprAdaptive;
          // @ts-ignore
          dynamic.outcropMask = this.outcropMask;
          var run = function () {
            var t = dynamic.playSpine(sprite);
            t.opacity = 0;
            t.fadeTo(1, 600);
          };

          if (dynamic.hasSpine(sprite.name)) {
            run();
          } else {
            dynamic.loadSpine(sprite.name, 'skel', run);
          }
        }

        return sprite;
      };

      DynamicPlayer.prototype.stop = function (sprite) {
        if (this.offscreen) {
          this.renderer.postMessage({
            message: 'STOP',
            id: this.id,
            sprite: sprite,
          });
          return;
        }

        this.renderer.stopSpine(sprite);
      };

      DynamicPlayer.prototype.stopAll = function () {
        if (this.offscreen) {
          this.renderer.postMessage({
            message: 'STOPALL',
            id: this.id
          });
          return;
        }

        this.renderer.stopSpineAll();
      };

      DynamicPlayer.prototype.update = function (force) {
        if (!this.offscreen) {
          this.renderer.resized = false;
          // @ts-ignore
          this.renderer.useMipMaps = this.useMipMaps;
          this.renderer.dprAdaptive = this.dprAdaptive;
          // @ts-ignore
          this.renderer.outcropMask = this.outcropMask;
          return;
        }

        // @ts-ignore
        this.dpr = Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1);
        if (force === false)
          return;

        this.renderer.postMessage({
          message: 'UPDATE',
          id: this.id,
          dpr: this.dpr,
          dprAdaptive: this.dprAdaptive,
          // @ts-ignore
          outcropMask: this.outcropMask,
          // @ts-ignore
          useMipMaps: this.useMipMaps,
          width: this.width,
          height: this.height,
        });
      }
      return DynamicPlayer;
    })();
    // @ts-ignore
    lib.arenaReady.push(function () {
      const oldLogSkill = lib.element.player.logSkill;
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      lib.element.player.logSkill = function (name, targets, nature, logv) {
        // @ts-ignore
        game.qhly_changeSkillSkin(this, name);
        oldLogSkill.apply(this, arguments);
      }
      // @ts-ignore
      if (!window.decadeUI) {
        let viewConfig = lib.config['extension_千幻聆音_qhly_currentViewSkin'];
        if ((viewConfig == 'decade' || viewConfig == 'shousha') && !lib.config['extension_千幻聆音_qhly_decadeCloseDynamic']) {
          let cfm = confirm("千幻聆音：检测到十周年UI并未正常开启，无法正常使用千幻聆音中的十周年和手杀主题的动皮功能，点击【确定】将关闭所有动皮功能，点击【取消】将为您切换至默认主题并重启。");
          if (cfm) {
            game.saveConfig('extension_千幻聆音_qhly_decadeCloseDynamic', true);
          } else {
            lib.config.qhly_currentViewSkin = 'xuanwujianghu';
            game.saveConfig('qhly_currentViewSkin', lib.config.qhly_currentViewSkin);
            game.saveConfig('extension_千幻聆音_qhly_currentViewSkin', lib.config.qhly_currentViewSkin);
            game.reload();
          }
        }
      } else {
        // @ts-ignore
        decadeUI.animation.loadSpine(window.qhlyUI.assets.huanpifu.name, "skel");
        // @ts-ignore
        decadeUI.animation.loadSpine(window.qhlyUI.assets.pinzhi.name, "skel");
        // @ts-ignore
        decadeUI.animation.loadSpine(window.qhlyUI.assets.huanfu.name, "skel");
        if (!lib.config.qhly_mentionDynamic2) {
          let viewConfig = lib.config['extension_千幻聆音_qhly_currentViewSkin'];
          if ((viewConfig == 'decade' || viewConfig == 'shousha') && lib.config['extension_千幻聆音_qhly_decadeCloseDynamic']) {
            if (confirm("千幻聆音：检测到您开启了千幻聆音设置中的“关闭所有动皮效果”，这将无法正常使用千幻聆音的动皮功能（并有可能造成其它错误），点击【确定】关闭该选项，点击【取消】将不再提醒。")) {
              game.saveConfig('extension_千幻聆音_qhly_decadeCloseDynamic', false);
            } else {
              game.saveConfig('qhly_mentionDynamic2', true);
            }
          }
        }
        // @ts-ignore
        if (game.qhly_hasExtension('皮肤切换') && window.skinSwitch && lib.config[window.skinSwitch.configKey.useDynamic]) {
          // @ts-ignore
          window.dynamicExt = window.skinSwitch;
          skinSwitch.dynamic.transformDst = function (player, isPrimary, dstInfo, extraParams = { isOrigin: false, huanfuEffect: null }) {
            const avatar = isPrimary ? player.dynamic.primary : player.dynamic.deputy
            let { isOrigin, huanfuEffect } = extraParams
            // 标明这时转换播放骨骼
            // @ts-ignore
            dstInfo = game.qhly_formatDS(dstInfo, player.name);
            dstInfo = Object.assign({}, dstInfo)
            dstInfo._transform = true
            if (dstInfo.name == null || dstInfo.name === avatar.name) {
              if (dstInfo.action) {
                skinSwitch.postMsgApi.changeAvatarAction(player, isPrimary, dstInfo, isOrigin)
              }
              if (dstInfo.skin) {
                skinSwitch.postMsgApi.changeSkelSkin(player, dstInfo.skin, isPrimary)
              }
            } else {
              dstInfo.player = dstInfo
              let huanfuEff = {
                name: '../../../皮肤切换/effects/transform/default',
                scale: 0.7,
                speed: 0.6,
                delay: 0.3, // 默认设置的延迟是0.2秒
              }
              const changeEffects = skinSwitch.effects.transformEffects
              if (huanfuEffect) {
                if (typeof huanfuEffect === 'string') {
                  if (huanfuEffect in changeEffects) {
                    huanfuEffect = changeEffects[huanfuEffect]
                  } else {
                    // @ts-ignore
                    huanfuEffect = { name: huanfuEffect };
                  }
                }
                huanfuEff = Object.assign(huanfuEff, huanfuEffect)
                // @ts-ignore
                huanfuEff.name = '../../../皮肤切换/effects/transform/' + huanfuEffect.name
              }
              skinSwitch.chukuangWorkerApi.playEffect(huanfuEff, { parent: player })
              dstInfo.deputy = !isPrimary
              setTimeout(() => {
                player.stopDynamic(isPrimary, !isPrimary)
                // taffy: 注释content.js原版代码喵
                // player.playDynamic(dstInfo, !isPrimary);
                /* taffy分界线 */
                // taffy: 修复变身后动态背景裁剪丢失的问题
                player.playDynamic(dstInfo, !isPrimary, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on', lib.config['extension_千幻聆音_qhly_ignoreClips']);
                /* taffy分界线 */
              }, (huanfuEff.delay || 0) * 1000)
              if (dstInfo.background) {
                player.$dynamicWrap.style.backgroundImage = 'url("' + lib.assetURL + 'extension/十周年UI/assets/dynamic/' + dstInfo.background + '")';
              }
              player.classList.add(!isPrimary ? 'd-skin2' : 'd-skin');
              skinSwitch.dynamic.startPlay2Random(player)
              // 皮肤变化了, 修改编辑的全局变量
              // @ts-ignore
              if (isPrimary && window.dynamicEditBox && player === game.me) {
                // @ts-ignore
                dynamicEditBox.updateGlobalParams()
              }
            }
          }
        // @ts-ignore
        } else if (game.qhly_hasExtension('EpicFX') && lib.config['extension_EpicFX_skinEffects']) {
          //以下为适配EpicFX做的函数修改
          // @ts-ignore
          window.dynamicExt = window.EpicFX;
          // @ts-ignore
          window.qhly_newDynamicExt = true;
          // @ts-ignore
          EpicFX.canAction2 = function (player, action) {
            let skin;
            let bool1 = false;
            // @ts-ignore
            if (get.itemtype(player) == 'player') {
              if (!player.isUnseen(0) && player.skinPack.zhuSkinType == "decade") bool1 = true;
            } else bool1 = true;
            if (bool1 && player.dynamic && player.dynamic.primary) {
              skin = player.dynamic.primary;
            }
            if (!skin) return false;
            if (skin.effects) {
              let res = skin.effects[action];
              if (res) return res;
              else return false;
            } else {
              return false;
            }
          };
          // @ts-ignore
          EpicFX.playDynamic = (player, character, character2, play, transform, cutdybg) => {
            // taffy: 注释content.js原版代码喵
            // if (!cutdybg) cutdybg = ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.newDecadeStyle == 'on';
            /* taffy分界线 */
            // taffy: 适配一将成名UI
            if (!cutdybg) cutdybg = ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on';
            /* taffy分界线 */
            let res2 = {
              status: false,
              zhu: "default",
              fu: "default"
            }
            if (get.mode() == "guozhan" && !play) return res2;
            // @ts-ignore
            let CUR_DYNAMIC = decadeUI.CUR_DYNAMIC;
            // @ts-ignore
            let MAX_DYNAMIC = decadeUI.MAX_DYNAMIC;
            if (player.dynamic && !play)
              player.stopDynamic();
            // @ts-ignore
            var showDynamic = (player.dynamic || CUR_DYNAMIC < MAX_DYNAMIC) && duicfg.dynamicSkin;
            // @ts-ignore
            if (showDynamic && _status.mode != null) {
              var skins;
              // @ts-ignore
              var dskins = decadeUI.dynamicSkin;
              var avatars = player.doubleAvatar ? [character, character2] : [character];
              var increased;
              for (var i = 0; i < avatars.length; i++) {
                // @ts-ignore
                if (!play && EpicFX.hasHiddenSkill(avatars[i], player)) continue;
                // if (get.mode() == 'guozhan' && lib.config['extension_千幻聆音_qhly_guozhanDS']) {
                //     if (avatars[i] && avatars[i].indexOf('gz_') == 0) {
                //         let extend = { [avatars[i]]: decadeUI.dynamicSkin[avatars[i].slice(3)] };
                //         decadeUI.get.extend(decadeUI.dynamicSkin, extend);
                //     }
                // }
                // if (lib.qhly_skinShare[avatars[i]] && lib.qhly_skinShare[avatars[i]].name) {
                //     let extend = { [avatars[i]]: decadeUI.dynamicSkin[lib.qhly_skinShare[avatars[i]].name] };
                //     decadeUI.get.extend(decadeUI.dynamicSkin, extend);
                // }
                skins = dskins[avatars[i]];
                if (skins == undefined)
                  continue;
                var keys = Object.keys(skins);
                if (keys.length == 0) {
                  console.error('player.init: ' + avatars[i] + ' 没有设置动皮参数');
                  continue;
                }
                var skin;
                var namex = i == 0 ? character : character2;
                if (transform) skin = transform;
                else if (lib && lib.config && lib.config.qhly_skinset && lib.config.qhly_skinset.djtoggle && lib.config.extensions && lib.config.extensions.includes('千幻聆音') && lib.config['extension_千幻聆音_enable']) {
                  skin = null;
                  // @ts-ignore
                  var value = game.qhly_getSkin(namex);
                  if (value) value = value.substring(0, value.lastIndexOf('.'));
                  else value = '经典形象';
                  if (lib.config.qhly_skinset.djtoggle &&
                    lib.config.qhly_skinset.djtoggle[namex] &&
                    lib.config.qhly_skinset.djtoggle[namex][value]) continue;
                  for (var j of Object.keys(skins)) {
                    if (j == value) skin = skins[value];
                  }
                } else skin = skins[Object.keys(skins)[0]];
                if (skin == null) continue;
                // @ts-ignore
                skin = game.qhly_formatDS(skin, namex);
                var editArgument1 = 'dynamic', editArgument2 = 'beijing';
                skin.zhu = character == avatars[i];
                // @ts-ignore
                var skinCopy = game.qhly_deepClone(skin);
                let hide = [];
                if (lib.character[avatars[i]] && lib.character[avatars[i]][4]) hide = lib.character[avatars[i]][4];
                let isHide;
                if (hide.length > 0 && hide[0] == "hiddenSkill" || get.mode() == 'guozhan') {
                  isHide = true;
                }
                if (skinCopy.speed == undefined) skinCopy.speed = 1;
                var forces = 'qun';
                if (lib.character[character]) forces = lib.character[character][1];
                var editArgument1 = 'dynamic', editArgument2 = 'beijing';
                // @ts-ignore
                if (game.qhly_getPlayerStatus(player, i == 1) == 2) {
                  editArgument1 = 'dynamic2';
                  editArgument2 = 'beijing2';
                }
                if (transform) {
                  // @ts-ignore
                  dcdAnim.playSpine({
                    name: "SF_pifu_eff_juexing",
                    scale: 1,
                    referNode: player,
                  })
                }
                if (skinCopy.transform) {
                  res2["transform" + (i == 0 ? "Zhu" : "Fu")] = skinCopy.transform;
                  if (player._inits === undefined) {
                    player._inits = [];
                  }
                  if (skinCopy.transform.skillName) {
                    // @ts-ignore
                    if (!lib.skill[skinCopy.transform.skillName]) EpicFX.setTransformSkill(skinCopy.transform.skill);
                    if (player.hp !== undefined) {
                      player.addSkill(skinCopy.transform.skillName);
                      // @ts-ignore
                      if (EpicFX.filterSkills.indexOf(skinCopy.transform.skillName) == -1) {
                        // @ts-ignore
                        EpicFX.filterSkills.push(skinCopy.transform.skillName);
                      }
                    }
                    else {
                      player._inits.push(function (p) {
                        p.addSkill(skinCopy.transform.skillName);
                        // @ts-ignore
                        if (EpicFX.filterSkills.indexOf(skinCopy.transform.skillName) == -1) {
                          // @ts-ignore
                          EpicFX.filterSkills.push(skinCopy.transform.skillName);
                        }
                      })
                    }
                  } else {
                    if (player.hp !== undefined) {
                      player.addSkill("changeSkin");
                    }
                    else {
                      player._inits.push(function (p) {
                        p.addSkill("changeSkin");
                      })
                    }
                  }
                }
                // @ts-ignore
                var editSkin = game.qhly_getSkin(game.qhly_getRealName(avatars[i]));
                // taffy: 注释content.js原版代码喵
                // var theme = ui.arena.dataset.newDecadeStyle == 'on' ? 'decade' : 'shousha';
                /* taffy分界线 */
                // taffy: 适配一将成名UI
                var theme = ui.arena.dataset.decadeLayout == 'on' ? 'decade' : 'shousha';
                /* taffy分界线 */
                // @ts-ignore
                if (lib.config['extension_千幻聆音_qhly_editDynamic'] && lib.qhly_skinEdit[game.qhly_getRealName(avatars[i])] && lib.qhly_skinEdit[game.qhly_getRealName(avatars[i])][editSkin] && lib.qhly_skinEdit[game.qhly_getRealName(avatars[i])][editSkin]['player'] && lib.qhly_skinEdit[game.qhly_getRealName(avatars[i])][editSkin]['player'][editArgument1] && lib.qhly_skinEdit[game.qhly_getRealName(avatars[i])][editSkin]['player'][editArgument1][theme]) {
                  // @ts-ignore
                  var resetDynamic = lib.qhly_skinEdit[game.qhly_getRealName(avatars[i])][editSkin].player[editArgument1][theme];
                  skinCopy.x = resetDynamic.x;
                  skinCopy.y = resetDynamic.y;
                  skinCopy.scale = resetDynamic.scale;
                  skinCopy.angle = resetDynamic.angle;
                  // @ts-ignore
                  if (skinCopy.dynamicBackground && lib.qhly_skinEdit[game.qhly_getRealName(avatars[i])][editSkin].player[editArgument2] && lib.qhly_skinEdit[game.qhly_getRealName(avatars[i])][editSkin].player[editArgument2][theme]) {
                    // @ts-ignore
                    var resetBackground = lib.qhly_skinEdit[game.qhly_getRealName(avatars[i])][editSkin].player[editArgument2][theme];
                    if (typeof skinCopy.dynamicBackground === 'string') {
                      skinCopy.dybg = {
                        name: skinCopy.dynamicBackground,
                        zhu: skinCopy.zhu,
                        dybg: true,
                        loop: true,
                        x: resetBackground.x,
                        y: resetBackground.y,
                        scale: resetBackground.scale,
                        angle: resetBackground.angle,
                      };
                    } else {
                      skinCopy.dybg = skinCopy.dynamicBackground;
                      skinCopy.dybg.dybg = true;
                      skinCopy.dybg.loop = true;
                      skinCopy.dybg.zhu = skinCopy.zhu;
                      skinCopy.dybg.x = resetBackground.x;
                      skinCopy.dybg.y = resetBackground.y;
                      skinCopy.dybg.scale = resetBackground.scale;
                      skinCopy.dybg.angle = resetBackground.angle;
                    }
                  }
                }
                else {
                  if (skinCopy.dynamicBackground) {
                    if (typeof skinCopy.dynamicBackground === 'string') {
                      skinCopy.dybg = {
                        name: skinCopy.dynamicBackground,
                        scale: skinCopy.scale,
                        zhu: skinCopy.zhu,
                        dybg: true,
                        loop: true
                      };
                    } else {
                      skinCopy.dybg = skinCopy.dynamicBackground;
                      skinCopy.dybg.dybg = true;
                      skinCopy.dybg.loop = true;
                      skinCopy.dybg.zhu = skinCopy.zhu;
                      skinCopy.dybg.scale = skinCopy.scale;
                    }
                  }
                }
                // taffy: 注释content.js原版代码喵
                // player.playDynamic(skinCopy, i == 1, cutdybg, lib.config['extension_千幻聆音_ignoreClips']);
                /* taffy分界线 */
                // taffy: 修复忽略clipSlots选项失效的问题喵
                player.playDynamic(skinCopy, i == 1, cutdybg, lib.config['extension_千幻聆音_qhly_ignoreClips']);
                /* taffy分界线 */
                if (i == 0 && skinCopy.decade) res2.zhu = "decade";
                else if (skinCopy.decade) res2.fu = "decade";
                res2.status = true;
                if (!isHide) {
                  // @ts-ignore
                  game.qhly_checkYH(player, forces);
                }
                // player.$dynamicWrap.style.backgroundImage = 'url("' + lib.assetURL + 'extension/十周年UI/assets/dynamic/' + skinCopy.background + '")';
                if (!skinCopy.dynamicBackground) player.$dynamicWrap.style.backgroundImage = `url(${lib.assetURL}extension/十周年UI/assets/dynamic/${skinCopy.background}`;
                if (!increased) {
                  increased = true;
                  // @ts-ignore
                  decadeUI.CUR_DYNAMIC++;
                }
              }
              return res2;
            }
            return res2;
          };
          // @ts-ignore
          EpicFX.playDynamicEffect = (player, action, s, flip) => {
            if (!player && !action) return;
            function play(data) {
              // @ts-ignore
              EpicFX.player.renderer.postMessage({
                message: "PLAY",
                id: player.dynamic.id,
                sprite: data,
                // @ts-ignore
                skin: EpicFX.player.getSkinState(player.dynamic.id, data.name)
              });
              // game.playAudio("..", "extension", "D/audio/effect", data.name + ".mp3");
              // @ts-ignore
              if (get.itemtype(player) == 'player') {
                // @ts-ignore
                if (EpicFX.attackings.length) {
                  // @ts-ignore
                  for (let i = 0; i < EpicFX.attackings.length; i++) {
                    // @ts-ignore
                    let temp = EpicFX.attackings[i];
                    if (temp.player == data.player) return game.playAudio(`../extension/EpicFX/asset/audio/effect/${temp.name}.mp3`);
                  }
                }
                game.playAudio(`../extension/EpicFX/asset/audio/effect/${data.name}.mp3`);
                // @ts-ignore
                EpicFX.attackings.push({
                  player: data.player,
                  zhu: data.zhu,
                  name: data.name
                })
              } else game.playAudio(`../extension/EpicFX/asset/audio/effect/${data.name}.mp3`);
              if (player.dynamic.renderer.postMessage) player.dynamic.renderer.postMessage({
                message: "HIDE",
                id: player.dynamic.id,
                name: data.name,
                zhu: data.zhu
              })
            }

            let { ...sprite } = s;
            if (!sprite) return;

            sprite.player = player.playerid;
            // sprite.player = game.players.indexOf(player);
            if (action == "GongJi") {
              if (sprite) {
                function getGongJiPos() {
                  // @ts-ignore
                  let width = EpicFX.player.canvas.clientWidth / 2;
                  let pos = getBackPos();
                  let isLeft = pos.x >= width ? false : true;
                  if (isLeft) {
                    return { x: [0, 0.4], y: [0, 0.5], isLeft: isLeft, backPos: pos };
                  } else return { x: [0, 0.63], y: [0, 0.5], isLeft: isLeft, backPos: pos };
                }

                function getBackPos(me) {
                  var rect = player.getBoundingClientRect();
                  if (me) {
                    return {
                      x: rect.left,
                      // @ts-ignore
                      y: decadeUI.get.bodySize().height - rect.top,
                      width: rect.width,
                      height: rect.height
                    }
                  } else {
                    return {
                      x: rect.left + (rect.width / 2),
                      // @ts-ignore
                      y: decadeUI.get.bodySize().height - rect.bottom + (rect.height / 2),
                      width: rect.width,
                      height: rect.height
                    }
                  }
                }

                let me = player == game.me;
                if (me) {
                  if (sprite.effects && sprite.effects.gongji) {
                    sprite.x = sprite.effects.gongji.x;
                    sprite.y = sprite.effects.gongji.y;
                    sprite.scale = sprite.effects.gongji.scale || sprite.scale;
                  } else if (sprite.pos) {
                    sprite.x = sprite.pos.x;
                    sprite.y = sprite.pos.y;
                  } else {
                    sprite.x = undefined;
                    sprite.y = undefined;
                  }
                  sprite.backPos = getBackPos(me);
                } else {
                  let pos = getGongJiPos();
                  sprite.x = pos.x;
                  sprite.y = pos.y;
                  if (sprite.mirror && pos.isLeft) {
                    // @ts-ignore
                    if (get.itemtype(player) == 'player') sprite.flipX = pos.isLeft;
                    else sprite.flipX = flip;
                  }
                  sprite.backPos = pos.backPos;
                }
                sprite.isMe = me;
                sprite.clip = undefined;
                sprite.angle = undefined;
                sprite.action = "GongJi";
                sprite.loop = false;
                play(sprite);
              }
            }
          }
          // @ts-ignore
          EpicFX.playDynamicEffect2 = function (player, action, res, flip) {
            if (res) {
              // console.log(res)
              // 武将待机时的name
              let has = false;
              let realName = res.name;
              if (typeof res.effects[action] === 'string') {
                var { ...sprite } = res;
                sprite.name = res.effects[action];
              } else if (res.effects[action].constructor === Object) {
                // 如果是一个对象，则视为配置了参数
                var { ...sprite } = res.effects[action];
                has = true;
              }
              if (!sprite) return;
              if (!sprite.decade) sprite.decade = true;
              sprite.player = player.playerid;
              function getGongJiPos() {
                // @ts-ignore
                let width = EpicFX.player.canvas.clientWidth / 2;
                let rect = player.getBoundingClientRect();
                let isLeft = (rect.left + (rect.width / 2)) >= width ? false : true;
                if (isLeft) {
                  return { x: [0, 0.4], y: [0, 0.5], isLeft: isLeft };
                } else return { x: [0, 0.63], y: [0, 0.5], isLeft: isLeft };
              }

              function getPlayerPos(me) {
                var rect = player.getBoundingClientRect();
                if (me) {
                  return {
                    x: rect.left,
                    // @ts-ignore
                    y: decadeUI.get.bodySize().height - rect.top,
                    width: rect.width,
                    height: rect.height
                  }
                } else {
                  return {
                    x: rect.left + (rect.width / 2),
                    // @ts-ignore
                    y: decadeUI.get.bodySize().height - rect.bottom + (rect.height / 2),
                    width: rect.width,
                    height: rect.height
                  };
                }
              }
              let me = player == game.me;
              if (action == "gongji" || action == "jineng") {
                if (me) {
                  if (!has) {
                    sprite.x = undefined;
                    sprite.y = undefined;
                  }
                } else {
                  let pos = getGongJiPos();
                  // @ts-ignore
                  if (get.itemtype(player) != 'player') sprite.scale = sprite.scale * player.offsetHeight * 0.0035;
                  sprite.x = pos.x;
                  sprite.y = pos.y;
                  if (sprite.mirror && pos.isLeft) {
                    // @ts-ignore
                    if (get.itemtype(player) == 'player') sprite.flipX = pos.isLeft;
                    else sprite.flipX = flip;
                  }
                }
                if (sprite.name.indexOf("/") == -1) {
                  sprite.name += "_chuchang2";
                }
                sprite.action = action;
              } else {
                let pos = getPlayerPos(me);
                sprite.x = pos.x + (pos.width / 2);
                sprite.y = pos.y;
                if (sprite.name.indexOf("/") == -1) {
                  sprite.name += "_chuchang";
                }
                sprite.action = "play";
                sprite.hhks = true;
              }

              sprite.realName = realName;
              sprite.isMe = me;
              sprite.clip = undefined;
              sprite.angle = undefined;
              sprite.loop = false;
              sprite.zhu = res.zhu;

              // @ts-ignore
              EpicFX.player.renderer.postMessage({
                message: "PLAY2",
                id: player.dynamic.id,
                sprite: sprite,
                // @ts-ignore
                skin: EpicFX.player.getSkinState(player.dynamic.id, player.dynamic.primary.name)
              });
              if (player.dynamic.renderer.postMessage) player.dynamic.renderer.postMessage({
                message: "HIDE",
                id: player.dynamic.id,
                name: realName,
                zhu: sprite.zhu
              })

              // @ts-ignore
              if (get.itemtype(player) == 'player') {
                // @ts-ignore
                if (EpicFX.attackings.length) {
                  // @ts-ignore
                  for (let i = 0; i < EpicFX.attackings.length; i++) {
                    // @ts-ignore
                    let temp = EpicFX.attackings[i];
                    if (temp.player == sprite.player && temp.action == action) return;
                  }
                }
              }

              // @ts-ignore
              EpicFX.attackings.push({
                player: sprite.player,
                zhu: sprite.zhu,
                name: sprite.name,
                action: action
              })
            }
          }
          // @ts-ignore
          EpicFX.initAnimationMessage = (animationPlayer) => {
            if (!animationPlayer) return;
            let { renderer } = animationPlayer;
            renderer.onmessage = (e) => {
              let data = e.data;
              if (data) {
                if (data.message == "ACTIONDONE") {
                  let player = game.filterPlayer(function (current) {
                    return current.playerid == data.player;
                  })[0];
                  if (!player) {
                    // @ts-ignore
                    player = document.getElementsByClassName('qh-isBigAvatar');
                    // @ts-ignore
                    if (player.length) player = player[0];
                  }
                  // @ts-ignore
                  if (player && player.dynamic) {
                    // @ts-ignore
                    let { renderer: r } = player.dynamic;
                    // @ts-ignore
                    if (EpicFX.attackings.length) {
                      // @ts-ignore
                      for (let i = 0; i < EpicFX.attackings.length; i++) {
                        // @ts-ignore
                        let temp = EpicFX.attackings[i];
                        if (temp.player == data.player && temp.zhu == data.zhu) {
                          // @ts-ignore
                          EpicFX.attackings.splice(i, 1);
                        }
                      }
                    };
                    if (r.postMessage) r.postMessage({
                      message: "RECOVER",
                      // @ts-ignore
                      id: player.dynamic.id,
                      zhu: data.zhu,
                      name: data.name
                    });
                  }
                  return;
                } else if (data.message == 'LINEDATA') {
                  // @ts-ignore
                  EpicFX.lineBuffer.push(data.obj);
                  console.log(`%c${data.obj.name}\n%c loaded successfully!`, 'color: green; background: yellow; font-size: 30px', 'color: blue; font-size: 15px;',);
                } else {
                  console.log(data)
                }
              }
            }
          }
          // @ts-ignore
          EpicFX.initAnimationMessage(EpicFX.player);
          // @ts-ignore
          EpicFX.playAction = (player, action) => {
            // @ts-ignore
            let res = EpicFX.canAction(false, player.dynamic.primary, player.dynamic.deputy, action);
            if (!res.ok) return;
            let id = player.playerid;
            // let index = game.players.indexOf(player);
            // @ts-ignore
            if (EpicFX.attackings.length) {
              // @ts-ignore
              for (let i = 0; i < EpicFX.attackings.length; i++) {
                // @ts-ignore
                let temp = EpicFX.attackings[i];
                if (temp.player == id && (temp.zhu == res.zhu || temp.zhu == !res.fu)) {
                  return;
                }
              }
            }
            if (player.dynamic.renderer.postMessage) player.dynamic.renderer.postMessage({
              message: "ACTION",
              id: player.dynamic.id,
              zhu: res.zhu,
              fu: res.fu,
              action: action
            })
          };
          // @ts-ignore
          EpicFX.playAction2 = function (player, action) {
            // @ts-ignore
            let res = EpicFX.canAction3(player, action);
            if (!res.ok && !(res.action1 || res.action2)) return;
            for (let i = 1; i < 3; i++) {
              if (res["action" + i]) {
                play(res["action" + i]);
              }
            }

            function play(data) {
              if (player.dynamic.renderer.postMessage) player.dynamic.renderer.postMessage({
                message: "ACTION",
                id: player.dynamic.id,
                zhu: data.zhu,
                fu: data.fu,
                action: action
              })
            }
          }
          //EpicFX的函数修改到此为止
        } else {
          // @ts-ignore
          if (game.qhly_hasExtension('EngEX')) window.dynamicExt = window.eng;
          // @ts-ignore
          else window.dynamicExt = null;
          // @ts-ignore
          duilib.DynamicPlayer = qhly_DynamicPlayer;
        }
      }
      // @ts-ignore
      if (window.decadeUI && !lib.config['extension_千幻聆音_qhly_decadeCloseDynamic'] && (lib.config.qhly_currentViewSkin == 'decade' || lib.config.qhly_currentViewSkin == 'shousha')) {
        if (Object.defineProperties) {
          Object.defineProperties(lib.element.player, {
            $init:{
              get: function(){
                // @ts-ignore
                return lib.element.player.qh_old_$init;
              },
              enumerable: true,
              configurable: true,
            },
            init: {
              get: function () {
                return this.qhly_init || qhly_init;
              },
              set: function (d) {
                var newInit = d.toString();
                if (newInit.indexOf('playDynamic') == -1) this.qhly_init = d;
                else if (!lib.config.qhly_mentionDynamic) {
                  if (confirm("千幻聆音：检测到有扩展修改武将登场动皮播放，这将与千幻聆音“十周年”或“手杀”样式冲突，点击【确定】为您切换为其他样式。若点击【取消】，将不再对此消息进行提示。")) {
                    lib.config.qhly_currentViewSkin = 'xuanwujianghu';
                    game.saveConfig('qhly_currentViewSkin', lib.config.qhly_currentViewSkin);
                    game.saveConfig('extension_千幻聆音_qhly_currentViewSkin', lib.config.qhly_currentViewSkin);
                    game.reload();
                  } else {
                    game.saveConfig('qhly_mentionDynamic', true);
                  }
                }
              },
              enumerable: true,
              configurable: true,
            },
            uninit: {
              get: function () {
                return qhly_uninit;
              },
              set: function () {
              },
              enumerable: true,
              configurable: true,
            },
            reinit: {
              get: function () {
                return qhly_reinit;
              },
              set: function () {
              },
              enumerable: true,
              configurable: true,
            },
            stopDynamic: {
              get: function () {
                return qhly_stopdynamic;
              },
              set: function () {
              },
              enumerable: true,
              configurable: true,
            },
            playDynamic: {
              get: function () {
                return qhly_playdynamic;
              },
              set: function () {
              },
              enumerable: true,
              configurable: true,
            },
            showCharacter: {
              get: function () {
                return qhly_showcharacter;
              },
              set: function () {
              },
              enumerable: true,
              configurable: true,
            },
          });
        } else {
          // @ts-ignore
          lib.element.player.$init = lib.element.player.qh_old_$init;
          // @ts-ignore
          lib.element.player.init = qhly_init;
          // @ts-ignore
          lib.element.player.uninit = qhly_uninit;
          // @ts-ignore
          lib.element.player.reinit = qhly_reinit;
          // @ts-ignore
          lib.element.player.playDynamic = qhly_playdynamic;
          // @ts-ignore
          lib.element.player.stopDynamic = qhly_stopdynamic;
          lib.element.player.showCharacter = qhly_showcharacter;
        }
        for (var i = 0; i < game.players.length; i++) {
          if (Object.defineProperties) {
            Object.defineProperties(game.players[i], {
              init: {
                get: function () {
                  return this.qhly_init || qhly_init;
                },
                set: function (d) {
                  var newInit = d.toString();
                  if (newInit.indexOf('playDynamic') == -1) this.qhly_init = d;
                  else if (!lib.config.qhly_mentionDynamic) {
                    if (confirm("千幻聆音：检测到有扩展修改武将登场动皮播放，这将与千幻聆音“十周年”或“手杀”样式冲突，点击【确定】为您切换为其他样式。若点击【取消】，将不再对此消息进行提示。")) {
                      lib.config.qhly_currentViewSkin = 'xuanwujianghu';
                      game.saveConfig('qhly_currentViewSkin', lib.config.qhly_currentViewSkin);
                      game.saveConfig('extension_千幻聆音_qhly_currentViewSkin', lib.config.qhly_currentViewSkin);
                      game.reload();
                    } else {
                      game.saveConfig('qhly_mentionDynamic', true);
                    }
                  }
                },
                enumerable: true,
                configurable: true,
              },
              uninit: {
                get: function () {
                  return qhly_uninit;
                },
                set: function () {
                },
                enumerable: true,
                configurable: true,
              },
              reinit: {
                get: function () {
                  return qhly_reinit;
                },
                set: function () {
                },
                enumerable: true,
                configurable: true,
              },
              stopDynamic: {
                get: function () {
                  return qhly_stopdynamic;
                },
                set: function () {
                },
                enumerable: true,
                configurable: true,
              },
              playDynamic: {
                get: function () {
                  return qhly_playdynamic;
                },
                set: function () {
                },
                enumerable: true,
                configurable: true,
              },
              showCharacter: {
                get: function () {
                  return qhly_showcharacter;
                },
                set: function () {
                },
                enumerable: true,
                configurable: true,
              },
            });
          } else {
            // @ts-ignore
            game.players[i].init = qhly_init;
            // @ts-ignore
            game.players[i].uninit = qhly_uninit;
            // @ts-ignore
            game.players[i].reinit = qhly_reinit;
            // @ts-ignore
            game.players[i].playDynamic = qhly_playdynamic;
            // @ts-ignore
            game.players[i].stopDynamic = qhly_stopdynamic;
            // @ts-ignore
            game.players[i].showCharacter = qhly_showcharacter;
          }
        }
      }
    });
    /*
    var qhly_oldinit = function (character, character2, skill) {
      if (typeof character == 'string' && !lib.character[character]) {
        lib.character[character] = get.character(character);
      }
      if (typeof character2 == 'string' && !lib.character[character2]) {
        lib.character[character2] = get.character(character2);
      }
      if (!lib.character[character]) return;
      if (get.is.jun(character2)) {
        var tmp = character;
        character = character2;
        character2 = tmp;
      }
      if (character2 == false) {
        skill = false;
        character2 = null;
      }
      var info = lib.character[character];
      if (!info) {
        info = ['', '', 1, [], []];
      }
      if (!info[4]) {
        info[4] = [];
      }
      var skills = info[3].slice(0);
      this.clearSkills(true);
      this.classList.add('fullskin');
      if (!game.minskin && get.is.newLayout() && !info[4].includes('minskin')) {
        this.classList.remove('minskin');
        this.node.avatar.setBackground(character, 'character');
      }
      else {
        this.node.avatar.setBackground(character, 'character');
        if (info[4].includes('minskin')) {
          this.classList.add('minskin');
        }
        else if (game.minskin) {
          this.classList.add('minskin');
        }
        else {
          this.classList.remove('minskin');
        }
      }

      var hp1 = get.infoHp(info[2]);
      var maxHp1 = get.infoMaxHp(info[2]);
      var hujia1 = get.infoHujia(info[2]);

      this.node.avatar.show();
      this.node.count.show();
      this.node.equips.show();
      this.name = character;
      this.name1 = character;
      this.tempname=[];
      this.sex = info[0];
      this.group = info[1];
      this.hp = hp1;
      this.maxHp = maxHp1;
      this.hujia = hujia1;
      this.node.intro.innerHTML = lib.config.intro;
      this.node.name.dataset.nature = get.groupnature(this.group);
      lib.setIntro(this);
      this.node.name.innerHTML = lib.qhly_slimName(character);
      if (this.classList.contains('minskin') && this.node.name.querySelectorAll('br').length >= 4) {
        this.node.name.classList.add('long');
      }
      if (info[4].includes('hiddenSkill') && !this.noclick) {
        if (!this.hiddenSkills) this.hiddenSkills = [];
        this.hiddenSkills.addArray(skills);
        skills = [];
        this.classList.add(_status.video ? 'unseen_v' : 'unseen');
        this.name = 'unknown';
        if (!this.node.name_seat && !_status.video) {
          this.node.name_seat = ui.create.div('.name.name_seat', get.qhly_verticalStr(get.translation(this.name)), this);
          this.node.name_seat.dataset.nature = get.groupnature(this.group);
        }
        this.sex = 'male';
        //this.group='unknown';
        this.storage.nohp = true;
        skills.add('g_hidden_ai');
      }
      if (character2 && lib.character[character2]) {
        var info2 = lib.character[character2];
        if (!info2) {
          info2 = ['', '', 1, [], []];
        }
        if (!info2[4]) {
          info2[4] = [];
        }
        this.classList.add('fullskin2');
        this.node.avatar2.setBackground(character2, 'character');

        this.node.avatar2.show();
        this.name2 = character2;
        var hp2 = get.infoHp(info2[2]);
        var maxHp2 = get.infoMaxHp(info2[2]);
        var hujia2 = get.infoHujia(info2[2]);
        this.hujia += hujia2;
        var double_hp;
        if (_status.connectMode || get.mode() == 'single') {
          double_hp = 'pingjun';
        }
        else {
          double_hp = get.config('double_hp');
        }
        switch (double_hp) {
          case 'pingjun': {
            this.maxHp = Math.floor((maxHp1 + maxHp2) / 2);
            this.hp = Math.floor((hp1 + hp2) / 2);
            this.singleHp = ((maxHp1 + maxHp2) % 2 === 1);
            break;
          }
          case 'zuidazhi': {
            this.maxHp = Math.max(maxHp1, maxHp2);
            this.hp = Math.max(hp1, hp2);
            break;
          }
          case 'zuixiaozhi': {
            this.maxHp = Math.min(maxHp1, maxHp2);
            this.hp = Math.min(hp1, hp2);
            break;
          }
          case 'zonghe': {
            this.maxHp = maxHp1 + maxHp2;
            this.hp = hp1 + hp2;
            break;
          }
          default: {
            this.maxHp = maxHp1 + maxHp2 - 3;
            this.hp = hp1 + hp2 - 3;
          };
        }
        this.node.count.classList.add('p2');
        if (info2[4].includes('hiddenSkill') && !this.noclick) {
          if (!this.hiddenSkills) this.hiddenSkills = [];
          this.hiddenSkills.addArray(info2[3]);
          this.classList.add(_status.video ? 'unseen2_v' : 'unseen2');
          this.storage.nohp = true;
          skills.add('g_hidden_ai');
        }
        else skills = skills.concat(info2[3]);

        this.node.name2.innerHTML = lib.qhly_slimName(character2);
      }
      if (this.storage.nohp) {
        this.storage.rawHp = this.hp;
        this.storage.rawMaxHp = this.maxHp;
        this.hp = 1;
        this.maxHp = 1;
        this.node.hp.hide();
      }
      if (skill != false) {
        for (var i = 0; i < skills.length; i++) {
          var info = get.info(skills[i]);
          if(info && info.zhuSkill && ((typeof this.isZhu2!='function') || !this.isZhu2())){
            continue;
          }
          this.addSkill(skills[i]);
        }
        this.checkConflict();
      }
      lib.group.add(this.group);
      if (this.inits) {
        for (var i = 0; i < lib.element.player.inits.length; i++) {
          lib.element.player.inits[i](this);
        }
      }
      if (this._inits) {
        for (var i = 0; i < this._inits.length; i++) {
          this._inits[i](this);
        }
      }
      this.update();
      return this;
    };*/
    // @ts-ignore
    var qhly_oldinit = lib.element.player.qh_old_init;
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    var qhly_old$init = lib.element.player.qh_old_$init;
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    function qhly_init(character, character2, skill) {
      // @ts-ignore
      var isYh = this.getElementsByClassName("skinYh");
      if (isYh.length > 0) {
        isYh[0].remove();
      }
      // @ts-ignore
      var bj = this.getElementsByClassName("gain-skill flex");
      if (bj.length > 0) {
        bj[0].innerHTML = null;
      }
      this.doubleAvatar = (character2 && lib.character[character2]) != undefined;

      // @ts-ignore
      var CUR_DYNAMIC = decadeUI.CUR_DYNAMIC;
      // @ts-ignore
      var MAX_DYNAMIC = decadeUI.MAX_DYNAMIC;
      if (CUR_DYNAMIC == undefined) {
        CUR_DYNAMIC = 0;
        // @ts-ignore
        decadeUI.CUR_DYNAMIC = CUR_DYNAMIC;
      }
      if (MAX_DYNAMIC == undefined) {
        // @ts-ignore
        MAX_DYNAMIC = decadeUI.isMobile() ? 2 : 10;
        if (window.OffscreenCanvas)
          MAX_DYNAMIC += 8;
        // @ts-ignore
        decadeUI.MAX_DYNAMIC = MAX_DYNAMIC;
      }
      var avatars = this.doubleAvatar ? [character, character2] : [character];
      for (var i = 0; i < avatars.length; i++) {
        if (get.mode() == 'guozhan' && lib.config['extension_千幻聆音_qhly_guozhanDS']) {
          if (avatars[i] && avatars[i].indexOf('gz_') == 0) {
            // @ts-ignore
            let extend = { [avatars[i]]: decadeUI.dynamicSkin[avatars[i].slice(3)] };
            // @ts-ignore
            decadeUI.get.extend(decadeUI.dynamicSkin, extend);
          }
        }
        // @ts-ignore
        if (lib.qhly_skinShare[avatars[i]] && lib.qhly_skinShare[avatars[i]].name) {
          // @ts-ignore
          let extend = { [avatars[i]]: decadeUI.dynamicSkin[lib.qhly_skinShare[avatars[i]].name] };
          // @ts-ignore
          decadeUI.get.extend(decadeUI.dynamicSkin, extend);
        }
      }
      // @ts-ignore
      if (window.qhly_newDynamicExt && lib.config['extension_EpicFX_skinEffects']) {
        // taffy: 注释content.js原版代码喵
        // // @ts-ignore
        // let res = EpicFX.playDynamic(this, character, character2, undefined, undefined, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.newDecadeStyle == 'on');
        /* taffy分界线 */
        // taffy: 适配一将成名UI
        // @ts-ignore
        let res = EpicFX.playDynamic(this, character, character2, undefined, undefined, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on');
        /* taffy分界线 */
        // @ts-ignore
        EpicFX.initSkinPackOrRefreshAll(this, {
          doubleAvatar: this.doubleAvatar,
          name: character,
          name1: character,
          name2: character2,
          clear: "init",
          state: res
        });
        if (!this.initialChar) {
          this.initialChar = [
            character
          ];
          if (this.doubleAvatar) this.initialChar.push(character2);
        }
        var forces = 'qun';
        if (lib.character[character]) forces = lib.character[character][1];
        // @ts-ignore
        game.qhly_checkYH(this, forces);
      } else {
        // @ts-ignore
        if (this.dynamic) {
          // @ts-ignore
          if (this.dynamic.primary) this.stopDynamic(true, false)
          // @ts-ignore
          if (this.dynamic.deputy) this.stopDynamic(false, true)
          // this.stopDynamic();
        }
        // @ts-ignore
        var showDynamic = (this.dynamic || CUR_DYNAMIC < MAX_DYNAMIC) && duicfg.dynamicSkin;
        // @ts-ignore
        if (showDynamic && _status.mode != null) {
          var skins;
          // @ts-ignore
          var dskins = decadeUI.dynamicSkin;
          var increased;
          for (var i = 0; i < avatars.length; i++) {
            let hide = [];
            if (lib.character[avatars[i]] && lib.character[avatars[i]][4]) hide = lib.character[avatars[i]][4];
            let isHide;
            if (hide.length > 0 && hide[0] == "hiddenSkill" || get.mode() == 'guozhan') {
              isHide = true;
            }
            if (isHide) continue;
            skins = dskins[avatars[i]];
            if (skins == undefined) continue;
            var keys = Object.keys(skins);
            if (keys.length == 0) {
              console.error('player.init: ' + avatars[i] + ' 没有设置动皮参数');
              continue;
            }
            var skin, skinName;
            // @ts-ignore
            var realName = game.qhly_getRealName(avatars[i]);
            if (lib && lib.config && lib.config.qhly_skinset && lib.config.qhly_skinset.djtoggle && lib.config.extensions && lib.config.extensions.includes('千幻聆音') && lib.config['extension_千幻聆音_enable']) {
              skin = null;
              var namex = avatars[i];
              // @ts-ignore
              var value = game.qhly_getSkin(namex);
              // @ts-ignore
              skinName = game.qhly_getSkin(namex);
              if (skinName == null) skinName = '经典形象.jpg';
              if (value) value = value.substring(0, value.lastIndexOf('.'));
              else {
                value = '经典形象';
                realName = avatars[i];
              }
              if (lib.config.qhly_skinset.djtoggle &&
                lib.config.qhly_skinset.djtoggle[namex] &&
                lib.config.qhly_skinset.djtoggle[namex][value]) continue;
              for (var j of Object.keys(skins)) {
                if (j == value) skin = skins[value];
              }
            } else skin = skins[Object.keys(skins)[0]];
            if (skin == null) continue;
            // @ts-ignore
            skin = game.qhly_formatDS(skin, avatars[i]);
            // @ts-ignore
            var skinCopy = game.qhly_deepClone(skin);
            if (skinCopy.action && skinCopy.pos) skinCopy.action = "ChuChang";
            if (skinCopy.speed == undefined) skinCopy.speed = 1;
            if (!skinCopy.skinName) skinCopy.skinName = keys[i];
            skinCopy.player = skinCopy;
            // @ts-ignore
            if (!this.doubleAvatar && dynamicExt) {
              // @ts-ignore
              if (this == game.me) {
                // @ts-ignore
                if (dynamicExt.selectSkinData && dynamicExt.selectSkinData.value) dynamicExt.selectSkinData.value = keys[i];
              }
            }
            // taffy: 注释content.js原版代码喵
            // var theme = ui.arena.dataset.newDecadeStyle == 'on' ? 'decade' : 'shousha';
            /* taffy分界线 */
            // taffy: 适配一将成名UI
            var theme = ui.arena.dataset.decadeLayout == 'on' ? 'decade' : 'shousha';
            /* taffy分界线 */
            // @ts-ignore
            if (lib.config['extension_千幻聆音_qhly_editDynamic'] && lib.qhly_skinEdit[realName] && lib.qhly_skinEdit[realName][skinName] && lib.qhly_skinEdit[realName][skinName].player && lib.qhly_skinEdit[realName][skinName].player.dynamic && lib.qhly_skinEdit[realName][skinName].player.dynamic[theme]) {
              // @ts-ignore
              var resetDynamic = lib.qhly_skinEdit[realName][skinName].player.dynamic[theme];
              skinCopy.x = resetDynamic.x;
              skinCopy.y = resetDynamic.y;
              skinCopy.scale = resetDynamic.scale;
              skinCopy.angle = resetDynamic.angle;
              // @ts-ignore
              if (skinCopy.beijing && lib.qhly_skinEdit[realName][skinName].player.beijing && lib.qhly_skinEdit[realName][skinName].player.beijing[theme]) {
                // @ts-ignore
                var resetBeijing = lib.qhly_skinEdit[realName][skinName].player.beijing[theme];
                skinCopy.beijing.x = resetBeijing.x;
                skinCopy.beijing.y = resetBeijing.y;
                skinCopy.beijing.scale = resetBeijing.scale;
                skinCopy.beijing.angle = resetBeijing.angle;
              }
            }
            // taffy: 注释content.js原版代码喵
            // // @ts-ignore
            // this.playDynamic(skinCopy, i == 1, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on', lib.config['extension_千幻聆音_ignoreClips']);
            /* taffy分界线 */
            // taffy: 修复忽略clipSlots选项失效的问题喵
            // @ts-ignore
            this.playDynamic(skinCopy, i == 1, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on', lib.config['extension_千幻聆音_qhly_ignoreClips']);
            /* taffy分界线 */
            // 修改3 start  此处修改是因为动皮和背景加载需要时间, 在动皮加载好之前用一个默认背景代替, 防止武将框黑一片
            // @ts-ignore
            if (i == 0 || !this.dynamic.primary) {
              if (skinCopy.background) {
                // @ts-ignore
                this.$dynamicWrap.style.backgroundImage = 'url("' + lib.assetURL + 'extension/十周年UI/assets/dynamic/' + skinCopy.background + '")';
              } else {
                // @ts-ignore
                this.$dynamicWrap.style.backgroundImage = 'url("' + lib.assetURL + 'extension/皮肤切换/images/card/card.png")'
              }
            }
            // 修改3 end
            if (!increased) {
              increased = true;
              // @ts-ignore
              decadeUI.CUR_DYNAMIC++;
            }

            var forces = 'qun';
            if (lib.character[character]) forces = lib.character[character][1];
            if (!isHide) {
              // @ts-ignore
              game.qhly_checkYH(this, forces);
            }

          }
          // @ts-ignore
          if (game.qhly_hasExtension('皮肤切换') && window.skinSwitch && lib.config[window.skinSwitch.configKey.useDynamic]) {
            // 开启自动播放play2模式
            skinSwitch.dynamic.startPlay2Random(this)
          }
        }
      }
      var timer = null;
      this.invisibleSkills = [];
      // @ts-ignore
      this.node.avatar.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function (e) {
        e.preventDefault();
        if (e.button && e.button != 0) return;
        clearTimeout(timer);
        this._qhlyClickTime = Date.now();
      });
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      this.node.avatar.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", function (e) {
        if (!this._qhlyClickTime || Date.now() - this._qhlyClickTime > 400 || this.parentNode.classList.contains('selectable') || this.parentNode.classList.contains('target') || this.parentNode.isUnseen(0)) return;
        timer = setTimeout(function () {
          // @ts-ignore
          if (lib.config['extension_千幻聆音_qhly_playerwindow']) game.qhly_playerWindow(this);
        }.bind(this), 220);
      });
      // @ts-ignore
      this.node.avatar2.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function (e) {
        e.preventDefault();
        // @ts-ignore
        if (!this.parentNode.doubleAvatar || e.button && e.button != 0) return;
        clearTimeout(timer);
        this._qhlyClickTime = Date.now();
      });
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      this.node.avatar2.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", function (e) {
        if (!this.parentNode.doubleAvatar || !this._qhlyClickTime || Date.now() - this._qhlyClickTime > 400 || this.parentNode.classList.contains('selectable') || this.parentNode.classList.contains('target') || this.parentNode.isUnseen(1)) return;
        timer = setTimeout(function () {
          // @ts-ignore
          if (lib.config['extension_千幻聆音_qhly_playerwindow']) game.qhly_playerWindow(this);
        }.bind(this), 220);
      });
      var jie;
      // @ts-ignore
      if (character && duicfg.showJieMark) {
        // @ts-ignore
        if (lib.characterPack.refresh)
          // @ts-ignore
          jie = lib.characterPack.refresh[character];
        if (jie == null) {
          jie = character.substr(0, 3);
          jie == 're_' || jie == 'ol_' || jie == 'xin' || jie == 'old';
        }

        if (jie != null) {
          jie = lib.translate[character][0];
          if (jie == '界') {
            if (this.$jieMark == undefined)
              // @ts-ignore
              this.$jieMark = dui.element.create('jie-mark', this);
            else
              // @ts-ignore
              this.appendChild(this.$jieMark);
          }
        }
      }
      var result = qhly_oldinit.apply(this, arguments);
      if (jie == '界') {
        var text = result.node.name.innerText;
        if (text[1] == '\n')
          text = text.substr(2);
        else
          text = text.substr(1);

        result.node.name.innerText = text;
      }

      return result;
    }
    function qhly_uninit() {
      // @ts-ignore
      if (this.$jieMark) {
        // @ts-ignore
        this.$jieMark.remove();
        // @ts-ignore
        this.$jieMark.undefined;
      }
      // @ts-ignore
      this.stopDynamic();
      this.doubleAvatar = false;
      // @ts-ignore
      this.node.campWrap.dataset.camp = null;
      // @ts-ignore
      this.node.campWrap.node.campName.innerHTML = '';
      // @ts-ignore
      this.node.campWrap.node.campName.style.backgroundImage = '';
      // @ts-ignore
      this.node.name2.innerHTML = '';
      // @ts-ignore
      this.qh_old_uninit.call(this,...arguments);
      var forces = 'qun';
      // @ts-ignore
      if (lib.character[this]) forces = lib.character[this][1];
      // @ts-ignore
      game.qhly_checkYH(this, forces);
    }
    /*
    function qhly_uninit() {
      // @ts-ignore
      if (this.$jieMark) {
        // @ts-ignore
        this.$jieMark.remove();
        // @ts-ignore
        this.$jieMark.undefined;
      }
      // @ts-ignore
      this.stopDynamic();
      this.doubleAvatar = false;
      // @ts-ignore
      this.node.campWrap.dataset.camp = null;
      // @ts-ignore
      this.node.campWrap.node.campName.innerHTML = '';
      // @ts-ignore
      this.node.campWrap.node.campName.style.backgroundImage = '';
      // @ts-ignore
      this.node.name2.innerHTML = '';

      // @ts-ignore
      for (var i = 1; i < 6; i++) if (this.isDisabled(i)) this.$enableEquip('equip' + i);

      // @ts-ignore
      if (this.storage._disableJudge) {
        // @ts-ignore
        game.broadcastAll(function (player) {
          player.storage._disableJudge = false;
          for (var i = 0; i < player.node.judges.childNodes.length; i++) {
            if (player.node.judges.childNodes[i].name == 'disable_judge') {
              player.node.judges.removeChild(player.node.judges.childNodes[i]);
              break;
            }
          }
        }, this);
      }
      // @ts-ignore
      this.node.avatar.hide();
      // @ts-ignore
      this.node.count.hide();
      // @ts-ignore
      if (this.node.wuxing) {
        // @ts-ignore
        this.node.wuxing.hide();
      }
      // @ts-ignore
      if (this.node.name_seat) {
        // @ts-ignore
        this.node.name_seat.remove();
        // @ts-ignore
        this.node.name_seat = undefined;
      }

      // @ts-ignore
      if (this.storage.nohp) this.node.hp.show();
      // @ts-ignore
      this.classList.remove('unseen');
      // @ts-ignore
      this.classList.remove('unseen2');
      this.name = undefined;
      this.name1 = undefined;
      this.sex = undefined;
      this.group = undefined;
      this.hp = undefined;
      this.maxHp = undefined;
      this.hujia = undefined;
      this.tempname = undefined;

      // @ts-ignore
      this.clearSkills(true);
      // @ts-ignore
      this.node.identity.style.backgroundColor = '';
      // @ts-ignore
      this.node.intro.innerHTML = '';
      // @ts-ignore
      this.node.name.innerHTML = '';
      // @ts-ignore
      this.node.hp.innerHTML = '';
      // @ts-ignore
      this.node.count.innerHTML = '0';
      if (this.name2) {
        this.singleHp = undefined;
        // @ts-ignore
        this.node.avatar2.hide();
        // @ts-ignore
        this.node.name2.innerHTML = '';
        // @ts-ignore
        this.classList.remove('fullskin2');
        this.name2 = undefined;
      }

      // @ts-ignore
      for (var mark in this.marks) this.marks[mark].remove();
      ui.updatem(this);

      this.skipList = [];
      // @ts-ignore
      this.skills = this.skills.includes('cangji_yozuru') ? ['cangji_yozuru'] : [];
      this.initedSkills = [];
      this.additionalSkills = {};
      this.disabledSkills = {};
      this.hiddenSkills = [];
      this.awakenedSkills = [];
      this.forbiddenSkills = {};
      this.phaseNumber = 0;
      this.stat = [{
        card: {},
        skill: {}
      }];
      this.tempSkills = {};
      this.storage = {};
      this.marks = {};
      this.ai = {
        friend: [],
        enemy: [],
        neutral: []
      };
      var forces = 'qun';
      // @ts-ignore
      if (lib.character[this]) forces = lib.character[this][1];
      // @ts-ignore
      game.qhly_checkYH(this, forces);
      return this;
    }*/
    function qhly_reinit(from, to, maxHp, online) {
      var info1 = lib.character[from];
      var info2 = lib.character[to];
      var smooth = true;
      if (maxHp == 'nosmooth') {
        smooth = false;
        maxHp = null;
      }
      let data;
      if (get.mode() == 'guozhan' && lib.config['extension_千幻聆音_qhly_guozhanDS']) {
        if (to.indexOf('gz_') == 0) {
          // @ts-ignore
          let extend = { [to]: decadeUI.dynamicSkin[to.slice(3)] };
          // @ts-ignore
          decadeUI.get.extend(decadeUI.dynamicSkin, extend);
        }
      }
      // @ts-ignore
      if (lib.qhly_skinShare[to] && lib.qhly_skinShare[to].name) {
        // @ts-ignore
        let extend = { [to]: decadeUI.dynamicSkin[lib.qhly_skinShare[to].name] };
        // @ts-ignore
        decadeUI.get.extend(decadeUI.dynamicSkin, extend);
      }
      // @ts-ignore
      if (window.qhly_newDynamicExt) {
        data = {
          // @ts-ignore
          doubleAvatar: this.doubleAvatar,
          name: this.name,
          name1: this.name1,
          name2: this.name2,
          clear: "reinit"
        }
      }
      if (this.name2 == from) {
        this.name2 = to;
        // @ts-ignore
        if (this.isUnseen(0) && !this.isUnseen(1)) {
          this.sex = info2[0];
          this.name = to;
        }
        // @ts-ignore
        if (smooth) this.smoothAvatar(true);
        // @ts-ignore
        this.node.avatar2.setBackground(to, 'character');
        // @ts-ignore
        this.node.name2.innerHTML = lib.qhly_slimName(to);
        // @ts-ignore
        if (window.qhly_newDynamicExt) {
          // @ts-ignore
          data.zhu = false;
          // @ts-ignore
          data.to = to;
          // @ts-ignore
          this.stopDynamic(false, true);
          // taffy: 注释content.js原版代码喵
          // // @ts-ignore
          // data.state = EpicFX.playDynamic(this, undefined, to, true, undefined, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.newDecadeStyle == 'on');
          /* taffy分界线 */
          // taffy: 适配一将成名UI
          // @ts-ignore
          data.state = EpicFX.playDynamic(this, undefined, to, true, undefined, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on');
          /* taffy分界线 */
        }
      } else if (this.name == from || this.name1 == from) {
        if (this.name1 == from) {
          this.name1 = to;
        }
        // @ts-ignore
        if (!this.classList.contains('unseen2')) {
          this.name = to;
          this.sex = info2[0];
        }
        // @ts-ignore
        if (smooth) this.smoothAvatar(false);
        // @ts-ignore
        this.node.avatar.setBackground(to, 'character');
        // @ts-ignore
        this.node.name.innerHTML = lib.qhly_slimName(to);

        // @ts-ignore
        if (this == game.me && ui.fakeme) {
          // @ts-ignore
          ui.fakeme.style.backgroundImage = this.node.avatar.style.backgroundImage;
        }
        // @ts-ignore
        if (window.qhly_newDynamicExt) {
          // @ts-ignore
          data.zhu = true;
          // @ts-ignore
          data.to = to;
          // @ts-ignore
          this.stopDynamic(true, false);
          // taffy: 注释content.js原版代码喵
          // // @ts-ignore
          // data.state = EpicFX.playDynamic(this, to, undefined, true, undefined, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.newDecadeStyle == 'on');
          /* taffy分界线 */
          // taffy: 适配一将成名UI
          // @ts-ignore
          data.state = EpicFX.playDynamic(this, to, undefined, true, undefined, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on');
          /* taffy分界线 */
        }
      } else {
        return this;
      }
      // @ts-ignore
      if (window.qhly_newDynamicExt && lib.config['extension_EpicFX_skinEffects']) EpicFX.initSkinPackOrRefreshAll(this, data);
      if (online) {
        return;
      }
      for (var i = 0; i < info1[3].length; i++) {
        // @ts-ignore
        this.removeSkill(info1[3][i]);
      }
      for (var i = 0; i < info2[3].length; i++) {
        // @ts-ignore
        this.addSkill(info2[3][i]);
      }
      if (Array.isArray(maxHp)) {
        this.maxHp = maxHp[1];
        this.hp = maxHp[0];
      } else {
        var num;
        if (maxHp === false) {
          num = 0;
        } else {
          if (typeof maxHp != 'number') {
            maxHp = get.infoMaxHp(info2[2]);
          }
          num = maxHp - get.infoMaxHp(info1[2]);
        }
        if (typeof this.singleHp == 'boolean') {
          if (num % 2 != 0) {
            if (this.singleHp) {
              // @ts-ignore
              this.maxHp += (num + 1) / 2;
              this.singleHp = false;
            } else {
              // @ts-ignore
              this.maxHp += (num - 1) / 2;
              this.singleHp = true;
              if (!game.online) {
                // @ts-ignore
                this.doubleDraw();
              }
            }
          } else {
            // @ts-ignore
            this.maxHp += num / 2;
          }
        } else {
          // @ts-ignore
          this.maxHp += num;
        }
      }
      // @ts-ignore
      game.broadcast(function (player, from, to, skills) {
        player.reinit(from, to, null, true);
        player.applySkills(skills);
      }, this, from, to, get.skillState(this));
      // @ts-ignore
      game.addVideo('reinit3', this, {
        from: from,
        to: to,
        hp: this.maxHp,
        avatar2: this.name2 == to
      });
      // @ts-ignore
      this.update();
      // @ts-ignore
      if (!window.qhly_newDynamicExt) {
        // @ts-ignore
        var skin = game.qhly_getDynamicSkin(null, to), skinName;
        // @ts-ignore
        var realName = game.qhly_getRealName(to);
        if (skin) {
          // @ts-ignore
          skinName = game.qhly_getSkin(to);
          // @ts-ignore
          var skinCopy = game.qhly_deepClone(skin);
          if (skinCopy.action && skinCopy.pos) skinCopy.action = "ChuChang";
          if (skinCopy.speed == undefined) skinCopy.speed = 1;
          skinCopy.player = skinCopy;
          // taffy: 注释content.js原版代码喵
          // var theme = ui.arena.dataset.newDecadeStyle == 'on' ? 'decade' : 'shousha';
          /* taffy分界线 */
          // taffy: 适配一将成名UI
          var theme = ui.arena.dataset.decadeLayout == 'on' ? 'decade' : 'shousha';
          /* taffy分界线 */
          // @ts-ignore
          if (lib.config['extension_千幻聆音_qhly_editDynamic'] && lib.qhly_skinEdit[realName] && lib.qhly_skinEdit[realName][skinName] && lib.qhly_skinEdit[realName][skinName].player && lib.qhly_skinEdit[realName][skinName].player.dynamic && lib.qhly_skinEdit[realName][skinName].player.dynamic[theme]) {
            // @ts-ignore
            var resetDynamic = lib.qhly_skinEdit[realName][skinName].player.dynamic[theme];
            skinCopy.x = resetDynamic.x;
            skinCopy.y = resetDynamic.y;
            skinCopy.scale = resetDynamic.scale;
            skinCopy.angle = resetDynamic.angle;
            // @ts-ignore
            if (skinCopy.beijing && lib.qhly_skinEdit[realName][skinName].player.beijing && lib.qhly_skinEdit[realName][skinName].player.beijing[theme]) {
              // @ts-ignore
              var resetBeijing = lib.qhly_skinEdit[realName][skinName].player.beijing[theme];
              skinCopy.beijing.x = resetBeijing.x;
              skinCopy.beijing.y = resetBeijing.y;
              skinCopy.beijing.scale = resetBeijing.scale;
              skinCopy.beijing.angle = resetBeijing.angle;
            }
          }
        }
        // @ts-ignore
        if (this.doubleAvatar) {
          let primary = true;
          let deputy = true;
          if (this.name2 == to) primary = false;
          else deputy = false;
          // @ts-ignore
          if (this.dynamic) {
            // @ts-ignore
            this.stopDynamic(primary, deputy);
            // @ts-ignore
            decadeUI.CUR_DYNAMIC--;
          }
          if (skin) {
            // taffy: 注释content.js原版代码喵
            // // @ts-ignore
            // this.playDynamic(skinCopy, deputy, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on', lib.config['extension_千幻聆音_ignoreClips']);
            /* taffy分界线 */
            // taffy: 修复忽略clipSlots选项失效的问题喵
            // @ts-ignore
            this.playDynamic(skinCopy, deputy, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on', lib.config['extension_千幻聆音_qhly_ignoreClips']);
            /* taffy分界线 */
            // @ts-ignore
            decadeUI.CUR_DYNAMIC++;
          }
          var forces = 'qun';
          if (lib.character[this.name1]) forces = lib.character[this.name1][1];
        } else {
          // @ts-ignore
          if (this.dynamic) {
            // @ts-ignore
            this.stopDynamic();
            // @ts-ignore
            decadeUI.CUR_DYNAMIC--;
          }
          if (skin) {
            // taffy: 注释content.js原版代码喵
            // // @ts-ignore
            // this.playDynamic(skinCopy, false, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on', lib.config['extension_千幻聆音_ignoreClips']);
            /* taffy分界线 */
            // taffy: 修复忽略clipSlots选项失效的问题喵
            // @ts-ignore
            this.playDynamic(skinCopy, false, ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on', lib.config['extension_千幻聆音_qhly_ignoreClips']);
            /* taffy分界线 */
            // @ts-ignore
            decadeUI.CUR_DYNAMIC++;
            // @ts-ignore
            this.$dynamicWrap.style.backgroundImage = 'url("' + lib.assetURL + 'extension/十周年UI/assets/dynamic/' + skin.background + '")';
          }
          var forces = 'qun';
          if (lib.character[to]) forces = lib.character[to][1];
        }
        // @ts-ignore
        game.qhly_checkYH(this, forces);
      }
    }
    function qhly_stopdynamic(primary, deputy) {
      var dynamic = this.dynamic;
      if (!dynamic) return;

      primary = primary === true;
      deputy = deputy === true;
      if (primary && dynamic.primary) {
        dynamic.stop(dynamic.primary);
        dynamic.primary = null;
      } else if (deputy && dynamic.deputy) {
        dynamic.stop(dynamic.deputy);
        dynamic.deputy = null;
      } else if (!primary && !deputy) {
        dynamic.stopAll();
        dynamic.primary = null;
        dynamic.deputy = null;
      }

      if (!dynamic.primary && !dynamic.deputy) {
        this.classList.remove('d-skin');
        this.classList.remove('d-skin2');
        this.$dynamicWrap.remove();
      }
    }
    function qhly_playdynamic(animation, deputy, cutdybg, ignoreClip) {
      deputy = deputy === true;
      if (animation == undefined) return console.error('playDynamic: 参数1不能为空');
      var dynamic = this.dynamic;
      if (!dynamic) {
        // @ts-ignore
        dynamic = new duilib.DynamicPlayer('assets/dynamic/');
        // @ts-ignore
        dynamic.dprAdaptive = true;
        this.dynamic = dynamic;
        // @ts-ignore
        this.$dynamicWrap.appendChild(dynamic.canvas);
      } else {
        // @ts-ignore
        if (deputy && dynamic.deputy) {
          // @ts-ignore
          dynamic.stop(dynamic.deputy);
          // @ts-ignore
          dynamic.deputy = null;
        // @ts-ignore
        } else if (!deputy && dynamic.primary) {
          // @ts-ignore
          dynamic.stop(dynamic.primary);
          // @ts-ignore
          dynamic.primary = null;
        }
      }

      if (typeof animation == 'string') animation = { name: animation };
      const dybgxishu = (lib.config.qhly_lutouType && lib.config.qhly_lutouType == 'shousha') ? 0.873 : 0.9;
      // @ts-ignore
      if (this.doubleAvatar) {
        function clip(anim, cut) {
          if (Array.isArray(anim.x)) {
            anim.x = anim.x.concat();
            anim.x[1] += deputy ? 0.25 : -0.25;
          } else {
            if (anim.x == undefined) {
              anim.x = [0, deputy ? 0.75 : 0.25];
            } else {
              anim.x = [anim.x, deputy ? 0.25 : -0.25];
            }
          }

          anim.clip = {
            x: [0, deputy ? 0.5 : 0],
            y: 0,
            width: [0, 0.5],
            height: [0, cutdybg && cut ? dybgxishu : 1],
            clipParent: true
          };
        }
        // @ts-ignore
        if (window.qhly_newDynamicExt) {
          let num = (animation.dybg ? 2 : 1);
          for (let i = 0; i < num; i++) {
            if (i == 0 && num == 2) {
              clip(animation.dybg, true);
            } else {
              clip(animation);
            }
          }
        } else {
          let num = (animation.player.beijing ? 2 : 1);
          for (let i = 0; i < num; i++) {
            if (i == 0 && num == 2) {
              clip(animation.player.beijing, true);
            } else {
              clip(animation);
            }
          }
        }
      } else {
        // @ts-ignore
        if (window.qhly_newDynamicExt && animation.dybg && cutdybg) animation.dybg.clip = { x: 0, y: 0, width: [0, 1], height: [0, dybgxishu], clipParent: true };//切动态背景
        else if (animation.player && animation.player.beijing && cutdybg) animation.player.beijing.clip = { x: 0, y: 0, width: [0, 1], height: [0, dybgxishu], clipParent: true } //切动态背景
        else if (animation.player && animation.player.beijing && !cutdybg) animation.player.beijing.clip = null;
      }
      // @ts-ignore
      if (this.$dynamicWrap.parentNode != this) this.appendChild(this.$dynamicWrap);

      // @ts-ignore
      dynamic.outcropMask = duicfg.dynamicSkinOutcrop;
      if (ignoreClip) animation.clipSlots = undefined;
      // @ts-ignore
      var avatar = dynamic.play(animation, deputy);
      if (deputy === true) {
        // @ts-ignore
        dynamic.deputy = avatar;
      } else {
        // @ts-ignore
        dynamic.primary = avatar;
      }
      // @ts-ignore
      this.classList.add(deputy ? 'd-skin2' : 'd-skin');
      // @ts-ignore
      if (game.qhly_hasExtension('皮肤切换') && window.skinSwitch && lib.config[window.skinSwitch.configKey.useDynamic]) {
        skinSwitch.chukuangPlayerInit(this, !deputy, animation.player)
      }
    }
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    function qhly_showcharacter(num, log) {
      var toShow = [];
      if ((num == 0 || num == 2) && this.isUnseen(0)) toShow.add(this.name1);
      if ((num == 1 || num == 2) && this.isUnseen(1)) toShow.add(this.name2);
      if (!toShow.length) return;
      // @ts-ignore
      if (window.qhly_newDynamicExt && lib.config['extension_EpicFX_skinEffects']) {
        // @ts-ignore
        EpicFX.showCharacterSkin(this, num);
        if (this.skinPack && this.skinPack.btn && this != game.me) {
          if (!this.isUnseen()) {
            this.skinPack.btn.style.display = "block";
          }
        }
      } else {
        if (num == 0 && !this.isUnseen(0)) {
          return;
        }
        if (num == 1 && (!this.name2 || !this.isUnseen(1))) {
          return;
        }
        if (!this.isUnseen(2)) {
          return;
        }
        switch (num) {
          // @ts-ignore
          case 0: game.qhly_changeDynamicSkin(this, undefined, this.name1); break;
          // @ts-ignore
          case 1: game.qhly_changeDynamicSkin(this, undefined, this.name2, true); break;
          default: {
            // @ts-ignore
            game.qhly_changeDynamicSkin(this, undefined, this.name1);
            // @ts-ignore
            if (this.doubleAvatar) game.qhly_changeDynamicSkin(this, undefined, this.name2, true);
          }
        }
      }
      lib.element.player.$showCharacter.apply(this, arguments);
      var next = game.createEvent('showCharacter', false);
      next.player = this;
      next.num = num;
      // @ts-ignore
      next.toShow = toShow;
      // @ts-ignore
      next._args = arguments;
      next.setContent('showCharacter');
      // @ts-ignore
      game.qhly_checkYH(this);
      return next;
    }
    // @ts-ignore
    lib.qhly_stopdynamic = qhly_stopdynamic;
    // @ts-ignore
    lib.qhly_playdynamic = qhly_playdynamic;
    // @ts-ignore
    lib.qhly_showcharacter = qhly_showcharacter;
    lib.skill._qhcreateYH = {
      trigger: {
        global: ['showCharacter', 'die'],
      },
      direct: true,
      forced: true,
      charlotte: true,
      forceDie: true,
      filter: function () {
        // @ts-ignore
        return window.decadeUI;
      },
      content: function () {
        // @ts-ignore
        if (player.isDead()) player.stopDynamic();
        // @ts-ignore
        game.qhly_checkYH(player);
      }
    }
    lib.skill._qhlyChangeSkin = {
      trigger: {
        player: 'changeHp',
        global: 'phaseEnd',
      },
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      filter: function (event, player) {
        // @ts-ignore
        return lib.qhly_skinChange[game.qhly_getRealName(player.name1)] || lib.qhly_skinChange[game.qhly_getRealName(player.name2)];
      },
      direct: true,
      forced: true,
      charlotte: true,
      content: function () {
        for (let i = 0; i < 2; i++) {
          // @ts-ignore
          if (!player['name' + (i + 1)]) continue;
          // @ts-ignore
          let playerName = game.qhly_getRealName(player['name' + (i + 1)]);
          // @ts-ignore
          let skin = game.qhly_getSkin(playerName);
          // @ts-ignore
          if (lib.qhly_skinChange[playerName] && lib.qhly_skinChange[playerName][game.qhly_earse_ext(skin)] && lib.qhly_skinChange[playerName][game.qhly_earse_ext(skin)].source && lib.qhly_skinChange[playerName][game.qhly_earse_ext(skin)].source.indexOf('hp_') == 0) {
            // @ts-ignore
            if (!player._qhly_gonnaChange) player._qhly_gonnaChange = [0, 0];
            // @ts-ignore
            if (trigger.num > 0) {
              // @ts-ignore
              player._qhly_gonnaChange[i] = 1;
            }
            // @ts-ignore
            if (lib.qhly_skinChange[playerName][game.qhly_earse_ext(skin)].phase && trigger.name == 'recover' || trigger.name == 'phase' && player._qhly_gonnaChange[i] != 1) continue;
            // @ts-ignore
            if (trigger.name == 'phase') player._qhly_gonnaChange[i] = 0;
            // @ts-ignore
            game.qhly_checkPlayerImageAudio(playerName, skin, player, function () {
              // @ts-ignore
              player.node['avatar' + (i ? '2' : '')].qhly_origin_setBackgroundImage(player._qhly_skinChange[i]);
              // @ts-ignore
              // taffy: 修复变身后原画消失的问题喵
              // @ts-ignore
              game.qhly_checkFileExist(player._qhly_skinChange[i], function (s) {
                if (s) {
                  player.node['avatar' + (i ? '2' : '')].qhly_origin_setBackgroundImage(player._qhly_skinChange[i]);
                } else {
                  var prefix = game.qhly_foundPackage(playerName).prefix;
                  if (typeof prefix == 'function') {
                    prefix = prefix(playerName);
                  }
                  if (lib.config.qhly_noSkin == 'origin') {
                    if (prefix.includes('.jpg')) player.node['avatar' + (i ? '2' : '')].qhly_origin_setBackgroundImage(prefix);//原画
                    else player.node['avatar' + (i ? '2' : '')].qhly_origin_setBackgroundImage(prefix + playerName + '.jpg');//原画
                  }
                  else player.node['avatar' + (i ? '2' : '')].qhly_origin_setBackgroundImage('extension/千幻聆音/image/noSkin.png');//noskin
                }
              })
              /* taffy分界线 */
              if (!_status.qhly_replaceSkin[playerName]) _status.qhly_replaceSkin[playerName] = {};
              // @ts-ignore
              _status.qhly_replaceSkin[playerName][skin] = player._qhly_skinChange[i];
              // @ts-ignore
              if (!player._qhlyIsChanged) player._qhlyIsChanged = [0, 0];
              // @ts-ignore
              if (trigger.num < 0) player._qhlyIsChanged[i] = 1;
              // @ts-ignore
              else player._qhlyIsChanged[i] = 0;
              // @ts-ignore
              if (window.decadeUI && !game.qhly_hasExtension('皮肤切换') && !game.qhly_hasExtension('EpicFX')) game.qhly_changeDynamicSkin(player, undefined, undefined, i == 1);
            });
          }
        }
      }
    }
    lib.skill._qhlyChageKillingSkin = {
      trigger: { global: 'die' },
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      filter: function (event, player) {
        // @ts-ignore
        if (!event.source || !event.source.name1 || event._qhlyChangeKillSkin) return false;
        // @ts-ignore
        return lib.qhly_skinChange[game.qhly_getRealName(event.source.name1)] || lib.qhly_skinChange[game.qhly_getRealName(event.source.name2)];
      },
      direct: true,
      forced: true,
      charlotte: true,
      content: function () {
        // @ts-ignore
        var current = trigger.source;
        // @ts-ignore
        trigger._qhlyChangeKillSkin = true;
        // @ts-ignore
        game.qhly_changeSkillSkin(current, 'kill');
      }
    }
    lib.skill._qhlyCheckSkin = {
      trigger: { global: 'gameStart' },
      direct: true,
      forced: true,
      charlotte: true,
      firstDo: true,
      content: function () {
        // @ts-ignore
        game.qhly_checkYH(player);
        // @ts-ignore
        if (lib.qhly_skinChange[player.name1] || lib.qhly_skinChange[player.name2]) {
          // @ts-ignore
          if (!_status.qhly_replaceSkin) _status.qhly_replaceSkin = {};
          // @ts-ignore
          var num = player.name2 == undefined ? 1 : 2;
          for (var i = 0; i < num; i++) {
            // @ts-ignore
            game.qhly_setCurrentSkin(game.qhly_getRealName(player['name' + (i + 1)]), game.qhly_getSkin(game.qhly_getRealName(player['name' + (i + 1)])));
          }
        }
      }
    }

    // @ts-ignore
    game.qhly_changeSkillSkin = function (player, skill) {
      if (!skill || !player) return;
      if (skill != 'kill') {
        // @ts-ignore
        if (lib.qhly_changeSkillSkin[skill]) {
          // @ts-ignore
          if (Date.now() - lib.qhly_changeSkillSkin[skill] < 400) {
            // @ts-ignore
            lib.qhly_changeSkillSkin[skill] = Date.now();
            return;
          }
        }
        // @ts-ignore
        lib.qhly_changeSkillSkin[skill] = Date.now();
      }
      for (let i = 0; i < 2; i++) {
        // @ts-ignore
        let playerName = game.qhly_getRealName(player['name' + (i + 1)]);
        if (!playerName) continue;
        // @ts-ignore
        let skin = game.qhly_getSkin(player['name' + (i + 1)]);
        // @ts-ignore
        if (lib.qhly_skinChange[playerName] && lib.qhly_skinChange[playerName][game.qhly_earse_ext(skin)] && lib.qhly_skinChange[playerName][game.qhly_earse_ext(skin)].source && lib.qhly_skinChange[playerName][game.qhly_earse_ext(skin)].source == skill) {
          // @ts-ignore
          game.qhly_setPlayerStatus(player, i == 1, 3 - game.qhly_getPlayerStatus(player, i == 1));
          // @ts-ignore
          game.qhly_checkPlayerImageAudio(playerName, skin, player, function () {
            if (!player._qhlyIsChanged) player._qhlyIsChanged = [0, 0];
            player._qhlyIsChanged[i] = 1 - player._qhlyIsChanged[i];
            // taffy: 注释content.js原版代码喵
            // player.node['avatar' + (i ? '2' : '')].qhly_origin_setBackgroundImage(player._qhly_skinChange[i]);
            /* taffy分界线 */
            // taffy: 修复变身后原画消失的问题喵
            game.qhly_checkFileExist(player._qhly_skinChange[i], function (s) {
              if (s) {
                player.node['avatar' + (i ? '2' : '')].qhly_origin_setBackgroundImage(player._qhly_skinChange[i]);
              } else {
                var prefix = game.qhly_foundPackage(playerName).prefix;
                if (typeof prefix == 'function') {
                  prefix = prefix(playerName);
                }
                if (lib.config.qhly_noSkin == 'origin') {
                  if (prefix.includes('.jpg')) player.node['avatar' + (i ? '2' : '')].qhly_origin_setBackgroundImage(prefix);//原画
                  else player.node['avatar' + (i ? '2' : '')].qhly_origin_setBackgroundImage(prefix + playerName + '.jpg');//原画
                }
                else player.node['avatar' + (i ? '2' : '')].qhly_origin_setBackgroundImage('extension/千幻聆音/image/noSkin.png');//noskin
              }
            })
            /* taffy分界线 */
            // @ts-ignore
            if (!_status.qhly_replaceSkin) _status.qhly_replaceSkin = {};
            // @ts-ignore
            if (!_status.qhly_replaceSkin[playerName]) _status.qhly_replaceSkin[playerName] = {};
            // @ts-ignore
            _status.qhly_replaceSkin[playerName][skin] = player._qhly_skinChange[i];
            // @ts-ignore
            if (window.decadeUI && !game.qhly_hasExtension('皮肤切换') && !game.qhly_hasExtension('EpicFX')) game.qhly_changeDynamicSkin(player, undefined, undefined, i == 1);
          }, undefined);
        }
      }
    }
    if (!lib.config.qhly_decadeBigBak) {
      lib.config.qhly_decadeBigBak = 1;
      game.saveConfig('qhly_decadeBigBak', 1);
    }
    // @ts-ignore
    game.thunderFileExist = function (url) {
      if (window.XMLHttpRequest) {
        var http = new XMLHttpRequest();
      }
      else {
        // @ts-ignore
        var http = new ActiveXObject("Microsoft.XMLHTTP");
      }
      http.open('HEAD', url, false);
      try {
        http.send();
      } catch (err) {
        return false;
      }
      return http.status != 404;
    }
    if (lib.config.qhly_jianghun === undefined) lib.config.qhly_jianghun = 114514;
    if (!lib.config.qhly_shoushadengjie) lib.config.qhly_shoushadengjie = {};
    // @ts-ignore
    _status.qhly_shoushajinjie = [100, 6300, 23600, 160000/* , 442000 */];
    // @ts-ignore
    _status.qhly_jinjietiao = null;
    // @ts-ignore
    game.qhly_getShoushajinjie = function (name) {
      if (!name || typeof name != 'string') return [0, 0, 0];
      if (!lib.config.qhly_shoushadengjie[name]) lib.config.qhly_shoushadengjie[name] = 0;
      var dengjie = 0, current = lib.config.qhly_shoushadengjie[name], need = 190000;
      // @ts-ignore
      for (var i = 0; i < _status.qhly_shoushajinjie.length; i++) {
        // @ts-ignore
        if (current >= _status.qhly_shoushajinjie[i]) {
          dengjie++;
          // @ts-ignore
          current -= _status.qhly_shoushajinjie[i];
          // @ts-ignore
          need -= _status.qhly_shoushajinjie[i];
        };
      }
      need -= current;
      // @ts-ignore
      if (current == 0 && !_status.qhly_shoushajinjie[dengjie]) current = _status.qhly_shoushajinjie[dengjie - 1]
      return [dengjie, current, need];
    }
    var QHLY_DEBUGMODE = true;
    var jianghunUp = function () {
      lib.config.qhly_jianghun += 50000;
      lib.config.qhly_jianghun = Math.min(800000, lib.config.qhly_jianghun);
      game.saveConfig('qhly_jianghun', lib.config['qhly_jianghun']);
    }
    var qhly_mvp = function (result) {
      if (!lib.config['extension_千幻聆音_qhly_mvp']) return;
      var mvpplayers = game.players.concat(game.dead), list = [];
      for (var i = 0; i < mvpplayers.length; i++) {
        list[i] = [mvpplayers[i]];
        var score = 0;
        // @ts-ignore
        for (j = 0; j < mvpplayers[i].stat.length; j++) {
          if (mvpplayers[i].stat[j].damage != undefined) score += mvpplayers[i].stat[j].damage;
          if (mvpplayers[i].stat[j].damaged != undefined) score += mvpplayers[i].stat[j].damaged;
          if (mvpplayers[i].stat[j].gain != undefined) score += mvpplayers[i].stat[j].gain;
          if (JSON.stringify(mvpplayers[i].stat[j].skill) != '{}') score += Object.keys(mvpplayers[i].stat[j].skill).length;
          for (k in mvpplayers[i].stat[j].card) {
            score += mvpplayers[i].stat[j].card[k];
          }
          if (mvpplayers[i].stat[j].kill != undefined) score += mvpplayers[i].stat[j].kill * 2;
        }
        // @ts-ignore
        list[i].push(score);
      }
      list.sort(function (a, b) {
        // @ts-ignore
        return b[1] - a[1];
      })
      while (result == !list[0][0].isFriendsOf(game.me) && list.length) list.shift();
      // @ts-ignore
      if (list.length && list[0][1]) window.qhly_playVictoryAudio(list[0][0].name1);
    }
    lib.onover.push(jianghunUp);
    lib.onover.push(qhly_mvp);
    if (lib.config.qhly_skinset) {
      if (!lib.config.qhly_skinset.djtoggle) lib.config.qhly_skinset.djtoggle = {}
      game.saveConfig('qhly_skinset', lib.config.qhly_skinset);
    }
    // @ts-ignore
    game.qhly_getDengJie = function (name) { //十周年样式中通过game.getRarity获取css中的属性等阶
      var playerDengjie = 'one';
      if (!lib.config['extension_千幻聆音_qhly_decadeDengjie'] || lib.config['extension_千幻聆音_qhly_decadeDengjie'] == 'auto') {
        switch (game.getRarity(name)) {
          case 'common': playerDengjie = 'two'; break;
          case 'junk': playerDengjie = 'one'; break;
          case 'rare': playerDengjie = 'three'; break;
          case 'epic': playerDengjie = 'four'; break;
          default: playerDengjie = 'five';
        }
      }
      else playerDengjie = lib.config['extension_千幻聆音_qhly_decadeDengjie'];
      return playerDengjie;
    }
    // @ts-ignore
    game.qhly_getCurrentPlayer = function (str) {
      var list = [];
      var players = game.players.concat(game.dead);
      for (var i = 0; i < players.length; i++) {
        if (players[i].name1 == str) list.push([players[i], 'name1']);
        if (players[i].name2 == str) list.push([players[i], 'name2']);
      }
      if (list.length) return list;
      return [[null, 'name1']];
    }
    // @ts-ignore
    game.qhly_hasDynamicSkin = function (character, name) {               //判断character的名为name的皮肤是否有动皮
      // @ts-ignore
      if (!window.decadeUI) return false;
      // @ts-ignore
      var dskins = decadeUI.dynamicSkin;
      var skins = dskins[character];
      if (skins == undefined) return false;
      var keys = Object.keys(skins);
      if (keys.length == 0) return false;
      for (var i of Object.keys(skins)) {
        if (i == name) return true;
      }
      return false;
    }
    // @ts-ignore
    game.qhly_getSkinLevel = function (name, skin, decade, dongtai) {
      if (!skin) return decade ? 'yuanhua' : '原画';
      if (skin && skin.indexOf('.') == -1) skin += '.jpg';
      if ((!lib.config.qhly_level || !lib.config.qhly_level[name + '_' + skin]) && !decade) return '原画';
      if (!lib.config.qhly_level && decade) return 'yuanhua';
      if (!lib.config.qhly_level[name + '_' + skin] && decade) {
        if (skin && skin.indexOf('绝版') != -1) return 'jueban';
        var skinkey = skin.substring(0, skin.lastIndexOf('.'));
        // @ts-ignore
        if (window.decadeUI && decadeUI.dynamicSkin[name] && decadeUI.dynamicSkin[name][skinkey]) return 'dongtai';
        return dongtai ? 'dongtai' : 'yuanhua';
      }
      switch (lib.config.qhly_level[name + '_' + skin]) {
        case '稀有': return decade ? 'xiyou' : '稀有';
        case '史诗': return decade ? 'shishi' : '史诗';
        case '精良': return decade ? 'xiyou' : '精良';
        case '传说': return decade ? 'chuanshuo' : '传说';
        case '精品': return decade ? 'xiyou' : '稀有';
        case '绝版': return decade ? 'jueban' : '传说';
        case '动态': return decade ? 'dongtai' : '传说';
        case '普通': return decade ? 'putong' : '稀有';
        case '限定': return decade ? 'xianding' : '传说';
        default: return decade ? 'dongtai' : '原画';
      }
    }
    // @ts-ignore
    game.qhly_changeDynamicSkin = function (str, name, character, character2, play) {          //str主体，如果为字符串是名称中带有str的所有玩家，name指定更换为某种动皮，character玩家姓名id，character2是否为副将
      // @ts-ignore
      if (!window.decadeUI) return;
      if (lib.config['extension_千幻聆音_qhly_decadeCloseDynamic']) return;
      let res2;
      // @ts-ignore
      if (window.qhly_newDynamicExt) {
        res2 = {
          status: false,
          zhu: "default",
          fu: "default"
        }
        if (get.mode() == "guozhan" && !play) return res2;
      }
      var nodes;
      var increased;
      if (typeof str == 'object') nodes = [[str, character2 ? 'name2' : 'name1']];
      // @ts-ignore
      else nodes = game.qhly_getCurrentPlayer(str);
      for (var dy = 0; dy < nodes.length; dy++) {
        var node = nodes[dy][0];
        if (!node) continue;
        if (!node.playDynamic || !node.stopDynamic) {
          node.playDynamic = qhly_playdynamic;
          node.stopDynamic = qhly_stopdynamic;
        }

        if (!character) character = node[nodes[dy][1]];
        // @ts-ignore
        var nodeType = get.itemtype(node) == 'player' ? 'player' : 'bigAvatar';

        var bool1 = true, bool2 = false;
        if (character2) {
          bool1 = false, bool2 = true;
        } else if (nodes[dy][1] == 'name2') bool1 = false, bool2 = true;
        node.stopDynamic(bool1, bool2);
        // @ts-ignore
        game.qhly_checkYH(node);
        // @ts-ignore
        if (_status.mode != null) {
          var skins;
          // @ts-ignore
          var dskins = decadeUI.dynamicSkin;

          skins = dskins[character];
          if (skins == undefined)
            return;

          var keys = Object.keys(skins);

          if (keys.length == 0) {
            console.error('player.init: ' + character + ' 没有设置动皮参数');
            return;
          }

          var skin, cutdybg;
          if (name) {
            for (var i of Object.keys(skins)) {
              if (i == name) skin = skins[name];
            }
          }
          else {
            // @ts-ignore
            var value = game.qhly_getSkin(character);
            if (value) value = value.substring(0, value.lastIndexOf('.'));
            else value = '经典形象';
            if (lib.config.qhly_skinset.djtoggle && lib.config.qhly_skinset.djtoggle[character] && lib.config.qhly_skinset.djtoggle[character][value]) value = null;
            for (var i of Object.keys(skins)) {
              if (i == value) skin = skins[i];
            }
          }
          if (nodeType == 'player') {
            // @ts-ignore
            if (window.dynamicExt && window.dynamicExt != window.skinSwitch) {
              // @ts-ignore
              if (window.dynamicExt == window.eng) {
                if (lib.config['extension_EngEX_dynamicSkin']) {
                  if (skin) lib.config['extension_EngEX_dynamicSkin'][character] = value;
                  else if (lib.config['extension_EngEX_dynamicSkin'][character]) delete lib.config['extension_EngEX_dynamicSkin'][node];
                  game.saveConfig('extension_EngEX_dynamicSkin', lib.config['extension_EngEX_dynamicSkin']);
                } else {
                  if (skin) {
                    lib.config['extension_EngEX_dynamicSkin'] = {};
                    lib.config['extension_EngEX_dynamicSkin'][character] = value;
                    game.saveConfig('extension_EngEX_dynamicSkin', lib.config['extension_EngEX_dynamicSkin']);
                  }
                }
              } else {

              }
            }
          } else if (lib.config.qhly_smallwindowstyle == 'shousha') {
            if (skin && node.campBack && name) {
              // @ts-ignore
              if (!['史诗', '传说'].includes(game.qhly_getSkinLevel(character, name))) node.campBack.setAttribute("data-pinzhi", '史诗');
              // @ts-ignore
              else node.campBack.setAttribute("data-pinzhi", game.qhly_getSkinLevel(character, name));
              node.campBack.classList.add('dong');
            }
          }
          if (!skin) {
            if (bool2) {
              node.classList.remove('d-skin2');
            } else {
              node.classList.remove('d-skin');
            }
            return;
          }
          // @ts-ignore
          skin = game.qhly_formatDS(skin, character);
          var editArgument1 = 'dynamic', editArgument2 = 'beijing';
          // @ts-ignore
          if (game.qhly_getPlayerStatus(node, character2, character) == 2) {
            if (skin.special && skin.special.condition && (skin.special.condition.lowhp || skin.special.condition.juexingji)) {
              var value;
              var changeType = 'lowhp';
              if (skin.special.condition.juexingji) changeType = 'juexingji';
              var special = skin.special.condition[changeType].transform;
              if (Array.isArray(special)) special = special[0];
              if (skin.special[special]) value = skin.special[special].name ? skin.special[special].name : skin.name.slice(0, skin.name.lastIndexOf('/'));
              value = value.split('/');
              skins = dskins[value[0]];
              for (var i of Object.keys(skins)) {
                if (i == value[1]) {
                  skin = skins[value[1]];
                }
              }
            } else if (skin.transform) {
              if (skin.transform.low) skin = eval(skin.transform.low);
              else if (skin.transform.juexingji) skin = eval(skin.transform.juexingji);
            }
            editArgument1 = 'dynamic2';
            editArgument2 = 'beijing2';
          }
          // @ts-ignore
          var skinCopy = game.qhly_deepClone(skin);
          if (skinCopy.speed == undefined) skinCopy.speed = 1;
          skinCopy.zhu = !bool2;
          if (skinCopy.action && skinCopy.pos && nodeType == 'player') skinCopy.action = "ChuChang";
          // 动态背景切割 4 -> 判断提前
          if (nodeType == 'player') {
            // taffy: 注释content.js原版代码喵
            // cutdybg = ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.newDecadeStyle == 'on';
            /* taffy分界线 */
            // taffy: 适配一将成名UI
            cutdybg = ui.arena.dataset.dynamicSkinOutcrop == 'on' && ui.arena.dataset.decadeLayout == 'on';
            /* taffy分界线 */
          } else {
            cutdybg = lib.config.qhly_lutou && node.className.indexOf('shousha') < 0 && node.className.indexOf('qh-image') < 0;
          }
          skinCopy.qhly_resizeRatio = node.offsetHeight * (1 / game.me.offsetHeight);
          // 动态背景切割 4 -> 判断提前 end
          // @ts-ignore
          var editSkin = name || game.qhly_getSkin(character);
          if (editSkin == null) editSkin = '经典形象';
          if (editSkin.indexOf('.') < 0) editSkin += '.jpg';
          // taffy: 注释content.js原版代码喵
          // var themeType = ui.arena.dataset.newDecadeStyle == 'on' ? 'decade' : 'shousha';
          /* taffy分界线 */
          // taffy: 适配一将成名UI
          var themeType = ui.arena.dataset.decadeLayout == 'on' ? 'decade' : 'shousha';
          /* taffy分界线 */
          if (!node.classList.contains('qh-isBigAvatar') && nodeType != 'player') nodeType = 'player';
          var theme = nodeType == 'player' ? themeType : lib.config.qhly_currentViewSkin;
          // @ts-ignore
          if (lib.config['extension_千幻聆音_qhly_editDynamic'] && lib.qhly_skinEdit[game.qhly_getRealName(character)] && lib.qhly_skinEdit[game.qhly_getRealName(character)][editSkin] && lib.qhly_skinEdit[game.qhly_getRealName(character)][editSkin][nodeType] && lib.qhly_skinEdit[game.qhly_getRealName(character)][editSkin][nodeType][editArgument1] && lib.qhly_skinEdit[game.qhly_getRealName(character)][editSkin][nodeType][editArgument1][theme]) {
            // @ts-ignore
            var resetDynamic = lib.qhly_skinEdit[game.qhly_getRealName(character)][editSkin][nodeType][editArgument1][theme];
            skinCopy.x = resetDynamic.x;
            skinCopy.y = resetDynamic.y;
            skinCopy.scale = resetDynamic.scale * skinCopy.qhly_resizeRatio;
            skinCopy.angle = resetDynamic.angle;
            // @ts-ignore
            if ((skinCopy.beijing || skinCopy.dynamicBackground) && lib.qhly_skinEdit[game.qhly_getRealName(character)][editSkin][nodeType][editArgument2] && lib.qhly_skinEdit[game.qhly_getRealName(character)][editSkin][nodeType][editArgument2][theme]) {
              // @ts-ignore
              var resetBeijing = lib.qhly_skinEdit[game.qhly_getRealName(character)][editSkin][nodeType][editArgument2][theme];
              if (skinCopy.dynamicBackground) {
                if (typeof skinCopy.dynamicBackground === 'string') {
                  skinCopy.dybg = {
                    name: skinCopy.dynamicBackground,
                    zhu: skinCopy.zhu,
                    dybg: true,
                    loop: true,
                    x: resetBeijing.x,
                    y: resetBeijing.y,
                    scale: resetBeijing.scale * skinCopy.qhly_resizeRatio,
                    angle: resetBeijing.angle,
                  };
                } else {
                  skinCopy.dybg = skinCopy.dynamicBackground;
                  skinCopy.dybg.dybg = true;
                  skinCopy.dybg.loop = true;
                  skinCopy.dybg.zhu = skinCopy.zhu;
                  skinCopy.dybg.x = resetBeijing.x;
                  skinCopy.dybg.y = resetBeijing.y;
                  skinCopy.dybg.scale = resetBeijing.scale * skinCopy.qhly_resizeRatio;
                  skinCopy.dybg.angle = resetBeijing.angle;
                }
              }
              if (skinCopy.beijing) {
                skinCopy.beijing.x = resetBeijing.x;
                skinCopy.beijing.y = resetBeijing.y;
                skinCopy.beijing.scale = resetBeijing.scale * skinCopy.qhly_resizeRatio;
                skinCopy.beijing.angle = resetBeijing.angle;
              }
            }
          } else {
            skinCopy.scale = skinCopy.scale * skinCopy.qhly_resizeRatio;
            if (skinCopy.beijing) skinCopy.beijing.scale = (skinCopy.beijing.scale || 1) * skinCopy.qhly_resizeRatio;
            if (skinCopy.dynamicBackground) {
              if (typeof skinCopy.dynamicBackground === 'string') {
                skinCopy.dybg = {
                  name: skinCopy.dynamicBackground,
                  scale: skinCopy.scale * skinCopy.qhly_resizeRatio,
                  zhu: skinCopy.zhu,
                  dybg: true,
                  loop: true
                };
              } else {
                skinCopy.dybg = skinCopy.dynamicBackground;
                skinCopy.dybg.dybg = true;
                skinCopy.dybg.loop = true;
                skinCopy.dybg.zhu = skinCopy.zhu;
                skinCopy.dybg.scale = (skinCopy.dybg.scale || skinCopy.scale) * skinCopy.qhly_resizeRatio;
              }
            }
          }
          // @ts-ignore
          if (window.qhly_newDynamicExt) {
            // @ts-ignore
            if (bool1 && skinCopy.decade) res2.zhu = "decade";
            // @ts-ignore
            else if (skinCopy.decade) res2.fu = "decade";
            // @ts-ignore
            res2.status = true;
            // @ts-ignore
            if (get.itemtype(node) == 'player') {
              // @ts-ignore
              node.skinPack.zhuSkinType = res2.zhu;
              // @ts-ignore
              node.skinPack.fuSkinType = res2.fu;
            } else {
              if (skinCopy.dybg) skinCopy.dybg.clip = undefined;
            }
            // taffy: 注释content.js原版代码喵
            // node.playDynamic(skinCopy, bool2, cutdybg, lib.config['extension_千幻聆音_ignoreClips']);
            /* taffy分界线 */
            // taffy: 修复忽略clipSlots选项失效的问题喵
            node.playDynamic(skinCopy, bool2, cutdybg, lib.config['extension_千幻聆音_qhly_ignoreClips']);
            /* taffy分界线 */
            node.$dynamicWrap.style.backgroundImage = 'url("' + lib.assetURL + 'extension/十周年UI/assets/dynamic/' + skinCopy.background + '")';
            // @ts-ignore
            game.qhly_checkYH(node);
            // player.$dynamicWrap.style.backgroundImage = 'url("' + lib.assetURL + 'extension/十周年UI/assets/dynamic/' + skinCopy.background + '")';
            if (!skinCopy.dynamicBackground) { } node.$dynamicWrap.style.backgroundImage = `url(${lib.assetURL}extension/十周年UI/assets/dynamic/${skinCopy.background}`;
            if (!increased) {
              increased = true;
              // @ts-ignore
              decadeUI.CUR_DYNAMIC++;
            }
            return res2;
          } else {
            skinCopy.player = skinCopy;
            // 动态背景切 2  -> start, 此处需要把cutdybg参数提到外面初始化
            // taffy: 注释content.js原版代码喵
            // node.playDynamic(skinCopy, bool2, cutdybg, lib.config['extension_千幻聆音_ignoreClips']);
            /* taffy分界线 */
            // taffy: 修复忽略clipSlots选项失效的问题喵
            node.playDynamic(skinCopy, bool2, cutdybg, lib.config['extension_千幻聆音_qhly_ignoreClips']);
            /* taffy分界线 */
            // 动态背景切 2  -> end
            //if (get.itemtype(node) != 'player' && !_status.qhly_dynamic[character][skinCopy.name]) _status.qhly_dynamic[character][skinCopy.name] = node.dynamic;
            if (skinCopy.background) {
              // taffy: 注释content.js原版代码喵
              // if (node.doubleAvatar && ui.arena.dataset.newDecadeStyle == 'on') {
              /* taffy分界线 */
              // taffy: 适配一将成名UI
              if (node.doubleAvatar && ui.arena.dataset.decadeLayout == 'on') {
              /* taffy分界线 */
                let background1, background2;
                if (character2) {
                  background1 = node.dynamic.primary && node.dynamic.primary != null && node.dynamic.primary.background ? (lib.assetURL + 'extension/十周年UI/assets/dynamic/' + node.dynamic.primary.background) : '';
                  background2 = lib.assetURL + 'extension/十周年UI/assets/dynamic/' + skinCopy.background;
                } else {
                  background1 = lib.assetURL + 'extension/十周年UI/assets/dynamic/' + skinCopy.background;
                  background2 = node.dynamic.deputy && node.dynamic.deputy != null && node.dynamic.deputy.background ? (lib.assetURL + 'extension/十周年UI/assets/dynamic/' + node.dynamic.deputy.background) : '';
                }
                node.$dynamicWrap.style.backgroundImage = 'url("' + background1 + '"),url("' + background2 + '")';
                node.$dynamicWrap.style['background-size'] = '50% 100%';
                node.$dynamicWrap.style['background-position'] = 'left, right';
              }
              else node.$dynamicWrap.style.backgroundImage = 'url("' + lib.assetURL + 'extension/十周年UI/assets/dynamic/' + skinCopy.background + '")';
            } else {
              node.$dynamicWrap.style.backgroundImage = 'url("' + lib.assetURL + 'extension/皮肤切换/images/card/card.png")'
            }
            // @ts-ignore
            game.qhly_checkYH(node);
            // 修改9 start
            // @ts-ignore
            if (game.qhly_hasExtension('皮肤切换') && window.skinSwitch && lib.config[window.skinSwitch.configKey.useDynamic]) {
              // 出框worker的初始化
              skinSwitch.chukuangPlayerInit(node, !bool2, skinCopy)
            }
            // 开启当前角色的定时播放动作
            // @ts-ignore
            if (get.itemtype(node) == 'player') {
              // @ts-ignore
              if (game.qhly_hasExtension('皮肤切换') && window.skinSwitch && lib.config[window.skinSwitch.configKey.useDynamic]) {
                skinSwitch.dynamic.startPlay2Random(node)
              }
            }
            // 修改10 end
          }
        }
      }
    }
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    game.qhly_checkPlayerImageAudio = function (name, skin, player, callbacka, callbackb, force) {
      // @ts-ignore
      var skinName = game.qhly_earse_ext(skin);
      if (!player) {
        var players = game.filterPlayer(function (current) {
          return current.name1 == name || current.name2 == name;
        })
        if (players.length) player = players[0];
      }
      if (!player) return;
      var imageChanged = false;   //皮肤改变
      var audioChanged = false;   //语音映射改变
      // @ts-ignore
      var pkg = game.qhly_foundPackage(name);
      var avatar2 = false;
      // @ts-ignore
      if (get.itemtype(player) == 'player' && player.name2 && player.name2 == name) avatar2 = true;
      // @ts-ignore
      var pkgPath = (pkg.isExt && game.qhly_getRealName(name) != name && skin) ? DEFAULT_PACKAGE.skin.standard : pkg.skin.standard;
      // @ts-ignore
      if (lib.qhly_skinChange[name] && lib.qhly_skinChange[name][skinName] && lib.qhly_skinChange[name][skinName].source) {
        if (!player._qhly_skinChange) player._qhly_skinChange = ['', ''];
        // @ts-ignore
        if (lib.qhly_skinChange[name][skinName].source.indexOf('hp_') == 0) {
          // @ts-ignore
          let hp = parseInt(lib.qhly_skinChange[name][skinName].source.slice(3));
          if (player.hp <= hp) {
            // @ts-ignore
            if (game.qhly_getPlayerStatus(player, avatar2) != 2) {
              imageChanged = true;
              // @ts-ignore
              player._qhly_skinChange[avatar2 ? 1 : 0] = pkgPath + lib.qhly_skinChange[game.qhly_getRealName(name)][skinName].image1;
            }
            // @ts-ignore
            if (!window.qhly_audio_redirect[name + '-' + skinName] || window.qhly_audio_redirect[name + '-' + skinName] != lib.qhly_skinChange[name][skinName].audio1) {
              audioChanged = true;
              // @ts-ignore
              window.qhly_audio_redirect[name + '-' + skinName] = lib.qhly_skinChange[name][skinName].audio1;
            }
          } else if (player.hp > hp) {
            if (player._qhly_gonnaChange && player._qhly_gonnaChange[avatar2 ? 1 : 0]) {
              // @ts-ignore
              if (game.qhly_getPlayerStatus(player, avatar2) != 2) {
                imageChanged = true;
                // @ts-ignore
                player._qhly_skinChange[avatar2 ? 1 : 0] = pkgPath + lib.qhly_skinChange[game.qhly_getRealName(name)][skinName].image1;
              }
              // @ts-ignore
              if (!window.qhly_audio_redirect[name + '-' + skinName] || window.qhly_audio_redirect[name + '-' + skinName] != lib.qhly_skinChange[name][skinName].audio1) {
                audioChanged = true;
                // @ts-ignore
                window.qhly_audio_redirect[name + '-' + skinName] = lib.qhly_skinChange[name][skinName].audio1;
              }
            } else {
              // @ts-ignore
              if (game.qhly_getPlayerStatus(player, avatar2) != 1) {
                imageChanged = true;
                // @ts-ignore
                player._qhly_skinChange[avatar2 ? 1 : 0] = pkgPath + lib.qhly_skinChange[game.qhly_getRealName(name)][skinName].image2;
              }
              // @ts-ignore
              if (window.qhly_audio_redirect[name + '-' + skinName]) {
                audioChanged = true;
                // @ts-ignore
                delete window.qhly_audio_redirect[name + '-' + skinName];
              }
            }
          }
        } else {
          // @ts-ignore
          if (game.qhly_getPlayerStatus(player, avatar2) == 1) {
            // @ts-ignore
            if (!player._qhly_skinChange[avatar2 ? 1 : 0] || player._qhly_skinChange[avatar2 ? 1 : 0] != pkgPath + lib.qhly_skinChange[game.qhly_getRealName(name)][skinName].image2) {
              imageChanged = true;
              // @ts-ignore
              player._qhly_skinChange[avatar2 ? 1 : 0] = pkgPath + lib.qhly_skinChange[game.qhly_getRealName(name)][skinName].image2;
            }
            // @ts-ignore
            if (window.qhly_audio_redirect[name + '-' + skinName]) {
              audioChanged = true;
              // @ts-ignore
              delete window.qhly_audio_redirect[name + '-' + skinName];
            }
          } else {
            // @ts-ignore
            if (!player._qhly_skinChange[avatar2 ? 1 : 0] || player._qhly_skinChange[avatar2 ? 1 : 0] != pkgPath + lib.qhly_skinChange[game.qhly_getRealName(name)][skinName].image1) {
              imageChanged = true;
              // @ts-ignore
              player._qhly_skinChange[avatar2 ? 1 : 0] = pkgPath + lib.qhly_skinChange[game.qhly_getRealName(name)][skinName].image1;
            }
            // @ts-ignore
            if (!window.qhly_audio_redirect[name + '-' + skinName] || window.qhly_audio_redirect[name + '-' + skinName] != lib.qhly_skinChange[name][skinName].audio1) {
              audioChanged = true;
              // @ts-ignore
              window.qhly_audio_redirect[name + '-' + skinName] = lib.qhly_skinChange[name][skinName].audio1;
            }
          }
        }
      }
      if (imageChanged && callbacka) callbacka();
      // @ts-ignore
      if (audioChanged) game.qhly_setCurrentSkin(name, skin, callbackb);
    }
    // @ts-ignore
    game.qhly_getPlayerStatus = function (player, avatar2, name) {
      var num = 1;
      // @ts-ignore
      if (name) name = game.qhly_getRealName(name);
      // @ts-ignore
      else if (!name && get.itemtype(player) == 'player') name = game.qhly_getRealName(player['name' + (avatar2 ? '2' : '1')]);
      else if (!name) return 1;
      if (player) {
        if (player._qhly_skinStatus) return player._qhly_skinStatus[avatar2 ? 1 : 0];
        if (player._qhlyIsChanged && player._qhlyIsChanged[avatar2 ? 1 : 0]) return 2;
        // @ts-ignore
        if (get.itemtype(player) == 'player') var node = player.node['avatar' + (avatar2 ? '2' : '')];
        else var node = player;
        const support = ['.jpg', '.png', '.webp'];
        const bg = node.style.backgroundImage || node.style.getPropertyValue('background-image');
        // @ts-ignore
        if (lib.qhly_skinChange[name] && lib.qhly_skinChange[name][game.qhly_earse_ext(game.qhly_getSkin(name))]) {
          if (bg) {
            for (var s of support) {
              var index = bg.indexOf(s);
              if (index > 0) {
                var frIndex = bg.indexOf(name);
                if (frIndex > 0) {
                  var str = bg.slice(frIndex, index + 4);
                  // @ts-ignore
                  if (lib.qhly_skinChange[name][game.qhly_earse_ext(game.qhly_getSkin(name))].image1 && str == lib.qhly_skinChange[name][game.qhly_earse_ext(game.qhly_getSkin(name))].image1) num = 2;
                }
              }
            }
          }
        }
      }
      return num;
    }
    // @ts-ignore
    game.qhly_setPlayerStatus = function (player, avatar2, num) {
      if (typeof player == 'object') {
        if (!player._qhly_skinStatus) player._qhly_skinStatus = [1, 1];
        player._qhly_skinStatus[avatar2 ? 1 : 0] = num;
      }
    }
    // @ts-ignore
    game.qhly_deepClone = function (obj, newObj) {
      // @ts-ignore
      var newObj = newObj || {};
      for (let key in obj) {
        if (Array.isArray(obj[key])) {
          newObj[key] = [...obj[key]];
        } else if (typeof obj[key] == 'object' && obj[key] != null) {
          if (obj[key] === obj) {
            newObj[key] = newObj;
            continue;
          }
          newObj[key] = {};
          // @ts-ignore
          game.qhly_deepClone(obj[key], newObj[key]);
        } else {
          newObj[key] = obj[key]
        }
      }
      return newObj;
    }
    // @ts-ignore
    lib.element.player.playChangeSkinEffect = function (avatar2) {
      // @ts-ignore
      game.qhly_playQhlyAudio('qhly_voc_dec_fanshu', null, true);
      // @ts-ignore
      if (!window.decadeUI) return;
      var str = 'huanpifu_', act = '';
      // taffy: 注释content.js原版代码喵
      // var huanfuType = lib.config['extension_十周年UI_newDecadeStyle'] == 'on' ? 'huanpifu' : 'huanfu';
      /* taffy分界线 */
      // taffy: 适配一将成名UI
      var huanfuType = ui.arena.dataset.decadeLayout == 'on' ? 'huanpifu' : 'huanfu';
      /* taffy分界线 */
      // @ts-ignore
      if (!decadeUI.animation.hasSpine(window.qhlyUI.assets[huanfuType]['name'])) return;
      var currentScale = 0.7;
      var name = avatar2 ? this.name2 : this.name1;
      if (huanfuType == 'huanpifu') {
        // @ts-ignore
        switch (game.qhly_getSkinLevel(name, game.qhly_getSkin(name), true)) {
          // @ts-ignore
          case 'xiyou': str += 'purple'; act = 2; break;
          // @ts-ignore
          case 'shishi': str += 'yellow'; act = 3; break;
          case 'putong': str += 'white'; break;
          // @ts-ignore
          case 'yuanhua': str += 'white'; act = 6; break;
          // @ts-ignore
          case 'chuanshuo': str += 'gules'; act = 4; break;
          // @ts-ignore
          case 'xianding': str += 'gules'; act = 5; break;
          // @ts-ignore
          case 'jueban': str += 'gules'; act = 7; break;
          // @ts-ignore
          default: str += 'gules'; act = 8; break;
        }
      } else {
        str = 'play';
        currentScale *= 0.65;
      }
      // taffy: 注释content.js原版代码喵
      // let bool1 = lib.config['extension_十周年UI_newDecadeStyle'] == 'on' ? true : false;
      /* taffy分界线 */
      // taffy: 适配一将成名UI
      let bool1 = ui.arena.dataset.decadeLayout == 'on' ? true : false;
      /* taffy分界线 */
      // @ts-ignore
      if (this.doubleAvatar) {
        var currentWidth = bool1 ? 0.068 : 0.06;
        if (avatar2) {   //副将
          // @ts-ignore
          window.qhlyUI.assets[huanfuType].clip = {
            x: [0, this.offsetLeft / document.body.offsetWidth + currentWidth + (bool1 ? 0 : 0.02)],
            y: 0,
            width: [0, currentWidth],
            height: [0, 1],
            clipParent: true
          };
          // @ts-ignore
          decadeUI.animation.playSpine({ name: window.qhlyUI.assets[huanfuType].name, action: str }, { scale: currentScale, y: [0, 0.5], parent: this });
          // @ts-ignore
          decadeUI.animation.playSpine({ name: window.qhlyUI.assets.pinzhi.name, action: 'play' + act }, { scale: 0.3, x: [0, 0.75], y: [0, 0.15], parent: this });
        } else {   //主将
          // @ts-ignore
          window.qhlyUI.assets[huanfuType].clip = {
            x: [0, this.offsetLeft / document.body.offsetWidth + (bool1 ? 0 : 0.02)],
            y: 0,
            width: [0, currentWidth],
            height: [0, 1],
            clipParent: true
          }
          // @ts-ignore
          decadeUI.animation.playSpine({ name: window.qhlyUI.assets[huanfuType].name, action: str }, { scale: currentScale, x: [0, 0.5], y: [0, 0.5], parent: this });
          // @ts-ignore
          decadeUI.animation.playSpine({ name: window.qhlyUI.assets.pinzhi.name, action: 'play' + act }, { scale: 0.3, x: [0, 0.25], y: [0, 0.15], parent: this });
        }
      } else {
        // @ts-ignore
        decadeUI.animation.playSpine({ name: window.qhlyUI.assets[huanfuType].name, action: str }, { scale: currentScale, y: [0, 0.5], parent: this });
        // @ts-ignore
        if (huanfuType == 'decade') decadeUI.animation.playSpine({ name: window.qhlyUI.assets.pinzhi.name, action: 'play' + act }, { scale: 0.5, y: [0, 0.15], parent: this });
      }
    }

    // @ts-ignore
    game.qhly_getDynamicSkin = function (skinName, playerName) {
      // @ts-ignore
      if (!window.decadeUI) return false;
      if (!playerName) return false;
      // @ts-ignore
      var dskins = dui.dynamicSkin;
      var skins = dskins[playerName];
      if (skins) {
        if (skinName) return skins[skinName];
        else {
          var skin;
          // @ts-ignore
          var value = game.qhly_getSkin(playerName);
          if (value) value = value.substring(0, value.lastIndexOf('.'));
          else value = '经典形象';
          if (lib.config.qhly_skinset.djtoggle &&
            lib.config.qhly_skinset.djtoggle[playerName] &&
            lib.config.qhly_skinset.djtoggle[playerName][value]) return false;
          for (var j of Object.keys(skins)) {
            if (j == value) skin = skins[value];
          }
          if (skin) return skin;
          else return false;
        }
      } else return false;
    }
    // @ts-ignore
    game.qhly_checkYH = function (player, group) {
      if(lib.config.qhly_close_circle_top === true)return;
      // taffy: 注释content.js原版代码喵
      // if (lib.config['extension_十周年UI_newDecadeStyle'] == "on") return;
      /* taffy分界线 */
      // taffy: 适配一将成名UI
      if (ui.arena.dataset.decadeLayout == 'on') return;
      /* taffy分界线 */
      // @ts-ignore
      if (!player || get.itemtype(player) != 'player') return;
      let gro = player.group || group;
      if (!gro) gro = 'weizhi';
      let isYh = false;
      if (player.dynamic) {
        if (player.dynamic.primary && player.dynamic.primary != null && !player.isUnseen(0)) isYh = true;
        if (player.dynamic.deputy && player.dynamic.deputy != null && !player.isUnseen(1)) isYh = true;
        if (player.isDead()) isYh = false;
      }
      let skinYh = player.getElementsByClassName("skinYh");
      if (skinYh.length > 0) skinYh[0].remove();
      if (isYh && skinYh.length == 0) {
        let yh = document.createElement("img");
        yh.classList.add("skinYh");
        // @ts-ignore
        yh.src = lib.qhly_path + "image/border/" + gro + ".png";
        yh.onerror = function () {
          // @ts-ignore
          yh.src = lib.qhly_path + "image/border/weizhi.png"
        }
        player.appendChild(yh);
      }
    }
    // @ts-ignore
    game.playShoushaAvatar = function (node, flip, name) {
      // @ts-ignore
      if (!lib.config['extension_千幻聆音_qhly_shoushaTexiao'] || !window.decadeUI) return;
      // @ts-ignore
      if (window.dynamicExt == window.eng && !lib.config['extension_EngEX_SSSEffect']) return;
      var mainPlayer = document.getElementById('mainView');
      // @ts-ignore
      if (!mainPlayer || !node.dynamic || !node.dynamic.primary || node.dynamic.primary.name != _status.currentTexiao || _status.bigEditing) {
        // @ts-ignore
        clearInterval(_status.texiaoTimer);
        // @ts-ignore
        clearTimeout(_status.texiaoTimer2);
        return;
      }
      // @ts-ignore
      if (game.qhly_hasExtension('皮肤切换') && window.skinSwitch && lib.config[window.skinSwitch.configKey.useDynamic]) {
        node.isQhlx = true // 表示当前动皮角色是千幻雷修版本的
        // @ts-ignore
        window.skinSwitch.postMsgApi.actionGongJi(node)  // 直接调用封装的播放动皮
      } else {
        let res;
        // @ts-ignore
        if (window.qhly_newDynamicExt && lib.config['extension_EpicFX_skinEffects']) {
          // @ts-ignore
          res = EpicFX.canAction4(node, "GongJi");
          if (!res.ok) return;
          if (res.skin1 && res.skin2) {
            let skin = res["skin" + (Math.ceil(2 * Math.random()))];
            // @ts-ignore
            if (skin.decade) EpicFX.playDynamicEffect2(node, "gongji", skin, flip);
            // @ts-ignore
            else EpicFX.playDynamicEffect(node, "GongJi", skin, flip);
          } else {
            for (let i = 1; i < 3; i++) {
              let skin = res["skin" + i];
              if (skin) {
                if (skin.decade) {
                  // @ts-ignore
                  EpicFX.playDynamicEffect2(node, "gongji", skin, flip);
                } else {
                  // @ts-ignore
                  EpicFX.playDynamicEffect(node, "GongJi", skin, flip);
                }
              }
            }
          }
          return;
        } else {
          function canBeAction(player) {
            let isPrimary = player.dynamic.primary;
            let res = {
              isDouble: false,
              deputy: false,
              needHide: false
            }
            res.dynamic = isPrimary;
            return res;
          }
          res = canBeAction(node);
          if (res) {
            var renderer = node.dynamic.renderer;
            var canvas = node.getElementsByClassName("animation-player")[0];
            //var dynamicWrap = node.getElementsByClassName("qhdynamic-big-wrap")[0];
            renderer.onmessage = function (e) {
              if (e.data) {
                //if (dynamicWrap) dynamicWrap.style.zIndex = "64";
                if (canvas) {
                  canvas.style.position = "fixed";
                  canvas.style.height = "100%";
                  canvas.style.width = "100%";
                }
                node.style.zIndex = 64;

                renderer.onmessage = function (e) {
                  if (e.data) {
                    game.playAudio("..", "extension", "EngEX/audio/effect", res.dynamic.name + ".mp3");
                    // @ts-ignore
                    // @ts-ignore
                    // @ts-ignore
                    renderer.onmessage = function (e) {
                      //if (dynamicWrap) dynamicWrap.style.zIndex = "62";
                      if (canvas) {
                        canvas.style.height = null;
                        canvas.style.width = null;
                        canvas.style.position = null;
                      }
                      node.style.zIndex = 62;
                      node.GongJi = false;
                    };
                  }
                };
              } else {
                //dynamicWrap = null;
                canvas = null;
                renderer = null;
                res = null;
              }
            };
            var tempX = node.dynamic.primary.x, chukuangX = tempX;
            var tempY = node.dynamic.primary.y, chukuangY = tempY;
            var tempA = node.dynamic.primary.angle || 0, chukuangA = tempA;
            var tempS = node.dynamic.primary.scale || 1, chukuangS = tempS;
            // @ts-ignore
            var realName = game.qhly_getRealName(name);
            // @ts-ignore
            var skin = game.qhly_getSkin(name);
            var theme = lib.config.qhly_currentViewSkin;
            // @ts-ignore
            if (lib.qhly_skinEdit[realName] && lib.qhly_skinEdit[realName][skin] && lib.qhly_skinEdit[realName][skin].bigAvatar && lib.qhly_skinEdit[realName][skin].bigAvatar.chukuang && lib.qhly_skinEdit[realName][skin].bigAvatar.chukuang[theme]) {
              // @ts-ignore
              let res2 = lib.qhly_skinEdit[realName][skin].bigAvatar.chukuang[theme];
              if (res2.x != undefined) chukuangX = res2.x;
              if (res2.y != undefined) chukuangY = res2.y;
              if (res2.angle != undefined) chukuangA = res2.angle;
              if (res2.scale != undefined) chukuangS = res2.scale;
            }
            if (renderer.postMessage) renderer.postMessage({
              message: "ACTION",
              id: node.dynamic.id,
              action: "Qhly",
              skinID: res.dynamic.id,
              x: tempX,
              y: tempY,
              scale: tempS,
              angle: tempA,
              chukuangX: chukuangX,
              chukuangY: chukuangY,
              chukuangA: chukuangA,
              chukuangS: chukuangS,
              flipX: flip,
            });
          }
        }
      }
    }
    // @ts-ignore
    game.qhly_getRealName = function (name) {
      if (name === undefined) return undefined;
      if (!name) return;
      var realName = name;
      // @ts-ignore
      if (lib.qhly_skinShare[name] && lib.qhly_skinShare[name].name) realName = lib.qhly_skinShare[name].name;
      // taffy: 修复nameinfo[4]中指定的原画路径信息无法被千幻聆音检测到的问题
      let nameinfo = get.character(realName);
      if (nameinfo && nameinfo[4]) for (const value of nameinfo[4]) {
				if (value.startsWith('ext:')) {
					realName = value.slice(4).replace(/(.*\/)*([^.]+).*/ig,"$2");
					break;
				}
				else if (value.startsWith('db:')) {
					realName = value.slice(3).replace(/(.*\/)*([^.]+).*/ig,"$2");
					break;
				}
				else if (value.startsWith('character:')) {
					realName = value.slice(10);
					break;
				}
			}
      /* taffy分界线 */
      return realName;
    }
    // @ts-ignore
    game.qhly_getCoordinate = function (domNode, subtr) {
      // @ts-ignore
      if (!domNode && !window.decadeUI) return false;
      var rect = domNode.getBoundingClientRect();
      return {
        x: rect.left,
        // @ts-ignore
        y: decadeUI.get.bodySize().height - (subtr ? rect.bottom : 0),
        width: rect.width,
        height: rect.height
      };
    }
    // @ts-ignore
    game.qhly_postMessage = function (node, data, mode, noAlert) {
      if (!node.dynamic || !node.dynamic.renderer) return;
      if (!node.dynamic.renderer.postMessage) {
        if (!noAlert) alert('开启过太多动皮，无法调整，请重启游戏！');
        return;
      }
      // @ts-ignore
      switch (window.dynamicExt) {
        // @ts-ignore
        case window.skinSwitch: {
          skinSwitch.postMsgApi.resizePos(node, mode, data);
        }
          break;
        default: {
          if (mode == 'daiji') node.dynamic.renderer.postMessage(data);
          // @ts-ignore
          else if (window.qhly_newDynamicExt) {
            if (mode == 'beijing') node.dynamic.renderer.postMessage(data);
          }
        }
      }
    }
    // @ts-ignore
    game.qhly_syncChangeSkinButton = function (name, skin, state) {
      var player = game.filterPlayer(function (current) {
        return current.name1 == name || current.name2 == name;
      })
      // @ts-ignore
      if (player.length) player = player[0];
      // @ts-ignore
      var skinName = game.qhly_earse_ext(skin), num = 0;
      for (var i = 0; i < 2; i++) {
        var button = document.getElementById('qhlySkinChangebutton' + i);
        if (button) button.remove();
      }
      // @ts-ignore
      if (lib.qhly_skinChange[name] && lib.qhly_skinChange[name][skinName]) {
        if (!document.getElementById('qhlySkinChangebutton1')) {
          var buttons = [];
          for (let i = 0; i < 2; i++) {
            buttons[i] = ui.create.div('.qhly-skinChangebutton' + i, state.mainView.skinBar);
            buttons[i].id = 'qhlySkinChangebutton' + i;
            buttons[i].listen(function () {
              if (this.classList.contains('sel')) return;
              for (var j = 0; j < 2; j++) {
                buttons[j].classList.remove('sel');
              }
              this.classList.add('sel');
              var index = 2 - parseInt(this.id.slice(20));
              // @ts-ignore
              window.qhly_audio_redirect[game.qhly_getRealName(name) + '-' + skinName] = lib.qhly_skinChange[game.qhly_getRealName(name)][skinName]['audio' + index];
              // @ts-ignore
              game.qhly_setCurrentSkin(name, skin, function () {
                // @ts-ignore
                game.qhly_setOriginSkin(name, skin, state.mainView.avatarImage, state, this.id.slice(20) == '1');
              }.bind(this))
              // @ts-ignore
              if (this.id == 'qhlySkinChangebutton1') game.qhly_setPlayerStatus(state.mainView.avatarImage, undefined, 2);
              // @ts-ignore
              else game.qhly_setPlayerStatus(state.mainView.avatarImage, undefined, 1);
              if (lib.config.qhly_currentViewSkin == 'shousha') state.mainView.page.skin.refresh(name, state);
              // @ts-ignore
              if (!lib.config.qhly_skinset.djtoggle[name] || lib.config.qhly_skinset.djtoggle[name] && !lib.config.qhly_skinset.djtoggle[name][skinName]) game.qhly_changeDynamicSkin(state.mainView.avatarImage, skinName, name);
              // @ts-ignore
              if (state.mainView.avatarImage.dynamic && state.mainView.avatarImage.dynamic.primary != null) _status.currentTexiao = state.mainView.avatarImage.dynamic.primary.name;
            })
          }
          // @ts-ignore
          num = game.qhly_getPlayerStatus(state.mainView.avatarImage, null, name) == 2 ? 1 : 0;
          buttons[num].classList.add('sel');
        } else {
          // @ts-ignore
          if (button && button.classList.contains('sel')) {
            // @ts-ignore
            window.qhly_audio_redirect[game.qhly_getRealName(name) + '-' + skinName] = lib.qhly_skinChange[game.qhly_getRealName(name)][skinName].audio1;
          } else {
            // @ts-ignore
            delete window.qhly_audio_redirect[game.qhly_getRealName(name) + '-' + skinName];
          }
          // @ts-ignore
          game.qhly_setCurrentSkin(name, skin);
        }
      }
    }
    //--------------------------------------新增
    // @ts-ignore
    if (!lib.qhly_callbackList) {
      // @ts-ignore
      lib.qhly_callbackList = [];
    }
    // @ts-ignore
    lib.qhly_dirskininfo = {};
    if (!lib.config.qhly_changeSex) lib.config.qhly_changeSex = {};
    // @ts-ignore
    game.qhly_importSkinInfo = function (obj) {
      // @ts-ignore
      lib.qhly_dirskininfo[obj.name] = obj;
    };
    // @ts-ignore
    lib.qhly_filterPlainText = function (str) {
      if (!str) return "";
      var regex = /(<([^>]+)>)/ig;
      return str.replace(regex, "");
    };
    // @ts-ignore
    lib.qhly_slimName = function(str){
      return get.slimName(str);
    };
    // @ts-ignore
    lib.qhly_getSkillKeyWordColorList = function () {
      if (!lib.config.qhly_keymark) return null;
      if (lib.config.qhly_keymark.length == 0) return null;
      var pairs = lib.config.qhly_keymark.split(";");
      var obj = {};
      for (var pair of pairs) {
        var us = pair.split(":");
        if (us[0] && us[1] && us[0].length && us[1].length) {
          obj[us[0]] = us[1];
        }
      }
      return obj;
    };
    // @ts-ignore
    String.prototype.replaceAll = function (s1, s2) {
      return this.replace(new RegExp(s1, "gm"), s2);
    };
    // @ts-ignore
    lib.qhly_keyMark = function (str) {
      if (!lib.config.qhly_keymarkopen) return str;
      // @ts-ignore
      var obj = lib.qhly_getSkillKeyWordColorList();
      if (!obj) return str;
      for (var k in obj) {
        var v = obj[k];
        if (k.indexOf("#") == 0) {
          var k2 = k.slice(1);
          str = str.replaceAll(k2, "<b style='color:" + v + "'>" + k2 + "</b>");
        } else {
          str = str.replace(k, "<b style='color:" + v + "'>" + k + "</b>");
        }
      }
      return str;
    };
    // @ts-ignore
    game.qhly_earseExt = function (path) {
      if (!path) return null;
      var foundDot = path.lastIndexOf('.');
      if (foundDot < 0) return path;
      return path.slice(0, foundDot);
    };
    // @ts-ignore
    window.qhly_createConfigWindow = function(title,buttonText,html,idList){
        var window = ui.create.div('.qh-config-win');
        // @ts-ignore
        window.qhv = {};
        // @ts-ignore
        window.qhv.title = ui.create.div('.qh-config-win-title',window);
        // @ts-ignore
        window.qhv.title.innerHTML = title;
        // @ts-ignore
        window.qhv.button = ui.create.div('.qh-config-win-button',window);
        // @ts-ignore
        window.qhv.button.innerHTML = buttonText;
        // @ts-ignore
        window.qhv.text = ui.create.div('.qh-config-win-text',window);
        // @ts-ignore
        window.qhv.text.innerHTML = html;
        // @ts-ignore
        lib.setScroll(window.qhv.text);
        document.body.appendChild(window);
        if(idList){
          for(var key of idList){
            (function(key){
              var m = document.getElementById(key);
              // @ts-ignore
              window.qhv[key] = m;
            })(key);
          }
        }
        return window;
    };
    // @ts-ignore
    window.qhly_openPluginWindow = function(){
      var html = "";
      var list = [];
      // @ts-ignore
      var plugins = game.qhly_getPlugins(null,false);
      var count = 0;
      var map = {};
      for(var plugin of plugins){
        (function(plugin){
          var name = plugin.label;
          if(!name){
            name = plugin.name;
          }
          var ph = "<h2>"+name+"</h2>";
          ph += "<p>";
          if(plugin.author){
            ph = ph + "插件作者："+plugin.author+"<br>";
          }else{
            ph = ph + "插件作者：未知<br>";
          }
          if(plugin.pluginType){
            ph = ph +"插件类型："+ plugin.pluginType+"<br>";
          }
          if(plugin.intro){
            ph = ph + "<br><font size='2' color='gray'>"+plugin.intro+"</font>";
          }
          ph += ("<br><img id='qhly_pluginwindow_plugin_"+count+"'/>"+
          "<span id='qhly_pluginwindow_plugin_text_"+count+"' style='bottom:10px;'>插件启用</span>");
          list.push("qhly_pluginwindow_plugin_"+count);
          list.push("qhly_pluginwindow_plugin_text_"+count);
          ph += "<br>------------------------------<br>";
          html = html+ph;
          map[count] = plugin;
          count++;
        })(plugin);
      }
      // @ts-ignore
      var win = window.qhly_createConfigWindow("插件管理","",html,list);
      var qhv = win.qhv;
      qhv.button.setBackgroundImage('extension/千幻聆音/image/qhly_ok2.png');
      qhv.button.listen(function(){
        win.delete();
        // @ts-ignore
        game.qhly_playQhlyAudio('qhly_voc_press', null, true);
      });
      var bindFunc = function (checkbox, text) {
        if (!text) return;
        // @ts-ignore
        ui.qhly_addListenFunc(text);
        text.listen(function () {
          // @ts-ignore
          game.qhly_playQhlyAudio('qhly_voc_check', null, true);
          checkbox.qhly_setChecked(!checkbox.qhly_checked, true);
        });
      };
      for(var num in map){
        (function(num){
          var plugin = map[num];
          var check = qhv['qhly_pluginwindow_plugin_'+num];
          // @ts-ignore
          var isOpen = lib.config.qhly_disabledPlugins?(!lib.config.qhly_disabledPlugins.includes(game.qhly_getPluginId(plugin))):true;
          // @ts-ignore
          ui.qhly_initCheckBox(check,isOpen);
          bindFunc(check,qhv['qhly_pluginwindow_plugin_text_'+num]);
          check.qhly_onchecked=function(check){
            if(check){
              if(lib.config.qhly_disabledPlugins){
                // @ts-ignore
                lib.config.qhly_disabledPlugins.remove(game.qhly_getPluginId(plugin));
                game.saveConfig('qhly_disabledPlugins',lib.config.qhly_disabledPlugins);
              }
            }else{
              if(!lib.config.qhly_disabledPlugins){
                lib.config.qhly_disabledPlugins = [];
              }
              // @ts-ignore
              lib.config.qhly_disabledPlugins.push(game.qhly_getPluginId(plugin));
              game.saveConfig('qhly_disabledPlugins',lib.config.qhly_disabledPlugins);
            }
          };
        })(num);
      }
      return win;
    };
    // @ts-ignore
    HTMLDivElement.prototype.qhly_listen = function (func) {
      if (lib.config.touchscreen) {
        this.addEventListener('touchend', function (e) {
          func.call(this, e);
        });
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        var fallback = function (e) {
          this.removeEventListener('click', fallback);
        }
        this.addEventListener('click', fallback);
      }
      else {
        this.addEventListener('click', func);
      }
      return this;
    };
    game.saveConfig('qhly_forceall', true);
    // @ts-ignore
    if (!lib.qhly_callbackList) {
      // @ts-ignore
      lib.qhly_callbackList = [];
    }
    var originGetRarity = game.getRarity;

    game.getRarity = function (name) {
      if (lib.config.qhly_rarity) {
        if (lib.config.qhly_rarity[name]) {
          return lib.config.qhly_rarity[name];
        }
      }
      if (originGetRarity) {
        return originGetRarity(name);
      }
      return 'common';
    };

    if (!get.infoHujia) {
      get.infoHujia = function () {
        return 0;
      }
    }

    // @ts-ignore
    ui.qhly_fixTextSize = function (node, size) {
      if (!size) size = 25;
      node.style.fontSize;
      var base = lib.config.qhly_fontsize1;
      if (!base) {
        base = 5;
      }
      if (typeof base == 'string') {
        base = parseInt(base);
      }
      if (base == 5) return size;
      var min = size / 2;
      var middle = size;
      var max = size * 2;
      var unit1 = (middle - min) / 4;
      var unit2 = (max - middle) / 4;
      if (base < 5) {
        node.style.fontSize = (middle - unit1 * (5 - base)).toFixed(2) + "px";
      } else {
        node.style.fontSize = (middle + unit2 * (base - 5)).toFixed(2) + "px";
      }
    };
    //判断文件、文件夹是否存在
    // @ts-ignore
    game.qhly_checkFileExist = function (path, callback) {
      if (lib.node && lib.node.fs) {
        try {
          var stat = lib.node.fs.statSync(__dirname + '/' + path);
          callback(stat);
        } catch (e) {
          callback(false);
          return;
        }
      // taffy: 补充web端读取文件喵
      } else if (typeof resolveLocalFileSystemURL!='function') {
        try {
          game.readFile(lib.assetURL + path, (function (name) {
            return function (entry) {
              callback(true);
            }
          }(name)), function () {
            game.getFileList(lib.assetURL + path, (function (name) {
              return function (entry) {
                callback(true);
              }
            }(name)), function () {
              callback(false);
            });
          });
        } catch (error) {
          callback(false);
        }
      /* taffy分界线 */
      } else {
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        resolveLocalFileSystemURL(nonameInitialized + path, (function (name) {
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          return function (entry) {
            callback(true);
          }
        }(name)), function () {
          callback(false);
        });
      }
    };
    // @ts-ignore
    game.qhly_setOriginSkin = function (name, skin, node, state, skin2) {
      if (skin != null) {//国战兼容
        if (name.indexOf('gz_') == 0) {
          // @ts-ignore
          if (lib.config.qhly_guozhan === false || get.mode() != 'guozhan' || !game.qhly_hasGuozhanSkin(name)) {
            var subname = name.slice(3);
            if (get.character(subname)) {
              name = subname;
            }
          }
        }
      }
      // @ts-ignore
      var realName = game.qhly_getRealName(name);
      // @ts-ignore
      var originFrom = (state.pkg.isExt && realName != name && skin) ? DEFAULT_PACKAGE.skin.standard : state.pkg.skin.standard;
      // @ts-ignore
      var originFrom1 = (state.pkg.isExt && realName != name && skin) ? DEFAULT_PACKAGE.skin.origin : state.pkg.skin.origin;
      var originFrom2;
      var position = '50%';
      // @ts-ignore
      var setTrue = lib.qhly_skinChange[name] && lib.qhly_skinChange[name][game.qhly_earse_ext(skin)];
      if (skin) {
        if (skin2 && setTrue) {
          originFrom2 = realName + '/' + skin.substr(0, skin.length - 4) + '/' + skin.substr(0, skin.length - 4) + '2';
        }
        else {
          originFrom2 = realName + '/' + skin.substr(0, skin.length - 4);
        }
      }
      else {
        originFrom2 = name + '/' + name;
        skin = '经典形象.jpg';
      }
      originFrom2 += '.jpg';
      let image = new Image();
      image.src = lib.assetURL + originFrom1 + originFrom2;
      let theme = lib.config.qhly_currentViewSkin == 'decade' ? true : false;
      let rarity = document.getElementsByClassName('qh-avatarrarity');
      image.onload = function () {
        let landscape = false;
        // @ts-ignore
        if (this.width > this.height && theme) landscape = true;
        node.classList.remove('qh-image-lutou');
        node.classList.add('qh-image-standard');
        if (theme) {
          node.classList.add('decadeBig');
          if (landscape) {
            node.classList.add('landscape');
            if (rarity) {
              rarity[0].classList.remove('stand');
              rarity[0].classList.add('landscape');
            }
            position = '62%';
          }
          else {
            node.classList.remove('landscape');
            if (rarity) {
              rarity[0].classList.remove('landscape');
              rarity[0].classList.add('stand');
            }
          }
          state.mainView.avatar.classList.add('noBorder');
          state.mainView.avatarBorder.classList.add('noBorder');
        }
        node.style.backgroundImage = 'url(' + image.src + ')';
        node.style.backgroundSize = 'cover';
        var positionArgument = lib.config.qhly_currentViewSkin;
        // @ts-ignore
        if (game.qhly_getPlayerStatus(state.mainView.avatarImage, null, state.name) == 2) {
          positionArgument = lib.config.qhly_currentViewSkin + '2';
        }
        // @ts-ignore
        if (lib.qhly_skinEdit[realName] && lib.qhly_skinEdit[realName][skin] && lib.qhly_skinEdit[realName][skin][positionArgument]) {
          // @ts-ignore
          position = lib.qhly_skinEdit[realName][skin][positionArgument];
        }
        node.style.setProperty('--p', position);
      }
      image.onerror = function () {
        if (state.pkg.isLutou || lib.config.qhly_lutou) {
          node.classList.remove('qh-image-standard');
          node.classList.add('qh-image-lutou');
        }
        if (theme) {
          node.classList.remove('decadeBig');
          node.classList.remove('landscape');
          if (rarity) {
            rarity[0].classList.remove('stand');
            rarity[0].classList.remove('landscape');
          }
          state.mainView.avatar.classList.remove('noBorder');
          state.mainView.avatarBorder.classList.remove('noBorder');
        }
        if (skin2 && setTrue) {
          // @ts-ignore
          node.qhly_origin_setBackgroundImage(originFrom + lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)].image1);
          node.style.backgroundSize = 'cover';
        }
        else node.setBackground(name, 'character');
      }
    }
    // @ts-ignore
    game.qhly_playerWindow = function (node) {
      // @ts-ignore
      if (window.qhly_forbidPlayerWindow) return;             //给其他扩展一个变量接口，方便临时禁用单击武将弹出菜单功能（记得执行完你的功能后设为false哦）
      const player = node.parentNode;
      const playerName = node.className == 'primary-avatar' ? player.name1 : player.name2;
      // @ts-ignore
      if (_status.qhly_open || _status.bigEditing || _status.qhly_playerWindowing) return;
      // @ts-ignore
      _status.qhly_playerWindowing = true;
      function exit(e) {
        if (e) e.stopPropagation();
        var touch = document.getElementById('qhly_bigBackground');
        var black = document.getElementById('qhly_playerwindowbg');
        // @ts-ignore
        _status.qhly_playerWindowing = false;
        if (touch) touch.remove();
        if (black) black.remove();
      }
      var touchbg = ui.create.div('.qhly_bigBackground', document.body);
      touchbg.id = 'qhly_bigBackground';
      touchbg.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', exit);
      var blackbg = ui.create.div('.qhly-playerwindowbg', player);
      // taffy: 注释content.js原版代码喵
      // if (ui.arena.dataset.newDecadeStyle != 'on' && player.dynamic && (player.dynamic.primary != null || player.dynamic.deputy != null)) blackbg.style.cssText += 'top:-12%;width:101%;height:113%;border-radius: 300px 182px 20px 20px/80px 65px 20px 20px;'
      /* taffy分界线 */
      // taffy: 适配一将成名UI
      if (ui.arena.dataset.decadeLayout != 'on' && player.dynamic && (player.dynamic.primary != null || player.dynamic.deputy != null)) blackbg.style.cssText += 'top:-12%;width:101%;height:113%;border-radius: 300px 182px 20px 20px/80px 65px 20px 20px;'
      /* taffy分界线 */
      blackbg.id = 'qhly_playerwindowbg';
      blackbg.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', exit);
      var buttons = new Array(3);
      for (var i = 0; i < 3; i++) {
        if (player.doubleAvatar || !player.dynamic || player.dynamic && player.dynamic.primary == null) {
          if (i == 2) continue;
        }
        buttons[i] = ui.create.div('.qhly-playerwindowbtn' + i, blackbg);
        buttons[i].id = 'qhly_playerwindowbtn' + i;
        buttons[i].addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function (e) {
          e.stopPropagation();
          exit();
          // @ts-ignore
          game.qhly_playQhlyAudio('qhly_voc_dec_press', null, true);
          switch (this.id) {
            case 'qhly_playerwindowbtn0': {//武将信息
              // @ts-ignore
              game.qhly_open_new(playerName, lib.config.qhly_doubledefaultpage ? lib.config.qhly_doubledefaultpage : 'skill', node);
            }
              break;
            case 'qhly_playerwindowbtn1': {//换肤小窗
              // @ts-ignore
              game.qhly_open_small(playerName, null, node);
            }
              break;
            case 'qhly_playerwindowbtn2': {//调整动皮
              if (player.doubleAvatar) {
                alert('双将暂不支持编辑动皮');
                return;
              }
              // @ts-ignore
              game.qhly_bigEdit(player);
            }
              break;
          }
        });
      }
    }
    // @ts-ignore
    game.qhly_formatDS = function (obj, namex) {
      if (!lib.config['extension_千幻聆音_qhly_formatDS'] || obj._hasFormated) return obj;
      var keys = Object.keys(obj);
      var bianshenFlag = false, texiaoFlag = false;
      for (var key of keys) {
        if (key == 'dynamicBackground') obj.beijing = { name: obj.dynamicBackground };
        if (key == 'beijing') obj.dynamicBackground = obj.beijing.name;
        if (key == 'decade') obj.shizhounian = true;
        if (key == 'shizhounian') obj.decade = true;
        if (key == 'transform' && (obj.transform.low && obj.transform.high || obj.transform.juexingji) && !bianshenFlag) {
          bianshenFlag = true;
          if (obj.transform.low) {
            //let To = eval(obj.transform.low);
            let index = obj.transform.low.indexOf('.') + 1;
            index = obj.transform.low.indexOf('.', index) + 1;
            let To = obj.transform.low.substring(index, obj.transform.low.length).replace('.', '/');
            //let From = eval(obj.transform.high);
            obj.special = {
              变身1: {
                hp: 2,
                name: To,
              },
              condition: {
                lowhp: {
                  transform: ['变身1'],
                  recover: true,
                },
              }
            }
          } else if (obj.transform.juexingji) {
            let index = obj.transform.juexingji.indexOf('.') + 1;
            index = obj.transform.juexingji.indexOf('.', index) + 1;
            let To = obj.transform.juexingji.substring(index, obj.transform.juexingji.length).replace('.', '/');
            obj.special = {
              变身: {
                name: To,
              },
              condition: {
                juexingji: {
                  transform: "变身",
                },
              }
            }
          }
        }
        else if (key == 'special' && obj.special.condition && !bianshenFlag) {
          bianshenFlag = true;
          if (obj.special.condition.lowhp) {
            let str = obj.special.condition.lowhp.transform;
            if (Array.isArray(str)) str = str[0];
            let To = obj.special[str].name ? obj.special[str].name : obj.name.slice(0, obj.name.lastIndexOf('/'));
            To = 'decadeUI.dynamicSkin.' + To.replace('/', '.');
            // @ts-ignore
            let currentSkin = game.qhly_getSkin(namex);
            // @ts-ignore
            if (currentSkin) currentSkin = game.qhly_earse_ext(currentSkin);
            let From = 'decadeUI.dynamicSkin.' + namex + '.' + currentSkin;
            obj.transform = {
              low: To,
              high: From,
            }
          } else if (obj.special.condition.juexingji) {
            let str = obj.special.condition.juexingji.transform;
            if (Array.isArray(str)) str = str[0];
            let To = obj.special[str].name ? obj.special[str].name : obj.name.slice(0, obj.name.lastIndexOf('/'));
            To = 'decadeUI.dynamicSkin.' + To.replace('/', '.');
            obj.transform = {
              juexingji: To,
            }
          }
        }
        if (key == 'effects' && !texiaoFlag) {
          texiaoFlag = true;
          if (obj.effects.chuchang) {
            obj.chuchang = {
              name: obj.effects.chuchang,
              action: 'play'
            }
          }
          obj.gongji = obj.effects.gongji;
          if (obj.gongji) obj.gongji.action = 'gongji';
          obj.teshu = obj.effects.jineng;
          if (obj.teshu) obj.teshu.action = 'jineng';
        }
        else if ((key == 'chuchang' || key == 'teshu' || key == 'gongji') && !texiaoFlag) {
          texiaoFlag = true;
          obj.effects = {
            gongji: obj.gongji,
            jineng: obj.teshu,
            chuchang: obj.chuchang,
          }
        }
        if ((obj.shizhounian || obj.decade) && (obj.gongji || obj.teshu)) obj.shan = 'play3';
      }
      obj._hasFormated = true;
      return obj;
    }
    // @ts-ignore
    game.qhly_setDoubleGroup = function (state) {
      let border = get.character(state.name);
      if(border){
        border = border.groupBorder;
      }
      var group, dg;
      if (lib.config.qhly_doubleGroup && lib.config.qhly_doubleGroup[state.name]) {
        if (lib.config.doubleGroupCharacter && lib.config.doubleGroupCharacter.includes(state.name) || get.is.double(state.name)) {
          dg = true;
          group = lib.config.qhly_doubleGroup[state.name][0] + lib.config.qhly_doubleGroup[state.name][1];
        }
        else group = state.intro[1];
      }
      else {
        const groupList = ['jin', 'wei', 'shu', 'wu', 'qun', 'jin'];
        group = state.intro[1];
        state.group = group;
        if (lib.config.doubleGroupCharacter && lib.config.doubleGroupCharacter.includes(state.name) || get.is.double(state.name)) {
          dg = true;
          if (!lib.config.qhly_doubleGroup) game.saveConfig('qhly_doubleGroup', {});
          if (lib.config.qhly_doubleGroup[state.name]) group = lib.config.qhly_doubleGroup[state.name];
          else if (get.is.double(state.name)) {
            // @ts-ignore
            group = get.is.double(state.name, true);
          } else {
            if (groupList.includes(group)) group = [group, groupList[groupList.indexOf(group) + 1]];
            else group = ['jin', 'wei'];
          }
          state.group = [...group];
          group = group[0] + group[1];
        }
      }
      var path;
      switch (group) {
        case 'shu': case 'wu': case 'wei': case 'qun': case 'jin': case 'key': case 'shen': case 'ye': path = group; break;
        default: if (state.pkg.ssborder) path = state.pkg.ssborder;
        else if (dg) path = group;
      }
      if (path) {
        var url1;
        if(border){
          url1 = `url('${state.pkg.ssborder || 'shousha/border2/'}${group}_zi.png'),url('${state.pkg.ssborder || 'shousha/border2/'}${border}_frame.png')`;
        }else{
          url1 = `url('${state.pkg.ssborder || 'shousha/'}${group}.png')`;
        }
        var url2;
        if(border){
          url2 = `url('${state.pkg.ssborder || 'shousha/'}${border}_top.png')`;
        }else{
          url2 = `url('${state.pkg.ssborder || 'shousha/'}${group}_top.png')`;
        }
        state.mainView.avatarLabel.style.setProperty('--u', url2);
        state.mainView.avatarLabelOther.style.setProperty('--u', url1);
      }
      // @ts-ignore
      game.qhly_refreshSShp(state);
    }
    // @ts-ignore
    game.qhly_refreshSShp = function (state) {
      var hp = state.intro[2], group;
      if (state.group && Array.isArray(state.group)) group = state.group[1];
      else if (lib.config.qhly_doubleGroup && lib.config.qhly_doubleGroup[state.name]) {
        if (lib.config.doubleGroupCharacter && lib.config.doubleGroupCharacter.includes(state.name) || get.is.double(state.name)) {
          group = lib.config.qhly_doubleGroup[state.name][1];
        }
        else group = state.intro[1];
      }
      else group = state.intro[1];
      var hpBorder;
      switch (group) {
        case 'shu': hpBorder = 'red'; break;
        case 'wu': hpBorder = 'green'; break;
        case 'wei': hpBorder = 'blue'; break;
        case 'qun': hpBorder = 'yellow1'; break;
        case 'shen': hpBorder = 'yellow2'; break;
        case 'jin': case 'ye': hpBorder = 'purple'; break;
        default: hpBorder = state.pkg.sshpBorder && state.pkg.sshpBorder[group];
      }
      var HP = 0, MAXHP = 0, hpNode;//血量 空血量
      if (typeof hp == 'string') {
        var hp2 = hp.split('/');
        if (hp2.length > 1) {
          // @ts-ignore
          HP = hp2[0];
          // @ts-ignore
          MAXHP = hp2[1];
        } else {
          // @ts-ignore
          HP = hp2[0];
        }
      } else HP = hp;
      function getWidth(str, index) {
        let len = str.length;
        let words = str.charAt(index);
        let onenum = str.match(/1/g);
        if (onenum) {
          onenum = onenum.length;
          let result = 0;
          result = 2 / (onenum + (len - onenum) * 1.64);
          if (words == '1') return result.toFixed(2) + 'em';
          else return (1.64 * result).toFixed(2) + 'em';
        } else return 2 / len.toFixed(2) + 'em';
      }
      state.mainView.hp.innerHTML = '';
      var slimName = state.name.split('_');
      slimName = slimName[slimName.length - 1];
      const excludeName = ['xiahouyuan', 'guanyu', 'sunjian', 'simashi', 'lvbu'];
      if (state.mainView.skinTypeGuozhan) {  //显示国战血量
        if (get.mode() != 'guozhan' && excludeName.includes(slimName) && state.name != 're_lvbu') HP++;//非国战模式下除界吕布以外角色显示普通模式血量+1
        HP = HP *= 0.5;
        if (HP <= 5) {
          for (var i = 0; i < Math.floor(HP); i++) {
            hpNode = ui.create.div('.qh-hpGZtext', state.mainView.hp);
            if (hpBorder) {
              var url1 = `url('shousha/chr_detail_guo_hp_${hpBorder}.png')`;
              hpNode.style.setProperty('--u', url1);
            }
          }
          if (HP % 1 != 0) {
            var url2 = `url('shousha/chr_detail_guo_hp_${hpBorder}_2.png')`;
            hpNode = ui.create.div('.qh-hpGZtext.blank', state.mainView.hp);
            hpNode.style.setProperty('--ub', url2);
          }
        } else {
          // @ts-ignore
          if(isFinite(HP)){
            // @ts-ignore
            HP = 'I';
          }else{
            // @ts-ignore
            HP = HP + '';
          }
          hpNode = ui.create.div('.qh-hptextnumber', state.mainView.hp);
          // @ts-ignore
          for (var i = 0; i < HP.length; i++) {
            var hpNumber = ui.create.div('.qh-hpnumber', hpNode);
            // @ts-ignore
            hpNumber.style.backgroundImage = 'url(' + lib.qhly_path + 'theme/shousha/hp_num_' + HP.substr(i, 1) + '.png)';
            // @ts-ignore
            if(HP == 'I'){
              hpNumber.style.transform = "scale(1.5)";
            }
          }
          hpNode = ui.create.div('.qh-hpGZtext', state.mainView.hp);
          // @ts-ignore
          hpNode.style.backgroundImage = 'url(' + lib.qhly_path + 'theme/shousha/hp_num_x.png)';
          hpNode = ui.create.div('.qh-hpGZtext', state.mainView.hp);
          if (hpBorder) {
            var url = `url('shousha/chr_detail_guo_hp_${hpBorder}.png')`;
            hpNode.style.setProperty('--u', url);
          }
        }
      } else {  //显示其他模式血量
        if (get.mode() == 'guozhan' && HP == 5) {
          if (state.name != 'gz_jin_simashi') HP--;//国战模式下5血角色显示普通模式血量-1
          else {
            HP = 3;
            MAXHP = 4;
          }
        }
        if (HP > 5 || MAXHP > 5) {
          // @ts-ignore
          if(!isFinite(HP) || HP == "infinity" || HP == "Infinity" || HP == "∞"){
            // @ts-ignore
            HP = 'I';
          }else{
            // @ts-ignore
            HP = HP + '';
          }
          // @ts-ignore
          if (MAXHP){
            // @ts-ignore
            if(!isFinite(MAXHP) || MAXHP == "infinity" || MAXHP == "Infinity" || MAXHP == "∞"){
              // @ts-ignore
              MAXHP = "I";
            }else{
              // @ts-ignore
              MAXHP = MAXHP + '';
            }
          }
          hpNode = ui.create.div('.qh-hptextnumber', state.mainView.hp);
          if (MAXHP) {
            // @ts-ignore
            for (var i = 0; i < MAXHP.length; i++) {
              var hpNumber = ui.create.div('.qh-hpnumber', hpNode);
              // @ts-ignore
              hpNumber.style.backgroundImage = 'url(' + lib.qhly_path + 'theme/shousha/hp_num_' + MAXHP.substr(i, 1) + '.png)';
              hpNumber.style.setProperty('--w', getWidth(MAXHP, i));
              // @ts-ignore
              if(MAXHP == 'I'){
                hpNumber.style.transform = "scale(1.5)";
              }
            }
            ui.create.div('.qh-hpsplit', state.mainView.hp);
          }
          hpNode = ui.create.div('.qh-hptextnumber', state.mainView.hp);
          // @ts-ignore
          for (var i = 0; i < HP.length; i++) {
            var hpNumber = ui.create.div('.qh-hpnumber', hpNode);
            // @ts-ignore
            hpNumber.style.backgroundImage = 'url(' + lib.qhly_path + 'theme/shousha/hp_num_' + HP.substr(i, 1) + '.png)';
            hpNumber.style.setProperty('--w', getWidth(HP, i));
            // @ts-ignore
            if(HP == 'I'){
              hpNumber.style.transform = "scale(1.5)";
            }
          }
          if (!MAXHP) {
            hpNode = ui.create.div('.qh-hptext', state.mainView.hp);
            // @ts-ignore
            hpNode.style.cssText = `width:1.5em;height:1.5em;margin-bottom:0.4em;background-image:url(${lib.qhly_path}theme/shousha/hp_num_x.png)`
          }
          hpNode = ui.create.div('.qh-hptext', state.mainView.hp);
          if (hpBorder) {
            var url1 = `url('shousha/chr_detail_hp_${hpBorder}.png')`;
            var url2 = `url('shousha/chr_detail_hp_${hpBorder}_none.png')`;
            hpNode.style.setProperty('--u', url1);
            hpNode.style.setProperty('--ub', url2);
          }
        } else {
          for (var i = 0; i < HP; i++) {
            hpNode = ui.create.div('.qh-hptext', state.mainView.hp);
            if (hpBorder) {
              var url1 = `url('shousha/chr_detail_hp_${hpBorder}.png')`;
              var url2 = `url('shousha/chr_detail_hp_${hpBorder}_none.png')`;
              hpNode.style.setProperty('--u', url1);
              hpNode.style.setProperty('--ub', url2);
            }
          }
          if (MAXHP) {
            for (var i = 0; i < (MAXHP - HP); i++) {
              hpNode = ui.create.div('.qh-hptext.blank', state.mainView.hp);
              if (hpBorder) {
                var url1 = `url('shousha/chr_detail_hp_${hpBorder}.png')`;
                var url2 = `url('shousha/chr_detail_hp_${hpBorder}_none.png')`;
                hpNode.style.setProperty('--u', url1);
                hpNode.style.setProperty('--ub', url2);
              }
            }
          }
        }
      }
    }
    // @ts-ignore
    window.qhly_checkObject = function (str, parent) {
      if (!parent) {
        parent = window;
      }
      var arr = [];
      if (typeof str == 'string') {
        if (str.indexOf(".") < 0) {
          return parent[str];
        }
        arr = str.split(".");
        // @ts-ignore
        return window.qhly_checkObject(arr, parent);
      } else {
        arr = str;
      }
      if (arr.length == 0) return false;
      if (arr.length == 1) return parent[arr[0]];
      var m = arr[0];
      var n = parent[m];
      if (!n) return false;
      // @ts-ignore
      return window.qhly_checkObject(arr.slice(1), n);
    };
    // @ts-ignore
    if (window.qhly_checkObject("configMenu.appearence.config.name_font.item", lib)) {
      var fontConfigs = [lib.configMenu.appearence.config.name_font.item,
      lib.configMenu.appearence.config.identity_font.item,
      lib.configMenu.appearence.config.cardtext_font.item,
      lib.configMenu.appearence.config.global_font.item];
      var fonts = {
        'qh_heiti': "黑体",
        'qh_zhunyuan': '准圆',
        'qh_youyuan': '幼圆',
        'qh_weili': "魏隶",
        'qh_songhei': '宋黑',
      };
      for (var i of fontConfigs) {
        for (var j in fonts) {
          i[j] = fonts[j];
        }
      }
    }


    if (!lib.config.qhly_currentMusic) {
      lib.config.qhly_currentMusic = 'system';
    }

    //if(lib.config.qhly_newui === undefined){
    lib.config.qhly_newui = true;
    game.saveConfig('qhly_newui', true);
    //}
    // @ts-ignore
    if (ui && ui.css && ui.css.fontsheet && ui.css.fontsheet.sheet && ui.css.fontsheet.sheet.insertRule) {
      // @ts-ignore
      ui.css.fontsheet.sheet.insertRule("@font-face {font-family: 'qh_heiti';src: url('" + lib.qhly_path + "font/heiti.woff2');}", 0);
      // @ts-ignore
      ui.css.fontsheet.sheet.insertRule("@font-face {font-family: 'qh_zhunyuan';src: url('" + lib.qhly_path + "font/zhunyuan.woff2');}", 0);
      // @ts-ignore
      ui.css.fontsheet.sheet.insertRule("@font-face {font-family: 'qh_youyuan';src: url('" + lib.qhly_path + "font/youyuan.woff2');}", 0);
      // @ts-ignore
      ui.css.fontsheet.sheet.insertRule("@font-face {font-family: 'qh_songhei';src: url('" + lib.qhly_path + "font/songhei.woff2');}", 0);
      // @ts-ignore
      ui.css.fontsheet.sheet.insertRule("@font-face {font-family: 'qh_weili';src: url('" + lib.qhly_path + "font/weili.woff2');}", 0);
    } else {
      // @ts-ignore
      if(!ui.qhlycss)ui.qhlycss = lib.init.sheet();
      // @ts-ignore
      ui.qhlycss.sheet.insertRule("@font-face {font-family: 'qh_heiti';src: url('" + lib.qhly_path + "font/heiti.woff2');}", 0);
      // @ts-ignore
      ui.qhlycss.sheet.insertRule("@font-face {font-family: 'qh_zhunyuan';src: url('" + lib.qhly_path + "font/zhunyuan.woff2');}", 0);
      // @ts-ignore
      ui.qhlycss.sheet.insertRule("@font-face {font-family: 'qh_youyuan';src: url('" + lib.qhly_path + "font/youyuan.woff2');}", 0);
      // @ts-ignore
      ui.qhlycss.sheet.insertRule("@font-face {font-family: 'qh_songhei';src: url('" + lib.qhly_path + "font/songhei.woff2');}", 0);
      // @ts-ignore
      ui.qhlycss.sheet.insertRule("@font-face {font-family: 'qh_weili';src: url('" + lib.qhly_path + "font/weili.woff2');}", 0);
    }
    //关闭无名杀原有的换肤功能
    if (lib.config.change_skin) {
      game.saveConfig('change_skin', false);
      alert("请注意：本扩展功能将替代无名杀原生的换肤设置，为你带来更优秀的角色信息浏览体验。");
    }

    var originDiv = ui.create.div;
    ui.create.div = function () {
      try {
        return originDiv.apply(this, arguments);
      } catch (e) {
        console.log(e);
        if (QHLY_DEBUGMODE) {
          throw e;
        }
        return originDiv.apply(this, []);
      }
    };

    //将无名杀原有的换肤数据存档，并清空。
    if (lib.config.skin && lib.config.skin.qhly_config != 'yes') {
      game.saveConfig('qhly_save_offical_skin', lib.config.skin);
      game.saveConfig('skin', { 'qhly_config': 'yes' });
    }

    // @ts-ignore
    lib.qhly_lihui = {};

    if (game.getFileList && lib.config.qhly_lihuiSupport) {
      // @ts-ignore
      game.qhly_checkFileExist('extension/千幻聆音/lihui', function (s) {
        var earseExt = function (path) {
          if (!path) return null;
          var foundDot = path.lastIndexOf('.');
          if (foundDot < 0) return path;
          return path.slice(0, foundDot);
        };
        if (s) {
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          game.getFileList('extension/千幻聆音/lihui', function (folders, files) {
            if (files) {
              for (var file of files) {
                // @ts-ignore
                lib.qhly_lihui[earseExt(file)] = file;
              }
            }
          });
        }
      });
    }
    if (get.mode() == 'guozhan' && game.getFileList && lib.config.qhly_guozhan !== false) {
      var cpath = lib.config.qhly_originSkinPath == 'extension/千幻聆音/sanguolutouskin/' ? 'extension/千幻聆音/sanguolutouskin' : 'extension/千幻聆音/sanguoskin';
      // @ts-ignore
      game.qhly_checkFileExist(cpath, function (s) {
        if (s) {
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          game.getFileList(cpath, function (folders, files) {
            lib.config.qhly_gzskinList = [];
            if (folders && folders.length) {
              for (var n of folders) {
                if (n.indexOf('gz_') == 0) {
                  lib.config.qhly_gzskinList.add(n);
                }
              }
            }
            game.saveConfig('qhly_gzskinList', lib.config.qhly_gzskinList);
          });
        }
      });
      // @ts-ignore
      game.qhly_checkFileExist('extension/千幻聆音/sanguoaudio', function (s) {
        if (s) {
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          game.getFileList('extension/千幻聆音/sanguoaudio', function (folders, files) {
            lib.config.qhly_gzaudioList = [];
            if (folders && folders.length) {
              for (var n of folders) {
                if (n.indexOf('gz_') == 0) {
                  lib.config.qhly_gzaudioList.add(n);
                }
              }
            }
            game.saveConfig('qhly_gzaudioList', lib.config.qhly_gzaudioList);
          });
        }
      });
    }
    // @ts-ignore
    game.qhly_hasGuozhanSkin = function (name) {
      if (lib.config.qhly_gzskinList && lib.config.qhly_guozhan !== false) {
        return lib.config.qhly_gzskinList.includes(name);
      }
      return false;
    };
    // @ts-ignore
    game.qhly_chooseDialog = function(title,detail,initValue,list,onok,onclose){
      // @ts-ignore
      if (!_status.qhly_chooseDialogId) {
        // @ts-ignore
        _status.qhly_chooseDialogId = 0;
      }
      // @ts-ignore
      var id = _status.qhly_chooseDialogId;
      // @ts-ignore
      _status.qhly_chooseDialogId++;
      if(!list)list = [];
      var dialog = ui.create.div('.qh-editdialog');
      if (lib.config.qhly_currentViewSkin == 'decade') dialog.classList.add('decade')
      var content = ui.create.div('.qh-editdialog-inner', dialog);
      var below = ui.create.div('.qh-editdialog-below', dialog);
      var text = "<h2>" + title + "</h2>";
      if (detail) {
        text += "<p>" + detail + "</p>";
      }
      text += '<select id="qhly_choose_' + id + '" style="width:100%;height:30px;"></select><br><br>'
      var belowButton = "";
      // @ts-ignore
      belowButton += '<img src="' + lib.qhly_path + 'image/qhly_ok2.png" id="qhly_choose_okbutton' + id + '"/>&nbsp;&nbsp;&nbsp;&nbsp;';
      // @ts-ignore
      belowButton += '<img src="' + lib.qhly_path + 'image/qhly_cancel2.png" id="qhly_choose_cancelbutton' + id + '"/>';
      content.innerHTML = text;
      below.innerHTML = belowButton;
      document.body.appendChild(dialog);
      var img1 = document.getElementById('qhly_choose_okbutton' + id);
      var img2 = document.getElementById('qhly_choose_cancelbutton' + id);
      var input = document.getElementById('qhly_choose_' + id);
      for(var item of list){
        var obj = item;
        if(typeof obj == 'string'){
          obj = {name:obj,id:obj};
        }
        var opt = document.createElement('option');
        opt.innerHTML = obj.name + (obj.label?('['+obj.label+']'):"");
        opt.setAttribute('select_id', obj.id);
        if(initValue == obj.id){
          // @ts-ignore
          opt.selected = 'selected';
        }
        // @ts-ignore
        input.appendChild(opt);
      }
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      var choose = {};
      // @ts-ignore
      ui.qhly_addListenFunc(img1);
      // @ts-ignore
      ui.qhly_addListenFunc(img2);
      // @ts-ignore
      img1.listen(function () {
        if (onok) {
          // @ts-ignore
          var opt = input.options[input.selectedIndex];
          onok(opt.getAttribute('select_id'), dialog);
        }
      });
      // @ts-ignore
      img2.listen(function () {
        if (onclose) {
          if (onclose(dialog)) {
            dialog.delete();
          }
        } else {
          dialog.delete();
        }
      });
      // @ts-ignore
      input.focus();
      return dialog;
    }
    // @ts-ignore
    game.qhly_editDialog = function (title, detail, initValue, onok, onclose) {
      // @ts-ignore
      if (!_status.qhly_editDialogId) {
        // @ts-ignore
        _status.qhly_editDialogId = 0;
      }
      // @ts-ignore
      var id = _status.qhly_editDialogId;
      // @ts-ignore
      _status.qhly_editDialogId++;

      var dialog = ui.create.div('.qh-editdialog');
      if (lib.config.qhly_currentViewSkin == 'decade') dialog.classList.add('decade')
      var content = ui.create.div('.qh-editdialog-inner', dialog);
      var below = ui.create.div('.qh-editdialog-below', dialog);
      var text = "<h2>" + title + "</h2>";
      if (detail) {
        text += "<p>" + detail + "</p>";
      }
      text += '<textarea id="qhly_edit_text' + id + '" style="width:100%;height:80px;"></textarea><br><br>'
      var belowButton = "";
      // @ts-ignore
      belowButton += '<img src="' + lib.qhly_path + 'image/qhly_ok2.png" id="qhly_edit_okbutton' + id + '"/>&nbsp;&nbsp;&nbsp;&nbsp;';
      // @ts-ignore
      belowButton += '<img src="' + lib.qhly_path + 'image/qhly_cancel2.png" id="qhly_edit_cancelbutton' + id + '"/>';
      content.innerHTML = text;
      below.innerHTML = belowButton;
      document.body.appendChild(dialog);
      var img1 = document.getElementById('qhly_edit_okbutton' + id);
      var img2 = document.getElementById('qhly_edit_cancelbutton' + id);
      var input = document.getElementById('qhly_edit_text' + id);
      // @ts-ignore
      if (initValue) input.value = initValue;
      // @ts-ignore
      ui.qhly_addListenFunc(img1);
      // @ts-ignore
      ui.qhly_addListenFunc(img2);
      // @ts-ignore
      img1.listen(function () {
        if (onok) {
          // @ts-ignore
          onok(input.value, dialog);
        }
      });
      // @ts-ignore
      img2.listen(function () {
        if (onclose) {
          if (onclose(dialog)) {
            dialog.delete();
          }
        } else {
          dialog.delete();
        }
      });
      // @ts-ignore
      input.focus();
      return dialog;
    };
    // @ts-ignore
    game.qhly_hasGuozhanAudio = function (name) {
      if (lib.config.gzaudioList && lib.config.qhly_guozhan !== false) {
        return lib.config.qhly_gzaudioList.includes(name);
      }
      return false;
    };
    if (!lib.config.qhly_order) {
      game.saveConfig('qhly_order', {});
    }
    // @ts-ignore
    game.qhly_handleRect = function (rect) {
      // @ts-ignore
      if (game.qhly_hasExtension('十周年UI')) return rect;
      return {
        // @ts-ignore
        width: rect.width / game.documentZoom,
        // @ts-ignore
        height: rect.height / game.documentZoom,
        // @ts-ignore
        left: rect.left / game.documentZoom,
        // @ts-ignore
        top: rect.top / game.documentZoom,
        // @ts-ignore
        bottom: rect.bottom / game.documentZoom,
        // @ts-ignore
        right: rect.right / game.documentZoom,
      };
    };
    // @ts-ignore
    game.qhly_isForbidAI = function (name) {
      if (lib.config.forbidai && lib.config.forbidai.includes(name)) return true;
      if (lib.config.forbidai_user && lib.config.forbidai_user.includes(name)) return true;
      return false;
    };
    // @ts-ignore
    game.qhly_setForbidAI = function (name, forbid) {
      if (forbid !== false) {
        if (lib.config.forbidai) {
          lib.config.forbidai.add(name);
        } else {
          lib.config.forbidai = [name];
        }
        if (lib.config.forbidai_user) {
          lib.config.forbidai_user.add(name);
        } else {
          lib.config.forbidai_user = [name];
        }
      } else {
        if (lib.config.forbidai) {
          lib.config.forbidai.remove(name);
        } else {
          lib.config.forbidai = [];
        }
        if (lib.config.forbidai_user) {
          lib.config.forbidai_user.remove(name);
        } else {
          lib.config.forbidai_user = [];
        }
      }
      game.saveConfig('forbidai', lib.config.forbidai);
      game.saveConfig('forbidai_user', lib.config.forbidai_user);
    };
    // @ts-ignore
    game.qhly_getSkillSkin = function (name, skin, skill, pkg) {
      // @ts-ignore
      if (!pkg) pkg = game.qhly_foundPackage(name);
      if (!pkg) return null;
      if (!pkg.skillSkin) return null;
      if (typeof pkg.skillSkin != 'function') return null;
      var ret = pkg.skillSkin(name, skin, skill);
      if (!ret) return null;
      return ret;
    };
    // @ts-ignore
    game.qhly_getOrder = function (name, skin, pkg) {
      var ord = 0;
      if (lib.config.qhly_order[name + '-' + skin]) {
        ord = lib.config.qhly_order[name + '-' + skin];
      }
      if (ord !== 0) {
        // @ts-ignore
        ord = parseInt(ord);
        if (!isNaN(ord)) {
          return ord;
        }
      }
      // @ts-ignore
      if (!pkg) pkg = game.qhly_foundPackage(name);
      // @ts-ignore
      var info = game.qhly_getSkinInfo(name, skin, pkg);
      if (info && info.order) {
        return info.order;
      }
      // @ts-ignore
      ord = parseInt(game.qhly_earse_ext(skin));
      if (!isNaN(ord)) {
        return ord;
      }
      return 0;
    };
    // @ts-ignore
    game.qhly_setOrder = function (name, skin, order) {
      if (order === undefined) {
        delete lib.config.qhly_order[name + '-' + skin];
        game.saveConfig('qhly_order', lib.config.qhly_order);
        return;
      }
      lib.config.qhly_order[name + '-' + skin] = order;
      game.saveConfig('qhly_order', lib.config.qhly_order);
    };
    // @ts-ignore
    game.qhly_genId = function () {
      // @ts-ignore
      if (!_status.qhly_genId) {
        // @ts-ignore
        _status.qhly_genId = 1;
      } else {
        // @ts-ignore
        _status.qhly_genId++;
      }
      // @ts-ignore
      return _status.qhly_genId;
    };
    // @ts-ignore
    game.qhly_parseConfig = function (obj) {
      // @ts-ignore
      if (!_status.qhly_config_selfedit_id) {
        // @ts-ignore
        _status.qhly_config_selfedit_id = 1;
      } else {
        // @ts-ignore
        _status.qhly_config_selfedit_id++;
      }
      var str = "";
      var image = obj.image ? obj.image : "extension/千幻聆音/image/qhly_pic_config.png";
      var title = obj.title ? obj.title : "自定义设置";
      var text = obj.text ? obj.text : "";
      str += "<h2><img src='";
      str += lib.assetURL + image + "' style='width:50px'/>";
      str += title;
      str += "</h2>";
      if (text.length) {
        str += "<p>" + text + "</p>";
      }
      var onfinish = function () {

      };
      if (['checkboxList', '复选框'].includes(obj.type)) {
        var items = obj.items ? obj.items : [];
        var oncheck = obj.oncheck ? obj.oncheck : function () { };
        var checkboxRef = {};
        for (var item of items) {
          // @ts-ignore
          var id = "qhly_selfedit_checkbox_" + game.qhly_genId();
          checkboxRef[id] = item;
          str += "<p><span style='display:inline-block;height:30px;'><img id='" + id + "'/><span id='" + id + "_text' style='display:inline-block;position:relative;bottom:25%;'>";
          if (typeof item == 'string') {
            str += item;
          } else {
            str += item.name;
          }
          str += "</span></span></p>";
        }
        var bindFunc = function (checkbox, text) {
          if (!text) return;
          // @ts-ignore
          ui.qhly_addListenFunc(text);
          text.listen(function () {
            // @ts-ignore
            game.qhly_playQhlyAudio('qhly_voc_check', null, true);
            checkbox.qhly_setChecked(!checkbox.qhly_checked, true);
          });
        };
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        onfinish = function (view) {
          for (var id in checkboxRef) {
            var item = checkboxRef[id];
            var current = item.current;
            if (typeof current == 'function') {
              current = current();
            }
            var checkbox = document.getElementById(id);
            var checkboxText = document.getElementById(id + "_text");
            // @ts-ignore
            ui.qhly_initCheckBox(checkbox, current ? true : false);
            bindFunc(checkbox, checkboxText);
            (function (checkbox, item) {
              // @ts-ignore
              checkbox.qhly_onchecked = function (check) {
                oncheck(item, check);
              };
            })(checkbox, item);
          }
        };
      } else if (['selectList', '下拉列表'].includes(obj.type)) {
        // @ts-ignore
        var id = "qhly_selfedit_select_" + game.qhly_genId();
        str += "<p><select style='font-size:22px;font-family:'qh_youyuan';' id='" + id + "'></select></p>";
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        onfinish = function (view) {
          var select = document.getElementById(id);
          var items = obj.items ? obj.items : {};
          var current = typeof obj.current == 'function' ? obj.current() : obj.current;
          for (var key in items) {
            var opt = document.createElement('option');
            opt.innerHTML = items[key];
            opt.setAttribute('key', key);
            if (current == key) {
              // @ts-ignore
              opt.selected = 'selected';
            }
            // @ts-ignore
            select.appendChild(opt);
          }
          // @ts-ignore
          select.onchange = function (e) {
            var event = e ? e : window.event;
            // @ts-ignore
            if (event.target) {
              // @ts-ignore
              target = event.target;
              // @ts-ignore
              var opt = target[target.selectedIndex];
              if (opt) {
                var key = opt.getAttribute('key');
                if (obj.onchange) {
                  obj.onchange(key);
                }
              }
            }
          };
        };
      }
      return {
        content: str,
        onfinish: onfinish,
      };
    };
    //默认皮肤包
    // @ts-ignore
    window.DEFAULT_PACKAGE = {
      isExt: false,//不是扩展武将
      fromExt: false,
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      filterCharacter: function (name) {
        return true;//对所有角色生效
      },
      skininfo: function (name, skinname) {
        // @ts-ignore
        if (lib.qhly_sanguoskininfo) {
          // @ts-ignore
          return lib.qhly_sanguoskininfo[name + '-' + skinname];
        }
        return null;
      },
      characterTaici: function (name) {
        // @ts-ignore
        if (lib.qhly_sanguotaici) {
          // @ts-ignore
          return lib.qhly_sanguotaici[name];
        }
        return null;
      },
      characterLihui: function (name, skin) {
        if (!lib.config.qhly_lihuiSupport) return null;
        // @ts-ignore
        skin = game.qhly_earse_ext(skin);
        if (skin) {
          // @ts-ignore
          if (lib.qhly_lihui[name + '-' + skin]) {
            // @ts-ignore
            return 'extension/千幻聆音/lihui/' + lib.qhly_lihui[name + '-' + skin];
          }
          if (!lib.config.qhly_nolihuiOrigin) return null;
        }
        // @ts-ignore
        if (lib.qhly_lihui[name]) {
          // @ts-ignore
          return 'extension/千幻聆音/lihui/' + lib.qhly_lihui[name];
        }
        return null;
      },
      prefix: 'image/character/',//武将原图在image/character内
      skin: {
        standard: (lib.config.qhly_originSkinPath ? lib.config.qhly_originSkinPath : 'extension/千幻聆音/sanguoskin/'),//皮肤图片在千幻聆音扩展内的位置。
        origin: 'extension/千幻聆音/sanguoyuanhua/',//皮肤原画在千幻聆音扩展内的位置。
      },
      //ssborder: 'shousha/',//手杀边框
      audioOrigin: '',
      audio: 'extension/千幻聆音/sanguoaudio/',//皮肤配音文件在千幻聆音扩展内的位置。
    };

    //初始化一个皮肤包的数组，后面会经常扫描这个数组以找到武将的皮肤。
    // @ts-ignore
    if (!lib.qhlypkg) {
      // @ts-ignore
      lib.qhlypkg = [];
    }

    // @ts-ignore
    if (!lib.qhlyMusic) {
      // @ts-ignore
      lib.qhlyMusic = {};
    }

    // @ts-ignore
    if (!lib.qhlyPlugins) {
      // @ts-ignore
      lib.qhlyPlugins = [];
    }
    var systemMusics = {
      'music_default': '默认',
      'music_danji': '千里走单骑',
      'music_jifeng': '祭风',
      'music_jilve': '极略',
      'music_phliosophy': 'Phliosophy Of Ours',
      'music_shezhan': '舌战群儒',
      'music_diaochan': '貂蝉',
      'aozhan_chaoming': '潮鸣',
      'aozhan_online': 'Online鏖战',
      'aozhan_rewrite': 'Rewrite',
    };

    for (var k in systemMusics) {
      // @ts-ignore
      lib.qhlyMusic['audio/background/' + k + '.mp3'] = {
        name: systemMusics[k],
        path: 'audio/background/' + k + '.mp3',
      };
    }

    // @ts-ignore
    if (!lib.qhlyDefaultMusic) {
      // @ts-ignore
      lib.qhlyDefaultMusic = {};
    }

    if (!lib.config.qhly_characterMusic) {
      lib.config.qhly_characterMusic = {};
    }

    // @ts-ignore
    if (!lib.qhly_characterMusicMapper) {
      // @ts-ignore
      lib.qhly_characterMusicMapper = [];
    }

    // @ts-ignore
    lib.qhly_characterMusicMapper.push(function (name) {
      if (get.character(name, 1) == 'key') {
        return 'audio/background/aozhan_chaoming.mp3';
      }
    });
    // @ts-ignore
    game.qhly_getCharacterPackage = function (name) {
      for (var i in lib.characterPack) {
        if (lib.characterPack[i] && lib.characterPack[i][name]) {
          return i;
        }
      }
      return null;
    };

    // @ts-ignore
    game.qhly_getCharacterMusic = function (name) {
      var ret = lib.config.qhly_characterMusic[name];
      if (ret) return ret;
      // @ts-ignore
      ret = lib.qhlyDefaultMusic[name];
      var priority = -Infinity;
      // @ts-ignore
      for (var func of lib.qhly_characterMusicMapper) {
        var rf = func(name);
        if (!rf) continue;
        if (typeof rf == 'string') {
          var p = rf;
          rf = {
            path: p,
            priority: 1,
          };
        }
        if (!rf.priority) {
          rf.priority = 1;
        }
        if (rf.priority > priority) {
          priority = rf.priority;
          ret = rf.path;
        }
      }
      return ret;
    };

    // @ts-ignore
    game.qhly_getCurrentMusic = function () {
      var ret = null;
      if (lib.config['qhly_modemusicconfig_' + get.mode()] && lib.config['qhly_modemusicconfig_' + get.mode()] != 'system') {
        ret = lib.config['qhly_modemusicconfig_' + get.mode()];
      }
      if (lib.config.qhly_enableCharacterMusic) {
        if (game.me) {
          var m = null;
          if (game.me.name && game.me.name.indexOf('unknown') != 0) {
            // @ts-ignore
            m = game.qhly_getCharacterMusic(game.me.name);
          } else if (game.me.name1) {
            // @ts-ignore
            m = game.qhly_getCharacterMusic(game.me.name1);
          }
          if (m) {
            ret = m;
          }
        }
      }
      if (!ret) {
        ret = lib.config.qhly_currentMusic;
      }
      if (ret && ret != 'system' && ret != 'random') {
        return ret;
      }
      if (ret == 'random') {
        // @ts-ignore
        return Object.keys(lib.qhlyMusic).randomGet();
      }
      return 'audio/background/music_default.mp3';
    };

    if (lib.config.qhly_enableCharacterMusic || lib.config.qhly_currentMusic != 'system') {
      game.playBackgroundMusic = function () {
        // @ts-ignore
        if (!ui.qhly_backgroundMusic) {
          // @ts-ignore
          ui.qhly_backgroundMusic = document.createElement('audio');
          if (ui.backgroundMusic) {
            ui.backgroundMusic.remove();
          }
          // @ts-ignore
          ui.backgroundMusic = ui.qhly_backgroundMusic;
          ui.backgroundMusic.volume = lib.config.volumn_background / 8;
          ui.backgroundMusic.autoplay = true;
          ui.backgroundMusic.addEventListener('ended', game.playBackgroundMusic);
        }
        // @ts-ignore
        if (_status.qhly_tempBgm) {
          // @ts-ignore
          ui.backgroundMusic.src = lib.assetURL + _status.qhly_tempBgm;
        } else {
          // @ts-ignore
          ui.backgroundMusic.src = lib.assetURL + game.qhly_getCurrentMusic();
        }
        //alert(ui.backgroundMusic.src);
      };
    }

    // @ts-ignore
    get.qhly_urldecode = function (zipStr) {
      var uzipStr = '';
      for (var i = 0; i < zipStr.length; i += 1) {
        var chr = zipStr.charAt(i);
        if (chr === '+') {
          uzipStr += ' ';
        } else if (chr === '%') {
          var asc = zipStr.substring(i + 1, i + 3);
          if (parseInt('0x' + asc) > 0x7f) {
            uzipStr += decodeURI('%' + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
            i += 8;
          } else {
            uzipStr += String.fromCharCode(parseInt('0x' + asc));
            i += 2;
          }
        } else {
          uzipStr += chr;
        }
      }
      return uzipStr;
    };

    // @ts-ignore
    game.qhly_switchBgm = function (path, replay) {
      if (path) {
        // @ts-ignore
        _status.qhly_tempBgm = path;
      } else {
        // @ts-ignore
        delete _status.qhly_tempBgm;
        // @ts-ignore
        path = game.qhly_getCurrentMusic();
      }
      // @ts-ignore
      if (!replay && ui.backgroundMusic.src && get.qhly_urldecode(ui.backgroundMusic.src).endsWith(path)) {
        return;
      }
      game.playBackgroundMusic();
    };
    lib.translate.victory = '胜利';
    lib.skill._qhly_bgm = {
      popup: false,
      forced: true,
      lastDo: true,
      trigger: {
        global: 'gameStart',
      },
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      filter: function (event, player) {
        // @ts-ignore
        if (event.qhly_bgmflag) return false;
        return lib.config.qhly_enableCharacterMusic;
      },
      content: function () {
        // @ts-ignore
        trigger.qhly_bgmflag = true;
        game.playBackgroundMusic();
      }
    };

    // @ts-ignore
    if (!lib.qhly_groupimage) {
      // @ts-ignore
      lib.qhly_groupimage = {};
    }
    // @ts-ignore
    lib.qhly_groupimage['wei'] = 'extension/千幻聆音/image/name_wei.webp';
    // @ts-ignore
    lib.qhly_groupimage['shu'] = 'extension/千幻聆音/image/name_shu.webp';
    // @ts-ignore
    lib.qhly_groupimage['wu'] = 'extension/千幻聆音/image/name_wu.webp';
    // @ts-ignore
    lib.qhly_groupimage['qun'] = 'extension/千幻聆音/image/name_qun.webp';
    // @ts-ignore
    lib.qhly_groupimage['jin'] = 'extension/千幻聆音/image/name_jin.webp';
    // @ts-ignore
    lib.qhly_groupimage['shen'] = 'extension/千幻聆音/image/name_shen.webp';
    // @ts-ignore
    lib.qhly_groupimage['daqin'] = 'extension/千幻聆音/image/name_daqin.webp';
    // @ts-ignore
    lib.qhly_groupimage['key'] = 'extension/千幻聆音/image/name_key.webp';

    // @ts-ignore
    if (!lib.qhly_groupcolor) {
      // @ts-ignore
      lib.qhly_groupcolor = {};
    }
    // @ts-ignore
    lib.qhly_groupcolor['wei'] = "#0000CD";
    // @ts-ignore
    lib.qhly_groupcolor['shu'] = "#B22222";
    // @ts-ignore
    lib.qhly_groupcolor['wu'] = "#32CD32";
    // @ts-ignore
    lib.qhly_groupcolor['qun'] = "#B5B5B5";
    // @ts-ignore
    lib.qhly_groupcolor['jin'] = "#68228B";
    // @ts-ignore
    lib.qhly_groupcolor['shen'] = "#FFFF00";
    // @ts-ignore
    lib.qhly_groupcolor['daqin'] = "#FFD700";
    // @ts-ignore
    lib.qhly_groupcolor['key'] = "#9400D3";


    if (!lib.config.qhly_currentViewSkin) {
      lib.config.qhly_currentViewSkin = 'xuanwujianghu';
      game.saveConfig('qhly_currentViewSkin', lib.config.qhly_currentViewSkin);
    }



    // @ts-ignore
    get.qhly_getIf = function (originValue, fallback) {
      if (originValue) return originValue;
      return fallback;
    };

    // @ts-ignore
    game.qhly_changeViewSkin = function (view) {
      // @ts-ignore
      var skin = lib.qhly_viewskin[lib.config.qhly_currentViewSkin];
      if (skin) {
        skin.changeViewSkin(view);
      }
    };

    // @ts-ignore
    game.qhly_changeViewPageSkin = function (page, view) {
      // @ts-ignore
      var skin = lib.qhly_viewskin[lib.config.qhly_currentViewSkin];
      if (skin) {
        skin.skinPage(page, view);
      }
    }


    // @ts-ignore
    get.qhly_viewSkinSet = function () {
      var ret = {};
      // @ts-ignore
      for (var k in lib.qhly_viewskin) {
        // @ts-ignore
        if (lib.qhly_viewskin[k].name) {
          // @ts-ignore
          ret[k] = lib.qhly_viewskin[k].name;
        } else {
          ret[k] = k;
        }
      }
      return ret;
    };
    // @ts-ignore
    game.qhly_bigEdit = function (state, bg) {
      // @ts-ignore
      _status.bigEditing = true;
      // @ts-ignore
      const editObject = get.itemtype(state) == 'player' ? 'player' : 'bigAvatar';
      // @ts-ignore
      var name = game.qhly_getRealName(state.name);
      // taffy: 注释content.js原版代码喵
      // const themeType = ui.arena.dataset.newDecadeStyle == 'on' ? 'decade' : 'shousha';
      /* taffy分界线 */
      // taffy: 适配一将成名UI
      const themeType = ui.arena.dataset.decadeLayout == 'on' ? 'decade' : 'shousha';
      /* taffy分界线 */
      const theme = editObject == 'player' ? themeType : lib.config.qhly_currentViewSkin;
      // @ts-ignore
      var skin = game.qhly_getSkin(state.name);
      if (skin == null) {
        name = state.name;
        skin = '经典形象.jpg';
      }
      var editDynamic = true;//编辑动态还是静态
      var editMode = "daiji";//调整人物、背景还是出框
      // @ts-ignore
      _status.qhly_editMode = editMode;
      // @ts-ignore
      _status.qhly_disAble = true;//初始手势可调整距离，不可调整角度
      // @ts-ignore
      _status.qhly_rotaAble = false;
      var gestureS, gestureA;
      var focus = editObject == 'player' ? state : state.mainView.avatarImage;
      // @ts-ignore
      if (editObject != 'player') focus.style.setProperty('--w', (1 / game.documentZoom) + 'vw');//适配屏幕缩放
      var originPostion = focus.style.getPropertyValue('--p');
      var blackbg = ui.create.div('.qhly_blackbg', bg || document.body);
      blackbg.setAttribute('theme', themeType);
      var touchTimer = null;
      var tempPosition = originPostion;
      var temp = {
        daiji: {},
        beijing: {},
        chukuang: {},
      };
      if (!focus.dynamic || focus.dynamic && focus.dynamic.primary == null) editDynamic = false;
      if (editDynamic) {
        var editArgument1 = 'dynamic', editArgument2 = 'beijing';
        // @ts-ignore
        if (game.qhly_getPlayerStatus(focus, null, name) == 2) {
          editArgument1 = 'dynamic2';
          editArgument2 = 'beijing2';
        }
        // @ts-ignore
        var pp = game.qhly_getCoordinate(focus, true);
        var canvas = focus.getElementsByClassName("animation-player")[0];
        temp.qhly_resizeRatio = focus.dynamic.primary.qhly_resizeRatio || 1;
        temp.daiji.x = focus.dynamic.primary.x;
        if (Array.isArray(temp.daiji.x)) temp.daiji.x[0] = 0;
        temp.daiji.y = focus.dynamic.primary.y;
        if (Array.isArray(temp.daiji.y)) temp.daiji.y[0] = 0;
        temp.daiji.scale = focus.dynamic.primary.scale || 1;
        temp.daiji.angle = focus.dynamic.primary.angle || 0;
        var dynamicX = [...temp.daiji.x], dynamicY = [...temp.daiji.y], dynamicS = temp.daiji.scale, dynamicA = temp.daiji.angle;
        if (focus.dynamic.primary.beijing) {
          temp.beijing.x = focus.dynamic.primary.beijing.x || [0, 0.5];
          if (Array.isArray(temp.beijing.x)) temp.beijing.x[0] = 0;
          temp.beijing.y = focus.dynamic.primary.beijing.y || [0, 0.5];
          if (Array.isArray(temp.beijing.y)) temp.beijing.y[0] = 0;
          temp.beijing.scale = focus.dynamic.primary.beijing.scale || 1;
          temp.beijing.angle = focus.dynamic.primary.beijing.angle || 0;
          var beijingX = [...temp.beijing.x], beijingY = [...temp.beijing.y], beijingS = temp.beijing.scale, beijingA = temp.beijing.angle;
        }
        else if (focus.dynamic.primary.dybg) {
          temp.beijing.x = focus.dynamic.primary.dybg.x || [0, 0.5];
          if (Array.isArray(temp.beijing.x)) temp.beijing.x[0] = 0;
          temp.beijing.y = focus.dynamic.primary.dybg.y || [0, 0.5];
          if (Array.isArray(temp.beijing.y)) temp.beijing.y[0] = 0;
          temp.beijing.scale = focus.dynamic.primary.dybg.scale || 1;
          temp.beijing.angle = focus.dynamic.primary.dybg.angle || 0;
          var beijingX = [...temp.beijing.x], beijingY = [...temp.beijing.y], beijingS = temp.beijing.scale, beijingA = temp.beijing.angle;
        }
        if (focus.dynamic.primary.gongji) {
          temp.chukuang.x = focus.dynamic.primary.gongji.x || [0, 0.5];
          temp.chukuang.y = focus.dynamic.primary.gongji.y || [0, 0.5];
          temp.chukuang.scale = focus.dynamic.primary.gongji.scale || 1;
          temp.chukuang.angle = focus.dynamic.primary.gongji.angle || 0;
          var chukuangX = [...temp.chukuang.x], chukuangY = [...temp.chukuang.y], chukuangS = temp.chukuang.scale, chukuangA = temp.chukuang.angle;
        }
      }
      const parent = focus.parentNode;
      const subling = focus.nextSibling;
      if (!bg) {
        blackbg.appendChild(focus);
      } else state.mainView.nopoints.style.pointerEvents = 'none';
      var buttonbar = ui.create.div('.qhly_bigeditbar', blackbg);
      var buttons = new Array(8);
      function enlarge() {
        temp[editMode].scale += 0.01;
        // @ts-ignore
        game.qhly_postMessage(focus, {
          message: 'RESIZE',
          id: focus.dynamic.id,
          scale: temp[editMode].scale,
          player: pp,
          zhu: true,
          dybg: editMode == 'beijing' ? true : undefined,
        }, editMode)
      }
      function shrink() {
        temp[editMode].scale -= 0.01;
        // @ts-ignore
        game.qhly_postMessage(focus, {
          message: 'RESIZE',
          id: focus.dynamic.id,
          scale: temp[editMode].scale,
          player: pp,
          zhu: true,
          dybg: editMode == 'beijing' ? true : undefined,
        }, editMode)
      }
      function clockwise() {
        temp[editMode].angle--;
        // @ts-ignore
        game.qhly_postMessage(focus, {
          message: 'RESIZE',
          id: focus.dynamic.id,
          angle: temp[editMode].angle,
          player: pp,
          zhu: true,
          dybg: editMode == 'beijing' ? true : undefined,
        }, editMode)
      }
      function anticlockwise() {
        temp[editMode].angle++;
        // @ts-ignore
        game.qhly_postMessage(focus, {
          message: 'RESIZE',
          id: focus.dynamic.id,
          angle: temp[editMode].angle,
          player: pp,
          zhu: true,
          dybg: editMode == 'beijing' ? true : undefined,
        }, editMode)
      }
      for (var i = 0; i < 8; i++) {
        buttons[i] = ui.create.div('.qhly_bigeditbutton' + i, buttonbar);
        buttons[i].id = 'qhly_bigedit' + i;
        if (!editDynamic && i < 6 || i == 5 && editObject == 'player') buttons[i].classList.add('forbid');
        buttons[i].addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
          if (this.classList.contains('forbid')) return;
          // @ts-ignore
          game.qhly_playQhlyAudio('qhly_voc_click3', null, true);
          var currentType = null;
          switch (this.id) {
            case 'qhly_bigedit0': {
              enlarge();
              currentType = enlarge;
              break;
            }
            case 'qhly_bigedit1': {
              shrink();
              currentType = shrink;
              break;
            }
            case 'qhly_bigedit2': {
              clockwise();
              currentType = clockwise;
              break;
            }
            case 'qhly_bigedit3': {
              anticlockwise();
              currentType = anticlockwise;
              break;
            }
            case 'qhly_bigedit4': {
              if (!focus.dynamic.primary.beijing && !focus.dynamic.primary.dynamicBackground) {
                alert('无可调节的动态背景');
                return;
              }
              if (this.classList.contains('sel')) {
                this.classList.remove('sel');
                editMode = "daiji";
              }
              else {
                this.classList.add('sel');
                editMode = "beijing";
              }
              // @ts-ignore
              if (game.qhly_hasExtension('皮肤切换')) skinSwitch.postMsgApi.debug(focus, editMode);
              // @ts-ignore
              if (game.qhly_hasExtension('EpicFX') && lib.config['extension_EpicFX_skinEffects']) {
                // @ts-ignore
                game.qhly_postMessage(focus, {
                  message: 'RESIZE',
                  id: focus.dynamic.id,
                  opacity: editMode == 'daiji' ? 1 : 0,
                  player: pp,
                  zhu: true,
                  dybg: undefined,
                }, editMode);
                // @ts-ignore
                game.qhly_postMessage(focus, {
                  message: 'RESIZE',
                  id: focus.dynamic.id,
                  speed: editMode == 'daiji' ? 0 : 1,
                  player: pp,
                  zhu: true,
                  dybg: true,
                }, editMode);
              }
              // @ts-ignore
              _status.qhly_editMode = editMode;
              break;
            }
            case 'qhly_bigedit5': {
              if (!focus.dynamic.primary.gongji) {
                alert('无可调节的出框');
                return;
              }
              var btn = document.getElementById('qhly_bigedit4');
              if (this.classList.contains('sel')) {
                this.classList.remove('sel');
                if (btn) btn.classList.remove('forbid');
                // @ts-ignore
                editMode = _status.qhly_editMode;
                if (canvas) canvas.style.position = 'absolute';
              }
              else {
                this.classList.add('sel');
                if (btn) btn.classList.add('forbid');
                // @ts-ignore
                _status.qhly_editMode = editMode;
                editMode = "chukuang";
                if (canvas) canvas.style.position = "fixed";
              }
              // @ts-ignore
              if (game.qhly_hasExtension('皮肤切换')) skinSwitch.postMsgApi.debug(focus, editMode);
              break;
            }
            case 'qhly_bigedit6': {
              if (editDynamic) {
                if (canvas) canvas.style.position = 'absolute';
                // @ts-ignore
                if (!lib.qhly_skinEdit[name]) lib.qhly_skinEdit[name] = {};
                // @ts-ignore
                if (!lib.qhly_skinEdit[name][skin]) lib.qhly_skinEdit[name][skin] = {};
                // @ts-ignore
                if (!lib.qhly_skinEdit[name][skin][editObject]) lib.qhly_skinEdit[name][skin][editObject] = {};
                // @ts-ignore
                if (!lib.qhly_skinEdit[name][skin][editObject][editArgument1]) lib.qhly_skinEdit[name][skin][editObject][editArgument1] = {};
                // @ts-ignore
                if (!lib.qhly_skinEdit[name][skin][editObject][editArgument1][theme]) lib.qhly_skinEdit[name][skin][editObject][editArgument1][theme] = {};
                // @ts-ignore
                lib.qhly_skinEdit[name][skin][editObject][editArgument1][theme].x = temp.daiji.x;
                // @ts-ignore
                lib.qhly_skinEdit[name][skin][editObject][editArgument1][theme].y = temp.daiji.y;
                // @ts-ignore
                lib.qhly_skinEdit[name][skin][editObject][editArgument1][theme].scale = temp.daiji.scale / temp.qhly_resizeRatio;
                // @ts-ignore
                lib.qhly_skinEdit[name][skin][editObject][editArgument1][theme].angle = temp.daiji.angle;
                focus.dynamic.primary.scale = temp.daiji.scale;
                focus.dynamic.primary.angle = temp.daiji.angle;
                if (focus.dynamic.primary.beijing || focus.dynamic.primary.dybg) {
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin][editObject][editArgument2]) lib.qhly_skinEdit[name][skin][editObject][editArgument2] = {};
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin][editObject][editArgument2][theme]) lib.qhly_skinEdit[name][skin][editObject][editArgument2][theme] = {};
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin][editObject][editArgument2][theme].x = temp.beijing.x;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin][editObject][editArgument2][theme].y = temp.beijing.y;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin][editObject][editArgument2][theme].scale = temp.beijing.scale / temp.qhly_resizeRatio;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin][editObject][editArgument2][theme].angle = temp.beijing.angle;
                  if (focus.dynamic.primary.dybg) {
                    focus.dynamic.primary.dybg.scale = temp.beijing.scale;
                    focus.dynamic.primary.dybg.angle = temp.beijing.angle;
                  } else {
                    focus.dynamic.primary.beijing.scale = temp.beijing.scale;
                    focus.dynamic.primary.beijing.angle = temp.beijing.angle;
                  }
                }
                if (focus.dynamic.primary.gongji && editObject != 'player') {
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin].bigAvatar) lib.qhly_skinEdit[name][skin].bigAvatar = {};
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin].bigAvatar.chukuang) lib.qhly_skinEdit[name][skin].bigAvatar.chukuang = {};
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme]) lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme] = {};
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme].x = temp.chukuang.x;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme].y = temp.chukuang.y;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme].scale = temp.chukuang.scale;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme].angle = temp.chukuang.angle;
                  focus.dynamic.primary.gongji.scale = temp.chukuang.scale;
                  focus.dynamic.primary.gongji.angle = temp.chukuang.angle;
                }
                // @ts-ignore
                if (game.qhly_hasExtension('皮肤切换')) skinSwitch.postMsgApi.debug(focus, 'daiji');
                // @ts-ignore
                if (game.qhly_hasExtension('EpicFX') && lib.config['extension_EpicFX_skinEffects']) {
                  // @ts-ignore
                  game.qhly_postMessage(focus, {
                    message: 'RESIZE',
                    id: focus.dynamic.id,
                    opacity: 1,
                    player: pp,
                    zhu: true,
                    dybg: undefined,
                  }, 'daiji');
                  // @ts-ignore
                  game.qhly_postMessage(focus, {
                    message: 'RESIZE',
                    id: focus.dynamic.id,
                    speed: 0,
                    player: pp,
                    zhu: true,
                    dybg: true,
                  }, 'beijing');
                }
              } else {
                originPostion = tempPosition;
                var editArgument = theme;
                // @ts-ignore
                if (game.qhly_getPlayerStatus(focus, null, name) == 2) {
                  editArgument = theme + '2';
                }
                if (originPostion) {
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name]) lib.qhly_skinEdit[name] = {};
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin]) lib.qhly_skinEdit[name][skin] = {}
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin][editArgument] = originPostion;
                }
              }
              // @ts-ignore
              var strobj = JSON.stringify(lib.qhly_skinEdit, null, 4);
              // @ts-ignore
              game.qhly_readFileAsText("extension/千幻聆音/data/skineditmodel.txt", function (ret, str) {
                if (ret) {
                  str = str.replace("_REPLACE_OBJECT_", strobj);
                  // @ts-ignore
                  game.qhly_writeTextFile(str, "extension/千幻聆音", "skinEdit.js", function (err) {
                    if (!err) {
                      console.log("保存成功");
                    } else {
                      console.log("保存失败：" + JSON.stringify(err));
                    }
                  });
                } else {
                  console.log("保存失败：无法读取模板。");
                }
              });
              exit();
              break;
            }
            case 'qhly_bigedit7': {
              if (editDynamic) {
                if (canvas) canvas.style.position = 'absolute';
                // @ts-ignore
                game.qhly_postMessage(focus, {
                  message: 'RESIZE',
                  id: focus.dynamic.id,
                  x: dynamicX,
                  y: dynamicY,
                  scale: dynamicS,
                  angle: dynamicA,
                  player: pp,
                  zhu: true,
                  dybg: undefined,
                }, 'daiji', true);
                // @ts-ignore
                if (!lib.qhly_skinEdit[name]) lib.qhly_skinEdit[name] = {};
                // @ts-ignore
                if (!lib.qhly_skinEdit[name][skin]) lib.qhly_skinEdit[name][skin] = {};
                // @ts-ignore
                if (!lib.qhly_skinEdit[name][skin][editObject]) lib.qhly_skinEdit[name][skin][editObject] = {};
                // @ts-ignore
                if (!lib.qhly_skinEdit[name][skin][editObject].dynamic) lib.qhly_skinEdit[name][skin][editObject].dynamic = {};
                // @ts-ignore
                if (!lib.qhly_skinEdit[name][skin][editObject].dynamic[theme]) lib.qhly_skinEdit[name][skin][editObject].dynamic[theme] = {};
                // @ts-ignore
                lib.qhly_skinEdit[name][skin][editObject].dynamic[theme].x = dynamicX;
                // @ts-ignore
                lib.qhly_skinEdit[name][skin][editObject].dynamic[theme].y = dynamicY;
                // @ts-ignore
                lib.qhly_skinEdit[name][skin][editObject].dynamic[theme].scale = dynamicS / focus.offsetHeight / (1 / game.me.offsetHeight);
                // @ts-ignore
                lib.qhly_skinEdit[name][skin][editObject].dynamic[theme].angle = dynamicA;
                focus.dynamic.primary.x = dynamicX;
                focus.dynamic.primary.y = dynamicY;
                if (focus.dynamic.primary.beijing || focus.dynamic.primary.dybg) {
                  // @ts-ignore
                  game.qhly_postMessage(focus, {
                    message: 'RESIZE',
                    id: focus.dynamic.id,
                    x: beijingX,
                    y: beijingY,
                    scale: beijingS,
                    angle: beijingA,
                    player: pp,
                    zhu: true,
                    dybg: true,
                  }, 'beijing', true);
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin][editObject].beijing) lib.qhly_skinEdit[name][skin][editObject].beijing = {};
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin][editObject].beijing[theme]) lib.qhly_skinEdit[name][skin][editObject].beijing[theme] = {};
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin][editObject].beijing[theme].x = beijingX;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin][editObject].beijing[theme].y = beijingY;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin][editObject].beijing[theme].scale = beijingS / focus.offsetHeight / (1 / game.me.offsetHeight);
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin][editObject].beijing[theme].angle = beijingA;
                  if (focus.dynamic.primary.dybg) {
                    focus.dynamic.primary.dybg.x = beijingX;
                    focus.dynamic.primary.dybg.y = beijingY;
                  } else {
                    focus.dynamic.primary.beijing.x = beijingX;
                    focus.dynamic.primary.beijing.y = beijingY;
                  }

                }
                if (focus.dynamic.primary.gongji) {
                  // @ts-ignore
                  game.qhly_postMessage(focus, {
                    message: 'RESIZE',
                    id: focus.dynamic.id,
                    x: chukuangX,
                    y: chukuangY,
                    scale: chukuangS,
                    angle: chukuangA,
                    player: pp,
                    zhu: true,
                    dybg: editMode == 'beijing' ? true : undefined,
                  }, 'chukuang', true);
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin].bigAvatar) lib.qhly_skinEdit[name][skin].bigAvatar = {};
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin].bigAvatar.chukuang) lib.qhly_skinEdit[name][skin].bigAvatar.chukuang = {};
                  // @ts-ignore
                  if (!lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme]) lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme] = {};
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme].x = chukuangX;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme].y = chukuangY;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme].scale = chukuangS;
                  // @ts-ignore
                  lib.qhly_skinEdit[name][skin].bigAvatar.chukuang[theme].angle = chukuangA;
                  focus.dynamic.primary.gongji.x = chukuangX;
                  focus.dynamic.primary.gongji.y = chukuangY;
                }
                // @ts-ignore
                if (game.qhly_hasExtension('皮肤切换')) skinSwitch.postMsgApi.debug(focus, 'daiji');
                // @ts-ignore
                if (game.qhly_hasExtension('EpicFX') && lib.config['extension_EpicFX_skinEffects']) {
                  // @ts-ignore
                  game.qhly_postMessage(focus, {
                    message: 'RESIZE',
                    id: focus.dynamic.id,
                    opacity: 1,
                    player: pp,
                    zhu: true,
                    dybg: undefined,
                  }, 'daiji');
                  // @ts-ignore
                  game.qhly_postMessage(focus, {
                    message: 'RESIZE',
                    id: focus.dynamic.id,
                    speed: 0,
                    player: pp,
                    zhu: true,
                    dybg: true,
                  }, 'beijing');
                }
              } else {
                focus.style.setProperty('--p', originPostion);
              }
              exit();
            }
          }
          if (typeof currentType == 'function') touchTimer = setInterval(currentType, 50);
        })
        buttons[i].addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          clearInterval(touchTimer);
        })
        buttons[i].addEventListener(lib.config.touchscreen ? 'touchcancel' : 'mouseleave', function () {
          clearInterval(touchTimer);
        })
      }
      if (lib.config.touchscreen && editDynamic) {
        var distanceBtn = ui.create.div('.qh-distancebtn', blackbg);
        var rotateBtn = ui.create.div('.qh-rotatebtn', blackbg);
        rotateBtn.classList.add('lock');
        distanceBtn.listen(function () {
          if (this.classList.contains('lock')) {
            this.classList.remove('lock');
            // @ts-ignore
            game.qhly_playQhlyAudio('unlocked', null, true);
            // @ts-ignore
            _status.qhly_disAble = true;
          } else {
            if (rotateBtn.classList.contains('lock')) return;
            // @ts-ignore
            game.qhly_playQhlyAudio('locked', null, true);
            this.classList.add('lock');
            // @ts-ignore
            _status.qhly_disAble = false;
          }
        });
        rotateBtn.listen(function () {
          if (this.classList.contains('lock')) {
            this.classList.remove('lock');
            // @ts-ignore
            game.qhly_playQhlyAudio('unlocked', null, true);
            // @ts-ignore
            _status.qhly_rotaAble = true;
          } else {
            if (distanceBtn.classList.contains('lock')) return;
            // @ts-ignore
            game.qhly_playQhlyAudio('locked', null, true);
            this.classList.add('lock');
            // @ts-ignore
            _status.qhly_rotaAble = false;
          }
        });
      }
      blackbg.addEventListener('touchstart', mousedownEvent, true);
      blackbg.addEventListener('touchend', mouseupEvent, true);
      blackbg.addEventListener('touchcancel', mouseupEvent, true);
      blackbg.addEventListener('touchmove', mousemoveEvent, true);
      blackbg.addEventListener('mousedown', mousedownEvent, true);
      blackbg.addEventListener('mouseup', mouseupEvent, true);
      blackbg.addEventListener('mouseleave', mouseupEvent, true);
      blackbg.addEventListener('mousemove', mousemoveEvent, true);
      function exit() {
        clearInterval(touchTimer);
        if (!bg) {
          parent.insertBefore(focus, subling);
        } else state.mainView.nopoints.style.pointerEvents = 'auto';
        buttonbar.remove();
        if (distanceBtn) distanceBtn.remove();
        if (rotateBtn) rotateBtn.remove();
        blackbg.remove();
        focus.classList.remove('selected');
        // @ts-ignore
        _status.bigEditing = false;
        return;
      }
      function getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
      }
      function getAngle(x1, y1, x2, y2) {
        return Math.atan2((y2 - y1), (x2 - x1));
      }
      function mouseupEvent(event) {
        focus.mouseup(event);
      }
      function mousemoveEvent(event) {
        if (event) {
          if (event.touches && event.touches.length) {
            if (event.touches.length == 2) {
              focus.mousegesture(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY);
            } else focus.mousemove(event.touches[0].clientX, event.touches[0].clientY);
          }
          else focus.mousemove(event.clientX, event.clientY);
        }
      }
      function mousedownEvent(event) {
        if (event) {
          if (event.touches && event.touches.length) focus.mousedown(event.touches[0].clientX, event.touches[0].clientY);
          else focus.mousedown(event.clientX, event.clientY);
        }
      }
      focus.mousedown = function (x, y) {
        this.qhly_bigeditX = x;
        this.qhly_bigeditY = y;
        // this.qhly_position = tempPosition;
        this.qhly_isTouching = true;
      }
      focus.mousegesture = function (x1, y1, x2, y2) {
        if (!editDynamic) return;
        // @ts-ignore
        if (_status.qhly_disAble) {
          if (!this.qhly_distance) this.qhly_distance = getDistance(x1, y1, x2, y2);
          var scale = getDistance(x1, y1, x2, y2) - this.qhly_distance;
          gestureS = scale * 0.01;
        }
        // @ts-ignore
        if (_status.qhly_rotaAble) {
          if (!this.qhly_angle) this.qhly_angle = getAngle(x1, y1, x2, y2);
          var angle = getAngle(x1, y1, x2, y2) - this.qhly_angle;
          gestureA = angle * 100;
        }
        // @ts-ignore
        game.qhly_postMessage(focus, {
          message: 'RESIZE',
          id: focus.dynamic.id,
          // @ts-ignore
          scale: _status.qhly_disAble ? (temp[editMode].scale + gestureS) : undefined,
          // @ts-ignore
          angle: _status.qhly_rotaAble ? (temp[editMode].angle - gestureA) : undefined,
          player: pp,
          zhu: true,
          dybg: editMode == 'beijing' ? true : undefined,
        }, editMode)
      }
      focus.mousemove = function (x, y) {
        // @ts-ignore
        if (!this.qhly_isTouching) return;
        // @ts-ignore
        var slideX = x - this.qhly_bigeditX;
        // @ts-ignore
        var slideY = y - this.qhly_bigeditY;
        if (editDynamic) {
          temp[editMode].x[1] += slideX * 0.003;
          temp[editMode].y[1] -= slideY * 0.003;
          // @ts-ignore
          game.qhly_postMessage(focus, {
            message: 'RESIZE',
            id: focus.dynamic.id,
            x: temp[editMode].x,
            y: temp[editMode].y,
            player: pp,
            zhu: true,
            dybg: editMode == 'beijing' ? true : undefined,
          }, editMode)
        }
        else if (tempPosition) {
          var position = tempPosition.split('%')[0];
          position -= slideX * 0.5;
          if (position > 100) position = 100;
          if (position < 0) position = 0;
          // @ts-ignore
          this.style.setProperty('--p', position + '%');
          tempPosition = position + '%';
        }
        this.qhly_bigeditX = x;
        this.qhly_bigeditY = y;
      }
      focus.mouseup = function (event) {
        if (event.touches && event.touches.length == 1) {
          // @ts-ignore
          if (this.qhly_distance) delete this.qhly_distance;
          // @ts-ignore
          if (this.qhly_angle) delete this.qhly_angle;
          //if (this.qhly_newAngle) delete this.qhly_newAngle;
          if (gestureS) {
            temp[editMode].scale += gestureS;
            gestureS = null;
          }
          if (gestureA) {
            temp[editMode].angle -= gestureA;
            gestureA = null;
          }
          if (event.touches) {
            this.qhly_bigeditX = event.touches[0].clientX;
            this.qhly_bigeditY = event.touches[0].clientY;
          }
        }
        if (event.touches && event.touches.length == 0 || !lib.config.touchscreen) {
          if (this.qhly_isTouching) this.qhly_isTouching = false;
          if (this.qhly_bigeditX) delete this.qhly_bigeditX;
          if (this.qhly_bigeditY) delete this.qhly_bigeditY;
        }
      }
    };
    lib.extensionMenu['extension_千幻聆音']['qhly_currentViewSkin'] = {
      "name": "UI套装",
      "intro": "设置UI套装样式。",
      // @ts-ignore
      "item": get.qhly_viewSkinSet(),
      "init": lib.config.qhly_currentViewSkin === undefined ? 'xuanwujianghu' : lib.config.qhly_currentViewSkin,
      onclick: function (item) {
        // @ts-ignore
        if (lib.qhly_viewskin[item] && lib.qhly_viewskin[item].onchange) {
          // @ts-ignore
          lib.qhly_viewskin[item].onchange();
        }
        game.saveConfig('qhly_currentViewSkin', item);
        game.saveConfig('extension_千幻聆音_qhly_currentViewSkin', item);
        if (confirm("是否重启游戏以应用新UI？")) {
          game.reload();
        }
      }
    };

    var bgmConfigs = {
      'system': '不特别配置',
      'random': '随机',
    };

    // @ts-ignore
    for (var p in lib.qhlyMusic) {
      // @ts-ignore
      bgmConfigs[p] = lib.qhlyMusic[p].name;
    }

    // @ts-ignore
    lib.qhly_bgmConfigs = bgmConfigs;

    // @ts-ignore
    game.qhly_refreshBgmConfigs = function () {
      // @ts-ignore
      for (var p in lib.qhlyMusic) {
        // @ts-ignore
        lib.qhly_bgmConfigs[p] = lib.qhlyMusic[p].name;
      }
    };

    lib.extensionMenu['extension_千幻聆音']['qhly_currentMusic'] = {
      "name": "设置BGM",
      "intro": "设置此选项，可以选择游戏背景音乐。将覆盖系统的配置。",
      "init": lib.config.qhly_currentMusic ? lib.config.qhly_currentMusic : 'system',
      // @ts-ignore
      "item": lib.qhly_bgmConfigs,
      onclick: function (item) {
        game.saveConfig('extension_千幻聆音_qhly_currentMusic', item);
        game.saveConfig('qhly_currentMusic', item);
        // @ts-ignore
        game.qhly_switchBgm();
      }
    };
    lib.config.extension_千幻聆音_qhly_modemusicconfig =
      lib.config['qhly_modemusicconfig_' + get.mode()] ?
        lib.config['qhly_modemusicconfig_' + get.mode()] : 'system';

    lib.extensionMenu['extension_千幻聆音']['qhly_modemusicconfig'] = {
      "name": "模式BGM",
      "intro": "设置当前模式的BGM。",
      "init": lib.config['qhly_modemusicconfig_' + get.mode()] ? lib.config['qhly_modemusicconfig_' + get.mode()] : 'system',
      // @ts-ignore
      "item": lib.qhly_bgmConfigs,
      onclick: function (item) {
        game.saveConfig('extension_千幻聆音_qhly_modemusicconfig', item);
        game.saveConfig('qhly_modemusicconfig_' + get.mode(), item);
        // @ts-ignore
        game.qhly_switchBgm();
      }
    };


    // @ts-ignore
    if (lib.qhly_viewskin[lib.config.qhly_currentViewSkin] && lib.qhly_viewskin[lib.config.qhly_currentViewSkin].onchange) {
      // @ts-ignore
      lib.qhly_viewskin[lib.config.qhly_currentViewSkin].onchange();
    }

    // @ts-ignore
    lib.qhly_level = lib.config.qhly_level ? lib.config.qhly_level : {};
    //初始化千幻聆音皮肤相关的数据
    if (!lib.config.qhly_skinset) {
      game.saveConfig('qhly_skinset', {
        skin: {
          //key-value方式，存放武将皮肤名
        },
        skinAudioList: {
          //key-value方式，存放武将皮肤配音
        },
        audioReplace: {
          //key-value方式，存放配音映射逻辑。
        },
        djtoggle: {

        },
      });
    }
    if (!lib.config.qhly_skinset.djtoggle) lib.config.qhly_skinset.djtoggle = {};
    if (!lib.config.qhly_winrecord) {
      game.saveConfig('qhly_winrecord', {

      });
    }

    // @ts-ignore
    game.qhly_recordGameOver = function (name, win, player) {
      if (win !== true && win !== false) return;
      var record = lib.config.qhly_winrecord[name];
      if (!record) {
        record = {};
        lib.config.qhly_winrecord[name] = record;
      }
      var recordMode = record[get.mode()];
      if (!recordMode) {
        recordMode = {};
        record[get.mode()] = recordMode;
      }
      var identity = get.mode() == 'guozhan' ? player.group : player.identity;
      if (!identity) {
        identity = "未知身份";
      } else {
        identity = get.translation(identity + '2');
      }
      var wlr = recordMode[identity];
      if (!wlr) {
        wlr = {};
        recordMode[identity] = wlr;
      }
      if (win === true) {
        if (!wlr.win) {
          wlr.win = 0;
        }
        wlr.win++;
      } else if (win === false) {
        if (!wlr.lose) {
          wlr.lose = 0;
        }
        wlr.lose++;
      }
      game.saveConfig('qhly_winrecord', lib.config.qhly_winrecord);
    };

    lib.onover.push(function (ret) {
      if (game.zhu) {
        let skinYh = game.zhu.getElementsByClassName("skinYh");
        if (skinYh.length > 0 && game.zhu.classList.contains('dead')) skinYh[0].remove();
      }
      var name = game.me.name ? game.me.name : game.me.name1;
      if (name) {
        // @ts-ignore
        game.qhly_recordGameOver(name, ret, game.me);
      }
      var name2 = game.me.name2;
      if (name2) {
        // @ts-ignore
        game.qhly_recordGameOver(name2, ret, game.me);
      }
    });

    //持久化存储皮肤数据
    // @ts-ignore
    game.qhlySyncConfig = function () {
      game.saveConfig('qhly_skinset', lib.config.qhly_skinset);
    };

    //修改播放音频的函数。
    // @ts-ignore
    game.qhly_originPlayAudio = game.playAudio;
    // @ts-ignore
    game.qhly_playAudioPlus = function (...args) {
      const options = (args.length === 1 && get.objtype(args[0]) === "object")
        ? args[0]
        : {
          path: args.filter(arg => typeof arg === 'string' || typeof arg === 'number').join("/"),
          onError: args.find(arg => typeof arg === "function"),
        };

      const {
        path = "",
        // broadcast = false,
        addVideo = true,
        video = false,
        onCanPlay = (evt => void 0),
        onPlay = (evt => void 0),
        onEnded = (evt => void 0),
        onError = (evt => void 0),
      } = options;

      // 为了能更美观的写代码，默认返回audio而不额外加一个void类型
      // @ts-ignore
      if (_status.video && !video && !_status.qh_volmode) return;

      let parsedPath = "";
      if (["blob:", "data:"].some(prefix => path.startsWith(prefix))) parsedPath = path;
      else if (path.startsWith('ext:')) parsedPath = path.replace(/^ext:/, 'extension/');
      else if (path.startsWith('db:')) parsedPath = path.replace(/^(db:[^:]*)\//, (_, p) => p + ":");
      else if (!path.startsWith("../")) parsedPath = `audio/${path}`;
      else parsedPath = path;

      // @ts-ignore
      if (!lib.config.repeat_audio && _status.skillaudio.includes(parsedPath)) return;

      const audio = document.createElement('audio');
      audio.volume = lib.config.volumn_audio / 8;
      if (lib.config.qhly_volumnAudio) {
        var num = lib.config.qhly_volumnAudio['audio' + str];
        if (num !== undefined) {
          num = parseInt(num);
          if (!isNaN(num)) {
            audio.volume = num / 8;
          }
        }
      }
      audio.autoplay = true;

      audio.oncanplay = ev => {
        //Some browsers do not support "autoplay", so "oncanplay" listening has been added
        Promise.resolve(audio.play()).catch(e => console.error(e));
        if (_status.video || game.online) return;
        onCanPlay(ev);
      }
      audio.onplay = ev => {
        _status.skillaudio.add(parsedPath);
        setTimeout(() => _status.skillaudio.remove(parsedPath), 1000);
        // if (broadcast) game.broadcast(game.playAudio, options);
        if (addVideo) game.addVideo("playAudio", null, path);
        if (_status.video || game.online) return;
        onPlay(ev);
      };
      audio.onended = ev => {
        audio.remove();
        if (_status.qh_volmode) {
          // @ts-ignore
          game.qhly_openVolumnDialog('audio' + str);
          // @ts-ignore
          _status.qh_volmode = false;
        }
        if (_status.video || game.online) return;
        onEnded(ev);
      };
      audio.onerror = ev => {
        audio.remove();
        if (_status.video || game.online) return;
        onError(ev);
      };

      Promise.resolve().then(async () => {
        let resolvedPath;
        if (parsedPath.startsWith('db:')) resolvedPath = get.objectURL(await game.getDB('image', parsedPath.slice(3)));
        else if (lib.path.extname(parsedPath)) resolvedPath = `${lib.assetURL}${parsedPath}`;
        else if (URL.canParse(path)) resolvedPath = path;
        else resolvedPath = `${lib.assetURL}${parsedPath}.mp3`;

        audio.src = resolvedPath;
        ui.window.appendChild(audio);
      });

      return audio;
    }
    game.playAudio = function (...args) {
      if(_status.event && _status.event.name === 'dcbenxi'){
        // @ts-ignore
        return game.qhly_originPlayAudio.apply(this, arguments);
      }
      const options = (args.length === 1 && get.objtype(args[0]) === "object")
        ? args[0]
        : {
          path: args.filter(arg => typeof arg === 'string' || typeof arg === 'number').join("/"),
          onError: args.find(arg => typeof arg === "function"),
        };
      let originPath = options.path;
      if (originPath.startsWith('ext:')) {
        originPath = originPath.replace("ext:", "../extension/");
      }
      if (originPath.length) {
        // @ts-ignore
        if (lib.config.qhly_notbb && lib.config.qhly_notbb != 'none' && !_status.qhly_previewAudio) {
          var keySkill = originPath;
          // @ts-ignore
          while (keySkill.length && keySkill[keySkill.length - 1].charCodeAt() >= '0'.charCodeAt() && keySkill[keySkill.length - 1].charCodeAt() <= '9'.charCodeAt()) {
            keySkill = keySkill.slice(0, keySkill.length - 1);
          }
          // @ts-ignore
          if (!_status.qhly_bbkey) {
            // @ts-ignore
            _status.qhly_bbkey = {};
          }
          if (lib.config.qhly_notbb_range == 'all') {
            keySkill = 'all';
          } else {
            var playerP = game.findPlayer(function (current) {
              // @ts-ignore
              return current.hasSkill(keySkill);
            });
            if (playerP) {
              // @ts-ignore
              keySkill = playerP.playerid;
            }
          }
          // @ts-ignore
          var time = _status.qhly_bbkey[keySkill];
          if (!time) time = 0;
          var ctime = (new Date()).valueOf();
          if (ctime - time > parseInt(lib.config.qhly_notbb) * 1000) {
            // @ts-ignore
            _status.qhly_bbkey[keySkill] = ctime;
          } else {
            return;
          }
        }
        let replacedPath = lib.config.qhly_skinset.audioReplace[originPath];
        if((!replacedPath || replacedPath.length == 0) && originPath.endsWith('.mp3')){
          replacedPath = lib.config.qhly_skinset.audioReplace[originPath.slice(0,originPath.length-4)];
        }
        if (replacedPath) {
          options.path = replacedPath;
          if(lib.config.qhly_audioPlus){
            // @ts-ignore
            game.qhly_playAudioPlus.call(this, options);
          }else{
            // @ts-ignore
            return game.qhly_originPlayAudio.call(this, options);
          }
        }
      }
      if(lib.config.qhly_audioPlus){
        // @ts-ignore
        game.qhly_playAudioPlus.apply(this, arguments);
      }else{
        // @ts-ignore
        return game.qhly_originPlayAudio.apply(this, arguments);
      }
    };

    // @ts-ignore
    game.qhly_playQhlyAudio = function (name, num, repeat) {
      if (lib.config.qhly_closeVoice) {
        return;
      }
      if (!repeat) {
        if (num === undefined || num === null) {
          game.playAudio('..', 'extension', '千幻聆音', 'audio', name);
        } else {
          game.playAudio('..', 'extension', '千幻聆音', 'audio', name + Math.ceil(Math.random() * num));
        }
      } else {
        if (num === undefined || num === null) {
          // @ts-ignore
          game.qhly_playAudioRepeatable('..', 'extension', '千幻聆音', 'audio', name);
        } else {
          // @ts-ignore
          game.qhly_playAudioRepeatable('..', 'extension', '千幻聆音', 'audio', name + Math.ceil(Math.random() * num));
        }
      }
    };

    // @ts-ignore
    game.qhly_playAudioRepeatable = function () {
      // @ts-ignore
      if (_status.video && arguments[1] != 'video') return;
      var str = '';
      var onerror = null;
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'string' || typeof arguments[i] == 'number') {
          str += '/' + arguments[i];
        }
        else if (typeof arguments[i] == 'function') {
          onerror = arguments[i]
        }
        // @ts-ignore
        if (_status.video) break;
      }
      //if(!lib.config.repeat_audio&&_status.skillaudio.includes(str)) return;
      _status.skillaudio.add(str);
      // @ts-ignore
      game.addVideo('playAudio', null, str);
      setTimeout(function () {
        _status.skillaudio.remove(str);
      }, 1000);
      var audio = document.createElement('audio');
      audio.autoplay = true;
      audio.volume = lib.config.volumn_audio / 8;
      if (str.indexOf('.mp3') != -1 || str.indexOf('.ogg') != -1) {
        audio.src = lib.assetURL + 'audio' + str;
      }
      else {
        audio.src = lib.assetURL + 'audio' + str + '.mp3';
      }
      audio.addEventListener('ended', function () {
        this.remove();
      });
      audio.onerror = function () {
        if (this._changed) {
          // @ts-ignore
          this.remove();
          if (onerror) {
            onerror();
          }
        }
        else {
          this.src = lib.assetURL + 'audio' + str + '.ogg';
          this._changed = true;
        }
      };
      ui.window.appendChild(audio);
      return audio;
    };

    // @ts-ignore
    game.qhly_originPlaySkillAudio = game.playSkillAudio;
    game.playSkillAudio = function (name, index) {
      var replaceKey = "skill/" + name;
      if (!index) {
        index = Math.ceil(Math.random() * 2);
      }
      replaceKey = replaceKey + index;
      var rp = lib.config.qhly_skinset.audioReplace[replaceKey];
      if (rp) {
        var args = rp.split("/");
        if(lib.config.qhly_audioPlus){
          // @ts-ignore
          return game.qhly_playAudioPlus.apply(this, args);
        }else{
          // @ts-ignore
          return game.qhly_originPlayAudio.apply(this, args);
        }
      }
      if(lib.config.qhly_audioPlus){
        // @ts-ignore
        return game.qhly_playAudioPlus.apply(this, arguments);
      }else{
        // @ts-ignore
        return game.qhly_originPlaySkillAudio.apply(this, arguments);
      }
    };

    //在设置完皮肤后，刷新界面，检测场上的角色是否是设置的角色，并更换其皮肤。
    // @ts-ignore
    game.qhly_refresh = function (name) {
      // @ts-ignore
      if (_status.qh_sourceNode) {
        // @ts-ignore
        _status.qh_sourceNode.setBackground(_status.qh_sourceNodeName, 'character');
      }
      var players = game.players;
      if (players) {
        players = players.slice(0);
      } else {
        return;
      }
      if (game.dead) {
        players = players.concat(game.dead);
      }
      if (!players.length) return;
      players = players.filter(function (player) {
        if (player.name1 == name || player.name2 == name) {
          return true;
        }
        var name2 = name;
        //关于国战武将特别配置。
        if (name2.indexOf('gz_') < 0) {
          name2 = 'gz_' + name2;
        } else {
          name2 = name.slice(3);
        }
        return player.name1 == name2 || player.name2 == name2;
      });
      if (!players.length) return;
      for (var player of players) {
        var avatar;
        var fakeavatar;
        var name2 = "";
        if (name.indexOf('gz_') < 0) {
          name2 = 'gz_' + name;
        } else {
          name2 = name.slice(3);
        }
        if (player.name1 == name || player.name1 == name2) {
          avatar = player.node.avatar;
          fakeavatar = avatar.cloneNode(true);
          if (player.node.qhly_skinButton1) {
            if (lib.config.qhly_dragButtonPosition === 'no') {
              var key = 'qhly_dragButtonPositionOf_' + player.name1;
              // @ts-ignore
              var skin = game.qhly_getSkin(player.name1);
              if (skin) {
                key = key + '_' + skin;
              }
              if (lib.config[key]) {
                for (var s in lib.config[key]) {
                  player.node.qhly_skinButton1.style[s] = lib.config[key][s];
                }
              }
            }
          }
        } else if (player.name2 == name || player.name2 == name2) {
          avatar = player.node.avatar2;
          fakeavatar = avatar.cloneNode(true);
          if (player.node.qhly_skinButton2) {
            if (lib.config.qhly_dragButtonPosition === 'no') {
              var key = 'qhly_dragButtonPositionOf_' + player.name2;
              // @ts-ignore
              var skin = game.qhly_getSkin(player.name2);
              if (skin) {
                key = key + '_' + skin;
              }
              if (lib.config[key]) {
                for (var s in lib.config[key]) {
                  player.node.qhly_skinButton2.style[s] = lib.config[key][s];
                }
              }
            }
          }
        } else {
          continue;
        }
        var finish = function (bool, fakeavatar) {
          var player = avatar.parentNode;
          if (bool) {
            fakeavatar.style.boxShadow = 'none';
            player.insertBefore(fakeavatar, avatar.nextSibling);
            setTimeout(function () {
              fakeavatar.delete();
            }, 100);
          }
          //if (bool && lib.config['extension_千幻聆音_qhly_decadeChangeEffect'] && (lib.config.qhly_smallwindowstyle == 'decade' || lib.config.qhly_smallwindowstyle == 'shousha')) player.playChangeSkinEffect(avatar == player.node.avatar2)
          else if (bool && !lib.config.low_performance) {
            player.$rare();
          }
        }
        avatar.setBackground(name, 'character');
        finish(true, fakeavatar);
      }
    };

    //修改设置背景图片的函数，以达到替换皮肤的效果。
    // @ts-ignore
    HTMLDivElement.prototype.qhly_origin_setBackgroundImage = HTMLDivElement.prototype.setBackgroundImage;
    HTMLDivElement.prototype.setBackgroundImage = function (name) {
      // if (window.qhly_setBackground_inCharacter) {
      //     this.qhly_origin_setBackgroundImage.apply(this, arguments);
      //     return;
      // }
      if(lib.config.qhly_chooseButtonOrigin){
        if(this.classList.contains('character') && this.classList.contains('button')){
          // @ts-ignore
          return this.qhly_origin_setBackgroundImage.apply(this, arguments);
        }
      }
      if (this.classList.contains('qh-must-replace') || (!this.classList.contains('qh-not-replace') && (lib.config.qhly_forceall || (this.classList.contains('avatar') || this.classList.contains('avatar2'))))) {
        // taffy: 修复千幻与皮切bug喵
        let that = this;
        /* taffy分界线 */
        //判断当前的div是否是人物avatar。
        var setByName = function (cname, opath) {
          if (lib.config.qhly_skinset.skin[cname]) {
            var skin = lib.config.qhly_skinset.skin[cname];
            if (!skin) return false;
            // @ts-ignore
            var skinPackage = game.qhly_foundPackage(cname);
            if (opath) {
              var lutouPrefix = skinPackage.lutouPrefix;
              if (typeof lutouPrefix == 'function') {
                lutouPrefix = lutouPrefix(cname);
              }
              var prefix = skinPackage.prefix;
              if (typeof prefix == 'function') {
                prefix = prefix(cname);
              }
              if (skinPackage.isLutou) {
                // @ts-ignore
                if (lutouPrefix + cname != game.qhly_earse_ext(opath) && prefix + cname != game.qhly_earse_ext(opath)) {
                  return false;
                }
              // @ts-ignore
              } else if (prefix + cname != game.qhly_earse_ext(opath)) {
                return false;
              }
            }
            //获取相应的皮肤包，并修改图片路径。
            var dest = null;
            if (skinPackage.isLutou) {
              dest = skinPackage.skin.lutou;
              if (!dest) {
                dest = skinPackage.skin.standard;
              }
            } else {
              dest = skinPackage.skin.standard;
            }
            if (typeof dest == 'function') {
              dest = dest(cname, skin);
            }
            var destpath = dest + cname + "/" + skin;
            if (skinPackage.replaceAvatarDestination) {
              var dp = skinPackage.replaceAvatarDestination(cname, skin);
              if (dp) {
                destpath = dp;
              }
            }
            // taffy: 注释content.js原版代码喵
            // this.qhly_origin_setBackgroundImage(destpath);
            /* taffy分界线 */
            // taffy: 修复千幻与皮切bug喵
            game.qhly_checkFileExist(destpath, function (s) {
              if (s) {
                that.qhly_origin_setBackgroundImage(destpath);
              } else {
                var prefix = skinPackage.prefix;
                if (typeof prefix == 'function') {
                  prefix = prefix(cname);
                }
                if (lib.config.qhly_noSkin == 'origin') {
                  if (prefix.includes('.jpg')) that.qhly_origin_setBackgroundImage(prefix);//原画
                  else that.qhly_origin_setBackgroundImage(prefix + cname + '.jpg');//原画
                }
                else that.qhly_origin_setBackgroundImage('extension/千幻聆音/image/noSkin.png');//noskin
              }
            })
            /* taffy分界线 */
            return true;
          }
        }.bind(this);
        //if (lib.qhly_skinShare[name]) name = lib.qhly_skinShare[name].name;
        if (name && name.indexOf('image/character/') == 0) {
          var cname = name.replace('image/character/', '');
          if (cname.indexOf('/') < 0) {
            var found = cname.lastIndexOf('.');
            if (found >= 0) {
              cname = cname.slice(0, found);
            }
            if (setByName(cname)) {
              return;
            }
          }
        } else if (name && name.indexOf('extension/') == 0) {
          var cname = name.replace('extension/', '');
          var foundS = cname.lastIndexOf("/");
          var foundDot = cname.lastIndexOf(".");
          if (foundS >= 0) {
            if (foundDot < 0) {
              foundDot = cname.length;
            }
            cname = cname.slice(foundS + 1, foundDot);
          }
          if (cname.length) {
            if (setByName(cname, name)) {
              return;
            }
          }
        }
      }
      // @ts-ignore
      this.qhly_origin_setBackgroundImage.apply(this, arguments);
    };

    // @ts-ignore
    HTMLDivElement.prototype.qhly_origin_setBackground = HTMLDivElement.prototype.setBackground;
    HTMLDivElement.prototype.setBackground = function (name, type, ext, subfolder) {
      if(type == 'character'){
        if(lib.config.qhly_chooseButtonOrigin){
          if(this.classList.contains('character') && this.classList.contains('button')){
            // @ts-ignore
            return this.qhly_origin_setBackground.apply(this, arguments);
          }
        }
      }
      if (type == 'character' && (this.classList.contains('qh-must-replace') || (!this.classList.contains('qh-not-replace') && (lib.config.qhly_forceall || (this.classList.contains('avatar') || this.classList.contains('avatar2') || this.classList.contains('primary-avatar') || this.classList.contains('deputy-avatar') || this.classList.contains('button')))))) {
        let that = this;
        var setByName = function (cname) {
          if (lib.config.qhly_skinset.skin[cname]) {
            // @ts-ignore
            var realName = game.qhly_getRealName(cname);
            var skin = lib.config.qhly_skinset.skin[cname];
            if (!skin) return false;
            // @ts-ignore
            var skinPackage = game.qhly_foundPackage(realName);
            //获取相应的皮肤包，并修改图片路径。
            var dest = null;
            if (skinPackage.isLutou) {
              dest = skinPackage.skin.lutou;
              if (!dest) {
                dest = skinPackage.skin.standard;
              }
            } else {
              dest = skinPackage.skin.standard;
            }
            if (typeof dest == 'function') {
              dest = dest(realName, skin);
            }
            var destpath = dest + realName + "/" + skin;
            if (skinPackage.replaceAvatarDestination) {
              var dp = skinPackage.replaceAvatarDestination(realName, skin);
              if (dp) {
                destpath = dp;
              }
            }
            // @ts-ignore
            game.qhly_checkFileExist(destpath, function (s) {
              if (s) {
                // @ts-ignore
                that.qhly_origin_setBackgroundImage(destpath);
              } else {
                var prefix = skinPackage.prefix;
                if (typeof prefix == 'function') {
                  prefix = prefix(cname);
                }
                // taffy: 注释content.js原版代码喵
                // @ts-ignore
                // if (lib.config.qhly_noSkin == 'origin') that.qhly_origin_setBackgroundImage(prefix + realName + '.jpg');//原画
                /* taffy分界线 */
                // taffy: 修复千幻与皮切bug喵
                if (lib.config.qhly_noSkin == 'origin') {
                  // @ts-ignore
                  if (prefix.includes('.jpg')) that.qhly_origin_setBackgroundImage(prefix);//原画
                  // @ts-ignore
                  else that.qhly_origin_setBackgroundImage(prefix + realName + '.jpg');//原画
                }
                /* taffy分界线 */
                // @ts-ignore
                else that.qhly_origin_setBackgroundImage('extension/千幻聆音/image/noSkin.png');//noskin
              }
            })
            that.style.backgroundSize = "cover";
            return true;
          }
        };
        if (!setByName(name)) {
          // @ts-ignore
          return that.qhly_origin_setBackground(name, type, ext, subfolder);
        }
        return this;
      } else {
        // @ts-ignore
        return this.qhly_origin_setBackground(name, type, ext, subfolder);
      }
    };
    // @ts-ignore
    game.qhly_banSkin = function (name, skin, ban) {
      if (ban === undefined) ban = true;
      if (!skin) {
        skin = "[original]";
      }
      if (!lib.config.qhly_banskinlist) {
        lib.config.qhly_banskinlist = [];
      }
      if (ban) {
        lib.config.qhly_banskinlist.add(name + '-' + skin);
      } else {
        lib.config.qhly_banskinlist.remove(name + '-' + skin);
      }
      game.saveConfig('qhly_banskinlist', lib.config.qhly_banskinlist);
    };
    // @ts-ignore
    game.qhly_skinIsBanned = function (name, skin) {
      if (!lib.config.qhly_banskinlist) {
        return false;
      }
      if (!skin) {
        skin = "[original]";
      }
      return lib.config.qhly_banskinlist.includes(name + '-' + skin);
    };
    //获取皮肤文件。参数为武将名称和皮肤名称。注意需要包含扩展名。
    // @ts-ignore
    game.qhly_getSkinFile = function (name, skin) {
      if (name.indexOf('gz_') == 0) {
        // @ts-ignore
        if (lib.config.qhly_guozhan === false || get.mode() != 'guozhan' || !game.qhly_hasGuozhanSkin(name)) {
          var subname = name.slice(3);
          if (get.character(subname)) {
            name = subname;
          }
        }
      }
      // @ts-ignore
      var realName = game.qhly_getRealName(name);
      // @ts-ignore
      var skinPackage = game.qhly_foundPackage(realName);
      if (!skin) {
        return skinPackage.prefix + name + ".jpg";
      }
      var dest = null;
      if (skinPackage.isLutou) {
        dest = skinPackage.skin.lutou;
        if (!dest) {
          dest = skinPackage.skin.standard;
        }
      } else {
        dest = skinPackage.skin.standard;
      }
      if (skinPackage.replaceAvatarDestination) {
        var r = skinPackage.replaceAvatarDestination(realName, skin);
        if (r) return r;
      // @ts-ignore
      } else if (lib.qhly_skinChange[realName] && _status.qhly_replaceSkin && _status.qhly_replaceSkin[realName] && _status.qhly_replaceSkin[realName][skin]) {
        // @ts-ignore
        return _status.qhly_replaceSkin[realName][skin];
      }
      return dest + realName + "/" + skin;
    };
    //竖排文字原版
    // @ts-ignore
    get.qhly_verticalStr=function(str,sp){
      if(typeof str!='string') return '';
      str=str.toUpperCase();
      var str2='';
      var nobreak=false;
      for(var i=0;i<str.length;i++){
          if(str[i]=='`'){
              nobreak=!nobreak;continue;
          }
          str2+=str[i];
          if(nobreak) continue;
          if(sp&&str[i]=='S'&&str[i+1]=='P') continue;
          if(/[0-9]/.test(str[i])&&/[0-9]/.test(str[i+1])) continue;
          if(i<str.length-1){
              str2+='<br>';
          }
      }
      return str2;
  };
    //获取皮肤名称。
    // @ts-ignore
    game.qhly_getSkin = function (name) {
      if (name.indexOf('gz_') == 0) {
        // @ts-ignore
        if (lib.config.qhly_guozhan === false || get.mode() != 'guozhan' || !game.qhly_hasGuozhanSkin(name)) {
          var subname = name.slice(3);
          if (get.character(subname)) {
            name = subname;
          }
        }
      }
      if (lib.config.qhly_skinset.skin[name]) {
        return lib.config.qhly_skinset.skin[name];
      }
      return null;
    };
    // @ts-ignore
    game.qhly_skinIs = function (name, skinname) {
      // @ts-ignore
      var ret = game.qhly_getSkin(name);
      if (!ret && !skinname) return true;
      return skinname == ret;
    };

    //搜索武将的皮肤包。
    // @ts-ignore
    game.qhly_foundPackage = function (name) {
      var skinPackage = null;
      // @ts-ignore
      for (var pkg of lib.qhlypkg) {
        if (pkg.skinShare) {
          // @ts-ignore
          lib.qhly_skinShare = Object.assign(lib.qhly_skinShare, pkg.skinShare);
        }
        if (pkg.characterList && pkg.characterList.includes(name)) {
          skinPackage = pkg;
          break;
        }
        if (pkg.filterCharacter && pkg.filterCharacter(name)) {
          skinPackage = pkg;
          break;
        }
      }
      if (skinPackage == null) {
        if (lib.config.qhly_extcompat !== 'false') {
          // @ts-ignore
          skinPackage = game.qhly_foundPackageExt(name);
        }
      }
      if (skinPackage == null) {
        // @ts-ignore
        skinPackage = DEFAULT_PACKAGE;
      }
      return skinPackage;
    };
    // @ts-ignore
    game.qhly_getAvatarSrc = function (name) {
      if (!name) return null;
      var src = null;
      var ext = '.jpg';
      var subfolder = 'default';
      var type = 'character';
      if (type) {
        var dbimage = null, extimage = null, modeimage = null;
        var nameinfo;
        var gzbool = false;
        var mode = get.mode();
        if (type == 'character') {
          if (lib.characterPack['mode_' + mode] && lib.characterPack['mode_' + mode][name]) {
            if (mode == 'guozhan') {
              nameinfo = lib.character[name];
              if (name.indexOf('gz_shibing') == 0) {
                name = name.slice(3, 11);
              }
              else {
                if (lib.config.mode_config.guozhan.guozhanSkin && lib.character[name] && lib.character[name][4].includes('gzskin')) gzbool = true;
                name = name.slice(3);
              }
            }
            else {
              modeimage = mode;
            }
          }
          else if (lib.character[name]) {
            nameinfo = lib.character[name];
          }
          else if (name.indexOf('::') != -1) {
            name = name.split('::');
            modeimage = name[0];
            name = name[1];
          }
        }
        if (!modeimage && nameinfo && nameinfo[4]) {
          for (var i = 0; i < nameinfo[4].length; i++) {
            if (nameinfo[4][i].indexOf('ext:') == 0) {
              extimage = nameinfo[4][i]; break;
            }
            else if (nameinfo[4][i].indexOf('db:') == 0) {
              dbimage = nameinfo[4][i]; break;
            }
            else if (nameinfo[4][i].indexOf('mode:') == 0) {
              modeimage = nameinfo[4][i].slice(5); break;
            }
            else if (nameinfo[4][i].indexOf('character:') == 0) {
              name = nameinfo[4][i].slice(10); break;
            }
          }
        }
        if (extimage) {
          src = extimage.replace(/ext:/, 'extension/');
        }
        else if (dbimage) {
          return null;
        }
        else if (modeimage) {
          src = 'image/mode/' + modeimage + '/character/' + name + ext;
        }
        else if (type == 'character' && lib.config.skin[name] && arguments[2] != 'noskin') {
          src = 'image/skin/' + name + '/' + lib.config.skin[name] + ext;
        }
        else {
          if (type == 'character') {
            src = 'image/character/' + (gzbool ? 'gz_' : '') + name + ext;
          }
          else {
            src = 'image/' + type + '/' + subfolder + '/' + name + ext;
          }
        }
      }
      else {
        src = 'image/' + name + ext;
      }
      return src;
    };
    // @ts-ignore
    game.qhly_foundPackageExt = function (name) {
      // @ts-ignore
      var cp = game.qhly_getCharacterPackage(name);
      // @ts-ignore
      var picSrc = game.qhly_getAvatarSrc(name);
      if (picSrc && picSrc.indexOf('image/character/') == 0) {
        return null;
      }
      var extNameInPic = picSrc.replace('extension/', '');
      if (extNameInPic.indexOf('/') >= 0) {
        extNameInPic = extNameInPic.slice(0, extNameInPic.indexOf('/'));
      }
      if (cp) {
        var cpkg = lib.characterPack[cp];
        if (!cpkg) return null;
        return {
          isExt: true,
          fromExt: false,
          filterCharacter: function (name) {
            return cpkg[name] !== false;
          },
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          skininfo: function (name, skinname) {
            return null;
          },
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          characterTaici: function (name) {
            return null;
          },
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          characterLihui: function (name, skin) {
            return null;
          },
          prefix: function (cname) {
            // @ts-ignore
            var src = game.qhly_getAvatarSrc(cname);
            if (src) {
              return src.replace(cname + '.jpg', '');
            }
            return 'extension/' + cp + '/';
          },
          skin: {
            standard: ((lib.config.qhly_extSkinPath == undefined || lib.config.qhly_extSkinPath == 'default') ? 'extension/' + extNameInPic + '/skin/image/' : lib.config.qhly_extSkinPath),
            origin: 'extension/' + extNameInPic + '/skin/yuanhua/',
          },
          //ssborder:,
          audioOrigin: function (cname) {
            var info = get.character(cname);
            var extName = null;
            if (info) {
              var skills = info[3];
              if (skills) {
                for (var skill of skills) {
                  var sinfo = lib.skill[skill];
                  if (sinfo && sinfo.audio !== undefined) {
                    if (typeof sinfo.audio == 'number') {
                      return '';
                    } else if (typeof sinfo.audio == 'string' && sinfo.audio.indexOf('ext:') == 0) {
                      var infos = sinfo.audio.split(':');
                      if (infos.length >= 2) {
                        extName = infos[1];
                        return 'extension/' + extName + "/";
                      }
                    }
                  }
                }
              }
            }
            if (get.translation(cp + '_character_config')) {
              return 'extension/' + get.translation(cp + '_character_config') + '/';
            }
            return '';
          },
          audio: ((lib.config.qhly_extSkinPath == undefined || lib.config.qhly_extSkinPath == 'default') ? 'extension/' + extNameInPic + '/skin/audio/' : 'extension/千幻聆音/sanguoaudio/'),//皮肤配音文件在千幻聆音扩展内的位置。
        };
      }
      return null;
    };

    // @ts-ignore
    game.qhly_findAdditionSkins = function (name) {
      var list = [];
      // @ts-ignore
      for (var pkg of lib.qhlypkg) {
        if (pkg.getAdditionalSkins) {
          list.addArray(pkg.getAdditionalSkins(name));
        }
      }
      return list;
    };

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    game.qhly_findAdditionSkinsName = function (name) {
      // @ts-ignore
      var list = game.qhly_findAdditionSkins();
      var ret = [];
      for (var l of list) {
        ret.push("add::" + l.name + "::" + l.skinName);
      }
      return ret;
    };

    // @ts-ignore
    game.qhly_skinLock = function (name, skin) {
      // @ts-ignore
      var pkg = game.qhly_foundPackage(name);
      if (pkg && pkg.lockSkin) {
        var ret = pkg.lockSkin(name, skin);
        if (ret && ret.isLocked()) {
          return ret;
        }
      }
      return false;
    };
    //获取某武将的皮肤列表。
    // @ts-ignore
    game.qhly_getSkinAudioList = function (name, callback, locked) {
      // @ts-ignore
      var pkg = game.qhly_foundPackage(name);
      if (!pkg.audio) {
        if (callback) {
          callback(false);
        }
        return;
      }
      // @ts-ignore
      game.qhly_getSkinList(name, function (ret, list) {
        if (!ret || !list || !list.length) {
          if (callback) {
            callback(false);
          }
          return;
        }
        var path = pkg.audio;
        // @ts-ignore
        game.qhly_checkFileExist(path, function (s) {
          if (s) {
            // @ts-ignore
            game.getFileList(path, function (folders) {
              var retList = [];
              var retList2 = [];
              for (var item of list) {
                // @ts-ignore
                var nm = game.qhly_earseExt(item);
                if (folders.includes(nm)) {
                  retList.add(nm);
                  retList2.add(item);
                }
              }
              if (callback) {
                callback(true, retList, retList2);
              }
            });
          } else {
            if (callback) {
              callback(false);
            }
          }
        });
      }, locked);
    };
    // @ts-ignore
    game.qhly_getSkinList = function (name, callback, locked, loadInfoJs) {
      if (locked === undefined) {
        locked = true;
      }
      if (name.indexOf('gz_') == 0) {
        // @ts-ignore
        if (lib.config.qhly_guozhan === false || get.mode() != 'guozhan' || !game.qhly_hasGuozhanSkin(name)) {
          var subname = name.slice(3);
          if (get.character(subname)) {
            name = subname;
          }
        }
      }
      // @ts-ignore
      var realName = game.qhly_getRealName(name);
      // @ts-ignore
      var skinPackage = game.qhly_foundPackage(realName);
      //var skinPackageOrigin = game.qhly_foundPackage(name);
      var handleHide = function (list) {
        var ret = [];
        for (var skin of list) {
          if (skinPackage.hideSkin && skinPackage.hideSkin(name, skin)) {
            continue;
          }
          // @ts-ignore
          if (!locked && game.qhly_skinLock(name, skin)) {
            continue;
          }
          var supportExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.ico'];
          for (var ext of supportExt) {
            if (skin.endsWith(ext)) {
              ret.add(skin);
              break;
            }
            if (skin.endsWith(ext.toUpperCase())) {
              ret.add(skin);
              break;
            }
          }
        }
        return ret;
      };
      // @ts-ignore
      if (_status.qhly_skinListCache) {
        // @ts-ignore
        var list = _status.qhly_skinListCache[name];
        if (list) {
          var path = '';
          if (skinPackage.isLutou) {
            path = skinPackage.skin.lutou;
          } else {
            path = skinPackage.skin.standard;
          }
          path = path + realName;
          // @ts-ignore
          if (loadInfoJs && list.includes('skininfo.js') && !lib.qhly_dirskininfo[name]) {
            lib.init.js(lib.assetURL + path + "/skininfo.js", null, function () {
              callback(true, handleHide(list.slice(0)));
            // @ts-ignore
            // @ts-ignore
            // @ts-ignore
            }, function (err) {
              callback(true, handleHide(list.slice(0)));
            });
          } else {
            callback(true, handleHide(list.slice(0)));
          }
          return;
        }
        if (list === false) {
          callback(false);
          return;
        }
      }
      if (game.getFileList) {
        var path = '';
        if (skinPackage.isLutou) {
          path = skinPackage.skin.lutou;
        } else {
          path = skinPackage.skin.standard;
        }
        path = path + realName;
        // if (realName != name) {
        //     var path2 = '';
        //     if (skinPackageOrigin.isLutou) {
        //         path2 = skinPackageOrigin.skin.lutou;
        //     } else {
        //         path2 = skinPackageOrigin.skin.standard;
        //     }
        //     path2 = path2 + name;
        //     lib.init.js(lib.assetURL + path2 + "/skininfo.js")
        // }
        // @ts-ignore
        game.qhly_checkFileExist(path, function (s) {
          if (s) {
            // @ts-ignore
            // @ts-ignore
            // @ts-ignore
            game.getFileList(path, function (folders, files) {
              // @ts-ignore
              if (!_status.qhly_skinListCache) _status.qhly_skinListCache = {};
              var ret = files.slice(0);
              // @ts-ignore
              _status.qhly_skinListCache[name] = ret;
              if (loadInfoJs && files.includes('skininfo.js')) {
                lib.init.js(lib.assetURL + path + "/skininfo.js", null, function () {
                  callback(true, handleHide(files));
                }, function () {
                  callback(true, handleHide(files));
                });
              } else {
                callback(true, handleHide(files));
              }
            });
          } else {
            // @ts-ignore
            if (!_status.qhly_skinListCache) _status.qhly_skinListCache = {};
            // @ts-ignore
            _status.qhly_skinListCache[name] = false;
            callback(false);
          }
        });
      } else {
        // @ts-ignore
        if (!_status.qhly_skinListCache) _status.qhly_skinListCache = {};
        // @ts-ignore
        _status.qhly_skinListCache[name] = false;
        callback(false);
      }
    };
    // @ts-ignore
    game.qhly_getSkinModels = function(name,callback,locked,loadInfoJs){
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      game.qhly_getSkinList(name,function(ret, list){
        // @ts-ignore
        let pkg = game.qhly_foundPackage(name);
        var retList = [];
        if (list) {
          list.forEach((skin)=>{
            // @ts-ignore
            var info = game.qhly_getSkinInfo(name, skin,pkg);
            var obj = {
              order: info.order,
              skinId: skin,
              skinInfo: info,
              // @ts-ignore
              audios: get.qhly_getAudioInfoInSkin(name,pkg, skin),
            };
            retList.push(obj);
          });
        }
        let skinList = [{
          skinId: null,
          // @ts-ignore
          skinInfo: game.qhly_getSkinInfo(name,null,pkg),
          // @ts-ignore
          audios: get.qhly_getAudioInfoInSkin(name,pkg,null),
        }];
        retList.sort(function (a, b) {
          // @ts-ignore
          var orderA = game.qhly_getOrder(name, a.skinId, pkg);
          // @ts-ignore
          var orderB = game.qhly_getOrder(name, b.skinId, pkg);
          if (orderA > orderB) return 1;
          if (orderA == orderB) return 0;
          return -1;
        });
        retList.forEach(item=>{skinList.push(item)});
        let dynamicSkinList = [];
        // @ts-ignore
        if (window.decadeUI) {
          // @ts-ignore
          if (decadeUI.dynamicSkin && decadeUI.dynamicSkin[name]) dynamicSkinList = Object.keys(decadeUI.dynamicSkin[name]);
          for (var i of skinList) {
            if (i.skinId) {
              // @ts-ignore
              var skin = i.skinId.substring(0, i.skinId.lastIndexOf('.'));
              if (dynamicSkinList.includes(skin)) i.bothSkin = true;
            }
          }
          if (dynamicSkinList.length) {
            var duibiList = [];
            for (var i of skinList) {
              // @ts-ignore
              if (i.skinId && i.skinId != null) duibiList.push(i.skinId.substring(0, i.skinId.lastIndexOf('.')));
            }
            // @ts-ignore
            for (var i of dynamicSkinList) {
              // @ts-ignore
              if (i == '经典形象') {
                skinList['0'].bothSkin = true;
                //subView.skinType.style.cssText += 'transform:translateY(32%);';
              }
              else if (!duibiList.includes(i)) {
                var dyskin = i + '.jpg';
                // @ts-ignore
                var dyinfo = game.qhly_getSkinInfo(name,dyskin,pkg);
                skinList.push({
                  order: dyinfo.order,
                  // @ts-ignore
                  skinId: dyskin,
                  skinInfo: dyinfo,
                  // @ts-ignore
                  audios: get.qhly_getAudioInfoInSkin(name,pkg,dyskin),
                  single: true,//11
                })
              }
            }
          }
        }
        if(callback){
          callback(skinList);
        }
      },locked,loadInfoJs);
    };
    //根据武将ID，皮肤文件名，查找皮肤的翻译命名。
    // @ts-ignore
    game.qhly_getSkinName = function (plname, filename, skinPackage) {
      var foundDot = filename.lastIndexOf('.');
      if (foundDot == -1) {
        foundDot = filename.length;
      }
      var sname = filename.slice(0, foundDot);
      if (!plname) {
        return sname;
      }
      if (!skinPackage) {
        //4VrLPyXM/UwVl3SXOMoDpBLQcoJHwBtPcxBNF1VM6oxC7qONebCO4KekZdetP8Zs
        // @ts-ignore
        skinPackage = game.qhly_foundPackage(plname);
      }
      if (skinPackage.skininfo) {
        var info;
        if (typeof skinPackage.skininfo == 'function') {
          info = skinPackage.skininfo(plname, sname);
        } else {
          var tname = plname + '-' + sname;
          info = skinPackage.skininfo[tname];
          if (!info) {
            info = skinPackage.skininfo[sname];
          }
        }
        if (info && info.translation) {
          return info.translation;
        }
      }
      return sname;
    };

    //获取皮肤信息。
    // @ts-ignore
    game.qhly_getSkinInfo = function (plname, filename, skinPackage) {//direct控制直接读取name的台词
      if (plname.indexOf('gz_') == 0) {
        // @ts-ignore
        if (lib.config.qhly_guozhan === false || get.mode() != 'guozhan' || !game.qhly_hasGuozhanSkin(plname)) {
          var subplname = plname.slice(3);
          if (get.character(subplname)) {
            plname = subplname;
          }
        }
      }
      // @ts-ignore
      var realName = game.qhly_getRealName(plname);
      if (!filename) {
        return {
          info: '',
        };
      }
      var foundDot = filename.lastIndexOf('.');
      if (foundDot == -1) {
        foundDot = filename.length;
      }
      var sname = filename.slice(0, foundDot);
      if (!plname) {
        return {
          info: '',
          translation: sname
        };
      }
      // @ts-ignore
      var dinfo = lib.qhly_dirskininfo[realName];
      if (dinfo && dinfo.skin && dinfo.skin[sname]) {
        return dinfo.skin[sname];
      }
      if (!skinPackage) {
        // @ts-ignore
        skinPackage = game.qhly_foundPackage(realName);
      }
      if (skinPackage.skininfo) {
        var info;
        if (typeof skinPackage.skininfo == 'function') {
          info = skinPackage.skininfo(realName, sname);
        } else {
          var tname = realName + "-" + sname;
          info = skinPackage.skininfo[tname];
          if (!info) {
            info = skinPackage.skininfo[sname];
          }
        }
        if (info) {
          return info;
        }
      }
      return {
        info: '',
        translation: sname
      };
    };
    // @ts-ignore
    game.qhly_getSkinImagePath = function (name, pkg) {
      // @ts-ignore
      if (!pkg) pkg = game.qhly_foundPackage(name);
      // @ts-ignore
      var realName = game.qhly_getRealName(name);
      // @ts-ignore
      if (realName != name) pkg = game.qhly_foundPackage(realName);
      var path = null;
      if (pkg.isLutou) {
        path = pkg.skin.lutou;
      }
      if (!path) {
        path = pkg.skin.standard;
      }
      return path;
    };
    //将某个文件路径抹除扩展名。如file.txt -> file
    // @ts-ignore
    game.qhly_earse_ext = function (path) {
      if (!path) return path;
      var foundDot = path.lastIndexOf('.');
      if (foundDot < 0) return path;
      return path.slice(0, foundDot);
    };

    // @ts-ignore
    game.qhly_readFileAsText = function (path, callback) {
      // @ts-ignore
      game.qhly_checkFileExist(path, function (ret) {
        if (!ret) {
          if (callback) {
            callback(false);
          }
        } else {
          // @ts-ignore
          game.readFile(path, function (result) {
            if (callback) {
              if (lib.device) {
                var ret2 = String.fromCharCode.apply(null, new Uint8Array(result));
                callback(true, ret2);
              } else {
                callback(true, result.toString());
              }
            }
          }, function () {
            if (callback) {
              callback(false);
            }
          });
        }
      });
    };
    // @ts-ignore
    game.qhly_copyText = function(text){
      if(!navigator.clipboard){
        alert("你使用的游戏版本不支持复制字符串");
        return;
      }
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      navigator.clipboard.writeText(text).then(e => {
        alert("复制成功");
      });
    };
    // @ts-ignore
    game.qhly_writeTextFile = function (str, path, filename, callback) {
      if (lib.device) {
        // @ts-ignore
        game.ensureDirectory(path, function () {
          window.resolveLocalFileSystemURL(nonameInitialized + path, function (entry) {
            // @ts-ignore
            entry.getFile(filename, { create: true }, function (fileEntry) {
              fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function () {
                  if (callback) {
                    callback(false);
                  }
                }
                var textFileAsBlob = new Blob([str], { type: 'text/plain' });
                fileWriter.write(textFileAsBlob);
              });
            });
          });
        });
      } else if (typeof window.require == 'function') {
        // @ts-ignore
        game.ensureDirectory(path, function () {
          lib.node.fs.writeFile(__dirname + '/' + path + '/' + filename, str, null, callback);
        });
      }
    };

    // @ts-ignore
    game.qhly_writeImageFile = function (str, path, filename, callback) {
      if (lib.device) {
        // @ts-ignore
        game.ensureDirectory(path, function () {
          window.resolveLocalFileSystemURL(nonameInitialized + path, function (entry) {
            // @ts-ignore
            entry.getFile(filename, { create: true }, function (fileEntry) {
              fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function () {
                  if (callback) {
                    callback(false);
                  }
                }
                var textFileAsBlob = new Blob([str], { type: 'image/png' });
                fileWriter.write(textFileAsBlob);
              });
            });
          });
        });
      } else if (typeof window.require == 'function') {
        const reader = new FileReader();
        reader.readAsArrayBuffer(str);
        reader.onload = () => {
          const arr = reader.result;
          // @ts-ignore
          game.ensureDirectory(path, function () {
            // @ts-ignore
            lib.node.fs.writeFile(__dirname + '/' + path + '/' + filename, Buffer.from(arr), null, callback);
          });
        }
      }
    };
    // @ts-ignore
    game.qhly_dom2image = function (from, name, node, path, state) {
      var zoom;
      switch (lib.config.ui_zoom) {
        case 'esmall': zoom = 0.8; break;
        case 'vsmall': zoom = 0.9; break;
        case 'small': zoom = 0.93; break;
        case 'big': zoom = 1.05; break;
        case 'vbig': zoom = 1.1; break;
        case 'ebig': zoom = 1.2; break;
        default: zoom = 1;
      }
      // @ts-ignore
      game.documentZoom = game.deviceZoom * 0.8;
      ui.updatez();
      const parent = node.parentNode;
      // @ts-ignore
      const realName = game.qhly_getRealName(name);
      const bg = ui.create.div('.qh-domtoimagebg', document.body);
      const text = ui.create.div('.qh-domtoimagenode', bg,);
      text.innerHTML = '观察左边动皮运行到满意状态时<br>点击下方“生成”按钮<br>黑框内为最终静皮采样范围<br>';
      text.innerHTML += '长按动皮可进行调整\t\t<button id=qh-d2icreate>生成</button>\t\t<button id=qh-d2icancel>取消</button>';
      // const player = game.qhly_getCurrentPlayer(name)[0][0];
      // const change = from ? from : player.node.avatar;
      const bg2 = ui.create.div('.qh-domtoimagebg2', bg);
      const bg4 = ui.create.div('.qh-domtoimagebg4', bg2);
      // @ts-ignore
      bg4.$dynamicWrap = ui.create.div('.qh-domtoimagebg3', bg4);
      let timer = null;
      bg2.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function () {
        timer = setTimeout(function () {
          // @ts-ignore
          if (_status.bigEditing) return;
          // @ts-ignore
          game.qhly_bigEdit({ name: name, mainView: { avatarImage: bg4, nopoints: bg2 } }, bg);
        }, 800);
      });
      bg2.addEventListener(lib.config.touchscreen ? "touchmove" : 'mousemove', function () {
        clearTimeout(timer);
      });
      bg2.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", function () {
        clearTimeout(timer);
      });
      if (!lib.config.qhly_lutou) {
        // @ts-ignore
        bg4.$dynamicWrap.style.setProperty('--h', '472px');
        // @ts-ignore
        bg4.$dynamicWrap.classList.add('standard');
      }
      else if (lib.config.qhly_lutouType && lib.config.qhly_lutouType == 'shousha') {
        bg2.style.setProperty('--w', '276px');
        bg2.style.setProperty('--h', '506px');
        // @ts-ignore
        bg4.$dynamicWrap.style.setProperty('--w', '276px');
        // @ts-ignore
        bg4.$dynamicWrap.style.setProperty('--h', '442px');
        // @ts-ignore
        bg4.$dynamicWrap.style.setProperty('--l', '0px');
        // @ts-ignore
        bg4.$dynamicWrap.style.setProperty('--l', '0px');
        // @ts-ignore
        bg4.$dynamicWrap.classList.add('shousha');
      }
      const fileName = parent.belowText.innerText.split('*')[0];
      // @ts-ignore
      game.qhly_changeDynamicSkin(bg4, fileName, name);
      const btn1 = document.getElementById('qh-d2icreate');
      // @ts-ignore
      btn1.onclick = function () {
        text.innerHTML = '正在生成静皮，请稍后。。。<br>请勿进行其他操作！！！<br>（依据机器性能不同，<br>此过程可能耗费较长时间）';
        // @ts-ignore
        window.qhly_d2i.toBlob(bg4).then(function (url) {
          // @ts-ignore
          game.qhly_writeImageFile(url, path + realName + '/', fileName + '.jpg', function () {
            //parent.insertBefore(that, sibling);
            parent.toImageBtn.setAttribute('single', false);
            // @ts-ignore
            const file = game.qhly_getSkinFile(name, fileName + '.jpg');
            parent.avatar.qhly_origin_setBackgroundImage(file);
            parent.dynamicToggle && parent.dynamicToggle.setAttribute('toggle', true);
            if (state) {
              if (state.pkg.isExt) {
                // @ts-ignore
                if (realName != name && fileName != '经典形象') path = DEFAULT_PACKAGE.skin.standard;
              }
              if (state.mainView.dynamicToggle) state.mainView.dynamicToggle.setAttribute('toggle', true);
              // @ts-ignore
              if (game.qhly_skinIs(name, fileName + '.jpg')) game.qhly_setOriginSkin(name, fileName + '.jpg', state.mainView.avatarImage, state, game.qhly_getPlayerStatus(state.mainView.avatarImage, null, state.name) == 2);
            }
            // @ts-ignore
            if (from && game.qhly_skinIs(name, fileName + '.jpg')) from.qhly_origin_setBackgroundImage(file);
            // @ts-ignore
            if (_status.qhly_skinListCache && _status.qhly_skinListCache[name]) delete _status.qhly_skinListCache[name];
            exit();
          })
        });
      }
      function exit() {
        // @ts-ignore
        bg4.stopDynamic();
        // @ts-ignore
        if (bg4.dynamic && bg4.dynamic.renderer.postMessage) {
          // @ts-ignore
          bg4.dynamic.renderer.postMessage({
            message: "DESTROY",
            // @ts-ignore
            id: bg4.dynamic.id,
          })
          // @ts-ignore
          bg4.dynamic.renderer.capacity--;
        }
        // @ts-ignore
        game.documentZoom = game.deviceZoom * zoom;
        ui.updatez();
        bg.remove();
      }
      const btn2 = document.getElementById('qh-d2icancel');
      // @ts-ignore
      btn2.onclick = exit;
    }

    // @ts-ignore
    game.qhly_isForbidEditTaici = function (name) {
      // @ts-ignore
      var pkg = game.qhly_foundPackage(name);
      if (pkg && pkg.forbidEditTaici) {
        if (typeof pkg.forbidEditTaici == 'function') {
          return pkg.forbidEditTaici(name);
        }
        return pkg.forbidEditTaici;
      }
      return false;
    };
    // @ts-ignore
    game.qhly_getViewSkills = function (name) {
      var viewSkills = [];
      var skills = get.character(name, 3);
      for (var skill of skills) {
        var info = get.info(skill);
        if (!info || info.nopop || !get.translation(skill + '_info') || !lib.skill[skill]) continue;
        viewSkills.add(skill);
        if (info.derivation) {
          if (typeof info.derivation === 'string' && lib.skill[info.derivation]) viewSkills.add(info.derivation);
          else {
            for (var s of info.derivation) {
              if (lib.skill[s]) viewSkills.add(s);
            }
          }
        }
      }
      return viewSkills;
    }
    //设置当前的皮肤。
    // @ts-ignore
    game.qhly_setCurrentSkin = function (name, skin, callback, save) {
      if (name.indexOf('gz_') == 0) {//国战兼容
        // @ts-ignore
        if (lib.config.qhly_guozhan === false || get.mode() != 'guozhan' || !game.qhly_hasGuozhanSkin(name)) {
          const subname = name.slice(3);
          if (get.character(subname)) {
            name = subname;
          }
        }
      }
      // @ts-ignore
      const realName = game.qhly_getRealName(name);//添加皮肤共享
      // @ts-ignore
      const [skinPackage, skinPackage2] = [game.qhly_foundPackage(realName), game.qhly_foundPackage(name)];
      let extAudioPath = skinPackage2.audioOrigin;
      if (typeof extAudioPath == 'function') extAudioPath = extAudioPath(name);
      if (skin) {
        if (game.getFileList) {
          let path;
          // @ts-ignore
          if (window.qhly_audio_redirect && window.qhly_audio_redirect[realName + "-" + game.qhly_earse_ext(skin)]) {
            // @ts-ignore
            path = skinPackage.audio + realName + "/" + window.qhly_audio_redirect[realName + "-" + game.qhly_earse_ext(skin)];
          } else {
            path = skinPackage.audio + realName + "/" + skin;
            // @ts-ignore
            path = game.qhly_earse_ext(path);
          }
          // @ts-ignore
          game.qhly_checkFileExist(path, function (success) {
            if (success) {
              // @ts-ignore
              // @ts-ignore
              // @ts-ignore
              game.getFileList(path, function (folders, files) {
                if (files.includes('audio-redirect.js')) {
                  lib.init.js(lib.assetURL + path + '/audio-redirect.js', null, function () {
                    // @ts-ignore
                    game.qhly_setCurrentSkin(name, skin, callback);
                  });
                  return;
                }
                let arr = [];
                let list = lib.config.qhly_skinset.skinAudioList[name];
                // @ts-ignore
                let diePath = game.qhly_getDieAudioOriginalPath(name);
                if (list) {
                  for (let m of list) {
                    if (skinPackage2.isExt && m.indexOf('skill/') == 0) {
                      delete lib.config.qhly_skinset.audioReplace["../" + extAudioPath + m.slice(6)];
                    }
                    else delete lib.config.qhly_skinset.audioReplace[m];//删除原有的音频映射。
                  }
                }
                if (skinPackage2.isExt) {
                  delete lib.config.qhly_skinset.audioReplace["../" + extAudioPath + name];
                  delete lib.config.qhly_skinset.audioReplace[diePath];
                  delete lib.config.qhly_skinset.audioReplace["../" + extAudioPath + 'victory'];
                  delete lib.config.qhly_skinset.audioReplace["../" + skinPackage2.audio + name + '/victory'];
                }
                else {
                  delete lib.config.qhly_skinset.audioReplace['die/' + name];
                  delete lib.config.qhly_skinset.audioReplace[diePath];
                  delete lib.config.qhly_skinset.audioReplace['victory/' + name];
                }
                for (let file of files) {
                  // @ts-ignore
                  file = game.qhly_earse_ext(file);
                  if (!skinPackage.isExt || realName != name) {
                    if (file == realName) {
                      arr.push(diePath);
                      if (skinPackage2.isExt) lib.config.qhly_skinset.audioReplace[diePath] = "../" + path + "/" + realName;
                      else lib.config.qhly_skinset.audioReplace[diePath] = "../" + path + "/" + realName;
                    } else if (file == 'victory') {
                      arr.push("victory/" + name);
                      if (skinPackage2.isExt) lib.config.qhly_skinset.audioReplace["../" + path + '/victory'] = "../" + path + '/victory';
                      else lib.config.qhly_skinset.audioReplace["victory/" + name] = "../" + path + "/victory";
                    } else {
                      let skills = [], file2 = '', skillAudio = '', flag = false;
                      let str = file;
                      let fileNum = file.charAt(file.length - 1);
                      // @ts-ignore
                      if (isNaN(fileNum)) {
                        str = file;
                        fileNum = ''
                      }
                      else str = file.slice(0, file.length - 1);
                      // @ts-ignore
                      if (lib.qhly_skinShare[name] && lib.qhly_skinShare[name].skills) {
                        if (lib.character[name]) {
                          // @ts-ignore
                          skills = game.qhly_getViewSkills(name);
                          for (let i of skills) {
                            // @ts-ignore
                            if (lib.qhly_skinShare[name].skills[i]) {
                              // @ts-ignore
                              skillAudio = game.qhly_getSkillAudioName(i, { name: name })
                              // @ts-ignore
                              file2 = game.qhly_getSkillAudioName(lib.qhly_skinShare[name].skills[i], { name: realName });

                              if (file2 == str) {
                                arr.push("skill/" + skillAudio + fileNum);
                                flag = true;
                                break;
                              }
                            }
                          }
                          if (!flag) arr.push("skill/" + file);
                        }
                      }
                      else arr.push("skill/" + file);//创建音频映射。
                      if (skinPackage2.isExt) {
                        if (file2) {
                          lib.config.qhly_skinset.audioReplace["../" + extAudioPath + skillAudio + fileNum] = "../" + path + "/" + file;
                        }
                        else lib.config.qhly_skinset.audioReplace["../" + extAudioPath + file] = "../" + path + "/" + file;
                      }
                      else {
                        if (file2) {
                          lib.config.qhly_skinset.audioReplace["skill/" + skillAudio + fileNum] = "../" + path + "/" + file;
                        }
                        else lib.config.qhly_skinset.audioReplace["skill/" + file] = "../" + path + "/" + file;
                      }
                    }
                  } else {
                    let audioOrigin = skinPackage.audioOrigin;
                    if (typeof audioOrigin == 'function') {
                      audioOrigin = audioOrigin(name);
                    }
                    if(file == name){
                      // @ts-ignore
                      var diePathOrigin = game.qhly_getDieAudioOriginalPath(name);
                      arr.push(diePathOrigin);
                      lib.config.qhly_skinset.audioReplace[diePathOrigin] = "../" + path + "/" + file;
                    }else{
                      arr.push("../" + audioOrigin + file);
                      lib.config.qhly_skinset.audioReplace["../" + audioOrigin + file] = "../" + path + "/" + file;
                    }
                    //lib.config.qhly_skinset.audioReplace["../" + audioOrigin + file] = "../" + path + "/" + file;
                  }
                }
                lib.config.qhly_skinset.skinAudioList[name] = arr;
                lib.config.qhly_skinset.skin[name] = skin;
                // @ts-ignore
                game.qhlySyncConfig();
                // @ts-ignore
                if (save) game.qhly_refresh(name, skin);
                if(lib.announce){
                  // @ts-ignore
                  lib.announce.publish('qhlyChangeSkin',{
                    characterName:name,
                    skinName:skin,
                  });
                }
                // @ts-ignore
                if (lib.qhly_callbackList) {
                  // @ts-ignore
                  for (var pubCallback of lib.qhly_callbackList) {
                    if (pubCallback.onChangeSkin) {
                      pubCallback.onChangeSkin(name, skin);
                    }
                  }
                }
                if (callback) {
                  callback();
                }
              });
            } else {
              let arr = [];
              let list = lib.config.qhly_skinset.skinAudioList[name];
              if (list) {
                for (let m of list) {
                  delete lib.config.qhly_skinset.audioReplace[m];
                }
              }
              //delete lib.config.qhly_skinset.audioReplace['die/' + name];
              // @ts-ignore
              delete lib.config.qhly_skinset.audioReplace[game.qhly_getDieAudioOriginalPath(name)];
              //delete lib.config.qhly_skinset.audioReplace['victory/' + name];
              lib.config.qhly_skinset.skinAudioList[name] = arr;
              lib.config.qhly_skinset.skin[name] = skin;
              // @ts-ignore
              game.qhlySyncConfig();
              // @ts-ignore
              if (save) game.qhly_refresh(name, skin);
              if(lib.announce){
                // @ts-ignore
                lib.announce.publish('qhlyChangeSkin',{
                  characterName:name,
                  skinName:skin,
                });
              }
              // @ts-ignore
              if (lib.qhly_callbackList) {
                // @ts-ignore
                for (let pubCallback of lib.qhly_callbackList) {
                  if (pubCallback.onChangeSkin) {
                    pubCallback.onChangeSkin(name, skin);
                  }
                }
              }
              if (callback) {
                callback();
              }
            }
          });
        } else {
          alert("尚未加载完成！");
        }
      } else {
        let list = lib.config.qhly_skinset.skinAudioList[name];
        if (list) {
          for (let m of list) {
            if (skinPackage2.isExt) delete lib.config.qhly_skinset.audioReplace["../" + extAudioPath + m.slice(6)];
            delete lib.config.qhly_skinset.audioReplace[m];
          }
        }
        if (skinPackage2.isExt) {
          delete lib.config.qhly_skinset.audioReplace["../" + extAudioPath + name];
          delete lib.config.qhly_skinset.audioReplace["../" + extAudioPath + 'victory'];
          delete lib.config.qhly_skinset.audioReplace["../" + skinPackage2.audio + name + '/victory'];
          lib.config.qhly_skinset.audioReplace["../" + skinPackage2.audio + name + '/victory'] = "../" + skinPackage.audio + realName + "/victory";
        }
        else {
          delete lib.config.qhly_skinset.audioReplace['die/' + name];
          delete lib.config.qhly_skinset.audioReplace['victory/' + name];
          lib.config.qhly_skinset.audioReplace["victory/" + name] = "../" + skinPackage.audio + realName + '/victory';
        }
        delete lib.config.qhly_skinset.skin[name];
        delete lib.config.qhly_skinset.skinAudioList[name];
        // @ts-ignore
        game.qhlySyncConfig();
        // @ts-ignore
        if (save) game.qhly_refresh(name, skin);
        if(lib.announce){
          // @ts-ignore
          lib.announce.publish('qhlyChangeSkin',{
            characterName:name,
            skinName:skin,
          });
        }
        // @ts-ignore
        if (lib.qhly_callbackList) {
          // @ts-ignore
          for (let pubCallback of lib.qhly_callbackList) {
            if (pubCallback.onChangeSkin) {
              pubCallback.onChangeSkin(name, skin);
            }
          }
        }
        if (callback) {
          callback();
        }
      }
    };
    // @ts-ignore
    get.qhly_getCurrentViewSkinValue = function (name, fallback) {
      // @ts-ignore
      var skin = lib.qhly_viewskin[lib.config.qhly_currentViewSkin];
      if (!skin) return fallback;
      if (!skin[name]) return fallback;
      return skin[name];
    };
    // @ts-ignore
    game.qhly_getDieAudioOriginalPath = function(name){
      if(lib.character[name]&&lib.character[name][4].some(tag=>/^die:.+$/.test(tag))){
        const tag=lib.character[name][4].find(tag=>/^die:.+$/.test(tag));
        const reg=new RegExp("^ext:(.+)?/");
        const match=tag.match(/^die:(.+)$/);
        if(match){
          let path=match[1];
          if(reg.test(path)) path=path.replace(reg,(_o,p)=>`../extension/${p}/`);
          return path;
        }
      }
      // @ts-ignore
      var skinPackage = game.qhly_foundPackage(name);
      if (skinPackage.isExt) {
        var path = skinPackage.audioOrigin;
        if (typeof path == 'function') {
          path = path(name);
        }
        path = path + name;
        return "../"+path;
      } else {
        /*
        _status.qhly_audioTry = game.playAudio("die", name, function () {
          _status.qhly_audioTry = game.playAudio('die', name.slice(name.indexOf('_') + 1));
        });*/
        return "die/"+name;
      }
    };
    //播放死亡配音。
    // @ts-ignore
    window.qhly_playDieAudio = function (name) {
      // @ts-ignore
      if (_status.qhly_audioTry) _status.qhly_audioTry.remove();
      if(lib.character[name]&&lib.character[name][4].some(tag=>/^die:.+$/.test(tag))){
        const tag=lib.character[name][4].find(tag=>/^die:.+$/.test(tag));
        const reg=new RegExp("^ext:(.+)?/");
        const match=tag.match(/^die:(.+)$/);
        if(match){
          let path=match[1];
          if(reg.test(path)) path=path.replace(reg,(_o,p)=>`../extension/${p}/`);
          // @ts-ignore
          _status.qhly_audioTry = game.playAudio(path);
          return;
        }
      }
      // taffy: 修复千幻聆音不检测die tag的问题
      else if (lib.character[name] && lib.character[name][4].some(tag => tag.startsWith('die'))) {
        var tag = lib.character[name][4].find(tag => tag.startsWith('die'));
        var list = tag.split(':').slice(1);
        _status.qhly_audioTry = game.playAudio('die', list.length ? list[0] : name);
        return;
      }
      /* taffy分界线 */
      // @ts-ignore
      var skinPackage = game.qhly_foundPackage(name);
      if (skinPackage.isExt) {
        var path = skinPackage.audioOrigin;
        if (typeof path == 'function') {
          path = path(name);
        }
        path = path + name;
        var arr = path.split("/");
        var params = [".."];
        params.addArray(arr);
        // @ts-ignore
        _status.qhly_audioTry = game.playAudio.apply(game, params);
      } else {
        // @ts-ignore
        _status.qhly_audioTry = game.playAudio("die", name, function () {
          // @ts-ignore
          _status.qhly_audioTry = game.playAudio('die', name.slice(name.indexOf('_') + 1));
        });
      }
    };
    //播放胜利配音。
    // @ts-ignore
    window.qhly_playVictoryAudio = function (name) {
      // @ts-ignore
      var skinName = game.qhly_earse_ext(game.qhly_getSkin(name));
      // @ts-ignore
      if (_status.qhly_audioTry) _status.qhly_audioTry.remove();
      // @ts-ignore
      var skinPackage = game.qhly_foundPackage(name);
      if (skinPackage.isExt) {
        var path = skinPackage.audio;
        if (typeof path == 'function') {
          path = path(name);
        }
        path = path + name;
        if (skinName) path = path + '/' + skinName;
        path += '/victory';
        var arr = path.split("/");
        var params = [".."];
        params.addArray(arr);
        // @ts-ignore
        _status.qhly_audioTry = game.playAudio.apply(game, params);
      } else {
        // @ts-ignore
        _status.qhly_audioTry = game.playAudio("victory", name, function () {
          // @ts-ignore
          _status.qhly_audioTry = game.playAudio('victory', name.slice(name.indexOf('_') + 1));
        });
      }
    };

    // @ts-ignore
    game.qhly_getSkillAudioName = function (skill, player) {//获取技能播放的技能语音名
      var info = get.info(skill);
      if (!info) return null;
      var audioname = skill;
      if (info.audioname2 && info.audioname2[player.name]) {
        audioname = info.audioname2[player.name];
        info = lib.skill[audioname];
      }
      var audioinfo = info.audio;
      if (typeof audioinfo == 'string' && lib.skill[audioinfo]) {
        audioname = audioinfo;
        audioinfo = lib.skill[audioname].audio;
      }
      if (typeof audioinfo == 'string') {
        if (audioinfo.indexOf('ext:') == 0) {
          // @ts-ignore
          audioinfo = audioinfo.split(':');
          // @ts-ignore
          if (audioinfo.length == 3) return audioname;

        }
      }
      else if (Array.isArray(audioinfo)) {
        audioname = audioinfo[0];
        audioinfo = audioinfo[1];
      }
      if (Array.isArray(info.audioname) && player) {
        if (info.audioname.includes(player.name)) {
          audioname += '_' + player.name;
        }
        else if (info.audioname.includes(player.name1)) {
          audioname += '_' + player.name1;
        }
        else if (info.audioname.includes(player.name2)) {
          audioname += '_' + player.name2;
        }
      }
      if (audioinfo) return audioname;
      else if (info.audio !== false) return audioname;
    }
    // @ts-ignore
    window.qhly_getSkillAudioKey=function(skill,player,which){
      var info = get.info(skill);
      if (!info) return "";
      if (true) {
        var audioname = skill;
        if (info.audioname2 && info.audioname2[player.name]) {
          audioname = info.audioname2[player.name];
          info = lib.skill[audioname];
        }
        var audioinfo = info.audio;
        if (typeof audioinfo == 'string' && lib.skill[audioinfo]) {
          audioname = audioinfo;
          audioinfo = lib.skill[audioname].audio;
        }
        if (typeof audioinfo == 'string') {
          if (audioinfo.indexOf('ext:') == 0) {
            // @ts-ignore
            audioinfo = audioinfo.split(':');
            // @ts-ignore
            if (audioinfo.length == 3) {
              // @ts-ignore
              if (audioinfo[2] == 'true') {
                // @ts-ignore
                return "../extension/"+audioinfo[1]+"/"+audioname;
              }
              else {
                // @ts-ignore
                audioinfo[2] = parseInt(audioinfo[2]);
                // @ts-ignore
                if (audioinfo[2]) {
                  if (typeof which == 'number') {
                    // @ts-ignore
                    return "../extension/"+audioinfo[1]+"/"+audioname+(which % audioinfo[2] + 1);
                  } else {
                    // @ts-ignore
                    return "../extension/"+audioinfo[1]+"/"+audioname+Math.ceil(audioinfo[2] * Math.random());
                  }
                }
              }
            }
            return "";
          }
        }
        else if (Array.isArray(audioinfo)) {
          audioname = audioinfo[0];
          audioinfo = audioinfo[1];
        }
        if (Array.isArray(info.audioname) && player) {
          if (info.audioname.includes(player.name)) {
            audioname += '_' + player.name;
          }
          else if (info.audioname.includes(player.name1)) {
            audioname += '_' + player.name1;
          }
          else if (info.audioname.includes(player.name2)) {
            audioname += '_' + player.name2;
          }
        }
        if (typeof audioinfo == 'number') {
          if (typeof which == 'number') {
            //alert('4');
            return "skill"+"/"+ audioname + (which % audioinfo + 1);
          } else {
            //alert('5');
            return "skill/"+audioname + Math.ceil(audioinfo * Math.random());
          }
        }
        else if (audioinfo) {
          //alert('6');
          return "skill/"+audioname;
        }
        else if (true && info.audio !== false) {
          return "skill/"+audioname;
        }
      }
      return "";
    };
    //播放技能语音。
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    window.qhly_TrySkillAudio = function (skill, player, directaudio, which, skin) {
      //alert(skill+" "+player.name);
      // @ts-ignore
      if (_status.qhly_viewRefreshing) return;
      var info = get.info(skill);
      if (!info) return;
      // @ts-ignore
      _status.qhly_previewAudio = true;
      if (true) {
        var audioname = skill;
        if (info.audioname2 && info.audioname2[player.name]) {
          audioname = info.audioname2[player.name];
          info = lib.skill[audioname];
        }
        var audioinfo = info.audio;
        if (typeof audioinfo == 'string' && lib.skill[audioinfo]) {
          audioname = audioinfo;
          audioinfo = lib.skill[audioname].audio;
        }
        if (typeof audioinfo == 'string') {
          if (audioinfo.indexOf('ext:') == 0) {
            // @ts-ignore
            audioinfo = audioinfo.split(':');
            // @ts-ignore
            if (audioinfo.length == 3) {
              // @ts-ignore
              if (audioinfo[2] == 'true') {
                // @ts-ignore
                game.playAudio('..', 'extension', audioinfo[1], audioname);
              }
              else {
                // @ts-ignore
                audioinfo[2] = parseInt(audioinfo[2]);
                // @ts-ignore
                if (audioinfo[2]) {
                  if (typeof which == 'number') {
                    // @ts-ignore
                    game.playAudio('..', 'extension', audioinfo[1], audioname + (which % audioinfo[2] + 1));
                  } else {
                    //4VrLPyXM/UwVl3SXOMoDpBLQcoJHwBtPcxBNF1VM6oxC7qONebCO4KekZdetP8Zs
                    // @ts-ignore
                    game.playAudio('..', 'extension', audioinfo[1], audioname + Math.ceil(audioinfo[2] * Math.random()));
                  }
                }
              }
            }
            // @ts-ignore
            delete _status.qhly_previewAudio;
            return;
          }
        }
        else if (Array.isArray(audioinfo)) {
          audioname = audioinfo[0];
          audioinfo = audioinfo[1];
        }
        if (Array.isArray(info.audioname) && player) {
          if (info.audioname.includes(player.name)) {
            audioname += '_' + player.name;
          }
          else if (info.audioname.includes(player.name1)) {
            audioname += '_' + player.name1;
          }
          else if (info.audioname.includes(player.name2)) {
            audioname += '_' + player.name2;
          }
        }
        if (typeof audioinfo == 'number') {
          if (typeof which == 'number') {
            //alert('4');
            game.playAudio('skill', audioname + (which % audioinfo + 1));
          } else {
            //alert('5');
            game.playAudio('skill', audioname + Math.ceil(audioinfo * Math.random()));
          }
        }
        else if (audioinfo) {
          //alert('6');
          game.playAudio('skill', audioname);
        }
        else if (true && info.audio !== false) {
          game.playSkillAudio(audioname);
        }
      }
    };
    // @ts-ignore
    get.qhly_characterInfo = function (name) {
      var ret = '';
      // @ts-ignore
      for (var obj of lib.qhlypkg) {
        if (obj.characterInfo) {
          var m = obj.characterInfo(name);
          if (m) {
            ret += m;
            ret += "<br><br>";
          }
        }
      }
      if (ret.length == 0) {
        ret = "<br><br>" + get.characterIntro(name) + "<br><br><br>";
      }
      return ret;
    }

    // @ts-ignore
    lib.qhly_getEventPosition = function (event) {
      var x = event.clientX;
      var y = event.clientY;
      if (lib.config.touchscreen && event.touches && event.touches.length) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
      }
      // @ts-ignore
      return { x: x / game.documentZoom, y: y / game.documentZoom };
    };
    // @ts-ignore
    lib.qhly_computeDistance = function (x0, y0, x1, y1) {
      var dx = x0 - x1;
      var dy = y0 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    };
    // @ts-ignore
    lib.qhly_setPosition = function (div, x, y) {
      div.style.left = x.toFixed(3) + 'px';
      div.style.top = y.toFixed(3) + 'px';
    };
    // @ts-ignore
    game.qhly_open_small_dragon = function (name, from, ingame) {
      // @ts-ignore
      if (_status.qhly_open) return;
      // @ts-ignore
      _status.qhly_open = true;
      // @ts-ignore
      game.qhly_playQhlyAudio('qhly_voc_click3', null, true);
      var baseHeight = ui.window.offsetHeight * 0.7;
      if (lib.config.qhly_dragonsize) {
        baseHeight = baseHeight * parseFloat(lib.config.qhly_dragonsize);
      }
      // @ts-ignore
      baseHeight = baseHeight.toFixed(3);
      var background = ui.create.div('.qhly-dragonwin-out');
      document.body.appendChild(background);
      var dragonwin = ui.create.div('.qhly-dragonback');
      ui.create.div('.qhly-dragonback-backgroundimage', dragonwin);
      var dragonhead = ui.create.div('.qhly-dragonhead');
      dragonwin.style.height = baseHeight + 'px';
      dragonwin.style.width = baseHeight + 'px';
      if (lib.config.qhly_dragonlocation && lib.config.qhly_dragonlocation != 'center') {
        dragonwin.style.transform = 'translate(0%, 0%)';
        if (lib.config.qhly_dragonlocation == 'head') {
          var player = from;
          if (!player) {
            var players = game.players.slice(0);
            players.addArray(game.dead);
            players = players.filter(function (current) {
              return current.name == name || current.name1 == name || current.name2 == name;
            });
            if (players.length) {
              player = players[0];
            }
          }
          if (player) {
            var rect = player.getBoundingClientRect();
            // @ts-ignore
            rect = game.qhly_handleRect(rect);
            var posx = rect.left - baseHeight / 2 + rect.width / 2;
            var posy = rect.top - baseHeight / 2 + rect.height / 2;
            //lib.qhly_setPosition(dragonhead,posx,posy);
            // @ts-ignore
            lib.qhly_setPosition(dragonwin, posx, posy);
          } else {
            dragonwin.style.left = 'calc(50% - ' + (baseHeight / 2).toFixed(2) + 'px)';
            dragonwin.style.top = 'calc(50% - ' + (baseHeight / 2).toFixed(2) + 'px)';
            //dragonhead.style.left = 'calc(50% - '+(baseHeight/2).toFixed(2)+'px)';
            //dragonhead.style.top = 'calc(50% - '+(baseHeight/2).toFixed(2)+'px)';
          }
        } else {
          if (!lib.config.qhly_dragonlocationValue) {
            dragonwin.style.left = 'calc(50% - ' + (baseHeight / 2).toFixed(2) + 'px)';
            dragonwin.style.top = 'calc(50% - ' + (baseHeight / 2).toFixed(2) + 'px)';
            //dragonhead.style.left = 'calc(50% - '+(baseHeight/2).toFixed(2)+'px)';
            //dragonhead.style.top = 'calc(50% - '+(baseHeight/2).toFixed(2)+'px)';
          } else {
            dragonwin.style.left = lib.config.qhly_dragonlocationValue.x;
            dragonwin.style.top = lib.config.qhly_dragonlocationValue.y;
            //dragonhead.style.left = lib.config.qhly_dragonlocationValue.x;
            //dragonhead.style.top = lib.config.qhly_dragonlocationValue.y;
          }
        }
      }
      background.appendChild(dragonwin);
      dragonwin.appendChild(dragonhead);
      var state = {
        preclicktime: 0,
        lastSpinTime: 0,
        skinWidthRate: 0.20754,
        skinHeightRate: 0.23095,
        curAngle: 0,
        visibleAngleStart: -180,
        visibleAngleEnd: 180,
        fadeAngleAreaStart: -160,
        fadeAngleAreaEnd: 160,
        skinCircleRaduisRate: 0.23017,
        skins: [],
        skinViews: [],
        skinOrder: function (view) {
          if (view.skinOrder === undefined) {
            for (var i = 0; i < this.skinViews.length; i++) {
              // @ts-ignore
              this.skinViews[i].skinOrder = i;
            }
          }
          return view.skinOrder;
        },
        angleLocationOf: function (view) {
          return this.curAngle + this.skinOrder(view) * this.perAngle();
        },
        perAngle: function () {
          if (this.skins.length >= 8 || this.skins.length <= 1) {
            return 45;
          }
          return 360 / this.skins.length;
        },
        refreshSkins: function () {
          for (var skinView of this.skinViews) {
            this.refreshLocation(skinView);
          }
        },
        handleRect: function (rect) {
          // @ts-ignore
          if (game.qhly_hasExtension('十周年UI')) return rect;
          return {
            // @ts-ignore
            width: rect.width / game.documentZoom,
            // @ts-ignore
            height: rect.height / game.documentZoom,
            // @ts-ignore
            left: rect.left / game.documentZoom,
            // @ts-ignore
            top: rect.top / game.documentZoom,
          };
        },
        refreshLocation: function (view) {
          if (!this.isVisible(view)) {
            view.hide();
            return;
          } else {
            view.show();
          }
          var rect = dragonwin.getBoundingClientRect();
          rect = this.handleRect(rect);
          var opacity = this.opacity(view);
          view.style.opacity = opacity;
          var angleLocation = this.angleLocationOf(view);
          var radius = this.skinCircleRaduisRate * rect.width;
          var angleArc = angleLocation / 180 * Math.PI;
          var xFromCenter = radius * Math.sin(angleArc);
          var yFromCenter = radius * Math.cos(angleArc);
          var x = xFromCenter + rect.width / 2 - this.skinWidthRate * rect.width / 2;
          var y = yFromCenter + rect.height / 2 - this.skinHeightRate * rect.width / 2;
          view.style.left = x.toFixed(3) + 'px';
          view.style.top = y.toFixed(3) + 'px';
          view.style.width = (this.skinWidthRate * rect.width).toFixed(3) + 'px';
          view.style.height = (this.skinHeightRate * rect.height).toFixed(3) + 'px';
          var skin = this.skins[this.skinOrder(view)];
          // @ts-ignore
          var currentSkinId = game.qhly_getSkin(name);
          if (skin == currentSkinId || (!skin && !currentSkinId)) {
            view.setBackgroundImage('extension/千幻聆音/theme/shuimo/newui_skin_background_shuimo.png');
          } else {
            view.setBackgroundImage('');
          }
        },
        isVisible: function (view) {
          if (this.skins.length <= 8) return true;
          var angle = this.angleLocationOf(view);
          return angle >= this.visibleAngleStart && angle <= this.visibleAngleEnd;
        },
        opacity: function (view) {
          if (!this.isVisible(view)) return 0;
          if (this.skins.length <= 8) return 1;
          var angle = this.angleLocationOf(view);
          if (angle > this.fadeAngleAreaStart && angle < this.fadeAngleAreaEnd) {
            return 1;
          }
          if (angle < this.fadeAngleAreaStart) {
            return Math.abs((angle - this.fadeAngleAreaStart) / (this.visibleAngleStart - this.fadeAngleAreaStart)) / 2;
          }
          return Math.abs((angle - this.fadeAngleAreaEnd) / (this.visibleAngleEnd - this.fadeAngleAreaEnd)) / 2;
        },
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        onClickSkin: function (event, name, skin, skinView) {
          if (this.opacity(skinView) != 1) return;
          // @ts-ignore
          var currentSkinId = game.qhly_getSkin(name);
          if (skin == currentSkinId || (!skin && !currentSkinId)) {
            return;
          }
          // @ts-ignore
          game.qhly_setCurrentSkin(name, skin, function () {
            // @ts-ignore
            game.qhly_playQhlyAudio('qhly_voc_click2', null, true);
            this.refresh();
            if (lib.config.qhly_smallwinclosewhenchange) {
              background.delete();
              // @ts-ignore
              _status.qhly_open = false;
            }
          }.bind(this), true);
        },
        refresh: function () {
          this.refreshSkins();
        },
        maxAngle: function () {
          return 0;
        },
        minAngle: function () {
          return -(this.skins.length - 1) * this.perAngle();
        },
        onSpinBegin: function (e) {
          // @ts-ignore
          var pos = lib.qhly_getEventPosition(e);
          var rect = dragonwin.getBoundingClientRect();
          rect = this.handleRect(rect);
          var centerX = rect.left + rect.width / 2;
          var centerY = rect.top + rect.height / 2;
          // @ts-ignore
          var distance = lib.qhly_computeDistance(pos.x, pos.y, centerX, centerY);
          if (distance >= rect.width * 0.1717 && distance < rect.width * 0.3758) {
            e.stopPropagation();
            delete this.spinDirection;
            this.isSpin = true;
            this.spinStartPosition = pos;
            this.spinStartAngle = this.curAngle;
          }
        },
        computeSpinDirection: function (pos0, pos1) {
          var rect = dragonwin.getBoundingClientRect();
          rect = this.handleRect(rect);
          var centerX = rect.left + rect.width / 2;
          var centerY = rect.top + rect.height / 2;
          var posA = { x: pos0.x - centerX, y: pos0.y - centerY };
          var posB = { x: pos1.x - centerX, y: pos1.y - centerY };
          var toAngle = function (pos) {
            var cos = pos.x / Math.sqrt(pos.x * pos.x + pos.y * pos.y);
            if (pos.y > 0) return Math.acos(cos) / Math.PI * 180;
            return 360 - Math.acos(cos) / Math.PI * 180;
          };
          var angleA = toAngle(posA);
          var angleB = toAngle(posB);
          var ret = angleB - angleA;
          if (ret <= 180 && ret >= -180) {
            return ret;
          }
          if (ret < -180) return ret + 360;
          if (ret > 180) return ret - 360;
        },
        onSpinMove: function (e) {
          if (!this.isSpin) return;
          // @ts-ignore
          var pos = lib.qhly_getEventPosition(e);
          var direction = this.computeSpinDirection(this.spinStartPosition, pos);
          // @ts-ignore
          if (Math.abs(direction) >= 5) {
            this.lastSpinTime = (new Date()).valueOf();
          }
          // @ts-ignore
          var newCur = this.curAngle - direction;
          if (this.skins.length <= 8) {
            while (newCur < -180) {
              newCur += 360;
            }
            while (newCur > 180) {
              newCur -= 360;
            }
          } else {
            if (newCur > this.maxAngle()) {
              newCur = this.maxAngle();
            } else if (newCur < this.minAngle()) {
              newCur = this.minAngle();
            }
          }
          this.curAngle = newCur;
          this.spinStartPosition = pos;
          this.refresh();
        },
        onSpinEnd: function (e) {
          if (this.isSpin) {
            e.stopPropagation();
            delete this.isSpin;
          }
        },
        onSpinCancel: function (e) {
          if (this.isSpin) {
            e.stopPropagation();
            delete this.isSpin;
          }
        },
        init: function () {
          // @ts-ignore
          var currentSkinId = game.qhly_getSkin(name);
          if (!currentSkinId) {
            this.curAngle = -90;
          } else {
            for (var i = 0; i < this.skins.length; i++) {
              if (this.skins[i] == currentSkinId) {
                this.curAngle = -this.perAngle() * i;
                break;
              }
            }
          }
          if (this.skins.length <= 2) {
            this.skinWidthRate *= 1.35;
            this.skinHeightRate *= 1.35;
          } else if (this.skins.length <= 4) {
            this.skinWidthRate *= 1.2;
            this.skinHeightRate *= 1.2;
          }
          if (this.skins.length <= 8) {
            // @ts-ignore
            dragonhead.style.zIndex = 4;
          } else {
            // @ts-ignore
            dragonhead.style.zIndex = 10;
          }
          for (var i = 0; i < this.skins.length; i++) {
            var skinView = ui.create.div('.qhly-dragonskin');
            // @ts-ignore
            this.skinViews.push(skinView);
            var skinCover = ui.create.div('.qhly-dragonskincover', skinView);
            skinCover.classList.add('qh-not-replace')
            // @ts-ignore
            skinView.skinCover = skinCover;
            // @ts-ignore
            skinView.skinOrder = i;
            skinView.hide();
            var skin = this.skins[i];
            if (skin) {
              // @ts-ignore
              var file = game.qhly_getSkinFile(name, skin);
              // @ts-ignore
              skinCover.qhly_origin_setBackgroundImage(file);
            } else {
              // @ts-ignore
              skinCover.qhly_origin_setBackground(name, 'character');
            }
            var that = this;
            (function (name, skin, skinView) {
              // @ts-ignore
              skinCover.qhly_listen(function (e) {
                that.onClickSkin(e, name, skin, skinView);
              });
            }.bind(this))(name, skin, skinView);
            dragonwin.appendChild(skinView);
            this.refreshLocation(skinView);
          }
        },
      };
      var clickOutBegin = function (event) {
        // @ts-ignore
        var pos = lib.qhly_getEventPosition(event);
        var rect = dragonwin.getBoundingClientRect();
        rect = state.handleRect(rect);
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        // @ts-ignore
        var distance = lib.qhly_computeDistance(pos.x, pos.y, centerX, centerY);
        if (distance < rect.width * 0.3758) {
          return;
        }
        // @ts-ignore
        background.qh_startClick = true;
      };
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      var clickOutLeave = function (event) {
        // @ts-ignore
        delete background.qh_startClick;
      };
      var clickOutUp = function (event) {
        // @ts-ignore
        if (background.qh_startClick || lib.config.touchscreen) {
          if (lib.config.touchscreen) {
            // @ts-ignore
            var pos = lib.qhly_getEventPosition(event);
            var rect = dragonwin.getBoundingClientRect();
            rect = state.handleRect(rect);
            var centerX = rect.left + rect.width / 2;
            var centerY = rect.top + rect.height / 2;
            // @ts-ignore
            var distance = lib.qhly_computeDistance(pos.x, pos.y, centerX, centerY);
            if (distance < rect.width * 0.3758) {
              return;
            }
          }
          background.delete();
          // @ts-ignore
          _status.qhly_open = false;
          // @ts-ignore
          game.qhly_playQhlyAudio('qhly_voc_click3', null, true);
        }
        // @ts-ignore
        delete background.qh_startClick;
      };
      if (lib.config.touchscreen) {
        background.addEventListener('touchstart', clickOutBegin);
        background.addEventListener('touchend', clickOutUp);
        background.addEventListener('touchcancel', clickOutLeave);
      } else {
        background.addEventListener('mousedown', clickOutBegin);
        background.addEventListener('mouseup', clickOutUp);
        background.addEventListener('mouseleave', clickOutLeave);
      }
      if (lib.config.touchscreen) {
        dragonwin.addEventListener('touchstart', function (e) {
          state.onSpinBegin(e);
        });
        dragonwin.addEventListener('touchend', function (e) {
          state.onSpinEnd(e);
        });
        dragonwin.addEventListener('touchmove', function (e) {
          state.onSpinMove(e);
        });
        dragonwin.addEventListener('touchcancel', function (e) {
          state.onSpinCancel(e);
        });
      } else {
        dragonwin.addEventListener('mousedown', function (e) {
          state.onSpinBegin(e);
        });
        dragonwin.addEventListener('mouseup', function (e) {
          state.onSpinEnd(e);
        });
        dragonwin.addEventListener('mousemove', function (e) {
          state.onSpinMove(e);
        });
        dragonwin.addEventListener('mouseleave', function (e) {
          state.onSpinCancel(e);
        });
      }
      dragonwin.listen(function (e) {
        // @ts-ignore
        var pos = lib.qhly_getEventPosition(e);
        var rect = dragonwin.getBoundingClientRect();
        rect = state.handleRect(rect);
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        // @ts-ignore
        var distance = lib.qhly_computeDistance(centerX, centerY, pos.x, pos.y);
        if (distance < rect.width * 0.3758) {
          e.stopPropagation();
        }
        if (distance > rect.width * 0.1717) {
          return;
        }
        var time = (new Date()).valueOf();
        if (time - state.preclicktime < 250) {
          background.delete();
          // @ts-ignore
          _status.qhly_open = false;
          // @ts-ignore
          game.qhly_open_new(name, lib.config.qhly_doubledefaultpage ? lib.config.qhly_doubledefaultpage : 'skill', ingame);
        }
        state.preclicktime = time;
        e.stopPropagation();
      });
      if (lib.config.qhly_dragonlocation == 'drag' || lib.config.qhly_dragonlocation == 'head') {
        var dragMouseDown = function (e) {
          // @ts-ignore
          var pos = lib.qhly_getEventPosition(e);
          var rect = dragonwin.getBoundingClientRect();
          // @ts-ignore
          rect = game.qhly_handleRect(rect);
          var centerX = rect.left + rect.width / 2;
          var centerY = rect.top + rect.height / 2;
          // @ts-ignore
          var distance = lib.qhly_computeDistance(centerX, centerY, pos.x, pos.y);
          if (distance < rect.width * 0.1717) {
            state.isDragging = true;
            state.beginPosition = {
              x: rect.left,
              y: rect.top
            };
            state.beginMousePosition = {
              x: pos.x,
              y: pos.y
            };
          }
        };
        var dragMouseMove = function (e) {
          if (state.isDragging) {
            // @ts-ignore
            var pos = lib.qhly_getEventPosition(e);
            // @ts-ignore
            if (lib.qhly_computeDistance(pos.x, pos.y, state.beginMousePosition.x, state.beginMousePosition.y) > 10) {
              var baisx = pos.x - state.beginMousePosition.x;
              var baisy = pos.y - state.beginMousePosition.y;
              var newx = state.beginPosition.x + baisx;
              var newy = state.beginPosition.y + baisy;
              dragonwin.style.left = newx.toFixed(3) + "px";
              dragonwin.style.top = newy.toFixed(3) + "px";
              //dragonhead.style.left = newx.toFixed(3)+"px";
              //dragonhead.style.top = newy.toFixed(3)+"px";
            }
            e.stopPropagation();
          }
        };
        var dragMouseUp = function (e) {
          if (state.isDragging) {
            // @ts-ignore
            var pos = lib.qhly_getEventPosition(e);
            var baisx = pos.x - state.beginMousePosition.x;
            var baisy = pos.y - state.beginMousePosition.y;
            var newx = state.beginPosition.x + baisx;
            var newy = state.beginPosition.y + baisy;
            dragonwin.style.left = newx.toFixed(3) + "px";
            dragonwin.style.top = newy.toFixed(3) + "px";
            //dragonhead.style.left = newx.toFixed(3)+"px";
            //dragonhead.style.top = newy.toFixed(3)+"px";
            game.saveConfig('qhly_dragonlocationValue', { x: dragonwin.style.left, y: dragonwin.style.top });
            delete state.isDragging;
            e.stopPropagation();
          }
        };
        var dragMouseCancel = function (e) {
          if (state.isDragging) {
            delete state.isDragging;
            e.stopPropagation();
          }
        };
        if (lib.config.touchscreen) {
          dragonwin.addEventListener('touchstart', dragMouseDown);
          dragonwin.addEventListener('touchend', dragMouseUp);
          dragonwin.addEventListener('touchmove', dragMouseMove);
          dragonwin.addEventListener('touchcancel', dragMouseCancel);
        } else {
          dragonwin.addEventListener('mousedown', dragMouseDown);
          dragonwin.addEventListener('mouseup', dragMouseUp);
          dragonwin.addEventListener('mousemove', dragMouseMove);
          dragonwin.addEventListener('mouseleave', dragMouseCancel);
        }
      }
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      game.qhly_getSkinList(name, function (ret, list) {
        // @ts-ignore
        var pkg = game.qhly_foundPackage(name);
        if (!list) list = [];
        list.sort(function (a, b) {
          // @ts-ignore
          var orderA = game.qhly_getOrder(name, a, pkg);
          // @ts-ignore
          var orderB = game.qhly_getOrder(name, b, pkg);
          if (orderA > orderB) return 1;
          if (orderA == orderB) return 0;
          return -1;
        });
        var skinList = [null];
        if (list && list.length) {
          skinList.addArray(list);
        }
        // @ts-ignore
        state.skins = skinList;
        state.init();
        state.refreshSkins();
      }, false);

    };
    // @ts-ignore
    game.qhly_open_small = function (name, from, ingame) {
      if(!from){
        // @ts-ignore
        from = game.qhly_getCurrentPlayer(name)[0][0];
      }
      if (lib.config.qhly_smallwindowstyle == 'dragon' || !lib.config.qhly_smallwindowstyle) {
        // @ts-ignore
        game.qhly_open_small_dragon(name, from, ingame);
        return;
      }
      if(!from && ['decade','shousha'].includes(lib.config.qhly_smallwindowstyle)){
        // @ts-ignore
        game.qhly_open_small_dragon(name, from, ingame);
        return;
      }
      else if (lib.config.qhly_smallwindowstyle == 'decade') {
        // @ts-ignore
        game.qhly_open_small_decade(name, from, ingame);
        return;
      }
      else if (lib.config.qhly_smallwindowstyle == 'shousha') {
        // @ts-ignore
        game.qhly_open_small_shousha(name, from, ingame);
        return;
      }
      try {
        // @ts-ignore
        if (_status.qhly_open) return;
        // @ts-ignore
        _status.qhly_open = true;
        var background = ui.create.div('.qh-skinchange-background', document.body);
        var backgroundBack = ui.create.div('.qh-skinchange-background', background);
        var dialog = ui.create.div('.qh-skinchange-dialog', background);
        var exit = ui.create.div('.qh-skinchange-exit', dialog);
        var cover = ui.create.div('.qh-skinchange-cover', dialog);
        var content = ui.create.div('.qh-skinchange-area', cover);
        var enlarge = ui.create.div('.qh-skinchange-enlarge', dialog);
        var swipe_up = lib.config.swipe_up;
        lib.config.swipe_up = '';
        var swipe_down = lib.config.swipe_down;
        lib.config.swipe_down = '';
        var swipe_left = lib.config.swipe_left;
        lib.config.swipe_left = '';
        var swipe_right = lib.config.swipe_right;
        lib.config.swipe_right = '';
        var exitListener = function () {
          lib.config.swipe_up = swipe_up;
          lib.config.swipe_down = swipe_down;
          lib.config.swipe_left = swipe_left;
          lib.config.swipe_right = swipe_right;
          // @ts-ignore
          if (!_status.qhly_open) return;
          background.delete();
          // @ts-ignore
          game.qhly_playQhlyAudio('qhly_voc_press', null, true);
          // @ts-ignore
          delete _status.qhly_open;
        };
        var viewState = {
          offset: 0,
          skinTotalWidth: 500,
          skinPerWidth: 150,
          skinGap: 10,
          skins: [],
          skinViews: [],
          visibleWidth: function () {
            var rect = cover.getBoundingClientRect();
            return rect.width;
          },
          content: content,
          refresh: function () {
            this.content.style.width = Math.round(this.skinTotalWidth) + 'px';
            this.content.style.left = Math.round(this.offset) + "px";
          },
          refreshSkins: function () {
            for (var i = 0; i < this.skinViews.length; i++) {
              var skinView = this.skinViews[i];
              var skin = this.skins[i];
              // @ts-ignore
              if (game.qhly_skinIs(name, skin)) {
                skinView.style.filter = "saturate(100%)";
                skinView.belowText.style.textShadow = '.2rem 0rem .5rem red,-.2rem 0rem .5rem red,0rem .2rem .5rem red,0rem -.2rem .5rem red';
              } else {
                skinView.style.filter = "saturate(40%)";
                skinView.belowText.style.textShadow = '.2rem 0rem .5rem blue,-.2rem 0rem .5rem blue,0rem .2rem .5rem blue,0rem -.2rem .5rem blue';
              }
            }
          },
          handleMouseDown: function (x, y) {
            if (this.skinTotalWidth <= this.visibleWidth()) {
              return;
            }
            this.mouseDownX = x;
            this.mouseDownY = y;
            this.isTouching = true;
            this.cancelClick = false;
          },
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          handleMouseMove: function (x, y) {
            if (this.isTouching) {
              var slideX = x - this.mouseDownX;
              this.tempoffset = this.offset + slideX;
              if (this.tempoffset > 0) {
                this.tempoffset = 0;
              } else if (this.skinTotalWidth - this.visibleWidth() < -this.tempoffset) {
                this.tempoffset = -(this.skinTotalWidth - this.visibleWidth());
              }
              this.content.style.left = Math.round(this.tempoffset) + "px";
              return true;
            }
          },
          handleMouseUp: function (x, y) {
            if (this.isTouching) {
              this.isTouching = false;
              if (x && y) {
                var slideX = x - this.mouseDownX;
                this.tempoffset = this.offset + slideX;
                if (this.tempoffset > 0) {
                  this.tempoffset = 0;
                } else if (this.skinTotalWidth - this.visibleWidth() < -this.tempoffset) {
                  this.tempoffset = -(this.skinTotalWidth - this.visibleWidth());
                }
              }
              this.cancelClick = Math.abs(this.offset - this.tempoffset) > 50;
              this.content.style.left = Math.round(this.tempoffset) + "px";
              this.offset = this.tempoffset;
            } else {
              this.cancelClick = false;
            }
            this.previousX = this.mouseDownX;
            this.previousY = this.mouseDownY;
            delete this.mouseDownX;
            delete this.mouseDownY;
          }
        };
        if (lib.config.touchscreen) {
          content.addEventListener('touchstart', function (event) {
            if (event.touches && event.touches.length) {
              viewState.handleMouseDown(event.touches[0].clientX, event.touches[0].clientY);
            }
          });
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          content.addEventListener('touchend', function (event) {
            viewState.handleMouseUp();
          });
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          content.addEventListener('touchcancel', function (event) {
            viewState.handleMouseUp();
          });
          content.addEventListener('touchmove', function (event) {
            if (event.touches && event.touches.length)
              viewState.handleMouseMove(event.touches[0].clientX, event.touches[0].clientY);
          });
        } else {
          content.addEventListener('mousewheel', function (event) {
            // @ts-ignore
            viewState.handleMouseDown(event.clientX, event.clientY);
            // @ts-ignore
            if (event.wheelDelta > 0) {
              // @ts-ignore
              viewState.handleMouseMove(event.clientX - 30, event.clientY);
              // @ts-ignore
              viewState.handleMouseUp(event.clientX - 30, event.clientY);
            } else {
              // @ts-ignore
              viewState.handleMouseMove(event.clientX + 30, event.clientY);
              // @ts-ignore
              viewState.handleMouseUp(event.clientX + 30, event.clientY);
            }
          });
          content.addEventListener('mousedown', function (event) {
            viewState.handleMouseDown(event.clientX, event.clientY);
          });
          content.addEventListener('mouseup', function (event) {
            viewState.handleMouseUp(event.clientX, event.clientY);
          });
          content.addEventListener('mouseleave', function (event) {
            viewState.handleMouseUp(event.clientX, event.clientY);
          });
          content.addEventListener('mousemove', function (event) {
            viewState.handleMouseMove(event.clientX, event.clientY);
          });
        }
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        game.qhly_getSkinList(name, function (ret, list) {
          // @ts-ignore
          var pkg = game.qhly_foundPackage(name);
          if (!list) list = [];
          list.sort(function (a, b) {
            // @ts-ignore
            var orderA = game.qhly_getOrder(name, a, pkg);
            // @ts-ignore
            var orderB = game.qhly_getOrder(name, b, pkg);
            if (orderA > orderB) return 1;
            if (orderA == orderB) return 0;
            return -1;
          });
          var skinList = [null];
          if (list && list.length) {
            skinList.addArray(list);
          }
          // @ts-ignore
          viewState.skins = skinList;
          viewState.skinTotalWidth = (viewState.skinPerWidth + viewState.skinGap) * skinList.length - viewState.skinGap;
          for (var i = 0; i < skinList.length; i++) {
            var skin = skinList[i];
            var skinView = ui.create.div('.qh-skinchange-skin', content);
            // @ts-ignore
            viewState.skinViews.push(skinView);
            skinView.style.left = Math.round((viewState.skinPerWidth + viewState.skinGap) * i) + "px";
            skinView.style.width = Math.round(viewState.skinPerWidth) + "px";
            skinView.classList.add('qh-not-replace');
            // @ts-ignore
            skinView.belowText = ui.create.div('.qh-skinchange-skin-text', skinView);
            if (i != skinList.length - 1) {
              var border = ui.create.div('.qh-skinchange-border', content);
              border.style.width = Math.round(viewState.skinGap) + "px";
              border.style.left = Math.round((viewState.skinPerWidth + viewState.skinGap) * i + viewState.skinPerWidth) + "px";
            }
            if (skin) {
              // @ts-ignore
              var info = game.qhly_getSkinInfo(name, skin);
              if (info) {
                // @ts-ignore
                skinView.belowText.innerHTML = info.translation;
              }
            } else {
              // @ts-ignore
              skinView.belowText.innerHTML = "初始皮肤";
            }
            // @ts-ignore
            if (game.qhly_skinIs(name, skin)) {
              skinView.style.filter = "saturate(100%)";
              // @ts-ignore
              skinView.belowText.style.textShadow = '.2rem 0rem .5rem red,-.2rem 0rem .5rem red,0rem .2rem .5rem red,0rem -.2rem .5rem red';
            } else {
              skinView.style.filter = "saturate(40%)";
              // @ts-ignore
              skinView.belowText.style.textShadow = '.2rem 0rem .5rem blue,-.2rem 0rem .5rem blue,0rem .2rem .5rem blue,0rem -.2rem .5rem blue';
            }
            (function (name, skin, view) {
              view.listen(function () {
                if (viewState.cancelClick) return;
                // @ts-ignore
                if (game.qhly_skinIs(name, skin)) return;
                // @ts-ignore
                game.qhly_playQhlyAudio('qhly_voc_fanshu', null, true);
                // @ts-ignore
                game.qhly_setCurrentSkin(name, skin, function () {
                  viewState.refreshSkins();
                  if (lib.config.qhly_smallwinclosewhenchange) {
                    exitListener();
                  }
                }, true);
              });
            })(name, skin, skinView);
            if (skin) {
              // @ts-ignore
              var file = game.qhly_getSkinFile(name, skin);
              // @ts-ignore
              skinView.qhly_origin_setBackgroundImage(file);
            } else {
              // @ts-ignore
              skinView.qhly_origin_setBackground(name, 'character');
            }
          }
          viewState.refresh();
        }, false);
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        backgroundBack.listen(function (event) {
          exitListener();
        });
        exit.listen(exitListener);
        enlarge.listen(function () {
          exitListener();
          // @ts-ignore
          game.qhly_open_new(name, lib.config.qhly_doubledefaultpage ? lib.config.qhly_doubledefaultpage : 'skill', ingame);
        });
      } catch (e) {
        if (QHLY_DEBUGMODE) {
          throw e;
        }
      }
    };
    //------------------------------十周年小窗口换肤--decadesmall-------------------------
    // @ts-ignore
    game.qhly_open_small_decade = function (name, from, ingame) {
      try {
        // @ts-ignore
        if (_status.qhly_open) return;
        // @ts-ignore
        _status.qhly_open = true;
        var cPlayer = from;
        // @ts-ignore
        if (!cPlayer) cPlayer = game.qhly_getCurrentPlayer(name)[0][0];
        //let rareceshi = ui.create.div('.qh-skinchange-rare', cPlayer);
        var background = ui.create.div('.qh-skinchange-background', document.body);
        var backgroundBack = ui.create.div('.qh-skinchange-background', background);
        var dialog = ui.create.div('.qh-skinchange-decade-dialog', background);
        if (lib.config.qhly_lutouType && lib.config.qhly_lutouType == 'shousha') dialog.classList.add('shousha');
        if (lib.config.qhly_lutou) dialog.setAttribute('data-outcrop-skin', 'on');
        //var exit = ui.create.div('.qh-skinchange-decade-exit', dialog);
        var cover = ui.create.div('.qh-skinchange-decade-cover', dialog);
        // @ts-ignore
        cover.setAttribute('data-visible', 1);
        cover.id = 'data-cover';
        var content1 = ui.create.div('.qh-skinchange-decade-area1', cover);
        content1.id = 'content1';
        var content2 = ui.create.div('.qh-skinchange-decade-area2', cover);
        content2.id = 'content2';
        var rArrow1 = ui.create.div('.qh-skinchange-decade-arrow', dialog);
        var lArrow1 = ui.create.div('.qh-skinchange-decade-arrow.left', dialog);
        var rArrow2 = ui.create.div('.qh-skinchange-decade-arrow', dialog);
        var lArrow2 = ui.create.div('.qh-skinchange-decade-arrow.left', dialog);
        var autoskin = ui.create.div('.qh-skinchange-decade-autoskin', dialog);
        ui.create.div('.qh-skinchange-decade-autoskinborder', autoskin);
        ui.create.div('.qh-skinchange-decade-autoskinitem', autoskin);
        var enlarge = ui.create.div('.qh-skinchange-decade-enlarge', dialog);
        // @ts-ignore
        if (lib.config.qhly_autoChangeSkin == 'close' || !lib.config.qhly_autoChangeSkin) autoskin.setAttribute('data-auto', false);
        // @ts-ignore
        else autoskin.setAttribute('data-auto', true);
        autoskin.listen(function () {
          var open = false, item = 'close';
          if (lib.config.qhly_autoChangeSkin == 'close' || !lib.config.qhly_autoChangeSkin) {
            open = true;
            item = lib.config['extension_千幻聆音_qhly_decadeAuto'];
          }
          game.saveConfig('extension_千幻聆音_qhly_autoChangeSkin', item);
          game.saveConfig('qhly_autoChangeSkin', item);
          if (open) {
            // @ts-ignore
            autoskin.setAttribute('data-auto', true);
            // @ts-ignore
            game.qhly_autoChangeSkin();
          } else {
            // @ts-ignore
            autoskin.setAttribute('data-auto', false);
            // @ts-ignore
            if (_status.qhly_changeSkinFunc) {
              // @ts-ignore
              clearTimeout(_status.qhly_changeSkinFunc);
            }
          }
        })
        var zhufu = ui.create.div('.qh-skinchange-decade-zhufu', dialog);
        var zhuskinBut = ui.create.div('.qh-zhuskin', zhufu);
        var fuskinBut = ui.create.div('.qh-fuskin', zhufu);
        if (cPlayer && cPlayer.name2) {
          // @ts-ignore
          dialog.setAttribute('data-double', true);
          if (cPlayer.name2 == name) {
            fuskinBut.classList.add('sel');
            // @ts-ignore
            cover.setAttribute('data-visible', 2);
          }
          else {
            zhuskinBut.classList.add('sel');
            // @ts-ignore
            cover.setAttribute('data-visible', 1);
          }
        }
        zhuskinBut.listen(function () {
          if (zhuskinBut.classList.contains('sel')) return;
          if (cPlayer && cPlayer.classList.contains('unseen') && cPlayer != game.me) return;
          fuskinBut.classList.remove('sel');
          zhuskinBut.classList.add('sel');
          // @ts-ignore
          cover.setAttribute('data-visible', 1);
          viewState1.refresh();
        })
        fuskinBut.listen(function () {
          if (fuskinBut.classList.contains('sel')) return;
          if (cPlayer && cPlayer.classList.contains('unseen2') && cPlayer != game.me) return;
          zhuskinBut.classList.remove('sel');
          fuskinBut.classList.add('sel');
          // @ts-ignore
          cover.setAttribute('data-visible', 2);
          viewState2.refresh();
        })
        var swipe_up = lib.config.swipe_up;
        lib.config.swipe_up = '';
        var swipe_down = lib.config.swipe_down;
        lib.config.swipe_down = '';
        var swipe_left = lib.config.swipe_left;
        lib.config.swipe_left = '';
        var swipe_right = lib.config.swipe_right;
        lib.config.swipe_right = '';
        var exitListener = function () {
          lib.config.swipe_up = swipe_up;
          lib.config.swipe_down = swipe_down;
          lib.config.swipe_left = swipe_left;
          lib.config.swipe_right = swipe_right;
          // @ts-ignore
          if (!_status.qhly_open) return;
          for (var i = 0; i < viewState1.skinViews.length; i++) {
            // @ts-ignore
            if (viewState1.skinViews[i].dynamic && viewState1.skinViews[i].dynamic.renderer.postMessage) {
              // @ts-ignore
              viewState1.skinViews[i].dynamic.renderer.postMessage({
                message: "DESTROY",
                // @ts-ignore
                id: viewState1.skinViews[i].dynamic.id,
              })
              // @ts-ignore
              viewState1.skinViews[i].dynamic.renderer.capacity--;
            }
          }
          if (cPlayer && cPlayer.name2) {
            for (var i = 0; i < viewState2.skinViews.length; i++) {
              // @ts-ignore
              if (viewState2.skinViews[i].dynamic && viewState2.skinViews[i].dynamic.renderer.postMessage) {
                // @ts-ignore
                viewState2.skinViews[i].dynamic.renderer.postMessage({
                  message: "DESTROY",
                  // @ts-ignore
                  id: viewState2.skinViews[i].dynamic.id,
                })
                // @ts-ignore
                viewState2.skinViews[i].dynamic.renderer.capacity--;
              }
            }
          }
          background.delete();
          // @ts-ignore
          game.qhly_playQhlyAudio('qhly_voc_dec_press', null, true);
          // @ts-ignore
          delete _status.qhly_open;
        };
        var viewState1 = {
          offset: 0,
          skinTotalWidth: 500,
          skinPerWidth: 120,
          skinGap: 42,
          skins: [],
          skinViews: [],
          visibleWidth: function () {
            var rect = cover.getBoundingClientRect();
            return rect.width;
          },
          cover: cover,
          content1: content1,
          refresh: function () {
            content1.style.width = Math.round(this.skinTotalWidth) + 'px';
            content1.style.left = Math.round(this.offset) + "px";
            // @ts-ignore
            if (this.skinTotalWidth + this.offset > 665 && this.cover.getAttribute('data-visible') == '1') this.rArrow.setAttribute('data-visiable', true);
            else {
              if (rTimer1) clearInterval(rTimer1);
              // @ts-ignore
              this.rArrow.setAttribute('data-visiable', false);
            }
            // @ts-ignore
            if (this.offset < 0 && this.cover.getAttribute('data-visible') == '1') this.lArrow.setAttribute('data-visiable', true);
            else {
              if (lTimer1) clearInterval(lTimer1);
              // @ts-ignore
              this.lArrow.setAttribute('data-visiable', false);
            }
          },
          rArrow: rArrow1,
          lArrow: lArrow1,
          refreshSkins: function () {
            for (var i = 0; i < this.skinViews.length; i++) {
              // var skinView = this.skinViews[i].avatar;
              var skin = this.skins[i];
              // @ts-ignore
              if (cPlayer && game.qhly_skinIs(cPlayer.name1, skin)) {
                //skinView.style.filter = "grayscale(0)";
                //skinView.belowText.style.textShadow = '.2rem 0rem .5rem red,-.2rem 0rem .5rem red,0rem .2rem .5rem red,0rem -.2rem .5rem red';
                // @ts-ignore
                this.skinViews[i].defaultskin.setAttribute('data-sel', true);
              } else {
                //skinView.style.filter = "grayscale(100%)";
                //skinView.belowText.style.textShadow = '.2rem 0rem .5rem blue,-.2rem 0rem .5rem blue,0rem .2rem .5rem blue,0rem -.2rem .5rem blue';
                // @ts-ignore
                this.skinViews[i].defaultskin.setAttribute('data-sel', false);
              }
            }
          },
          handleMouseDown: function (x, y) {
            if (this.skinTotalWidth <= this.visibleWidth()) {
              return;
            }
            this.mouseDownX = x;
            this.mouseDownY = y;
            this.isTouching = true;
            this.cancelClick = false;
            if (!this.offset) this.offset = content1.offsetLeft;
            this.tempoffset = this.offset;
          },
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          handleMouseMove: function (x, y) {
            if (this.isTouching) {
              var slideX = x - this.mouseDownX;
              this.tempoffset = this.offset + slideX;
              if (this.tempoffset > 0) {
                this.tempoffset = 0;
              } else if (this.skinTotalWidth - this.visibleWidth() < -this.tempoffset) {
                this.tempoffset = -(this.skinTotalWidth - this.visibleWidth());
              }
              this.content1.style.left = Math.round(this.tempoffset) + "px";
              // @ts-ignore
              if (this.skinTotalWidth + this.tempoffset > 665 && this.cover.getAttribute('data-visible') == '1') this.rArrow.setAttribute('data-visiable', true);
              // @ts-ignore
              else this.rArrow.setAttribute('data-visiable', false);
              // @ts-ignore
              if (this.tempoffset < 0 && this.cover.getAttribute('data-visible') == '1') this.lArrow.setAttribute('data-visiable', true);
              // @ts-ignore
              else this.lArrow.setAttribute('data-visiable', false);
              return true;
            }
          },
          handleMouseUp: function (x, y) {
            if (this.isTouching) {
              this.isTouching = false;
              if (x && y) {
                var slideX = x - this.mouseDownX;
                this.tempoffset = this.offset + slideX;
                if (this.tempoffset > 0) {
                  this.tempoffset = 0;
                } else if (this.skinTotalWidth - this.visibleWidth() < -this.tempoffset) {
                  this.tempoffset = -(this.skinTotalWidth - this.visibleWidth());
                }
              }
              this.cancelClick = Math.abs(this.offset - this.tempoffset) > 50;
              this.content1.style.left = Math.round(this.tempoffset) + "px";
            } else {
              this.cancelClick = false;
            }
            this.offset = this.tempoffset;
            this.previousX = this.mouseDownX;
            this.previousY = this.mouseDownY;
            delete this.mouseDownX;
            delete this.mouseDownY;
          }
        };
        if (cPlayer && cPlayer.name2) {
          var viewState2 = {
            offset: 0,
            skinTotalWidth: 500,
            skinPerWidth: 120,
            skinGap: 42,
            skins: [],
            skinViews: [],
            visibleWidth: function () {
              var rect = cover.getBoundingClientRect();
              return rect.width;
            },
            cover: cover,
            content2: content2,
            refresh: function () {
              content2.style.width = Math.round(this.skinTotalWidth) + 'px';
              content2.style.left = Math.round(this.offset) + "px";
              // @ts-ignore
              if (this.skinTotalWidth + this.offset > 665 && this.cover.getAttribute('data-visible') == '2') this.rArrow.setAttribute('data-visiable', true);
              else {
                if (rTimer2) clearInterval(rTimer2);
                // @ts-ignore
                this.rArrow.setAttribute('data-visiable', false);
              }
              // @ts-ignore
              if (this.offset < 0 && this.cover.getAttribute('data-visible') == '2') this.lArrow.setAttribute('data-visiable', true);
              else {
                if (lTimer2) clearInterval(lTimer2);
                // @ts-ignore
                this.lArrow.setAttribute('data-visiable', false);
              }
            },
            rArrow: rArrow2,
            lArrow: lArrow2,
            refreshSkins: function () {
              for (var i = 0; i < this.skinViews.length; i++) {
                // var skinView = this.skinViews[i].avatar;
                var skin = this.skins[i];
                // @ts-ignore
                if (cPlayer && game.qhly_skinIs(cPlayer.name2, skin)) {
                  //skinView.style.filter = "grayscale(0)";
                  //skinView.belowText.style.textShadow = '.2rem 0rem .5rem red,-.2rem 0rem .5rem red,0rem .2rem .5rem red,0rem -.2rem .5rem red';
                  // @ts-ignore
                  this.skinViews[i].defaultskin.setAttribute('data-sel', true);
                } else {
                  //skinView.style.filter = "grayscale(100%)";
                  //skinView.belowText.style.textShadow = '.2rem 0rem .5rem blue,-.2rem 0rem .5rem blue,0rem .2rem .5rem blue,0rem -.2rem .5rem blue';
                  // @ts-ignore
                  this.skinViews[i].defaultskin.setAttribute('data-sel', false);
                }
              }
            },
            handleMouseDown: function (x, y) {
              if (this.skinTotalWidth <= this.visibleWidth()) {
                return;
              }
              this.mouseDownX = x;
              this.mouseDownY = y;
              this.isTouching = true;
              this.cancelClick = false;
              if (!this.offset) this.offset = content2.offsetLeft;
              this.tempoffset = this.offset;
            },
            // @ts-ignore
            // @ts-ignore
            // @ts-ignore
            handleMouseMove: function (x, y) {
              if (this.isTouching) {
                var slideX = x - this.mouseDownX;
                this.tempoffset = this.offset + slideX;
                if (this.tempoffset > 0) {
                  this.tempoffset = 0;
                } else if (this.skinTotalWidth - this.visibleWidth() < -this.tempoffset) {
                  this.tempoffset = -(this.skinTotalWidth - this.visibleWidth());
                }
                this.content2.style.left = Math.round(this.tempoffset) + "px";
                // @ts-ignore
                if (this.skinTotalWidth + this.tempoffset > 665 && this.cover.getAttribute('data-visible') == '2') this.rArrow.setAttribute('data-visiable', true);
                // @ts-ignore
                else this.rArrow.setAttribute('data-visiable', false);
                // @ts-ignore
                if (this.tempoffset < 0 && this.cover.getAttribute('data-visible') == '2') this.lArrow.setAttribute('data-visiable', true);
                // @ts-ignore
                else this.lArrow.setAttribute('data-visiable', false);
                return true;
              }
            },
            handleMouseUp: function (x, y) {
              if (this.isTouching) {
                this.isTouching = false;
                if (x && y) {
                  var slideX = x - this.mouseDownX;
                  this.tempoffset = this.offset + slideX;
                  if (this.tempoffset > 0) {
                    this.tempoffset = 0;
                  } else if (this.skinTotalWidth - this.visibleWidth() < -this.tempoffset) {
                    this.tempoffset = -(this.skinTotalWidth - this.visibleWidth());
                  }
                }
                this.cancelClick = Math.abs(this.offset - this.tempoffset) > 50;
                this.content2.style.left = Math.round(this.tempoffset) + "px";

              } else {
                this.cancelClick = false;
              }
              this.offset = this.tempoffset;
              this.previousX = this.mouseDownX;
              this.previousY = this.mouseDownY;
              delete this.mouseDownX;
              delete this.mouseDownY;
            }
          }
        }
        var rTimer1 = null, lTimer1 = null, rTimer2 = null, lTimer2 = null;
        rArrow1.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
          rTimer1 = setInterval(function () {
            viewState1.offset -= 20;
            if (viewState1.offset < 665 - viewState1.skinTotalWidth) {
              viewState1.offset = 665 - viewState1.skinTotalWidth;
              clearInterval(rTimer1);
            }
            viewState1.refresh();
          }, 50)
        });
        rArrow1.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          clearInterval(rTimer1);
        });
        lArrow1.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
          lTimer1 = setInterval(function () {
            viewState1.offset += 20;
            if (viewState1.offset > 0) {
              clearInterval(lTimer1);
              viewState1.offset = 0;
            }
            viewState1.refresh();
          }, 50)
        });
        lArrow1.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          clearInterval(lTimer1);
        });
        rArrow2.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
          rTimer2 = setInterval(function () {
            viewState2.offset -= 20;
            if (viewState2.offset < 665 - viewState2.skinTotalWidth) {
              viewState2.offset = 665 - viewState2.skinTotalWidth;
              clearInterval(rTimer2);
            }
            viewState2.refresh();
          }, 50)
        });
        rArrow2.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          clearInterval(rTimer2);
        });
        lArrow2.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
          lTimer2 = setInterval(function () {
            viewState2.offset += 20;
            if (viewState2.offset > 0) {
              clearInterval(lTimer2);
              viewState2.offset = 0;
            }
            viewState2.refresh();
          }, 50)
        });
        lArrow2.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          clearInterval(lTimer2);
        });
        if (lib.config.touchscreen) {
          content1.addEventListener('touchstart', function (event) {
            if (event.touches && event.touches.length) {
              viewState1.handleMouseDown(event.touches[0].clientX, event.touches[0].clientY);
            }
          });
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          content1.addEventListener('touchend', function (event) {
            viewState1.handleMouseUp();
          });
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          content1.addEventListener('touchcancel', function (event) {
            viewState1.handleMouseUp();
          });
          content1.addEventListener('touchmove', function (event) {
            if (event.touches && event.touches.length)
              viewState1.handleMouseMove(event.touches[0].clientX, event.touches[0].clientY);
          });
          content2.addEventListener('touchstart', function (event) {
            if (event.touches && event.touches.length) {
              viewState2.handleMouseDown(event.touches[0].clientX, event.touches[0].clientY);
            }
          });
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          content2.addEventListener('touchend', function (event) {
            viewState2.handleMouseUp();
          });
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          content2.addEventListener('touchcancel', function (event) {
            viewState2.handleMouseUp();
          });
          content2.addEventListener('touchmove', function (event) {
            if (event.touches && event.touches.length)
              viewState2.handleMouseMove(event.touches[0].clientX, event.touches[0].clientY);
          });
        } else {
          content1.addEventListener('mousewheel', function (event) {
            // @ts-ignore
            viewState1.handleMouseDown(event.clientX, event.clientY);
            // @ts-ignore
            if (event.wheelDelta > 0) {
              // @ts-ignore
              viewState1.handleMouseMove(event.clientX - 30, event.clientY);
              // @ts-ignore
              viewState1.handleMouseUp(event.clientX - 30, event.clientY);
            } else {
              // @ts-ignore
              viewState1.handleMouseMove(event.clientX + 30, event.clientY);
              // @ts-ignore
              viewState1.handleMouseUp(event.clientX + 30, event.clientY);
            }
          });
          content1.addEventListener('mousedown', function (event) {
            viewState1.handleMouseDown(event.clientX, event.clientY);
          });
          content1.addEventListener('mouseup', function (event) {
            viewState1.handleMouseUp(event.clientX, event.clientY);
          });
          content1.addEventListener('mouseleave', function (event) {
            viewState1.handleMouseUp(event.clientX, event.clientY);
          });
          content1.addEventListener('mousemove', function (event) {
            viewState1.handleMouseMove(event.clientX, event.clientY);
          });
          content2.addEventListener('mousewheel', function (event) {
            // @ts-ignore
            viewState2.handleMouseDown(event.clientX, event.clientY);
            // @ts-ignore
            if (event.wheelDelta > 0) {
              // @ts-ignore
              viewState2.handleMouseMove(event.clientX - 30, event.clientY);
              // @ts-ignore
              viewState2.handleMouseUp(event.clientX - 30, event.clientY);
            } else {
              // @ts-ignore
              viewState2.handleMouseMove(event.clientX + 30, event.clientY);
              // @ts-ignore
              viewState2.handleMouseUp(event.clientX + 30, event.clientY);
            }
          });
          content2.addEventListener('mousedown', function (event) {
            viewState2.handleMouseDown(event.clientX, event.clientY);
          });
          content2.addEventListener('mouseup', function (event) {
            viewState2.handleMouseUp(event.clientX, event.clientY);
          });
          content2.addEventListener('mouseleave', function (event) {
            viewState2.handleMouseUp(event.clientX, event.clientY);
          });
          content2.addEventListener('mousemove', function (event) {
            viewState2.handleMouseMove(event.clientX, event.clientY);
          });
        }

        //-----------------------------------------主将---------------------------------------------
        var namex = cPlayer?cPlayer.name1:name;
        var playZhuDynamic = lib.config['extension_千幻聆音_qhly_decadeDynamic'] == 'always' ? false : true;
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        game.qhly_getSkinList(namex, function (ret, list) {
          // @ts-ignore
          var pkg = game.qhly_foundPackage(namex);
          if (!list) list = [];
          list.sort(function (a, b) {
            // @ts-ignore
            var orderA = game.qhly_getOrder(namex, a, pkg);
            // @ts-ignore
            var orderB = game.qhly_getOrder(namex, b, pkg);
            if (orderA > orderB) return 1;
            if (orderA == orderB) return 0;
            return -1;
          });
          const path = pkg.skin.standard;//1
          var skinList = [null];
          if (list && list.length) {
            skinList.addArray(list);
          }
          var dynamicSkinList = [], bothSkin = [], singleDynamic = [];//2
          // @ts-ignore
          if (window.decadeUI) {
            // @ts-ignore
            if (decadeUI.dynamicSkin[namex]) dynamicSkinList = Object.keys(decadeUI.dynamicSkin[namex]);
            singleDynamic = [...dynamicSkinList];//单形态
            for (var i of skinList) {
              if (i) {
                // @ts-ignore
                let skin = i.substring(0, i.lastIndexOf('.'));
                if (dynamicSkinList.includes(skin)) {
                  bothSkin.push(skin);//双形态
                  singleDynamic.remove(skin);
                }
              }
            }
            if (dynamicSkinList) {
              if (lib.config['extension_千幻聆音_qhly_decadeDynamic'] == 'three' && dynamicSkinList.length > 3) playZhuDynamic = false;
              // @ts-ignore
              // @ts-ignore
              // @ts-ignore
              dynamicSkinList.forEach(function (value, index, array) {
                array[index] += '.jpg';
              });
              skinList = Array.from(new Set(skinList.concat(dynamicSkinList)));
              // @ts-ignore
              skinList.remove('经典形象.jpg');
            }
          }
          // @ts-ignore
          viewState1.skins = skinList;
          viewState1.skinTotalWidth = (viewState1.skinPerWidth + viewState1.skinGap) * skinList.length - viewState1.skinGap + 20;
          for (let i = 0; i < skinList.length; i++) {
            var skin = skinList[i];
            var skinView = ui.create.div('.qh-skinchange-decade-skin', content1);
            // @ts-ignore
            skinView.avatar = ui.create.div('.primary-avatar', skinView);
            var campWrap = ui.create.div('.qhcamp-wrap', skinView);
            if(cPlayer){
              campWrap.setAttribute("data-camp", cPlayer.group);
            }
            var playerDengjie = 'one';
            if (!lib.config['extension_千幻聆音_qhly_decadeDengjie'] || lib.config['extension_千幻聆音_qhly_decadeDengjie'] == 'auto') {
              if(cPlayer){
                switch (game.getRarity(cPlayer)) {
                  case 'common': playerDengjie = 'two'; break;
                  case 'junk': playerDengjie = 'one'; break;
                  case 'rare': playerDengjie = 'three'; break;
                  case 'epic': playerDengjie = 'four'; break;
                  default: playerDengjie = 'five';
                }
              }
            }
            else playerDengjie = lib.config['extension_千幻聆音_qhly_decadeDengjie'];
            campWrap.setAttribute("data-border-level", playerDengjie);
            ui.create.div('.qhcamp-back', campWrap);
            ui.create.div('.qhcamp-border', campWrap);
            var campName = ui.create.div('.qhcamp-name', campWrap);
            // @ts-ignore
            campName.style.backgroundImage = 'url("' + lib.qhly_path + 'image/decoration/name_' + campWrap.getAttribute('data-camp') + '.png")';
            var avatarName = ui.create.div('.qhavatar-name', campWrap);
            // @ts-ignore
            avatarName.innerHTML = lib.qhly_slimName(name);//.replace(/<br>/g, '\n');
            var hpWrap = ui.create.div('.qhhp-wrap', skinView);
            hpWrap.setAttribute("data-border-level", playerDengjie);
            // @ts-ignore
            skinView.belowText = ui.create.div('.qh-skinchange-decade-skin-text', hpWrap);
            // @ts-ignore
            viewState1.skinViews.push(skinView);
            skinView.style.left = Math.round((viewState1.skinPerWidth + viewState1.skinGap) * i + 16) + "px";
            skinView.style.width = Math.round(viewState1.skinPerWidth) + "px";
            // @ts-ignore
            skinView.avatar.classList.add('qh-not-replace');
            //skinView.node = { avatar: skinView.avatar, name1: namex, avatar2: null, name2: null };
            //skinView.belowText = ui.create.div('.qh-skinchange-skin-text', skinView);
            // @ts-ignore
            skinView.defaultskin = ui.create.div('.qh-skinchange-skin-default', skinView);
            // @ts-ignore
            skinView.$dynamicWrap = ui.create.div('.qhdynamic-wrap', skinView);
            // @ts-ignore
            skinView.toImageBtn = ui.create.div('.qh-domtoimage', skinView);
            // @ts-ignore
            skinView.toImageBtn.addEventListener('click', function (e) {
              e.stopPropagation();
              // @ts-ignore
              game.qhly_dom2image(ingame, namex, this, path);
            });//3
            // @ts-ignore
            skinView.dynamicToggle = ui.create.div('.qh-skinchange-dynamicChange', skinView);
            // @ts-ignore
            if (!skin && dynamicSkinList.includes('经典形象.jpg')) skinView.dynamicToggle.setAttribute('toggle', true);
            if (skin && lib.config.qhly_skinset.djtoggle[namex]) {
              // @ts-ignore
              if (lib.config.qhly_skinset.djtoggle[namex][skin.substring(0, skin.lastIndexOf('.'))]) skinView.dynamicToggle.classList.add('jing');
            }
            // @ts-ignore
            skinView.dynamicToggle.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
              if (this.classList.contains('jing')) {
                this.classList.remove('jing');
                // @ts-ignore
                if (playZhuDynamic) game.qhly_changeDynamicSkin(this.parentNode, this.parentNode.belowText.innerText, namex);
                //game.qhly_changeDynamicSkin(cPlayer, this.parentNode.belowText.innerText, namex);
                if (lib.config.qhly_skinset.djtoggle[namex] && lib.config.qhly_skinset.djtoggle[namex][this.parentNode.belowText.innerText]) delete lib.config.qhly_skinset.djtoggle[namex][this.parentNode.belowText.innerText];
              }
              else {
                this.classList.add('jing');
                if (playZhuDynamic && this.parentNode.stopDynamic) this.parentNode.stopDynamic();

                //cPlayer.stopDynamic(true, false);

                if (!lib.config.qhly_skinset.djtoggle[namex]) lib.config.qhly_skinset.djtoggle[namex] = {};
                lib.config.qhly_skinset.djtoggle[namex][this.parentNode.belowText.innerText] = true;
              }
              // @ts-ignore
              game.qhlySyncConfig();
            });
            //var dynamicPlayer = ui.create.div('.animation-player', skinView.$dynamicWrap);
            if (skin) {
              // @ts-ignore
              var str = skin.substring(0, skin.lastIndexOf('.'));
              // @ts-ignore
              if (bothSkin.includes(str)) skinView.dynamicToggle.setAttribute('toggle', true);
              // @ts-ignore
              if (singleDynamic.includes(str) && lib.config['extension_千幻聆音_qhly_dom2image']) skinView.toImageBtn.setAttribute('single', true);//打开快照
              // @ts-ignore
              var info = game.qhly_getSkinInfo(namex, skin);
              if (info) {
                // @ts-ignore
                skinView.belowText.innerHTML = info.translation;
              }
              // @ts-ignore
              if ((!lib.config.qhly_skinset.djtoggle[namex] || lib.config.qhly_skinset.djtoggle[namex] && !lib.config.qhly_skinset.djtoggle[namex][skin.substring(0, skin.lastIndexOf('.'))]) && window.decadeUI && decadeUI.dynamicSkin && decadeUI.dynamicSkin[namex] && Object.keys(decadeUI.dynamicSkin[namex]).includes(info.translation)) {
                // @ts-ignore
                if (playZhuDynamic) game.qhly_changeDynamicSkin(skinView, info.translation, namex);
              }
              //game.qhly_showSkinQua(skinView, skin);

              //if (info.translation == lib.config.qhly_skinset.skin[name].substring(0, 4)) game.qhly_changeDynamicSkin(skinView, name);
            } else {
              // @ts-ignore
              skinView.belowText.innerHTML = "经典形象";
              // @ts-ignore
              if (dynamicSkinList.includes('经典形象.jpg') && playZhuDynamic) game.qhly_changeDynamicSkin(skinView, '经典形象', namex);
            }
            var skinQua = ui.create.div('.qhly-skinQua-decade', skinView);
            // @ts-ignore
            var skininfo = game.qhly_getSkinInfo(namex, skin, game.qhly_foundPackage(namex));
            var level = skininfo.level;
            var style = skininfo.levelStyle;
            if (style) {
              // @ts-ignore
              if (!skinQua.qh_savedStyle) {
                // @ts-ignore
                skinQua.qh_savedStyle = {};
                for (var m in skinQua.style) {
                  // @ts-ignore
                  skinQua.qh_savedStyle[m] = skinQua.style[m];
                }
              }
              for (var s in style) {
                skinQua.style[s] = style[s];
              }
              var es = ['left', 'bottom', 'top', 'right'];
              for (var m of es) {
                if (!style[m]) {
                  skinQua.style[m] = "";
                }
              }
            } else {
              // @ts-ignore
              if (skinQua.qh_savedStyle) {
                // @ts-ignore
                for (var m in skinQua.qh_savedStyle) {
                  // @ts-ignore
                  skinQua.style[m] = skinQua.qh_savedStyle[m];
                }
              }
            }
            if (skin) {
              // @ts-ignore
              if (lib.qhly_level[namex + '_' + skin]) {
                // @ts-ignore
                level = lib.qhly_level[namex + '_' + skin];
              }
            }
            if (level) {
              var map = {
                '原画': 'yuanhua',
                '普通': 'putong',
                '稀有': 'xiyou',
                '精良': 'xiyou',
                '史诗': 'shishi',
                '传说': 'chuanshuo',
                '动态': 'dongtai',
                '限定': 'xianding',
                '绝版': 'jueban',
              };
              var img = null;
              if (map[level]) {
                img = "extension/千幻聆音/theme/decade/dc_" + map[level] + ".png";
              } else if (level.indexOf("#") == 0) {
                var l2 = level.replace("#", "");
                img = "extension/千幻聆音/image/" + l2 + ".png";
              } else if (level.indexOf("$") == 0) {
                var l2 = level.replace("$", "");
                img = l2;
              }
              if (img) {
                skinQua.show();
                skinQua.setBackgroundImage(img);
              } else {
                skinQua.hide();
              }
            } else {
              skinQua.hide();
            }
            // var skinQua = ui.create.div('', skinView);
            // skinQua.style.cssText = 'width:70%;height:29%;left:14%;top:61%;background-size:100% 100%;background-repeat:no-repeat;z-index:88;point-events:none';
            // skinQua.style['background-image'] = 'url(' + lib.qhly_path+'theme/decade/dc_' + game.qhly_getSkinLevel(namex, skin, true) + '.png)';
            // @ts-ignore
            if (game.qhly_skinIs(namex, skin)) {
              //skinView.style.filter = "grayscale(0)";
              //skinView.belowText.style.textShadow = '.2rem 0rem .5rem red,-.2rem 0rem .5rem red,0rem .2rem .5rem red,0rem -.2rem .5rem red';
              // @ts-ignore
              skinView.defaultskin.setAttribute('data-sel', true);
              if (skinView.offsetLeft > 600) viewState1.offset = 614 - skinView.offsetLeft;
            } else {
              //skinView.style.filter = "grayscale(100%)";
              //skinView.belowText.style.textShadow = '.2rem 0rem .5rem blue,-.2rem 0rem .5rem blue,0rem .2rem .5rem blue,0rem -.2rem .5rem blue';
              // @ts-ignore
              skinView.defaultskin.setAttribute('data-sel', false);
            }
            // @ts-ignore
            // @ts-ignore
            // @ts-ignore
            (function (name, skin, view) {
              view.listen(function () {
                if (viewState1.cancelClick) return;
                // @ts-ignore
                game.qhly_setCurrentSkin(namex, skin, function () {
                  viewState1.refreshSkins();
                  //if (view.dynamicToggle && view.dynamicToggle.classList && !view.dynamicToggle.classList.contains('jing')) {
                  // @ts-ignore
                  game.qhly_changeDynamicSkin(namex);
                  //}
                  if (lib.config['extension_千幻聆音_qhly_decadeChangeEffect'] && cPlayer) cPlayer.playChangeSkinEffect(false);
                  // @ts-ignore
                  game.qhlySyncConfig();
                  if (lib.config.qhly_smallwinclosewhenchange) {
                    exitListener();
                  }
                }, true);

              });
            })(namex, skin, skinView);
            if (skin) {
              // @ts-ignore
              let file = game.qhly_getSkinFile(namex, skin);
              // @ts-ignore
              let skinView2 = skinView.avatar;
              // @ts-ignore
              game.qhly_checkFileExist(file, function (s) {
                if (s) {
                  skinView2.qhly_origin_setBackgroundImage(file);
                } else {
                  let prefix = pkg.prefix;
                  if (typeof prefix == 'function') {
                    prefix = prefix(namex);
                  }
                  // taffy: 注释content.js原版代码喵
                  // if (lib.config.qhly_noSkin == 'origin') skinView2.qhly_origin_setBackgroundImage(prefix + namex + '.jpg');//原画
                  /* taffy分界线 */
                  // taffy: 修复千幻与皮切bug喵
                  if (lib.config.qhly_noSkin == 'origin') {
                    if (prefix.includes('.jpg')) skinView2.qhly_origin_setBackgroundImage(prefix);//原画
                    else skinView2.qhly_origin_setBackgroundImage(prefix + namex + '.jpg');//原画
                  }
                /* taffy分界线 */
                  else skinView2.qhly_origin_setBackgroundImage('extension/千幻聆音/image/noSkin.png');//noskin
                }
              })
            } else {
              // @ts-ignore
              skinView.avatar.qhly_origin_setBackground(namex, 'character');
            }
          }
          viewState1.refresh();
        }, false);

        //--------------------------------------副将---------------------------------------------
        if (cPlayer && cPlayer.name2) {
          var namey = cPlayer.name2;
          var playFuDynamic = lib.config['extension_千幻聆音_qhly_decadeDynamic'] == 'always' ? false : true;
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          game.qhly_getSkinList(namey, function (ret, list) {
            // @ts-ignore
            var pkg = game.qhly_foundPackage(namey);
            if (!list) list = [];
            list.sort(function (a, b) {
              // @ts-ignore
              var orderA = game.qhly_getOrder(namey, a, pkg);
              // @ts-ignore
              var orderB = game.qhly_getOrder(namey, b, pkg);
              if (orderA > orderB) return 1;
              if (orderA == orderB) return 0;
              return -1;
            });
            const path = pkg.skin.standard;
            var skinList = [null];
            if (list && list.length) {
              skinList.addArray(list);
            }
            var dynamicSkinList = [], bothSkin = [], singleDynamic = [];
            // @ts-ignore
            if (window.decadeUI) {
              // @ts-ignore
              if (decadeUI.dynamicSkin[namey]) dynamicSkinList = Object.keys(decadeUI.dynamicSkin[namey]);
              singleDynamic = [...dynamicSkinList];//单形态
              for (var i of skinList) {
                if (i) {
                  // @ts-ignore
                  var skin = i.substring(0, i.lastIndexOf('.'));
                  if (dynamicSkinList.includes(skin)) {
                    bothSkin.push(skin);//双形态
                    singleDynamic.remove(skin);
                  }
                }
              }
              if (dynamicSkinList) {
                if (lib.config['extension_千幻聆音_qhly_decadeDynamic'] == 'three' && dynamicSkinList.length > 3) playFuDynamic = false;
                // @ts-ignore
                // @ts-ignore
                // @ts-ignore
                dynamicSkinList.forEach(function (value, index, array) {
                  array[index] += '.jpg';
                })
                skinList = Array.from(new Set(skinList.concat(dynamicSkinList)));
                // @ts-ignore
                skinList.remove('经典形象.jpg');
              }
            }
            // @ts-ignore
            viewState2.skins = skinList;
            viewState2.skinTotalWidth = (viewState2.skinPerWidth + viewState2.skinGap) * skinList.length - viewState2.skinGap + 20;
            for (let i = 0; i < skinList.length; i++) {
              var skin = skinList[i];
              var skinView = ui.create.div('.qh-skinchange-decade-skin', content2);
              // @ts-ignore
              skinView.avatar = ui.create.div('.primary-avatar', skinView);
              var campWrap = ui.create.div('.qhcamp-wrap', skinView);
              if(cPlayer){
                campWrap.setAttribute("data-camp", cPlayer.group);
              }
              var playerDengjie = 'one';
              if (!lib.config['extension_千幻聆音_qhly_decadeDengjie'] || lib.config['extension_千幻聆音_qhly_decadeDengjie'] == 'auto') {
                if(cPlayer){
                  switch (game.getRarity(cPlayer)) {
                    case 'common': playerDengjie = 'two'; break;
                    case 'junk': playerDengjie = 'one'; break;
                    case 'rare': playerDengjie = 'three'; break;
                    case 'epic': playerDengjie = 'four'; break;
                    default: playerDengjie = 'five';
                  }
                }
              }
              else playerDengjie = lib.config['extension_千幻聆音_qhly_decadeDengjie'];
              campWrap.setAttribute("data-border-level", playerDengjie);
              ui.create.div('.qhcamp-back', campWrap);
              ui.create.div('.qhcamp-border', campWrap);
              var campName = ui.create.div('.qhcamp-name', campWrap);
              // @ts-ignore
              campName.style.backgroundImage = 'url("' + lib.qhly_path + 'image/decoration/name_' + campWrap.getAttribute('data-camp') + '.png")';
              var avatarName = ui.create.div('.qhavatar-name', campWrap);
              // @ts-ignore
              avatarName.innerHTML = lib.qhly_slimName(namey);//.replace(/<br>/g, '\n');
              var hpWrap = ui.create.div('.qhhp-wrap', skinView);
              hpWrap.setAttribute("data-border-level", playerDengjie);
              // @ts-ignore
              skinView.belowText = ui.create.div('.qh-skinchange-decade-skin-text', hpWrap);

              // @ts-ignore
              viewState2.skinViews.push(skinView);
              skinView.style.left = Math.round((viewState2.skinPerWidth + viewState2.skinGap) * i + 16) + "px";
              skinView.style.width = Math.round(viewState2.skinPerWidth) + "px";
              // @ts-ignore
              skinView.avatar.classList.add('qh-not-replace');
              //skinView.node = { avatar: skinView.avatar, name1: namey }
              //skinView.belowText = ui.create.div('.qh-skinchange-skin-text', skinView);
              // @ts-ignore
              skinView.defaultskin = ui.create.div('.qh-skinchange-skin-default', skinView);
              // @ts-ignore
              skinView.$dynamicWrap = ui.create.div('.qhdynamic-wrap', skinView);
              // @ts-ignore
              skinView.toImageBtn = ui.create.div('.qh-domtoimage', skinView);
              // @ts-ignore
              skinView.toImageBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                // @ts-ignore
                game.qhly_dom2image(ingame, namey, this, path);
              });
              // @ts-ignore
              skinView.dynamicToggle = ui.create.div('.qh-skinchange-dynamicChange', skinView);
              // @ts-ignore
              if (skin && bothSkin.includes(skin.substring(0, skin.lastIndexOf('.')))) skinView.dynamicToggle.setAttribute('toggle', true);
              // @ts-ignore
              if (!skin && dynamicSkinList.includes('经典形象.jpg')) skinView.dynamicToggle.setAttribute('toggle', true);
              if (skin && lib.config.qhly_skinset.djtoggle[namey]) {
                // @ts-ignore
                if (lib.config.qhly_skinset.djtoggle[namey][skin.substring(0, skin.lastIndexOf('.'))]) skinView.dynamicToggle.classList.add('jing');
              }
              // @ts-ignore
              skinView.dynamicToggle.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                if (this.classList.contains('jing')) {
                  this.classList.remove('jing');
                  // @ts-ignore
                  if (playFuDynamic) game.qhly_changeDynamicSkin(this.parentNode, this.parentNode.belowText.innerText, namey);
                  //game.qhly_changeDynamicSkin(cPlayer, this.parentNode.belowText.innerText, namey, true);
                  if (lib.config.qhly_skinset.djtoggle[namey] && lib.config.qhly_skinset.djtoggle[namey][this.parentNode.belowText.innerText]) delete lib.config.qhly_skinset.djtoggle[namey][this.parentNode.belowText.innerText];
                }
                else {
                  this.classList.add('jing');
                  if (playFuDynamic && this.parentNode.stopDynamic) this.parentNode.stopDynamic();
                  //if(decadeUI.CUR_DYNAMIC) decadeUI.CUR_DYNAMIC--;
                  //cPlayer.stopDynamic(false, true);
                  //if(decadeUI.CUR_DYNAMIC) decadeUI.CUR_DYNAMIC--;
                  if (!lib.config.qhly_skinset.djtoggle[namey]) lib.config.qhly_skinset.djtoggle[namey] = {};
                  lib.config.qhly_skinset.djtoggle[namey][this.parentNode.belowText.innerText] = true;
                }
                // @ts-ignore
                game.qhlySyncConfig();
              });

              //var dynamicPlayer = ui.create.div('.animation-player', skinView.$dynamicWrap);
              if (skin) {
                var str = skin.substring(0, skin.lastIndexOf('.'));
                // @ts-ignore
                if (bothSkin.includes(str)) skinView.dynamicToggle.setAttribute('toggle', true);
                // @ts-ignore
                if (singleDynamic.includes(str) && lib.config['extension_千幻聆音_qhly_dom2image']) skinView.toImageBtn.setAttribute('single', true);//打开快照
                // @ts-ignore
                var info = game.qhly_getSkinInfo(namey, skin);
                if (info) {
                  // @ts-ignore
                  skinView.belowText.innerHTML = info.translation;
                }
                // @ts-ignore
                if ((!lib.config.qhly_skinset.djtoggle[namey] || lib.config.qhly_skinset.djtoggle[namey] && !lib.config.qhly_skinset.djtoggle[namey][skin.substring(0, skin.lastIndexOf('.'))]) && window.decadeUI && decadeUI.dynamicSkin && decadeUI.dynamicSkin[namey] && Object.keys(decadeUI.dynamicSkin[namey]).includes(info.translation)) {
                  // @ts-ignore
                  if (playFuDynamic) game.qhly_changeDynamicSkin(skinView, info.translation, namey, true);
                }
                //game.qhly_showSkinQua(skinView, skin);

                //if (info.translation == lib.config.qhly_skinset.skin[name].substring(0, 4)) game.qhly_changeDynamicSkin(skinView, name);
              } else {
                // @ts-ignore
                skinView.belowText.innerHTML = "经典形象";
                // @ts-ignore
                if (dynamicSkinList.includes('经典形象.jpg') && playFuDynamic) game.qhly_changeDynamicSkin(skinView, '经典形象', namey);
              }
              var skinQua = ui.create.div('.qhly-skinQua-decade', skinView);
              // @ts-ignore
              var skininfo = game.qhly_getSkinInfo(namey, skin, game.qhly_foundPackage(namey));
              var level = skininfo.level;
              var style = skininfo.levelStyle;
              if (style) {
                // @ts-ignore
                if (!skinQua.qh_savedStyle) {
                  // @ts-ignore
                  skinQua.qh_savedStyle = {};
                  for (var m in skinQua.style) {
                    // @ts-ignore
                    skinQua.qh_savedStyle[m] = skinQua.style[m];
                  }
                }
                for (var s in style) {
                  skinQua.style[s] = style[s];
                }
                var es = ['left', 'bottom', 'top', 'right'];
                for (var m of es) {
                  if (!style[m]) {
                    skinQua.style[m] = "";
                  }
                }
              } else {
                // @ts-ignore
                if (skinQua.qh_savedStyle) {
                  // @ts-ignore
                  for (var m in skinQua.qh_savedStyle) {
                    // @ts-ignore
                    skinQua.style[m] = skinQua.qh_savedStyle[m];
                  }
                }
              }
              if (skin) {
                // @ts-ignore
                if (lib.qhly_level[namey + '_' + skin]) {
                  // @ts-ignore
                  level = lib.qhly_level[namey + '_' + skin];
                }
              }
              if (level) {
                var map = {
                  '原画': 'yuanhua',
                  '普通': 'putong',
                  '稀有': 'xiyou',
                  '精良': 'xiyou',
                  '史诗': 'shishi',
                  '传说': 'chuanshuo',
                  '动态': 'dongtai',
                  '限定': 'xianding',
                  '绝版': 'jueban',
                };
                var img = null;
                if (map[level]) {
                  img = "extension/千幻聆音/theme/decade/dc_" + map[level] + ".png";
                } else if (level.indexOf("#") == 0) {
                  var l2 = level.replace("#", "");
                  img = "extension/千幻聆音/image/" + l2 + ".png";
                } else if (level.indexOf("$") == 0) {
                  var l2 = level.replace("$", "");
                  img = l2;
                }
                if (img) {
                  skinQua.show();
                  skinQua.setBackgroundImage(img);
                } else {
                  skinQua.hide();
                }
              } else {
                skinQua.hide();
              }
              // @ts-ignore
              if (game.qhly_skinIs(namey, skin)) {
                //skinView.style.filter = "grayscale(0)";
                //skinView.belowText.style.textShadow = '.2rem 0rem .5rem red,-.2rem 0rem .5rem red,0rem .2rem .5rem red,0rem -.2rem .5rem red';
                // @ts-ignore
                skinView.defaultskin.setAttribute('data-sel', true);
                if (skinView.offsetLeft > 600) viewState2.offset = 614 - skinView.offsetLeft;
              } else {
                //skinView.style.filter = "grayscale(100%)";
                //skinView.belowText.style.textShadow = '.2rem 0rem .5rem blue,-.2rem 0rem .5rem blue,0rem .2rem .5rem blue,0rem -.2rem .5rem blue';
                // @ts-ignore
                skinView.defaultskin.setAttribute('data-sel', false);
              }
              // @ts-ignore
              // @ts-ignore
              // @ts-ignore
              (function (name, skin, view) {
                view.listen(function () {
                  if (viewState2.cancelClick) return;
                  // @ts-ignore
                  game.qhly_setCurrentSkin(namey, skin, function () {
                    viewState2.refreshSkins();
                    //if (view.dynamicToggle && view.dynamicToggle.classList && !view.dynamicToggle.classList.contains('jing')) {
                    // @ts-ignore
                    game.qhly_changeDynamicSkin(namey, null, null, true);
                    //}
                    if (lib.config['extension_千幻聆音_qhly_decadeChangeEffect'] && cPlayer) cPlayer.playChangeSkinEffect(true);
                    // @ts-ignore
                    game.qhlySyncConfig();
                    if (lib.config.qhly_smallwinclosewhenchange) {
                      exitListener();
                    }
                  }, true);

                });
              })(namey, skin, skinView);
              if (skin) {
                // @ts-ignore
                let file = game.qhly_getSkinFile(namey, skin);
                // @ts-ignore
                let skinView2 = skinView.avatar;
                // @ts-ignore
                game.qhly_checkFileExist(file, function (s) {
                  if (s) {
                    skinView2.qhly_origin_setBackgroundImage(file);
                  } else {
                    var prefix = pkg.prefix;
                    if (typeof prefix == 'function') {
                      prefix = prefix(namey);
                    }
                    // taffy: 注释content.js原版代码喵
                    // if (lib.config.qhly_noSkin == 'origin') skinView2.qhly_origin_setBackgroundImage(prefix + namey + '.jpg');//原画
                    /* taffy分界线 */
                    // taffy: 修复千幻与皮切bug喵
                    if (lib.config.qhly_noSkin == 'origin') {
                      if (prefix.includes('.jpg')) skinView2.qhly_origin_setBackgroundImage(prefix);//原画
                      else skinView2.qhly_origin_setBackgroundImage(prefix + namey + '.jpg');//原画
                    }
                    /* taffy分界线 */
                    else skinView2.qhly_origin_setBackgroundImage('extension/千幻聆音/image/noSkin.png');//noskin
                  }
                })
              } else {
                // @ts-ignore
                skinView.avatar.qhly_origin_setBackground(namey, 'character');
              }
            }
            viewState2.refresh();
          }, false);
        }

        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        backgroundBack.listen(function (event) {
          exitListener();
        });
        //exit.listen(exitListener);
        enlarge.listen(function () {
          exitListener();
          // @ts-ignore
          game.qhly_open_new(name, 'skill', ingame);
        });
      } catch (e) {
        if (QHLY_DEBUGMODE) {
          throw e;
        }
      }
    };

    //------------------------------手杀小窗口换肤--decadesmall-------------------------
    // @ts-ignore
    game.qhly_open_small_shousha = function (name, from, ingame) {
      try {
        // @ts-ignore
        if (_status.qhly_open) return;
        // @ts-ignore
        _status.qhly_open = true;
        var cPlayer = from;
        if (!cPlayer && ingame) cPlayer = ingame.parentNode;
        // @ts-ignore
        else cPlayer = game.qhly_getCurrentPlayer(name)[0][0];
        var background = ui.create.div('.qh-skinchange-background', document.body);
        var backgroundBack = ui.create.div('.qh-skinchange-shousha-background', background);
        var dialog = ui.create.div('.qh-skinchange-shousha-dialog', background);
        if (lib.config.qhly_lutouType && lib.config.qhly_lutouType == 'shousha') dialog.classList.add('shousha');
        if (lib.config.qhly_lutou) dialog.setAttribute('data-outcrop-skin', 'on');
        //var exit = ui.create.div('.qh-skinchange-shousha-exit', dialog);
        var cover = ui.create.div('.qh-skinchange-shousha-cover', dialog);
        // @ts-ignore
        cover.setAttribute('data-visible', 1);
        cover.id = 'data-cover';
        var content1 = ui.create.div('.qh-skinchange-shousha-area1', cover);
        content1.id = 'content1';
        var content2 = ui.create.div('.qh-skinchange-shousha-area2', cover);
        content2.id = 'content2';
        var rArrow1 = ui.create.div('.qh-skinchange-shousha-arrow', dialog);
        var lArrow1 = ui.create.div('.qh-skinchange-shousha-arrow.left', dialog);
        var rArrow2 = ui.create.div('.qh-skinchange-shousha-arrow', dialog);
        var lArrow2 = ui.create.div('.qh-skinchange-shousha-arrow.left', dialog);
        var autoskin = ui.create.div('.qh-skinchange-shousha-autoskin', dialog);
        ui.create.div('.qh-skinchange-shousha-autoskinborder', autoskin);
        ui.create.div('.qh-skinchange-shousha-autoskinitem', autoskin);
        var enlarge = ui.create.div('.qh-skinchange-shousha-enlarge', dialog);
        enlarge.innerHTML = '切换至大页面';
        // @ts-ignore
        if (lib.config.qhly_autoChangeSkin == 'close' || !lib.config.qhly_autoChangeSkin) autoskin.setAttribute('data-auto', false);
        // @ts-ignore
        else autoskin.setAttribute('data-auto', true);
        autoskin.listen(function () {
          var open = false, item = 'close';
          if (lib.config.qhly_autoChangeSkin == 'close' || !lib.config.qhly_autoChangeSkin) {
            open = true;
            item = lib.config['extension_千幻聆音_qhly_decadeAuto'];
          }
          game.saveConfig('extension_千幻聆音_qhly_autoChangeSkin', item);
          game.saveConfig('qhly_autoChangeSkin', item);
          if (open) {
            // @ts-ignore
            autoskin.setAttribute('data-auto', true);
            // @ts-ignore
            game.qhly_autoChangeSkin();
          } else {
            // @ts-ignore
            autoskin.setAttribute('data-auto', false);
            // @ts-ignore
            if (_status.qhly_changeSkinFunc) {
              // @ts-ignore
              clearTimeout(_status.qhly_changeSkinFunc);
            }
          }
        })
        var zhufu = ui.create.div('.qh-skinchange-shousha-zhufu', dialog);
        var zhuskinBut = ui.create.div('.qh-zhuskin', zhufu);
        var fuskinBut = ui.create.div('.qh-fuskin', zhufu);
        if (cPlayer && cPlayer.name2) {
          // @ts-ignore
          dialog.setAttribute('data-double', true);
          if (cPlayer.name2 == name) {
            fuskinBut.classList.add('sel');
            // @ts-ignore
            cover.setAttribute('data-visible', 2);
          }
          else {
            zhuskinBut.classList.add('sel');
            // @ts-ignore
            cover.setAttribute('data-visible', 1);
          }
        }
        zhuskinBut.listen(function () {
          if (zhuskinBut.classList.contains('sel')) return;
          if (cPlayer && cPlayer.classList.contains('unseen') && cPlayer != game.me) return;
          // @ts-ignore
          game.qhly_playQhlyAudio('qhly_voc_click2', null, true);
          fuskinBut.classList.remove('sel');
          zhuskinBut.classList.add('sel');
          // @ts-ignore
          cover.setAttribute('data-visible', 1);
          // @ts-ignore
          if (Math.round(viewState1.skinTotalWidth) >= viewState1.visibleWidth()) cover.setAttribute('data-overstep', true);
          // @ts-ignore
          else cover.setAttribute('data-overstep', false);
          // @ts-ignore
          lArrow2.setAttribute('data-visiable', false);
          // @ts-ignore
          rArrow2.setAttribute('data-visiable', false);
          viewState1.refresh();
        })
        fuskinBut.listen(function () {
          if (fuskinBut.classList.contains('sel')) return;
          if (cPlayer && cPlayer.classList.contains('unseen2') && cPlayer != game.me) return;
          // @ts-ignore
          game.qhly_playQhlyAudio('qhly_voc_click2', null, true);
          zhuskinBut.classList.remove('sel');
          fuskinBut.classList.add('sel');
          // @ts-ignore
          cover.setAttribute('data-visible', 2);
          // @ts-ignore
          if (Math.round(viewState2.skinTotalWidth) >= viewState2.visibleWidth()) cover.setAttribute('data-overstep', true);
          // @ts-ignore
          else cover.setAttribute('data-overstep', false);
          // @ts-ignore
          lArrow1.setAttribute('data-visiable', false);
          // @ts-ignore
          rArrow1.setAttribute('data-visiable', false);
          viewState2.refresh();
        })
        var swipe_up = lib.config.swipe_up;
        lib.config.swipe_up = '';
        var swipe_down = lib.config.swipe_down;
        lib.config.swipe_down = '';
        var swipe_left = lib.config.swipe_left;
        lib.config.swipe_left = '';
        var swipe_right = lib.config.swipe_right;
        lib.config.swipe_right = '';
        var exitListener = function () {
          lib.config.swipe_up = swipe_up;
          lib.config.swipe_down = swipe_down;
          lib.config.swipe_left = swipe_left;
          lib.config.swipe_right = swipe_right;
          // @ts-ignore
          if (!_status.qhly_open) return;
          for (var i = 0; i < viewState1.skinViews.length; i++) {
            // @ts-ignore
            if (viewState1.skinViews[i].dynamic && viewState1.skinViews[i].dynamic.renderer.postMessage) {
              // @ts-ignore
              viewState1.skinViews[i].dynamic.renderer.postMessage({
                message: "DESTROY",
                // @ts-ignore
                id: viewState1.skinViews[i].dynamic.id,
              })
              // @ts-ignore
              viewState1.skinViews[i].dynamic.renderer.capacity--;
            }
          }
          if (cPlayer && cPlayer.name2) {
            for (var i = 0; i < viewState2.skinViews.length; i++) {
              // @ts-ignore
              if (viewState2.skinViews[i].dynamic && viewState2.skinViews[i].dynamic.renderer.postMessage) {
                // @ts-ignore
                viewState2.skinViews[i].dynamic.renderer.postMessage({
                  message: "DESTROY",
                  // @ts-ignore
                  id: viewState2.skinViews[i].dynamic.id,
                });
                // @ts-ignore
                viewState2.skinViews[i].dynamic.renderer.capacity--;
              }
            }
          }
          background.delete();
          // @ts-ignore
          game.qhly_playQhlyAudio('qhly_voc_dec_press', null, true);
          // @ts-ignore
          delete _status.qhly_open;
        };
        var viewState1 = {
          offset: 0,
          skinTotalWidth: 500,
          skinPerWidth: 128,
          skinGap: 30,
          skins: [],
          skinViews: [],
          visibleWidth: function () {
            var rect = cover.getBoundingClientRect();
            return rect.width;
          },
          cover: cover,
          content1: content1,
          refresh: function () {
            if (!this.offset) this.offset = 0;
            content1.style.width = Math.round(this.skinTotalWidth) + 'px';
            content1.style.left = Math.round(this.offset) + "px";
            // @ts-ignore
            if (this.skinTotalWidth + this.offset > this.visibleWidth() && this.cover.getAttribute('data-visible') == '1') this.rArrow.setAttribute('data-visiable', true);
            else {
              if (rTimer1) clearInterval(rTimer1);
              // @ts-ignore
              this.rArrow.setAttribute('data-visiable', false);
            }
            // @ts-ignore
            if (this.offset < 0 && this.cover.getAttribute('data-visible') == '1') this.lArrow.setAttribute('data-visiable', true);
            else {
              if (lTimer1) clearInterval(lTimer1);
              // @ts-ignore
              this.lArrow.setAttribute('data-visiable', false);
            }
          },
          rArrow: rArrow1,
          lArrow: lArrow1,
          refreshSkins: function () {
            for (var i = 0; i < this.skinViews.length; i++) {
              var skin = this.skins[i];
              // @ts-ignore
              if (cPlayer && game.qhly_skinIs(cPlayer.name1, skin)) {
                // @ts-ignore
                this.skinViews[i].defaultskin.setAttribute('data-sel', true);
              } else {
                // @ts-ignore
                this.skinViews[i].defaultskin.setAttribute('data-sel', false);
              }
            }
          },
          handleMouseDown: function (x, y) {
            if (this.skinTotalWidth <= this.visibleWidth()) {
              return;
            }
            this.mouseDownX = x;
            this.mouseDownY = y;
            this.isTouching = true;
            this.cancelClick = false;
            if (!this.offset) this.offset = content1.offsetLeft;
            this.tempoffset = this.offset;
          },
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          handleMouseMove: function (x, y) {
            if (this.isTouching) {
              var slideX = x - this.mouseDownX;
              this.tempoffset = this.offset + slideX;
              if (this.tempoffset > 0) {
                this.tempoffset = 0;
              } else if (this.skinTotalWidth - this.visibleWidth() < -this.tempoffset) {
                this.tempoffset = -(this.skinTotalWidth - this.visibleWidth());
              }
              this.content1.style.left = Math.round(this.tempoffset) + "px";
              // @ts-ignore
              if (this.skinTotalWidth + this.tempoffset > this.visibleWidth() && this.cover.getAttribute('data-visible') == '1') this.rArrow.setAttribute('data-visiable', true);
              // @ts-ignore
              else this.rArrow.setAttribute('data-visiable', false);
              // @ts-ignore
              if (this.tempoffset < 0 && this.cover.getAttribute('data-visible') == '1') this.lArrow.setAttribute('data-visiable', true);
              // @ts-ignore
              else this.lArrow.setAttribute('data-visiable', false);
              return true;
            }
          },
          handleMouseUp: function (x, y) {
            if (this.isTouching) {
              this.isTouching = false;
              if (x && y) {
                var slideX = x - this.mouseDownX;
                this.tempoffset = this.offset + slideX;
                if (this.tempoffset > 0) {
                  this.tempoffset = 0;
                } else if (this.skinTotalWidth - this.visibleWidth() < -this.tempoffset) {
                  this.tempoffset = -(this.skinTotalWidth - this.visibleWidth());
                }
              }
              this.cancelClick = Math.abs(this.offset - this.tempoffset) > 50;
              this.content1.style.left = Math.round(this.tempoffset) + "px";
            } else {
              this.cancelClick = false;
            }
            this.offset = this.tempoffset;
            this.previousX = this.mouseDownX;
            this.previousY = this.mouseDownY;
            delete this.mouseDownX;
            delete this.mouseDownY;
          }
        };
        if (cPlayer && cPlayer.name2) {
          var viewState2 = {
            offset: 0,
            skinTotalWidth: 500,
            skinPerWidth: 128,
            skinGap: 30,
            skins: [],
            skinViews: [],
            visibleWidth: function () {
              var rect = cover.getBoundingClientRect();
              return rect.width;
            },
            cover: cover,
            content2: content2,
            refresh: function () {
              if (!this.offset) this.offset = 0;
              content2.style.width = Math.round(this.skinTotalWidth) + 'px';
              content2.style.left = Math.round(this.offset) + "px";
              // @ts-ignore
              if (this.skinTotalWidth + this.offset > this.visibleWidth() && this.cover.getAttribute('data-visible') == '2') this.rArrow.setAttribute('data-visiable', true);
              else {
                if (rTimer2) clearInterval(rTimer2);
                // @ts-ignore
                this.rArrow.setAttribute('data-visiable', false);
              }
              // @ts-ignore
              if (this.offset < 0 && this.cover.getAttribute('data-visible') == '2') this.lArrow.setAttribute('data-visiable', true);
              else {
                if (lTimer2) clearInterval(lTimer2);
                // @ts-ignore
                this.lArrow.setAttribute('data-visiable', false);
              }
            },
            rArrow: rArrow2,
            lArrow: lArrow2,
            refreshSkins: function () {
              for (var i = 0; i < this.skinViews.length; i++) {
                var skin = this.skins[i];
                // @ts-ignore
                if (cPlayer && game.qhly_skinIs(cPlayer.name2, skin)) {
                  // @ts-ignore
                  this.skinViews[i].defaultskin.setAttribute('data-sel', true);
                } else {
                  // @ts-ignore
                  this.skinViews[i].defaultskin.setAttribute('data-sel', false);
                }
              }
            },
            handleMouseDown: function (x, y) {
              if (this.skinTotalWidth <= this.visibleWidth()) {
                return;
              }
              this.mouseDownX = x;
              this.mouseDownY = y;
              this.isTouching = true;
              this.cancelClick = false;
              if (!this.offset) this.offset = content2.offsetLeft;
              this.tempoffset = this.offset;
            },
            // @ts-ignore
            // @ts-ignore
            // @ts-ignore
            handleMouseMove: function (x, y) {
              if (this.isTouching) {
                var slideX = x - this.mouseDownX;
                this.tempoffset = this.offset + slideX;
                if (this.tempoffset > 0) {
                  this.tempoffset = 0;
                } else if (this.skinTotalWidth - this.visibleWidth() < -this.tempoffset) {
                  this.tempoffset = -(this.skinTotalWidth - this.visibleWidth());
                }

                this.content2.style.left = Math.round(this.tempoffset) + "px";
                // @ts-ignore
                if (this.skinTotalWidth + this.tempoffset > this.visibleWidth() && this.cover.getAttribute('data-visible') == '2') this.rArrow.setAttribute('data-visiable', true);
                // @ts-ignore
                else this.rArrow.setAttribute('data-visiable', false);
                // @ts-ignore
                if (this.tempoffset < 0 && this.cover.getAttribute('data-visible') == '2') this.lArrow.setAttribute('data-visiable', true);
                // @ts-ignore
                else this.lArrow.setAttribute('data-visiable', false);
                return true;
              }
            },
            handleMouseUp: function (x, y) {
              if (this.isTouching) {
                this.isTouching = false;
                if (x && y) {
                  var slideX = x - this.mouseDownX;
                  this.tempoffset = this.offset + slideX;
                  if (this.tempoffset > 0) {
                    this.tempoffset = 0;
                  } else if (this.skinTotalWidth - this.visibleWidth() < -this.tempoffset) {
                    this.tempoffset = -(this.skinTotalWidth - this.visibleWidth());
                  }
                }
                this.cancelClick = Math.abs(this.offset - this.tempoffset) > 50;
                this.content2.style.left = Math.round(this.tempoffset) + "px";
              } else {
                this.cancelClick = false;
              }
              this.offset = this.tempoffset;
              this.previousX = this.mouseDownX;
              this.previousY = this.mouseDownY;
              delete this.mouseDownX;
              delete this.mouseDownY;
            }
          }
        }
        var rTimer1 = null, lTimer1 = null, rTimer2 = null, lTimer2 = null;
        rArrow1.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
          rTimer1 = setInterval(function () {
            viewState1.offset -= 20;
            if (viewState1.offset < 665 - viewState1.skinTotalWidth) {
              viewState1.offset = 665 - viewState1.skinTotalWidth;
              clearInterval(rTimer1);
            }
            viewState1.refresh();
          }, 50)
        });
        rArrow1.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          clearInterval(rTimer1);
        });
        lArrow1.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
          lTimer1 = setInterval(function () {
            viewState1.offset += 20;
            if (viewState1.offset > 0) {
              clearInterval(lTimer1);
              viewState1.offset = 0;
            }
            viewState1.refresh();
          }, 50)
        });
        lArrow1.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          clearInterval(lTimer1);
        });
        rArrow2.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
          rTimer2 = setInterval(function () {
            viewState2.offset -= 20;
            if (viewState2.offset < 665 - viewState2.skinTotalWidth) {
              viewState2.offset = 665 - viewState2.skinTotalWidth;
              clearInterval(rTimer2);
            }
            viewState2.refresh();
          }, 50)
        });
        rArrow2.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          clearInterval(rTimer2);
        });
        lArrow2.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
          lTimer2 = setInterval(function () {
            viewState2.offset += 20;
            if (viewState2.offset > 0) {
              clearInterval(lTimer2);
              viewState2.offset = 0;
            }
            viewState2.refresh();
          }, 50)
        });
        lArrow2.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          clearInterval(lTimer2);
        });
        if (lib.config.touchscreen) {
          content1.addEventListener('touchstart', function (event) {
            if (event.touches && event.touches.length) {
              viewState1.handleMouseDown(event.touches[0].clientX, event.touches[0].clientY);
            }
          });
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          content1.addEventListener('touchend', function (event) {
            viewState1.handleMouseUp();
          });
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          content1.addEventListener('touchcancel', function (event) {
            viewState1.handleMouseUp();
          });
          content1.addEventListener('touchmove', function (event) {
            if (event.touches && event.touches.length)
              viewState1.handleMouseMove(event.touches[0].clientX, event.touches[0].clientY);
          });
          content2.addEventListener('touchstart', function (event) {
            if (event.touches && event.touches.length) {
              viewState2.handleMouseDown(event.touches[0].clientX, event.touches[0].clientY);
            }
          });
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          content2.addEventListener('touchend', function (event) {
            viewState2.handleMouseUp();
          });
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          content2.addEventListener('touchcancel', function (event) {
            viewState2.handleMouseUp();
          });
          content2.addEventListener('touchmove', function (event) {
            if (event.touches && event.touches.length)
              viewState2.handleMouseMove(event.touches[0].clientX, event.touches[0].clientY);
          });
        } else {
          content1.addEventListener('mousewheel', function (event) {
            // @ts-ignore
            viewState1.handleMouseDown(event.clientX, event.clientY);
            // @ts-ignore
            if (event.wheelDelta > 0) {
              // @ts-ignore
              viewState1.handleMouseMove(event.clientX - 30, event.clientY);
              // @ts-ignore
              viewState1.handleMouseUp(event.clientX - 30, event.clientY);
            } else {
              // @ts-ignore
              viewState1.handleMouseMove(event.clientX + 30, event.clientY);
              // @ts-ignore
              viewState1.handleMouseUp(event.clientX + 30, event.clientY);
            }
          });
          content1.addEventListener('mousedown', function (event) {
            viewState1.handleMouseDown(event.clientX, event.clientY);
          });
          content1.addEventListener('mouseup', function (event) {
            viewState1.handleMouseUp(event.clientX, event.clientY);
          });
          content1.addEventListener('mouseleave', function (event) {
            viewState1.handleMouseUp(event.clientX, event.clientY);
          });
          content1.addEventListener('mousemove', function (event) {
            viewState1.handleMouseMove(event.clientX, event.clientY);
          });
          content2.addEventListener('mousewheel', function (event) {
            // @ts-ignore
            viewState2.handleMouseDown(event.clientX, event.clientY);
            // @ts-ignore
            if (event.wheelDelta > 0) {
              // @ts-ignore
              viewState2.handleMouseMove(event.clientX - 30, event.clientY);
              // @ts-ignore
              viewState2.handleMouseUp(event.clientX - 30, event.clientY);
            } else {
              // @ts-ignore
              viewState2.handleMouseMove(event.clientX + 30, event.clientY);
              // @ts-ignore
              viewState2.handleMouseUp(event.clientX + 30, event.clientY);
            }
          });
          content2.addEventListener('mousedown', function (event) {
            viewState2.handleMouseDown(event.clientX, event.clientY);
          });
          content2.addEventListener('mouseup', function (event) {
            viewState2.handleMouseUp(event.clientX, event.clientY);
          });
          content2.addEventListener('mouseleave', function (event) {
            viewState2.handleMouseUp(event.clientX, event.clientY);
          });
          content2.addEventListener('mousemove', function (event) {
            viewState2.handleMouseMove(event.clientX, event.clientY);
          });
        }

        //-----------------------------------------主将---------------------------------------------
        var namex = cPlayer?cPlayer.name1:name;
        var playZhuDynamic = lib.config['extension_千幻聆音_qhly_decadeDynamic'] == 'always' ? false : true;
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        game.qhly_getSkinList(namex, function (ret, list) {
          // @ts-ignore
          var pkg = game.qhly_foundPackage(namex);
          if (!list) list = [];
          list.sort(function (a, b) {
            // @ts-ignore
            var orderA = game.qhly_getOrder(namex, a, pkg);
            // @ts-ignore
            var orderB = game.qhly_getOrder(namex, b, pkg);
            if (orderA > orderB) return 1;
            if (orderA == orderB) return 0;
            return -1;
          });
          const path = pkg.skin.standard;//1
          var skinList = [null];
          if (list && list.length) {
            skinList.addArray(list);
          }
          var dynamicSkinList = [], bothSkin = [], singleDynamic = [];//2
          // @ts-ignore
          if (window.decadeUI) {
            // @ts-ignore
            if (decadeUI.dynamicSkin[namex]) dynamicSkinList = Object.keys(decadeUI.dynamicSkin[namex]);
            singleDynamic = [...dynamicSkinList];//单形态
            for (var i of skinList) {
              if (i) {
                // @ts-ignore
                var skin = i.substring(0, i.lastIndexOf('.'));
                if (dynamicSkinList.includes(skin)) {
                  bothSkin.push(skin);//双形态
                  singleDynamic.remove(skin);
                }
              }
            }
            if (dynamicSkinList) {
              if (lib.config['extension_千幻聆音_qhly_decadeDynamic'] == 'three' && dynamicSkinList.length > 3) playZhuDynamic = false;
              // @ts-ignore
              // @ts-ignore
              // @ts-ignore
              dynamicSkinList.forEach(function (value, index, array) {
                array[index] += '.jpg';
              })
              skinList = Array.from(new Set(skinList.concat(dynamicSkinList)));
              // @ts-ignore
              skinList.remove('经典形象.jpg');
            }
          }
          // @ts-ignore
          viewState1.skins = skinList;
          viewState1.skinTotalWidth = (viewState1.skinPerWidth + viewState1.skinGap) * skinList.length - viewState1.skinGap + 20;
          for (let i = 0; i < skinList.length; i++) {
            var skin = skinList[i];
            var skinView = ui.create.div('.qh-skinchange-shousha-skin', content1);
            // @ts-ignore
            skinView.avatar = ui.create.div('.primary-avatar', skinView);
            var campWrap = ui.create.div('.qhcamp-wrap.shousha', skinView);
            if(cPlayer){
            campWrap.setAttribute("data-camp", cPlayer.group);
            }
            // @ts-ignore
            skinView.campBack = ui.create.div('.qhcamp-shousha-back', skinView);
            // @ts-ignore
            skinView.campBack.setAttribute('data-pinzhi', game.qhly_getSkinLevel(namex, skin));
            var campName = ui.create.div('.qhcamp-name', campWrap);
            // @ts-ignore
            campName.style.backgroundImage = 'url("' + lib.qhly_path + 'image/decoration/name_' + campWrap.getAttribute('data-camp') + '.png")';
            var avatarName = ui.create.div('.qhavatar-name', campWrap);
            // @ts-ignore
            avatarName.innerHTML = lib.qhly_slimName(namex);//.replace(/<br>/g, '\n');
            var hpWrap = ui.create.div('.qhhp-shousha-wrap', skinView);
            // @ts-ignore
            skinView.belowText = ui.create.div('.qh-skinchange-shousha-skin-text', hpWrap);
            // @ts-ignore
            viewState1.skinViews.push(skinView);
            skinView.style.left = Math.round((viewState1.skinPerWidth + viewState1.skinGap) * i + 16) + "px";
            skinView.style.width = Math.round(viewState1.skinPerWidth) + "px";
            // @ts-ignore
            skinView.avatar.classList.add('qh-not-replace');
            // @ts-ignore
            skinView.defaultskin = ui.create.div('.qh-skinchange-skin-shousha-default', skinView);
            // @ts-ignore
            skinView.$dynamicWrap = ui.create.div('.qhdynamic-shousha-wrap', skinView);
            // @ts-ignore
            skinView.toImageBtn = ui.create.div('.qh-domtoimage', skinView);
            // @ts-ignore
            skinView.toImageBtn.addEventListener('click', function (e) {
              e.stopPropagation();
              // @ts-ignore
              game.qhly_dom2image(ingame, namex, this, path);
            });//3
            // @ts-ignore
            skinView.dynamicToggle = ui.create.div('.qh-skinchange-shousha-dynamicChange', skinView);
            //if (skin && bothSkin.includes(skin.substring(0, skin.lastIndexOf('.')))) skinView.dynamicToggle.setAttribute('toggle', true);
            // @ts-ignore
            if (!skin && dynamicSkinList.includes('经典形象.jpg')) skinView.dynamicToggle.setAttribute('toggle', true);
            if (skin && lib.config.qhly_skinset.djtoggle[namex]) {
              // @ts-ignore
              if (lib.config.qhly_skinset.djtoggle[namex][skin.substring(0, skin.lastIndexOf('.'))]) skinView.dynamicToggle.classList.add('jing');
            }
            // @ts-ignore
            skinView.dynamicToggle.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
              if (this.classList.contains('jing')) {
                this.classList.remove('jing');
                // @ts-ignore
                if (playZhuDynamic) game.qhly_changeDynamicSkin(this.parentNode, this.parentNode.belowText.innerText, namex);
                if (lib.config.qhly_skinset.djtoggle[namex] && lib.config.qhly_skinset.djtoggle[namex][this.parentNode.belowText.innerText]) delete lib.config.qhly_skinset.djtoggle[namex][this.parentNode.belowText.innerText];
              }
              else {
                this.classList.add('jing');
                if (playZhuDynamic && this.parentNode.stopDynamic) this.parentNode.stopDynamic();
                if (lib.config.qhly_smallwindowstyle == 'shousha') {
                  // @ts-ignore
                  this.parentNode.campBack.setAttribute("data-pinzhi", game.qhly_getSkinLevel(namex, skin));
                  this.parentNode.campBack.classList.remove('dong');
                }
                if (!lib.config.qhly_skinset.djtoggle[namex]) lib.config.qhly_skinset.djtoggle[namex] = {};
                lib.config.qhly_skinset.djtoggle[namex][this.parentNode.belowText.innerText] = true;
              }
              // @ts-ignore
              game.qhlySyncConfig();
            });
            if (skin) {
              var str = skin.substring(0, skin.lastIndexOf('.'));
              // @ts-ignore
              if (bothSkin.includes(str)) skinView.dynamicToggle.setAttribute('toggle', true);
              // @ts-ignore
              if (singleDynamic.includes(str) && lib.config['extension_千幻聆音_qhly_dom2image']) skinView.toImageBtn.setAttribute('single', true);//打开快照
              // @ts-ignore
              var info = game.qhly_getSkinInfo(namex, skin);
              if (info) {
                // @ts-ignore
                skinView.belowText.innerHTML = info.translation;
              }
              // @ts-ignore
              if ((!lib.config.qhly_skinset.djtoggle[namex] || lib.config.qhly_skinset.djtoggle[namex] && !lib.config.qhly_skinset.djtoggle[namex][skin.substring(0, skin.lastIndexOf('.'))]) && window.decadeUI && decadeUI.dynamicSkin && decadeUI.dynamicSkin[namex] && Object.keys(decadeUI.dynamicSkin[namex]).includes(info.translation)) {
                // @ts-ignore
                if (playZhuDynamic) game.qhly_changeDynamicSkin(skinView, info.translation, namex);
              }
            } else {
              // @ts-ignore
              skinView.belowText.innerHTML = "经典形象";
              // @ts-ignore
              if (dynamicSkinList.includes('经典形象.jpg') && playZhuDynamic) game.qhly_changeDynamicSkin(skinView, '经典形象', namex);
            }
            var skinQua = ui.create.div('.qhly-skinQua-shousha', skinView);
            // @ts-ignore
            var skininfo = game.qhly_getSkinInfo(namex, skin, game.qhly_foundPackage(namex));
            var level = skininfo.level;
            var style = skininfo.levelStyle;
            if (style) {
              // @ts-ignore
              if (!skinQua.qh_savedStyle) {
                // @ts-ignore
                skinQua.qh_savedStyle = {};
                for (var m in skinQua.style) {
                  // @ts-ignore
                  skinQua.qh_savedStyle[m] = skinQua.style[m];
                }
              }
              for (var s in style) {
                skinQua.style[s] = style[s];
              }
              var es = ['left', 'bottom', 'top', 'right'];
              for (var m of es) {
                if (!style[m]) {
                  skinQua.style[m] = "";
                }
              }
            } else {
              // @ts-ignore
              if (skinQua.qh_savedStyle) {
                // @ts-ignore
                for (var m in skinQua.qh_savedStyle) {
                  // @ts-ignore
                  skinQua.style[m] = skinQua.qh_savedStyle[m];
                }
              }
            }
            if (skin) {
              // @ts-ignore
              if (lib.qhly_level[namex + '_' + skin]) {
                // @ts-ignore
                level = lib.qhly_level[namex + '_' + skin];
              }
            }
            if (level) {
              var map = {
                '原画': '原画',
                '普通': '普通',
                '稀有': '稀有',
                '精良': '精良',
                '史诗': '史诗',
                '传说': '传说',
                '动态': '传说',
                '限定': '传说',
                '绝版': '传说',
              };
              var img = null;
              if (map[level]) {
                img = "extension/千幻聆音/image/" + map[level] + ".png";
              } else if (level.indexOf("#") == 0) {
                var l2 = level.replace("#", "");
                img = "extension/千幻聆音/image/" + l2 + ".png";
              } else if (level.indexOf("$") == 0) {
                var l2 = level.replace("$", "");
                img = l2;
              }
              if (img) {
                skinQua.show();
                skinQua.setBackgroundImage(img);
              } else {
                skinQua.hide();
              }
            } else {
              skinQua.hide();
            }
            // var skinQua = ui.create.div('.qhly-skinQua-shousha', skinView);
            // skinQua.style['background-image'] = 'url(' + lib.qhly_path+'image/' + game.qhly_getSkinLevel(namex, skin) + '.png)';
            // @ts-ignore
            if (game.qhly_skinIs(namex, skin)) {
              // @ts-ignore
              skinView.defaultskin.setAttribute('data-sel', true);
              if (skinView.offsetLeft > viewState1.visibleWidth()) viewState1.offset = viewState1.visibleWidth() - (skinView.offsetLeft + viewState1.skinPerWidth);
            } else {
              // @ts-ignore
              skinView.defaultskin.setAttribute('data-sel', false);
            }
            // @ts-ignore
            // @ts-ignore
            // @ts-ignore
            (function (name, skin, view) {
              view.listen(function () {
                if (viewState1.cancelClick) return;
                // @ts-ignore
                game.qhly_setCurrentSkin(namex, skin, function () {
                  viewState1.refreshSkins();
                  // @ts-ignore
                  game.qhly_changeDynamicSkin(namex);
                  // @ts-ignore
                  game.qhlySyncConfig();
                  if (lib.config['extension_千幻聆音_qhly_decadeChangeEffect'] && cPlayer) cPlayer.playChangeSkinEffect(false);
                  if (lib.config.qhly_smallwinclosewhenchange) {
                    exitListener();
                  }
                }, true);

              });
            })(namex, skin, skinView);
            if (skin) {
              // @ts-ignore
              let file = game.qhly_getSkinFile(namex, skin);
              // @ts-ignore
              let skinView2 = skinView.avatar;
              // @ts-ignore
              game.qhly_checkFileExist(file, function (s) {
                if (s) {
                  skinView2.qhly_origin_setBackgroundImage(file);
                } else {
                  var prefix = pkg.prefix;
                  if (typeof prefix == 'function') {
                    prefix = prefix(namex);
                  }
                  // taffy: 注释content.js原版代码喵
                  // if (lib.config.qhly_noSkin == 'origin') skinView2.qhly_origin_setBackgroundImage(prefix + namex + '.jpg');//原画
                  /* taffy分界线 */
                  // taffy: 修复千幻与皮切bug喵
                  if (lib.config.qhly_noSkin == 'origin') {
                    if (prefix.includes('.jpg')) skinView2.qhly_origin_setBackgroundImage(prefix);//原画
                    else skinView2.qhly_origin_setBackgroundImage(prefix + namex + '.jpg');//原画
                  }
                /* taffy分界线 */
                  else skinView2.qhly_origin_setBackgroundImage('extension/千幻聆音/image/noSkin.png');//noskin
                }
              })
            } else {
              // @ts-ignore
              skinView.avatar.qhly_origin_setBackground(namex, 'character');
            }
          }
          if (cPlayer && cPlayer.name1 == name) {
            // @ts-ignore
            if (Math.round(viewState1.skinTotalWidth) >= viewState1.visibleWidth()) cover.setAttribute('data-overstep', true);
            // @ts-ignore
            else cover.setAttribute('data-overstep', false);
          }
          viewState1.refresh();
        }, false);

        //--------------------------------------副将---------------------------------------------
        if (cPlayer && cPlayer.name2) {
          var namey = cPlayer.name2;
          var playFuDynamic = lib.config['extension_千幻聆音_qhly_decadeDynamic'] == 'always' ? false : true;
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          game.qhly_getSkinList(namey, function (ret, list) {
            // @ts-ignore
            var pkg = game.qhly_foundPackage(namey);
            if (!list) list = [];
            list.sort(function (a, b) {
              // @ts-ignore
              var orderA = game.qhly_getOrder(namey, a, pkg);
              // @ts-ignore
              var orderB = game.qhly_getOrder(namey, b, pkg);
              if (orderA > orderB) return 1;
              if (orderA == orderB) return 0;
              return -1;
            });
            const path = pkg.skin.standard;//1
            var skinList = [null];
            if (list && list.length) {
              skinList.addArray(list);
            }
            var dynamicSkinList = [], bothSkin = [], singleDynamic = [];//2
            // @ts-ignore
            if (window.decadeUI) {
              // @ts-ignore
              if (decadeUI.dynamicSkin[namey]) dynamicSkinList = Object.keys(decadeUI.dynamicSkin[namey]);
              singleDynamic = [...dynamicSkinList];//单形态
              for (var i of skinList) {
                if (i) {
                  // @ts-ignore
                  var skin = i.substring(0, i.lastIndexOf('.'));
                  if (dynamicSkinList.includes(skin)) {
                    bothSkin.push(skin);//双形态
                    singleDynamic.remove(skin);
                  }
                }
              }
              if (dynamicSkinList) {
                if (lib.config['extension_千幻聆音_qhly_decadeDynamic'] == 'three' && dynamicSkinList.length > 3) playFuDynamic = false;
                // @ts-ignore
                // @ts-ignore
                // @ts-ignore
                dynamicSkinList.forEach(function (value, index, array) {
                  array[index] += '.jpg';
                })
                skinList = Array.from(new Set(skinList.concat(dynamicSkinList)));
                // @ts-ignore
                skinList.remove('经典形象.jpg');
              }
            }
            // @ts-ignore
            viewState2.skins = skinList;
            viewState2.skinTotalWidth = (viewState2.skinPerWidth + viewState2.skinGap) * skinList.length - viewState2.skinGap + 20;
            for (let i = 0; i < skinList.length; i++) {
              var skin = skinList[i];
              var skinView = ui.create.div('.qh-skinchange-shousha-skin', content2);
              // @ts-ignore
              skinView.avatar = ui.create.div('.primary-avatar', skinView);
              var campWrap = ui.create.div('.qhcamp-wrap.shousha', skinView);
              if(cPlayer){
                campWrap.setAttribute("data-camp", cPlayer.group);
              }
              // @ts-ignore
              skinView.campBack = ui.create.div('.qhcamp-shousha-back', skinView);
              // @ts-ignore
              skinView.campBack.setAttribute('data-pinzhi', game.qhly_getSkinLevel(namey, skin));
              var campName = ui.create.div('.qhcamp-name', campWrap);
              // @ts-ignore
              campName.style.backgroundImage = 'url("' + lib.qhly_path + 'image/decoration/name_' + campWrap.getAttribute('data-camp') + '.png")';
              var avatarName = ui.create.div('.qhavatar-name', campWrap);
              // @ts-ignore
              avatarName.innerHTML = lib.qhly_slimName(namey);//.replace(/<br>/g, '\n');
              var hpWrap = ui.create.div('.qhhp-shousha-wrap', skinView);
              // @ts-ignore
              skinView.belowText = ui.create.div('.qh-skinchange-shousha-skin-text', hpWrap);
              // @ts-ignore
              viewState2.skinViews.push(skinView);
              skinView.style.left = Math.round((viewState1.skinPerWidth + viewState1.skinGap) * i + 16) + "px";
              skinView.style.width = Math.round(viewState1.skinPerWidth) + "px";
              // @ts-ignore
              skinView.avatar.classList.add('qh-not-replace');
              // @ts-ignore
              skinView.defaultskin = ui.create.div('.qh-skinchange-skin-shousha-default', skinView);
              // @ts-ignore
              skinView.$dynamicWrap = ui.create.div('.qhdynamic-shousha-wrap', skinView);
              // @ts-ignore
              skinView.toImageBtn = ui.create.div('.qh-domtoimage', skinView);
              // @ts-ignore
              skinView.toImageBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                // @ts-ignore
                game.qhly_dom2image(ingame, namey, this, path);
              });//3
              // @ts-ignore
              skinView.dynamicToggle = ui.create.div('.qh-skinchange-shousha-dynamicChange', skinView);
              //if (skin && bothSkin.includes(skin.substring(0, skin.lastIndexOf('.')))) skinView.dynamicToggle.setAttribute('toggle', true);
              // @ts-ignore
              if (!skin && dynamicSkinList.includes('经典形象.jpg')) skinView.dynamicToggle.setAttribute('toggle', true);
              if (skin && lib.config.qhly_skinset.djtoggle[namey]) {
                // @ts-ignore
                if (lib.config.qhly_skinset.djtoggle[namey][skin.substring(0, skin.lastIndexOf('.'))]) skinView.dynamicToggle.classList.add('jing');
              }
              // @ts-ignore
              skinView.dynamicToggle.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                if (this.classList.contains('jing')) {
                  this.classList.remove('jing');
                  // @ts-ignore
                  if (playFuDynamic) game.qhly_changeDynamicSkin(this.parentNode, this.parentNode.belowText.innerText, namey);
                  if (lib.config.qhly_skinset.djtoggle[namey] && lib.config.qhly_skinset.djtoggle[namey][this.parentNode.belowText.innerText]) delete lib.config.qhly_skinset.djtoggle[namey][this.parentNode.belowText.innerText];
                }
                else {
                  this.classList.add('jing');
                  if (playFuDynamic && this.parentNode.stopDynamic) this.parentNode.stopDynamic();
                  if (lib.config.qhly_smallwindowstyle == 'shousha') {
                    // @ts-ignore
                    this.parentNode.campBack.setAttribute("data-pinzhi", game.qhly_getSkinLevel(namey, skin));
                    this.parentNode.campBack.classList.remove('dong');
                  }
                  if (!lib.config.qhly_skinset.djtoggle[namey]) lib.config.qhly_skinset.djtoggle[namey] = {};
                  lib.config.qhly_skinset.djtoggle[namey][this.parentNode.belowText.innerText] = true;
                }
                // @ts-ignore
                game.qhlySyncConfig();
              });
              if (skin) {
                var str = skin.substring(0, skin.lastIndexOf('.'));
                // @ts-ignore
                if (bothSkin.includes(str)) skinView.dynamicToggle.setAttribute('toggle', true);
                // @ts-ignore
                if (singleDynamic.includes(str) && lib.config['extension_千幻聆音_qhly_dom2image']) skinView.toImageBtn.setAttribute('single', true);//打开快照
                // @ts-ignore
                var info = game.qhly_getSkinInfo(namey, skin);
                if (info) {
                  // @ts-ignore
                  skinView.belowText.innerHTML = info.translation;
                }
                // @ts-ignore
                if ((!lib.config.qhly_skinset.djtoggle[namey] || lib.config.qhly_skinset.djtoggle[namey] && !lib.config.qhly_skinset.djtoggle[namey][skin.substring(0, skin.lastIndexOf('.'))]) && window.decadeUI && decadeUI.dynamicSkin && decadeUI.dynamicSkin[namey] && Object.keys(decadeUI.dynamicSkin[namey]).includes(info.translation)) {
                  // @ts-ignore
                  if (playFuDynamic) game.qhly_changeDynamicSkin(skinView, info.translation, namey, true);
                }
              } else {
                // @ts-ignore
                skinView.belowText.innerHTML = "经典形象";
                // @ts-ignore
                if (dynamicSkinList.includes('经典形象.jpg') && playFuDynamic) game.qhly_changeDynamicSkin(skinView, '经典形象', namey);
              }
              var skinQua = ui.create.div('.qhly-skinQua-shousha', skinView);
              // @ts-ignore
              var skininfo = game.qhly_getSkinInfo(namey, skin, game.qhly_foundPackage(namey));
              var level = skininfo.level;
              var style = skininfo.levelStyle;
              if (style) {
                // @ts-ignore
                if (!skinQua.qh_savedStyle) {
                  // @ts-ignore
                  skinQua.qh_savedStyle = {};
                  for (var m in skinQua.style) {
                    // @ts-ignore
                    skinQua.qh_savedStyle[m] = skinQua.style[m];
                  }
                }
                for (var s in style) {
                  skinQua.style[s] = style[s];
                }
                var es = ['left', 'bottom', 'top', 'right'];
                for (var m of es) {
                  if (!style[m]) {
                    skinQua.style[m] = "";
                  }
                }
              } else {
                // @ts-ignore
                if (skinQua.qh_savedStyle) {
                  // @ts-ignore
                  for (var m in skinQua.qh_savedStyle) {
                    // @ts-ignore
                    skinQua.style[m] = skinQua.qh_savedStyle[m];
                  }
                }
              }
              if (skin) {
                // @ts-ignore
                if (lib.qhly_level[namey + '_' + skin]) {
                  // @ts-ignore
                  level = lib.qhly_level[namey + '_' + skin];
                }
              }
              if (level) {
                var map = {
                  '原画': '原画',
                  '普通': '普通',
                  '稀有': '稀有',
                  '精良': '精良',
                  '史诗': '史诗',
                  '传说': '传说',
                  '动态': '传说',
                  '限定': '传说',
                  '绝版': '传说',
                };
                var img = null;
                if (map[level]) {
                  img = "extension/千幻聆音/image/" + map[level] + ".png";
                } else if (level.indexOf("#") == 0) {
                  var l2 = level.replace("#", "");
                  img = "extension/千幻聆音/image/" + l2 + ".png";
                } else if (level.indexOf("$") == 0) {
                  var l2 = level.replace("$", "");
                  img = l2;
                }
                if (img) {
                  skinQua.show();
                  skinQua.setBackgroundImage(img);
                } else {
                  skinQua.hide();
                }
              } else {
                skinQua.hide();
              }
              // @ts-ignore
              if (game.qhly_skinIs(namey, skin)) {
                // @ts-ignore
                skinView.defaultskin.setAttribute('data-sel', true);
                if (skinView.offsetLeft > viewState2.visibleWidth()) viewState2.offset = viewState2.visibleWidth() - (skinView.offsetLeft + viewState2.skinPerWidth);
              } else {
                // @ts-ignore
                skinView.defaultskin.setAttribute('data-sel', false);
              }
              // @ts-ignore
              // @ts-ignore
              // @ts-ignore
              (function (name, skin, view) {
                view.listen(function () {
                  if (viewState2.cancelClick) return;
                  // @ts-ignore
                  game.qhly_setCurrentSkin(namey, skin, function () {
                    viewState2.refreshSkins();
                    //if (view.dynamicToggle && view.dynamicToggle.classList && !view.dynamicToggle.classList.contains('jing')) {
                    // @ts-ignore
                    game.qhly_changeDynamicSkin(namey, null, null, true);
                    //}
                    if (lib.config['extension_千幻聆音_qhly_decadeChangeEffect'] && cPlayer) cPlayer.playChangeSkinEffect(true);
                    // @ts-ignore
                    game.qhlySyncConfig();
                    if (lib.config.qhly_smallwinclosewhenchange) {
                      exitListener();
                    }
                  }, true);
                });
              })(namey, skin, skinView);
              if (skin) {
                // @ts-ignore
                let file = game.qhly_getSkinFile(namey, skin);
                // @ts-ignore
                let skinView2 = skinView.avatar;
                // @ts-ignore
                game.qhly_checkFileExist(file, function (s) {
                  if (s) {
                    skinView2.qhly_origin_setBackgroundImage(file);
                  } else {
                    var prefix = pkg.prefix;
                    if (typeof prefix == 'function') {
                      prefix = prefix(namey);
                    }
                    // taffy: 注释content.js原版代码喵
                    // if (lib.config.qhly_noSkin == 'origin') skinView2.qhly_origin_setBackgroundImage(prefix + namey + '.jpg');//原画
                    /* taffy分界线 */
                    // taffy: 修复千幻与皮切bug喵
                    if (lib.config.qhly_noSkin == 'origin') {
                      if (prefix.includes('.jpg')) skinView2.qhly_origin_setBackgroundImage(prefix);//原画
                      else skinView2.qhly_origin_setBackgroundImage(prefix + namey + '.jpg');//原画
                    }
                    /* taffy分界线 */
                    else skinView2.qhly_origin_setBackgroundImage('extension/千幻聆音/image/noSkin.png');//noskin
                  }
                })
              } else {
                // @ts-ignore
                skinView.avatar.qhly_origin_setBackground(namey, 'character');
              }
            }
            if (cPlayer && cPlayer.name2 == name) {
              // @ts-ignore
              if (Math.round(viewState2.skinTotalWidth) >= viewState2.visibleWidth()) cover.setAttribute('data-overstep', true);
              // @ts-ignore
              else cover.setAttribute('data-overstep', false);
            }
            viewState2.refresh();
          }, false);
        }
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        backgroundBack.listen(function (event) {
          exitListener();
        });
        //exit.listen(exitListener);
        enlarge.listen(function () {
          exitListener();
          // @ts-ignore
          game.qhly_open_new(name, 'skill', ingame);
        });
      } catch (e) {
        if (QHLY_DEBUGMODE) {
          throw e;
        }
      }
    };

    function qhly_changeUseSkill(str) {
      let index0 = str.indexOf('{') + 1;
      let index1 = str.indexOf('var');
      let index2 = str.lastIndexOf('}');
      let newStr = str.slice(index0, index1) + 'game.qhly_changeSkillSkin(player, event.skill);\n' + str.slice(index1, index2);
      return newStr;
    }
    /*
    function qhly_changeUseCard(str, num) {
      let index0 = str.indexOf('{') + 1;
      let index1 = str.indexOf('if(cardaudio');
      if (index1 < 0) index1 = str.indexOf('if (cardaudio');
      let index2 = str.indexOf('if(event.animate');
      if (index2 < 0) index2 = str.indexOf('if (event.animate');
      if (num == 2) {
        index2 = str.indexOf('if', index1 + 400);
      }
      let index3 = str.lastIndexOf('}');
      function use() {
        game.broadcastAll(function (player, card) {
          if (lib.config.background_audio) {
            if (get.type(card) == 'equip' && !lib.config.equip_audio) return;
            var sex = player.sex == 'female' ? 'female' : 'male';
            var audioinfo = lib.card[card.name].audio;
            var skin = game.qhly_getSkin(player.name1);
            if (lib.config.qhly_changeSex && lib.config.qhly_changeSex[player.name1] && lib.config.qhly_changeSex[player.name1][skin]) sex = (sex == 'female' ? 'male' : 'female');
            var pkg = game.qhly_foundPackage(player.name1);
            var realName = game.qhly_getRealName(player.name1);
            var pkgPath = (pkg.isExt && realName != player.name1 && skin) ? DEFAULT_PACKAGE.audio : pkg.audio;
            var exchangeCA = false;
            var cardURL = pkgPath + (skin ? realName : player.name1) + '/' + game.qhly_earse_ext(skin) + '/';
            if (lib.qhly_skinChange[realName] && lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)] && lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)].cardaudio) {
              if (game.qhly_getPlayerStatus(player) == 2 && lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)].audio1) cardURL = pkgPath + (skin ? realName : player.name1) + '/' + lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)].audio1;
              exchangeCA = true;
            }
            if (card.name == 'sha' && (card.nature == 'fire' || card.nature == 'thunder' || card.nature == 'ice' || card.nature == 'stab')) {
              if (exchangeCA) {
                cardURL += (card.name + '_' + card.nature);
                //console.log(cardURL);
                if (game.thunderFileExist(lib.assetURL + cardURL + '.mp3')) game.playAudio('..', cardURL);
                else game.playAudio('card', sex, card.name + '_' + card.nature);
              } else game.playAudio('card', sex, card.name + '_' + card.nature);
            } else {
              if (typeof audioinfo == 'string') {
                if (audioinfo.indexOf('ext:') == 0) game.playAudio('..', 'extension', audioinfo.slice(4), card.name + '_' + sex);
                else game.playAudio('card', sex, audioinfo);
              }
              else {
                if (exchangeCA) {
                  cardURL += card.name;
                  //console.log(cardURL);
                  if (game.thunderFileExist(lib.assetURL + cardURL + '.mp3')) game.playAudio('..', cardURL);
                  else game.playAudio('card', sex, card.name);
                } else game.playAudio('card', sex, card.name);
              }
            }
          }
        }, player, card);
      }
      let f = use.toString();
      let newStr = str.slice(index0, index1) + "if(cardaudio)" + f.slice(19, f.length - 1) + str.slice(index2, index3);
      return newStr;
    }*/
    // @ts-ignore
    lib.element.content.useSkill = new Function(qhly_changeUseSkill(lib.element.content.useSkill.toString()));
    //lib.element.content.useCard = new Function(qhly_changeUseCard(lib.element.content.useCard.toString()));
    var oldPlayCardAudio = game.playCardAudio;
    game.playCardAudio=function(card,player){
      if(!_status.event || (!['useCard','respond'].includes(_status.event.name))){
        return oldPlayCardAudio(card,player);
      }
      if (lib.config.background_audio) {
        // @ts-ignore
        var sex = player.sex == 'female' ? 'female' : 'male';
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        var audioinfo = lib.card[card.name].audio;
        // @ts-ignore
        var skin = game.qhly_getSkin(player.name1);
        // @ts-ignore
        if (lib.config.qhly_changeSex && lib.config.qhly_changeSex[player.name1] && lib.config.qhly_changeSex[player.name1][skin]) sex = (sex == 'female' ? 'male' : 'female');
        // @ts-ignore
        var pkg = game.qhly_foundPackage(player.name1);
        // @ts-ignore
        var realName = game.qhly_getRealName(player.name1);
        // @ts-ignore
        var pkgPath = (pkg.isExt && realName != player.name1 && skin) ? DEFAULT_PACKAGE.audio : pkg.audio;
        var exchangeCA = false;
        // @ts-ignore
        var cardURL = pkgPath + (skin ? realName : player.name1) + '/' + game.qhly_earse_ext(skin) + '/';
        // @ts-ignore
        if (lib.qhly_skinChange[realName] && lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)] && lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)].cardaudio) {
          // @ts-ignore
          if (game.qhly_getPlayerStatus(player) == 2 && lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)].audio1) cardURL = pkgPath + (skin ? realName : player.name1) + '/' + lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)].audio1;
          exchangeCA = true;
        }
        if (exchangeCA) {
          // @ts-ignore
          cardURL += card.name;
          // @ts-ignore
          if (game.thunderFileExist(lib.assetURL + cardURL + '.mp3')) game.playAudio('..', cardURL);
          else{
            // @ts-ignore
            return oldPlayCardAudio(card,sex);//game.playAudio('card', sex, card.name);
          }
        } else{
          // @ts-ignore
          return oldPlayCardAudio(card,sex);
        }
      }
    };
    /*
    lib.element.content.respond = function () {
      'step 0'
      var cardaudio = true;
      if (event.skill) {
        if (lib.skill[event.skill].audio) {
          cardaudio = false;
        }
        player.logSkill(event.skill);
        player.checkShow(event.skill, true);
        if (lib.skill[event.skill].onrespond && !game.online) {
          lib.skill[event.skill].onrespond(event, player);
        }
      }
      else if (!event.nopopup) player.tryCardAnimate(card, card.name, 'wood');
      if (cardaudio && event.getParent(3).name == 'useCard') {
        game.broadcastAll(function (player, card) {
          if (lib.config.background_audio) {
            var sex = player.sex == 'female' ? 'female' : 'male';
            var audioinfo = lib.card[card.name].audio;
            var skin = game.qhly_getSkin(player.name1);
            if (lib.config.qhly_changeSex && lib.config.qhly_changeSex[player.name1] && lib.config.qhly_changeSex[player.name1][skin]) sex = (sex == 'female' ? 'male' : 'female');
            var pkg = game.qhly_foundPackage(player.name1);
            var realName = game.qhly_getRealName(player.name1);
            var pkgPath = (pkg.isExt && realName != player.name1 && skin) ? DEFAULT_PACKAGE.audio : pkg.audio;
            var exchangeCA = false;
            var cardURL = pkgPath + (skin ? realName : player.name1) + '/' + game.qhly_earse_ext(skin) + '/';
            if (lib.qhly_skinChange[realName] && lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)] && lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)].cardaudio) {
              if (game.qhly_getPlayerStatus(player) == 2 && lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)].audio1) cardURL = pkgPath + (skin ? realName : player.name1) + '/' + lib.qhly_skinChange[realName][game.qhly_earse_ext(skin)].audio1;
              exchangeCA = true;
            }
            if (typeof audioinfo == 'string' && audioinfo.indexOf('ext:') == 0) {
              game.playAudio('..', 'extension', audioinfo.slice(4), card.name + '_' + sex);
            }
            else {
              if (exchangeCA) {
                cardURL += card.name;
                //console.log(cardURL);
                if (game.thunderFileExist(lib.assetURL + cardURL + '.mp3')) game.playAudio('..', cardURL);
                else game.playAudio('card', sex, card.name);
              } else game.playAudio('card', sex, card.name);
            }
          }
        }, player, card);
      }
      if (event.skill) {
        if (player.stat[player.stat.length - 1].skill[event.skill] == undefined) {
          player.stat[player.stat.length - 1].skill[event.skill] = 1;
        }
        else {
          player.stat[player.stat.length - 1].skill[event.skill]++;
        }
        var sourceSkill = get.info(event.skill).sourceSkill;
        if (sourceSkill) {
          if (player.stat[player.stat.length - 1].skill[sourceSkill] == undefined) {
            player.stat[player.stat.length - 1].skill[sourceSkill] = 1;
          }
          else {
            player.stat[player.stat.length - 1].skill[sourceSkill]++;
          }
        }
      }
      if (cards.length && (cards.length > 1 || cards[0].name != card.name)) {
        game.log(player, '打出了', card, '（', cards, '）');
      }
      else {
        game.log(player, '打出了', card);
      }
      player.actionHistory[player.actionHistory.length - 1].respond.push(event);
      if (window.decadeUI) {
        var cards2 = cards.concat();
        if (cards2.length) {
          var next = player.lose(cards2, ui.ordering, 'visible');
          cards2.removeArray(next.cards);
          if (event.noOrdering)
            next.noOrdering = true;

          if (event.animate != false && event.throw !== false) {
            next.animate = true;
            next.blameEvent = event;
          }

          if (cards2.length) {
            var next2 = game.cardsGotoOrdering(cards2);
            if (event.noOrdering)
              next2.noOrdering = true;

            player.$throw(cards2);
          }
        }
      } else {
        if (cards.length) {
          var owner = (get.owner(cards[0]) || player);
          var next = owner.lose(cards, 'visible', ui.ordering).set('type', 'use');
          var directDiscard = [];
          for (var i = 0; i < cards.length; i++) {
            if (!next.cards.includes(cards[i])) {
              directDiscard.push(cards[i]);
            }
          }
          if (directDiscard.length) game.cardsGotoOrdering(directDiscard);
        }
        if (event.animate != false && event.throw !== false) {
          for (var i = 0; i < cards.length; i++) {
            player.$throw(cards[i]);
            if (event.highlight) {
              cards[i].clone.classList.add('thrownhighlight');
              game.addVideo('highlightnode', player, get.cardInfo(cards[i]));
            }
          }
          if (event.highlight) {
            game.broadcast(function (cards) {
              for (var i = 0; i < cards.length; i++) {
                if (cards[i].clone) {
                  cards[i].clone.classList.add('thrownhighlight');
                }
              }
            }, cards);
          }
        }
      }
      event.trigger('respond');
      'step 1'
      game.delayx(0.5);
    }
    */
    // @ts-ignore
    game.qhly_checkLoadSuccess = function(){
      // @ts-ignore
      if(lib.config.qhly_currentViewSkin == 'shousha' && !game.qhly_initShoushaView){
        return false;
      }
      return true;
    };
    //打开选择皮肤界面。
    // @ts-ignore
    game.qhly_open_new = function (name, page, ingame) {
      //try {
        // @ts-ignore
        if(game.qhly_open_new_replace){
          // @ts-ignore
          game.qhly_open_new_replace(name,page,ingame);
          return;
        }
        // @ts-ignore
        if(!game.qhly_checkLoadSuccess()){
            return;
        }
        //if(name.indexOf('gz_') == 0){
        //    name = name.slice(3);
        //}
        var cplayer = null;
        if (ingame) {
          // @ts-ignore
          if (get.itemtype(ingame) == 'player') {
            cplayer = ingame;
          // @ts-ignore
          } else if (ingame.parentNode && get.itemtype(ingame.parentNode) == 'player') {
            cplayer = ingame.parentNode;
          }
        }
        // @ts-ignore
        if (_status.qhly_open || _status.bigEditing) return;
        // @ts-ignore
        _status.qhly_open = true;
        // @ts-ignore
        _status.qhly_skillAudioWhich = {};
        // @ts-ignore
        var currentViewSkin = lib.qhly_viewskin[lib.config.qhly_currentViewSkin];
        var gback = ui.create.div('.qh-background');
        var background = ui.create.div('.qh-window', gback);
        var backButton = ui.create.div('.qh-back', background);
        if (lib.config.qhly_currentViewSkin == 'shousha') var dibuhuo = ui.create.div('.qh-dibuhuo', background);
        var setSize = function () {
          var screenWidth = ui.window.offsetWidth;
          var screenHeight = ui.window.offsetHeight;
          var whr = currentViewSkin.whr ? currentViewSkin.whr : 1.7198;
          var width;
          var height;
          if (screenWidth / whr > screenHeight) {
            height = screenHeight;
            width = height * whr;
          } else {
            width = screenWidth;
            height = screenWidth / whr;
          }
          if (lib.config.qhly_currentViewSkin != 'decade' && lib.config.qhly_currentViewSkin != 'shousha') {
            if (height < screenHeight && lib.config.qhly_layoutFitY) {
              height = screenHeight;
            }
            if (width < screenWidth && lib.config.qhly_layoutFitX) {
              width = screenWidth;
            }
          }
          if (lib.config.qhly_currentViewSkin == 'shousha') {
            backButton.style.transform = 'translateY(' + (Math.round(height) - document.body.offsetHeight) * 0.5 + 'px)';
            dibuhuo.style.transform = 'translateY(' + (document.body.offsetHeight - Math.round(height)) * 0.5 + 'px)';
          }
          background.style.height = Math.round(height) + "px";
          background.style.width = Math.round(width) + "px";
        };
        setSize();
        var resize = function () {
          setTimeout(setSize, 500);
        };
        lib.onresize.push(resize);
        backButton.listen(function () {
          // @ts-ignore
          game.qhly_playQhlyAudio(lib.config.qhly_currentViewSkin == 'decade' ? 'qhly_voc_dec_press' : 'qhly_voc_press', null, true);
          gback.delete(500, function () {
            lib.onresize.remove(resize);
            game.resume2();
            // @ts-ignore
            _status.qhly_open = false;
          });
          // @ts-ignore
          delete _status.qhly_skillAudioWhich;
          // @ts-ignore
          if (window.inSplash && game.qhly_hasExtension("如真似幻")) {
            ui.window.remove();
          }
        });
        gback.hide();
        document.body.appendChild(gback);
        // @ts-ignore
        if (lib.config.qhly_currentViewSkin == 'decade') game.qhly_initDecadeView(name, background, page, cplayer);
        else if (lib.config.qhly_currentViewSkin == 'shousha') {
          // @ts-ignore
          if(game.qhly_initShoushaView){
            // @ts-ignore
            game.qhly_initShoushaView(name, background, page, cplayer);
          }
        }
        // @ts-ignore
        else if(game.qhly_initNewViewReplace){
          // @ts-ignore
          game.qhly_initNewViewReplace(name, background, page, cplayer);
        }else{
          // @ts-ignore
          game.qhly_initNewView(name, background, page, cplayer);
        }
        gback.show();
        game.pause2();
      // } catch (e) {
      //   if (QHLY_DEBUGMODE) {
      //     throw e;
      //   }
      // }
    };
    // @ts-ignore
    get.qhly_getMp = function (name, pkg) {
      if (!pkg) {
        // @ts-ignore
        pkg = game.qhly_foundPackage(name);
      }
      if (pkg && pkg.characterMp) {
        var ret = pkg.characterMp(name);
        return ret;
      }
      return null;
    };
    // @ts-ignore
    get.qhly_getIntroduce = function (name, pkg) {
      if (!pkg) {
        // @ts-ignore
        pkg = game.qhly_foundPackage(name);
      }
      if (pkg && pkg.characterInfo) {
        var intro = pkg.characterInfo(name);
        if (intro) {
          return intro;
        }
      }
      return get.characterIntro(name);
    };
    // @ts-ignore
    ui.qhly_bindCheckBoxAndSpanText = function (checkbox, text) {
      if (!text) return;
      // @ts-ignore
      ui.qhly_addListenFunc(text);
      text.listen(function () {
        // @ts-ignore
        game.qhly_playQhlyAudio('qhly_voc_check', null, true);
        checkbox.qhly_setChecked(!checkbox.qhly_checked, true);
      });
    };
    // @ts-ignore
    ui.qhly_addListenFunc = function (view) {
      view.listen = function (func) {
        if (lib.config.touchscreen) {
          this.addEventListener('touchend', function (e) {
            if (!_status.dragged) {
              func.call(this, e);
            }
          });
          var fallback = function (e) {
            if (!_status.touchconfirmed) {
              func.call(this, e);
            }
            else {
              this.removeEventListener('click', fallback);
            }
          }
          this.addEventListener('click', fallback);
        }
        else {
          this.addEventListener('click', func);
        }
        return this;
      };
    };
    // @ts-ignore
    ui.qhly_initCheckBox = function (view, checked, forbid) {
      view.style.width = '30px';
      view.style.height = '30px';
      view.style.display = 'inline';
      view.qhly_checked = checked;
      // @ts-ignore
      ui.qhly_addListenFunc(view);
      if (view.qhly_checked) {
        // @ts-ignore
        view.src = lib.assetURL + get.qhly_getIf(lib.qhly_viewskin[lib.config.qhly_currentViewSkin].checkBoxCheckedImage, 'extension/千幻聆音/image/newui_checkbox_checked.png');
      } else {
        // @ts-ignore
        view.src = lib.assetURL + get.qhly_getIf(lib.qhly_viewskin[lib.config.qhly_currentViewSkin].checkBoxImage, 'extension/千幻聆音/image/newui_checkbox_unchecked.png');
      }
      view.qhly_setChecked = function (checked, trigger) {
        if (trigger === undefined) trigger = true;
        if (checked != this.qhly_checked) {
          this.qhly_checked = checked;
          if (this.qhly_checked) {
            // @ts-ignore
            this.src = lib.assetURL + get.qhly_getIf(lib.qhly_viewskin[lib.config.qhly_currentViewSkin].checkBoxCheckedImage, 'extension/千幻聆音/image/newui_checkbox_checked.png');
          } else {
            // @ts-ignore
            this.src = lib.assetURL + get.qhly_getIf(lib.qhly_viewskin[lib.config.qhly_currentViewSkin].checkBoxImage, 'extension/千幻聆音/image/newui_checkbox_unchecked.png');
          }
          // @ts-ignore
          if (trigger && this.qhly_onchecked) {
            // @ts-ignore
            this.qhly_onchecked(this.qhly_checked);
          }
        }
      };
      view.listen(function () {
        if (forbid) return;
        // @ts-ignore
        game.qhly_playQhlyAudio('qhly_voc_check', null, true);
        this.qhly_checked = !this.qhly_checked;
        if (this.qhly_checked) {
          // @ts-ignore
          this.src = lib.assetURL + get.qhly_getIf(lib.qhly_viewskin[lib.config.qhly_currentViewSkin].checkBoxCheckedImage, 'extension/千幻聆音/image/newui_checkbox_checked.png');
        } else {
          // @ts-ignore
          this.src = lib.assetURL + get.qhly_getIf(lib.qhly_viewskin[lib.config.qhly_currentViewSkin].checkBoxImage, 'extension/千幻聆音/image/newui_checkbox_unchecked.png');
        }
        // @ts-ignore
        if (this.qhly_onchecked) {
          // @ts-ignore
          this.qhly_onchecked(this.qhly_checked);
        }
      });
    };
    // @ts-ignore
    game.qhly_getCharacterTaici = function (name, skin, pkg) {
      if (name.indexOf('gz_') == 0) {
        // @ts-ignore
        if (lib.config.qhly_guozhan === false || get.mode() != 'guozhan' || !game.qhly_hasGuozhanAudio(name)) {
          var subname = name.slice(3);
          if (get.character(subname)) {
            name = subname;
          }
        }
      }
      // @ts-ignore
      var realName = game.qhly_getRealName(name);//添加皮肤共享
      // @ts-ignore
      if (!pkg) pkg = game.qhly_foundPackage(pkg);
      var taici;
      if (!skin) {
        // @ts-ignore
        var dinfo = lib.qhly_dirskininfo[realName];
        if (dinfo && dinfo.origin && dinfo.origin.skill) {
          taici = dinfo.origin.skill;
        } else if (pkg.characterTaici) {
          taici = pkg.characterTaici(name);
        } else {
          taici = undefined;
        }
        if(!taici){
          // @ts-ignore
          taici = game.qhly_getNonameTaici(name);
        }
        return taici;
      } else {
        // @ts-ignore
        var skinInfo = game.qhly_getSkinInfo(name, skin, pkg);
        if (skinInfo) {
          return skinInfo.skill;
        }
        return undefined;
      }
    };
    // @ts-ignore
    game.qhly_getNonameTaici = function(name){
      // @ts-ignore
      let skills = game.qhly_getViewSkills(name);
      let ret = {};
      skills.forEach((skill,i)=>{
        let textMap = game.parseSkillTextMap(skill,name);
        let content = textMap.filter(current=>current.text).reduce((previous,current,currentIndex,array)=>{
          return previous+current.text+((currentIndex == array.length-1) ?"":"<br>");
        },"");
        ret[skill] = {
          order:i,
          content
        };
      });
      ret['die'] = {
        order:skills.length+1,
        content:lib.translate[`#${name}:die`]
      };
      return ret;
    };
    // @ts-ignore
    get.qhly_getAudioInfoInSkin = function (name, pkg, skin) {
      if (name.indexOf('gz_') == 0) {
        // @ts-ignore
        if (lib.config.qhly_guozhan === false || get.mode() != 'guozhan' || !game.qhly_hasGuozhanAudio(name)) {
          var subname = name.slice(3);
          if (get.character(subname)) {
            name = subname;
          }
        }
      }
      // @ts-ignore
      if (!pkg) pkg = game.qhly_foundPackage(name);
      var list = [];
      var skills = get.character(name, 3);
      if (!skills) return list;
      for (var skill of skills) {
        if (!lib.translate[skill + "_info"]) continue;
        list.add(skill);
        var info = get.info(skill);
        if (info.derivation) {
          var derivation = [];
          if (typeof info.derivation == 'string') {
            derivation.add(info.derivation);
          } else {
            for (var de of info.derivation) {
              derivation.add(de);
            }
          }
          for (var der of derivation) {
            var info = get.info(der);
            if (info && !info.equipSkill && !info.xwMijiSkill) {
              list.add(der);
            }
          }
        }
      }
      var ret = [];
      if (!skin) {
        var taici;
        // @ts-ignore
        var dinfo = lib.qhly_dirskininfo[name];
        if (dinfo && dinfo.origin && dinfo.origin.skill) {
          taici = dinfo.origin.skill;
        } else if (pkg.characterTaici) {
          taici = pkg.characterTaici(name);
        } else {
          taici = undefined;
        }
        if(!taici){
          // @ts-ignore
          taici = game.qhly_getNonameTaici(name);
        }
        // @ts-ignore
        for (var skill of list) {
          if (!lib.translate[skill + "_info"]) continue;
          var obj = {
            id: skill,
            name: get.translation(skill),
          };
          if (taici) {
            var skillTaici = taici[skill];
            if (skillTaici) {
              if (skillTaici.hide) continue;
              if (skillTaici.order) obj.order = skillTaici.order;
              if (skillTaici.name) {
                obj.name = skillTaici.name;
              }
              obj.content = skillTaici.content;
            }
          }
          ret.add(obj);
        }
        ret.sort(function (a, b) {
          var orderA = a.order ? a.order : Infinity;
          var orderB = b.order ? b.order : Infinity;
          return orderA - orderB;
        });
        if (taici) {
          if (taici.die) {
            ret.push({
              id: 'die',
              name: taici.die.name ? taici.die.name : '阵亡',
              content: taici.die.content,
            });
          }
          ret.push({
            id: 'victory',
            name: (taici.victory && taici.victory.name) ? taici.victory.name : '胜利',
            content: taici.victory && taici.victory.content,
          });

        } else {
          ret.addArray([{
            id: 'die',
            name: '阵亡',
          }, {
            id: 'victory',
            name: '胜利',
          }]);
        }
      } else {
        var taici;
        // @ts-ignore
        var skinInfo = game.qhly_getSkinInfo(name, skin, pkg);
        // @ts-ignore
        for (var skill of list) {
          if (!lib.translate[skill + "_info"]) continue;
          var obj = {
            id: skill,
            name: get.translation(skill),
          };
          if (skinInfo.skill) {
            var skillTaici = skinInfo.skill[skill];
            if (skillTaici) {
              if (skillTaici.hide) continue;
              if (skillTaici.order) obj.order = skillTaici.order;
              if (skillTaici.name) {
                obj.name = skillTaici.name;
              }
              obj.content = skillTaici.content;
            }
          }
          ret.add(obj);
        }
        ret.sort(function (a, b) {
          var orderA = a.order ? a.order : Infinity;
          var orderB = b.order ? b.order : Infinity;
          return orderA - orderB;
        });
        var die = {
          id: 'die',
          name: '阵亡',
        };

        var victory = {
          id: 'victory',
          name: '胜利',
        }
        ret.addArray([die, victory]);
        if (skinInfo && skinInfo.skill) {
          if (skinInfo.skill.die) {
            die.content = skinInfo.skill.die.content;
            if (skinInfo.skill.die.name) {
              die.name = skinInfo.skill.die.name;
            }
          }
          if (skinInfo.skill.victory) {
            victory.content = skinInfo.skill.victory.content;
            if (skinInfo.skill.victory.name) {
              victory.name = skinInfo.skill.victory.name;
            }
          }
        }
      }
      return ret;
    };
    // @ts-ignore
    game.qhly_getPluginId = function(plugin){
      var pluginId = plugin.id;
      if(!pluginId){
        pluginId = plugin.label;
      }
      if(!pluginId){
        pluginId = plugin.name;
      }
      if(!pluginId){
        return false;
      }
      return pluginId;
    };
    // @ts-ignore
    game.qhly_pluginIsEnable = function(plugin){
      // @ts-ignore
      var pluginId = game.qhly_getPluginId(plugin);
      if(pluginId === false)return false;
      if(lib.config.qhly_disabledPlugins && lib.config.qhly_disabledPlugins.includes(pluginId)){
        return false;
      }
      if(!plugin.enable){
        return true;
      }
      if(typeof plugin.enable == 'function'){
        return plugin.enable();
      }
      return plugin.enable;
    };
    // @ts-ignore
    game.qhly_getPlugins = function (type,enabledOnly) {
      if(enabledOnly === undefined){
        enabledOnly = true;
      }
      var ret = [];
      // @ts-ignore
      for (var plugin of lib.qhlyPlugins) {
        if(enabledOnly){
          // @ts-ignore
          if (!game.qhly_pluginIsEnable(plugin)) continue;
        }
        if (type && plugin.pluginType != type) continue;
        ret.push(plugin);
      }
      return ret;
    };
    // @ts-ignore
    game.qhly_getIntroduceExtraPage = function (name, pkg) {
      if (lib.config.qhly_forbidExtPage) {
        return undefined;
      }
      var ret = [];
      // @ts-ignore
      if (!pkg) pkg = game.qhly_foundPackage(name);
      if (pkg.characterIntroduceExtra) {
        var extra = pkg.characterIntroduceExtra(name);
        if (extra) {
          ret.addArray(extra);
        }
      }
      // @ts-ignore
      if (lib.qhlyPlugins) {
        // @ts-ignore
        for (var plugin of game.qhly_getPlugins('角色介绍附加页')) {
          (function (name, plugin) {
            if (!plugin.characterFilter || plugin.characterFilter(name)) {
              ret.push({
                name: plugin.name,
                func: function (name) {
                  return {
                    content: plugin.content(name),
                    handleView: function (view, name) {
                      if (plugin.handleView) {
                        plugin.handleView(view, name);
                      }
                    }
                  };
                }
              });
            }
          })(name, plugin);
        }
      }
      if (ret.length) {
        return ret;
      }
    };
    // @ts-ignore
    game.qhly_getCharacterZhanjiPage = function (name) {
      var str = "";
      var record = lib.config.qhly_winrecord;
      if (record && record[name]) {
        var modekeys = Object.keys(record[name]);
        var modeSort = {
          'identity': 1,
          'guozhan': 2,
          'doudizhu': 3,
        };
        modekeys.sort(function (a, b) {
          if (a == b) return 0;
          if (modeSort[a] && modeSort[b]) {
            return modeSort[a] - modeSort[b];
          }
          if (modeSort[a]) {
            return -1;
          }
          if (modeSort[b]) {
            return 1;
          }
          return a < b ? -1 : 1;
        });
        for (var mode of modekeys) {
          str += "<h1>" + get.translation(mode) + "模式：</h1>";
          var identitySort = {
            '主公': 1,
            '盟主': 2,
            '忠臣': 3,
            '侠士': 4,
            '护卫': 5,
            '反贼': 6,
            '乱寇': 7,
            '刺客': 8,
            '逆贼': 9,
            '内奸': 10,
            '细作': 11,
            '僭主': 12,
            '地主': 13,
            '农民': 14,
          };
          var identKeys = Object.keys(record[name][mode]);
          identKeys.sort(function (a, b) {
            if (a == b) return 0;
            if (identitySort[a] && identitySort[b]) {
              return identitySort[a] - identitySort[b];
            }
            if (identitySort[a]) {
              return -1;
            }
            if (identitySort[b]) {
              return 1;
            }
            return a < b ? -1 : 1;
          });
          for (var identity of identKeys) {
            var ri = record[name][mode][identity];
            var win = ri.win ? ri.win : 0;
            var lose = ri.lose ? ri.lose : 0;
            str += "<h2>" + identity + "：</h2>";
            str += "<p>胜利：" + win;
            str += "&nbsp;&nbsp;失败：" + lose;
            str += "&nbsp;&nbsp;总场：" + (win + lose);
            str += "&nbsp;&nbsp;胜率：" + (((win + lose) <= 0) ? 0 : ((win * 100 / (win + lose)).toFixed(2))) + "%";
            str += "</p>";
            str += "<br>";
          }
        }
      } else {
        return "该武将还未进行过对局。";
      }
      return str;
    };
    // @ts-ignore
    get.qhly_getOriginSkinInfo = function (name, pkg) {
      // @ts-ignore
      if (!pkg) pkg = game.qhly_foundPackage(name);
      if (pkg.originSkinInfo) {
        return pkg.originSkinInfo(name);
      }
      return "";
    };
    // @ts-ignore
    game.qhly_createBelowMenu = function (items, parent) {
      var menu = ui.create.div('.qh-below-menu', parent);
      var content = "";
      // @ts-ignore
      if (!_status.qhly_belowMenuId) {
        // @ts-ignore
        _status.qhly_belowMenuId = 1;
      } else {
        // @ts-ignore
        _status.qhly_belowMenuId++;
      }
      // @ts-ignore
      var id = _status.qhly_belowMenuId;
      content += "<table style='width:100%;height:auto;' border='0' frame='void' rules='none'>";
      var bid_i = 0;
      for (var item of items) {
        content += "<tr>";
        content += "<td class='qh-below-menu-item' id='qhly_below_menu_" + id + "_" + bid_i + "'>" + item.name + "</td>";
        content += "</tr>";
        bid_i++;
      }
      content += "</table>";
      menu.innerHTML = content;
      lib.setScroll(menu);
      for (var i = 0; i < bid_i; i++) {
        var td = document.getElementById('qhly_below_menu_' + id + "_" + i);
        if (td) {
          // @ts-ignore
          ui.qhly_addListenFunc(td);
          (function (i, td) {
            // @ts-ignore
            td.listen(function (e) {
              var item = items[i];
              if (item.onchange) {
                item.onchange();
              }
              e.stopPropagation();
            });
          })(i, td);
        }
      }
      return menu;
    };


    //-------------------------------------------------------------thunder-----------------------------------------------
    // @ts-ignore
    game.qhly_initDecadeView = function (name, view, page, cplayer) {
      // @ts-ignore
      var currentViewSkin = lib.qhly_viewskin[lib.config.qhly_currentViewSkin];
      var subView = {};
      if (!page) {
        page = 'introduce';
      }
      // @ts-ignore
      view.style['background-image'] = 'url(' + lib.qhly_path + 'theme/decade/background/' + lib.config.qhly_decadeBigBak + '.jpg)';
      ui.create.div('.qh-dcdaiji', view);
      var changeBgBtn = ui.create.div('.qh-dcchangebgbtn', view);
      changeBgBtn.listen(function () {
        var bgIndex = parseInt(lib.config.qhly_decadeBigBak);
        bgIndex++;
        // @ts-ignore
        var path = lib.qhly_path + 'theme/decade/background/' + bgIndex + '.jpg';
        // @ts-ignore
        if (!game.thunderFileExist(path)) bgIndex = 1;
        lib.config.qhly_decadeBigBak = bgIndex;
        game.saveConfig('qhly_decadeBigBak', bgIndex);
        // @ts-ignore
        game.qhly_playQhlyAudio('qhly_voc_click3', null, true);
        // @ts-ignore
        view.style['background-image'] = 'url(' + lib.qhly_path + 'theme/decade/background/' + lib.config.qhly_decadeBigBak + '.jpg)';
      })
      var refreshRank = function () { };
      subView.avatar = ui.create.div('.qh-shousha-big-avatar', view);
      if (lib.config.qhly_lutouType && lib.config.qhly_lutouType == 'shousha') subView.avatar.classList.add('shousha');
      subView.avatar.id = 'mainView';
      // @ts-ignore
      subView.avatar.name = name;
      subView.avatar.hide();
      subView.pageButton = {
        introduce: ui.create.div('.qh-button', view),
        skill: ui.create.div('.qh-button.skillB', view),
        skin: ui.create.div('.qh-button.skinB', view),
        config: ui.create.div('.qh-button.configB', view),
      };
      var setSize = function () {
        for (var i in subView.pageButton) {
          subView.pageButton[i].style.setProperty('--w', document.body.offsetWidth);
        }
      };
      setSize();
      var resize = function () {
        setTimeout(setSize, 600);
      };

      lib.onresize.push(resize);
      if (!lib.config.qhly_shoushaBigFlip) lib.config.qhly_shoushaBigFlip = {};
      if (!lib.config.qhly_shoushaBigFlip[name]) lib.config.qhly_shoushaBigFlip[name] = {};
      subView.menuCover = ui.create.div();
      subView.menuCover.style.width = "100%";
      subView.menuCover.style.height = "100%";
      // @ts-ignore
      subView.menuCover.style.zIndex = 38;
      subView.nameTitle = ui.create.div('.qh-nametitle', view);
      subView.nameTitle.innerHTML = get.translation(name);
      subView.avatarImage = ui.create.div('.qh-image-standard', subView.avatar);
      // @ts-ignore
      if (game.qhly_getPlayerStatus(cplayer, cplayer && cplayer.name2 && cplayer.name2 == name) == 2) game.qhly_setPlayerStatus(subView.avatarImage, undefined, 2);
      // @ts-ignore
      subView.avatarImage.stopDynamic = qhly_stopdynamic;
      subView.avatarImage.classList.add('qh-must-replace');
      subView.avatarImage.classList.add('qh-isBigAvatar');
      // @ts-ignore
      subView.avatarImage.setAttribute("data-border-level", game.qhly_getDengJie(name));
      // @ts-ignore
      subView.avatarImage.$dynamicWrap = ui.create.div('.qhdynamic-decade-big-wrap', subView.avatarImage);
      var timer = null;
      subView.avatarImage.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function (e) {
        // @ts-ignore
        if (!subView.avatarImage.dynamic || subView.avatarImage.dynamic && subView.avatarImage.dynamic.primary == null) {
          if (!subView.avatarImage.classList.contains('decadeBig')) return;
        }
        timer = setTimeout(function () {
          e.preventDefault();
          // @ts-ignore
          if (_status.bigEditing) return;
          // @ts-ignore
          game.qhly_bigEdit(state);
        }, 800);
      });
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      subView.avatarImage.addEventListener(lib.config.touchscreen ? "touchmove" : 'mousemove', function (e) {
        clearTimeout(timer);
      });
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      subView.avatarImage.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", function (e) {
        // @ts-ignore
        game.playShoushaAvatar(this, lib.config.qhly_shoushaBigFlip[name][game.qhly_getSkin(name)], name); //十周年还需要补充是否翻转X
        clearTimeout(timer);
      });
      subView.skinBar = ui.create.div('.qh-skinchange-big-skinBar', subView.avatar);
      subView.dynamicToggle = ui.create.div('.qh-skinchange-dynamicChange', subView.skinBar);
      subView.dynamicToggle.style.cssText += 'position:relative;top:-39%;width:' + document.body.offsetWidth * 0.08 + 'px;height:' + document.body.offsetWidth * 0.05 + 'px';
      // @ts-ignore
      var skinStr = game.qhly_getSkin(name);
      if (skinStr == null) skinStr = '经典形象';
      else skinStr = skinStr.split('.')[0];
      if (lib.config.qhly_skinset.djtoggle[name] && lib.config.qhly_skinset.djtoggle[name][skinStr]) subView.dynamicToggle.classList.add('jing');
      subView.dynamicToggle.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
        // @ts-ignore
        var skinStr = game.qhly_getSkin(name);
        if (skinStr == null) skinStr = '经典形象';
        else skinStr = skinStr.split('.')[0];
        // @ts-ignore
        var djtoggle = document.getElementById('qhlydecadeBigdjtoggle' + game.qhly_getSkin(name));
        if (this.classList.contains('jing')) {
          this.classList.remove('jing');
          if (djtoggle) {
            // @ts-ignore
            game.qhly_changeDynamicSkin(djtoggle.parentNode, skinStr, name);
            djtoggle.classList.remove('jing');
          }
          // @ts-ignore
          game.qhly_changeDynamicSkin(state.mainView.avatarImage, skinStr, name);
          if (lib.config.qhly_skinset.djtoggle[name] && lib.config.qhly_skinset.djtoggle[name][skinStr]) delete lib.config.qhly_skinset.djtoggle[name][skinStr];
        }
        else {
          this.classList.add('jing');
          if (djtoggle) {
            // @ts-ignore
            if (!djtoggle.parentNode.stopDynamic) djtoggle.parentNode.stopDynamic = qhly_stopdynamic;
            // @ts-ignore
            djtoggle.parentNode.stopDynamic();
            djtoggle.classList.add('jing');
          }
          // @ts-ignore
          if (state.mainView.avatarImage.stopDynamic) state.mainView.avatarImage.stopDynamic();
          if (!lib.config.qhly_skinset.djtoggle[name]) lib.config.qhly_skinset.djtoggle[name] = {};
          lib.config.qhly_skinset.djtoggle[name][skinStr] = true;
        }
        // @ts-ignore
        game.qhlySyncConfig();
        // @ts-ignore
        if (!_status['qhly_primarySkin_' + name] || _status['qhly_primarySkin_' + name] && _status['qhly_primarySkin_' + name] == game.qhly_getSkin(name)) game.qhly_changeDynamicSkin(name);
      });
      //subView.avatarImage.classList.add('avatar');
      subView.avatarBorder = ui.create.div('.qh-avatarother', subView.avatar);
      subView.rank = ui.create.div('.qh-avatarrarity', subView.avatar);
      // @ts-ignore
      subView.rank.style['background-image'] = 'url(' + lib.qhly_path + 'theme/decade/rarity_' + game.getRarity(name) + '.png)';
      //subView.group = ui.create.div('.qh-avatar-label-group', subView.avatarLabel);
      //subView.rank = ui.create.div('.qh-avatar-label-rank', subView.avatarLabel);
      subView.name = ui.create.div('.qh-avatar-label-name', subView.avatarLabel);
      subView.characterTitle = ui.create.div('.qh-avatar-label-title', subView.avatar);
      subView.hp = ui.create.div('.qh-hp', view);
      subView.hpText = ui.create.div('.qh-hptext', subView.hp);
      subView.hp.hide();
      subView.mp = ui.create.div('.qh-mp');
      subView.mpText = ui.create.div('.qh-mptext', subView.mp);
      subView.mp.hide();
      subView.pageButton.introduce.innerHTML = "简介";
      subView.pageButton.skill.innerHTML = "技能";
      subView.pageButton.skin.innerHTML = "皮肤";
      subView.pageButton.config.innerHTML = "选项";
      // @ts-ignore
      subView.pageButton.introduce.downButton = ui.create.div('.qh-otherinfoarrow', subView.pageButton.introduce);
      var swipe_up = lib.config.swipe_up;
      lib.config.swipe_up = '';
      var swipe_down = lib.config.swipe_down;
      lib.config.swipe_down = '';
      var swipe_left = lib.config.swipe_left;
      lib.config.swipe_left = '';
      var swipe_right = lib.config.swipe_right;
      lib.config.swipe_right = '';
      subView.backButton = document.getElementsByClassName('qh-back')[0];
      // @ts-ignore
      subView.backButton.listen(function () {
        lib.config.swipe_up = swipe_up;
        lib.config.swipe_down = swipe_down;
        lib.config.swipe_left = swipe_left;
        lib.config.swipe_right = swipe_right;
        // @ts-ignore
        game.qhly_checkPlayerImageAudio(name, game.qhly_getSkin(name), cplayer, function () {
          let avatar;
          // @ts-ignore
          let playerName = game.qhly_getRealName(name);
          if (cplayer && !cplayer.doubleAvatar) avatar = 'avatar';
          else avatar = cplayer.name1 == name ? 'avatar' : 'avatar2';
          // @ts-ignore
          let skin = game.qhly_getSkin(name);
          cplayer.node[avatar].qhly_origin_setBackgroundImage(cplayer._qhly_skinChange[avatar == 'avatar2' ? 1 : 0]);
          // @ts-ignore
          if (!_status.qhly_replaceSkin[playerName]) _status.qhly_replaceSkin[playerName] = {};
          // @ts-ignore
          _status.qhly_replaceSkin[playerName][skin] = cplayer._qhly_skinChange[avatar == 'avatar2' ? 1 : 0];
          // @ts-ignore
          if (window.decadeUI && !game.qhly_hasExtension('皮肤切换') && !game.qhly_hasExtension('EpicFX')) game.qhly_changeDynamicSkin(cplayer, undefined, undefined, avatar == 'avatar2');
        });
        if (subView.page.skin.viewState && subView.page.skin.viewState.skinViews) {
          for (var i = 0; i < subView.page.skin.viewState.skinViews.length; i++) {
            if (subView.page.skin.viewState.skinViews[i].dynamic && subView.page.skin.viewState.skinViews[i].dynamic.renderer.postMessage) {
              subView.page.skin.viewState.skinViews[i].dynamic.renderer.postMessage({
                message: "DESTROY",
                id: subView.page.skin.viewState.skinViews[i].dynamic.id,
              })
              subView.page.skin.viewState.skinViews[i].dynamic.renderer.capacity--;
            }
          }
        }
        // @ts-ignore
        if (_status['qhly_primarySkin_' + name] !== undefined) game.qhly_setCurrentSkin(name, _status['qhly_primarySkin_' + name]);
        delete _status['qhly_primarySkin_' + name];
      });
      subView.page = {
        introduce: {
          pageView: ui.create.div('.qh-page-introduce', view),
          refresh: function (name, state) {
            subView.hp.hide();
            subView.mp.hide();
            subView.avatar.show();
            // @ts-ignore
            game.qhly_changeViewPageSkin('introduce', this.pageView);
            if (!this.inited) this.init(name, state);
            var that = this;
            this.text.refresh = function(){
              that.refresh(name,state);
            };
            if (!state.introduceExtraPage || state.introduceExtraPage == '简介') {
              subView.pageButton.introduce.innerHTML = "简介";
              // @ts-ignore
              var intro = get.qhly_getIntroduce(name, state.pkg);
              this.text.innerHTML = intro + "<br><br><br><br><br><br><br>";
              // @ts-ignore
              subView.pageButton.introduce.appendChild(subView.pageButton.introduce.downButton);
            } else {
              var ret = '';
              var handleView = null;
              if (state.introduceExtraFunc) {
                var func = null;
                if (typeof state.introduceExtraFunc == 'function') {
                  func = state.introduceExtraFunc;
                } else {
                  func = state.pkg[state.introduceExtraFunc];
                }
                if (typeof func == 'function') {
                  var fc = func(name);
                  if (fc) {
                    if (typeof fc == 'string') {
                      ret = fc + "<br><br><br><br><br><br><br>";
                    } else {
                      if (fc.content) {
                        ret = fc.content + "<br><br><br><br><br><br><br>";
                      }
                      if (fc.handleView && typeof fc.handleView == 'function') {
                        handleView = fc.handleView;
                      }
                    }
                  }
                }
              }
              this.text.innerHTML = ret;
              if (handleView) {
                handleView(this.text, name);
              }
              var btname = state.introduceExtraPage;
              // if (currentViewSkin.buttonTextSpace !== false && btname.length == 2) {
              //     btname = btname.charAt(0) + ' ' + btname.charAt(1);
              // }
              subView.pageButton.introduce.innerHTML = btname;
              // @ts-ignore
              subView.pageButton.introduce.appendChild(subView.pageButton.introduce.downButton);
            }
            //game.qhly_syncChangeSkinButton(name, game.qhly_getSkin(name), state);
          },
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          init: function (name, state) {
            this.text = ui.create.div('.qh-page-introduce-text', this.pageView);
            if (lib.config.qhly_vMiddle === false && (currentViewSkin.isQiLayout || currentViewSkin.isLolBigLayout)) {
              this.text.style.height = "100%";
              this.text.style.maxHeight = "none";
            }
            lib.setScroll(this.text);
            // @ts-ignore
            ui.qhly_fixTextSize(this.text);
            this.inited = true;
          }
        },
        skill: {
          pageView: ui.create.div('.qh-page-skill', view),
          refresh: function (name, state) {
            subView.hp.show();
            if (subView.mp.getAttribute('data-visiable') == 'true') subView.mp.show();
            subView.avatar.show();
            if (_status['qhly_primarySkin_' + name] !== undefined) {
              // @ts-ignore
              game.qhly_setCurrentSkin(name, _status['qhly_primarySkin_' + name]);
            }
            if (!this.inited) this.init(name, state);
            //game.qhly_syncChangeSkinButton(name, game.qhly_getSkin(name), state);
          },
          init: function (name, state) {
            this.text = ui.create.div('.qh-page-skill-text', this.pageView);
            var spacialList = ['standard', 'refresh', 'old', 'yijiang'];
            for (var i of spacialList) {
              if (lib.characterPack && lib.characterPack[i] && lib.characterPack[i][name]) {
                this.text.setAttribute('data-spacial', true);
              }
            }
            lib.setScroll(this.text);
            if (lib.config.qhly_vMiddle === false && (currentViewSkin.isQiLayout || currentViewSkin.isLolBigLayout)) {
              this.text.style.maxHeight = 'none';
              this.text.style.height = '100%';
            }
            // @ts-ignore
            ui.qhly_fixTextSize(this.text);
            var skills = get.character(name, 3);
            var viewSkill = [];
            var derivation = [];
            for (var skill of skills) {
              var info = get.info(skill);
              if (!info || info.nopop || !get.translation(skill + '_info')) {
                continue;
              }
              viewSkill.add(skill);
              if (info.derivation) {
                if (typeof info.derivation === 'string') {
                  viewSkill.add(info.derivation);
                  derivation.add(info.derivation);
                } else {
                  for (var s of info.derivation) {
                    viewSkill.add(s);
                    derivation.add(s);
                  }
                }
              }
            }
            var pkg = state.pkg;
            if (pkg && pkg.characterTaici) {
              var taici = pkg.characterTaici(name);
              if (taici) {
                for (var key in taici) {
                  var m = taici[key];
                  if (!m || m.hide) continue;
                  if (key != 'die') {
                    viewSkill.add(key);
                  }
                }
                viewSkill.sort(function (a, b) {
                  var orderA = (taici[a] && taici[a].order) ? taici[a].order : Infinity;
                  var orderB = (taici[b] && taici[b].order) ? taici[b].order : Infinity;
                  return orderA - orderB;
                });
              }
            }
            var tempSkill = [];
            if (cplayer && lib.config.qhly_skillingame) {
              // @ts-ignore
              var skills = cplayer.getSkills(false, false);
              for (var tskill of skills) {
                if (viewSkill.includes(tskill)) continue;
                var info = get.info(tskill);
                if (!info) continue;
                if (!lib.translate[tskill]) continue;
                if (info.popup === false) continue;
                if (info.nopop === true) continue;
                viewSkill.add(tskill);
                tempSkill.add(tskill);
              }
            }
            // @ts-ignore
            for (var skill of viewSkill) {
              if (!lib.translate[skill + "_info"]) continue;
              var detail = get.translation(skill + "_info");
              if (detail) {
                var skillInfoHead = ui.create.div('.qh-skillinfohead', this.text);
                skillInfoHead.innerHTML = get.translation(skill);
                skillInfoHead.innerHTML += "<img style='float:right;width:18%;max-width:48px' id='qhly_skillv_" + skill + "'/>";
                var skillInfoBody = ui.create.div('.qh-skillinfobody', this.text);
                var dynamicTranslate = null;
                var content = '';
                if (cplayer && lib.config.qhly_skillingame) {
                  var dtrans = lib.dynamicTranslate[skill];
                  if (dtrans) {
                    dtrans = dtrans(cplayer, skill);
                  }
                  // @ts-ignore
                  if (dtrans && lib.qhly_filterPlainText(dtrans) != lib.qhly_filterPlainText(detail)) {
                    dynamicTranslate = dtrans;
                    content += "<span style=opacity:0.4>";
                  } else {
                    if (dtrans && dtrans.length) {
                      detail = dtrans;
                    }
                  }
                  // if (!cplayer.hasSkill(skill)) {
                  // }
                }
                // @ts-ignore
                content += lib.qhly_keyMark(detail);
                if (dynamicTranslate) {
                  content += "</span><br>";
                  content += dynamicTranslate;
                }
                //else skillInfoBody.innerHTML = detail;
                var info = get.info(skill);
                if (info && (info.frequent || info.subfrequent)) {
                  content += "<br>&nbsp;&nbsp;<img style='vertical-align:middle;' id='qhly_autoskill_" + skill + "'/><b id='qhly_autoskill_text_" + skill + "'>自动发动</b>"
                }
                skillInfoBody.innerHTML = content;
                ui.create.div('.qh-skillinfotail', this.text);
              }
            }
            var bindFunc = function (checkbox, text) {
              if (!text) return;
              // @ts-ignore
              ui.qhly_addListenFunc(text);
              text.listen(function () {
                // @ts-ignore
                game.qhly_playQhlyAudio('qhly_voc_check', null, true);
                checkbox.qhly_setChecked(!checkbox.qhly_checked, true);
              });
            };
            for (let skill of viewSkill) {
              var detail = get.translation(skill + "_info");
              if (detail) {
                (function (skill) {
                  var img = document.getElementById('qhly_skillv_' + skill);
                  if (img) {
                    // @ts-ignore
                    img.src = lib.assetURL + get.qhly_getCurrentViewSkinValue('skillPagePlayAudioButtonImage', 'extension/千幻聆音/image/newui_playaudio.png');
                    // @ts-ignore
                    ui.qhly_addListenFunc(img);
                    // @ts-ignore
                    img.listen(function () {
                      // @ts-ignore
                      var count = _status.qhly_skillAudioWhich[skill];
                      if (!count) {
                        // @ts-ignore
                        _status.qhly_skillAudioWhich[skill] = 0;
                        count = 0;
                      }
                      // @ts-ignore
                      _status.qhly_skillAudioWhich[skill]++;
                      // @ts-ignore
                      window.qhly_TrySkillAudio(skill, { name: name }, null, count);
                      // @ts-ignore
                      var skillSkin = game.qhly_getSkillSkin(name, game.qhly_getSkin(name), skill);
                      if (skillSkin) {
                        if (skillSkin === 1) {
                          subView.avatarImage.setBackground(name, 'character');
                        } else if (Array.isArray(skillSkin)) {
                          subView.avatarImage.setBackgroundImage(skillSkin[count % skillSkin.length]);
                        } else {
                          subView.avatarImage.setBackgroundImage(skillSkin);
                        }
                      }
                    });
                  }
                  var check = document.getElementById('qhly_autoskill_' + skill);
                  if (check) {
                    var list = [];
                    var info = get.info(skill);
                    if (info.frequent) {
                      list.add(skill);
                    }
                    if (info.subfrequent) {
                      for (var sub of info.subfrequent) {
                        list.add(skill + "_" + sub);
                      }
                    }
                    // @ts-ignore
                    ui.qhly_initCheckBox(check, list.filter(function (sk) {
                      return !lib.config.autoskilllist || !lib.config.autoskilllist.includes(sk);
                    }).length != 0);
                    bindFunc(check, document.getElementById('qhly_autoskill_text_' + skill));
                    // @ts-ignore
                    check.qhly_onchecked = function (checked) {
                      var list = [];
                      var info = get.info(skill);
                      if (info.frequent) {
                        list.add(skill);
                      }
                      if (info.subfrequent) {
                        for (var sub of info.subfrequent) {
                          list.add(skill + "_" + sub);
                        }
                      }
                      if (!lib.config.autoskilllist) {
                        lib.config.autoskilllist = [];
                      }
                      if (!checked) {
                        for (var s of list) {
                          lib.config.autoskilllist.add(s);
                        }
                      } else {
                        for (var s of list) {
                          lib.config.autoskilllist.remove(s);
                        }
                      }
                      game.saveConfig('autoskilllist', lib.config.autoskilllist);
                    };
                  }
                })(skill);
              }
            }
            // @ts-ignore
            game.qhly_changeViewPageSkin('skill', this.pageView);
            this.inited = true;
          }
        },
        skin: {
          pageView: ui.create.div('.qh-page-skin', view),
          skinList: [],
          skinListGot: false,
          firstRefresh: true,
          hideSkinMode: false,
          // getCurrentSkin: function (name) {
          //     var skinId = game.qhly_getSkin(name);
          //     for (var skin of this.skinList) {
          //         if (skin && skin.skinId == skinId) {
          //             return skin;
          //         }
          //         if (!skinId && !skin.skinId) {
          //             return skin;
          //         }
          //     }
          //     return null;
          // },
          onClickSkin: function (num, name, state, father) {
            var skin = this.skinList[num];
            // if (!skin) {
            //     return;
            // }
            // @ts-ignore
            if (game.qhly_skinLock(name, skin.skinId)) {
              // @ts-ignore
              var lock = game.qhly_skinLock(name, skin.skinId);
              if (lock.tryUnlock) {
                lock.tryUnlock();
              }
              // @ts-ignore
              if (game.qhly_skinLock(name, skin.skinId)) {
                return;
              }
            }
            for (var i = 0; i < this.viewState.skinViews.length; i++) {
              this.viewState.skinViews[i].defaultskin.setAttribute('data-sel', false);
            }
            if (father) father.setAttribute('data-sel', true);
            // @ts-ignore
            game.qhly_playQhlyAudio('qhly_voc_dec_fanshu', null, true);
            var originSkin = skin.skinId;
            // @ts-ignore
            game.qhly_setCurrentSkin(name, originSkin, function () {
              // @ts-ignore
              _status.qhly_skillAudioWhich = {};
              this.refresh(name, state);
              if (state.onChangeSkin) {
                state.onChangeSkin();
              }
              // @ts-ignore
              game.qhly_changeDynamicSkin(name);
              // @ts-ignore
              game.qhly_syncChangeSkinButton(name, originSkin, state);
              var rarity = document.getElementsByClassName('qh-avatarrarity');
              if (rarity) {
                rarity[0].classList.remove('stand');
                rarity[0].classList.remove('landscape');
              }
              if (originSkin) {
                var str = originSkin.substring(0, originSkin.length - 4);
                if (!lib.config.qhly_skinset.djtoggle[name] || lib.config.qhly_skinset.djtoggle[name] && !lib.config.qhly_skinset.djtoggle[name][str]) {
                  // @ts-ignore
                  game.qhly_changeDynamicSkin(subView.avatarImage, str, name);
                  // @ts-ignore
                  if (subView.avatarImage.dynamic && subView.avatarImage.dynamic.primary) _status.currentTexiao = subView.avatarImage.dynamic.primary.name;
                }
                // @ts-ignore
                else if (subView.avatarImage.stopDynamic) subView.avatarImage.stopDynamic();
              // @ts-ignore
              } else if (originSkin == null && window.decadeUI && decadeUI.dynamicSkin[name]) {
                // @ts-ignore
                var dyList = Object.keys(decadeUI.dynamicSkin[name]);
                if (dyList && dyList.includes('经典形象') && (!lib.config.qhly_skinset.djtoggle[name] || lib.config.qhly_skinset.djtoggle[name] && !lib.config.qhly_skinset.djtoggle[name]['经典形象']))
                  // @ts-ignore
                  game.qhly_changeDynamicSkin(subView.avatarImage, '经典形象', name);
                // @ts-ignore
                else if (subView.avatarImage.stopDynamic) subView.avatarImage.stopDynamic();
              }
              if (state.mainView.avatarImage.dynamic && state.mainView.avatarImage.dynamic.primary != null) state.mainView.dynamicToggle.setAttribute('toggle', true);
              else state.mainView.dynamicToggle.setAttribute('toggle', false);
              // @ts-ignore
              game.qhly_playQhlyAudio('qhly_voc_dec_fanshu', null, true);
              // @ts-ignore
              _status['qhly_primarySkin_' + name] = game.qhly_getSkin(name);
              if (state.pkg.isLutou || lib.config.qhly_lutou) {
                subView.avatarImage.classList.remove('qh-image-standard');
                subView.avatarImage.classList.add('qh-image-lutou');
              } else {
                subView.avatarImage.classList.remove('qh-image-lutou');
                subView.avatarImage.classList.add('qh-image-standard');
              }
              subView.avatar.classList.remove('noBorder');
              state.mainView.avatarImage.classList.remove('decadeBig');
              subView.avatarBorder.classList.remove('noBorder');
              // @ts-ignore
              game.qhly_setOriginSkin(name, originSkin, state.mainView.avatarImage, state, game.qhly_getPlayerStatus(state.mainView.avatarImage, null, state.name) == 2);
            }.bind(this), true);
          },
          refresh: function (name, state) {
            subView.hp.hide();
            subView.mp.hide();
            subView.avatar.hide();
            // @ts-ignore
            game.qhly_checkPlayerImageAudio(name, game.qhly_getSkin(name), cplayer);
            if (!this.inited) this.init(name, state);
            if (this.skinListGot) {
              this.refreshAfterGot(name, state);
            } else {
              // @ts-ignore
              // @ts-ignore
              // @ts-ignore
              game.qhly_getSkinList(name, function (ret, list) {
                this.afterGetSkinList(list, name, state);
                this.refreshAfterGot(name, state);
              }.bind(this), true, true);
            }
          },
          packObject: function (name, state) {
            var packObj = {
              name: name,
              origin: {
                skill: {

                },
              },
              skin: {

              }
            };
            for (var skin of this.skinList) {
              // @ts-ignore
              if (!skin.skinId) {
                // @ts-ignore
                var taici = game.qhly_getCharacterTaici(name, null, state.pkg);
                if (taici) {
                  packObj.origin.skill = taici;
                }
              } else {
                // @ts-ignore
                var skinInfo = game.qhly_getSkinInfo(name, skin.skinId, state.pkg);
                if (skinInfo) {
                  // @ts-ignore
                  packObj.skin[game.qhly_earse_ext(skin.skinId)] = skinInfo;
                }
              }
            }
            return packObj;
          },
          editOpen: function (name, skin, skill, state) {
            var obj = this.packObject(name, state);
            var title = "台词编辑";
            var detail = "编辑【" + ((skill == 'die') ? "阵亡" : get.translation(skill)) + "】的台词：";
            var initValue = "";
            var realSkill = skill;
            // @ts-ignore
            if (lib.qhly_skinShare[name] && lib.qhly_skinShare[name].skills && lib.qhly_skinShare[name].skills[skill]) realSkill = lib.qhly_skinShare[name].skills[skill];
            if (skin) {
              // @ts-ignore
              var skinInfo = obj.skin[game.qhly_earseExt(skin)];
              if (skinInfo && skinInfo.skill) {
                if (skinInfo.skill[realSkill] && skinInfo.skill[realSkill].content) {
                  if (skinInfo.skill[realSkill].content2) {
                    initValue = skinInfo.skill[realSkill].content1 + '+' + skinInfo.skill[realSkill].content2;
                  } else initValue = skinInfo.skill[realSkill].content;
                }
              }
            } else {
              var sskill = obj.origin.skill;
              if (sskill[realSkill] && sskill[realSkill].content) {
                initValue = sskill[realSkill].content;
              }
            }
            var that = this;
            // @ts-ignore
            game.qhly_editDialog(title, detail, initValue, function (value, dialog) {
              if (!value) value = "";
              // while (value.indexOf("/") >= 0) {
              //     value = value.replace("/", "<br>");
              // }
              if (skin) {
                if (value.indexOf("+") >= 0) {
                  value = value.split('+');
                }
                // @ts-ignore
                var m = obj.skin[game.qhly_earseExt(skin)];
                if (m) {
                  if (!m.skill) m.skill = {};
                  if (!m.skill[realSkill]) {
                    m.skill[realSkill] = {};
                  }
                  if (Array.isArray(value)) {
                    m.skill[realSkill].content = value[0];
                    m.skill[realSkill].content1 = value[0];
                    m.skill[realSkill].content2 = value[1];
                  } else m.skill[realSkill].content = value;
                }
              } else {
                if (!obj.origin.skill[realSkill]) {
                  obj.origin.skill[realSkill] = { content: '' };
                }
                obj.origin.skill[realSkill].content = value;
              }
              // @ts-ignore
              var realName = game.qhly_getRealName(name);
              var obj2 = Object.assign(obj, { name: realName });
              var strobj = JSON.stringify(obj2, null, 4);
              // @ts-ignore
              game.qhly_readFileAsText("extension/千幻聆音/data/skininfomodel.txt", function (ret, str) {
                if (ret) {
                  str = str.replace("_REPLACE_OBJECT_", strobj);
                  // @ts-ignore
                  var path = game.qhly_getSkinImagePath(name, state.pkg);
                  // @ts-ignore
                  game.qhly_writeTextFile(str, path + realName, "skininfo.js", function (err) {
                    if (!err) {
                      alert("保存成功");
                      // @ts-ignore
                      lib.qhly_dirskininfo[name] = obj;
                      // @ts-ignore
                      that.refresh(name, state, true);
                      dialog.delete();
                    } else {
                      alert("保存失败：" + JSON.stringify(err));
                    }
                  });
                } else {
                  alert("保存失败：无法读取模板。");
                }
              });
            // @ts-ignore
            // @ts-ignore
            // @ts-ignore
            }, function (dialog) {
              return true;
            });
          },
          refreshAfterGot: function (name, state) {
            var content = this.viewState.content;
            var that = this;
            const path = state.pkg.skin.standard;
            this.viewState.skinTotalWidth = ((this.viewState.skinPerWidth + this.viewState.skinGap) * this.skinList.length - this.viewState.skinGap) * this.viewState.scale;
            var playBigDynamic = lib.config['extension_千幻聆音_qhly_decadeDynamic'] == 'always' ? false : true;
            if (this.dynamicSkinMore && lib.config['extension_千幻聆音_qhly_decadeDynamic'] == 'three') playBigDynamic = false;
            if (this.firstRefresh) {
              this.firstRefresh = false;
              for (var k = 0; k < this.skinList.length; k++) {
                this.viewState.viewCurrentIndex = k;
                // @ts-ignore
                if (game.qhly_skinIs(name, this.skinList[k].skinId)) break;
              }
              for (var i = 0; i < this.skinList.length; i++) {
                // @ts-ignore
                var skin = this.skinList[i].skinId;
                var skinView = ui.create.div('.qh-skinchange-decade-big-skin', content);
                // @ts-ignore
                if (game.qhly_getPlayerStatus(cplayer, cplayer && cplayer.name2 && cplayer.name2 == name) == 2) game.qhly_setPlayerStatus(skinView, undefined, 2);
                // @ts-ignore
                skinView.avatar = ui.create.div('.primary-avatar', skinView);
                // @ts-ignore
                skinView.avatar.id = 'qh-skillskin-' + i;
                // @ts-ignore
                skinView.belowText = ui.create.div('.qh-skinchange-decade-big-skin-text', skinView);
                this.viewState.skinViews.push(skinView);
                // @ts-ignore
                skinView.avatar.classList.add('qh-not-replace');
                //skinView.node = { avatar: skinView.avatar, name1: name }
                // @ts-ignore
                skinView.defaultskin = ui.create.div('.qh-skinchange-skin-big-default', skinView);
                // @ts-ignore
                skinView.defaultskin.id = 'qhly_bigSkin' + i;
                // @ts-ignore
                skinView.defaultskin.listen(function () {
                  if (this.getAttribute('data-sel') === 'true') return;
                  that.onClickSkin(parseInt(this.id.slice(12)), name, state, this);
                });
                // @ts-ignore
                skinView.$dynamicWrap = ui.create.div('.qhdynamic-big-wrap', skinView);
                // @ts-ignore
                skinView.toImageBtn = ui.create.div('.qh-domtoimage', skinView);
                // @ts-ignore
                skinView.toImageBtn.addEventListener('click', function (e) {
                  e.stopPropagation();
                  // @ts-ignore
                  game.qhly_dom2image(cplayer, name, this, path, state);
                });//3
                // @ts-ignore
                skinView.dynamicToggle = ui.create.div('.qh-skinchange-big-dynamicChange', skinView);
                // @ts-ignore
                skinView.dynamicToggle.id = 'qhlydecadeBigdjtoggle' + skin;
                // @ts-ignore
                if (this.skinList[i].bothSkin) skinView.dynamicToggle.setAttribute('toggle', true);
                // @ts-ignore
                if (this.skinList[i].single && lib.config['extension_千幻聆音_qhly_dom2image']) skinView.toImageBtn.setAttribute('single', true);//6
                if (skin && lib.config.qhly_skinset.djtoggle[name]) {
                  // @ts-ignore
                  if (lib.config.qhly_skinset.djtoggle[name][skin.substring(0, skin.lastIndexOf('.'))]) skinView.dynamicToggle.classList.add('jing');
                }
                // @ts-ignore
                skinView.dynamicToggle.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                  var skinStr = this.parentNode.belowText.innerText.substring(0, this.parentNode.belowText.innerText.lastIndexOf('*'));
                  if (this.classList.contains('jing')) {
                    this.classList.remove('jing');
                    subView.dynamicToggle.classList.remove('jing');
                    // @ts-ignore
                    if (playBigDynamic) game.qhly_changeDynamicSkin(this.parentNode, skinStr, name);
                    // @ts-ignore
                    if (this.parentNode.avatar.id == 'qh-skillskin-0' && that.skinList[0].bothSkin || _status['qhly_primarySkin_' + name] && _status['qhly_primarySkin_' + name].substring(0, _status['qhly_primarySkin_' + name].length - 4) == skinStr) game.qhly_changeDynamicSkin(state.mainView.avatarImage, skinStr, name);
                    if (lib.config.qhly_skinset.djtoggle[name] && lib.config.qhly_skinset.djtoggle[name][skinStr]) delete lib.config.qhly_skinset.djtoggle[name][skinStr];
                  }
                  else {
                    this.classList.add('jing');
                    subView.dynamicToggle.classList.add('jing');
                    if (this.parentNode.stopDynamic) this.parentNode.stopDynamic();
                    // @ts-ignore
                    if (this.parentNode.avatar.id == 'qh-skillskin-0' && that.skinList[0].bothSkin || _status['qhly_primarySkin_' + name] && _status['qhly_primarySkin_' + name].substring(0, _status['qhly_primarySkin_' + name].length - 4) == skinStr) state.mainView.avatarImage.stopDynamic();
                    if (!lib.config.qhly_skinset.djtoggle[name]) lib.config.qhly_skinset.djtoggle[name] = {};
                    lib.config.qhly_skinset.djtoggle[name][skinStr] = true;
                  }
                  // @ts-ignore
                  game.qhlySyncConfig();
                  // @ts-ignore
                  if (_status['qhly_primarySkin_' + name] && _status['qhly_primarySkin_' + name] == game.qhly_getSkin(name)) {
                    // @ts-ignore
                    game.qhly_changeDynamicSkin(name);
                  }
                });
                if (skin) {
                  // @ts-ignore
                  var info = game.qhly_getSkinInfo(name, skin);
                  if (info) {
                    // @ts-ignore
                    skinView.belowText.innerText = info.translation + '*' + get.rawName2(name);
                  }
                  // @ts-ignore
                  if ((!lib.config.qhly_skinset.djtoggle[name] || lib.config.qhly_skinset.djtoggle[name] && !lib.config.qhly_skinset.djtoggle[name][skin.substring(0, skin.lastIndexOf('.'))]) && window.decadeUI && decadeUI.dynamicSkin && decadeUI.dynamicSkin[name] && Object.keys(decadeUI.dynamicSkin[name]).includes(info.translation)) {
                    // @ts-ignore
                    if (playBigDynamic) game.qhly_changeDynamicSkin(skinView, info.translation, name);
                  }
                } else {
                  // @ts-ignore
                  skinView.belowText.innerText = "经典形象*" + get.rawName2(name);
                  // @ts-ignore
                  if (this.skinList[0].skinId == null && this.skinList[0].bothSkin && playBigDynamic) game.qhly_changeDynamicSkin(skinView, '经典形象', name);
                }
                var skinQua = ui.create.div('.qh-page-skinavatarlevel', skinView);
                // @ts-ignore
                var level = this.skinList[i].skinInfo.level;
                // @ts-ignore
                var style = this.skinList[i].skinInfo.levelStyle;
                if (style) {
                  // @ts-ignore
                  if (!skinQua.qh_savedStyle) {
                    // @ts-ignore
                    skinQua.qh_savedStyle = {};
                    for (var m in skinQua.style) {
                      // @ts-ignore
                      skinQua.qh_savedStyle[m] = skinQua.style[m];
                    }
                  }
                  for (var s in style) {
                    skinQua.style[s] = style[s];
                  }
                  var es = ['left', 'bottom', 'top', 'right'];
                  for (var m of es) {
                    if (!style[m]) {
                      skinQua.style[m] = "";
                    }
                  }
                } else {
                  // @ts-ignore
                  if (skinQua.qh_savedStyle) {
                    // @ts-ignore
                    for (var m in skinQua.qh_savedStyle) {
                      // @ts-ignore
                      skinQua.style[m] = skinQua.qh_savedStyle[m];
                    }
                  }
                }
                // @ts-ignore
                if (this.skinList[i].skinId) {
                  // @ts-ignore
                  if (lib.qhly_level[name + '_' + this.skinList[i].skinId]) {
                    // @ts-ignore
                    level = lib.qhly_level[name + '_' + this.skinList[i].skinId];
                  }
                }
                if (level) {
                  var map = {
                    '原画': 'yuanhua',
                    '普通': 'putong',
                    '稀有': 'xiyou',
                    '精良': 'xiyou',
                    '史诗': 'shishi',
                    '传说': 'chuanshuo',
                    '动态': 'dongtai',
                    '限定': 'xianding',
                    '绝版': 'jueban',
                  };
                  var img = null;
                  if (map[level]) {
                    img = "extension/千幻聆音/theme/decade/dc_" + map[level] + ".png";
                  } else if (level.indexOf("#") == 0) {
                    var l2 = level.replace("#", "");
                    img = "extension/千幻聆音/image/" + l2 + ".png";
                  } else if (level.indexOf("$") == 0) {
                    var l2 = level.replace("$", "");
                    img = l2;
                  }
                  if (img) {
                    skinQua.show();
                    skinQua.setBackgroundImage(img);
                  } /* else {
                                          skinQua.hide();
                                      } */
                } /* else {
                                      skinQua.hide();
                                  } */
                //skinQua.style.cssText = 'width:40%;height:16%;right:-2%;top:4%;background-size:100% 100%;background-repeat:no-repeat;z-index:88;point-events:none';
                //skinQua.style['background-image'] = 'url(' + lib.qhly_path+'theme/decade/dc_' + game.qhly_getSkinLevel(name, skin, true) + '.png)';
                skinQua.id = 'qhly_skinQua' + i;

                // @ts-ignore
                if (game.qhly_skinIs(name, skin)) {
                  // @ts-ignore
                  skinView.defaultskin.setAttribute('data-sel', true);
                  // @ts-ignore
                  if (this.skinList[i].bothSkin) state.mainView.dynamicToggle.setAttribute('toggle', true);
                  else state.mainView.dynamicToggle.setAttribute('toggle', false);
                } else {
                  // @ts-ignore
                  skinView.defaultskin.setAttribute('data-sel', false);
                }
                this.viewState.offset = Math.round((98 - (this.viewState.skinPerWidth + this.viewState.skinGap) * this.viewState.viewCurrentIndex) * this.viewState.scale);
                skinView.style.left = Math.round((this.viewState.skinPerWidth + this.viewState.skinGap) * i * this.viewState.scale) + "px";
                skinView.style.width = Math.round(this.viewState.skinPerWidth * this.viewState.scale) + "px";
                skinView.style.height = Math.round(396 * this.viewState.scale) + "px";
                skinView.style.transform = 'scale(' + Math.max(0.3, 1 - 0.4 * Math.abs(i + (this.viewState.offset - 98 * this.viewState.scale) / ((this.viewState.skinPerWidth + this.viewState.skinGap) * this.viewState.scale))) + ')';
                // @ts-ignore
                skinView.style.zIndex = Math.round(Math.max(10, 15 - Math.abs(this.viewState.viewCurrentIndex - i)));
                // @ts-ignore
                skinView.style.opacity = Math.round(Math.min(1, 1.7 - Math.abs(i + (this.viewState.offset - 98 * this.viewState.scale) / ((this.viewState.skinPerWidth + this.viewState.skinGap) * this.viewState.scale))));
                if (skin) {
                  // @ts-ignore
                  let file = game.qhly_getSkinFile(name, skin);
                  // @ts-ignore
                  let skinView2 = skinView.avatar;
                  // @ts-ignore
                  game.qhly_checkFileExist(file, function (s) {
                    if (s) {
                      skinView2.qhly_origin_setBackgroundImage(file);
                    } else {
                      var prefix = state.pkg.prefix;
                      if (typeof prefix == 'function') {
                        prefix = prefix(name);
                      }
                      // taffy: 注释content.js原版代码喵
                      // if (lib.config.qhly_noSkin == 'origin') skinView2.qhly_origin_setBackgroundImage(prefix + name + '.jpg');//原画
                      /* taffy分界线 */
                      // taffy: 修复千幻与皮切bug喵
                      if (lib.config.qhly_noSkin == 'origin') {
                        if (prefix.includes('.jpg')) skinView2.qhly_origin_setBackgroundImage(prefix);//原画
                        else skinView2.qhly_origin_setBackgroundImage(prefix + name + '.jpg');//原画
                      }
                      /* taffy分界线 */
                      else skinView2.qhly_origin_setBackgroundImage('extension/千幻聆音/image/noSkin.png');//noskin
                    }
                  })
                } else {
                  // @ts-ignore
                  skinView.avatar.qhly_origin_setBackground(name, 'character');
                }
                // @ts-ignore
                if (game.qhly_skinLock(name, skin)) {
                  ui.create.div('.qh-lock', skinView);
                  // @ts-ignore
                  skinView.isLocked = true;
                  // @ts-ignore
                  this.skinList[i].isLocked = true;
                  skinView.style.filter = "grayscale(100%)";
                } else {
                  skinView.style.filter = "grayscale(0%)";
                }
              }
              this.viewState.refresh();
              if (lib.config.touchscreen) {
                content.addEventListener('touchstart', function (event) {
                  if (event.touches && event.touches.length) {
                    that.viewState.handleMouseDown(event.touches[0].clientX, event.touches[0].clientY);
                  }
                });
                // @ts-ignore
                // @ts-ignore
                // @ts-ignore
                content.addEventListener('touchend', function (event) {
                  that.viewState.handleMouseUp();
                });
                // @ts-ignore
                // @ts-ignore
                // @ts-ignore
                content.addEventListener('touchcancel', function (event) {
                  that.viewState.handleMouseUp();
                });
                content.addEventListener('touchmove', function (event) {
                  if (event.touches && event.touches.length)
                    that.viewState.handleMouseMove(event.touches[0].clientX, event.touches[0].clientY);
                });
              } else {
                content.addEventListener('mousewheel', function (event) {
                  that.viewState.handleMouseDown(event.clientX, event.clientY);
                  if (event.wheelDelta > 0) {
                    that.viewState.handleMouseMove(event.clientX - 30, event.clientY);
                    that.viewState.handleMouseUp(event.clientX - 30, event.clientY);
                  } else {
                    that.viewState.handleMouseMove(event.clientX + 30, event.clientY);
                    that.viewState.handleMouseUp(event.clientX + 30, event.clientY);
                  }
                });
                content.addEventListener('mousedown', function (event) {
                  that.viewState.handleMouseDown(event.clientX, event.clientY);
                });
                content.addEventListener('mouseup', function (event) {
                  that.viewState.handleMouseUp(event.clientX, event.clientY);
                });
                content.addEventListener('mouseleave', function (event) {
                  that.viewState.handleMouseUp(event.clientX, event.clientY);
                });
                content.addEventListener('mousemove', function (event) {
                  that.viewState.handleMouseMove(event.clientX, event.clientY);
                });
              }
            }
            this.viewState.skinAudioList.innerHTML = '';
            var addButton = [];
            var currentSkin = this.skinList[this.viewState.viewCurrentIndex];
            if (!currentSkin) {
              return;
            }
            if (!currentSkin.isLocked) {
              var extInfo = "";
              if (currentSkin.skinInfo.info) {
                extInfo = currentSkin.skinInfo.info;
              } else {
                if (state.pkg && state.pkg.originSkinInfo) {
                  // @ts-ignore
                  var i = state.pkg.originSkinInfo(name);
                  if (i) {
                    // @ts-ignore
                    extInfo = i;
                  }
                }
              }
              this.viewState.skinInfoText.innerHTML = extInfo;
              // @ts-ignore
              var Vicpath = `${state.pkg.audio}${game.qhly_getRealName(name)}/`;
              // @ts-ignore
              if (game.qhly_getSkin(name)) Vicpath += `${game.qhly_earse_ext(game.qhly_getSkin(name))}/`;
              for (var audio of currentSkin.audios) {
                var cskill;
                if (audio.name) {
                  cskill = audio.name;
                } else {
                  cskill = get.translation(audio.id);
                }
                // @ts-ignore
                if (audio.id == 'victory' && !game.thunderFileExist(lib.assetURL + Vicpath + 'victory.mp3')) continue;
                var skillAudioInfo = ui.create.div('.qh-skinchange-decade-big-skillaudioinfo', this.viewState.skinAudioList);
                skillAudioInfo.innerHTML = cskill;
                var huawen = ui.create.div('.qh-skinchange-decade-big-huawen', skillAudioInfo);
                // @ts-ignore
                if (lib.config.qhly_editmode && !game.qhly_isForbidEditTaici(name)) {
                  huawen.id = "qhly_skin_skill_edit_" + audio.id;
                }
                var skillaudioBar = document.createElement('img');
                // @ts-ignore
                skillaudioBar.src = lib.qhly_path + 'theme/decade/skillvoice2.png';
                skillaudioBar.classList.add('qh-skinchange-decade-big-skillaudiobar');
                skillaudioBar.id = 'qhly_skin_skill_' + audio.id;
                skillAudioInfo.appendChild(skillaudioBar);
                var skillTaici = ui.create.div('.qh-skinchange-decade-big-skilltaici', this.viewState.skinAudioList);
                var objx = this.packObject(name, state);
                var initValuex = "";
                var realSkill = audio.id;
                // @ts-ignore
                if (lib.qhly_skinShare[name] && lib.qhly_skinShare[name].skills && lib.qhly_skinShare[name].skills[audio.id]) realSkill = lib.qhly_skinShare[name].skills[audio.id];
                if (currentSkin.skinId) {
                  // @ts-ignore
                  var skinInfox = objx.skin[game.qhly_earseExt(currentSkin.skinId)];
                  if (skinInfox && skinInfox.skill) {
                    if (skinInfox.skill[realSkill] && skinInfox.skill[realSkill].content) {
                      if (skinInfox.skill[realSkill].content2) {
                        // @ts-ignore
                        initValuex = skinInfox.skill[realSkill]['content' + game.qhly_getPlayerStatus(cplayer, (cplayer && cplayer.name2 && cplayer.name2 == state.name), state.name)];
                      }
                      else initValuex = skinInfox.skill[realSkill].content;
                    }
                  }
                } else {
                  var sskillx = objx.origin.skill;
                  if (sskillx[realSkill] && sskillx[realSkill].content) {
                    initValuex = sskillx[realSkill].content;
                  }
                }
                if (initValuex) {
                  skillTaici.innerHTML = initValuex;
                }
                addButton.push(audio.id);
              }
              var skinConfig = ui.create.div('.qh-skinchange-decade-big-skinconfig', this.viewState.skinAudioList);
              var skinConfigContent = '';
              if (lib.config.qhly_skinconfig) {
                skinConfigContent += "<h2>皮肤配置</h2>";
                skinConfigContent += "<p><span style='display:inline-block;height:30px;'><span id='qhconfig_checkbox_banInRandom_text' style='display:inline-block;position:relative;bottom:25%;'>随机切换禁用&nbsp;&nbsp;</span><img id='qhconfig_checkbox_banInRandom'/></span></p>";
                if (currentSkin.skinId) {
                  skinConfigContent += "<p><span style='display:inline-block;height:30px;'><span id='qhconfig_checkbox_changeSex_text' style='display:inline-block;position:relative;bottom:25%;'>性转皮肤&nbsp;&nbsp;</span><img id='qhconfig_checkbox_changeSex'/></span></p>";
                  skinConfigContent += "<p><span style='display:inline-block;height:30px;'><span id='qhconfig_checkbox_dwflip_text' style='display:inline-block;position:relative;bottom:25%;'>出框翻转&nbsp;&nbsp;</span><img id='qhconfig_checkbox_dwflip'/></span></p>";
                  skinConfigContent += "<p><span>皮肤品质&nbsp;&nbsp;</span><select style='font-size:22px;font-family:'qh_youyuan';' id='qhconfig_level_select'></select></p>";
                  skinConfigContent += "<p><span>皮肤顺序&nbsp;&nbsp;</span><select style='font-size:22px;font-family:'qh_youyuan';' id='qhconfig_order_select'></select></p>";
                }
                skinConfigContent += "<br><br>";
              }
              skinConfig.innerHTML = skinConfigContent;
              if (lib.config.qhly_skinconfig) {
                if (currentSkin.skinId) {
                  var levelSelect = document.getElementById('qhconfig_level_select');
                  var opt = document.createElement('option');
                  opt.innerHTML = "默认";
                  opt.setAttribute('name', 'default');
                  // @ts-ignore
                  levelSelect.appendChild(opt);
                  var levels = ['原画', '普通', '精良', '稀有', '史诗', '传说', '限定', '动态', '绝版'];
                  var map = {
                    '原画': 'yuanhua',
                    '普通': 'putong',
                    '精良': 'jingliang',
                    '稀有': 'xiyou',
                    '史诗': 'shishi',
                    '传说': 'chuanshuo',
                    '限定': 'xianding',
                    '动态': 'dongtai',
                    '绝版': 'jueban',
                  };
                  // @ts-ignore
                  if(lib.qhly_diylevels){
                    // @ts-ignore
                    for(var key in lib.qhly_diylevels){
                      // @ts-ignore
                      map[key] = "^^"+lib.qhly_diylevels[key];
                      levels.add(key);
                    }
                  }
                  // @ts-ignore
                  if (!lib.qhly_level[name + '_' + currentSkin.skinId]) {
                    // @ts-ignore
                    opt.selected = 'selected';
                  }
                  for (var l of levels) {
                    var opt = document.createElement('option');
                    opt.innerHTML = l;
                    opt.setAttribute('name', l);
                    // @ts-ignore
                    if (lib.qhly_level[name + '_' + currentSkin.skinId] == l) {
                      // @ts-ignore
                      opt.selected = 'selected';
                    }
                    // @ts-ignore
                    levelSelect.appendChild(opt);
                  }
                  // @ts-ignore
                  levelSelect.onchange = function (e) {
                    var event = e ? e : window.event;
                    // @ts-ignore
                    if (event.target) {
                      // @ts-ignore
                      let target = event.target;
                      // @ts-ignore
                      var opt = target[target.selectedIndex];
                      if (opt) {
                        var l = opt.getAttribute('name');
                        if (l == 'default') {
                          // @ts-ignore
                          delete lib.qhly_level[name + '_' + currentSkin.skinId];
                          // @ts-ignore
                          game.saveConfig('qhly_level', lib.qhly_level);
                          return;
                        }
                        var lm = map[l];
                        if (lm) {
                          // @ts-ignore
                          lib.qhly_level[name + '_' + currentSkin.skinId] = l;
                          // @ts-ignore
                          game.saveConfig('qhly_level', lib.qhly_level);
                        }
                      }
                      // @ts-ignore
                      var level = lib.qhly_level[name + '_' + currentSkin.skinId];
                      if(level&& map[level] && map[level].startsWith("^^")){
                        var skinQua = document.getElementById('qhly_skinQua' + that.viewState.viewCurrentIndex);
                        // @ts-ignore
                        if (skinQua) skinQua.style['background-image'] = 'url(' + lib.qhly_path + 'image/diylevels/'+map[level].replace("^^","")+")";
                      }else{
                        var skinQua = document.getElementById('qhly_skinQua' + that.viewState.viewCurrentIndex);
                        // @ts-ignore
                        if (skinQua) skinQua.style['background-image'] = 'url(' + lib.qhly_path + 'theme/decade/dc_' + game.qhly_getSkinLevel(name, currentSkin.skinId, true) + '.png)';
                      }
                    }
                  };

                  var orderSelect = document.getElementById('qhconfig_order_select');
                  var opt = document.createElement('option');
                  opt.innerHTML = "默认";
                  opt.setAttribute('order', 'default');
                  // @ts-ignore
                  orderSelect.appendChild(opt);
                  if (lib.config.qhly_order[name + '-' + currentSkin.skinId] === undefined) {
                    // @ts-ignore
                    opt.selected = 'selected';
                  }
                  for (var i = 0; i < 50; i++) {
                    var opt = document.createElement('option');
                    opt.innerHTML = "" + i;
                    // @ts-ignore
                    opt.setAttribute('order', i);
                    if (lib.config.qhly_order[name + '-' + currentSkin.skinId] == i) {
                      // @ts-ignore
                      opt.selected = 'selected';
                    }
                    // @ts-ignore
                    orderSelect.appendChild(opt);
                  }
                  // @ts-ignore
                  orderSelect.onchange = function (e) {
                    var event = e ? e : window.event;
                    // @ts-ignore
                    if (event.target) {
                      // @ts-ignore
                      target = event.target;
                      // @ts-ignore
                      var opt = target[target.selectedIndex];
                      if (opt) {
                        var o = opt.getAttribute('order');
                        if (o == 'default') {
                          // @ts-ignore
                          game.qhly_setOrder(name, currentSkin.skinId);
                        } else {
                          // @ts-ignore
                          game.qhly_setOrder(name, currentSkin.skinId, o);
                        }
                      }
                    }
                  };

                }
                var banInRandomCheckbox = document.getElementById('qhconfig_checkbox_banInRandom');
                var bindFunc = function (checkbox, text) {
                  if (!text) return;
                  // @ts-ignore
                  ui.qhly_addListenFunc(text);
                  text.listen(function () {
                    // @ts-ignore
                    game.qhly_playQhlyAudio('qhly_voc_check', null, true);
                    checkbox.qhly_setChecked(!checkbox.qhly_checked, true);
                  });
                };
                // @ts-ignore
                ui.qhly_initCheckBox(banInRandomCheckbox, game.qhly_skinIsBanned(name, currentSkin.skinId));
                bindFunc(banInRandomCheckbox, document.getElementById('qhconfig_checkbox_banInRandom_text'));
                // @ts-ignore
                banInRandomCheckbox.qhly_onchecked = function (checked) {
                  // @ts-ignore
                  game.qhly_banSkin(name, currentSkin.skinId, checked);
                };
                if (currentSkin.skinId) {
                  var dwflip = document.getElementById('qhconfig_checkbox_dwflip');
                  if (dwflip) {
                    // @ts-ignore
                    ui.qhly_initCheckBox(dwflip, lib.config.qhly_shoushaBigFlip[name][game.qhly_getSkin(name)]);
                    bindFunc(dwflip, document.getElementById('qhconfig_checkbox_dwflip_text'));
                    // @ts-ignore
                    dwflip.qhly_onchecked = function (check) {
                      if (!check) {
                        // @ts-ignore
                        if (lib.config.qhly_shoushaBigFlip[name][game.qhly_getSkin(name)]) {
                          // @ts-ignore
                          lib.config.qhly_shoushaBigFlip[name][game.qhly_getSkin(name)] = false;
                        }
                      } else {
                        // @ts-ignore
                        lib.config.qhly_shoushaBigFlip[name][game.qhly_getSkin(name)] = true;
                      }
                      game.saveConfig('qhly_shoushaBigFlip', lib.config.qhly_shoushaBigFlip);
                    };
                  }
                  var changeSex = document.getElementById('qhconfig_checkbox_changeSex');
                  if (!lib.config.qhly_changeSex[name]) lib.config.qhly_changeSex[name] = {};
                  if (changeSex) {
                    // @ts-ignore
                    ui.qhly_initCheckBox(changeSex, lib.config.qhly_changeSex[name][game.qhly_getSkin(name)]);
                    bindFunc(changeSex, document.getElementById('qhconfig_checkbox_changeSex_text'));
                    // @ts-ignore
                    changeSex.qhly_onchecked = function (check) {
                      if (!check) {
                        // @ts-ignore
                        if (lib.config.qhly_changeSex && lib.config.qhly_changeSex[name] && lib.config.qhly_changeSex[name][game.qhly_getSkin(name)]) {
                          // @ts-ignore
                          lib.config.qhly_changeSex[name][game.qhly_getSkin(name)] = false;
                        }
                      } else {
                        if (!lib.config.qhly_changeSex[name]) {
                          lib.config.qhly_changeSex[name] = {};
                        }
                        // @ts-ignore
                        lib.config.qhly_changeSex[name][game.qhly_getSkin(name)] = true;
                      }
                      game.saveConfig('qhly_changeSex', lib.config.qhly_changeSex);
                    };
                  }
                }
              }
              for (var vid of addButton) {
                // @ts-ignore
                var img = document.getElementById('qhly_skin_skill_' + vid);
                if (img) {
                  // @ts-ignore
                  ui.qhly_addListenFunc(img);
                  var that = this;
                  (function (id) {
                    // @ts-ignore
                    img.listen(function () {
                      that.consumeTextClick = true;
                      // @ts-ignore
                      if (id == 'die') window.qhly_playDieAudio(name);
                      // @ts-ignore
                      else if (id == 'victory') window.qhly_playVictoryAudio(name);
                      else {
                        // @ts-ignore
                        var count = _status.qhly_skillAudioWhich[id];
                        if (!count) {
                          // @ts-ignore
                          _status.qhly_skillAudioWhich[id] = 0;
                          count = 0;
                        }
                        // @ts-ignore
                        _status.qhly_skillAudioWhich[id]++;
                        // @ts-ignore
                        window.qhly_TrySkillAudio(id, { name: name }, null, count);
                        // @ts-ignore
                        var skillSkin = game.qhly_getSkillSkin(name, game.qhly_getSkin(name), id);
                        if (skillSkin) {
                          var currentAvatar = document.getElementById('qh-skillskin-' + that.viewState.viewCurrentIndex);
                          if (currentAvatar) {
                            if (skillSkin === 1) {
                              // @ts-ignore
                              currentAvatar.setBackground(name, 'character');
                            } else if (Array.isArray(skillSkin)) {
                              // @ts-ignore
                              currentAvatar.setBackgroundImage(skillSkin[count % skillSkin.length]);
                            } else {
                              // @ts-ignore
                              currentAvatar.setBackgroundImage(skillSkin);
                            }
                          }
                        }
                      }
                    });
                  })(vid);
                }
                // @ts-ignore
                if (lib.config.qhly_editmode && !game.qhly_isForbidEditTaici(name)) {
                  var imgEdit = document.getElementById('qhly_skin_skill_edit_' + vid);
                  if (imgEdit) {
                    // @ts-ignore
                    ui.qhly_addListenFunc(imgEdit);
                    (function (id) {
                      // @ts-ignore
                      imgEdit.listen(function () {
                        that.editOpen(name, currentSkin.skinId, id, state);
                      });
                    })(vid);
                  }
                }
              }
            }
          },
          afterGetSkinList: function (list, name, state) {
            var retList = [];
            if (list) {
              for (var skin of list) {
                // @ts-ignore
                var info = game.qhly_getSkinInfo(name, skin, state.pkg);
                var obj = {
                  order: info.order,
                  skinId: skin,
                  skinInfo: info,
                  // @ts-ignore
                  audios: get.qhly_getAudioInfoInSkin(name, state.pkg, skin),
                };
                retList.push(obj);
              }
            }
            this.skinList = [];
            // @ts-ignore
            this.skinList.push({
              skinId: null,
              // @ts-ignore
              skinInfo: game.qhly_getSkinInfo(name, null, state.pkg),
              // @ts-ignore
              audios: get.qhly_getAudioInfoInSkin(name, state.pkg, null),
            });
            retList.sort(function (a, b) {
              // @ts-ignore
              var orderA = game.qhly_getOrder(name, a.skinId, state.pkg);
              // @ts-ignore
              var orderB = game.qhly_getOrder(name, b.skinId, state.pkg);
              if (orderA > orderB) return 1;
              if (orderA == orderB) return 0;
              return -1;
            });
            for (var r of retList) {
              // @ts-ignore
              this.skinList.push(r);
            }
            let dynamicSkinList = [];
            // @ts-ignore
            if (window.decadeUI && window.decadeUI.dynamicSkin) {
              // @ts-ignore
              if (decadeUI.dynamicSkin[name]) dynamicSkinList = Object.keys(decadeUI.dynamicSkin[name]);
              for (var i of this.skinList) {
                // @ts-ignore
                if (i.skinId) {
                  // @ts-ignore
                  var skin = i.skinId.substring(0, i.skinId.lastIndexOf('.'));
                  // @ts-ignore
                  if (dynamicSkinList.includes(skin)) i.bothSkin = true;
                }
              }
              if (dynamicSkinList.length) {
                let duibiList = [];
                for (let i of this.skinList) {
                  // @ts-ignore
                  if (i.skinId && i.skinId != null) duibiList.push(i.skinId.substring(0, i.skinId.lastIndexOf('.')));
                }
                for (let i of dynamicSkinList) {
                  // @ts-ignore
                  if (i == '经典形象') this.skinList['0'].bothSkin = true;
                  else if (!duibiList.includes(i)) {
                    var dyskin = i + '.jpg';
                    // @ts-ignore
                    var dyinfo = game.qhly_getSkinInfo(name, dyskin, state.pkg);
                    // @ts-ignore
                    this.skinList.push({
                      order: dyinfo.order,
                      skinId: dyskin,
                      skinInfo: dyinfo,
                      // @ts-ignore
                      audios: get.qhly_getAudioInfoInSkin(name, state.pkg, dyskin),
                      single: true,//11
                    })
                  }
                }
              }
            }
            this.viewState.skins = this.skinList;
            this.skinListGot = true;
            if (dynamicSkinList && dynamicSkinList.length > 3) this.dynamicSkinMore = true;
          },
          init: function (name, state) {
            this.text = ui.create.div('.qh-page-skin-text', this.pageView);
            lib.setScroll(this.text);
            // @ts-ignore
            ui.qhly_fixTextSize(this.text);
            var dialog = ui.create.div('.qh-skinchange-decade-big-dialog', this.pageView);
            if (lib.config.qhly_lutouType && lib.config.qhly_lutouType == 'shousha') dialog.classList.add('shousha');
            var cover = ui.create.div('.qh-skinchange-decade-big-cover', dialog);
            var content = ui.create.div('.qh-skinchange-decade-big-area', cover);
            var skinTitle = ui.create.div('.qh-skinchange-decade-big-title', this.text);
            var skinInfoText = ui.create.div('.qh-skinchange-decade-big-skininfo', this.text);
            var skinAudioList = ui.create.div('.qh-skinchange-decade-big-skinaudiolist', this.text);
            if (lib.config.qhly_lutou) dialog.setAttribute('data-outcrop-skin', 'on');
            // @ts-ignore
            if (!_status['qhly_primarySkin_' + name]) _status['qhly_primarySkin_' + name] = game.qhly_getSkin(name);
            var autoskin = ui.create.div('.qh-skinchange-decade-big-autoskin', dialog);
            ui.create.div('.qh-skinchange-decade-big-autoskinborder', autoskin);
            ui.create.div('.qh-skinchange-decade-big-autoskinitem', autoskin);
            // @ts-ignore
            if (lib.config.qhly_autoChangeSkin == 'close' || !lib.config.qhly_autoChangeSkin) autoskin.setAttribute('data-auto', false);
            // @ts-ignore
            else autoskin.setAttribute('data-auto', true);
            autoskin.listen(function () {
              var open = false, item = 'close';
              if (lib.config.qhly_autoChangeSkin == 'close' || !lib.config.qhly_autoChangeSkin) {
                open = true;
                item = lib.config['extension_千幻聆音_qhly_decadeAuto'];
              }
              game.saveConfig('extension_千幻聆音_qhly_autoChangeSkin', item);
              game.saveConfig('qhly_autoChangeSkin', item);
              if (open) {
                // @ts-ignore
                autoskin.setAttribute('data-auto', true);
                // @ts-ignore
                game.qhly_autoChangeSkin();
              } else {
                // @ts-ignore
                autoskin.setAttribute('data-auto', false);
                // @ts-ignore
                if (_status.qhly_changeSkinFunc) {
                  // @ts-ignore
                  clearTimeout(_status.qhly_changeSkinFunc);
                }
              }
            })
            var that = this;
            this.viewState = {
              offset: 98,
              viewCurrentIndex: 0,
              skinPerWidth: 274,
              skinGap: -170,
              skins: [],
              skinViews: [],
              skinTitle: skinTitle,
              skinInfoText: skinInfoText,
              skinAudioList: skinAudioList,
              visibleWidth: function () {
                var rect = cover.getBoundingClientRect();
                return rect.width;
              },
              scale: document.body.offsetWidth / 1208,
              cover: cover,
              content: content,
              refresh: function () {
                content.style.width = Math.round(this.skinTotalWidth) + 'px';
                content.style.left = Math.round(this.offset) + "px";
                var cskin = this.skins[this.viewCurrentIndex];
                if (cskin) {
                  var tname = cskin.skinId;
                  if (!tname) {
                    tname = '经典形象';
                  } else if (cskin.skinInfo.translation) {
                    tname = cskin.skinInfo.translation;
                  } else {
                    tname = get.translation(cskin.skinId);
                  }
                  if (tname.indexOf('.') != -1) tname = tname.substring(0, tname.lastIndexOf('.'));
                // @ts-ignore
                } else var tname = '经典形象';
                this.skinTitle.innerHTML = tname;
                // if (that.currentIndex != this.viewCurrentIndex) {
                //     that.currentIndex = this.viewCurrentIndex;
                //     that.refresh(name, state);
                // };
                //if (!tname) game.qhly_setCurrentSkin(name, null);
                // @ts-ignore
                if (cskin) game.qhly_setCurrentSkin(name, cskin.skinId, function () {
                  that.refreshAfterGot(name, state);
                });
              },
              handleMouseDown: function (x, y) {
                if (this.skins.length == 1) {
                  return;
                }
                if (!this.offset) this.offset = 98;
                this.mouseDownX = x;
                this.mouseDownY = y;
                this.isTouching = true;
                this.cancelClick = false;
                this.tempoffset = this.offset;
              },
              // @ts-ignore
              // @ts-ignore
              // @ts-ignore
              handleMouseMove: function (x, y) {
                if (!this.isTouching) return;
                var slideX = x - this.mouseDownX;
                this.tempoffset = this.offset + slideX;
                if (this.tempoffset > ((this.skinPerWidth + this.skinGap) * 0.5 + 46) * this.scale) {
                  this.tempoffset = ((this.skinPerWidth + this.skinGap) * 0.5 + 46) * this.scale;
                } else if ((this.skinTotalWidth - 372 * this.scale) < -this.tempoffset) {
                  this.tempoffset = -(this.skinTotalWidth - 372 * this.scale);
                }
                this.content.style.left = Math.round(this.tempoffset) + "px";
                var current = (this.tempoffset - 98 * this.scale) / ((this.skinPerWidth + this.skinGap) * this.scale);
                this.viewCurrentIndex = -Math.round(current);
                for (var i = 0; i < this.skinViews.length; i++) {
                  var zin = Math.max(10, 15 - Math.abs(i + Math.round(current)));
                  // @ts-ignore
                  this.skinViews[i].style.transform = 'scale(' + Math.max(0.3, 1 - 0.4 * Math.abs(i + current)) + ')';
                  // @ts-ignore
                  this.skinViews[i].style.zIndex = zin;
                  // @ts-ignore
                  this.skinViews[i].style.opacity = Math.round(Math.min(1, 1.7 - Math.abs(i + current)));
                }
                return true;
              },
              // @ts-ignore
              // @ts-ignore
              // @ts-ignore
              handleMouseUp: function (x, y) {
                if (this.isTouching) {
                  this.isTouching = false;
                  this.tempoffset = (98 - this.viewCurrentIndex * (this.skinPerWidth + this.skinGap)) * this.scale;
                  var current = (this.tempoffset - 98 * this.scale) / ((this.skinPerWidth + this.skinGap) * this.scale);
                  for (var i = 0; i < this.skinViews.length; i++) {
                    var zin = Math.max(10, 15 - Math.abs(i + Math.round(current)));
                    // @ts-ignore
                    this.skinViews[i].style.transform = 'scale(' + Math.max(0.3, 1 - 0.4 * Math.abs(i + current)) + ')';
                    // @ts-ignore
                    this.skinViews[i].style.zIndex = zin;
                    // @ts-ignore
                    this.skinViews[i].style.opacity = Math.round(Math.min(1, 1.7 - Math.abs(i + current)));
                  }

                  this.cancelClick = Math.abs(this.offset - this.tempoffset) > 50;
                  this.content.style.left = Math.round(this.tempoffset) + "px";
                } else {
                  this.cancelClick = false;
                }
                this.offset = this.tempoffset;
                this.refresh();
                this.previousX = this.mouseDownX;
                this.previousY = this.mouseDownY;
                delete this.mouseDownX;
                delete this.mouseDownY;
              }
            };
            this.inited = true;
          }
        },
        config: {
          pageView: ui.create.div('.qh-page-config', view),
          refresh: function (name, state) {
            subView.hp.hide();
            subView.mp.hide();
            subView.avatar.show();
            if (!this.inited) this.init(name, state);
            //game.qhly_syncChangeSkinButton(name, game.qhly_getSkin(name), state);
          },
          init: function (name, state) {
            this.innerConfig = ui.create.div('.qh-page-config-text', this.pageView);
            // @ts-ignore
            ui.qhly_fixTextSize(this.innerConfig);
            var that = this;
            var content = "";
            // @ts-ignore
            content += "<h2><img src='" + lib.assetURL + get.qhly_getCurrentViewSkinValue('favouriteImage', 'extension/千幻聆音/image/newui_fav.png') + "' style='width:50px;margin-bottom:-4px;'/>收藏设置</h2>";
            content += "<p>可以选择收藏此武将。进行自由选将操作时，可以更快找到此武将。</p>";
            content += "<p><span style='display:inline-block;height:30px;'><img id='qhconfig_checkbox_fav'/><span id='qhconfig_checkbox_text_fav' style='display:inline-block;position:relative;bottom:25%;'>收藏" + get.translation(name) + "</span></span></p>";

            // @ts-ignore
            content += "<h2><img src='" + lib.assetURL + get.qhly_getCurrentViewSkinValue('forbidImage', 'extension/千幻聆音/image/newui_forbid.png') + "' style='width:50px;margin-bottom:-4px;'/>禁用设置</h2>";
            content += "<p>可以选择在某模式下禁用或启用该武将。该设置将在重启游戏后生效。</p>"
            content += "<p><span style='display:inline-block;height:30px;'><img id='qhconfig_checkbox_banned_mode_all'/><span id='qhconfig_checkbox_text_all' style='display:inline-block;position:relative;bottom:25%;'>所有模式禁用</span></span></p>";
            for (var mode in lib.mode) {
              if (mode != 'connect') {
                var translatemode = get.translation(mode);
                if (mode == 'tafang') translatemode = '塔防';
                else if (mode == 'chess') translatemode = '战棋';
                content += "<p><span style='display:inline-block;height:30px;'><img id='qhconfig_checkbox_banned_mode_" + mode + "'/><span id='qhconfig_checkbox_text_" + mode + "' style='display:inline-block;position:relative;bottom:25%;'>" + translatemode + "模式禁用</span></span></p>";
              }
            }
            content += "<p><span style='display:inline-block;height:30px;'><img id='qhconfig_checkbox_banned_ai'/><span id='qhconfig_checkbox_text_ai' style='display:inline-block;position:relative;bottom:25%;'>仅自由选将可选</span></span></p>";

            // @ts-ignore
            content += "<h2><img src='" + lib.assetURL + get.qhly_getCurrentViewSkinValue('rankImage', 'extension/千幻聆音/image/newui_rank_icon.png') + "' style='width:50px;margin-bottom:-4px;'/>等阶设置</h2>";
            content += "<p>可以设置" + get.translation(name) + "的等阶，重启后生效。</p>";
            content += "<p><select style='font-size:22px;font-family:'qh_youyuan';' id='qhconfig_rank_select'></select></p>";

            if (lib.config.qhly_enableCharacterMusic) {
              // @ts-ignore
              content += "<h2><img src='" + lib.assetURL + get.qhly_getCurrentViewSkinValue('musicImage', 'extension/千幻聆音/image/newui_music_icon.png') + "' style='width:50px;margin-bottom:-4px;'/>音乐设置</h2>";
              content += "<p>可以设置" + get.translation(name) + "的专属背景音乐，在游戏开始时将自动切换。</p>";
              content += "<p><select style='font-size:22px;font-family:'qh_youyuan';' id='qhconfig_music_select'></select></p>";
            }
            var extraConfigs = [];
            if (state.pkg.characterConfigExtra) {
              var characterConfigExtra = state.pkg.characterConfigExtra(name);
              if (characterConfigExtra) {
                for (var extc of characterConfigExtra) {
                  // @ts-ignore
                  var extobj = game.qhly_parseConfig(extc);
                  content += extobj.content;
                  extraConfigs.push(extobj);
                }
              }
            }
            content += "<br><br><br><br><br><br>";
            this.innerConfig.innerHTML = content;
            for (var extraConfig of extraConfigs) {
              if (extraConfig.onfinish) {
                extraConfig.onfinish(this.innerConfig);
              }
            }
            var bindFunc = function (checkbox, text) {
              if (!text) return;
              // @ts-ignore
              ui.qhly_addListenFunc(text);
              text.listen(function () {
                // @ts-ignore
                game.qhly_playQhlyAudio('qhly_voc_check', null, true);
                checkbox.qhly_setChecked(!checkbox.qhly_checked, true);
              });
            };
            var checkboxFav = document.getElementById('qhconfig_checkbox_fav');
            // @ts-ignore
            ui.qhly_initCheckBox(checkboxFav, lib.config.favouriteCharacter && lib.config.favouriteCharacter.includes(name));
            bindFunc(checkboxFav, document.getElementById('qhconfig_checkbox_text_fav'));
            // @ts-ignore
            checkboxFav.qhly_onchecked = function (check) {
              if (!check) {
                if (lib.config.favouriteCharacter && lib.config.favouriteCharacter.includes(name)) {
                  lib.config.favouriteCharacter.remove(name);
                }
              } else {
                if (!lib.config.favouriteCharacter) {
                  lib.config.favouriteCharacter = [name];
                } else {
                  lib.config.favouriteCharacter.add(name);
                }
              }
              game.saveConfig('favouriteCharacter', lib.config.favouriteCharacter);
            };
            var checkboxAll = document.getElementById('qhconfig_checkbox_banned_mode_all');
            var allForbid = true;
            for (var mode in lib.mode) {
              if (mode != 'connect') {
                if (lib.config[mode + '_banned'] && lib.config[mode + '_banned'].includes(mode)) {
                  continue;
                }
                allForbid = false;
                break;
              }
            }

            // @ts-ignore
            ui.qhly_initCheckBox(checkboxAll, allForbid);
            bindFunc(checkboxAll, document.getElementById('qhconfig_checkbox_text_all'));
            // @ts-ignore
            checkboxAll.qhly_onchecked = function (check) {
              if (check) {
                for (var mode in lib.mode) {
                  if (mode == 'connect') continue;
                  if (that['banned_checkbox_mode_' + mode]) {
                    that['banned_checkbox_mode_' + mode].qhly_setChecked(true, true);
                  }
                }
              } else {
                for (var mode in lib.mode) {
                  if (mode == 'connect') continue;
                  if (that['banned_checkbox_mode_' + mode]) {
                    that['banned_checkbox_mode_' + mode].qhly_setChecked(false, true);
                  }
                }
              }
            };
            this.banned_checkbox_mode_all = checkboxAll;
            var checkboxBanai = document.getElementById('qhconfig_checkbox_banned_ai');

            // @ts-ignore
            ui.qhly_initCheckBox(checkboxBanai, game.qhly_isForbidAI(name));

            bindFunc(checkboxBanai, document.getElementById('qhconfig_checkbox_text_ai'));
            // @ts-ignore
            checkboxBanai.qhly_onchecked = function (check) {
              if (check) {
                // @ts-ignore
                game.qhly_setForbidAI(name, true);
              } else {
                // @ts-ignore
                game.qhly_setForbidAI(name, false);
              }
            };
            for (var mode in lib.mode) {
              if (mode != 'connect') {
                var checkbox = document.getElementById('qhconfig_checkbox_banned_mode_' + mode);
                this['banned_checkbox_mode_' + mode] = checkbox;
                if (checkbox) {
                  // @ts-ignore
                  ui.qhly_initCheckBox(checkbox, lib.config[mode + '_banned'] && lib.config[mode + '_banned'].includes(name));
                  bindFunc(checkbox, document.getElementById('qhconfig_checkbox_text_' + mode));
                  (function (mode) {
                    // @ts-ignore
                    checkbox.qhly_onchecked = function (checked) {
                      if (!checked) {
                        that.banned_checkbox_mode_all.qhly_setChecked(false, true);
                        if (lib.config[mode + '_banned'] && lib.config[mode + '_banned'].includes(name)) {
                          lib.config[mode + '_banned'].remove(name);
                        }
                      } else {
                        if (lib.config[mode + '_banned']) {
                          lib.config[mode + '_banned'].add(name);
                        } else {
                          lib.config[mode + '_banned'] = [name];
                        }
                      }
                      game.saveConfig(mode + '_banned', lib.config[mode + '_banned']);
                    };
                  })(mode);
                }
              }
            }
            lib.setScroll(this.innerConfig);
            // @ts-ignore
            game.qhly_changeViewPageSkin('config', this.pageView);
            var rankSelect = document.getElementById('qhconfig_rank_select');
            var rankList = ['默认', '普通', '精品', '稀有', '史诗', '传说'];
            var rankToEng = {
              '默认': "default",
              '普通': 'junk',
              '史诗': "epic",
              '传说': "legend",
              '稀有': 'rare',
              '精品': "common",
            };
            var rankToIcon = {
              '默认': "",
              '精品': 'A+',
              '史诗': "SS",
              '传说': "SSS",
              '稀有': 'S',
              '普通': "A",
            };
            var rank = null;
            if (lib.config.qhly_rarity && lib.config.qhly_rarity[name]) {
              rank = lib.config.qhly_rarity[name];
            }
            for (var r of rankList) {
              var opt = document.createElement('option');
              opt.innerHTML = r + rankToIcon[r];
              opt.setAttribute('rank', rankToEng[r]);
              if (!rank && r == '默认') {
                // @ts-ignore
                opt.selected = 'selected';
              } else if (rankToEng[r] == rank) {
                // @ts-ignore
                opt.selected = 'selected';
              }
              // @ts-ignore
              rankSelect.appendChild(opt);
            }
            // @ts-ignore
            rankSelect.onchange = function (e) {
              var event = e ? e : window.event;
              // @ts-ignore
              if (event.target) {
                // @ts-ignore
                target = event.target;
                // @ts-ignore
                var opt = target[target.selectedIndex];
                if (opt) {
                  var rank = opt.getAttribute('rank');
                  if (!lib.config.qhly_rarity) {
                    lib.config.qhly_rarity = {};
                  }
                  if (rank == 'default') {
                    if (lib.config.qhly_rarity[name]) {
                      delete lib.config.qhly_rarity[name];
                    }
                  } else {
                    lib.config.qhly_rarity[name] = rank;
                  }
                  game.saveConfig('qhly_rarity', lib.config.qhly_rarity);
                }
              }
              refreshRank();
            };
            if (lib.config.qhly_enableCharacterMusic) {
              var select = document.getElementById('qhconfig_music_select');
              // @ts-ignore
              var currentMusic = game.qhly_getCharacterMusic(name);
              var opt = document.createElement('option');
              opt.innerHTML = "无";
              opt.setAttribute('musicpath', '');
              if (!currentMusic) {
                // @ts-ignore
                opt.selected = 'selected';
              }
              // @ts-ignore
              select.appendChild(opt);
              // @ts-ignore
              for (var p in lib.qhlyMusic) {
                var opt = document.createElement('option');
                // @ts-ignore
                opt.innerHTML = lib.qhlyMusic[p].name;
                opt.setAttribute('musicpath', p);
                if (currentMusic == p) {
                  // @ts-ignore
                  opt.selected = 'selected';
                }
                // @ts-ignore
                select.appendChild(opt);
              }
              // @ts-ignore
              select.onchange = function (e) {
                var event = e ? e : window.event;
                // @ts-ignore
                if (event.target) {
                  // @ts-ignore
                  target = event.target;
                  // @ts-ignore
                  var opt = target[target.selectedIndex];
                  if (opt) {
                    var path = opt.getAttribute('musicpath');
                    if (path) {
                      lib.config.qhly_characterMusic[name] = path;
                    } else {
                      delete lib.config.qhly_characterMusic[name];
                    }
                    game.saveConfig('qhly_characterMusic', lib.config.qhly_characterMusic);
                    // @ts-ignore
                    game.qhly_switchBgm();
                  }
                }
              };
            }
            this.inited = true;
          }
        }
      };
      //subView.pageButton[page].setBackgroundImage(get.qhly_getIf(currentViewSkin.buttonPressedImage, 'extension/千幻聆音/newui_button_selected.png'));
      view.appendChild(subView.mp);
      var state = {
        name: name,
        currentPage: page,
        skinScrollIndex: 0,
        // @ts-ignore
        pkg: game.qhly_foundPackage(name),
        intro: get.character(name),
        mainView: subView,
      };
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      subView.menuCover.listen(function (current) {
        if (state.extraMenu) {
          state.extraMenu.delete();
          delete state.extraMenu;
        }
        view.removeChild(subView.menuCover);
      });
      refreshRank = function () {
        if (subView.rank) {
          if (lib.config.qhly_showrarity) {
            subView.rank.show();
            var rarity = game.getRarity(state.name);
            if (rarity) {
              subView.rank.setBackgroundImage('extension/千幻聆音/theme/decade/rarity_' + game.getRarity(name) + '.png');
            }
          } else {
            subView.rank.hide();
          }
        }
        // @ts-ignore
        subView.avatarImage.setAttribute('data-border-level', game.qhly_getDengJie(state.name));
      };
      var showPage = function (pagename) {
        var tpage = subView.page[pagename];
        subView.currentPage = pagename;
        state.currentPage = pagename;
        if (tpage) {
          tpage.refresh(name, state);
        }
        //state.useLihuiLayout(state.useLihui());
        for (var p in subView.page) {
          if (p == pagename) {
            subView.page[p].pageView.show();
          } else {
            subView.page[p].pageView.hide();
          }
        }
        for (var k in subView.pageButton) {
          if (k == pagename) {
            subView.pageButton[k].classList.add('sel');
          } else {
            subView.pageButton[k].classList.remove('sel');
          }
        }
      };
      state.useLihui = function () {
        return false;
      };
      for (var k in subView.pageButton) {
        (function (m) {
          subView.pageButton[m].listen(function () {
            if (subView.currentPage != m) {
              document.getElementsByClassName('qh-otherinfoarrow')[0].classList.remove('sel');
              showPage(m);
              if (state.extraMenu) {
                state.extraMenu.delete();
                delete state.extraMenu;
              }
              // @ts-ignore
              game.qhly_playQhlyAudio('qhly_voc_dec_press', null, true);
            } else if (m == 'introduce') {
              if (state.extraMenu) {
                state.extraMenu.delete();
                document.getElementsByClassName('qh-otherinfoarrow')[0].classList.remove('sel');
                delete state.extraMenu;
              } else {
                document.getElementsByClassName('qh-otherinfoarrow')[0].classList.add('sel');
                // @ts-ignore
                var extra = game.qhly_getIntroduceExtraPage(name, state.pkg);
                if (extra) {
                  // @ts-ignore
                  game.qhly_playQhlyAudio('qhly_voc_click2', null, true);
                  var arr = [{
                    name: '简介',
                    onchange: function () {
                      document.getElementsByClassName('qh-otherinfoarrow')[0].classList.remove('sel');
                      state.introduceExtraPage = "简介";
                      subView.page.introduce.refresh(name, state);
                      if (state.extraMenu) {
                        state.extraMenu.delete();
                        delete state.extraMenu;
                        view.removeChild(subView.menuCover);
                      }
                    }
                  }];
                  for (var obj of extra) {
                    (function (obj) {
                      arr.push({
                        name: obj.name,
                        onchange: function () {
                          document.getElementsByClassName('qh-otherinfoarrow')[0].classList.remove('sel');
                          state.introduceExtraPage = obj.name;
                          if (obj.qh_func) {
                            state.introduceExtraFunc = game[obj.qh_func];
                          } else {
                            state.introduceExtraFunc = obj.func;
                          }
                          subView.page.introduce.refresh(name, state);
                          if (state.extraMenu) {
                            state.extraMenu.delete();
                            delete state.extraMenu;
                            view.removeChild(subView.menuCover);
                          }
                        }
                      });
                    })(obj);
                  }
                  // @ts-ignore
                  state.extraMenu = game.qhly_createBelowMenu(arr, view);
                  view.appendChild(subView.menuCover);
                }
              }
            }
          });
        })(k);
      }
      var refreshView = function (state, subView) {
        if (state.pkg.isLutou || lib.config.qhly_lutou) {
          subView.avatarImage.classList.remove('qh-image-standard');
          subView.avatarImage.classList.add('qh-image-lutou');

        } else {
          subView.avatarImage.classList.remove('qh-image-lutou');
          subView.avatarImage.classList.add('qh-image-standard');

        }
        // if (lib.qhly_skinChange[name]) {
        //     if (_status.qhly_replaceSkin[name][game.qhly_getSkin(name)]) window.qhly_audio_redirect[name + '-' + game.qhly_earse_ext(game.qhly_getSkin(name))] = _status.qhly_replaceSkin[name][game.qhly_getSkin(name)];
        //     game.qhly_setCurrentSkin(name, game.qhly_getSkin(name));
        // }
        // @ts-ignore
        game.qhly_checkPlayerImageAudio(name, game.qhly_getSkin(name));
        // @ts-ignore
        game.qhly_setOriginSkin(name, game.qhly_getSkin(name), state.mainView.avatarImage, state, game.qhly_getPlayerStatus(state.mainView.avatarImage, null, state.name) == 2);
        // @ts-ignore
        if (game.qhly_getSkin(name)) {
          // @ts-ignore
          var str = game.qhly_getSkin(name).substring(0, game.qhly_getSkin(name).length - 4);
          if (!lib.config.qhly_skinset.djtoggle[name] || lib.config.qhly_skinset.djtoggle[name] && !lib.config.qhly_skinset.djtoggle[name][str]) {
            // @ts-ignore
            game.qhly_changeDynamicSkin(subView.avatarImage, str, name);
            // @ts-ignore
            if (subView.avatarImage.dynamic && subView.avatarImage.dynamic.primary) _status.currentTexiao = subView.avatarImage.dynamic.primary.name;
          }
        // @ts-ignore
        } else if (window.decadeUI && decadeUI.dynamicSkin && decadeUI.dynamicSkin[name]) {
          // @ts-ignore
          var dyList = Object.keys(decadeUI.dynamicSkin[name]);
          if (dyList && dyList.includes('经典形象') && (!lib.config.qhly_skinset.djtoggle[name] || lib.config.qhly_skinset.djtoggle[name] && !lib.config.qhly_skinset.djtoggle[name]['经典形象']))
            // @ts-ignore
            game.qhly_changeDynamicSkin(subView.avatarImage, '经典形象', name);
        }
        // }
        state.onChangeSkin = function () {
          if (!subView.characterTitle) return;
          var ctitle;
          if (state.pkg && state.pkg.characterTitle) {
            ctitle = state.pkg.characterTitle(name);
            if (ctitle && ctitle[0] === '#' && ctitle.length >= 2) {
              switch (ctitle[1]) {
                case 'r':
                  subView.characterTitle.style.color = 'red';
                  break;
                case 'g':
                  subView.characterTitle.style.color = 'green';
                  break;
                case 'p':
                  subView.characterTitle.style.color = 'legend';
                  break;
                case 'b':
                  subView.characterTitle.style.color = 'blue';
                  break;
              }
              ctitle = ctitle.slice(2);
            }
          } else if (subView.characterTitle && lib.characterTitle[name]) {
            ctitle = lib.characterTitle[name];
            if (ctitle && ctitle[0] === '#' && ctitle.length >= 2) {
              switch (ctitle[1]) {
                case 'r':
                  subView.characterTitle.style.color = 'red';
                  break;
                case 'g':
                  subView.characterTitle.style.color = 'green';
                  break;
                case 'p':
                  subView.characterTitle.style.color = 'legend';
                  break;
                case 'b':
                  subView.characterTitle.style.color = 'blue';
                  break;
              }
              ctitle = ctitle.slice(2);
            }
          }
          // @ts-ignore
          subView.characterTitle.innerHTML = get.qhly_verticalStr(lib.qhly_filterPlainText(ctitle));
        };
        state.onChangeSkin();
        refreshRank();
        var pattern = lib.config.qhly_name_pattern;
        if(!pattern)pattern = "full";
        let getTranslation = (name)=>{
          if(!get.slimNameHorizontal && pattern!='raw'){
            if(!lib.config.qhly_metioned_slimName){
              let r = prompt("你的无名杀版本暂不支持前缀文字显示，已经为你显示为原本的get.translation方式。点击“确认”不再提示此消息。");
              if(r){
                game.saveConfig('qhly_metioned_slimName',true);
              }
            }
            return get.translation(name);
          }else{
            switch(pattern){
              case "full":
                return get.slimNameHorizontal(name);
              case "full_pure":
                // @ts-ignore
                return lib.qhly_filterPlainText(get.slimNameHorizontal(name));
              case "raw":
                return get.rawName(name);
            }
          }
        };
        var chname;
        if (state.pkg.characterNameTranslate) {
          chname = state.pkg.characterNameTranslate(state.name);
        } else {
          chname = getTranslation(state.name);
          if (!chname) {
            if (state.name.indexOf("gz_") == 0) {
              chname = getTranslation(state.name.silce(3));
            }
          }
          if (!chname) {
            chname = "未命名武将";
          }
        }
        // @ts-ignore
        if (game.qhly_getIntroduceExtraPage(name, state.pkg)) {
          subView.pageButton.introduce.downButton.show();
        } else {
          subView.pageButton.introduce.downButton.hide();
        }
        subView.nameTitle.innerHTML = chname;
        // @ts-ignore
        var vname = get.qhly_verticalStr(lib.qhly_filterPlainText(chname));
        subView.name.innerHTML = vname;
        if (chname.length == 5) {
          subView.name.style.fontSize = '2.6em';
        } else if (chname.length >= 6) {
          subView.name.style.fontSize = '2.4em';
        } else {
          subView.name.style.fontSize = '2.8em';
        }
        var hp = state.intro[2];
        if (typeof hp == 'number' && !isFinite(hp)) {
          hp = '∞';
        }
        if (!get.infoHujia(hp)) {
          subView.hpText.innerHTML = hp + '';
        } else {
          var str = '';
          if (get.infoHp(hp) != get.infoMaxHp(hp)) {
            str = get.infoHp(hp) + '/' + get.infoMaxHp(hp);
          } else {
            str = get.infoMaxHp(hp) + '';
          }
          // @ts-ignore
          str += "&nbsp;&nbsp;&nbsp;<img style='height:20px;width:20px;' src='" + lib.qhly_path + "theme/decade/shield.png'/>";
          if (get.infoHujia(hp) > 1) {
            str += ("x" + get.infoHujia(hp));
          }
          subView.hpText.innerHTML = str;
          subView.hpText.style.left = "calc(29%)";
          subView.hpText.style.width = "calc(90%)";
        }
        // @ts-ignore
        var mp = get.qhly_getMp(state.name, state.pkg);
        if (mp === null || mp === undefined) {
          subView.mp.hide();
        } else {
          subView.mp.show();
          subView.mpText.innerHTML = mp + "";
        }
        // @ts-ignore
        var mp = get.qhly_getMp(state.name, state.pkg);
        if (mp === null || mp === undefined) {
          subView.mp.setAttribute('data-visiable', false);
          subView.mp.hide();
        } else {
          subView.mp.setAttribute('data-visiable', true);
          subView.mp.show();
          subView.mpText.innerHTML = mp + "";
        }

      };
      refreshView(state, subView);
      // @ts-ignore
      game.qhly_changeViewSkin(subView);
      showPage('skin');
      showPage(page);
      // @ts-ignore
      game.qhly_syncChangeSkinButton(name, game.qhly_getSkin(name), state);
      // @ts-ignore
      game.qhly_setOriginSkin(name, game.qhly_getSkin(name), state.mainView.avatarImage, state, game.qhly_getPlayerStatus(state.mainView.avatarImage, null, state.name) == 2);
    }


    // @ts-ignore
    game.qhly_initNewView = function (name, view, page, cplayer) {
      // @ts-ignore
      var currentViewSkin = lib.qhly_viewskin[lib.config.qhly_currentViewSkin];
      var subView = {};
      if (!page) {
        page = 'introduce';
      }
      var refreshRank = function () { };
      subView.avatar = ui.create.div('.qh-avatar', view);
      subView.pageButton = {
        introduce: ui.create.div('.qh-button1', view),
        skill: ui.create.div('.qh-button2', view),
        skin: ui.create.div('.qh-button3', view),
        config: ui.create.div('.qh-button4', view),
      };
      subView.menuCover = ui.create.div();
      subView.menuCover.style.width = "100%";
      subView.menuCover.style.height = "100%";
      // @ts-ignore
      subView.menuCover.style.zIndex = 38;
      if (currentViewSkin.isQiLayout) {
        subView.avatarImage = ui.create.div('.qh-image-standard', subView.avatar);
        subView.rank = ui.create.div('.qh-avatar-rank', subView.avatar);
        subView.avatarImage.classList.add('qh-must-replace');
        subView.avatarImage.classList.add('avatar');
        subView.avatarLabel = ui.create.div('.qh-avatar-label', view);
        subView.group = ui.create.div('.qh-avatar-label-group', subView.avatarLabel);
        if (lib.config.qhly_shilizihao) {
          subView.group.style.fontSize = lib.config.qhly_shilizihao + "px";
        }
        subView.doublegroup = ui.create.div('.qh-avatar-label-group-double', subView.avatarLabel);
        subView.doublegroupA = ui.create.div('.qh-avatar-label-group-double-a', subView.doublegroup);
        subView.doublegroupB = ui.create.div('.qh-avatar-label-group-double-b', subView.doublegroup);
        if (lib.config.qhly_shilizihao) {
          subView.doublegroupA.style.fontSize = parseInt(lib.config.qhly_shilizihao) * 0.4 + "px";
          subView.doublegroupB.style.fontSize = parseInt(lib.config.qhly_shilizihao) * 0.4 + "px";
        }
        subView.doublegroup.hide();
        subView.name = ui.create.div('.qh-avatar-label-name', subView.avatarLabel);
        subView.characterTitle = ui.create.div('.qh-avatar-label-title', subView.avatarLabel);
        subView.hp = ui.create.div('.qh-hp', view);
        subView.mp = ui.create.div('.qh-mp');
        subView.mp.hide();
        subView.pageButton.introduce.innerHTML = "简介";
        // @ts-ignore
        subView.pageButton.introduce.downButton = ui.create.div('.qh-otherinfoarrow', subView.pageButton.introduce);
        subView.pageButton.skill.innerHTML = "技能";
        subView.pageButton.skin.innerHTML = "皮肤";
        subView.pageButton.config.innerHTML = "选项";
        subView.cover = ui.create.div('.qh-window-cover', view);
        if (lib.config.qhly_hideShuimoCover) {
          subView.cover.setBackgroundImage('extension/千幻聆音/theme/shuimo/newui_shuimo_bg3.png');
        } else {
          subView.cover.setBackgroundImage('extension/千幻聆音/theme/shuimo/newui_shuimo_bg2.png');
        }
        subView.board = ui.create.div('.qh-window-backboard', view);
        var lineHeight = (lib.config.qhly_hanggaoxiufu2 ? lib.config.qhly_hanggaoxiufu2 : '250') + '%';
        subView.pageButton.introduce.style.lineHeight = lineHeight;
        subView.pageButton.skill.style.lineHeight = lineHeight;
        subView.pageButton.skin.style.lineHeight = lineHeight;
        subView.pageButton.config.style.lineHeight = lineHeight;
      } else if (currentViewSkin.isLolBigLayout) {
        subView.avatarImage = ui.create.div('.qh-image-standard', subView.avatar);
        subView.rank = ui.create.div('.qh-avatar-rank', subView.avatar);
        subView.avatarImage.classList.add('qh-must-replace');
        subView.avatarImage.classList.add('avatar');
        subView.avatarLabel = ui.create.div('.qh-avatar-label', view);
        subView.group = ui.create.div('.qh-avatar-label-group', subView.avatarLabel);
        if (lib.config.qhly_lolshilizihao) {
          subView.group.style.fontSize = lib.config.qhly_lolshilizihao + "px";
        }
        subView.doublegroup = ui.create.div('.qh-avatar-label-group-double', subView.avatarLabel);
        subView.doublegroupA = ui.create.div('.qh-avatar-label-group-double-a', subView.doublegroup);
        subView.doublegroupB = ui.create.div('.qh-avatar-label-group-double-b', subView.doublegroup);
        if (lib.config.qhly_lolshilizihao) {
          subView.doublegroupA.style.fontSize = parseInt(lib.config.qhly_lolshilizihao) * 0.4 + "px";
          subView.doublegroupB.style.fontSize = parseInt(lib.config.qhly_lolshilizihao) * 0.4 + "px";
        }
        subView.doublegroup.hide();
        subView.name = ui.create.div('.qh-avatar-label-name', subView.avatarLabel);
        subView.characterTitle = ui.create.div('.qh-avatar-label-title', subView.avatarLabel);
        subView.hp = ui.create.div('.qh-hp', view);
        subView.mp = ui.create.div('.qh-mp');
        subView.mp.hide();
        subView.pageButton.introduce.innerHTML = "简介";
        // @ts-ignore
        subView.pageButton.introduce.downButton = ui.create.div('.qh-otherinfoarrow', subView.pageButton.introduce);
        subView.pageButton.skill.innerHTML = "技能";
        subView.pageButton.skin.innerHTML = "皮肤";
        subView.pageButton.config.innerHTML = "选项";
        subView.cover = ui.create.div('.qh-window-cover', view);
        subView.board = ui.create.div('.qh-window-backboard', view);
      }
      else {
        subView.avatarImage = ui.create.div('.qh-image-standard', subView.avatar);
        subView.avatarImage.classList.add('qh-must-replace');
        subView.avatarImage.classList.add('avatar');
        subView.avatarLabel = ui.create.div('.qh-avatar-label', subView.avatar);
        subView.group = ui.create.div('.qh-avatar-label-group', subView.avatarLabel);
        subView.rank = ui.create.div('.qh-avatar-label-rank', subView.avatarLabel);
        subView.name = ui.create.div('.qh-avatar-label-name', subView.avatarLabel);
        subView.hp = ui.create.div('.qh-hp', view);
        subView.hpText = ui.create.div('.qh-hptext', subView.hp);
        subView.mp = ui.create.div('.qh-mp');
        subView.mpText = ui.create.div('.qh-mptext', subView.mp);
        subView.mp.hide();
        subView.dragontail = ui.create.div('.qh-avatar-dragontail', subView.avatar);
        subView.dragontail.hide();
        subView.dragonhead = ui.create.div('.qh-avatar-dragonhead', subView.avatar);
        subView.dragonhead.hide();
        subView.pageButton.introduce.innerHTML = "简 介";
        // @ts-ignore
        subView.pageButton.introduce.downButton = ui.create.div('.qh-otherinfoarrow', subView.pageButton.introduce);
        subView.pageButton.skill.innerHTML = "技 能";
        subView.pageButton.skin.innerHTML = "皮 肤";
        subView.pageButton.config.innerHTML = "选 项";
      }
      subView.page = {
        introduce: {
          pageView: ui.create.div('.qh-page-introduce', view),
          refresh: function (name, state) {
            if (!this.inited) this.init(name, state);
            var that = this;
            this.text.refresh = function(){
              that.refresh(name,state);
            };
            if (!state.introduceExtraPage || state.introduceExtraPage == '简介') {
              // @ts-ignore
              var intro = get.qhly_getIntroduce(name, state.pkg);
              this.text.innerHTML = "<br>" + intro + "<br><br><br><br><br><br><br>";
              if (currentViewSkin.buttonTextSpace === false) {
                subView.pageButton.introduce.innerHTML = "简介";
              } else {
                subView.pageButton.introduce.innerHTML = "简 介";
              }
              // @ts-ignore
              subView.pageButton.introduce.appendChild(subView.pageButton.introduce.downButton);
            } else {
              var ret = '';
              var handleView = null;
              if (state.introduceExtraFunc) {
                var func = null;
                if (typeof state.introduceExtraFunc == 'function') {
                  func = state.introduceExtraFunc;
                } else {
                  func = state.pkg[state.introduceExtraFunc];
                }
                if (typeof func == 'function') {
                  var fc = func(name);
                  if (fc) {
                    if (typeof fc == 'string') {
                      ret = "<br>" + fc + "<br><br><br><br><br><br><br>";
                    } else {
                      if (fc.content) {
                        ret = "<br>" + fc.content + "<br><br><br><br><br><br><br>";
                      }
                      if (fc.handleView && typeof fc.handleView == 'function') {
                        handleView = fc.handleView;
                      }
                    }
                  }
                }
              }
              this.text.innerHTML = ret;
              if (handleView) {
                handleView(this.text, name);
              }
              var btname = state.introduceExtraPage;
              if (currentViewSkin.buttonTextSpace !== false && btname.length == 2) {
                btname = btname.charAt(0) + ' ' + btname.charAt(1);
              }
              subView.pageButton.introduce.innerHTML = btname;
              // @ts-ignore
              subView.pageButton.introduce.appendChild(subView.pageButton.introduce.downButton);
            }
          },
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          init: function (name, state) {
            this.text = ui.create.div('.qh-page-introduce-text', this.pageView);
            if (lib.config.qhly_vMiddle === false && (currentViewSkin.isQiLayout || currentViewSkin.isLolBigLayout)) {
              this.text.style.height = "100%";
              this.text.style.maxHeight = "none";
            }
            lib.setScroll(this.text);
            // @ts-ignore
            ui.qhly_fixTextSize(this.text);
            // @ts-ignore
            game.qhly_changeViewPageSkin('introduce', this.pageView);
            this.inited = true;
          }
        },
        skill: {
          pageView: ui.create.div('.qh-page-skill', view),
          refresh: function (name, state) {
            if (!this.inited) this.init(name, state);
          },
          init: function (name, state) {
            this.text = ui.create.div('.qh-page-skill-text', this.pageView);
            lib.setScroll(this.text);
            if (lib.config.qhly_vMiddle === false && (currentViewSkin.isQiLayout || currentViewSkin.isLolBigLayout)) {
              this.text.style.maxHeight = 'none';
              this.text.style.height = '100%';
            }
            // @ts-ignore
            ui.qhly_fixTextSize(this.text);
            var skills = get.character(name, 3);
            var viewSkill = [];
            var derivation = [];
            for (var skill of skills) {
              var info = get.info(skill);
              if (!info || info.nopop || !get.translation(skill + '_info')) {
                continue;
              }
              viewSkill.add(skill);
              if (info.derivation) {
                if (typeof info.derivation === 'string') {
                  viewSkill.add(info.derivation);
                  derivation.add(info.derivation);
                } else {
                  for (var s of info.derivation) {
                    viewSkill.add(s);
                    derivation.add(s);
                  }
                }
              }
            }
            var content = "<br>";
            var pkg = state.pkg;
            if (pkg && pkg.characterTaici) {
              var taici = pkg.characterTaici(name);
              if (taici) {
                for (var key in taici) {
                  var m = taici[key];
                  if (!m || m.hide) continue;
                  if (key != 'die') {
                    viewSkill.add(key);
                  }
                }
                viewSkill.sort(function (a, b) {
                  var orderA = (taici[a] && taici[a].order) ? taici[a].order : Infinity;
                  var orderB = (taici[b] && taici[b].order) ? taici[b].order : Infinity;
                  return orderA - orderB;
                });
              }
            }
            var tempSkill = [];
            if (cplayer && lib.config.qhly_skillingame) {
              // @ts-ignore
              var skills = cplayer.getSkills(false, false);
              for (var tskill of skills) {
                if (viewSkill.includes(tskill)) continue;
                var info = get.info(tskill);
                if (!info) continue;
                if (!lib.translate[tskill]) continue;
                if (info.popup === false) continue;
                if (info.nopop === true) continue;
                viewSkill.add(tskill);
                tempSkill.add(tskill);
              }
            }
            if (currentViewSkin.isQiLayout) {
              content += "<table border='2' frame='void' rules='none'>";
              // @ts-ignore
              for (var skill of viewSkill) {
                if (!lib.translate[skill + "_info"]) continue;
                var detail = get.translation(skill + "_info");
                if (detail) {
                  var cskill = get.translation(skill);
                  content += "<tr>";
                  content += "<td style='text-align:center;";
                  if (cplayer && lib.config.qhly_skillingame) {
                    if (!cplayer.hasSkill(skill)) {
                      content += 'opacity:0.5;'
                    }
                  }
                  // @ts-ignore
                  content += "vertical-align:top;width:100px;height:100px;background-repeat:no-repeat;background-position:top left;background-size:100px 100px;background-image:url(" + lib.qhly_path + get.qhly_getIf(currentViewSkin.skillNameImage, "theme/shuimo/newui_shuimo_skillname.png")+");";
                  content += "color:";
                  if (derivation.includes(skill)) {
                    // @ts-ignore
                    content += get.qhly_getIf(currentViewSkin.skillPageDerivationSkillColor, "#0000ff") + ";";
                  } else if (tempSkill.includes(skill)) {
                    // @ts-ignore
                    content += get.qhly_getIf(currentViewSkin.skillPageTempSkillColor, "#00FF00") + ";";
                  } else {
                    // @ts-ignore
                    content += get.qhly_getIf(currentViewSkin.skillPageSkillNameColor, "#5B0F00") + ";";
                  }
                  if (cskill.length <= 2) {
                    content += 'font-size:30px;';
                    content += 'line-height:' + (lib.config.qhly_hanggaoxiufu ? lib.config.qhly_hanggaoxiufu : '250') + '%;';
                  } else if (cskill.length <= 3) {
                    content += 'font-size:26px;';
                    content += 'line-height:320%;'
                  } else if (cskill.length <= 4) {
                    content += 'font-size:22px;';
                    content += 'line-height:370%;'
                  } else {
                    content += 'font-size:18px;';
                    content += 'line-height:450%;'
                  }
                  content += 'font-family:qh_songhei;';
                  content += "'>";
                  content += cskill;
                  content += "</td>";
                  content += "<td style='vertical-align:top;";
                  if (cplayer && lib.config.qhly_skillingame) {
                    if (!cplayer.hasSkill(skill)) {
                      content += 'opacity:0.5;'
                    }
                  }
                  content += "'>";
                  content += "<img style='width:135px;height:51px;' id='qhly_skillv_" + skill + "'/><br><span ";
                  var dynamicTranslate = null;
                  if (cplayer && lib.config.qhly_skillingame) {
                    var dtrans = lib.dynamicTranslate[skill];
                    if (dtrans) {
                      dtrans = dtrans(cplayer, skill);
                    }
                    // @ts-ignore
                    if (dtrans && lib.qhly_filterPlainText(dtrans) != lib.qhly_filterPlainText(detail)) {
                      dynamicTranslate = dtrans;
                      content += "style='opacity:0.5;text-decoration:line-through;'"
                    } else {
                      if (dtrans && dtrans.length) {
                        detail = dtrans;
                      }
                    }
                  }
                  content += '>';
                  // @ts-ignore
                  content += lib.qhly_keyMark(detail);
                  content += "</span>";
                  if (dynamicTranslate) {
                    content += "<br><br><span style='color:orange;'>";
                    content += dynamicTranslate;
                    content += "</span>";
                  }
                  content += "<br>";
                  var info = get.info(skill);
                  if (info && (info.frequent || info.subfrequent)) {
                    content += "<br>&nbsp;&nbsp;<img style='vertical-align:middle;' id='qhly_autoskill_" + skill + "'/><b id='qhly_autoskill_text_" + skill + "'>自动发动</b>"
                  }
                  content += "<br>"
                  content += "</td>";
                  content += "</tr>";
                }
              }
              content += "</table>";
            } else {
              // @ts-ignore
              for (var skill of viewSkill) {
                if (!lib.translate[skill + "_info"]) continue;
                var detail = get.translation(skill + "_info");
                if (detail) {
                  var skilltitle = get.translation(skill);
                  if (!currentViewSkin.isLolBigLayout) {
                    skilltitle = "【" + skilltitle + "】";
                  } else {
                    var str = "<span style='";
                    str += 'display:flex;justify-content:center;align-items: center;';
                    str += "background-image:url(";
                    // @ts-ignore
                    str += lib.qhly_path + "theme/lolbig/newui_lol_skill_button.png";
                    str += ");";
                    str += 'font-size:15px;';
                    str += 'width:94px;height:24px;text-align:center;'
                    str += 'background-size:100% 100%;';
                    str += "background-repeat:no-repeat;";
                    str += "background-position:center;";
                    str += "' id='qhly_skillv_" + skill + "'";
                    str += ">";
                    str += skilltitle;
                    str += "</span>";
                    skilltitle = str;
                  }
                  content += "<h3";
                  if (derivation.includes(skill)) {
                    // @ts-ignore
                    content += " style='color:" + get.qhly_getIf(currentViewSkin.skillPageDerivationSkillColor, "#0000ff") + ";";
                  } else if (tempSkill.includes(skill)) {
                    // @ts-ignore
                    content += " style='color:" + get.qhly_getIf(currentViewSkin.skillPageDerivationSkillColor, "#00ff00") + ";";
                  } else {
                    // @ts-ignore
                    content += " style='color:" + get.qhly_getIf(currentViewSkin.skillPageSkillNameColor, "#5B0F00") + ";";
                  }
                  if (cplayer && lib.config.qhly_skillingame) {
                    if (!cplayer.hasSkill(skill)) {
                      content += "opacity:0.5;"
                    }
                  }
                  content += "'>";
                  content += skilltitle;
                  if (!currentViewSkin.isLolBigLayout) {
                    content += "<img style='vertical-align:middle;width:35px;' id='qhly_skillv_" + skill + "'/>";
                  }
                  content += "</h3>";
                  content += "<p";
                  content += ">";
                  content += "<span style='";
                  var dynamicTranslate = null;
                  if (cplayer && lib.config.qhly_skillingame) {
                    var dtrans = lib.dynamicTranslate[skill];
                    if (dtrans) {
                      dtrans = dtrans(cplayer, skill);
                    }
                    // @ts-ignore
                    if (dtrans && lib.qhly_filterPlainText(dtrans) != lib.qhly_filterPlainText(detail)) {
                      dynamicTranslate = dtrans;
                      content += "opacity:0.5;text-decoration:line-through;"
                    } else {
                      if (dtrans && dtrans.length) {
                        detail = dtrans;
                      }
                    }
                    if (!cplayer.hasSkill(skill)) {
                      content += "opacity:0.5;"
                    }
                  }
                  content += "'>";
                  // @ts-ignore
                  content += lib.qhly_keyMark(detail);
                  content += "</span>";
                  if (dynamicTranslate) {
                    content += "<br><br><span style='color:orange;'>";
                    content += dynamicTranslate;
                    content += "</span>";
                  }
                  var info = get.info(skill);
                  if (info && (info.frequent || info.subfrequent)) {
                    content += "<br>&nbsp;&nbsp;<img style='vertical-align:middle;' id='qhly_autoskill_" + skill + "'/><b id='qhly_autoskill_text_" + skill + "'>自动发动</b>"
                  }
                  content += "</p>";
                }
              }
            }
            content += "<br><br><br><br><br><br>";
            this.text.innerHTML = content;

            var bindFunc = function (checkbox, text) {
              if (!text) return;
              // @ts-ignore
              ui.qhly_addListenFunc(text);
              text.listen(function () {
                // @ts-ignore
                game.qhly_playQhlyAudio('qhly_voc_check', null, true);
                checkbox.qhly_setChecked(!checkbox.qhly_checked, true);
              });
            };
            // @ts-ignore
            for (var skill of viewSkill) {
              var detail = get.translation(skill + "_info");
              if (detail) {
                (function (skill) {
                  var img = document.getElementById('qhly_skillv_' + skill);
                  if (img) {
                    // @ts-ignore
                    img.src = lib.assetURL + get.qhly_getCurrentViewSkinValue('skillPagePlayAudioButtonImage', 'extension/千幻聆音/image/newui_playaudio.png');
                    // @ts-ignore
                    ui.qhly_addListenFunc(img);
                    // @ts-ignore
                    img.listen(function () {
                      // @ts-ignore
                      var count = _status.qhly_skillAudioWhich[skill];
                      if (!count) {
                        // @ts-ignore
                        _status.qhly_skillAudioWhich[skill] = 0;
                        count = 0;
                      }
                      // @ts-ignore
                      _status.qhly_skillAudioWhich[skill]++;
                      // @ts-ignore
                      window.qhly_TrySkillAudio(skill, { name: name }, null, count);
                      // @ts-ignore
                      var skillSkin = game.qhly_getSkillSkin(name, game.qhly_getSkin(name), skill);
                      if (skillSkin) {
                        if (skillSkin === 1) {
                          subView.avatarImage.setBackground(name, 'character');
                        } else if (Array.isArray(skillSkin)) {
                          subView.avatarImage.setBackgroundImage(skillSkin[count % skillSkin.length]);
                        } else {
                          subView.avatarImage.setBackgroundImage(skillSkin);
                        }
                      }
                    });
                  }
                  var check = document.getElementById('qhly_autoskill_' + skill);
                  if (check) {
                    var list = [];
                    var info = get.info(skill);
                    if (info.frequent) {
                      list.add(skill);
                    }
                    if (info.subfrequent) {
                      for (var sub of info.subfrequent) {
                        list.add(skill + "_" + sub);
                      }
                    }
                    // @ts-ignore
                    ui.qhly_initCheckBox(check, list.filter(function (sk) {
                      return !lib.config.autoskilllist || !lib.config.autoskilllist.includes(sk);
                    }).length != 0);
                    bindFunc(check, document.getElementById('qhly_autoskill_text_' + skill));
                    // @ts-ignore
                    check.qhly_onchecked = function (checked) {
                      var list = [];
                      var info = get.info(skill);
                      if (info.frequent) {
                        list.add(skill);
                      }
                      if (info.subfrequent) {
                        for (var sub of info.subfrequent) {
                          list.add(skill + "_" + sub);
                        }
                      }
                      if (!lib.config.autoskilllist) {
                        lib.config.autoskilllist = [];
                      }
                      if (!checked) {
                        for (var s of list) {
                          lib.config.autoskilllist.add(s);
                        }
                      } else {
                        for (var s of list) {
                          lib.config.autoskilllist.remove(s);
                        }
                      }
                      game.saveConfig('autoskilllist', lib.config.autoskilllist);
                    };
                  }
                })(skill);
              }
            }
            // @ts-ignore
            game.qhly_changeViewPageSkin('skill', this.pageView);
            this.inited = true;
          }
        },
        skin: {
          pageView: ui.create.div('.qh-page-skin', view),
          skinList: [],
          currentIndex: 0,
          skinListGot: false,
          firstRefresh: true,
          hideSkinMode: false,
          getCurrentSkin: function (name) {
            // @ts-ignore
            var skinId = game.qhly_getSkin(name);
            for (var skin of this.skinList) {
              // @ts-ignore
              if (skin && skin.skinId == skinId) {
                return skin;
              }
              // @ts-ignore
              if (!skinId && !skin.skinId) {
                return skin;
              }
            }
            return null;
          },
          getSkinAt: function (num) {
            return this.skinList[num + this.currentIndex];
          },
          onClickSkin: function (num, name, state) {
            var that = this;
            var skin = this.getSkinAt(num);
            if (!skin) {
              return;
            }
            // @ts-ignore
            if (skin.skinId == game.qhly_getSkin(name)) {
              return;
            }
            // @ts-ignore
            if (game.qhly_skinLock(name, skin.skinId)) {
              // @ts-ignore
              var lock = game.qhly_skinLock(name, skin.skinId);
              if (lock.tryUnlock) {
                lock.tryUnlock();
              }
              // @ts-ignore
              if (game.qhly_skinLock(name, skin.skinId)) {
                return;
              }
            }
            // @ts-ignore
            game.qhly_playQhlyAudio('qhly_voc_fanshu', null, true);
            // @ts-ignore
            game.qhly_setCurrentSkin(name, skin.skinId, function () {
              // @ts-ignore
              _status.qhly_skillAudioWhich = {};
              if (currentViewSkin.isLolBigLayout) {
                that.currentIndex = that.currentIndex + num - 1;
              }
              this.refresh(name, state);
              if (state.onChangeSkin) {
                state.onChangeSkin();
              }
              if ((currentViewSkin.lihuiSupport) && state.pkg.characterLihui) {
                var lihuiPath = state.pkg.characterLihui(name, lib.config.qhly_skinset.skin[name]);
                if (lihuiPath) {
                  state.mainView.avatarImage.setBackgroundImage(lihuiPath);
                  state.useLihuiLayout(true);
                } else {
                  state.mainView.avatarImage.setBackground(name, 'character');
                  state.useLihuiLayout(false);
                }
              } else {
                state.mainView.avatarImage.setBackground(name, 'character');
              }
            }.bind(this), true);
          },
          canViewSkin: function (skinId) {
            for (var i = 0; i < 3; i++) {
              var skin = this.getSkinAt(i);
              if (skin) {
                if (skin.skinId) {
                  if (skin.skinId == skinId) {
                    return true;
                  }
                } else {
                  if (!skinId) {
                    return true;
                  }
                }
              }
            }
            return false;
          },
          refresh: function (name, state, forced) {
            if (!this.inited) this.init(name, state);
            if (this.skinListGot && !forced) {
              this.refreshAfterGot(name, state);
            } else {
              // @ts-ignore
              // @ts-ignore
              // @ts-ignore
              game.qhly_getSkinList(name, function (ret, list) {
                this.afterGetSkinList(list, name, state);
                this.refreshAfterGot(name, state);
              }.bind(this), true, true);
            }
          },
          packObject: function (name, state) {
            var packObj = {
              name: name,
              origin: {
                skill: {

                },
              },
              skin: {

              }
            };
            for (var skin of this.skinList) {
              // @ts-ignore
              if (!skin.skinId) {
                // @ts-ignore
                var taici = game.qhly_getCharacterTaici(name, null, state.pkg);
                if (taici) {
                  packObj.origin.skill = taici;
                }
              } else {
                // @ts-ignore
                var skinInfo = game.qhly_getSkinInfo(name, skin.skinId, state.pkg);
                if (skinInfo) {
                  // @ts-ignore
                  packObj.skin[game.qhly_earse_ext(skin.skinId)] = skinInfo;
                }
              }
            }
            return packObj;
          },
          editOpen: function (name, skin, skill, state) {
            var obj = this.packObject(name, state);
            var title = "台词编辑";
            var detail = "编辑【" + ((skill == 'die') ? "阵亡" : get.translation(skill)) + "】的台词：";
            var initValue = "";
            if (skin) {
              // @ts-ignore
              var skinInfo = obj.skin[game.qhly_earseExt(skin)];
              if (skinInfo && skinInfo.skill) {
                if (skinInfo.skill[skill] && skinInfo.skill[skill].content) {
                  initValue = skinInfo.skill[skill].content;
                }
              }
            } else {
              var sskill = obj.origin.skill;
              if (sskill[skill] && sskill[skill].content) {
                initValue = sskill[skill].content;
              }
            }
            var that = this;
            // @ts-ignore
            game.qhly_editDialog(title, detail, initValue, function (value, dialog) {
              if (!value) value = "";
              while (value.indexOf("/") >= 0) {
                value = value.replace("/", "<br>");
              }
              if (skin) {
                // @ts-ignore
                var m = obj.skin[game.qhly_earseExt(skin)];
                if (m) {
                  if (!m.skill) m.skill = {};
                  if (!m.skill[skill]) {
                    m.skill[skill] = {};
                  }
                  m.skill[skill].content = value;
                }
              } else {
                if (!obj.origin.skill[skill]) {
                  obj.origin.skill[skill] = { content: '' };
                }
                obj.origin.skill[skill].content = value;
              }
              var strobj = JSON.stringify(obj, null, 4);
              // @ts-ignore
              game.qhly_readFileAsText("extension/千幻聆音/data/skininfomodel.txt", function (ret, str) {
                if (ret) {
                  str = str.replace("_REPLACE_OBJECT_", strobj);
                  // @ts-ignore
                  var path = game.qhly_getSkinImagePath(name, state.pkg);
                  // @ts-ignore
                  game.qhly_writeTextFile(str, path + name, "skininfo.js", function (err) {
                    if (!err) {
                      alert("保存成功");
                      // @ts-ignore
                      lib.qhly_dirskininfo[name] = obj;
                      that.refresh(name, state, true);
                      dialog.delete();
                    } else {
                      alert("保存失败：" + JSON.stringify(err));
                    }
                  });
                } else {
                  alert("保存失败：无法读取模板。");
                }
              });
            // @ts-ignore
            // @ts-ignore
            // @ts-ignore
            }, function (dialog) {
              return true;
            });
          },
          refreshAfterGot: function (name, state) {
            var that = this;
            if (this.firstRefresh) {
              var ret = false;
              for (var i = (currentViewSkin.isLolBigLayout ? -1 : 0); i < this.skinList.length; i++) {
                // @ts-ignore
                // @ts-ignore
                // @ts-ignore
                var skin = this.skinList[i];
                this.currentIndex = i;
                // @ts-ignore
                if (this.canViewSkin(game.qhly_getSkin(name))) {
                  if (currentViewSkin.isLolBigLayout) {
                    for (var j = 0; j < 3; j++) {
                      var skinAt = this.getSkinAt(j);
                      // @ts-ignore
                      if (skinAt && skinAt.skinId == game.qhly_getSkin(name)) {
                        this.currentIndex = i + j - 1;
                      }
                    }
                  }
                  ret = true;
                  break;
                }
              }
              if (!ret) {
                this.currentIndex = 0;
                // @ts-ignore
                game.qhly_setCurrentSkin(name, null, undefined, true);
              }
              this.firstRefresh = false;
            }
            if (!this.hideSkinMode) {
              for (var v of this.skinViews) {
                v.show();
              }
              if (currentViewSkin.isLolBigLayout) {
                this.text.style.height = "70%";
              }
              else if (currentViewSkin.isQiLayout) {
                this.text.style.height = "63.61%";
              } else {
                this.text.style.height = "56.13%";
              }
              if (currentViewSkin.isLolBigLayout) {
                if (!this.getSkinAt(0)) {
                  this.leftArrow.hide();
                } else {
                  this.leftArrow.show();
                }
              } else if (this.currentIndex <= 0) {
                this.leftArrow.hide();
              } else {
                this.leftArrow.show();
              }
              if (currentViewSkin.isLolBigLayout) {
                if (!this.getSkinAt(2)) {
                  this.rightArrow.hide();
                } else {
                  this.rightArrow.show();
                }
              } else if (this.currentIndex + 3 < this.skinList.length) {
                this.rightArrow.show();
              } else {
                this.rightArrow.hide();
              }
              // @ts-ignore
              var currentSkin = game.qhly_getSkin(name);
              for (var i = 0; i < 3; i++) {
                var currentSkinView = this['skin' + (i + 1)];
                var levelView = this['skinLevel' + (i + 1)];
                if (this.getSkinAt(i)) {
                  if (currentViewSkin.isLolBigLayout) {
                    currentSkinView.qhBoard.show();
                  }
                  // @ts-ignore
                  var skinId = this.getSkinAt(i).skinId;
                  // @ts-ignore
                  if (game.qhly_skinLock(name, skinId)) {
                    currentSkinView.qh_setLock(true);
                    currentSkinView.style.filter = "grayscale(100%)";
                  } else {
                    currentSkinView.qh_setLock(false);
                    currentSkinView.style.filter = "grayscale(0%)";
                  }
                  if (skinId) {
                    // @ts-ignore
                    currentSkinView.setBackgroundImage(game.qhly_getSkinFile(name, this.getSkinAt(i).skinId));
                  } else {
                    currentSkinView.setBackground(name, 'character');
                  }
                  currentSkinView.show();
                  if (currentViewSkin.isQiLayout) {
                    // @ts-ignore
                    if (currentSkin == this.getSkinAt(i).skinId) {
                      currentSkinView.qhBoard.setBackgroundImage('extension/千幻聆音/theme/shuimo/newui_skin_background_shuimo.png');
                      currentSkinView.qhBoard.style.zIndex = 33;
                      currentSkinView.qhBoard.style.filter = "saturate(100%)";
                      currentSkinView.qhTitle.show();
                      var cskin = this.getSkinAt(i);
                      var tname = cskin.skinId;
                      if (!tname) {
                        tname = "初始皮肤";
                      } else if (cskin.skinInfo.translation) {
                        tname = cskin.skinInfo.translation;
                      } else {
                        tname = get.translation(cskin.skinId);
                      }
                      currentSkinView.qhTitle.qhText.innerHTML = tname;
                    } else {
                      currentSkinView.qhBoard.setBackgroundImage('');
                      currentSkinView.qhBoard.style.zIndex = 34;
                      currentSkinView.qhBoard.style.filter = "saturate(50%)";
                      currentSkinView.qhTitle.hide();
                    }
                  } else if (currentViewSkin.isLolBigLayout) {

                  } else {
                    // @ts-ignore
                    if (currentSkin == this.getSkinAt(i).skinId) {
                      currentSkinView.qhCover.classList.add('selected');
                      currentSkinView.style.zIndex = 33;
                    } else {
                      currentSkinView.qhCover.classList.remove('selected');
                      currentSkinView.style.zIndex = 34;
                    }
                  }
                  // @ts-ignore
                  var level = this.getSkinAt(i).skinInfo.level;
                  // @ts-ignore
                  var style = this.getSkinAt(i).skinInfo.levelStyle;
                  if (style) {
                    if (!levelView.qh_savedStyle) {
                      levelView.qh_savedStyle = {};
                      for (var m in levelView.style) {
                        levelView.qh_savedStyle[m] = levelView.style[m];
                      }
                    }
                    for (var s in style) {
                      levelView.style[s] = style[s];
                    }
                    var es = ['left', 'bottom', 'top', 'right'];
                    for (var m of es) {
                      if (!style[m]) {
                        levelView.style[m] = "";
                      }
                    }
                  } else {
                    if (levelView.qh_savedStyle) {
                      for (var m in levelView.qh_savedStyle) {
                        levelView.style[m] = levelView.qh_savedStyle[m];
                      }
                    }
                  }
                  // @ts-ignore
                  if (this.getSkinAt(i).skinId) {
                    // @ts-ignore
                    if (lib.qhly_level[name + '_' + this.getSkinAt(i).skinId]) {
                      // @ts-ignore
                      level = lib.qhly_level[name + '_' + this.getSkinAt(i).skinId];
                    }
                  }
                  if (level) {
                    var map = {
                      '普通': 'putong',
                      '精品': 'jingpin',
                      '史诗': 'shishi',
                      '传说': 'chuanshuo',
                      '限定': 'xianding',
                    };
                    var img = null;
                    if (map[level]) {
                      img = "extension/千幻聆音/image/level_" + map[level] + ".png";
                    } else if (level.indexOf("#") == 0) {
                      var l2 = level.replace("#", "");
                      img = "extension/千幻聆音/image/" + l2 + ".png";
                    } else if (level.indexOf("$") == 0) {
                      var l2 = level.replace("$", "");
                      img = l2;
                    }
                    if (img) {
                      levelView.show();
                      levelView.setBackgroundImage(img);
                    } else {
                      levelView.hide();
                    }
                  } else {
                    levelView.hide();
                  }
                } else {
                  currentSkinView.hide();
                  levelView.hide();
                  if (currentViewSkin.isLolBigLayout) {
                    currentSkinView.qhBoard.hide();
                  }
                }
              }
            } else {
              for (var v of this.skinViews) {
                v.hide();
              }
              if (currentViewSkin.isLolBigLayout) {
                this.text.style.height = "70%";
              } else {
                this.text.style.height = "100%";
              }
            }
            var content = "<br>";
            var currentSkin = this.getCurrentSkin(name);
            if (!currentSkin) {
              return;
            }
            var tname = currentSkin.skinId;
            if (!tname) {
              tname = "原始皮肤";
            } else if (currentSkin.skinInfo.translation) {
              tname = currentSkin.skinInfo.translation;
            } else {
              tname = get.translation(currentSkin.skinId);
            }
            if (this.skinName) {
              this.skinName.innerHTML = tname;
            }
            if (!currentViewSkin.isQiLayout && !currentViewSkin.isLolBigLayout) {
              // @ts-ignore
              content += "<h2 style='color:" + get.qhly_getIf(currentViewSkin.skinPageHeadTitleColor, "#783f04") + "'>皮肤名称：<span style='color:" + get.qhly_getIf(currentViewSkin.skinPageHeadSkinNameColor, "black") + "'>" + tname + "</span></h2>";
            }
            var extInfo = "";
            if (currentSkin.skinInfo.info) {
              extInfo = "<h3>" + currentSkin.skinInfo.info + "</h3>";
            } else {
              if (state.pkg && state.pkg.originSkinInfo) {
                // @ts-ignore
                var i = state.pkg.originSkinInfo(name);
                if (i) {
                  extInfo = "<h3>" + i + "</h3>";
                }
              }
            }
            if (!currentViewSkin.isQiLayout && !currentViewSkin.isLolBigLayout) {
              content += extInfo;
            }
            var addButton = [];
            // @ts-ignore
            var Vicpath = `${state.pkg.audio}${game.qhly_getRealName(name)}/`;
            // @ts-ignore
            if (game.qhly_getSkin(name)) Vicpath += `${game.qhly_earse_ext(game.qhly_getSkin(name))}/`;
            if (currentViewSkin.isQiLayout) {
              content += "<table border='2' frame='void' rules='none'>";
              for (var audio of currentSkin.audios) {
                // @ts-ignore
                if (audio.id == 'victory' && !game.thunderFileExist(lib.assetURL + Vicpath + 'victory.mp3')) continue;
                content += "<tr>";
                content += "<td style='";
                // @ts-ignore
                content += "text-align:center;vertical-align:top;width:100px;height:100px;background-repeat:no-repeat;background-position:top left;background-size:100px 100px;background-image:url(" + lib.qhly_path + get.qhly_getIf(currentViewSkin.skillNameImage, "theme/shuimo/newui_shuimo_skillname.png")+");";
                if (audio.id == 'die') {
                  content += "color:#ff0000;";
                } else if (audio.id == 'victory') {
                  content += "color:#ffea34;";
                } else {
                  // @ts-ignore
                  content += "color:" + get.qhly_getIf(currentViewSkin.skinPageSkillNameColor, "#4169E1") + ";";
                }
                var cskill;
                if (audio.name) {
                  cskill = audio.name;
                } else {
                  cskill = get.translation(audio.id);
                }
                if (cskill.length <= 2) {
                  content += 'font-size:30px;';
                  content += 'line-height:' + (lib.config.qhly_hanggaoxiufu ? lib.config.qhly_hanggaoxiufu : '250') + '%;';
                } else if (cskill.length <= 3) {
                  content += 'font-size:26px;';
                  content += 'line-height:320%;'
                } else if (cskill.length <= 4) {
                  content += 'font-size:22px;';
                  content += 'line-height:370%;'
                } else {
                  content += 'font-size:18px;';
                  content += 'line-height:450%;'
                }
                content += 'font-family:qh_songhei;';
                content += "'>";
                content += cskill;
                content += "</td>";

                content += "<td>";
                // @ts-ignore
                content += "<img src='" + lib.assetURL + get.qhly_getCurrentViewSkinValue('skinPagePlayAudioButtonImage', 'extension/千幻聆音/image/qhly_pic_playaudiobutton.png') + "' style='height:40px;' id='qhly_skin_skill_" + audio.id + "'/>"
                // @ts-ignore
                if (lib.config.qhly_editmode && !game.qhly_isForbidEditTaici(name)) {
                  // @ts-ignore
                  content += "<img src='" + lib.qhly_path + "image/qhly_editButton.png' style='height:25px;width:25px;'";
                  content += " id='qhly_skin_skill_edit_" + audio.id + "'";
                  content += "/>";
                }
                content += "<br>";
                addButton.push(audio.id);
                if (audio.content) {
                  var sc = audio.content;
                  content += sc;
                }
                content += "<br></td>";
                content += "</tr>";
              }
              content += "</table>";
            } else {
              for (var audio of currentSkin.audios) {
                // @ts-ignore
                if (audio.id == 'victory' && !game.thunderFileExist(lib.assetURL + Vicpath + 'victory.mp3')) continue;
                if (audio.id == 'die') {
                  content += "<h3 style='color:#ff0000'>【";
                } else if (audio.id == 'victory') {
                  content += "<h3 style='color:#ffea34'>【";
                } else {
                  // @ts-ignore
                  content += "<h3 style='color:" + get.qhly_getIf(currentViewSkin.skinPageSkillNameColor, "#4169E1") + "'>【";
                }
                if (audio.name) {
                  content += audio.name;
                } else {
                  content += get.translation(audio.id);
                }
                content += "】"
                // @ts-ignore
                content += "&nbsp;&nbsp;&nbsp;<img src='" + lib.assetURL + get.qhly_getCurrentViewSkinValue('skinPagePlayAudioButtonImage', 'extension/千幻聆音/image/qhly_pic_playaudiobutton.png') + "' style='height:23px;vertical-align:middle;' id='qhly_skin_skill_" + audio.id + "'/>"
                // @ts-ignore
                if (lib.config.qhly_editmode && !game.qhly_isForbidEditTaici(name)) {
                  // @ts-ignore
                  content += "<img src='" + lib.qhly_path + "image/qhly_editButton.png' style='height:25px;width:25px;'";
                  content += " id='qhly_skin_skill_edit_" + audio.id + "'";
                  content += "/>";
                }
                content += "</h3>"
                addButton.push(audio.id);
                if (audio.content) {
                  content += "<p>";
                  content += audio.content;
                  content += "</p>";
                }
              }
            }
            if (currentViewSkin.isQiLayout || currentViewSkin.isLolBigLayout) {
              content += extInfo;
            }
            content += "<br><br>";
            if (lib.config.qhly_skinconfig) {
              content += "<h2>皮肤配置</h2>";
              content += "<p><span style='display:inline-block;height:30px;'><span id='qhconfig_checkbox_banInRandom_text' style='display:inline-block;position:relative;bottom:25%;'>随机切换禁用&nbsp;&nbsp;</span><img id='qhconfig_checkbox_banInRandom'/></span></p><br>";
              if (currentSkin.skinId) {
                content += "<p><span>皮肤品质&nbsp;&nbsp;</span><select style='font-size:22px;font-family:'qh_youyuan';' id='qhconfig_level_select'></select></p>";
                content += "<p><span>皮肤顺序&nbsp;&nbsp;</span><select style='font-size:22px;font-family:'qh_youyuan';' id='qhconfig_order_select'></select></p>";
                //content += "<p><span>语音重定向&nbsp;&nbsp;</span><select style='font-size:22px;font-family:'qh_youyuan';' id='qhconfig_audio_redirect_select'></select></p>";
              }
              content += "<br><br>";
            }
            content += "<br><br>";
            this.text.innerHTML = content;
            if (lib.config.qhly_skinconfig) {
              if (currentSkin.skinId) {
                var levelSelect = document.getElementById('qhconfig_level_select');
                var opt = document.createElement('option');
                opt.innerHTML = "默认";
                opt.setAttribute('name', 'default');
                // @ts-ignore
                levelSelect.appendChild(opt);
                var levels = ['普通', '精品', '史诗', '传说', '限定'];
                var map = {
                  '普通': 'putong',
                  '精品': 'jingpin',
                  '史诗': 'shishi',
                  '传说': 'chuanshuo',
                  '限定': 'xianding',
                };
                // @ts-ignore
                if (!lib.qhly_level[name + '_' + currentSkin.skinId]) {
                  // @ts-ignore
                  opt.selected = 'selected';
                }
                for (var l of levels) {
                  var opt = document.createElement('option');
                  opt.innerHTML = l;
                  opt.setAttribute('name', l);
                  // @ts-ignore
                  if (lib.qhly_level[name + '_' + currentSkin.skinId] == l) {
                    // @ts-ignore
                    opt.selected = 'selected';
                  }
                  // @ts-ignore
                  levelSelect.appendChild(opt);
                }
                // @ts-ignore
                levelSelect.onchange = function (e) {
                  var event = e ? e : window.event;
                  // @ts-ignore
                  if (event.target) {
                    // @ts-ignore
                    target = event.target;
                    // @ts-ignore
                    var opt = target[target.selectedIndex];
                    if (opt) {
                      var l = opt.getAttribute('name');
                      if (l == 'default') {
                        // @ts-ignore
                        delete lib.qhly_level[name + '_' + currentSkin.skinId];
                        // @ts-ignore
                        game.saveConfig('qhly_level', lib.qhly_level);
                        return;
                      }
                      var lm = map[l];
                      if (lm) {
                        // @ts-ignore
                        lib.qhly_level[name + '_' + currentSkin.skinId] = l;
                        // @ts-ignore
                        game.saveConfig('qhly_level', lib.qhly_level);
                      }
                    }
                  }
                };

                var orderSelect = document.getElementById('qhconfig_order_select');
                var opt = document.createElement('option');
                opt.innerHTML = "默认";
                opt.setAttribute('order', 'default');
                // @ts-ignore
                orderSelect.appendChild(opt);
                if (lib.config.qhly_order[name + '-' + currentSkin.skinId] === undefined) {
                  // @ts-ignore
                  opt.selected = 'selected';
                }
                for (var i = 0; i < 50; i++) {
                  var opt = document.createElement('option');
                  opt.innerHTML = "" + i;
                  // @ts-ignore
                  opt.setAttribute('order', i);
                  if (lib.config.qhly_order[name + '-' + currentSkin.skinId] == i) {
                    // @ts-ignore
                    opt.selected = 'selected';
                  }
                  // @ts-ignore
                  orderSelect.appendChild(opt);
                }
                // @ts-ignore
                orderSelect.onchange = function (e) {
                  var event = e ? e : window.event;
                  // @ts-ignore
                  if (event.target) {
                    // @ts-ignore
                    target = event.target;
                    // @ts-ignore
                    var opt = target[target.selectedIndex];
                    if (opt) {
                      var o = opt.getAttribute('order');
                      if (o == 'default') {
                        // @ts-ignore
                        game.qhly_setOrder(name, currentSkin.skinId);
                      } else {
                        // @ts-ignore
                        game.qhly_setOrder(name, currentSkin.skinId, o);
                      }
                    }
                  }
                };

              }
              var banInRandomCheckbox = document.getElementById('qhconfig_checkbox_banInRandom');
              var bindFunc = function (checkbox, text) {
                if (!text) return;
                // @ts-ignore
                ui.qhly_addListenFunc(text);
                text.listen(function () {
                  // @ts-ignore
                  game.qhly_playQhlyAudio('qhly_voc_check', null, true);
                  checkbox.qhly_setChecked(!checkbox.qhly_checked, true);
                });
              };
              // @ts-ignore
              ui.qhly_initCheckBox(banInRandomCheckbox, game.qhly_skinIsBanned(name, currentSkin.skinId));
              bindFunc(banInRandomCheckbox, document.getElementById('qhconfig_checkbox_banInRandom_text'));
              // @ts-ignore
              banInRandomCheckbox.qhly_onchecked = function (checked) {
                // @ts-ignore
                game.qhly_banSkin(name, currentSkin.skinId, checked);
              };
            }
            for (var vid of addButton) {
              // @ts-ignore
              var img = document.getElementById('qhly_skin_skill_' + vid);
              if (img) {
                // @ts-ignore
                ui.qhly_addListenFunc(img);
                var that = this;
                (function (id) {
                  // @ts-ignore
                  img.listen(function () {
                    that.consumeTextClick = true;
                    // @ts-ignore
                    if (id == 'die') window.qhly_playDieAudio(name);
                    // @ts-ignore
                    else if (id == 'victory') window.qhly_playVictoryAudio(name);
                    else {
                      // @ts-ignore
                      var count = _status.qhly_skillAudioWhich[id];
                      if (!count) {
                        // @ts-ignore
                        _status.qhly_skillAudioWhich[id] = 0;
                        count = 0;
                      }
                      // @ts-ignore
                      _status.qhly_skillAudioWhich[id]++;
                      // @ts-ignore
                      window.qhly_TrySkillAudio(id, { name: name }, null, count);
                      // @ts-ignore
                      var skillSkin = game.qhly_getSkillSkin(name, game.qhly_getSkin(name), id);
                      if (skillSkin) {
                        if (skillSkin === 1) {
                          subView.avatarImage.setBackground(name, 'character');
                        } else if (Array.isArray(skillSkin)) {
                          subView.avatarImage.setBackgroundImage(skillSkin[count % skillSkin.length]);
                        } else {
                          subView.avatarImage.setBackgroundImage(skillSkin);
                        }
                      }
                    }
                  });
                })(vid);
              }
              // @ts-ignore
              if (lib.config.qhly_editmode && !game.qhly_isForbidEditTaici(name)) {
                var imgEdit = document.getElementById('qhly_skin_skill_edit_' + vid);
                if (imgEdit) {
                  // @ts-ignore
                  ui.qhly_addListenFunc(imgEdit);
                  (function (id) {
                    // @ts-ignore
                    imgEdit.listen(function () {
                      that.editOpen(name, currentSkin.skinId, id, state);
                    });
                  })(vid);
                }
              }
            }
          },
          afterGetSkinList: function (list, name, state) {
            var retList = [];
            if (list) {
              for (var skin of list) {
                // @ts-ignore
                var info = game.qhly_getSkinInfo(name, skin, state.pkg);
                var obj = {
                  order: info.order,
                  skinId: skin,
                  skinInfo: info,
                  // @ts-ignore
                  audios: get.qhly_getAudioInfoInSkin(name, state.pkg, skin),
                };
                retList.push(obj);
              }
            }
            this.skinList = [];
            // @ts-ignore
            this.skinList.push({
              skinId: null,
              // @ts-ignore
              skinInfo: game.qhly_getSkinInfo(name, null, state.pkg),
              // @ts-ignore
              audios: get.qhly_getAudioInfoInSkin(name, state.pkg, null),
            });
            retList.sort(function (a, b) {
              // @ts-ignore
              var orderA = game.qhly_getOrder(name, a.skinId, state.pkg);
              // @ts-ignore
              var orderB = game.qhly_getOrder(name, b.skinId, state.pkg);
              if (orderA > orderB) return 1;
              if (orderA == orderB) return 0;
              return -1;
            });
            for (var r of retList) {
              // @ts-ignore
              this.skinList.push(r);
            }
            this.skinListGot = true;
          },
          init: function (name, state) {
            this.text = ui.create.div('.qh-page-skin-text', this.pageView);
            lib.setScroll(this.text);
            // @ts-ignore
            ui.qhly_fixTextSize(this.text);
            if (currentViewSkin.isLolBigLayout) {
              this.skinName = ui.create.div('.qh-page-skin-name', this.pageView);
            }
            this.skinBoard1 = ui.create.div('.qh-page-skinavatar1', this.pageView);
            this.skinBoard2 = ui.create.div('.qh-page-skinavatar2', this.pageView);
            this.skinBoard3 = ui.create.div('.qh-page-skinavatar3', this.pageView);
            this.skinCover1 = ui.create.div('.qh-page-skinavatarcover', this.skinBoard1);
            this.skinCover2 = ui.create.div('.qh-page-skinavatarcover', this.skinBoard2);
            this.skinCover3 = ui.create.div('.qh-page-skinavatarcover', this.skinBoard3);
            this.skin1 = ui.create.div('.qh-page-skinavatarpicture', this.skinCover1);
            this.skin1.classList.add('avatar');
            this.skin1.qhCover = this.skinCover1;
            this.skin1.qhBoard = this.skinBoard1;
            this.skin2 = ui.create.div('.qh-page-skinavatarpicture', this.skinCover2);
            this.skin2.qhCover = this.skinCover2;
            this.skin2.qhBoard = this.skinBoard2;
            this.skin2.classList.add('avatar');
            this.skin3 = ui.create.div('.qh-page-skinavatarpicture', this.skinCover3);
            this.skin3.qhCover = this.skinCover3;
            this.skin3.qhBoard = this.skinBoard3;
            this.skin3.classList.add('avatar');

            var setLock = function (m) {
              if (m) {
                if (!this.qhCover.skinLock) {
                  this.qhCover.skinLock = ui.create.div('.qh-lock', this.qhCover);
                }
                this.qhCover.skinLock.show();
              } else {
                if (this.qhCover.skinLock) {
                  this.qhCover.skinLock.hide();
                }
              }
            };

            this.skin1.qh_setLock = setLock;
            this.skin2.qh_setLock = setLock;
            this.skin3.qh_setLock = setLock;

            if (state.pkg.isLutou || lib.config.qhly_lutou) {
              for (var i = 1; i <= 3; i++) {
                var v = this['skin' + i];
                v.classList.remove('qh-page-skinavatarpicture');
                v.classList.add('qh-page-skinavatarpicture-lutou');
              }
            } else {
              for (var i = 1; i <= 3; i++) {
                var v = this['skin' + i];
                v.classList.remove('qh-page-skinavatarpicture-lutou');
                v.classList.add('qh-page-skinavatarpicture');
              }
            }
            this.skinLevel1 = ui.create.div('.qh-page-skinavatarlevel', this.skinBoard1);
            this.skinLevel2 = ui.create.div('.qh-page-skinavatarlevel', this.skinBoard2);
            this.skinLevel3 = ui.create.div('.qh-page-skinavatarlevel', this.skinBoard3);
            this.skinLevel1.style.pointerEvents = 'none';
            this.skinLevel2.style.pointerEvents = 'none';
            this.skinLevel3.style.pointerEvents = 'none';

            this.skin1.classList.add('qh-not-replace');
            this.skin2.classList.add('qh-not-replace');
            this.skin3.classList.add('qh-not-replace');
            if (currentViewSkin.isQiLayout) {
              this.skinTitle1 = ui.create.div('.qh-page-skinavatartitle', this.skinCover1);
              this.skinTitle1.qhText = ui.create.div('.qh-page-skinavatartitle-text', this.skinTitle1);
              this.skinTitle2 = ui.create.div('.qh-page-skinavatartitle', this.skinCover2);
              this.skinTitle2.qhText = ui.create.div('.qh-page-skinavatartitle-text', this.skinTitle2);
              this.skinTitle3 = ui.create.div('.qh-page-skinavatartitle', this.skinCover3);
              this.skinTitle3.qhText = ui.create.div('.qh-page-skinavatartitle-text', this.skinTitle3);
              this.skin1.qhTitle = this.skinTitle1;
              this.skin2.qhTitle = this.skinTitle2;
              this.skin3.qhTitle = this.skinTitle3;
              this.skinTitle1.hide();
              this.skinTitle2.hide();
              this.skinTitle3.hide();
            }
            var that = this;
            this.skin1.listen(function () {
              that.onClickSkin(0, name, state);
            });
            this.skin2.listen(function () {
              that.onClickSkin(1, name, state);
            });
            this.skin3.listen(function () {
              that.onClickSkin(2, name, state);
            });
            this.leftArrow = ui.create.div('.qh-page-skin-leftarrow', this.pageView);
            this.rightArrow = ui.create.div('.qh-page-skin-rightarrow', this.pageView);
            this.leftArrow.listen(function () {
              if (currentViewSkin.isLolBigLayout) {
                if (that.getSkinAt(0)) {
                  that.onClickSkin(0, name, state);
                }
              } else if (that.currentIndex > 0) {
                that.currentIndex--;
                that.refresh(name, state);
                // @ts-ignore
                game.qhly_playQhlyAudio('qhly_voc_press', null, true);
              }
            });
            this.rightArrow.listen(function () {
              if (currentViewSkin.isLolBigLayout) {
                if (that.getSkinAt(2)) {
                  that.onClickSkin(2, name, state);
                }
              } else if (that.currentIndex < that.skinList.length) {
                that.currentIndex++;
                that.refresh(name, state);
                // @ts-ignore
                game.qhly_playQhlyAudio('qhly_voc_press', null, true);
              }
            });
            this.skinViews = [this.skinBoard1, this.skinBoard2, this.skinBoard3, this.skin1, this.skin2, this.skin3, this.leftArrow, this.rightArrow];
            this.hideButton = ui.create.div('.qh-hide-skin-button', this.pageView);
            this.hideButton.listen(function () {
              that.hideSkinMode = !that.hideSkinMode;
              that.refresh(name, state);
              // @ts-ignore
              game.qhly_playQhlyAudio('qhly_voc_press', null, true);
            });
            this.text.listen(function () {
              if (currentViewSkin.isLolBigLayout) return;
              if (that.consumeTextClick) {
                that.consumeTextClick = false;
                return;
              }
              if (!that.hideSkinMode) {
                that.hideSkinMode = true;
                that.refresh(name, state);
              }
            });
            // @ts-ignore
            game.qhly_changeViewPageSkin('skin', this.pageView);
            this.inited = true;
          }
        },
        config: {
          pageView: ui.create.div('.qh-page-config', view),
          refresh: function (name, state) {
            if (!this.inited) this.init(name, state);
          },
          init: function (name, state) {
            this.innerConfig = ui.create.div('.qh-page-config-text', this.pageView);
            // @ts-ignore
            ui.qhly_fixTextSize(this.innerConfig);
            var that = this;
            var content = "";
            // @ts-ignore
            content += "<h2><img src='" + lib.assetURL + get.qhly_getCurrentViewSkinValue('favouriteImage', 'extension/千幻聆音/image/newui_fav.png') + "' style='width:50px'/>收藏设置</h2>";
            content += "<p>可以选择收藏此武将。进行自由选将操作时，可以更快找到此武将。</p>";
            content += "<p><span style='display:inline-block;height:30px;'><img id='qhconfig_checkbox_fav'/><span id='qhconfig_checkbox_text_fav' style='display:inline-block;position:relative;bottom:25%;'>收藏" + get.translation(name) + "</span></span></p>";

            // @ts-ignore
            content += "<h2><img src='" + lib.assetURL + get.qhly_getCurrentViewSkinValue('forbidImage', 'extension/千幻聆音/image/newui_forbid.png') + "' style='width:50px'/>禁用设置</h2>";
            content += "<p>可以选择在某模式下禁用或启用该武将。该设置将在重启游戏后生效。</p>"
            content += "<p><span style='display:inline-block;height:30px;'><img id='qhconfig_checkbox_banned_mode_all'/><span id='qhconfig_checkbox_text_all' style='display:inline-block;position:relative;bottom:25%;'>所有模式禁用</span></span></p>";
            for (var mode in lib.mode) {
              if (mode != 'connect') {
                var translatemode = get.translation(mode);
                if (mode == 'tafang') translatemode = '塔防';
                else if (mode == 'chess') translatemode = '战棋';
                content += "<p><span style='display:inline-block;height:30px;'><img id='qhconfig_checkbox_banned_mode_" + mode + "'/><span id='qhconfig_checkbox_text_" + mode + "' style='display:inline-block;position:relative;bottom:25%;'>" + translatemode + "模式禁用</span></span></p>";
              }
            }
            content += "<p><span style='display:inline-block;height:30px;'><img id='qhconfig_checkbox_banned_ai'/><span id='qhconfig_checkbox_text_ai' style='display:inline-block;position:relative;bottom:25%;'>仅自由选将可选</span></span></p>";

            // @ts-ignore
            content += "<h2><img src='" + lib.assetURL + get.qhly_getCurrentViewSkinValue('rankImage', 'extension/千幻聆音/image/newui_rank_icon.png') + "' style='width:50px'/>等阶设置</h2>";
            content += "<p>可以设置" + get.translation(name) + "的等阶，重启后生效。</p>";
            content += "<p><select style='font-size:22px;font-family:'qh_youyuan';' id='qhconfig_rank_select'></select></p>";

            if (lib.config.qhly_enableCharacterMusic) {
              // @ts-ignore
              content += "<h2><img src='" + lib.assetURL + get.qhly_getCurrentViewSkinValue('musicImage', 'extension/千幻聆音/image/newui_music_icon.png') + "' style='width:50px'/>音乐设置</h2>";
              content += "<p>可以设置" + get.translation(name) + "的专属背景音乐，在游戏开始时将自动切换。</p>";
              content += "<p><select style='font-size:22px;font-family:'qh_youyuan';' id='qhconfig_music_select'></select></p>";
            }
            var extraConfigs = [];
            if (state.pkg.characterConfigExtra) {
              var characterConfigExtra = state.pkg.characterConfigExtra(name);
              if (characterConfigExtra) {
                for (var extc of characterConfigExtra) {
                  // @ts-ignore
                  var extobj = game.qhly_parseConfig(extc);
                  content += extobj.content;
                  extraConfigs.push(extobj);
                }
              }
            }
            content += "<br><br><br><br><br><br>";
            this.innerConfig.innerHTML = content;
            for (var extraConfig of extraConfigs) {
              if (extraConfig.onfinish) {
                extraConfig.onfinish(this.innerConfig);
              }
            }
            var bindFunc = function (checkbox, text) {
              if (!text) return;
              // @ts-ignore
              ui.qhly_addListenFunc(text);
              text.listen(function () {
                // @ts-ignore
                game.qhly_playQhlyAudio('qhly_voc_check', null, true);
                checkbox.qhly_setChecked(!checkbox.qhly_checked, true);
              });
            };
            var checkboxFav = document.getElementById('qhconfig_checkbox_fav');
            // @ts-ignore
            ui.qhly_initCheckBox(checkboxFav, lib.config.favouriteCharacter && lib.config.favouriteCharacter.includes(name));
            bindFunc(checkboxFav, document.getElementById('qhconfig_checkbox_text_fav'));
            // @ts-ignore
            checkboxFav.qhly_onchecked = function (check) {
              if (!check) {
                if (lib.config.favouriteCharacter && lib.config.favouriteCharacter.includes(name)) {
                  lib.config.favouriteCharacter.remove(name);
                }
              } else {
                if (!lib.config.favouriteCharacter) {
                  lib.config.favouriteCharacter = [name];
                } else {
                  lib.config.favouriteCharacter.add(name);
                }
              }
              game.saveConfig('favouriteCharacter', lib.config.favouriteCharacter);
            };
            var checkboxAll = document.getElementById('qhconfig_checkbox_banned_mode_all');
            var allForbid = true;
            for (var mode in lib.mode) {
              if (mode != 'connect') {
                if (lib.config[mode + '_banned'] && lib.config[mode + '_banned'].includes(mode)) {
                  continue;
                }
                allForbid = false;
                break;
              }
            }

            // @ts-ignore
            ui.qhly_initCheckBox(checkboxAll, allForbid);
            bindFunc(checkboxAll, document.getElementById('qhconfig_checkbox_text_all'));
            // @ts-ignore
            checkboxAll.qhly_onchecked = function (check) {
              if (check) {
                for (var mode in lib.mode) {
                  if (mode == 'connect') continue;
                  if (that['banned_checkbox_mode_' + mode]) {
                    that['banned_checkbox_mode_' + mode].qhly_setChecked(true, true);
                  }
                }
              } else {
                for (var mode in lib.mode) {
                  if (mode == 'connect') continue;
                  if (that['banned_checkbox_mode_' + mode]) {
                    that['banned_checkbox_mode_' + mode].qhly_setChecked(false, true);
                  }
                }
              }
            };
            this.banned_checkbox_mode_all = checkboxAll;
            var checkboxBanai = document.getElementById('qhconfig_checkbox_banned_ai');

            // @ts-ignore
            ui.qhly_initCheckBox(checkboxBanai, game.qhly_isForbidAI(name));

            bindFunc(checkboxBanai, document.getElementById('qhconfig_checkbox_text_ai'));
            // @ts-ignore
            checkboxBanai.qhly_onchecked = function (check) {
              if (check) {
                // @ts-ignore
                game.qhly_setForbidAI(name, true);
              } else {
                // @ts-ignore
                game.qhly_setForbidAI(name, false);
              }
            };
            for (var mode in lib.mode) {
              if (mode != 'connect') {
                var checkbox = document.getElementById('qhconfig_checkbox_banned_mode_' + mode);
                this['banned_checkbox_mode_' + mode] = checkbox;
                if (checkbox) {
                  // @ts-ignore
                  ui.qhly_initCheckBox(checkbox, lib.config[mode + '_banned'] && lib.config[mode + '_banned'].includes(name));
                  bindFunc(checkbox, document.getElementById('qhconfig_checkbox_text_' + mode));
                  (function (mode) {
                    // @ts-ignore
                    checkbox.qhly_onchecked = function (checked) {
                      if (!checked) {
                        that.banned_checkbox_mode_all.qhly_setChecked(false, true);
                        if (lib.config[mode + '_banned'] && lib.config[mode + '_banned'].includes(name)) {
                          lib.config[mode + '_banned'].remove(name);
                        }
                      } else {
                        if (lib.config[mode + '_banned']) {
                          lib.config[mode + '_banned'].add(name);
                        } else {
                          lib.config[mode + '_banned'] = [name];
                        }
                      }
                      game.saveConfig(mode + '_banned', lib.config[mode + '_banned']);
                    };
                  })(mode);
                }
              }
            }
            lib.setScroll(this.innerConfig);
            // @ts-ignore
            game.qhly_changeViewPageSkin('config', this.pageView);
            var rankSelect = document.getElementById('qhconfig_rank_select');
            var rankList = ['默认', '稀有', '史诗', '传说', '精品', '精良'];
            var rankToEng = {
              '默认': "default",
              '稀有': 'common',
              '史诗': "epic",
              '传说': "legend",
              '精品': 'rare',
              '精良': "junk",
            };
            var rankToIcon = {
              '默认': "",
              '稀有': 'A+',
              '史诗': "SS",
              '传说': "SSS",
              '精品': 'S',
              '精良': "A",
            };
            var rank = null;
            if (lib.config.qhly_rarity && lib.config.qhly_rarity[name]) {
              rank = lib.config.qhly_rarity[name];
            }
            for (var r of rankList) {
              var opt = document.createElement('option');
              opt.innerHTML = r + rankToIcon[r];
              opt.setAttribute('rank', rankToEng[r]);
              if (!rank && r == '默认') {
                // @ts-ignore
                opt.selected = 'selected';
              } else if (rankToEng[r] == rank) {
                // @ts-ignore
                opt.selected = 'selected';
              }
              // @ts-ignore
              rankSelect.appendChild(opt);
            }
            // @ts-ignore
            rankSelect.onchange = function (e) {
              var event = e ? e : window.event;
              // @ts-ignore
              if (event.target) {
                // @ts-ignore
                var target = event.target;
                // @ts-ignore
                var opt = target[target.selectedIndex];
                if (opt) {
                  var rank = opt.getAttribute('rank');
                  if (!lib.config.qhly_rarity) {
                    lib.config.qhly_rarity = {};
                  }
                  if (rank == 'default') {
                    if (lib.config.qhly_rarity[name]) {
                      delete lib.config.qhly_rarity[name];
                    }
                  } else {
                    lib.config.qhly_rarity[name] = rank;
                  }
                  game.saveConfig('qhly_rarity', lib.config.qhly_rarity);
                }
              }
              refreshRank();
            };
            if (lib.config.qhly_enableCharacterMusic) {
              var select = document.getElementById('qhconfig_music_select');
              // @ts-ignore
              var currentMusic = game.qhly_getCharacterMusic(name);
              var opt = document.createElement('option');
              opt.innerHTML = "无";
              opt.setAttribute('musicpath', '');
              if (!currentMusic) {
                // @ts-ignore
                opt.selected = 'selected';
              }
              // @ts-ignore
              select.appendChild(opt);
              // @ts-ignore
              for (var p in lib.qhlyMusic) {
                var opt = document.createElement('option');
                // @ts-ignore
                opt.innerHTML = lib.qhlyMusic[p].name;
                opt.setAttribute('musicpath', p);
                if (currentMusic == p) {
                  // @ts-ignore
                  opt.selected = 'selected';
                }
                // @ts-ignore
                select.appendChild(opt);
              }
              // @ts-ignore
              select.onchange = function (e) {
                var event = e ? e : window.event;
                // @ts-ignore
                if (event.target) {
                  // @ts-ignore
                  target = event.target;
                  // @ts-ignore
                  var opt = target[target.selectedIndex];
                  if (opt) {
                    var path = opt.getAttribute('musicpath');
                    if (path) {
                      lib.config.qhly_characterMusic[name] = path;
                    } else {
                      delete lib.config.qhly_characterMusic[name];
                    }
                    game.saveConfig('qhly_characterMusic', lib.config.qhly_characterMusic);
                    // @ts-ignore
                    game.qhly_switchBgm();
                  }
                }
              };
            }
            this.inited = true;
          }
        }
      };
      // @ts-ignore
      subView.pageButton[page].setBackgroundImage(get.qhly_getIf(currentViewSkin.buttonPressedImage, 'extension/千幻聆音/image/newui_button_selected.png'));
      view.appendChild(subView.mp);
      var state = {
        name: name,
        currentPage: page,
        skinScrollIndex: 0,
        // @ts-ignore
        pkg: game.qhly_foundPackage(name),
        intro: get.character(name),
        mainView: subView,
      };
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      subView.menuCover.listen(function (current) {
        if (state.extraMenu) {
          state.extraMenu.delete();
          delete state.extraMenu;
        }
        view.removeChild(subView.menuCover);
      });
      refreshRank = function () {
        if (subView.rank) {
          if (lib.config.qhly_showrarity) {
            subView.rank.show();
            var rarity = game.getRarity(state.name);
            if (rarity) {
              subView.rank.setBackgroundImage('extension/千幻聆音/image/rarity_' + rarity + ".png");
            }
          } else {
            subView.rank.hide();
          }
        }
      };
      var showPage = function (pagename) {
        var tpage = subView.page[pagename];
        subView.currentPage = pagename;
        state.currentPage = pagename;
        if (tpage) {
          tpage.refresh(name, state);
        }
        state.useLihuiLayout(state.useLihui());
        for (var p in subView.page) {
          if (p == pagename) {
            subView.page[p].pageView.show();
          } else {
            subView.page[p].pageView.hide();
          }
        }
        for (var k in subView.pageButton) {
          if (k == pagename) {
            // @ts-ignore
            subView.pageButton[k].setBackgroundImage(get.qhly_getIf(currentViewSkin.buttonPressedImage, 'extension/千幻聆音/image/newui_button_selected.png'));
          } else {
            // @ts-ignore
            subView.pageButton[k].setBackgroundImage(get.qhly_getIf(currentViewSkin.buttonImage, 'extension/千幻聆音/image/newui_button.png'));
          }
        }
      };
      state.useLihui = function () {
        if (currentViewSkin.lihuiSupport && state.pkg.characterLihui) {
          var lihuiPath = state.pkg.characterLihui(name, lib.config.qhly_skinset.skin[name]);
          return lihuiPath;
        }
        return false;
      };
      state.useLihuiLayout = function (use) {
        if (use) {
          if (currentViewSkin.isLolBigLayout) {
            if (state.currentPage == 'skin') {
              //subView.rank.style.right="60px";
              if (lib.config.qhly_showrarity) {
                subView.rank.hide();
              }
              subView.board.setBackgroundImage("extension/千幻聆音/theme/lolbig/newui_lol_bg_center_big.png");
              subView.avatar.style.right = "5%";
              subView.avatarImage.style.backgroundSize = "contain";
              subView.avatarImage.style.backgroundPosition = "100% 50%";
              subView.avatar.style.width = "calc(100%)";
              subView.avatar.style.transform = "";
            } else {
              //subView.rank.style.right="120px";
              if (lib.config.qhly_showrarity) {
                subView.rank.show();
              }
              subView.board.setBackgroundImage("extension/千幻聆音/theme/lolbig/newui_lol_bg1_big.png");
              subView.avatar.style.right = "0";
              subView.avatarImage.style.backgroundSize = "contain";
              subView.avatarImage.style.backgroundPosition = "100% 50%";
              subView.avatar.style.width = "calc(100%)";
              subView.avatar.style.transform = "";
            }
          }
        } else {
          if (currentViewSkin.isLolBigLayout) {
            if (state.currentPage == 'skin') {
              //subView.rank.style.right="60px";
              if (lib.config.qhly_showrarity) {
                subView.rank.hide();
              }
              subView.board.setBackgroundImage("extension/千幻聆音/theme/lolbig/newui_lol_bg_center_small.png");
              subView.avatar.style.right = "50%";
              subView.avatar.style.width = "calc(40%)";
              subView.avatarImage.style.backgroundSize = "cover";
              subView.avatarImage.style.backgroundPosition = "50% 50%";
              subView.avatar.style.transform = "translate(50%,0%)";
            } else {
              //subView.rank.style.right="120px";
              if (lib.config.qhly_showrarity) {
                subView.rank.show();
              }
              subView.board.setBackgroundImage("extension/千幻聆音/theme/lolbig/newui_lol_bg1.png");
              subView.avatar.style.right = "0px";
              subView.avatar.style.width = "calc(50%)";
              subView.avatarImage.style.backgroundSize = "cover";
              subView.avatarImage.style.backgroundPosition = "50% 50%";
              subView.avatar.style.transform = "";
            }
          }
        }
      };
      for (var k in subView.pageButton) {
        (function (m) {
          subView.pageButton[m].listen(function () {
            if (subView.currentPage != m) {
              showPage(m);
              if (state.extraMenu) {
                state.extraMenu.delete();
                delete state.extraMenu;
              }
              // @ts-ignore
              game.qhly_playQhlyAudio('qhly_voc_press', null, true);
            } else if (m == 'introduce') {
              if (state.extraMenu) {
                state.extraMenu.delete();
                delete state.extraMenu;
              } else {
                // @ts-ignore
                var extra = game.qhly_getIntroduceExtraPage(name, state.pkg);
                if (extra) {
                  // @ts-ignore
                  game.qhly_playQhlyAudio('qhly_voc_click2', null, true);
                  var arr = [{
                    name: '简介',
                    onchange: function () {
                      state.introduceExtraPage = "简介";
                      subView.page.introduce.refresh(name, state);
                      if (state.extraMenu) {
                        state.extraMenu.delete();
                        delete state.extraMenu;
                        view.removeChild(subView.menuCover);
                      }
                    }
                  }];
                  for (var obj of extra) {
                    (function (obj) {
                      arr.push({
                        name: obj.name,
                        onchange: function () {
                          state.introduceExtraPage = obj.name;
                          if (obj.qh_func) {
                            state.introduceExtraFunc = game[obj.qh_func];
                          } else {
                            state.introduceExtraFunc = obj.func;
                          }
                          subView.page.introduce.refresh(name, state);
                          if (state.extraMenu) {
                            state.extraMenu.delete();
                            delete state.extraMenu;
                            view.removeChild(subView.menuCover);
                          }
                        }
                      });
                    })(obj);
                  }
                  // @ts-ignore
                  state.extraMenu = game.qhly_createBelowMenu(arr, view);
                  view.appendChild(subView.menuCover);
                }
              }
            }
          });
        })(k);
      }
      var refreshView = function (state, subView) {
        if (state.pkg.isLutou || lib.config.qhly_lutou) {
          subView.avatarImage.classList.remove('qh-image-standard');
          subView.avatarImage.classList.add('qh-image-lutou');
          if (currentViewSkin.isQiLayout) {
            subView.board.classList.remove('qh-window-backboard');
            subView.board.classList.add('qh-window-backboard-lutou');
          }
        } else {
          subView.avatarImage.classList.remove('qh-image-lutou');
          subView.avatarImage.classList.add('qh-image-standard');
          if (currentViewSkin.isQiLayout) {
            subView.board.classList.remove('qh-window-backboard-lutou');
            subView.board.classList.add('qh-window-backboard');
          }
        }
        if (currentViewSkin.lihuiSupport && state.pkg.characterLihui) {
          var lihuiPath = state.pkg.characterLihui(name, lib.config.qhly_skinset.skin[name]);
          if (lihuiPath) {
            subView.avatarImage.setBackgroundImage(lihuiPath);
            state.useLihuiLayout(true);
          } else {
            subView.avatarImage.setBackground(name, 'character');
            state.useLihuiLayout(false);
          }
        } else {
          subView.avatarImage.setBackground(name, 'character');
          state.useLihuiLayout(false);
        }
        state.onChangeSkin = function () {
          if (!subView.characterTitle) return;
          var ctitle;
          if (state.pkg && state.pkg.characterTitle) {
            ctitle = state.pkg.characterTitle(name);
            if (ctitle && ctitle[0] === '#' && ctitle.length >= 2) {
              switch (ctitle[1]) {
                case 'r':
                  subView.characterTitle.style.color = 'red';
                  break;
                case 'g':
                  subView.characterTitle.style.color = 'green';
                  break;
                case 'p':
                  subView.characterTitle.style.color = 'legend';
                  break;
                case 'b':
                  subView.characterTitle.style.color = 'blue';
                  break;
              }
              ctitle = ctitle.slice(2);
            }
          } else if (subView.characterTitle && lib.characterTitle[name]) {
            ctitle = lib.characterTitle[name];
            if (ctitle && ctitle[0] === '#' && ctitle.length >= 2) {
              switch (ctitle[1]) {
                case 'r':
                  subView.characterTitle.style.color = 'red';
                  break;
                case 'g':
                  subView.characterTitle.style.color = 'green';
                  break;
                case 'p':
                  subView.characterTitle.style.color = 'legend';
                  break;
                case 'b':
                  subView.characterTitle.style.color = 'blue';
                  break;
              }
              ctitle = ctitle.slice(2);
            }
          }
          if (currentViewSkin.isQiLayout) {
            if (!lib.config.qhly_titlereplace || lib.config.qhly_titlereplace == 'title') {
              if (ctitle) {
                subView.characterTitle.innerHTML = ctitle;
              } else {
                subView.characterTitle.innerHTML = '';
              }
            } else if (lib.config.qhly_titlereplace == 'skin') {
              // @ts-ignore
              var skinName = game.qhly_getSkin(name);
              if (!skinName && ctitle) {
                subView.characterTitle.innerHTML = ctitle;
              } else {
                // @ts-ignore
                var ext = game.qhly_getSkinInfo(name, skinName);
                if (ext) {
                  if (ext.translation) {
                    subView.characterTitle.innerHTML = ext.translation;
                  } else {
                    // @ts-ignore
                    subView.characterTitle.innerHTML = game.qhly_earse_ext(skinName);
                  }
                }
              }
            } else if (lib.config.qhly_titlereplace == 'pkg') {
              // @ts-ignore
              var pname = game.qhly_getCharacterPackage(name);
              if (pname) {
                subView.characterTitle.innerHTML = get.translation(pname + "_character_config");
              }
            }
          } else {
            // @ts-ignore
            subView.characterTitle.innerHTML = get.qhly_verticalStr(lib.qhly_filterPlainText(ctitle));
          }
        };
        state.onChangeSkin();
        var group = state.intro[1];
        if (get.is.double(state.name) && (currentViewSkin.isQiLayout || currentViewSkin.isLolBigLayout)) {
          subView.group.hide();
          subView.doublegroup.show();
          // @ts-ignore
          var groups = get.is.double(state.name, true);
          subView.doublegroupA.innerHTML = get.translation(groups[0]);
          subView.doublegroupB.innerHTML = get.translation(groups[1]);
        } else if (group) {
          if (subView.doublegroup) {
            subView.doublegroup.hide();
          }
          subView.group.show();
          if (currentViewSkin.isQiLayout || currentViewSkin.isLolBigLayout) {
            if (currentViewSkin.isLolBigLayout) {
              // @ts-ignore
              if (lib.qhly_groupimage[group]) {
                var groupHtml = "<img style='display:block;position:absolute;width:65%;height:65%;left:50%;top:50%;transform:translate(-50%,-50%);' ";
                // @ts-ignore
                groupHtml += "src='" + lib.assetURL + lib.qhly_groupimage[group] + "'/>";
                subView.group.innerHTML = groupHtml;
              } else {
                var groupHtml = "<b>";
                groupHtml += get.translation(group) + "</b>";
                subView.group.innerHTML = groupHtml;
              }
            } else {
              subView.group.innerHTML = get.translation(group);
            }
          } else {
            // @ts-ignore
            if (lib.qhly_groupimage[group]) {
              subView.group.innerHTML = "";
              // @ts-ignore
              subView.group.setBackgroundImage(lib.qhly_groupimage[group]);
            } else {
              subView.group.setBackgroundImage('');
              subView.group.innerHTML = get.translation(group);
              // @ts-ignore
              if (lib.qhly_groupcolor[group]) {
                // @ts-ignore
                subView.group.style.color = lib.qhly_groupcolor[group];
              } else {
                subView.group.style.color = 'yellow';
              }
            }
          }
        }
        refreshRank();
        var pattern = lib.config.qhly_name_pattern;
        if(!pattern)pattern = "full";
        let getTranslation = (name)=>{
          if(!get.slimNameHorizontal && pattern!='raw'){
            if(!lib.config.qhly_metioned_slimName){
              let r = prompt("你的无名杀版本暂不支持前缀文字显示，已经为你显示为原本的get.translation方式。点击“确认”不再提示此消息。");
              if(r){
                game.saveConfig('qhly_metioned_slimName',true);
              }
            }
            return get.translation(name);
          }else{
            switch(pattern){
              case "full":
                return currentViewSkin.isQiLayout?get.slimNameHorizontal(name):get.slimName(name);
              case "full_pure":
                // @ts-ignore
                return lib.qhly_filterPlainText(get.slimName(name));
              case "raw":
                return get.rawName(name);
            }
          }
        };
        var chname;
        if (state.pkg.characterNameTranslate) {
          chname = state.pkg.characterNameTranslate(state.name);
        } else {
          chname = getTranslation(state.name);
          if (!chname) {
            if (state.name.indexOf("gz_") == 0) {
              chname = getTranslation(state.name.silce(3));
            }
          }
          if (!chname) {
            chname = "未命名武将";
          }
        }
        // @ts-ignore
        if (game.qhly_getIntroduceExtraPage(name, state.pkg)) {
          subView.pageButton.introduce.downButton.show();
        } else {
          subView.pageButton.introduce.downButton.hide();
        }
        if (currentViewSkin.isQiLayout) {
          subView.name.innerHTML = chname;
        } else {
          var vname = chname;
          subView.name.innerHTML = vname;
          subView.name.style.writingMode = 'vertical-lr';
        }
        if (!currentViewSkin.isQiLayout && !currentViewSkin.isLolBigLayout) {
          // @ts-ignore
          if (lib.qhly_groupcolor[group]) {
            // @ts-ignore
            subView.name.style.textShadow = "2px 2px 2px " + lib.qhly_groupcolor[group];
          } else {
            subView.name.style.textShadow = "2px 2px 2px #FFFF00";
          }
        }
        if (chname.length == 5) {
          subView.name.style.fontSize = '2.6em';
        } else if (chname.length >= 6) {
          subView.name.style.fontSize = '2.4em';
        } else {
          subView.name.style.fontSize = '2.8em';
        }
        var hp = state.intro[2];
        if (currentViewSkin.isQiLayout || currentViewSkin.isLolBigLayout) {
          while (subView.hp.hasChildNodes()) {
            subView.hp.removeChild(subView.hp.lastChild);
          }
          if (typeof hp == 'number') {
            if (!isFinite(hp)) {
              subView.hp.appendChild(ui.create.div('.qh-hpimg'));
              var hptext = ui.create.div('.qh-hptext');
              subView.hp.appendChild(hptext);
              hptext.innerHTML = "×" + (currentViewSkin.isLolBigLayout ? "<br>" : "") + "∞";
              if (currentViewSkin.isQiLayout) {
                hptext.style.left = "calc(12.83%)";
              } else if (currentViewSkin.isLolBigLayout) {
                hptext.style.top = "44px";
              }
            } else {
              if (hp <= 6) {
                for (var i = 0; i < hp; i++) {
                  var img = ui.create.div('.qh-hpimg');
                  if (currentViewSkin.isQiLayout) {
                    img.style.left = "calc(" + (i * 12.83) + "%)";
                  } else if (currentViewSkin.isLolBigLayout) {
                    img.style.top = (i * 44) + "px";
                  }
                  subView.hp.appendChild(img);
                }
              } else {
                subView.hp.appendChild(ui.create.div('.qh-hpimg'));
                var hptext = ui.create.div('.qh-hptext');
                if (currentViewSkin.isQiLayout) {
                  hptext.style.left = "calc(12.83%)";
                } else if (currentViewSkin.isLolBigLayout) {
                  hptext.style.top = "44px";
                }
                subView.hp.appendChild(hptext);
                hptext.innerHTML = "×" + (currentViewSkin.isLolBigLayout ? "<br>" : "") + hp;
              }
            }
          } else if (typeof hp == 'string') {
            var index = hp.indexOf("/");
            if (index >= 0) {
              var hp1 = get.infoHp(hp);
              var hp2 = get.infoMaxHp(hp);
              var hujia = get.infoHujia(hp);
              if (isNaN(hp1) || isNaN(hp2)) {
                subView.hp.appendChild(ui.create.div('.qh-hpimg'));
                var hptext = ui.create.div('.qh-hptext');
                if (currentViewSkin.isQiLayout) {
                  hptext.style.left = "calc(12.83%)";
                } else if (currentViewSkin.isLolBigLayout) {
                  hptext.style.top = "44px";
                }
                subView.hp.appendChild(hptext);
                hptext.innerHTML = "×" + (currentViewSkin.isLolBigLayout ? "<br>" : "") + hp;
              } else {
                if (hp2 >= 6) {
                  subView.hp.appendChild(ui.create.div('.qh-hpimg'));
                  var hptext = ui.create.div('.qh-hptext');
                  if (currentViewSkin.isQiLayout) {
                    hptext.style.left = "calc(12.83%)";
                  } else {
                    hptext.style.top = "44px";
                  }
                  subView.hp.appendChild(hptext);
                  var br = (currentViewSkin.isLolBigLayout ? "<br>" : "");
                  hptext.innerHTML = "×" + br + hp1 + br + '/' + br + hp2;
                  if (hujia) {
                    var hujiaDiv = ui.create.div('.qh-hujiaimg');
                    if (currentViewSkin.isQiLayout) {
                      hujiaDiv.style.left = "calc(-12.83%)";
                    } else if (currentViewSkin.isLolBigLayout) {
                      hujiaDiv.style.top = "-44px";
                    }
                    var hujiaInfo = ui.create.div('.qh-hujiaimg-inner');
                    hujiaDiv.appendChild(hujiaInfo);
                    hujiaInfo.innerHTML = '' + hujia;
                    subView.hp.appendChild(hujiaDiv);
                  }
                } else {
                  for (var i = 0; i < hp2; i++) {
                    var img = ui.create.div('.qh-hpimg');
                    if (currentViewSkin.isQiLayout) {
                      img.style.left = "calc(" + (i * 12.83) + "%)";
                    } else if (currentViewSkin.isLolBigLayout) {
                      img.style.top = (i * 44) + "px";
                    }
                    subView.hp.appendChild(img);
                    if (i >= hp1) {
                      if (currentViewSkin.isQiLayout) {
                        img.setBackgroundImage('extension/千幻聆音/theme/shuimo/newui_shuimo_hpimg_gray.jpg');
                      } else if (currentViewSkin.isLolBigLayout) {
                        img.setBackgroundImage('extension/千幻聆音/theme/lolbig/newui_lol_hpimg_gray.png');
                      }
                    }
                  }
                  if (hujia) {
                    if (hujia + hp2 <= 6) {
                      for (var i = hp2; i < hujia + hp2; i++) {
                        var img = ui.create.div('.qh-hujiaimg');
                        if (currentViewSkin.isQiLayout) {
                          img.style.left = "calc(" + (i * 12.83) + "%)";
                        } else if (currentViewSkin.isLolBigLayout) {
                          img.style.top = (i * 44) + "px";
                          img.style.width = "50.453px";
                          img.style.height = '44px';
                        }
                        subView.hp.appendChild(img);
                      }
                    } else {
                      var hujiaDiv = ui.create.div('.qh-hujiaimg');
                      if (currentViewSkin.isQiLayout) {
                        hujiaDiv.style.left = "calc(" + (i * 12.83) + "%)";
                      } else if (currentViewSkin.isLolBigLayout) {
                        hujiaDiv.style.top = (i * 44) + "px";
                        hujiaDiv.style.width = "50.453px";
                        hujiaDiv.style.height = '44px';
                      }
                      var hujiaInfo = ui.create.div('.qh-hujiaimg-inner');
                      hujiaDiv.appendChild(hujiaInfo);
                      hujiaInfo.innerHTML = '' + hujia;
                      subView.hp.appendChild(hujiaDiv);
                    }
                  }
                }
              }
            } else {
              subView.hp.appendChild(ui.create.div('.qh-hpimg'));
              var hptext = ui.create.div('.qh-hptext');
              hptext.style.left = "calc(12.83%)";
              subView.hp.appendChild(hptext);
              hptext.innerHTML = "×" + (currentViewSkin.isLolBigLayout ? "<br>" : "") + hp;
            }
          }
          while (subView.mp.hasChildNodes()) {
            subView.mp.removeChild(subView.hp.lastChild);
          }
          // @ts-ignore
          var mp = get.qhly_getMp(state.name, state.pkg);
          if (mp === null || mp === undefined) {
            subView.mp.hide();
          } else {
            subView.mp.show();
            if (mp <= 6) {
              for (var i = 0; i < mp; i++) {
                var img = ui.create.div('.qh-mpimg');
                if (currentViewSkin.isQiLayout) {
                  img.style.left = "calc(" + (i * 12.83) + "%)";
                } else if (currentViewSkin.isLolBigLayout) {
                  img.style.top = (i * 44) + 'px';
                }
                subView.mp.appendChild(img);
              }
            } else {
              subView.mp.appendChild(ui.create.div('.qh-mpimg'));
              var mptext = ui.create.div('.qh-mptext');
              subView.mp.appendChild(mptext);
              mptext.innerHTML = "×" + (currentViewSkin.isLolBigLayout ? "<br>" : "") + mp;
            }
          }
        } else {
          if (typeof hp == 'number' && !isFinite(hp)) {
            hp = '∞';
          }
          if (!get.infoHujia(hp)) {
            subView.hpText.innerHTML = hp + '';
          } else {
            var str = '';
            if (get.infoHp(hp) != get.infoMaxHp(hp)) {
              str = get.infoHp(hp) + '/' + get.infoMaxHp(hp);
            } else {
              str = get.infoMaxHp(hp) + '';
            }
            // @ts-ignore
            str += "&nbsp;&nbsp;&nbsp;<img style='height:40px;weight:40px;' src='" + lib.qhly_path + "image/qhly_hudun.png'/>";
            if (get.infoHujia(hp) > 1) {
              str += ("x" + get.infoHujia(hp));
            }
            subView.hpText.innerHTML = str;
            subView.hpText.style.left = "calc(30%)";
          }
          // @ts-ignore
          var mp = get.qhly_getMp(state.name, state.pkg);
          if (mp === null || mp === undefined) {
            subView.mp.hide();
          } else {
            subView.mp.show();
            subView.mpText.innerHTML = mp + "";
          }
        }
      };
      refreshView(state, subView);
      // @ts-ignore
      game.qhly_changeViewSkin(subView);
      showPage(page);
    };
    // @ts-ignore
    game.qhly_open = function (name, page, ingame) {
      if (name.indexOf('gz_') == 0) {
        // @ts-ignore
        if (lib.config.qhly_guozhan === false || get.mode() != 'guozhan' || !game.qhly_hasGuozhanSkin(name)) {
          name = name.slice(3);
        }
      }
      if (lib.config.qhly_newui !== false && (lib.config.qhly_currentViewSkin != 'jingdian')) {
        // @ts-ignore
        game.qhly_open_new(name, page ? page : 'skin', ingame);
        return;
      }
      //game.pause();
      if (!lib.config.qhly_huaijiu_mentioned) {
        alert("【经典怀旧】UI套装已经停止维护，如果需要更好的UI体验，建议切换到别的UI套装。");
        game.saveConfig('qhly_huaijiu_mentioned', true);
      }
      var background = ui.create.div('.qhly-chgskin-background', document.body);
      // @ts-ignore
      background.animate('start');
      var avatar = ui.create.div('.qhly-skin', background);
      //avatar.setBackground(name,'character');
      avatar.hide();
      ui.create.div('.qhly-biankuang', avatar);
      var belowTitle = ui.create.div('.qhly-belowtitle', avatar);
      belowTitle.innerHTML = get.translation(name);
      var headTitle = ui.create.div('.qhly-headtitle', avatar);
      headTitle.innerHTML = "标准皮肤";
      var leftArrow = ui.create.div('.qhly-leftbutton', avatar);
      var rightArrow = ui.create.div('.qhly-rightbutton', avatar);
      var okButton = ui.create.div('.qhly-okbutton', avatar);
      var infobk = ui.create.div('.qhly-text-bk', background);
      var infoText = ui.create.div('.qhly-text', infobk);
      var levelText = ui.create.div('.qhly-level', avatar);
      var viewAbstract = {
        skin: lib.config.qhly_skinset.skin[name],
        index: 0,
        skinCount: 1,
        skinList: [false],
        //refreshing:false,
      };
      okButton.listen(function () {
        // @ts-ignore
        game.qhly_setCurrentSkin(name, viewAbstract.skin, undefined, true);
        //game.resume();
        background.delete();
      });
      var refreshView = function (name, viewAbstract) {
        avatar.show();
        // @ts-ignore
        _status.qhly_viewRefreshing = true;
        // @ts-ignore
        game.qhly_setCurrentSkin(name, viewAbstract.skin, function () {
          // @ts-ignore
          _status.qhly_viewRefreshing = false;
        }, true);
        //viewAbstract.refreshing = true;
        if (viewAbstract.skin) {
          // @ts-ignore
          avatar.setBackgroundImage(game.qhly_getSkinFile(name, viewAbstract.skin));
        } else {
          avatar.setBackground(name, 'character');
        }
        if (viewAbstract.index == 0) {
          leftArrow.hide();
        } else {
          leftArrow.show();
        }
        if (viewAbstract.index >= viewAbstract.skinCount - 1) {
          rightArrow.hide();
        } else {
          rightArrow.show();
        }
        var sname;
        if (viewAbstract.skin) {
          // @ts-ignore
          sname = game.qhly_getSkinName(name, viewAbstract.skin, null);
        } else {
          sname = "标准皮肤";
        }
        headTitle.innerHTML = sname;
        // @ts-ignore
        var info = game.qhly_getSkinInfo(name, viewAbstract.skin, null);
        if (viewAbstract.skin) {
          var title;
          // @ts-ignore
          if (lib.qhly_level[name + "_" + viewAbstract.skin]) {
            // @ts-ignore
            title = lib.qhly_level[name + "_" + viewAbstract.skin];
          }
          if (!title || title.length == 0) {
            title = info.level ? info.level : info.title;
          }
          if (title) {
            levelText.show();
            if (['精品', '史诗', '传说', '限定'].includes(title)) {
              var obj = {
                '精品': 'jingpin',
                '史诗': 'shishi',
                '传说': 'chuanshuo',
                '限定': 'xianding'
              };
              levelText.innerHTML = '';
              levelText.setBackgroundImage('extension/千幻聆音/image/level_' + obj[title] + ".png");
            } else {
              levelText.innerHTML = title;
              levelText.setBackgroundImage('');
            }
          } else {
            levelText.hide();
          }
        } else {
          levelText.hide();
        }
        var str = "技能语音：<br><br>";
        // @ts-ignore
        if (!window.qhly_audio_which) {
          // @ts-ignore
          window.qhly_audio_which = {};
        }
        var skills = get.character(name, 3).slice(0);
        if (skills) {
          skills.remove('xwjh_audiozhenwang');
          for (var skill of skills) {
            var infoString = "";
            // @ts-ignore
            window.qhly_audio_which[skill] = 1;
            infoString += "【";
            infoString += get.translation(skill);
            infoString += "】";
            // @ts-ignore
            if (window.qhly_TrySkillAudio) {
              // @ts-ignore
              infoString += "<a style='color:#ffffff' href=\"javascript:window.qhly_TrySkillAudio('" + skill + "',{name:'" + name + "'},null,window.qhly_audio_which[\'" + skill + "\'],\'" + viewAbstract.skin + "\');window.qhly_audio_which[\'" + skill + "\']++;\"><img style=height:22px src=" + lib.assetURL + get.qhly_getCurrentViewSkinValue('skinPagePlayAudioButtonImage', 'extension/千幻聆音/image/qhly_pic_playaudiobutton.png') + "></a><br>";
            }
            infoString += "<br><br>";
            str += infoString;
          }
        }
        str += "【阵亡】";
        // @ts-ignore
        str += "<a style='color:#ffffff' href=\"javascript:window.qhly_playDieAudio(\'" + name + "\');\"><img style=height:22px src=" + lib.qhly_path + "image/qhly_pic_playaudiobutton.png></a><br>";
        if (info.info) {
          str += info.info;
        }
        if (!viewAbstract.skin) {
          // @ts-ignore
          str += get.qhly_characterInfo(name);
        }
        infoText.innerHTML = str;
        lib.setScroll(infoText);
      };
      var finishView = function (name, viewAbstract) {
        refreshView(name, viewAbstract);
        leftArrow.listen(function () {
          viewAbstract.index--;
          if (viewAbstract.index <= 0) {
            viewAbstract.index = 0;
          }
          if (viewAbstract.index >= viewAbstract.skinCount - 1) {
            viewAbstract.index = viewAbstract.skinCount - 1;
          }
          viewAbstract.skin = viewAbstract.skinList[viewAbstract.index];
          refreshView(name, viewAbstract);
        });
        rightArrow.listen(function () {
          viewAbstract.index++;
          if (viewAbstract.index <= 0) {
            viewAbstract.index = 0;
          }
          if (viewAbstract.index >= viewAbstract.skinCount - 1) {
            viewAbstract.index = viewAbstract.skinCount - 1;
          }
          viewAbstract.skin = viewAbstract.skinList[viewAbstract.index];
          refreshView(name, viewAbstract);
        });
        levelText.listen(function () {
          background.delete();
          var string = "请输入皮肤的等级";
          if (levelText.innerHTML) {
            string = "###" + string + "###" + levelText.innerHTML;
          }
          game.prompt(string, false, function (str) {
            // @ts-ignore
            lib.qhly_level[name + "_" + viewAbstract.skin] = str;
            // @ts-ignore
            game.saveConfig('qhly_level', lib.qhly_level);
            // @ts-ignore
            game.qhly_open(name);
          });
        });
      };
      // @ts-ignore
      game.qhly_getSkinList(name, function (success, skinList) {
        if (!success) {
          viewAbstract.skinCount = 1;
          viewAbstract.skinList = [false];
          viewAbstract.skin = false;
          viewAbstract.index = 0;
          finishView(name, viewAbstract);
          return;
        } else {
          viewAbstract.skinCount = 1 + skinList.length;
          viewAbstract.skinList = [false];
          viewAbstract.skinList.addArray(skinList);
          if (viewAbstract.skin) {
            for (var i = 0; i < viewAbstract.skinList.length; i++) {
              if (viewAbstract.skinList[i] == viewAbstract.skin) {
                viewAbstract.index = i;
                break;
              }
            }
          } else {
            viewAbstract.index = 0;
          }
          finishView(name, viewAbstract);
        }
      }, false, true);
    };

    //修改人物卡片界面，显示换肤按钮。
    var originCharacterCardFunciton = ui.click.charactercard;
    var replaceCharacterCardFunction = function () {
      var clickListener = function () {
        if (arguments[1]) {
          // @ts-ignore
          _status.qh_sourceNode = arguments[1];
          // @ts-ignore
          _status.qh_sourceNodeName = arguments[0];
        } else {
          // @ts-ignore
          delete _status.qh_sourceNode;
        }
        if (arguments[4]) {
          if (lib.config.qhly_replaceCharacterCard2 == 'window') {
            game.resume2();
            // @ts-ignore
            game.qhly_open_small(arguments[0], null, arguments[4]);
          } else if (lib.config.qhly_currentViewSkin != 'jingdian') {
            // @ts-ignore
            game.qhly_open_new(arguments[0], lib.config.qhly_doubledefaultpage ? lib.config.qhly_doubledefaultpage : 'skill', arguments[4]);
          } else {
            // @ts-ignore
            game.qhly_open(arguments[0]);
          }
        } else {
          if (lib.config.qhly_currentViewSkin != 'jingdian') {
            // @ts-ignore
            game.qhly_open_new(arguments[0], lib.config.qhly_listdefaultpage ? lib.config.qhly_listdefaultpage : 'introduce');
          } else {
            // @ts-ignore
            game.qhly_open(arguments[0]);
          }
        }
      };
      if (lib.config.qhly_replaceCharacterCard2 != 'nonereplace' && lib.config.qhly_replaceCharacterCard2 != 'nonereplace2') {
        clickListener.apply(null, arguments);
      } else {
        originCharacterCardFunciton.apply(this, arguments);
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        var name = arguments[0];
        var pastArg = arguments;
        if (ui.window.lastChild && ui.window.lastChild.lastChild) {
          var layer = ui.window.lastChild;
          var largeButton = ui.create.div('.qhly-skin-button', ui.window.lastChild.lastChild);
          largeButton.addEventListener('click', function () {
            clickListener.apply(null, pastArg);
            // @ts-ignore
            layer.click();
          });
        }
      }
    };
    if (lib.config.qhly_replaceCharacterCard2 != 'nonereplace2') {
      if (Object.defineProperty) {
        Object.defineProperty(ui.click, 'charactercard', {
          get: function () {
            return replaceCharacterCardFunction;
          },
          // @ts-ignore
          // @ts-ignore
          // @ts-ignore
          set: function (value) {
            if (!lib.config.qhly_mentionConflitCC) {
              var ret = confirm("你安装的扩展中，有扩展试图修改ui.click.charactercard，此行为与《千幻聆音》冲突，你可以关闭有冲突的功能。若你点击【取消】，将不再对此消息进行提示。");
              if (!ret) {
                game.saveConfig('qhly_mentionConflitCC', true);
              }
            }
          },
          enumerable: true,
          configurable: true,
        });
      } else {
        ui.click.charactercard = replaceCharacterCardFunction;
      }
    }

    //修改人物信息界面，添加换肤按钮。
    /*
    var normalNodeIntro = get.nodeintro;
    get.nodeintro=function(node,simple,evt){
        var ret = normalNodeIntro.apply(this,arguments);
        if(!ret)return ret;
        if(node.classList.contains('player') && !node.name){
            return ret;
        }
        if(node.name){
            if(get.character(node.name)){
                var zhu = ui.create.div('.qhly-skin-intro-button-zhu',ret);
                zhu.innerHTML = "<img style=width:30px src="+lib.assetURL+"extension/千幻聆音/qhly_skin_bt1.png>";
                zhu.listen(function(){
                    game.qhly_open(node.name);
                });
            }
        }
        if(node.name2 && get.character(node.name2)){
            var fu = ui.create.div('.qhly-skin-intro-button-fu',ret);
            fu.innerHTML = "<img style=width:30px src="+lib.assetURL+"extension/千幻聆音/qhly_skin_bt2.png>";
            fu.listen(function(){
                game.qhly_open(node.name2);
            });
        }
        return ret;
    };*/

    //自动换肤逻辑。
    // @ts-ignore
    game.qhly_autoChangeSkin = function () {
      if (lib.config.qhly_autoChangeSkin && lib.config.qhly_autoChangeSkin != 'close') {
        // @ts-ignore
        _status.qhly_changeSkinFunc = function () {
          if (game && game.players && game.players.length) {
            var pls = game.players.slice(0);
            var names = [];
            for (var p of pls) {
              if (p.name1) names.push(p.name1);
              if (p.name2) names.push(p.name2);
            }
            names.randomSort();
            var func = function (arr, f) {
              if (arr.length == 0) return;
              var n = arr.shift();
              // @ts-ignore
              game.qhly_getSkinModels(n, function (list) {
                if (list && list.length) {
                  list = list.map(item=>{
                    if(item.skinId){
                      return item.skinId;
                    }else{
                      return false;
                    }
                  });
                  // @ts-ignore
                  var sk = game.qhly_getSkin(n);
                  var players = game.players.concat(game.dead);
                  var player;
                  for (var p of players) {
                    if (p.name1 == n || p.name2 == n) player = p;
                  }
                  // @ts-ignore
                  var player = game.filterPlayer(function (c) { return c.name1 == n || c.name2 == n })[0];
                  if (list.includes(sk)) {
                    list.remove(sk);
                  }
                  if (sk && !list.includes(false)) {
                    list.push(false);
                  }
                  list = list.filter(function (current) {
                    // @ts-ignore
                    return !game.qhly_skinIsBanned(n, current);
                  });
                  if (list.length == 0) {
                    f(arr, f);
                    return;
                  }
                  //game.me.say(get.translation(n)+sk+"....."+get.translation(list));
                  // @ts-ignore
                  if (!_status.qhly_open && !_status.bigEditing && !_status.qhly_playerWindowing) game.qhly_setCurrentSkin(n, list.randomGet(), function () {
                    // @ts-ignore
                    game.qhly_changeDynamicSkin(n);
                    if (player && lib.config['extension_千幻聆音_qhly_decadeChangeEffect'] && (lib.config.qhly_currentViewSkin == 'decade' || lib.config.qhly_currentViewSkin == 'shousha')) player.playChangeSkinEffect(player.name2 && player.name2 == n);
                  }, true);
                  // @ts-ignore
                  game.qhly_autoChangeSkin();
                } else {
                  f(arr, f);
                }
              }, false);

            };
            func(names, func);
          }
        };
        // @ts-ignore
        setTimeout(_status.qhly_changeSkinFunc, parseInt(lib.config.qhly_autoChangeSkin) * 1000);
      }
    };
    // @ts-ignore
    game.qhly_createSilder = function (min, max, value) {
      //此方法代码来自十周年UI。
      var slider = document.createElement('input');
      var onchange = function () {
        // @ts-ignore
        var percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.backgroundSize = percent + '% ' + '100%';
      };
      slider.style.width = "100%";
      // @ts-ignore
      var valueProp = Object.getOwnPropertyDescriptor(slider.__proto__, 'value');
      Object.defineProperties(slider, {
        value: {
          configurable: true,
          get: function () {
            // @ts-ignore
            return valueProp.get.call(this);
          },
          set: function (value) {
            // @ts-ignore
            valueProp.set.call(this, value);
            onchange();
          }
        }
      });

      slider.className = 'slider';
      slider.type = 'range';
      slider.addEventListener('input', onchange);

      // @ts-ignore
      slider.min = (typeof min == 'number') ? min : 0;
      // @ts-ignore
      slider.max = (typeof max == 'number') ? max : 100;
      // @ts-ignore
      slider.value = (typeof value == 'number') ? value : ((max - min) * 0.5);
      return slider;
    };
    // @ts-ignore
    game.qhly_openVolumnDialog = function(key){
      if(!key){
        alert("取键值发生错误。");
        return;
      }
      try{
        var dialog = ui.create.div('.qh-editdialog');
        if (lib.config.qhly_currentViewSkin == 'decade') dialog.classList.add('decade')
        var content = ui.create.div('.qh-editdialog-inner', dialog);
        var below = ui.create.div('.qh-editdialog-below', dialog);
        var htmlContent = "<h2>"+"音量设置"+"</h2>";
        htmlContent += "<span id='qh_editdialog_slider' style='width:100%;'></span>"
        var fn = key.slice(key.indexOf("/",-1));
        htmlContent += "<br>你可以为此技能设置其音量，仅对此技能有效。<br>文件名："+fn;
        content.innerHTML = htmlContent;
        var belowButton = "";
        // @ts-ignore
        belowButton += '<img src="' + lib.qhly_path + 'image/qhly_ok2.png" id="qh_volumn_edit_okbutton"/>';
        below.innerHTML = belowButton;
        document.body.append(dialog);
        var sliderP = document.getElementById('qh_editdialog_slider');
        var vol = lib.config.volumn_audio;
        if(lib.config.qhly_volumnAudio && lib.config.qhly_volumnAudio[key]){
          vol = lib.config.qhly_volumnAudio[key];
        }
        if(typeof vol != 'number'){
          vol = parseInt(vol);
        }
        if(!isNaN(vol)){
          vol = 4;
        }
        // @ts-ignore
        var slider = game.qhly_createSilder(0,8,vol);
        // @ts-ignore
        sliderP.appendChild(slider);
        slider.onchange=function(){
          if(!lib.config.qhly_volumnAudio){
            lib.config.qhly_volumnAudio = {};
          }
          lib.config.qhly_volumnAudio[key] = slider.value;
          game.saveConfig('qhly_volumnAudio',lib.config.qhly_volumnAudio);
        };
        var img1 = document.getElementById('qh_volumn_edit_okbutton');
        // @ts-ignore
        ui.qhly_addListenFunc(img1);
        // @ts-ignore
        img1.listen(function(){
          dialog.delete();
        });
      }catch(e){
        alert(e);
      }
    };
    lib.skill._qhly_autoc = {
      forced: true,
      popup: false,
      trigger: {
        global: 'gameStart',
      },
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      filter: function (event, player) {
        // @ts-ignore
        return !_status.qhly_autoChangeSkinSetted && lib.config.qhly_autoChangeSkin && lib.config.qhly_autoChangeSkin != 'close';
      },
      content: function () {
        // @ts-ignore
        _status.qhly_autoChangeSkinSetted = true;
        // @ts-ignore
        game.qhly_autoChangeSkin();
      }
    };
    lib.skill._qhly_randskin = {
      forced: true,
      popup: false,
      trigger: {
        global: 'gameStart',
      },
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      filter: function (event, player) {
        return lib.config.qhly_randskin;
      },
      content: function () {
        // @ts-ignore
        if (player.name || player.name1) {
          // @ts-ignore
          game.qhly_getSkinModels(player.name ? player.name : player.name1, function (list) {
            if (list && list.length) {
              list = list.map(item=>{
                if(item.skinId){
                  return item.skinId;
                }else{
                  return false;
                }
              });
              //list.push(false);
              list = list.filter(function (current) {
                // @ts-ignore
                return !game.qhly_skinIsBanned(player.name ? player.name : player.name1, current);
              });
              if (list && list.length)
                // @ts-ignore
                game.qhly_setCurrentSkin(player.name, list.randomGet(), undefined, true);
            }
          }, false);
        }
        // @ts-ignore
        if (player.name2) {
          // @ts-ignore
          game.qhly_getSkinModels(player.name2, function (list) {
            if (list && list.length) {
              list = list.map(item=>{
                if(item.skinId){
                  return item.skinId;
                }else{
                  return false;
                }
              });
              //list.push(false);
              list = list.filter(function (current) {
                // @ts-ignore
                return !game.qhly_skinIsBanned(player.name2, current);
              });
              if (list && list.length)
                // @ts-ignore
                game.qhly_setCurrentSkin(player.name2, list.randomGet(), undefined, true);
            }
          }, false);
        }
      }
    };
    // @ts-ignore
    lib.qhly_relativePos = function (pos1, pos2) {
      return {
        x: pos2.x - pos1.x,
        y: pos2.y - pos1.y
      };
    };
    // @ts-ignore
    lib.qhly_addPos = function (pos1, pos2) {
      return {
        x: pos1.x + pos2.x,
        y: pos1.y + pos2.y
      };
    };
    // @ts-ignore
    game.qhly_addDrag = function (button, parent, dragCallback) {
      var state = {};
      button.style.transition = 'transform 0s';
      var boundControl = function (pos) {
        // @ts-ignore
        var rect = game.qhly_handleRect(parent.getBoundingClientRect());
        // @ts-ignore
        var rectb = game.qhly_handleRect(button.getBoundingClientRect());
        var x = pos.x;
        var y = pos.y;
        if (x < rect.left) {
          x = rect.left;
        }
        if (x + rectb.width > rect.left + rect.width) {
          x = rect.left + rect.width - rectb.width;
        }
        if (y < rect.top) {
          y = rect.top;
        }
        if (y + rectb.height > rect.top + rect.height) {
          y = rect.top + rect.height - rectb.height;
        }
        return { x: x, y: y };
      };
      var onMouseDown = function (event) {
        // @ts-ignore
        var pos = lib.qhly_getEventPosition(event);
        state.originPos = pos;
        // @ts-ignore
        var rect = game.qhly_handleRect(button.getBoundingClientRect());
        state.originButtonPos = { x: rect.left, y: rect.top };
        state.isDragging = true;
      };
      var onMouseMove = function (event) {
        if (state.isDragging) {
          state.moved = true;
          // @ts-ignore
          var pos = lib.qhly_getEventPosition(event);
          // @ts-ignore
          var cpos = lib.qhly_relativePos(state.originPos, pos);
          // @ts-ignore
          var npos = lib.qhly_addPos(cpos, state.originButtonPos);
          npos = boundControl(npos);
          // @ts-ignore
          var rect = game.qhly_handleRect(parent.getBoundingClientRect());
          // @ts-ignore
          var fpos = lib.qhly_relativePos({ x: rect.left, y: rect.top }, npos);
          button.style.left = fpos.x.toFixed(2) + 'px';
          button.style.top = fpos.y.toFixed(2) + 'px';
          button.style.bottom = '';
          button.style.right = '';
        }
      };
      var onMouseUp = function (event) {
        if (state.isDragging) {
          if (state.moved) {
            // @ts-ignore
            var pos = lib.qhly_getEventPosition(event);
            // @ts-ignore
            var cpos = lib.qhly_relativePos(state.originPos, pos);
            // @ts-ignore
            var npos = lib.qhly_addPos(cpos, state.originButtonPos);
            npos = boundControl(npos);
            // @ts-ignore
            var rect = game.qhly_handleRect(parent.getBoundingClientRect());
            // @ts-ignore
            var fpos = lib.qhly_relativePos({ x: rect.left, y: rect.top }, npos);
            button.style.left = fpos.x.toFixed(2) + 'px';
            button.style.top = fpos.y.toFixed(2) + 'px';
            button.style.bottom = '';
            button.style.right = '';
            delete state.moved;
            button.qhly_moveTime = (new Date()).valueOf();
            if (dragCallback) {
              dragCallback({ left: button.style.left, top: button.style.top, bottom: '', right: '' }, button);
            }
          }
        }
        delete state.isDragging;
      }
      if (lib.config.touchscreen) {
        button.addEventListener('touchstart', onMouseDown);
        button.addEventListener('touchend', onMouseUp);
        button.addEventListener('touchcancel', onMouseUp);
        button.addEventListener('touchmove', onMouseMove);
      } else {
        button.addEventListener('mousedown', onMouseDown);
        button.addEventListener('mouseup', onMouseUp);
        button.addEventListener('mouseleave', onMouseUp);
        button.addEventListener('mousemove', onMouseMove);
      }
    };
    lib.skill._qhly_addButton = {
      forced: true,
      popup: false,
      trigger: {
        global: 'gameStart',
      },
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      filter: function (event, player) {
        return lib.config.qhly_skinButton;
      },
      content: function () {
        var dragCallback = function (style, node) {
          if (lib.config.qhly_dragButtonPosition !== 'no') {
            // @ts-ignore
            var arr = game.qhly_getAllButtons();
            for (var bt of arr) {
              for (var s in style) {
                bt.style[s] = style[s];
              }
            }
            game.saveConfig('qhly_dragButtonPositionAll', style);
          } else {
            var key = 'qhly_dragButtonPositionOf_' + node.qhly_chname;
            // @ts-ignore
            var skin = game.qhly_getSkin(node.qhly_chname);
            if (skin) {
              key = key + '_' + skin;
            }
            game.saveConfig(key, style);
          }
        };
        // @ts-ignore
        if (player.name1 || player.name) {
          // @ts-ignore
          var button = ui.create.div('.qhly_skinplayerbutton', player.node.avatar);
          // @ts-ignore
          button.qhly_chname = player.name1 ? player.name1 : player.name;
          if (lib.config.qhly_dragButtonPosition !== 'no') {
            if (lib.config.qhly_dragButtonPositionAll) {
              for (var s in lib.config.qhly_dragButtonPositionAll) {
                button.style[s] = lib.config.qhly_dragButtonPositionAll[s];
              }
            }
          } else {
            // @ts-ignore
            var key = 'qhly_dragButtonPositionOf_' + button.qhly_chname;
            // @ts-ignore
            var skin = game.qhly_getSkin(button.qhly_chname);
            if (skin) {
              key = key + '_' + skin;
            }
            if (lib.config[key]) {
              for (var s in lib.config[key]) {
                button.style[s] = lib.config[key][s];
              }
            }
          }
          // @ts-ignore
          player.node.qhly_skinButton1 = button;
          button.listen(function () {
            // @ts-ignore
            if (button.qhly_moveTime) {
              var ctime = (new Date()).valueOf();
              // @ts-ignore
              if (ctime - button.qhly_moveTime <= 500) {
                return;
              }
            }
            // @ts-ignore
            if (player.isUnseen(0) && player != game.me) return;
            if (lib.config.qhly_smallwiningame) {
              // @ts-ignore
              game.qhly_open_small(player.name1 ? player.name1 : player.name, player, player);
            } else {
              // @ts-ignore
              game.qhly_open(player.name1 ? player.name1 : player.name, 'skin', player);
            }
          });
          if (lib.config.qhly_dragButton) {
            // @ts-ignore
            game.qhly_addDrag(button, player.node.avatar, dragCallback);
          }
          if (lib.config.qhly_buttons_hide) {
            button.hide();
          }
        }
        // @ts-ignore
        if (player.name2) {
          // @ts-ignore
          var button = ui.create.div('.qhly_skinplayerbutton2', player.node.avatar2);
          // @ts-ignore
          button.qhly_chname = player.name2;
          // @ts-ignore
          player.node.qhly_skinButton2 = button;
          button.listen(function () {
            // @ts-ignore
            if (player.isUnseen(1) && player != game.me) return;
            if (lib.config.qhly_smallwiningame) {
              // @ts-ignore
              game.qhly_open_small(player.name2, player, player);
            } else {
              // @ts-ignore
              game.qhly_open(player.name2, 'skin', player);
            }
          });
          if (lib.config.qhly_dragButton) {
            // @ts-ignore
            game.qhly_addDrag(button, player.node.avatar2, dragCallback);
          }
          if (lib.config.qhly_buttons_hide) {
            button.hide();
          }
        }
        // @ts-ignore
        if (player == game.me && !_status.qhly_initOk) {
          // @ts-ignore
          _status.qhly_initOk = true;
          // @ts-ignore
          _status.qhly_buttonShowing = !lib.config.qhly_buttons_hide;
          ui.create.system("显示/隐藏皮肤按钮", function () {
            // @ts-ignore
            if (_status.qhly_buttonShowing) {
              // @ts-ignore
              game.qhly_hideButtons();
            } else {
              // @ts-ignore
              game.qhly_showButtons();
            }
          }, true);
        }
      }
    };
    // @ts-ignore
    game.qhly_getAllButtons = function () {
      var btarr = [];
      if (game && game.players) {
        var arr = game.players.slice(0);
        arr.addArray(game.dead);
        for (var p of arr) {
          if (p.node.qhly_skinButton1) {
            btarr.add(p.node.qhly_skinButton1);
          }
          if (p.node.qhly_skinButton2) {
            btarr.add(p.node.qhly_skinButton2);
          }
        }
      }
      return btarr;
    };
    // @ts-ignore
    game.qhly_hideButtons = function () {
      game.saveConfig('qhly_buttons_hide', true);
      if (game && game.players) {
        var arr = game.players.slice(0);
        arr.addArray(game.dead);
        for (var p of arr) {
          if (p.node.qhly_skinButton1) {
            p.node.qhly_skinButton1.style.transition = '';
            p.node.qhly_skinButton1.hide();
          }
          if (p.node.qhly_skinButton2) {
            p.node.qhly_skinButton2.style.transition = '';
            p.node.qhly_skinButton2.hide();
          }
        }
      }
      // @ts-ignore
      _status.qhly_buttonShowing = false;
    };
    // @ts-ignore
    game.qhly_showButtons = function () {
      game.saveConfig('qhly_buttons_hide', false);
      if (game && game.players) {
        var arr = game.players.slice(0);
        arr.addArray(game.dead);
        for (var p of arr) {
          if (p.node.qhly_skinButton1) {
            p.node.qhly_skinButton1.show();
            if (lib.config.qhly_dragButton) {
              p.node.qhly_skinButton1.style.transition = 'transform 0s';
            }
          }
          if (p.node.qhly_skinButton2) {
            p.node.qhly_skinButton2.show();
            if (lib.config.qhly_dragButton) {
              p.node.qhly_skinButton2.style.transition = 'transform 0s';
            }
          }
        }
      }
      // @ts-ignore
      _status.qhly_buttonShowing = true;
    };

    // @ts-ignore
    game.qhly_checkFileExist('extension/千幻聆音/image/diylevels', function (s) {
      if (s && game.getFileList) {
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        game.getFileList('extension/千幻聆音/image/diylevels', function (folders, files) {
          if (files) {
            // @ts-ignore
            lib.qhly_diylevels = {};
            for (var f of files) {
              if (f.endsWith('.jpg') || f.endsWith('.webp') || f.endsWith('.png')) {
                // @ts-ignore
                lib.qhly_diylevels[game.qhly_earse_ext(f)] = f;
              }
            }
          }
        });
      }
    });

    // @ts-ignore
    game.qhly_checkFileExist('extension/千幻聆音/music/', function (s) {
      if (s && game.getFileList) {
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        game.getFileList('extension/千幻聆音/music/', function (folders, files) {
          if (files) {
            for (var f of files) {
              if (f.endsWith('.mp3')) {
                var path = 'extension/千幻聆音/music/' + f;
                // @ts-ignore
                var name = game.qhly_earse_ext(f);
                // @ts-ignore
                lib.qhlyMusic[path] = {
                  name: name,
                  path: path
                };
              }
            }
            // @ts-ignore
            game.qhly_refreshBgmConfigs();
          }
        });
      }
    });

    // taffy: Web端判断getFileList函数是否存在喵
    if (game.getFileList) {
    /* taffy分界线 */
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    game.getFileList('extension/千幻聆音/plugins', function (folders, files) {
      if (files) {
        for (var file of files) {
          if (file.endsWith('.js')) {
            // @ts-ignore
            lib.init.js(lib.qhly_path + '/plugins/' + file);
          }
        }
      }
    });
    // Web端判断getFileList函数是否存在喵
    } else {
      for (let file of ['ai.js', 'code.js', 'diycard.js', 'effectTest.js', 'record.js']) {
        lib.init.js(lib.qhly_path + '/plugins/' + file);
      }
    }
    /* taffy分界线 */

    // @ts-ignore
    game.qhly_refreshSuits = function(){
      lib.extensionMenu['extension_千幻聆音']['qhly_currentViewSkin'] = {
        "name": "UI套装",
        "intro": "设置UI套装样式。",
        // @ts-ignore
        "item": get.qhly_viewSkinSet(),
        "init": lib.config.qhly_currentViewSkin === undefined ? 'xuanwujianghu' : lib.config.qhly_currentViewSkin,
        onclick: function (item) {
          // @ts-ignore
          if (lib.qhly_viewskin[item] && lib.qhly_viewskin[item].onchange) {
            // @ts-ignore
            lib.qhly_viewskin[item].onchange();
          }
          game.saveConfig('qhly_currentViewSkin', item);
          game.saveConfig('extension_千幻聆音_qhly_currentViewSkin', item);
          if (confirm("是否重启游戏以应用新UI？")) {
            game.reload();
          }
        }
      };
    };
    // @ts-ignore
    _status.qianhuanLoaded = true;
    // @ts-ignore
    if(Array.isArray(lib.doAfterQianhuanLoaded)){
      // @ts-ignore
      for(let func of lib.doAfterQianhuanLoaded){
        if(typeof func == 'function'){
          func();
        }
      }
    }
//-----Q-----START-----
};