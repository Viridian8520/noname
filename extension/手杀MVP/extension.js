game.import("extension", function (lib, game, ui, get, ai, _status) {
    return {
        name: "手杀MVP",
        editable: false,
        content: function (config, pack) {
        Object.assign(game, {

            LiHuiFileExist:function(url) {
                if (window.XMLHttpRequest) {
                    var http = new XMLHttpRequest();
                }
                else {
                    var http = new ActiveXObject("Microsoft.XMLHTTP");
                }
                http.open('HEAD', url, false);
                try {
                    http.send();
                } catch (err) {
                    return false;
                }
                // taffy: 注释extension.js原版代码喵
                // return http.status != 404;
                /* taffy分界线 */
                // taffy: 判断为媒体类型才返回true
                if (!(http.status >= 200 && http.status < 300)) {
                    return false;
                }
                var contentType = http.getResponseHeader('Content-Type') || '';
                var isMediaFile = /^(image|audio|video)\//i.test(contentType);
                return isMediaFile;
                /* taffy分界线 */
            },
            getFileName2:function(path) {
                var pos1 = path.lastIndexOf('/');
                var pos2 = path.lastIndexOf('\\');
                var pos = Math.max(pos1, pos2);
                if (pos < 0) {
                  return path;
                }else {
                  let tempPath = path.substring(pos + 1);
                  return tempPath.substring(0, tempPath.lastIndexOf("."));
                }
            },

            getLiHuiPath:function(player,assetURL){

                var LiHuiMapping = lib.LiHuiMapping;
                var SkinName = game.getFileName2(player.node.avatar.style.backgroundImage);
                var Name = player.name==""?player.name2:player.name;
                if(LiHuiMapping[Name]) Name = LiHuiMapping[Name];
                var LihuiPath = assetURL + Name + "/" + SkinName+".png";
                if(game.LiHuiFileExist(LihuiPath)){
                    return LihuiPath;
                }else{
                    LihuiPath = assetURL + Name + "/" + Name +".png";
                    if(game.LiHuiFileExist(LihuiPath)){
                        return LihuiPath;
                    }else{
                        return assetURL + "未知.png";
                    }
                }
            }

})
            game.playqysstx = function (fn, dir, sex) {
                if (lib.config.background_speak) {
                    if (dir && sex) game.playAudio(dir, sex, fn);
                    else if (dir) game.playAudio(dir, fn);
                    else game.playAudio('..', 'extension', '手杀MVP', fn);
                }
            };
            String.prototype.newFedit = function (ins) {
                var CAFst = this;
                var CAFstr = CAFst.slice(CAFst.indexOf("{") + 1).slice(0, -1);
                return ins(CAFstr);
            }
            if (config.qingyao_shoushapeiyin) {
        if (lib.skill.qilin_skill) lib.skill.qilin_skill.audio = "ext:手杀MVP:true";
        if (lib.skill.qibaodao2) lib.skill.qibaodao2.audio = "ext:手杀MVP:true";
        if (lib.skill.lanyinjia) lib.skill.lanyinjia.audio = "ext:手杀MVP:true";
        if (lib.skill.cixiong_skill) lib.skill.cixiong_skill.audio = "ext:手杀MVP:true";
        lib.skill._qy_chongzhu = {
            trigger: {
                player: "_recastingBegin",
            },
            direct: true,
            popup: false,
            silent: true,
            priority: 0,
            content: function () {
                game.playqysstx('qy_chongzhu_' + (player.sex == 'female' ? 'female' : 'male'));
            },
        };
        // 铁锁
        let CAFst = lib.element.content.link.toString();
        let ins = function (str) {
            return str.replace(/game.playAudio\('effect','link'\);/g,
                `if(!player.isLinked()){
                            game['playAudio']('effect','link');
                        }else {
                            game.playqysstx('qy_tiesuo');
                        }`
            );
        };
        eval("lib.element.content.link=function(){" + CAFst.newFedit(ins) + "}");
        // 伤害
        CAFst = lib.element.content.damage.toString();
        ins = function (str) {
            return str.replace(/game.playAudio\('effect','damage'\+\(num\>1\?'2'\:''\)\);/g,
                `;if(num > player.hujia){
                    if(event.card&&event.card.name=='shandian'){
                        game.playqysstx('qy_shandian');
                    }else if(['fire','thunder','ice','kami'].contains(event.nature)){
                        game.playqysstx('qy_damage_'+event.nature+(num>1?'2':''));
                    }else {
                        game.playqysstx('qy_damage'+(num>1?'2':''));
                    }
                };`
            );
        };
        eval("lib.element.content.damage=function(){" + CAFst.newFedit(ins) + "}");
        // 流失体力
        CAFst = lib.element.content.loseHp.toString();
        ins = function (str) {
            return str.replace(/game.playAudio\('effect','loseHp'\);/g,
                `game.playqysstx('qy_loseHp');`
            );
        };
        eval("lib.element.content.loseHp=function(){" + CAFst.newFedit(ins) + "}");
    }
            if (config.qingyao_AIxuanjiang) {
                    lib.group.add('qingyao_xian');
                    lib.translate.qingyao_xian = '仙';
                    lib.translate.qingyao_xian2 = '仙';
                    lib.groupnature.qingyao_xian = 'qingyao_xian';
                    ui.create.groupControl = function (dialog) {
                        return ui.create.control('wei', 'shu', 'wu', 'qun', 'jin', 'western', 'qingyao_xian', function (link, node) {
                            if (link == '全部') {
                                dialog.currentcapt = '';
                                dialog.currentgroup = '';
                                for (var i = 0; i < dialog.buttons.length; i++) {
                                    dialog.buttons[i].style.display = '';
                                }
                            } else {
                                if (node.classList.contains('thundertext')) {
                                    dialog.currentgroup = null;
                                    dialog.currentgroupnode = null;
                                    node.classList.remove('thundertext');
                                    for (var i = 0; i < dialog.buttons.length; i++) {
                                        if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                            dialog.buttons[i].classList.add('nodisplay');
                                        } else {
                                            dialog.buttons[i].classList.remove('nodisplay');
                                        }
                                    }
                                } else {
                                    if (dialog.currentgroupnode) {
                                        dialog.currentgroupnode.classList.remove('thundertext');
                                    }
                                    dialog.currentgroup = link;
                                    dialog.currentgroupnode = node;
                                    node.classList.add('thundertext');
                                    for (var i = 0; i < dialog.buttons.length; i++) {
                                        if (dialog.buttons[i].group != link ||
                                            (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt))) {
                                            dialog.buttons[i].classList.add('nodisplay');
                                        } else {
                                            dialog.buttons[i].classList.remove('nodisplay');
                                        }
                                    }
                                }
                            }
                        });
                    };
                    //
                    var characterRandomGets = Object.keys(lib.character).randomGets(parseInt(lib.config.recent_character_number));
                    lib.characterDialogGroup['随机'] = function (name, capt) {
                        return characterRandomGets.contains(name) ? capt : null;
                    }

                    var createDialog = {
                        characterDialog: function () {
                            var filter = function (name) {
                                var info = lib.character[name];
                                //return info && info[1] === 'key';
                            }, str, noclick, thisiscard, seperate, expandall, onlypack, target, heightset, precharacter, characterx;
                            for (var i = 0; i < arguments.length; i++) {
                                if (arguments[i] === 'thisiscard') {
                                    thisiscard = true;
                                } else if (get.itemtype(arguments[i]) === 'player') {
                                    target = arguments[i];
                                } else if (arguments[i] === 'expandall') {
                                    expandall = true;
                                } else if (arguments[i] === 'heightset') {
                                    heightset = true;
                                } else if (arguments[i] == 'precharacter') {
                                    precharacter = true;
                                } else if (arguments[i] == 'characterx') {
                                    characterx = true;
                                } else if (typeof arguments[i] == 'string' && arguments[i].indexOf('onlypack:') == 0) {
                                    onlypack = arguments[i].slice(9);
                                } else if (typeof arguments[i] == 'object' && typeof arguments[i].seperate == 'function') {
                                    seperate = arguments[i].seperate;
                                } else if (typeof arguments[i] === 'string') {
                                    str = arguments[i];
                                } else if (typeof arguments[i] === 'function') {
                                    filter = arguments[i];
                                } else if (typeof arguments[i] == 'boolean') {
                                    noclick = arguments[i];
                                }
                            }
                            var list = [];
                            var dialog;
                            var node = ui.create.div('.caption.pointerspan');
                            if (get.is.phoneLayout()) {
                                node.style.fontSize = '30px';
                            }
                            var namecapt = [];
                            var getCapt = function (str) {
                                var capt;
                                if (str.indexOf('_') == -1) {
                                    capt = str[0];
                                } else {
                                    capt = str[str.lastIndexOf('_') + 1];
                                }
                                capt = capt.toLowerCase();
                                if (!/[a-z]/i.test(capt)) {
                                    capt = '自定义';
                                }
                                return capt;
                            }
                            if (thisiscard) {
                                for (var i in lib.card) {
                                    if (!lib.translate[i + '_info']) continue;
                                    if (filter && filter(i)) continue;
                                    list.push(['', get.translation(lib.card[i].type), i]);
                                    if (namecapt.indexOf(getCapt(i)) == -1) {
                                        namecapt.push(getCapt(i));
                                    }
                                }
                            } else {
                                for (var i in lib.character) {
                                    if (lib.character[i][4].contains('minskin')) continue;
                                    if (lib.character[i][4].contains('boss') || lib.character[i][4].contains('hiddenboss')) {
                                        if (lib.config.mode == 'boss') continue;
                                        if (!lib.character[i][4].contains('bossallowed')) continue;
                                    }

                                    if (lib.character[i][4].contains('stonehidden')) continue;
                                    if (lib.character[i][4].contains('unseen')) continue;
                                    //if (lib.character[i][1] === 'key' || i.indexOf('key') === 0) continue;
                                    if (lib.config.banned.contains(i)) continue;
                                    if (lib.characterFilter[i] && !lib.characterFilter[i](get.mode())) continue;
                                    if (filter && filter(i)) continue;
                                    list.push(i);
                                    if (namecapt.indexOf(getCapt(i)) == -1) {
                                        namecapt.push(getCapt(i));
                                    }
                                }
                            }
                            namecapt.sort(function (a, b) {
                                return a > b ? 1 : -1;
                            });
                            if (!thisiscard) {
                                namecapt.remove('自定义');
                                namecapt.push('newline');
                                for (var i in lib.characterDialogGroup) {
                                    namecapt.push(i);
                                }
                            }
                            var newlined = false;
                            var newlined2;
                            var packsource;
                            var clickCapt = function (e) {
                                if (_status.dragged) return;
                                if (dialog.currentcapt2 == '最近' && dialog.currentcaptnode2 != this && !dialog.currentcaptnode2.inited) {
                                    dialog.currentcapt2 = null;
                                    dialog.currentcaptnode2.classList.remove('thundertext');
                                    dialog.currentcaptnode2.inited = true;
                                    dialog.currentcaptnode2 = null;
                                }
                                if (this.alphabet) {
                                    if (this.classList.contains('thundertext')) {
                                        dialog.currentcapt = null;
                                        dialog.currentcaptnode = null;
                                        this.classList.remove('thundertext');
                                        if (this.touchlink) {
                                            this.touchlink.classList.remove('active');
                                        }
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                dialog.buttons[i].classList.remove('nodisplay');
                                            }
                                        }
                                    } else {
                                        if (dialog.currentcaptnode) {
                                            dialog.currentcaptnode.classList.remove('thundertext');
                                            if (dialog.currentcaptnode.touchlink) {
                                                dialog.currentcaptnode.touchlink.classList.remove('active');
                                            }
                                        }
                                        dialog.currentcapt = this.link;
                                        dialog.currentcaptnode = this;
                                        this.classList.add('thundertext');
                                        if (this.touchlink) {
                                            this.touchlink.classList.add('active');
                                        }
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                dialog.buttons[i].classList.remove('nodisplay');
                                            }
                                        }
                                    }
                                } else {
                                    if (newlined2) {
                                        newlined2.style.display = 'none';
                                        if (!packsource.onlypack) {
                                            packsource.classList.remove('thundertext');
                                            if (!get.is.phoneLayout() || !lib.config.filternode_button) {
                                                packsource.innerHTML = '武将包';
                                            }
                                        }
                                    }
                                    if (this.classList.contains('thundertext')) {
                                        dialog.currentcapt2 = null;
                                        dialog.currentcaptnode2 = null;
                                        this.classList.remove('thundertext');
                                        if (this.touchlink) {
                                            this.touchlink.classList.remove('active');
                                        }
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                dialog.buttons[i].classList.remove('nodisplay');
                                            }
                                        }
                                    } else {
                                        if (dialog.currentcaptnode2) {
                                            dialog.currentcaptnode2.classList.remove('thundertext');
                                            if (dialog.currentcaptnode2.touchlink) {
                                                dialog.currentcaptnode2.touchlink.classList.remove('active');
                                            }
                                        }
                                        dialog.currentcapt2 = this.link;
                                        dialog.currentcaptnode2 = this;
                                        this.classList.add('thundertext');
                                        if (dialog.currentcapt2 === '随机'){
                                            let identity = target && target.identity;
                                            if(get.mode() === 'guozhan') identity = 'num';
                                            characterRandomGets = Object.keys(lib.character).randomGets(get.config(`choice_${identity}`) || 3);
                                        }
                                        if (this.touchlink) {
                                            this.touchlink.classList.add('active');
                                        } else if (this.parentNode == newlined2) {
                                            packsource.innerHTML = this.innerHTML;
                                            packsource.classList.add('thundertext');
                                        }
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                if (dialog.buttons[i].activate) {
                                                    dialog.buttons[i].activate();
                                                }
                                                dialog.buttons[i].classList.remove('nodisplay');
                                            }
                                        }
                                    }
                                }
                                if (dialog.seperate) {
                                    for (var i = 0; i < dialog.seperate.length; i++) {
                                        if (!dialog.seperate[i].nextSibling.querySelector('.button:not(.nodisplay)')) {
                                            dialog.seperate[i].style.display = 'none';
                                            dialog.seperate[i].nextSibling.style.display = 'none';
                                        } else {
                                            dialog.seperate[i].style.display = '';
                                            dialog.seperate[i].nextSibling.style.display = '';
                                        }
                                    }
                                }
                                if (filternode) {
                                    if (filternode.querySelector('.active')) {
                                        packsource.classList.add('thundertext');
                                    } else {
                                        packsource.classList.remove('thundertext');
                                    }
                                }
                                if (e) e.stopPropagation();
                            };
                            for (i = 0; i < namecapt.length; i++) {
                                if (namecapt[i] == 'newline') {
                                    newlined = document.createElement('div');
                                    newlined.style.marginTop = '5px';
                                    newlined.style.display = 'block';
                                    // newlined.style.fontFamily='xinwei';
                                    if (get.is.phoneLayout()) {
                                        newlined.style.fontSize = '32px';
                                    } else {
                                        newlined.style.fontSize = '22px';
                                    }
                                    newlined.style.textAlign = 'center';
                                    node.appendChild(newlined);
                                } else if (newlined) {
                                    var span = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius');
                                    span.style.margin = '3px';
                                    span.style.width = 'auto';
                                    span.innerHTML = ' ' + namecapt[i].toUpperCase() + ' ';
                                    span.link = namecapt[i];
                                    span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                                    newlined.appendChild(span);
                                    node[namecapt[i]] = span;
                                    if (namecapt[i] == '收藏') {
                                        span._nature = 'fire';
                                    } else {
                                        span._nature = 'wood';
                                    }
                                } else {
                                    var span = document.createElement('span');
                                    span.innerHTML = ' ' + namecapt[i].toUpperCase() + ' ';
                                    span.link = namecapt[i];
                                    span.alphabet = true;
                                    span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                                    node.appendChild(span);
                                }
                            }
                            if (!thisiscard) {
                                var groups = ['wei', 'shu', 'wu', 'qun', 'jin', 'key', 'qingyao_xian'];
                                var bool1 = false;
                                var bool2 = false;
                                var bool3 = (get.mode() == 'guozhan' && _status.forceKey != true && get.config('onlyguozhan'));
                                var bool4 = (get.mode() != 'guozhan');
                                for (var i in lib.character) {
                                    if (lib.character[i][1] == 'shen') {
                                        bool1 = true;
                                    }
                                    if (bool3 || lib.character[i][1] == 'qingyao_xian') {
                                        bool2 = true;
                                    }
                                    if (!bool4 && get.is.double(i)) bool4 = true;
                                    if (bool1 && bool2 && bool4) break;
                                }
                                if (bool1) groups.add('shen');
                                if (bool2 && !bool3) groups.add('key');
                                if (bool4) groups.add('double');

                                for (let i in lib.character) {
                                    let characterElement = lib.character[i];
                                    if (!characterElement) continue;
                                    var characterElementGroup = characterElement[1];
                                    if (groups.includes(characterElementGroup)) continue;
                                    groups.push(characterElementGroup);
                                }

                                var natures = ['water', 'soil', 'wood', 'metal'];
                                var span = document.createElement('span');
                                newlined.appendChild(span);
                                span.style.margin = '8px';
                                var clickGroup = function () {
                                    if (_status.dragged) return;
                                    if (dialog.currentcapt2 == '最近' && dialog.currentcaptnode2 != this && !dialog.currentcaptnode2.inited) {
                                        dialog.currentcapt2 = null;
                                        dialog.currentcaptnode2.classList.remove('thundertext');
                                        dialog.currentcaptnode2.inited = true;
                                        dialog.currentcaptnode2 = null;
                                    }
                                    var currentcapt = dialog.currentcapt2 ? dialog.currentcapt2 : dialog.currentcapt;
                                    var node = this, link = this.link;
                                    if (node.classList.contains('thundertext')) {
                                        dialog.currentgroup = null;
                                        dialog.currentgroupnode = null;
                                        node.classList.remove('thundertext');
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                dialog.buttons[i].classList.remove('nodisplay');
                                            }
                                        }
                                    } else {
                                        if (dialog.currentgroupnode) {
                                            dialog.currentgroupnode.classList.remove('thundertext');
                                        }
                                        dialog.currentgroup = link;
                                        dialog.currentgroupnode = node;
                                        node.classList.add('thundertext');
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentgroup == 'double') {
                                                if (dialog.buttons[i]._changeGroup || dialog.buttons[i].group == 'ye') dialog.buttons[i].classList.remove('nodisplay');
                                                else dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                if (dialog.buttons[i]._changeGroup || dialog.buttons[i].group == 'ye' || dialog.buttons[i].group != dialog.currentgroup) {
                                                    dialog.buttons[i].classList.add('nodisplay');
                                                } else {
                                                    dialog.buttons[i].classList.remove('nodisplay');
                                                }
                                            }
                                        }
                                    }
                                };
                                for (var i = 0; i < groups.length; i++) {
                                    var span = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin');
                                    span.style.margin = '3px';
                                    newlined.appendChild(span);
                                    span.innerHTML = get.translation(groups[i]);
                                    span.link = groups[i];
                                    span._nature = natures[i];
                                    span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickGroup);
                                }
                                var span = document.createElement('span');
                                newlined.appendChild(span);
                                span.style.margin = '8px';
                                packsource = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin');
                                packsource.style.margin = '3px';
                                newlined.appendChild(packsource);


                                var filternode = null;
                                var clickCaptNode = function (e) {
                                    delete _status.filterCharacter;
                                    ui.window.classList.remove('shortcutpaused');
                                    filternode.delete();
                                    filternode.classList.remove('shown');
                                    clickCapt.call(this.link, e);
                                };
                                if (get.is.phoneLayout() && lib.config.filternode_button) {
                                    newlined.style.marginTop = '';
                                    packsource.innerHTML = '筛选';
                                    filternode = ui.create.div('.popup-container.filter-character.modenopause');
                                    ui.create.div(filternode);
                                    filternode.listen(function (e) {
                                        if (this.classList.contains('removing')) return;
                                        delete _status.filterCharacter;
                                        ui.window.classList.remove('shortcutpaused');
                                        this.delete();
                                        this.classList.remove('shown');
                                        e.stopPropagation();
                                    });
                                    for (var i = 0; i < node.childElementCount; i++) {
                                        if (node.childNodes[i].tagName.toLowerCase() == 'span') {
                                            node.childNodes[i].style.display = 'none';
                                            node.childNodes[i].touchlink = ui.create.div(filternode.firstChild, clickCaptNode, '.menubutton.large.capt', node.childNodes[i].innerHTML);
                                            node.childNodes[i].touchlink.link = node.childNodes[i];
                                        }
                                    }
                                    ui.create.node('br', filternode.firstChild);
                                } else {
                                    if (onlypack) {
                                        packsource.onlypack = true;
                                        packsource.innerHTML = get.translation(onlypack + '_character_config');
                                        packsource.style.display = 'none';
                                        packsource.previousSibling.style.display = 'none';
                                    } else {
                                        packsource.innerHTML = '武将包';
                                    }
                                }

                                newlined2 = document.createElement('div');
                                newlined2.style.marginTop = '5px';
                                newlined2.style.display = 'none';
                                newlined2.style.fontFamily = 'xinwei';
                                newlined2.classList.add('pointernode');
                                if (get.is.phoneLayout()) {
                                    newlined2.style.fontSize = '32px';
                                } else {
                                    newlined2.style.fontSize = '22px';
                                }
                                newlined2.style.textAlign = 'center';
                                node.appendChild(newlined2);

                                packsource.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                    if (packsource.onlypack) return;
                                    if (_status.dragged) return;
                                    if (get.is.phoneLayout() && lib.config.filternode_button && filternode) {
                                        _status.filterCharacter = true;
                                        ui.window.classList.add('shortcutpaused');
                                        ui.window.appendChild(filternode);
                                        ui.refresh(filternode);
                                        filternode.classList.add('shown');
                                        var dh = filternode.offsetHeight - filternode.firstChild.offsetHeight;
                                        if (dh > 0) {
                                            filternode.firstChild.style.top = (dh / 2) + 'px';
                                        } else {
                                            filternode.firstChild.style.top = '';
                                        }
                                    } else {
                                        if (newlined2.style.display == 'none') {
                                            newlined2.style.display = 'block';
                                        } else {
                                            newlined2.style.display = 'none';
                                        }
                                    }
                                });
                                var packlist = [];
                                for (var i = 0; i < lib.config.all.characters.length; i++) {
                                    if (!lib.config.characters.contains(lib.config.all.characters[i])) continue;
                                    packlist.push(lib.config.all.characters[i]);
                                }
                                for (var i in lib.characterPack) {
                                    if (!lib.config.all.characters.contains(i)) {
                                        packlist.push(i);
                                    }
                                }
                                for (var i = 0; i < packlist.length; i++) {
                                    var span = document.createElement('div');
                                    span.style.display = 'inline-block';
                                    span.style.width = 'auto';
                                    span.style.margin = '5px';
                                    if (get.is.phoneLayout()) {
                                        span.style.fontSize = '32px';
                                    } else {
                                        span.style.fontSize = '22px';
                                    }
                                    span.innerHTML = lib.translate[packlist[i] + '_character_config'];
                                    span.link = packlist[i];
                                    span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                                    newlined2.appendChild(span);
                                    if (filternode && !onlypack) {
                                        span.touchlink = ui.create.div(filternode.firstChild, clickCaptNode, '.menubutton.large', span.innerHTML);
                                        span.touchlink.link = span;
                                    }
                                }
                            }
                            var groupSort;
                            if (thisiscard) {
                                groupSort = function (name) {
                                    var type = lib.card[name[2]].type;
                                    if (lib.cardType[type]) {
                                        return lib.cardType[type];
                                    }
                                    switch (type) {
                                        case 'basic':
                                            return 0;
                                        case 'chess':
                                            return 1.5;
                                        case 'trick':
                                            return 2;
                                        case 'delay':
                                            return 3;
                                        case 'equip':
                                            return 4;
                                        case 'zhenfa':
                                            return 5;
                                        default:
                                            return 6;
                                    }
                                };
                            } else {
                                var getGroup = function (name) {
                                    var group = get.is.double(name, true);
                                    if (group) return group[0];
                                    return lib.character[name][1];
                                }
                                groupSort = function (name) {
                                    if (!lib.character[name]) return 7;
                                    var group = getGroup(name);
                                    if (group == 'shen') return -1;
                                    if (group == 'wei') return 0;
                                    if (group == 'shu') return 1;
                                    if (group == 'wu') return 2;
                                    if (group == 'qun') return 3;
                                    if (group == 'jin') return 4;
                                    if (group == 'key') return -Infinity;
                                    if (group === 'qingyao_xian') return 9;
                                    if (group == 'western') return 6;
                                    return 7;
                                }
                            }
                            list.sort(function (a, b) {
                                var del = groupSort(a) - groupSort(b);
                                if (del != 0) return del;
                                var aa = a, bb = b;
                                if (a.indexOf('_') != -1) {
                                    a = a.slice(a.lastIndexOf('_') + 1);
                                }
                                if (b.indexOf('_') != -1) {
                                    b = b.slice(b.lastIndexOf('_') + 1);
                                }
                                if (a != b) {
                                    return a > b ? 1 : -1;
                                }
                                return aa > bb ? 1 : -1;
                            });
                            dialog = ui.create.dialog('hidden');
                            dialog.classList.add('noupdate');
                            dialog.classList.add('scroll1');
                            dialog.classList.add('scroll2');
                            dialog.classList.add('scroll3');
                            dialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
                                _status.clicked2 = true;
                            });
                            if (heightset) {
                                dialog.style.height = ((game.layout == 'long2' || game.layout == 'nova') ? 380 : 350) + 'px';
                                dialog._scrollset = true;
                            }
                            dialog.getCurrentCapt = function (link, capt, noalph) {
                                var currentcapt = noalph ? this.currentcapt2 : this.currentcapt;
                                if (this.seperatelist && noalph) {
                                    if (this.seperatelist[currentcapt].contains(link)) return capt;
                                    return null;
                                }
                                if (lib.characterDialogGroup[currentcapt]) {
                                    return lib.characterDialogGroup[currentcapt](link, capt);
                                }
                                if (lib.characterPack[currentcapt]) {
                                    if (lib.characterPack[currentcapt][link]) {
                                        return capt;
                                    }
                                    return null;
                                }
                                return this.currentcapt;
                            }
                            if (str) {
                                dialog.add(str);
                            }
                            dialog.add(node);
                            if (thisiscard) {
                                if (seperate) {
                                    seperate = seperate(list);
                                    dialog.seperate = [];
                                    dialog.seperatelist = seperate.list;
                                    if (dialog.seperatelist) {
                                        newlined = document.createElement('div');
                                        newlined.style.marginTop = '5px';
                                        newlined.style.display = 'block';
                                        newlined.style.fontFamily = 'xinwei';
                                        if (get.is.phoneLayout()) {
                                            newlined.style.fontSize = '32px';
                                        } else {
                                            newlined.style.fontSize = '22px';
                                        }
                                        newlined.style.textAlign = 'center';
                                        node.appendChild(newlined);
                                        for (var i in dialog.seperatelist) {
                                            var span = document.createElement('span');
                                            span.style.margin = '3px';
                                            span.innerHTML = i;
                                            span.link = i;
                                            span.seperate = true;
                                            span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                                            newlined.appendChild(span);
                                        }
                                    }
                                    for (var i in seperate) {
                                        if (i == 'list') continue;
                                        var link = '';
                                        var linkcontent = seperate[i];
                                        if (i.indexOf('_link:') != -1) {
                                            link = i.slice(i.indexOf('_link:') + 6);
                                            i = i.slice(0, i.indexOf('_link:'));
                                        }
                                        var nodesep = dialog.add(i);
                                        nodesep.link = link;
                                        dialog.seperate.push(nodesep);
                                        dialog.add([linkcontent, 'vcard'], noclick);
                                    }
                                } else {
                                    dialog.add([list, 'vcard'], noclick);
                                }
                            } else {
                                if (precharacter) {
                                    dialog.add([list, 'precharacter'], noclick);
                                } else if (characterx) {
                                    dialog.add([list, 'characterx'], noclick);
                                } else {
                                    dialog.add([list, 'character'], noclick);

                                    var createSearchInput = function (dialog) {
                                        var div = ui.create.div(dialog.content, 1, {
                                            display: 'block',
                                        });
                                        var input = ui.create.node('input', div);
                                        var select = ui.create.node('select', div);
                                        var options = [{
                                            text: '武将id',
                                            value: 'id',
                                            defaultSelected: false,
                                        }, {
                                            text: '武将名称',
                                            value: 'name',
                                            defaultSelected: true,
                                        }];
                                        options.forEach(value => {
                                            var option = new Option(value.text, value.value, value.defaultSelected);
                                            option.selected = value.defaultSelected;
                                            select.appendChild(option);
                                        });
                                        select.onchange = function () {
                                            input.placeholder = this.value === 'id' ? '按武将ID搜索' : '按武将名称搜索';
                                        }
                                        input.placeholder = '按武将名称搜索';
                                        var toggleButtons = function () {
                                            var mode = select.value;
                                            var inputValue = this.value;
                                            var buttons = Array.from(dialog.querySelectorAll('.button'))
                                            buttons.forEach(value => {
                                                var link = value.link;
                                                var buttonName = link;
                                                if (mode === 'name') buttonName = get.translation(link);
                                                if (this.value === '') return value.classList.remove('nodisplay');
                                                value.classList.toggle('nodisplay', buttonName.indexOf(inputValue) === -1);
                                            });
                                            return true;
                                        }
                                        input.onkeydown = function (event) {
                                            event && event.stopPropagation();
                                            if (event.keyCode === 13) this.oninput(event);
                                        };
                                        input.oninput = event => toggleButtons.call(input) && event.stopPropagation();
                                        dialog.searchInput = input;
                                        dialog.select = select;
                                    }

                                    createSearchInput(dialog);
                                }
                            }
                            dialog.add(ui.create.div('.placeholder'));
                            for (i = 0; i < dialog.buttons.length; i++) {
                                if (thisiscard) {
                                    dialog.buttons[i].capt = getCapt(dialog.buttons[i].link[2]);
                                } else {
                                    dialog.buttons[i].group = lib.character[dialog.buttons[i].link][1];
                                    dialog.buttons[i].capt = getCapt(dialog.buttons[i].link);
                                }
                            }
                            if (!expandall) {
                                if (!thisiscard && (lib.characterDialogGroup[lib.config.character_dialog_tool] ||
                                    lib.config.character_dialog_tool == '自创')) {
                                    clickCapt.call(node[lib.config.character_dialog_tool]);
                                }
                            }
                            return dialog;
                        },
                    };
                    Object.assign(ui.create, createDialog);
                    //换将dialog框
                    lib.choosePlayer = {
                        // 根据模式走不同的方法
                        chooseCharacter: function (target) {
                            var mode = lib.config.mode;
                            if (mode === 'identity' || mode === 'doudizhu') return lib.choosePlayer.chooseCharacterShenFen.call(target);
                            else if (mode === 'guozhan') return lib.choosePlayer.chooseCharacterGuoZhan.call(target);
                        },
                        // 身份模式
                        chooseCharacterShenFen: function () {
                            /*if (_status.mode == 'purple') {
                                game.chooseCharacterPurple();
                                return;
                            }*/
                            // 斗地主判断
                            /*if (_status.mode == 'online') {
                                game.chooseCharacterZhidou();
                                return;
                            }
                            if (_status.mode == 'kaihei') {
                                game.chooseCharacterKaihei();
                                return;
                            }
                            if (_status.mode == 'huanle') {
                                game.chooseCharacterHuanle();
                                return;
                            }
                            if (_status.mode == 'binglin') {
                                game.chooseCharacterBinglin();
                                return;
                            }*/
                            var next = game.createEvent('chooseCharacter', false);
                            next.target = this;
                            next.player = game.me;
                            next.filter = function (name) {
                                //if (lib.character[name][1] === 'key' || name.indexOf("key") === 0) return false;
                                return true;
                            };
                            next.showConfig = true;
                            next.addPlayer = function (player) {
                                var list = lib.config.mode_config.identity.identity[game.players.length - 3].slice(0);
                                var list2 = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
                                for (var i = 0; i < list.length; i++) list2.remove(list[i]);
                                player.identity = list2[0];
                                player.setIdentity('cai');
                            };
                            next.removePlayer = function () {
                                return game.players.randomGet(target, game.zhu);
                            };
                            next.setContent(function () {
                                "step 0"
                                ui.arena.classList.add('choose-character');
                                var i;
                                var list;
                                var list2 = [];
                                var list3 = [];
                                var list4 = [];
                                var identityList;
                                var chosen = lib.config.continue_name || [];
                                game.saveConfig('continue_name');
                                event.chosen = chosen;
                                if (_status.mode === 'zhong') {
                                    event.zhongmode = true;
                                    identityList = ['zhu', 'zhong', 'mingzhong', 'nei', 'fan', 'fan', 'fan', 'fan'];
                                } else {
                                    identityList = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
                                    if (get.config('double_nei')) {
                                        switch (get.playerNumber()) {
                                            case 8:
                                                identityList.remove('fan');
                                                identityList.push('nei');
                                                break;
                                            case 7:
                                                identityList.remove('zhong');
                                                identityList.push('nei');
                                                break;
                                            case 6:
                                                identityList.remove('fan');
                                                identityList.push('nei');
                                                break;
                                            case 5:
                                                identityList.remove('fan');
                                                identityList.push('nei');
                                                break;
                                            case 4:
                                                identityList.remove('zhong');
                                                identityList.push('nei');
                                                break;
                                            case 3:
                                                identityList.remove('fan');
                                                identityList.push('nei');
                                                break;
                                        }
                                    }
                                }
                                var addSetting = function (dialog) {
                                    dialog.add('选择身份').classList.add('add-setting');
                                    var table = document.createElement('div');
                                    table.classList.add('add-setting');
                                    table.style.margin = '0';
                                    table.style.width = '100%';
                                    table.style.position = 'relative';
                                    var listi;
                                    if (event.zhongmode) {
                                        listi = ['random', 'zhu', 'mingzhong', 'zhong', 'nei', 'fan'];
                                    } else {
                                        listi = ['random', 'zhu', 'zhong', 'nei', 'fan'];
                                    }
                                    for (var i = 0; i < listi.length; i++) {
                                        var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                                        td.link = listi[i];
                                        if (td.link === target.identity) {
                                            td.classList.add('bluebg');
                                        }
                                        table.appendChild(td);
                                        td.innerHTML = '<span>' + get.translation(listi[i] + '2') + '</span>';
                                        td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                            if (_status.dragged) return;
                                            if (_status.justdragged) return;
                                            _status.tempNoButton = true;
                                            setTimeout(function () {
                                                _status.tempNoButton = false;
                                            }, 500);
                                            var link = this.link;
                                            if (game.zhu.name) {
                                                if (link != 'random') {
                                                    _status.event.parent.fixedseat = get.distance(target, game.zhu, 'absolute');
                                                }
                                                game.zhu.uninit();
                                                delete game.zhu.isZhu;
                                                delete game.zhu.identityShown;
                                            }
                                            var current = this.parentNode.querySelector('.bluebg');
                                            if (current) {
                                                current.classList.remove('bluebg');
                                            }
                                            current = seats.querySelector('.bluebg');
                                            if (current) {
                                                current.classList.remove('bluebg');
                                            }
                                            if (link == 'random') {
                                                if (event.zhongmode) {
                                                    link = ['zhu', 'zhong', 'nei', 'fan', 'mingzhong'].randomGet();
                                                } else {
                                                    link = ['zhu', 'zhong', 'nei', 'fan'].randomGet();
                                                }
                                                for (var i = 0; i < this.parentNode.childElementCount; i++) {
                                                    if (this.parentNode.childNodes[i].link == link) {
                                                        this.parentNode.childNodes[i].classList.add('bluebg');
                                                    }
                                                }
                                            } else {
                                                this.classList.add('bluebg');
                                            }
                                            num = get.config('choice_' + link);
                                            if (event.zhongmode) {
                                                num = 6;
                                                if (link == 'zhu' || link == 'nei' || link == 'mingzhong') {
                                                    num = 8;
                                                }
                                            }
                                            _status.event.parent.swapnodialog = function (dialog, list) {
                                                var buttons = ui.create.div('.buttons');
                                                var node = dialog.buttons[0].parentNode;
                                                dialog.buttons = ui.create.buttons(list, 'characterx', buttons);
                                                dialog.content.insertBefore(buttons, node);
                                                buttons.animate('start');
                                                node.remove();
                                                game.uncheck();
                                                game.check();
                                                for (var i = 0; i < seats.childElementCount; i++) {
                                                    if (get.distance(game.zhu, target, 'absolute') === seats.childNodes[i].link) {
                                                        seats.childNodes[i].classList.add('bluebg');
                                                    }
                                                }
                                            }
                                            _status.event = _status.event.parent;
                                            _status.event.step = 0;
                                            _status.event.identity = link;
                                            if (link != (event.zhongmode ? 'mingzhong' : 'zhu')) {
                                                seats.previousSibling.style.display = '';
                                                seats.style.display = '';
                                            } else {
                                                seats.previousSibling.style.display = 'none';
                                                seats.style.display = 'none';
                                            }
                                            game.resume();
                                        });
                                    }
                                    dialog.content.appendChild(table);
                                    dialog.add('选择座位').classList.add('add-setting');
                                    var seats = document.createElement('div');
                                    seats.classList.add('add-setting');
                                    seats.style.margin = '0';
                                    seats.style.width = '100%';
                                    seats.style.position = 'relative';
                                    for (var i = 2; i <= game.players.length; i++) {
                                        var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                                        td.innerHTML = get.cnNumber(i, true);
                                        td.link = i - 1;
                                        seats.appendChild(td);
                                        if (get.distance(game.zhu, target, 'absolute') === i - 1) {
                                            td.classList.add('bluebg');
                                        }
                                        td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                            if (_status.dragged) return;
                                            if (_status.justdragged) return;
                                            if (get.distance(game.zhu, target, 'absolute') == this.link) return;
                                            var current = this.parentNode.querySelector('.bluebg');
                                            if (current) {
                                                current.classList.remove('bluebg');
                                            }
                                            this.classList.add('bluebg');
                                            for (var i = 0; i < game.players.length; i++) {
                                                if (get.distance(game.players[i], target, 'absolute') == this.link) {
                                                    game.swapSeat(game.zhu, game.players[i], false);
                                                    return;
                                                }
                                            }
                                        });
                                    }
                                    dialog.content.appendChild(seats);
                                    if (target == game.zhu) {
                                        seats.previousSibling.style.display = 'none';
                                        seats.style.display = 'none';
                                    }

                                    dialog.add(ui.create.div('.placeholder.add-setting'));
                                    dialog.add(ui.create.div('.placeholder.add-setting'));
                                    if (get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
                                };
                                var removeSetting = function () {
                                    var dialog = _status.event.dialog;
                                    if (dialog) {
                                        dialog.style.height = '';
                                        delete dialog._scrollset;
                                        var list = Array.from(dialog.querySelectorAll('.add-setting'));
                                        while (list.length) {
                                            list.shift().remove();
                                        }
                                        ui.update();
                                    }
                                };
                                event.list = [];
                                identityList.randomSort();
                                if (event.identity) {
                                    identityList.remove(event.identity);
                                    identityList.unshift(event.identity);
                                    if (event.fixedseat) {
                                        var zhuIdentity = (_status.mode == 'zhong') ? 'mingzhong' : 'zhu';
                                        if (zhuIdentity != event.identity) {
                                            identityList.remove(zhuIdentity);
                                            identityList.splice(event.fixedseat, 0, zhuIdentity);
                                        }
                                        delete event.fixedseat;
                                    }
                                    delete event.identity;
                                } else if (_status.mode != 'zhong' && (!_status.brawl || !_status.brawl.identityShown)) {
                                    var ban_identity = [];
                                    ban_identity.push(get.config('ban_identity') || 'off');
                                    if (ban_identity[0] != 'off') {
                                        ban_identity.push(get.config('ban_identity2') || 'off');
                                        if (ban_identity[1] != 'off') {
                                            ban_identity.push(get.config('ban_identity3') || 'off');
                                        }
                                    }
                                    ban_identity.remove('off');
                                    if (ban_identity.length) {
                                        var identityList2 = identityList.slice(0);
                                        for (var i = 0; i < ban_identity.length; i++) {
                                            while (identityList2.remove(ban_identity[i])) ;
                                        }
                                        ban_identity = identityList2.randomGet();
                                        identityList.remove(ban_identity);
                                        identityList.splice(game.players.indexOf(target), 0, ban_identity);
                                    }
                                }
                                if (get.config('special_identity') && !event.zhongmode && game.players.length == 8) {
                                    for (var i = 0; i < game.players.length; i++) {
                                        delete game.players[i].special_identity;
                                    }
                                    event.special_identity = [];
                                    var zhongs = game.filterPlayer(function (current) {
                                        return current.identity == 'zhong';
                                    });
                                    var fans = game.filterPlayer(function (current) {
                                        return current.identity == 'fan';
                                    });
                                    if (fans.length >= 1) {
                                        fans.randomRemove().special_identity = 'identity_zeishou';
                                        event.special_identity.push('identity_zeishou');
                                    }
                                    if (zhongs.length > 1) {
                                        zhongs.randomRemove().special_identity = 'identity_dajiang';
                                        zhongs.randomRemove().special_identity = 'identity_junshi';
                                        event.special_identity.push('identity_dajiang');
                                        event.special_identity.push('identity_junshi');
                                    } else if (zhongs.length == 1) {
                                        if (Math.random() < 0.5) {
                                            zhongs.randomRemove().special_identity = 'identity_dajiang';
                                            event.special_identity.push('identity_dajiang');
                                        } else {
                                            zhongs.randomRemove().special_identity = 'identity_junshi';
                                            event.special_identity.push('identity_junshi');
                                        }
                                    }
                                }
                                if (!game.zhu) game.zhu = target;
                                else {
                                    game.zhu.setIdentity();
                                    game.zhu.identityShown = true;
                                    game.zhu.isZhu = (game.zhu.identity == 'zhu');
                                    game.zhu.node.identity.classList.remove('guessing');
                                    /*target.setIdentity();
                                    target.node.identity.classList.remove('guessing');*/
                                }
                                //选将框分配
                                for (i in lib.characterReplace) {
                                    var ix = lib.characterReplace[i];
                                    for (var j = 0; j < ix.length; j++) {
                                        if (chosen.contains(ix[j]) || lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
                                    }
                                    if (ix.length) {
                                        event.list.push(i);
                                        list4.addArray(ix);
                                        var bool = false;
                                        for (var j of ix) {
                                            if (lib.character[j][4] && lib.character[j][4].contains('zhu')) {
                                                bool = true;
                                                break;
                                            }
                                        }
                                        (bool ? list2 : list3).push(i);
                                    }
                                }
                                for (i in lib.character) {
                                    if (list4.contains(i)) continue;
                                    if (chosen.contains(i)) continue;
                                    if (lib.filter.characterDisabled(i)) continue;

                                    if (typeof event.filter === 'function' && event.filter(i) === false) continue;

                                    event.list.push(i);
                                    list4.push(i);
                                    if (lib.character[i][4] && lib.character[i][4].contains('zhu')) {
                                        list2.push(i);
                                    } else {
                                        list3.push(i);
                                    }
                                }
                                list2.sort(lib.sort.character);
                                event.list.randomSort();
                                _status.characterlist = list4.slice(0).randomSort();
                                list3.randomSort();
                                if (_status.brawl && _status.brawl.chooseCharacterFilter) {
                                    _status.brawl.chooseCharacterFilter(event.list, list2, list3);
                                }
                                var num = get.config('choice_' + target.identity);
                                if (event.zhongmode) {
                                    num = 6;
                                    if (target.identity == 'zhu' || target.identity == 'nei' || target.identity == 'mingzhong') {
                                        num = 8;
                                    }
                                }
                                if (target === game.zhu && lib.config.mode !== "doudizhu") {
                                    list = list2.concat(list3.slice(0, num));
                                } else {
                                    list = list3.slice(0, 8);
                                }
                                // }
                                delete event.swapnochoose;
                                var dialog;
                                if (event.swapnodialog) {
                                    dialog = ui.dialog;
                                    event.swapnodialog(dialog, list);
                                    delete event.swapnodialog;
                                } else {
                                    var str = '选择角色';
                                    if (_status.brawl && _status.brawl.chooseCharacterStr) {
                                        str = _status.brawl.chooseCharacterStr;
                                    }
                                    dialog = ui.create.dialog(str, 'hidden', [list, 'characterx']);
                                    /*if(!_status.brawl||!_status.brawl.noAddSetting){
                                        if(get.config('change_identity')){
                                            addSetting(dialog);
                                        }
                                    }*/
                                }

                                var createSearchInput = function (dialog) {
                                    var div = ui.create.div(dialog.content, 1, {
                                        display: 'block',
                                    });
                                    var input = ui.create.node('input', div);
                                    var select = ui.create.node('select', div);
                                    var options = [{
                                        text: '武将id',
                                        value: 'id',
                                        defaultSelected: false,
                                    }, {
                                        text: '武将名称',
                                        value: 'name',
                                        defaultSelected: true,
                                    }];
                                    options.forEach(value => {
                                        var option = new Option(value.text, value.value, value.defaultSelected);
                                        option.selected = value.defaultSelected;
                                        select.appendChild(option);
                                    });
                                    select.onchange = function () {
                                        input.placeholder = this.value === 'id' ? '按武将ID搜索' : '按武将名称搜索';
                                    }
                                    input.placeholder = '按武将名称搜索';
                                    var toggleButtons = function () {
                                        var mode = select.value;
                                        var inputValue = this.value;
                                        var buttons = Array.from(dialog.querySelectorAll('.button'))
                                        buttons.forEach(value => {
                                            var link = value.link;
                                            var buttonName = link;
                                            if (mode === 'name') buttonName = get.translation(link);
                                            if (this.value === '') return value.classList.remove('nodisplay');
                                            value.classList.toggle('nodisplay', buttonName.indexOf(inputValue) === -1);
                                        });
                                        return true;
                                    }
                                    input.onkeydown = function (event) {
                                        event && event.stopPropagation();
                                        if (event.keyCode === 13) this.oninput(event);
                                    };
                                    input.oninput = event => toggleButtons.call(input) && event.stopPropagation();
                                    dialog.searchInput = input;
                                    dialog.select = select;
                                }

                                createSearchInput(dialog);

                                dialog.searchInput.disabled = true;
                                dialog.searchInput.placeholder = '点击【自由选将】搜索';
                                dialog.select.disabled = true;

                                if (target.special_identity) {
                                    dialog.setCaption('选择角色（' + get.translation(target.special_identity) + '）');
                                    target.node.identity.firstChild.innerHTML = get.translation(target.special_identity + '_bg');
                                } else {
                                    dialog.setCaption('选择角色');
                                    //target.setIdentity();
                                }
                                if (lib.onfree) {
                                    lib.onfree.push(function () {
                                        event.dialogxx = ui.create.characterDialog('heightset', target);
                                    });
                                } else {
                                    event.dialogxx = ui.create.characterDialog('heightset', target);
                                }

                                // createSearchInput(event.dialogxx);
                                /*自动改为全部*/
                                /*if (event.dialogxx.currentcaptnode2) {
                                    if (lib.config.touchscreen) {
                                        event.dialogxx.currentcaptnode2.dispatchEvent(new DragEvent('touchend', {
                                            cancelable: true,
                                            composed: true
                                        }))
                                    } else {
                                        event.dialogxx.currentcaptnode2.click();
                                    }
                                }*/
                                /*补充所有武将*/
                                var charactersKey = Object.keys(lib.character).removeArray(event.dialogxx.buttons.map(value => value.link)).filter(value => {
                                    var character = lib.character[value];
                                    if (!character || !character[4]) return false;
                                    return !character[4].contains('unseen')
                                });
                                if (!event.chosen.length) {
                                    game.me.chooseButton(event.dialogxx, true).set('onfree', true).selectButton = function () {
                                        if ((_status.brawl && _status.brawl.doubleCharacter) || (target == game.zhu && _status.mode == 'online')) return 2;
                                        return get.config('double_character') ? 2 : 1
                                    };
                                } else {
                                    lib.init.onfree();
                                }

                                var buttons1 = ui.create.buttons(charactersKey, 'character', event.dialogxx.querySelector(".buttons"));
                                event.dialogxx.buttons = event.dialogxx.buttons.concat(buttons1);
                                const getCapt = function (str) {
                                    var capt;
                                    if (str.indexOf('_') == -1) {
                                        capt = str[0];
                                    } else {
                                        capt = str[str.lastIndexOf('_') + 1];
                                    }
                                    capt = capt.toLowerCase();
                                    if (!/[a-z]/i.test(capt)) {
                                        capt = '自定义';
                                    }
                                    return capt;
                                }
                                buttons1.forEach(item => {
                                    item.group = lib.character[item.link][1];
                                    item.capt = getCapt(item.link);
                                    item.classList.add('nodisplay')
                                })
                                // event.dialogxx.add([charactersKey, 'character']);


                                "step 1"
                                if (_status.mode == 'online') event.cardPile = target.storage.doudizhu_cardPile;
                                if (ui.cheat) {
                                    ui.cheat.close();
                                    delete ui.cheat;
                                }
                                if (ui.cheat2) {
                                    ui.cheat2.close();
                                    delete ui.cheat2;
                                }
                                var chooseGroup = false;
                                if (event.chosen.length) {
                                    if (lib.character[event.chosen[0]][1] == 'shen' && !lib.character[event.chosen[0]][4].contains('hiddenSkill')) {
                                        chooseGroup = true;
                                    }
                                } else if (event.modchosen) {
                                    if (event.modchosen[0] == 'random') event.modchosen[0] = result.buttons[0].link;
                                    else event.modchosen[1] = result.buttons[0].link;
                                } else if (result.buttons.length == 2) {
                                    event.choosed = [result.buttons[0].link, result.buttons[1].link];
                                    game.addRecentCharacter(result.buttons[0].link, result.buttons[1].link);
                                    if (lib.character[event.choosed[0]][1] == 'shen' && !lib.character[event.choosed[0]][4].contains('hiddenSkill')) {
                                        chooseGroup = true;
                                    }
                                } else {
                                    event.choosed = [result.buttons[0].link];
                                    if (lib.character[event.choosed[0]][1] == 'shen' && !lib.character[event.choosed[0]][4].contains('hiddenSkill')) {
                                        chooseGroup = true;
                                    }
                                    game.addRecentCharacter(result.buttons[0].link);
                                }
                                if (get.config('choose_group') && chooseGroup) {
                                    var list = lib.group.slice(0);
                                    list.remove('shen');
                                    game.me.chooseControl(list).prompt = '请选择神武将的势力';
                                }
                                "step 2"
                                event.group = result.control || false;
                                if (event.chosen.length) {
                                    lib.element.player.uninit.call(target);
                                    lib.element.player.init.call(target, event.chosen[0], event.chosen[1]);
                                } else if (event.modchosen) {
                                    lib.element.player.uninit.call(target);
                                    lib.element.player.init.call(target, event.modchosen[0], event.modchosen[1]);
                                } else if (event.choosed.length == 2) {
                                    lib.element.player.uninit.call(target);
                                    lib.element.player.init.call(target, event.choosed[0], event.choosed[1]);
                                } else {
                                    lib.element.player.uninit.call(target);
                                    lib.element.player.init.call(target, event.choosed[0]);
                                }
                                event.list.remove(get.sourceCharacter(target.name1));
                                event.list.remove(get.sourceCharacter(target.name2));
                                if (target == game.zhu && _status.mode != 'purple') {
                                    if (game.players.length > 4 || get.mode() == 'doudizhu') {
                                        target.hp++;
                                        target.maxHp++;
                                        target.update();
                                    }
                                    if (get.mode() == 'identity') {
                                        var enhance_zhu = false;
                                        if (_status.connectMode) {
                                            enhance_zhu = (_status.mode != 'zhong' && _status.mode != 'purple' && lib.configOL.enhance_zhu && get.population('fan') >= 3);
                                        } else {
                                            enhance_zhu = (_status.mode != 'zhong' && _status.mode != 'purple' && get.config('enhance_zhu') && get.population('fan') >= 3);
                                        }
                                        if (enhance_zhu) {
                                            var skill;
                                            switch (game.zhu.name) {
                                                case 'key_yuri':
                                                    skill = 'buqu';
                                                    break;
                                                case 'liubei':
                                                    skill = 'jizhen';
                                                    break;
                                                case 'dongzhuo':
                                                    skill = 'hengzheng';
                                                    break;
                                                case 'sunquan':
                                                    skill = 'batu';
                                                    break;
                                                case 'sp_zhangjiao':
                                                    skill = 'tiangong';
                                                    break;
                                                case 'liushan':
                                                    skill = 'shengxi';
                                                    break;
                                                case 'sunce':
                                                    skill = 'ciqiu';
                                                    break;
                                                case 're_sunben':
                                                    skill = 'ciqiu';
                                                    break;
                                                case 'yuanshao':
                                                    skill = 'geju';
                                                    break;
                                                case 're_caocao':
                                                    skill = 'dangping';
                                                    break;
                                                case 'caopi':
                                                    skill = 'junxing';
                                                    break;
                                                case 'liuxie':
                                                    skill = 'moukui';
                                                    break;
                                                default:
                                                    skill = 'tianming';
                                                    break;
                                            }
                                            game.broadcastAll(function (player, skill) {
                                                target.addSkill(skill);
                                                target.storage.enhance_zhu = skill;
                                            }, game.zhu, skill);
                                        }
                                    }
                                    if (get.mode() == 'doudizhu') {
                                        if (['normal', 'huanle', 'kaihei'].contains(_status.mode)) {
                                            var skill = ['feiyang', 'bahu'];
                                            game.broadcastAll(function (player, skill) {
                                                target.addSkill(skill);
                                            }, game.zhu, skill);
                                        }
                                        if (_status.mode == 'binglin') {
                                            var skill = game.zhuSkill;
                                            game.broadcastAll(function (player, skill) {
                                                target.addSkill(skill);
                                            }, game.zhu, skill);
                                        }
                                    }
                                } else {
                                    if (_status.mode == 'binglin') {
                                        var skill = ['binglin_shaxue', 'binglin_neihong'];
                                        game.broadcastAll(function (player, skill) {
                                            target.addSkill(skill);
                                        }, target, skill);
                                    }
                                }
                                if (_status.mode == 'online') {
                                    game.zhu.hp = 4;
                                    game.zhu.maxHp = 4;
                                    game.zhu.update();
                                    target.storage.doudizhu_cardPile = event.cardPile;
                                    target.markSkill('doudizhu_cardPile');
                                }
                                if (_status.mode == 'purple') {
                                    if (target == game.rZhu || target == game.bZhu) {
                                        target.hp++;
                                        target.maxHp++;
                                        target.update();
                                    }
                                }
                                /*for(var i=0;i<game.players.length;i++){
                                    if(game.players[i]!=game.zhu&&game.players[i]!=target){
                                        event.list.randomSort();
                                        event.ai(game.players[i],event.list.splice(0,get.config('choice_'+game.players[i].identity)),null,event.list)
                                    }
                                }*/
                                "step 3"
                                if (event.group) {
                                    target.group = event.group;
                                    target.node.name.dataset.nature = get.groupnature(target.group);
                                    target.update();
                                }
                                for (var i = 0; i < game.players.length; i++) {
                                    _status.characterlist.remove(game.players[i].name);
                                    _status.characterlist.remove(game.players[i].name1);
                                    _status.characterlist.remove(game.players[i].name2);
                                }
                                "step 4"
                                setTimeout(function () {
                                    ui.arena.classList.remove('choose-character');
                                }, 500);

                                if (event.special_identity) {
                                    for (var i = 0; i < event.special_identity.length; i++) {
                                        game.zhu.addSkill(event.special_identity[i]);
                                    }
                                }
                            });
                        },
                        // 国战
                        chooseCharacterGuoZhan: function () {
                            var next = game.createEvent('chooseCharacter', false);
                            next.showConfig = true;
                            next.addPlayer = true;
                            next.target = this;
                            next.player = game.me;
                            next.ai = function (player, list, back) {
                                if (_status.brawl && _status.brawl.chooseCharacterAi) {
                                    if (_status.brawl.chooseCharacterAi(player, list, back) !== false) {
                                        return;
                                    }
                                }
                                var filterChoice = function (name1, name2) {
                                    if (get.is.double(name1)) return false;
                                    var group1 = lib.character[name1][1];
                                    var group2 = lib.character[name2][1];
                                    if (group1 == 'ye') return group2 != 'ye';
                                    var double = get.is.double(name2, true);
                                    if (double) return double.contains(group1);
                                    return group1 == group2;
                                };
                                for (var i = 0; i < list.length - 1; i++) {
                                    for (var j = i + 1; j < list.length; j++) {
                                        if (filterChoice(list[i], list[j]) || filterChoice(list[j], list[i])) {
                                            var mainx = list[i];
                                            var vicex = list[j];
                                            if (!filterChoice(mainx, vicex) || (filterChoice(vicex, mainx) && get.guozhanReverse(mainx, vicex))) {
                                                mainx = list[j];
                                                vicex = list[i];
                                            }
                                            player.init(mainx, vicex, false);
                                            if (back) {
                                                list.remove(player.name1);
                                                list.remove(player.name2);
                                                for (var i = 0; i < list.length; i++) {
                                                    back.push(list[i]);
                                                }
                                            }
                                            return;
                                        }
                                    }
                                }
                            }
                            next.setContent(function () {
                                "step 0"
                                ui.arena.classList.add('choose-character');
                                var addSetting = function (dialog) {
                                    dialog.add('选择座位').classList.add('add-setting');
                                    var seats = document.createElement('table');
                                    seats.classList.add('add-setting');
                                    seats.style.margin = '0';
                                    seats.style.width = '100%';
                                    seats.style.position = 'relative';
                                    for (var i = 1; i <= game.players.length; i++) {
                                        var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                                        td.innerHTML = '<span>' + get.cnNumber(i, true) + '</span>';
                                        td.link = i - 1;
                                        seats.appendChild(td);
                                        td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                            if (_status.dragged) return;
                                            if (_status.justdragged) return;
                                            if (_status.cheat_seat) {
                                                _status.cheat_seat.classList.remove('bluebg');
                                                if (_status.cheat_seat == this) {
                                                    delete _status.cheat_seat;
                                                    return;
                                                }
                                            }
                                            this.classList.add('bluebg');
                                            _status.cheat_seat = this;
                                        });
                                    }
                                    dialog.content.appendChild(seats);
                                    if (game.me == game.zhu) {
                                        seats.previousSibling.style.display = 'none';
                                        seats.style.display = 'none';
                                    }
                                    dialog.add(ui.create.div('.placeholder.add-setting'));
                                    dialog.add(ui.create.div('.placeholder.add-setting'));
                                    if (get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
                                };
                                var removeSetting = function () {
                                    var dialog = _status.event.dialog;
                                    if (dialog) {
                                        dialog.style.height = '';
                                        delete dialog._scrollset;
                                        var list = Array.from(dialog.querySelectorAll('.add-setting'));
                                        while (list.length) {
                                            list.shift().remove();
                                        }
                                        ui.update();
                                    }
                                };
                                event.addSetting = addSetting;
                                event.removeSetting = removeSetting;
                                var chosen = lib.config.continue_name || [];
                                game.saveConfig('continue_name');
                                event.chosen = chosen;
                                var i;
                                event.list = [];
                                for (i in lib.character) {
                                    if (i.indexOf('gz_shibing') == 0) continue;
                                    //if (i.indexOf('key') === 0) continue;
                                    //if (lib.character[i][1] === 'key') continue;
                                    if (chosen.contains(i)) continue;
                                    if (lib.filter.characterDisabled(i)) continue;
                                    if (get.config('onlyguozhan')) {
                                        if (!lib.characterPack.mode_guozhan[i]) continue;
                                        if (get.is.jun(i)) continue;
                                    }
                                    if (lib.character[i][4].contains('hiddenSkill')) continue;
                                    if (lib.character[i][2] == 3 || lib.character[i][2] == 4 || lib.character[i][2] == 5)
                                        event.list.push(i);

                                }
                                _status.characterlist = event.list.slice(0);
                                _status.yeidentity = [];
                                if (_status.brawl && _status.brawl.chooseCharacterFilter) {
                                    event.list = _status.brawl.chooseCharacterFilter(event.list);
                                }
                                event.list.randomSort();
                                // var list=event.list.splice(0,parseInt(get.config('choice_num')));
                                var list;
                                if (_status.brawl && _status.brawl.chooseCharacter) {
                                    list = _status.brawl.chooseCharacter(event.list, game.me);
                                } else {
                                    list = game.getCharacterChoice(event.list, parseInt(get.config('choice_num')));
                                }
                                if (_status.auto) {
                                    event.ai(target, list);
                                    lib.init.onfree();
                                } else if (chosen.length) {
                                    game.me.init(chosen[0], chosen[1], false);
                                    lib.init.onfree();
                                } else {
                                    event.dialogxx = ui.create.characterDialog('heightset', function (i) {
                                        if (i.indexOf('gz_shibing') == 0) return true;
                                        if (get.config('onlyguozhan')) {
                                            if (!lib.characterPack.mode_guozhan[i]) return true;
                                            if (get.is.jun(i)) return true;
                                        }
                                    }, get.config('onlyguozhanexpand') ? 'expandall' : undefined, get.config('onlyguozhan') ? 'onlypack:mode_guozhan' : undefined, target);
                                    var dialog = ui.create.dialog('选择角色', 'hidden', [list, 'character']);
                                    if (!_status.brawl || !_status.brawl.noAddSetting) {
                                        if (get.config('change_identity')) {
                                            addSetting(dialog);
                                        }
                                    }
                                    var next = game.me.chooseButton(event.dialogxx, true, 2).set('onfree', true);
                                    next.filterButton = function (button) {
                                        if (ui.dialog.buttons.length <= 10) {
                                            for (var i = 0; i < ui.dialog.buttons.length; i++) {
                                                if (ui.dialog.buttons[i] != button) {
                                                    if (lib.element.player.perfectPair.call({
                                                        name1: button.link, name2: ui.dialog.buttons[i].link
                                                    })) {
                                                        button.classList.add('glow2');
                                                    }
                                                }
                                            }
                                        }
                                        if (lib.character[button.link][4].contains('hiddenSkill')) return false;
                                        if (ui.selected.buttons.length == 0) {
                                            if (get.is.double(button.link)) return false;
                                            if (lib.character[button.link][1] == 'ye') return true;
                                            for (var i = 0; i < ui.dialog.buttons.length; i++) {
                                                var double = get.is.double(ui.dialog.buttons[i].link, true);
                                                if (ui.dialog.buttons[i] != button && (lib.character[button.link][1] == lib.character[ui.dialog.buttons[i].link][1] || double && double.contains(lib.character[button.link][1]))) {
                                                    return true;
                                                }
                                            }
                                            return false;
                                        }
                                        if (!lib.character[button.link] || lib.character[button.link][1] == 'ye') return false;
                                        if (get.is.double(ui.selected.buttons[0].link)) return false;
                                        if (lib.character[ui.selected.buttons[0].link][1] == 'ye') return true;
                                        if (get.is.double(button.link)) return get.is.double(button.link, true).contains(lib.character[ui.selected.buttons[0].link][1]);
                                        return (lib.character[button.link][1] == lib.character[ui.selected.buttons[0].link][1]);
                                    };
                                    next.switchToAuto = function () {
                                        event.ai(target, list);
                                        ui.arena.classList.remove('selecting');
                                    };
                                }
                                "step 1"
                                if (ui.cheat) {
                                    ui.cheat.close();
                                    delete ui.cheat;
                                }
                                if (ui.cheat2) {
                                    ui.cheat2.close();
                                    delete ui.cheat2;
                                }
                                if (result.buttons) {
                                    //lib.element.player.uninit.call(target);
                                    lib.element.player.init.call(target, result.buttons[0].link, result.buttons[1].link, false);
                                    game.addRecentCharacter(result.buttons[0].link, result.buttons[1].link);
                                }
                                target.setIdentity(target.group);
                                /*event.list.remove(game.me.name1);
                                event.list.remove(game.me.name2);
                                for(var i=0;i<game.players.length;i++){
                                    if(game.players[i]!=game.me){
                                        event.ai(game.players[i],game.getCharacterChoice(event.list,parseInt(get.config('choice_num'))),event.list);
                                    }
                                }*/
                                target.classList.add('unseen');
                                target.classList.add('unseen2');
                                if (target != game.me) {
                                    target.node.identity.firstChild.innerHTML = '猜';
                                    target.node.identity.dataset.color = 'unknown';
                                    target.node.identity.classList.add('guessing');
                                }
                                target.hiddenSkills = lib.character[target.name1][3].slice(0);
                                var hiddenSkills2 = lib.character[target.name2][3];
                                for (var j = 0; j < hiddenSkills2.length; j++) {
                                    target.hiddenSkills.add(hiddenSkills2[j]);
                                }
                                for (var j = 0; j < target.hiddenSkills.length; j++) {
                                    if (!lib.skill[target.hiddenSkills[j]]) {
                                        target.hiddenSkills.splice(j--, 1);
                                    }
                                }
                                target.group = 'unknown';
                                target.sex = 'unknown';
                                target.name1 = target.name;
                                target.name = 'unknown';
                                target.identity = 'unknown';
                                target.node.name.show();
                                target.node.name2.show();
                                target._group = lib.character[target.name1][1];
                                for (var j = 0; j < target.hiddenSkills.length; j++) {
                                    target.addSkillTrigger(target.hiddenSkills[j], true);
                                }
                                /*for(var i=0;i<game.players.length;i++){
                                    game.players[i].classList.add('unseen');
                                    game.players[i].classList.add('unseen2');
                                    _status.characterlist.remove(game.players[i].name);
                                    _status.characterlist.remove(game.players[i].name2);
                                    if(game.players[i]!=game.me){
                                        game.players[i].node.identity.firstChild.innerHTML='猜';
                                        game.players[i].node.identity.dataset.color='unknown';
                                        game.players[i].node.identity.classList.add('guessing');
                                    }
                                    game.players[i].hiddenSkills=lib.character[game.players[i].name1][3].slice(0);
                                    var hiddenSkills2=lib.character[game.players[i].name2][3];
                                    for(var j=0;j<hiddenSkills2.length;j++){
                                        game.players[i].hiddenSkills.add(hiddenSkills2[j]);
                                    }
                                    for(var j=0;j<game.players[i].hiddenSkills.length;j++){
                                        if(!lib.skill[game.players[i].hiddenSkills[j]]){
                                            game.players[i].hiddenSkills.splice(j--,1);
                                        }
                                    }
                                    game.players[i].group='unknown';
                                    game.players[i].sex='unknown';
                                    game.players[i].name1=game.players[i].name;
                                    game.players[i].name='unknown';
                                    game.players[i].identity='unknown';
                                    game.players[i].node.name.show();
                                    game.players[i].node.name2.show();
                                    game.players[i]._group=lib.character[game.players[i].name1][1];
                                    for(var j=0;j<game.players[i].hiddenSkills.length;j++){
                                        game.players[i].addSkillTrigger(game.players[i].hiddenSkills[j],true);
                                    }
                                }*/
                                setTimeout(function () {
                                    ui.arena.classList.remove('choose-character');
                                }, 500);
                            });
                        },
                    };
                    lib.skill._qingyao_AIxuanjiang = {
                        trigger: {
                            global: 'gameStart',
                            player: 'enterGame',
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        priority: 523,
                        firstDo: true,
                        filter: function (event, player) {
                            return player === game.me && ['identity', 'guozhan', 'doudizhu'].contains(lib.config.mode);
                        },
                        content: function () {
                            'step 0'
                            player.chooseTarget([1, 1], get.prompt('AI选将'),"请选择一名角色并替换其武将牌", lib.filter.all).set('ai',function(target){
                                return 0;
                            });
                            'step 1'
                            if (result.bool) {
                                event.target = result.targets[0];
                                lib.choosePlayer.chooseCharacter(event.target);
                            } else event.finish();
                            'step 2'
                            event.goto(0);
                        },
                    };
                }
        },
        precontent: function (config) {
            if (config.qingyao_shoushaMVP) {
                "use strict;"
                lib.onover.push(resultbool => {
                    var 全场最佳 = function () {
                        if (_status.showShoushaMvp) return false;
                        _status.showShoushaMvp = true;
                        setTimeout(item => {
                            var dialog = Array.from(ui.arena.querySelectorAll(".dialog"));
                            dialog.forEach(value => value.hide());
                            game.playqysstx('images/asqx.mp3');
                            var players = game.players.slice(0);
                            game.players = game.players.concat(game.dead);
                            if (!_status.showShouSha局势) {
                                game.players.forEach(value => {
                                    if (game.dead.contains(value)) {
                                        value.局势分数 -= 20;
                                    }
                                    value.getEnemies().forEach(current => {
                                        if (game.dead.contains(current) || current.isDead()) {
                                            value.局势分数 += 2;
                                        }
                                    })
                                    value.getFriends().forEach(current => {
                                        if (current.isDead() || game.dead.contains(current))
                                            value.局势分数 -= 2;
                                    })
                                })
                            }
                            _status.showShouSha局势 = true;
                            game.players = players;
                            /**
                             * 冒泡排序
                             * @param arr
                             * @param len
                             */
                            var sort = function (arr) {
                                var temp, len = arr.length;
                                var i, j;
                                for (i = 0; i < len - 1; i++) /* 外循环为排序趟数，len个数进行len-1趟 */
                                    for (j = 0; j < len - 1 - i; j++) { /* 内循环为每趟比较的次数，第i趟比较len-i次 */
                                        if (arr[j].mvpCount > arr[j + 1].mvpCount) { /* 相邻元素比较，若逆序则交换（升序为左大于右，降序反之） */
                                            temp = arr[j];
                                            arr[j] = arr[j + 1];
                                            arr[j + 1] = temp;
                                        }
                                    }
                                return arr;
                            }
                            var sorts = sort(game.players.concat(game.dead)).reverse();
                            var player = sorts[0];
                            var popuperContainer = ui.create.div('.popup-container', {background: "rgb(0,0,0,.7)"}, ui.window);
                            popuperContainer.addEventListener('click', event => {
                                event.stopPropagation();
                                popuperContainer.delete(200);
                                dialog.forEach(value => value.show());
                                _status.showShoushaMvp = false;
                            });
                            var skills = player.skills.filter(value => lib.skill[value].audio);
                            skills.length && game.trySkillAudio(skills.randomGet(), player, true);
                            var qycontainer = ui.create.div('.qy-mvp-container', popuperContainer);

                            var backgroundRight = ui.create.div('.qy-mvp-piaodai-right', qycontainer);
                            var container = ui.create.div('.qy-center-container', qycontainer);
                            var backgroundLeft = ui.create.div('.qy-mvp-piaodai-left', qycontainer);

                            var avatarbox = ui.create.div('.qy-mvp-avatarbox', container);
                            if (navigator.userAgent.match(/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i) !== null) {
                                avatarbox.css({
                                    height: '120%',
                                    top: '-4%',
                                });
                            }
                            var avatarborder = ui.create.div('.qy-mvp-avatarborder', avatarbox);
                            avatarborder.dataset.name = get.translation(player.name);
                            avatarborder.setBackgroundImage(`extension/手杀MVP/images/border_${player.group}.png`);
                            var image = new Image();
                            image.src = `${lib.assetURL}extension/手杀MVP/images/border_${player.group}.png`;
                            image.onerror = function () {
                                avatarborder.setBackgroundImage(`extension/手杀MVP/images/border_qun.png`);
                            }
                            var xing = ui.create.div(avatarbox, '.qy-mvp-xing');
                            //修改开始
                            /*var num = 1, rarity = game.getRarity(player.name);
                            switch (rarity) {
                                case 'legend':
                                    num = 5;
                                    break;
                                case 'epic':
                                    num = 4;
                                    break;
                                case 'rare':
                                    num = 3;
                                    break;
                                case 'junk':
                                    num = 2;
                                    break;
                                default:
                                    num = 1;
                                    break;
                            }
                            for (var numKey = 0; numKey < num; numKey++)
                                ui.create.div('.item', xing);*/
                            /* 获取武将评级，并转为数字 */
                            get.qyRateNum = function (name) {
                                var rarity = game.getRarity(name);
                                let num = 1;
                                var rateCharacter = game.getExtensionConfig('手杀MVP', 'rateCharacter') || {};
                                if (rateCharacter[name]) num = rateCharacter[name];
                                if (num !== 1) return num;
                                switch (rarity) {
                                    case 'legend':
                                        num = 5;
                                        break;
                                    case 'epic':
                                        num = 4;
                                        break;
                                    case 'rare':
                                        num = 3;
                                        break;
                                    case 'junk':
                                        num = 2;
                                        break;
                                    default:
                                        num = 1;
                                        break;
                                }
                                return num;
                            }
                            var num = get.qyRateNum(player.name);
                            for (var numKey = 0; numKey < num; numKey++)
                                ui.create.div('.item.on', xing);
                            for (numKey = 0; numKey < 5 - num; numKey++)
                                ui.create.div('.item.off', xing);
                            //修改结束
                            var avatar = ui.create.div('.qy-mvp-avatar', avatarbox);
    //分享开始
 ui.create.div('.qy-mvp-share-button', popuperContainer).addEventListener('click', event => {
    event.stopPropagation();});
    //分享结束
                            //mvp读取大图
                    var playername = get.name(player);
                    var skinname = game.getFileName2(player.node.avatar.style.backgroundImage);
                    var skin = lib.assetURL + "extension/千幻聆音/sanguoyuanhua/" + playername + "/" + skinname + ".jpg";
                    var yuanhua = lib.assetURL + "extension/千幻聆音/sanguoyuanhua/" + playername + "/" + playername + ".jpg";
                    console.log('game.LiHuiFileExist(skin)', game.LiHuiFileExist(skin));
                    console.log('player.node.avatar.style.backgroundImage', player.node.avatar.style.backgroundImage);
                    
                    
                    if (game.LiHuiFileExist(skin)) avatar.style.backgroundImage = 'url("' + lib.assetURL + "extension/千幻聆音/sanguoyuanhua/" + playername + "/" + skinname +  ".jpg" + '")';
                    // else if (game.LiHuiFileExist(yuanhua)) avatar.style.backgroundImage = 'url("' + lib.assetURL + "extension/千幻聆音/sanguoyuanhua/" + playername + "/" + playername + ".jpg" + '")';
                    else {
                        avatar.style.backgroundImage = player.node.avatar.style.backgroundImage;
                        if (config.mvplutou == 'shizhounian') {
                        avatar.style['top'] = '20%';
                        avatar.style['height'] = '57.8%';
                        avatar.style['left'] = '36%';
                        avatar.style['width'] = '37%';}
                        else if (config.mvplutou == 'shousha'){
                        avatar.style['top'] = '15%';
                        avatar.style['height'] = '62.8%';}
                        else {
                        avatar.style['top'] = '23.6%';
                        avatar.style['height'] = '54%';}

                    }
                            var qyInfo = ui.create.div('.qy-mvp-qyInfo', container);
                            ui.create.div('.qy-mvp-title', qyInfo);
                            var qycenter = ui.create.div('.qy-mvp-center', qyInfo);
                            var qyIcon = ui.create.div('.qy-mvp-icon', qycenter);
                            var qyPlayerInfo = ui.create.div('.qy-player-info', qycenter);
                            ui.create.div(qyPlayerInfo, '.qy-mvp-name-title', '玩家昵称');
//增加本人图标开始修改
    var nickname = ui.create.div('.qy-mvp-player-nickname', qyPlayerInfo, player === game.me ? lib.config.connect_nickname : get.translation(player.name));
if (game.me === player) ui.create.node('img', nickname).src = lib.assetURL + 'extension/手杀MVP/images/mvp_me_tag.png';
    //增加本人图标修改结束
                            ui.create.div(qyPlayerInfo, '.qy-mvp-name-title', `技术分：${player.mvpCount || 0}`);
                            var qyScoreInfo = ui.create.div('.qy-mvp-scoreInfo', qyInfo);
                            var table = ui.create.node('table', qyScoreInfo, {width: "100%"});
                            var list = ['攻击分数', '治疗分数', '辅助分数', '局势分数', '惩罚扣分'];
                            list.forEach(value => {
                                var tr = ui.create.node('tr', table);
                                tr.style.colo = 'rgb(234, 138, 76)';
                                var td = ui.create.node('td', tr, value);
                                var num = (player[value] || 0);
                                var num2 = (sorts[1][value]);
                                td = ui.create.node('td', tr).innerHTML = num + (num - num2 >= 30 ? '(遥遥领先)' : '');
                            })
                        // taffy: 注释extension.js原版代码喵
                        // },2000)//结算时延迟出现时间
                        /* taffy分界线 */
                        // taffy: 取消延迟出现喵
                        })//结算时延迟出现时间
                        /* taffy分界线 */
                    }
                    ui.create.control("全场最佳", 全场最佳);
                    全场最佳();
                });
                ['攻击分数', '治疗分数', '辅助分数', '惩罚扣分'].forEach(value => {
                    HTMLDivElement.prototype[value] = 0;
                });
                HTMLDivElement.prototype.局势分数 = 100;
                Object.defineProperty(HTMLDivElement.prototype, 'mvpCount', {
                    get: function () {
                        return this.攻击分数 + this.治疗分数 + this.辅助分数 + this.局势分数 - this.惩罚扣分;
                    },
                    set: function () {
                    },
                });
                lib.skill['_qy-mvp-effect1'] = {
                    trigger: {
                        player: 'useCard',
                        source: 'damageSource',
                    },
                    direct: true,
                    forced: true,
                    firstDo: true,
                    silent: true,
                    popup: false,
                    filter: function (event, player, name) {
                        if (name === 'useCard') {
                            if (!event.card) return false;
                            if (get.tag({name: event.card.name}, 'damage')) return true;
                            if (event.card.name === 'wuxie') return true;
                            if (get.info(event.card).toself || get.type(event.card) !== 'trick') return false;
                            if (get.info(event.card).selectTarget === -1 || get.info(event.card).selectTarget > 1) return true;
                            return false;
                        }
                        if (event.player == event.source) return false;
                        if (event.source.identity == 'nei') return true;
                        return get.attitude(event.source, event.player) < 0;
                    },
                    content: function () {
                        if (event.triggername === 'damageSource') {
                            if (get.attitude(trigger.source, trigger.player) < 0 || trigger.source.identity == 'nei') trigger.num > 5 ? trigger.source.攻击分数 += 15 : trigger.source.攻击分数 += 3 * trigger.num;
                        } else if (trigger.card) {
                            if (get.tag({name: trigger.card.name}, 'damage'))
                                player.攻击分数 += 2
                            if (trigger.card.name === 'wuxie')
                                player.辅助分数 += 2;
                            if ((get.info(trigger.card).selectTarget === -1 || get.info(trigger.card).selectTarget > 1) && (!get.info(trigger.card).toself && get.type(trigger.card) === 'trick'))
                                player.辅助分数 += 1;
                        }
                    }
                }
                lib.skill['_qy-mvp-effect2'] = {
                    trigger: {player: ['gainEnd', 'discardEnd']},
                    direct: true,
                    forced: true,
                    firstDo: true,
                    silent: true,
                    popup: false,
                    filter: function (event, player, name) {
                        if (name === 'gainEnd') {
                            if (!event.source || event.source == player || !event.source.isIn()) return false;
                            //var evt=event.getl(event.source);
                            //if(!evt&&!evt.cards2&&evt.cards2.length===0) return false;
                            if (!event.cards || event.cards.length == 0) return false;
                            if (event.source.identity == 'nei') return true;
                            return event.player.getEnemies().contains(event.source);
                        }
                        if (name === 'discardEnd') {
                            if (!event.source || event.source == player || !event.source.isIn()) return false;
                            //var evt=event.getl(event.source);
                            //if(!evt&&!evt.cards2&&evt.cards2.length===0) return false;
                            if (!event.cards || event.cards.length == 0) return false;
                            if (event.source.identity == 'nei') return true;
                            return event.player.getEnemies().contains(event.source);
                        }
                    },
                    content: function () {
                        if (event.triggername == 'gainEnd') trigger.player.辅助分数 += 1 * trigger.cards.length;
                        if (event.triggername == 'discardEnd') trigger.source.辅助分数 += 1 * trigger.cards.length;
                    },
                }
                lib.skill['_qy-mvp-effect3'] = {
                    trigger: {player: 'recoverEnd'},
                    direct: true,
                    forced: true,
                    firstDo: true,
                    silent: true,
                    popup: false,
                    filter: function (event, player) {
                        if (!event.source || !event.source.isIn()) return false;
                        if (event.source.identity == 'nei') return true;
                        return event.player.getFriends().contains(event.source) || event.player == event.source;
                    },
                    content: function () {
                        trigger.num > 5 ? trigger.source.治疗分数 += 10 : trigger.source.治疗分数 += 2 * trigger.num;
                    },
                }
                lib.skill['_qy-mvp-effect4'] = {
                    trigger: {source: 'dieBegin'},
                    direct: true,
                    forced: true,
                    firstDo: true,
                    silent: true,
                    popup: false,
                    filter: function (event, player) {
                        return (event.source && event.source.isIn());
                    },
                    content: function () {
                        if (trigger.player.getFriends().contains(trigger.source)) {
                            trigger.source.惩罚扣分 += 5;
                            if (trigger.source.identity == 'nei' && trigger.player.identity != 'zhu') {
                                trigger.source.惩罚扣分 -= 5;
                                trigger.source.攻击分数 += 3;
                            }
                        }
                        if (trigger.player.getEnemies().contains(trigger.source)) {
                            trigger.source.攻击分数 += 3;
                        }
                    },
                }
                lib.skill['_qy-mvp-effect5'] = {
                    trigger: {
                        player: "enterGame",
                        global: ["roundStart", "gameStart"],
                    },
                    direct: true,
                    forced: true,
                    priority: Infinity,
                    firstDo: true,
                    silent: true,
                    popup: false,
                    content: function () {
                        if (!_status._qy_mvp_effect5) {
                            try {
                                var changValue = false;
                                var input = ui.commandnode.link.querySelector("input");
                                var Opt = Object.getOwnPropertyDescriptor(input.__proto__, "value");
                                Object.defineProperty(input, 'value', {
                                    get: function () {
                                        var value = (Opt.get && Opt.get.call(this)) || '';
                                        if (value === '') changValue = false;
                                        else changValue = true
                                        return value;
                                    },
                                    set: function (v) {
                                        Opt.set.call(this, v);
                                    },
                                    configurable: true,
                                })
                                Array.from(ui.commandnode.parentElement.parentElement.querySelectorAll(".menubutton.round.highlight")).forEach(value => {
                                    value.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function (event) {
                                        if ('作' === value.innerText && this.classList.contains('glowing')) {
                                            game.me.惩罚扣分 += 3;
                                        } else if ('执' === value.innerText && changValue) {
                                            game.me.惩罚扣分 += 3;
                                        }
                                    }, true);
                                })
                            } catch (e) {
                                console.error("作弊加载失败：", e)
                            }
                            _status._qy_mvp_effect5 = true;
                        }
                    },
                };
                //样式
                if (lib.config.extension_手杀MVP_yangshi == 'on') {
		        lib.init.css(lib.assetURL + 'extension/手杀MVP', 'extension');
		        };
		        if (lib.config.extension_手杀MVP_yangshi == 'off') {
		        lib.init.css(lib.assetURL + 'extension/手杀MVP', 'extension_new');
	            };
            }
        },
        help: {
        },
        config: {
            "qingyao_shoushaMVP": {
                name: '手杀MVP',
                init: true,
                intro: '开启后，游戏结算后可展示手杀MVP界面。',
            },
            "yangshi": {
                name: 'MVP样式',
                init: 'off',
                item: {
                 on: '<div style="width:64px;height:36px;position:relative;background-image: url(' + lib.assetURL + 'extension/手杀MVP/images/样式1.jpg);background-size: 100% 100%;"></div>',
                 off: '<div style="width:64px;height:36px;position:relative;background-image: url(' + lib.assetURL + 'extension/手杀MVP/images/样式2.jpg);background-size: 100% 100%;"></div>'
              },
            },
            "mvplutou": {
                name: '无原画时MVP露头',
                init: 'off',
                item: {
                 shizhounian: '十周年露头',
                 shousha: '手杀露头',
                 off: '无露头'
              },
            },
            "qingyao_AIxuanjiang": {
                name: 'AI选将',
                init: false,
                intro: '开启后，游戏开始时玩家可以为AI或自己重新选将。(限身份场、斗地主、国战)',
            },
            "qingyao_shoushapeiyin": {
                "name": "手杀配音",
                "intro": "开启后，部分游戏音效将替换成手杀音效。",
                "init": false,
            },
        },
        package: {
            intro: "",
            author: "清瑶的“徒弟”、神秘喵",
            diskURL: "",
            forumURL: "",
            version: "1.1.7",
        },
        files: {
            "character": [],
            "card": [],
            "skill": []
        }
    }
})
