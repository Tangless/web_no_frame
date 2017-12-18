import * as bm from "../js/baseModule.js";

export class Module extends bm.baseModule {
    constructor(view) {
        super(view);
        let dom = this.view.find('.personalHomepage_Vue')[0];
        new Vue({
            el: dom,
            data: globalData.current_supplier,
            computed:{
                cases: function () {
                    //计算时间戳为月份
                    $.each(this.outstanding_cases,function (i, val) {
                        let date = new Date(val.created_at*1000);
                        let y = date.getFullYear();
                        let m = date.getMonth()+1;
                        val.created_at_text = y+'年'+m+'月';
                        //转换业务类型和屏幕类型
                        let type_name;
                        if(val.cate == '3'){
                            val.cate_name = '租赁';
                            switch (val.type){
                                case 1:
                                    type_name = '婚礼宴会';break;
                                case 2:
                                    type_name = '活动庆典';break;
                                case 3:
                                    type_name = '舞台演出';break;
                                case 4:
                                    type_name = '会议展会';break;
                            }
                        }else{
                            switch (val.type){
                                case 1:
                                    type_name = '门头屏';break;
                                case 2:
                                    type_name = '户外广告屏';break;
                                case 3:
                                    type_name = '信息告示屏';break;
                                case 4:
                                    type_name = '舞台用屏';break;
                                case 5:
                                    type_name = '室内高清屏';break;
                                case 0:
                                    type_name = '其他用屏';break;
                            }
                            if(val.cate == '2'){
                                val.cate_name = '维修';
                            }else{
                                val.cate_name = '安装';
                            }
                        }
                        val.type_name = type_name;
                    });
                    return this.outstanding_cases
                },
                partic: function () {
                    $.each(this.partic_list,function (i, val) {
                        //计算时间戳为月份
                        let date = new Date(val.published_at*1000);
                        let y = date.getFullYear();
                        let m = date.getMonth()+1;
                        let d = date.getDate();
                        val.published_at_text = y +'-' + m + '-' +d;
                        // 处理屏幕类型
                        let type_name;
                        if(val.cate == 3){
                            val.cate_name = '租赁';
                            switch (val.type){
                                case 1:
                                    type_name = '婚礼宴会';break;
                                case 2:
                                    type_name = '活动庆典';break;
                                case 3:
                                    type_name = '舞台演出';break;
                                case 4:
                                    type_name = '会议展会';break;
                            }
                        }else{
                            switch (val.type){
                                case 1:
                                    type_name = '门头屏';break;
                                case 2:
                                    type_name = '户外广告屏';break;
                                case 3:
                                    type_name = '信息告示屏';break;
                                case 4:
                                    type_name = '舞台用屏';break;
                                case 5:
                                    type_name = '室内高清屏';break;
                                case 0:
                                    type_name = '其他用屏';break;
                            }
                            if(val.cate == 2){
                                val.cate_name = '维修';
                            }else{
                                val.cate_name = '安装';
                            }
                        }
                        val.type_name = type_name;
                    });
                    return this.partic_list
                }
            }
        })
    }
    afterInstall(){
        // 如果此工程商信息没有请求过数据
        if(!globalData.current_supplier.hasLoadDetal){
            api.getSupplierInfo(globalData.current_supplier.id,{
                succ:function (user) {
                    //标记,合并替换
                    globalData.current_supplier.partic_list.length = 0;
                    globalData.current_supplier.outstanding_cases.length = 0;
                    globalData.current_supplier.partic_list.push(...user.partic_list);
                    globalData.current_supplier.outstanding_cases.push(...user.outstanding_cases);
                    $.extend(true,globalData.current_supplier,user);
                    // 替换列表数据
                    $.each(globalData.supplier_list,function (i,item) {
                        if(item.id == user.id){
                            $.extend(true,item,user);
                            item.hasLoadDetal = true;
                        }
                    })
                }
            });
        }
    }
    /**侧滑打开电话页*/
    _evt_openPhoneNumber(){
        funs.swipeModule("modules/PhoneNumber.js",386);
        // 统计一次转化
        track.call();
    }
    /**侧滑打开IM*/
    _evt_openChatRoom(){
        funs.swipeModule("modules/ChatRoom.js",550);
        // 替换列表数据
        $.each(globalData.supplier_list,function (i,item) {
            if(item.id == globalData.current_supplier.id){
                item.unread = 0;
                globalData.current_supplier.unread = 0;
            }
        });
        // 统计一次转化
        track.chat();
    }
}