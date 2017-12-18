
/**
 * =====Attention!!!!!=====
 * 在目前的框架结构中，直接用script标签引入的文件，不支持amd等方式的文件；
 * 所以网易sdk的第一行我做了小小的更改； ‘define.amd’ 改成了 ‘define.aemd’；
 * 后面更换sdk，也需要做相应的更改，望知悉！
 *
 * SDK连接 功能相关
 */
var webimConfigs = (function () {
    /*
    * !!!!!  -- 切换im账户 注意事项:
    *       1, 更换 appkey;
    *       2, 更换游客token
    *
    * */
    var that = this;
    var isSwitch = false;
    var data = {
        teams: [],
        friendlist: [],
        teamMembers: [],
        sessions: [],
    };
    var href = window.location.href;
    var debugFlag = false;
    if (href.indexOf('wph') > 0) {
        debugFlag = true;
    }
    var appKey = '3aeaf45926abb577b051c68f95956e66';
    if(href.indexOf('wanpinghui.com')>0){
        appKey = '211cf33f06ece9b9934e91612362e2b8';
    }

    function login() {
        var account = globalData.user.id;
        var token = globalData.user.im_token;
        window.nim = this.nim = new NIM({
            debug: debugFlag,
            db: false,
            appKey: appKey,
            account: account,
            token: token,
            syncSessionUnread: true,
            currSess: '',
            currScene: 'p2p',
            onconnect: function onConnect() {
                // potato.application.dispatch(new potato.Event('IMLogined'));
                console.log('网易IM连接成功');
                // data.sessions = readStorgeSessions();
                // readStorgeFriends();
            },
            onwillreconnect: onWillReconnect.bind(this),
            ondisconnect: onDisconnect.bind(this),
            onerror: onError,
            //好友
            onfriends: onFriends.bind(this),
            // 会话
            onsessions: onSessions.bind(this),
            onupdatesession: onUpdateSession.bind(this),
            setCurrSession: setCurrSession.bind(this),
            // 消息
            onroamingmsgs: onRoamingMsgs.bind(this),
            onofflinemsgs: onOfflineMsgs.bind(this),
            onmsg: onMsg.bind(this),
            // 同步完成
            onsyncdone: onSyncDone.bind(this),
            onsysmsg: onSysMsg.bind(this),
            //群组相关
            onteams: onTeams,
            onsynccreateteam: onCreateTeam,
            onteammembers: onTeamMembers,
            onsyncteammembersdone: onSyncTeamMembersDone,
            onupdateteammember: onUpdateTeamMember
        });
        nimMsgPool.init();
    }

    var nimMsgPool = (function () {
        var _autoID = 0;
        var _historyLoading = {};
        var _msgDataStr = '{ "version": ' + _autoID + ' }', _updateList = [];
        var _inited = false;
        function setMsgData(data) {
            _autoID++;
            data.version = _autoID;
            _msgDataStr = JSON.stringify(data);
        }
        function getMsgData() {
            return JSON.parse(_msgDataStr);
        }
        function setInfo(type, sid, info) {
            var msgData = getMsgData();
            function check(_sid, _info) {
                if (_sid == undefined) {
                    throw "sid is not string!";
                }
                if (!msgData[_sid]) {
                    msgData[_sid] = { history: null, news: [], unread: 0, pullMsg: null, lastMsg: '' };
                }
                msgData[_sid][type] = _info;
            }
            if (info !== undefined) {
                check(sid, info);
                setMsgData(msgData);
            } else {
                var map = sid;
                for (sid in map) {
                    check(sid, map[sid][type]);
                }
                setMsgData(msgData);
            }
        }
        function setMsgs(type, sid, arr) {
            var msgData = getMsgData();
            function check(_sid, _arr) {
                if (_sid == undefined) {
                    throw "sid is not string!";
                }
                if (!msgData[_sid]) {
                    msgData[_sid] = { history: null, news: [], unread: 0, pullMsg: null, lastMsg: '' };
                }
                if (!msgData[_sid][type] || !msgData[_sid][type].length) {
                    msgData[_sid][type] = _arr;
                } else {
                    var list = msgData[_sid][type];
                    var map = {};
                    for (var i = 0, k = list.length; i < k; i++) {
                        var item = list[i];
                        map[item.idClient] = item;
                    }
                    for (var i = 0, k = _arr.length; i < k; i++) {
                        var item = _arr[i];
                        if (!map[item.idClient]) {
                            list.push(item)
                        }
                    }
                }
            }
            if (arr !== undefined) {
                check(sid, arr);
                setMsgData(msgData);
            } else {
                var map = sid;
                for (sid in map) {
                    check(sid, map[sid][type]);
                }
                setMsgData(msgData);
            }
        }
        setInterval(function () {
            if (!_inited) { return false; }
            var msgData = getMsgData();
            for (var i = 0, k = _updateList.length; i < k; i++) {
                var mod = _updateList[i];
                var session = mod.session;
                if (session) {
                    if (session == "all") {
                        if (mod.messages.version != msgData.version) {
                            mod.messages = msgData;
                            mod.update(msgData);
                        }
                    } else {
                        var msgList = msgData[session];
                        if (!msgList) {
                            msgList = msgData[session] = { "history": null, "news": [], "unread": 0, lastMsg: '' };
                        }
                        // if(msgList.pullMsg === null){
                        //     console.log('null');
                        //     msgData[session].pullMsg = webimConfigs.hasNotJoinedGroup(session);
                        //     webimConfigs.setPullMsg(session,msgData[session].pullMsg);
                        // }
                        if (!msgList.history || msgList.pullMsg) {
                            getLastHistroyMsg(session);
                        }
                        // if(!msgList.groupInfo){
                        //     getGroupInfo(session);
                        // }
                        var nnum = msgList.news.length;
                        var onum = mod.messages.news.length;
                        if (nnum > onum) {
                            mod.messages.news = msgList.news.map(function (item) {
                                return item;
                            });
                            mod.update(msgList.news.slice(onum));
                        }
                        if (msgList.history) {
                            var nnum = msgList.history.length;
                            var onum = mod.messages.history.length;
                            if (nnum > onum) {
                                mod.messages.history = msgList.history.map(function (item) {
                                    return item;
                                });
                                mod.history(msgList.history.slice(onum));
                            }
                        }
                    }
                }
            }
        }, 1000);
        //获取上一屏历史消息并缓存
        function getLastHistroyMsg(session) {
            if (_historyLoading[session]) {
                return;
            }
            _historyLoading[session] = true;
            webimConfigs.loadHistroy(session, function (msgList) {
                    setHistory(msgList);
                },
                function () {
                    setHistory([]);
                })
            function setHistory(msgs) {
                exports.setHistory(session, msgs);
                setTimeout(function () {
                    _historyLoading[session] = false;
                }, 3000)//防止过快刷新
            }
        }
        var exports = {
            setUnread: function (sid, n) {
                setInfo("unread", sid, n);
            },
            setHistory: function (sid, history) {
                setMsgs("history", sid, history);
            },
            setNews: function (sid, news) {
                setMsgs("news", sid, news);
            },
            setPullMsg: function (sid, pull) {
                setInfo("pullMsg", sid, pull);
            },
            setLastMsg: function (sid, msg) {
                setInfo("lastMsg", sid, msg);
            },
            addListener: function (mod) {
                _updateList.push(mod);
            },
            init: function () {
                _inited = true;
            },
            getMsgData: getMsgData
        }
        return exports;
    })();
    function onWillReconnect(obj) {
        // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连');
        // console.log(obj.retryCount);
        // console.log(obj.duration);
    }
    function onDisconnect(error) {
        // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        console.log('丢失连接');
        console.log(error);
        if (error) {
            switch (error.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    break;
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    break;
                default:
                    break;
            }
        }
    }
    function onError(error) {
        console.log(error);
    }
    function onSysMsg(sysMsg) {
        console.log('收到系统通知', sysMsg);
        if (sysMsg.type == "addFriend") {
            nim.getUser({
                account: sysMsg.from,
                sync: true,
                done: function (error, user) {
                    if (!error) {
                        data.friendlist.push(user);
                    }
                }
            })
        }
    }
    function onFriends(friends) {
        var friendlist = friends;
        var friendlist = data.friendlist;
        friendlist = nim.mergeFriends(friendlist, friends);
        friendlist = nim.cutFriends(friendlist, friends.invalid);
        //提取有用信息，account
        var f_arr = [];
        for (var i = 0; i < friendlist.length; i++) {
            f_arr[i] = friendlist[i].account;
        }
        //获取用户资料
        getUsersInfo(f_arr, function (users) {
            data.friendlist = users;
        })

    };
    function onTeams(teams) {
        console.log('收到群列表', teams);
        data.teams = nim.mergeTeams(data.teams, teams);
    }
    function onCreateTeam(team,owner) {
        console.log('创建了一个群', team);
        data.teams = nim.mergeTeams(data.teams, team);
        onTeamMembers({
            teamId: team.teamId,
            members: owner
        });
    }
    function onTeamMembers(obj) {
        console.log('群id', obj.teamId, '群成员', obj.members);
        var teamId = obj.teamId;
        var members = obj.members;
        data.teamMembers = data.teamMembers || {};
        data.teamMembers[teamId] = nim.mergeTeamMembers(data.teamMembers[teamId], members);
        data.teamMembers[teamId] = nim.cutTeamMembers(data.teamMembers[teamId], members.invalid);
    }
    function onSyncTeamMembersDone() {
        console.log('同步群列表完成');
    }
    function onUpdateTeamMember(teamMember) {
        console.log('群成员信息更新了', teamMember);
        onTeamMembers({
            teamId: teamMember.teamId,
            members: teamMember
        });
    }

    function onSessions(sessions) {
        //获取所有会话的未读消息
        var msgData = {};
        for (var i = 0; i < sessions.length; i++) {
            var group = sessions[i];
            var session = group.to;
            if (!msgData[session]) {
                msgData[session] = {};
            }
            msgData[session].unread = group.unread;
            msgData[session].pullMsg = 0;
            if (group.lastMsg.type == 'image') {
                group.lastMsg.text = '[图片]'
            }
            group.lastMsg = parseMsg(group.lastMsg);
            msgData[session].lastMsg = group.lastMsg;
        }
        data.sessions = nim.mergeSessions(data.sessions, sessions);
        nimMsgPool.setUnread(msgData);
        nimMsgPool.setPullMsg(msgData);
        nimMsgPool.setLastMsg(msgData);
    }

    function onUpdateSession(session) {
        if (!session.lastMsg) {
            return
        }
        if (session.lastMsg.type == 'notification' && session.lastMsg.attach != undefined && session.lastMsg.attach.type != "passTeamApply") {
            return
        }
        console.log('会话更新了', session);

        session.lastMsg = parseMsg(session.lastMsg);
        if (session.lastMsg == undefined) {
            return
        }
        nimMsgPool.setNews(session.to, [session.lastMsg]);

        if (session.lastMsg && session.lastMsg.text.indexOf('chat-img') > 0) {
            session.lastMsg.text = '[图片]'
        }
        nimMsgPool.setLastMsg(session.to, session.lastMsg);
        if (session.to == nim.currSess) {
            nimMsgPool.setUnread(session.to, 0);
            setSessionUnread(session.to);
        } else {
            nimMsgPool.setUnread(session.to, session.unread);
        }
        nimMsgPool.setPullMsg(session.to, 0);
        if (session.lastMsg.type == 'text') {
            data.sessions = nim.mergeSessions(data.sessions, session);
        }
        if(session.unread>0){
            bindUnreadToSupplier();
        }
    }

    function onRoamingMsgs(obj) {

    }

    function onOfflineMsgs(obj) {

    }

    function onMsg(msg) {
        console.log('收到消息', msg.scene, msg.type, msg);
    }

    function parseMsg(msg) {
        //如果是图片消息,改造一下
        if (msg.type == 'image') {
            msg.type = 'text';
            msg.text = "<img class='chat-img' src='" + msg.file.url + "' evt='scanBig' />"
        }
        return msg
    }

    function pushMsg(msgs) {
        if (!Array.isArray(msgs)) {
            msgs = [msgs];
        }
        var sessionId = msgs[0].sessionId;
        data.msgs = data.msgs || {};
        data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
    }

    function onSyncDone() {
        webimConfigs.chatRoomReady = true;
        $(document.body).trigger('imInit');
    }

    /**
     * 设置当前会话，当前会话未读数会被置为0，同时开发者会收到 onupdatesession回调
     * @param {String} scene
     * @param {String} to
     */
    function setCurrSession(sel) {
        //将切换前的会话的未读数置为0
        if (nim.currSess) {
            nimMsgPool.setUnread(nim.currSess, 0);
            nim.resetSessionUnread(nim.currSess);
        }
        if (sel) {
            isSwitch = true;
        }
        nim.currSess = sel;
        nim.currScene = 'team';//现在只有team关系
        //调用网易切换会话的方法,是为了将消息未读数重置为0;
        nim.setCurrSession(nim.currScene + '-' + sel);

        //将切换后的会话的未读数置为0
        nimMsgPool.setUnread(sel, 0);
        setSessionUnread(sel);

    }
    // 将data中的session未读数重置为0
    function setSessionUnread(sessionId) {
        for (var i = 0; i < data.sessions.length; i++) {
            if (data.sessions[i].to == sessionId) {
                data.sessions[i].unread = 0;
                break;
            }
        }
    }
    // 将未读数和工程商绑定
    function bindUnreadToSupplier() {
        let sess = data.sessions;
        let users = globalData.supplier_list;
        let teams = data.teams;
        //循环会话列表，找出有未读消息的
        $.each(sess,function (i, val) {
            if(val.unread>0){
                let unread= {};
                // 循环群组列表，找出当前群对应的工程商id
                $.each(teams,function (index, item) {
                    if(val.to == item.teamId){
                        unread.supplier_id = item.announcement;
                        unread.num = val.unread;
                        return false
                    }
                });
                //如果id存在，则寻找工程商列表，修改未读数据
                if(unread.supplier_id){
                   $.each(users,function (n, supplier) {
                       if(supplier.id == unread.supplier_id){
                           supplier.unread = unread.num;
                       }
                       // 如果当前工程商正好有未读，也一并更新
                       if(supplier.id == globalData.current_supplier.id){
                           globalData.current_supplier.unread = unread.num;
                       }
                   });
                }
            }

        });
    }
    // 获取历史纪录
    function loadHistroy(sid, succ, fail) {
        var lastTime = new Date().getTime();
        var sessNew = nimMsgPool.getMsgData()[nim.currSess] && nimMsgPool.getMsgData()[nim.currSess].news || [];
        if (sessNew.length > 0) {
            lastTime = sessNew[0].time;
        }
        nim.getHistoryMsgs({
            scene: nim.currScene,
            endTime: lastTime,
            to: sid,
            done: function (error, obj) {
                console.log('获取好友历史消息' + (!error ? '成功' : '失败'));
                if (!error) {
                    var cloudMsg = obj.msgs;
                    if (cloudMsg) {
                        for (var i = 0, j = cloudMsg.length; i < j; i++) {
                            cloudMsg[i] = parseMsg(cloudMsg[i]);
                        }
                        if (cloudMsg.length > 0) {
                            succ(cloudMsg);
                        } else {
                            // 如果历史消息为空，则造一条假的消息，以便洽谈室的历史消息监听能够获得通知，从而移除loading动画；
                            var fakeMsg = [{
                                type: 'fake',
                            }]
                            succ(fakeMsg);
                        }
                        succ(cloudMsg);
                    }
                } else {
                    fail();
                }
            }
        });
    }
    /** 发送普通文本消息 */
    function sendTextMessage(text, cb) {
        if (nim.currScene == '' || nim.currSess == '') {
            cb && cb.fail();
            return
        }
        nim.sendText({
            scene: nim.currScene,
            to: nim.currSess,
            text: text,
            done: function (error, msg) {
                if (!error) {
                    cb && cb.succ(msg);
                } else {
                    cb && cb.fail(error)
                }
            }
        });
    };
    /** 发送图片消息 */
    function sendImage() {
        $('.sendImgPending').removeClass('hide');
        nim.sendFile({
            scene: nim.currScene,
            to: nim.currSess,
            type: 'image',
            fileInput: 'imgFile',
            beginupload: function (upload) {
                // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
                // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
            },
            uploadprogress: function (obj) {
                console.log('文件总大小: ' + obj.total + 'bytes');
                console.log('已经上传的大小: ' + obj.loaded + 'bytes');
                console.log('上传进度: ' + obj.percentage);
                console.log('上传进度文本: ' + obj.percentageText);
            },
            uploaddone: function (error, file) {
                console.log(error);
                console.log(file);
                console.log('上传' + (!error ? '成功' : '失败'));
                $('.sendImgPending').addClass('hide');
                if (!error) {
                    console.log('发送完成');
                }
            },
            beforesend: function (msg) {
                console.log('正在发送image消息, id=' + msg.idClient);
            },
            done: function (error,obj) {
                if(error){
                    alert(error.message);
                    $('.sendImgPending').addClass('hide');
                }else{
                    console.log('发送完成')
                }
            }
        });
    }
    //获取多个好友的详细资料
    function getUsersInfo(arr, cb) {
        if (arr.length > 150) {
            arr = arr.slice(0, 149);
        }
        nim.getUsers({
            accounts: arr,
            sync: true,
            done: function (error, users) {
                if (!error) {
                    cb(users);
                }
            }
        })
    }
    //获取单个好友的详细资料
    function getUser(id) {
        var info = getSupplierInfoByProlist(id);
        if (id == globalData.user.user_id || id == '3') {
            return;
        }
        if (!info || info.avatar == '') {
            nim.getUser({
                account: id,
                sync: true,
                done: function (error, user) {
                    if (!error) {
                        return user;
                    }
                }
            })
        } else {
            return info;
        }
    }
    //直接添加好友（无需验证）
    function addFriend(account, cb) {
        nim.addFriend({
            account: account + '',
            done: function (error, obj) {
                if (!error) {
                    //更新好友列表及其资料
                    data.friendlist.push(obj.friend);
                    cb && cb.succ();
                } else {
                    cb && cb.fail && cb.fail();
                }
            }
        });
    }
    // 创建高级群
    function createTeam(options,cb) {
        let ops = {
            type: 'advanced',
            name: '',
            avatar: 'avatar',
            accounts: [globalData.user.id],
            intro: '',
            announcement: '群公告',
            joinMode: 'noVerify',
            beInviteMode: 'noVerify',
            // updateTeamMode: 'manager',
            // updateCustomMode: 'manager',
            // ps: '我建了一个高级群',
            // custom: '群扩展字段, 建议封装成JSON格式字符串',
            done: function (error, obj) {
                console.log('创建' + obj.team.type + '群' + (!error?'成功':'失败'));
                if (!error) {
                    onCreateTeam(obj.team, obj.owner);
                    cb && cb.succ && cb.succ(obj);
                }else{
                    cb && cb.fail && cb.fail();
                }
            }
        };
        $.extend(ops,options);
        nim.createTeam(ops);
    }
    // 解散群
    function dismissTeam(teamId) {
        nim.dismissTeam({
            teamId: teamId,
            done: function dismissTeamDone(error, obj) {
                console.log(error);
                console.log(obj);
                console.log('解散群' + (!error?'成功':'失败'));
            }
        });
    }
    // 获取群资料
    function getTeam(teamId,cb) {
        nim.getTeam({
            teamId: 123,
            done: function (error,obj) {
                if(!error){
                    cb && cb.succ && cb.succ(obj);
                }
            }
        });
    }

    return {
        setPullMsg: function (session) {
            nimMsgPool.setPullMsg(session, true);
        },
        addListener: function (mod) {
            nimMsgPool.addListener(mod);
        },
        getPool: function () {
            return nimMsgPool.getMsgData();
        },
        loadHistroy: loadHistroy,
        onSendMsg: sendTextMessage,
        sendImage: sendImage,
        setCurrSession: setCurrSession,
        login: login,
        nimMsgPool: nimMsgPool,
        data: data,
        addFriend: addFriend,
        chatRoomReady: false,
        lastSession: '3',// 默认初始化话为客服
        createTeam: createTeam,
        dismissTeam: dismissTeam
    }
})();

// 页面卸载的时候，退出群
$(window).bind('beforeunload', function(){
    var teams = webimConfigs.data.teams;
    $.each(teams,function (index, value) {
        webimConfigs.dismissTeam(value.teamId);
    })
});