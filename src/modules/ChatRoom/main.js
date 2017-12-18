import * as bm from "../js/baseModule.js";

export class Module extends bm.baseModule {
    constructor(view) {
        super(view);
        let that = this;
        let vdom = new Vue({
            el: '.supplier-info',
            data: globalData.current_supplier
        });

        //修改聊天界面的高度
        this.countMsgPaneHeight();
        $(window).resize(function () {
            that.countMsgPaneHeight();
            msgPane[0].scrollTop = msgPane[0].scrollHeight;
        });
        //聊天界面
        let msgPane = this.find('.msg-pane');
        //输入框输入事件监听
        this.find('#input').on('input propertychange blur', function () {
            //聊天面板滚到底部3t
            msgPane[0].scrollTop = msgPane[0].scrollHeight;

            let v = $(this).val();
            if (v.length > 0 && v.trim().length > 0) {
                that.find('#sendMsg').removeAttr('disabled');
                // that.find('.enclosure').addClass("hide");
            } else {
                that.find('#sendMsg').attr('disabled', 'disabled');
                // that.find('.enclosure').removeClass("hide");
            }
        });
        //监听消息发送提交
        this.find('.input-pane').on('submit', function (e) {
            e.preventDefault();
            that._evt_sendMsg();
        });
        //图片选择事件
        $('#imgFile').on('change', function () {
            webimConfigs.sendImage();
        });
        //消息监听
        this.webim = {
            session: '',
            messages: { history: [], news: [] },
            update: function (msgs) {
                let html = '';
                for (let i = 0, j = msgs.length; i < j; i++) {
                    html = html + that.pushMsg(msgs[i]);
                }
                msgPane.append(html);

                let delayTime = 300;
                //如果消息中没有图片,就加快显示速度
                if (html.indexOf('chat-img') < 0) {
                    delayTime = 30;
                }
                //图片加载需要时间,延迟滚动
                setTimeout(function () {
                    msgPane[0].scrollTop = msgPane[0].scrollHeight;
                }, delayTime);
            },
            history: function (msgs) {
                // 如果历史消息为空，则造一条假的消息，以便洽谈室的历史消息监听能够获得通知，从而移除loading动画；
                if (msgs.length == 1 && msgs[0].type == 'fake') {
                    msgPane[0].scrollTop = msgPane[0].scrollHeight;
                    that.countMsgPaneHeight();
                    return
                }
                let html = '';
                for (let i = 0; i < msgs.length; i++) {
                    html = that.pushMsg(msgs[i]) + html;
                }
                msgPane.prepend(html);

                //如果消息中没有图片,就加快显示速度
                let delayTime = 300;
                if (html.indexOf('chat-img') < 0) {
                    delayTime = 30;
                }
                //图片加载需要时间,延迟滚动
                setTimeout(function () {
                    msgPane[0].scrollTop = msgPane[0].scrollHeight;
                }, delayTime);
            }
        };
        webimConfigs.addListener(this.webim);
    }

    afterInstall() {
        let that = this;
        let teams = webimConfigs.data.teams;
        let teamId = '';
        $.each(teams, function (i, item) {
            if (item.announcement == globalData.current_supplier.id) {
                teamId = item.teamId;
            }
        });
        //如果当前群存在，则直接切换回话
        if (teamId) {
            this.switchSession(teamId);

            //不存在则创建群
        } else {
            // 组织有用的信息，给客服用
            let infoToService = {
                demand: globalData.demand,
                supplier: globalData.current_supplier,
                sem: globalData.sem,
            };
            infoToService = funs.initClientInfoToIM(infoToService);
            let option = {
                name: globalData.selPos.city + globalData.selPos.county + '-' + globalData.current_supplier.nickname + '[' + globalData.current_supplier.id + ']',
                intro: infoToService,
                custom: '',
                avatar: 'http://www.88ba.com/img/' + globalData.demand.menuTab + '.jpg',// 安装/维修/租赁 对应不同的图片
                accounts: ['5', globalData.user.id], //暂时不分配其他的客服
                announcement: globalData.current_supplier.id //把工程商id存入‘群公告’
            };
            webimConfigs.createTeam(option, {
                succ: function (obj) {
                    that.switchSession(obj.team.teamId);
                },
                fail: function (error) {
                    console.dir('建群失败：' + error);
                }
            });
        }
    }

    //修改聊天界面的高度
    countMsgPaneHeight() {
        let height = $('#ChatRoom').height();
        $('.msg-pane').css('height', (height - 195) + 'px');
    }

    //切换聊天对象 更新设置
    switchSession(sessionID) {
        webimConfigs.setCurrSession(sessionID);
        // this.find('.unread-num').hide().html('');
        this.webim.session = sessionID;
        this.webim.messages = { history: [], news: [] };
        // 显示loading动画，记录最近的会话id
        if (sessionID != '') {
            webimConfigs.lastSession = sessionID;
        }
    };

    //在聊天窗口显示消息
    pushMsg(msg) {
        let that = this;
        let fromAccount = msg.from;
        let isSelfSend = msg.flow == 'out';//消息是否为自己发的
        let subType = msg.type;//消息类型
        let triangle, userhead;
        let onemsg = '';
        if (msg.text.indexOf('chat-img') < 0){
            // 替换文字中的url
            let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
            msg.text = msg.text.replace(reg, "<a class='text-link' href='$1$2' target='_blank'>$1$2</a>").replace(/\n/g, "<br />");
        }
        //群普通消息
        if (subType == 'text') {
            //如果自己发的消息
            if (isSelfSend) {
                userhead = '<span class="user-head-icon">您</span>';
                //小三角
                triangle = '<img class="triangle" src="/img/triangle.png">';


                onemsg = '<div class="one-message self-msg">' + userhead +
                    '<div class="msgbody"><pre>' + msg.text + '</pre>' + triangle +
                    '</div></div>';
            }
            //不是自己发的消息
            else {
                userhead = '<img class="user-head-icon" src="' + globalData.current_supplier.avatar + '"/>';
                //小三角
                triangle = '<img class="triangle" src="/img/triangle2.png">';

                onemsg = '<div class="one-message">' + userhead +
                    '<div class="msgbody"><pre>' + msg.text + '</pre>' + triangle +
                    '</div></div>';
            }
        }
        //如果是图片,去掉<pre>标签
        if (onemsg.indexOf('chat-img') > 0) {
            onemsg = onemsg.replace('<pre>', '').replace('</pre>', '');
        }
        return onemsg
    };

    //发送消息点击事件
    _evt_sendMsg() {
        let that = this;
        let text = $('#input').val();
        if (text.length > 0 && text.trim().length > 0) {
            $('#sendMsg').attr('disabled', 'disabled');
            webimConfigs.onSendMsg(text, {
                succ: function (msg) {
                    console.log('发送成功');
                    that._clearInput(true);
                },
                fail: function (err) {
                    alert('消息发送失败，请检查网络并重试');
                }
            });
        }
    };
    //发送图片
    _evt_sendImg(data, obj) {
        this.find('#imgFile').trigger('click');
    };

    //清空输入框后发送按钮隐藏
    _clearInput(focusFlag) {
        this.find("#input").val('').css('height', '24px');
        focusFlag && this.find("#input").focus();
        this.find('#sendMsg').attr('disabled');
    };
    //点击查看大图
    _evt_scanBig(data, obj) {
        let src = $(obj).attr('src');
        //dom插入
        let bigImg = '<div class="bigImgBg" evt="closeBigImg"><img class="bigImg" src="' + src + '"/></div>';
        $('body').append(bigImg);

        let width = $(obj).width();
        let height = $(obj).height();
        let rate = width / height;//宽高比
        let ww = $(window).width();//大图的宽 == 屏幕宽度
        let hh = $(window).height();
        let bgh = ww / 2 / rate / 2;  // 计算出大图的高度 de 一半
        //让图片垂直居中
        if (bgh * 2 >= hh) {
            $('.bigImg').css({
                "margin-top": 0,
                "height": "90%",
                "top": "5%",
                "left": (1 - 0.9 * rate * (hh / ww)) / 2 * 100 + '%'
            }).show();
        } else {
            $('.bigImg').css({ 'margin-top': -bgh + 'px', "width": "50%" }).show();
        }
    };
    // 页面卸载事件
    afterUninstall() {
        this.switchSession('');
    }
}