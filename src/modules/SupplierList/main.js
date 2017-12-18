import * as bm from "../js/baseModule.js";

export class Module extends bm.baseModule {
    constructor(view) {
        super(view);
        let that = this;
        let dom = this.find('.content')[0];
        new Vue({
            el: dom,
            data: globalData,
            watch: {
                "demand.totalPrice": function (val, oldVal) {
                    if (val != oldVal) {
                        funs.initSupplierList(globalData.supplier_list)
                    }
                }
            }
        });
        this.find('.input-phone').on("input", function () {
            that.find(".error-Tip").hide();
        });
        this._setListsHeight();
        $('.lists').on('scroll',function () {
            let scrollH = $('.scroll-pane').height() - $('.lists').height();
            console.log(scrollH - $(this).scrollTop());
            if (scrollH - $(this).scrollTop() <= 0 && globalData.current_page != 'max') {
                that._evt_loadMore();
            }
        });
    }
    /**重设列表高度*/
    _setListsHeight() {
        var windowH = document.documentElement.clientHeight || $(window).height();
        var headerH = this.find('.supplier-number').innerHeight();
        var footerH = this.find('.supplier-footer').innerHeight();
        var aaa = windowH - headerH - footerH - 32;
        this.find('.lists').css('height', aaa + 'px');
    };
    /**侧滑打开电话页*/
    _evt_openPhoneNumber(obj) {
        let index = parseInt($(obj).attr('index')); // 到时候改回去的话，注意这里的obj能否取到index
        this._changeCurrentSupplier(index);
        funs.swipeModule("modules/PhoneNumber.js", 386);
        this.scanPlus();
        // 统计一次转化
        track.call();
    }
    /**侧滑打开个人主页*/
    _evt_openHomePage(obj) {
        let index = parseInt($(obj).attr('index'));
        this._changeCurrentSupplier(index);
        funs.swipeModule("modules/PhoneNumber.js", 386);
        this.scanPlus();
    }
    /**侧滑打开IM*/
    _evt_openChatRoom(obj) {
        let index = parseInt($(obj).parents('.item').attr('index'));
        this._changeCurrentSupplier(index);
        // globalData.current_supplier.info_com_summary = '';
        funs.swipeModule("modules/ChatRoom.js", 500, function (ChatRoom) {
            // 未读消息清空
            globalData.supplier_list[index].unread = 0;
        });
        this.scanPlus();
        // 统计一次转化
        track.chat();
    }
    //更改当前工程商
    _changeCurrentSupplier(index) {
        globalData.current_supplier.area_name_list.length = 0;
        globalData.current_supplier.outstanding_cases.length = 0;
        globalData.current_supplier.partic_list.length = 0;
        $.extend(true, globalData.current_supplier, globalData.supplier_list[index]);
    }
    /**浏览量+1*/
    scanPlus() {
        api.clientConsult(globalData.current_supplier.id)
    }
    /** 加载更多工程商 */
    _evt_loadMore() {
        //没有更多了，返回
        if (globalData.current_page == 'max') {
            return
        }
        // 当前数量大于36个才load
        if (globalData.supplier_list.length >= 36) {
            let lastId = globalData.supplier_list[globalData.supplier_list.length - 1].info_bid_count;
            // 获取当前的项目类型code
            let cate_id = funs.getCurrCateCode();
            let option = {
                "city_id": globalData.selPos.city_id,
                "cate": cate_id,
                "current_page": globalData.current_page + 1
            };
            api.getSupplierList(option, {
                succ: function (list) {
                    if (list.length > 0) {
                        globalData.supplier_list.push(...funs.initSupplierList(list, true));
                        if (list.length < 36) {
                            globalData.current_page = 'max';
                        }
                    } else if (list.length == 0) {
                        globalData.current_page = 'max';
                    }
                }
            })
        }else{
            globalData.current_page = 'max';
        }
    }

    /** 切换订单类型，更新工程商列表 */
    changeDemandType(isLoad) {
        let flag = isLoad || false;
        let that = this;
        // 重置页码
        globalData.current_page = 1;
        // 获取当前的项目类型code
        let cate_id = funs.getCurrCateCode();
        let option = {
            "city_id": globalData.selPos.city_id,
            "cate": cate_id,
            "current_page": 1
        };
        // 如果是首次进站，route.js调用此方法，则不发请求；避免重复请求
        if (!flag) {
            api.getSupplierList(option, {
                succ: function (list) {
                    if (list.length > 0) {
                        globalData.supplier_list.length = 0;
                        globalData.supplier_list.push(...funs.initSupplierList(list));
                        if (that.find('.lists').length > 0) { that.find('.lists')[0].scrollTop = 0; }
                    } else if (list.length == 0) {
                        globalData.current_page = 'max';
                    }
                }
            })
        }

    }

    /**发送电话号码草稿
     * *  args:
     *  |--mobile:   ---|
     *  |--cate:   ---|
     *  |--prov:   ---|
     *  |--city:   ---|
     *  |--sem:   ---|
    */
    _evt_sendMobile() {
        let that =this;
        //为空
        if (globalData.user.mobile == '') {
            this.find('.error-data').text('手机号不能为空').parents(".error-Tip").show();
            return
        }
        if (this._checkPhone(globalData.user.mobile)) {
            let info = {
                mobile: globalData.user.mobile,
                cate: funs.getCurrCateCode(),
                prov: globalData.selPos.prov,
                city: globalData.selPos.city,
                sem: globalData.sem || '',
            };
            api.postDraft(info, {
                succ: function () {
                    // 统计一次转化
                    track.submit();
                    that.find('.hasSubmit').show().animate({'bottom':'0'},300);
                }, fail: function (data) {
                    that.find('.error-data').text(data.msg).parents(".error-Tip").show();
                }
            });
        } else {
            this.find('.error-data').text('手机号不合法').parents(".error-Tip").show();
        }

    }
    //正则检测手机号
    _checkPhone(phone) {
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
            return false;
        }
        return true;
    }
}

