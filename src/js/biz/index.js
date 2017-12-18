import * as bm from "../js/baseModule.js";
import * as Menu from "../modules/Menu.js";

export class Module extends bm.baseModule {
    constructor(view) {
        super(view);
        /** 实例化引入的模块 */
        new Menu.Module($('#Menu'));
        funs.getModule('modules/QuotationTool.js', $('#quotation'));

        this.init();
    }
    init() {
        let that = this;

        //获取用户信息
        api.getUserInfo({
            succ: function (user) {
                $.extend(true, globalData.user, user);
                webimConfigs.login();
            },
            fail: function () {

            }
        });
        //获取IP地址
        api.new_ipLocation({
            succ: function (json) {
                $.extend(true, globalData.ipPos, json);
                $.extend(true, globalData.selPos, json);
                //获取当前城市的工程商数量
                api.getCertifySupplierCntByCity(json.city_id, {
                    succ: function (json) {
                        globalData.cnt = json.cnt;
                    }
                });
                // 获取当前的项目类型code
                let cate_id = funs.getCurrCateCode();
                //获取当前城市的工程商列表
                let option = {
                    cate: cate_id,
                    city_id: parseInt(json.city_id),
                    current_page: 1
                };
                //获取工程商列表
                api.getSupplierList(option, {
                    succ: function (json) {
                        globalData.supplier_list.length = 0;
                        globalData.supplier_list.push(...funs.initSupplierList(json));
                        funs.getModule('modules/SupplierList.js', $('#content'))
                    }
                });
            }
        });
        this.getSem();
        //获取城市列表
        $.getJSON("/prov_city_county.json", function (json) {
            $.extend(true,globalData.cityList,json);
        });
    }
    /**js解析url参数，获取sem*/
    getSem() {
        var doc_reffer = document.referrer.split("?")[1];
        try {
            var str2 = decodeURI(doc_reffer);
        } catch (e) {
            var str2 = "";
        }
        try {
            var str = decodeURI(window.location.href.split('?')[1]);
        } catch (e) {
            var str = "";
        }
        function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = str.match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
        function GetReferrer(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = str2.match(reg);
            if (r != null) return unescape(r[2]); return null;
        }

        var word = GetReferrer("word");//百度的搜索词
        var query = GetReferrer("query");//搜狗的搜索词
        var source = GetQueryString("source");
        var plan = GetQueryString("plan");
        var unit = GetQueryString("unit");
        var keyword = GetQueryString("keyword");
        var e_keywordid = GetQueryString("e_keywordid");
        var e_matchtype = GetQueryString("e_matchtype");
        var e_creative = GetQueryString("e_creative");
        var e_adposition = GetQueryString("e_adposition");
        var e_pagenum = GetQueryString("e_pagenum");
        var repairStatistics = {
            source: source ? source : '',
            word: word || query || '',
            plan: plan ? plan : '',
            unit: unit ? unit : '',
            keyword: keyword ? keyword : '',
            e_keywordid: e_keywordid ? e_keywordid : '',
            e_matchtype: e_matchtype ? e_matchtype : '',
            e_creative: e_creative ? e_creative : '',
            e_adposition: e_adposition ? e_adposition : '',
            e_pagenum: e_pagenum ? e_pagenum : '',
            UrlReferrer: decodeURI(location.href) ? decodeURI(location.href) : '',
        }
        console.log(repairStatistics);
        if (repairStatistics.source || repairStatistics.plan || repairStatistics.unit || repairStatistics.keyword || repairStatistics.e_keywordid || repairStatistics.e_matchtype
            || repairStatistics.e_creative || repairStatistics.e_adposition || repairStatistics.e_pagenum || repairStatistics.UrlReferrer) {
            var repair_statistics = JSON.stringify(repairStatistics);
            globalData.sem = repair_statistics;
        }

    }
    /**根据url获取menuTAb*/
    // getMenuTab() {
    //     let url = window.location.href;
    //     let arg = "#menuTab";
    //     let pattern = arg + '=([^&]*)';
    //     if (url.match(pattern)) {
    //         var tmp = '/(' + arg + '=)([^&]*)/gi';
    //         tmp = url.match(eval(tmp))[0].split("=")[1];
    //         return tmp;
    //     }
    //     window.location.href = url + "?#menuTab=install";
    //     return "install";
    // }

    _evt_closeBigImg(obj) {
        $(obj).remove();
    };
}

/**
 * index作为入口的页面模块，需要在此处实例化一个对象；其他模块不需要
 * 实例化操作放在路由加载执行完毕的事件中执行，能保证页面不闪动
 */
$(window).on('routeReady',function () {
    new Module($("body"))
});

/** 因为index.js作为requireJs的入口文件，是异步载入的；route.js监听document load的事件触发时，有可能index.js还没被加载完成。
 * 必须在document的load事件后再实例化index，是因为load之前就加载的话，会面临路由变化页面闪动的问题。
 * 如果首页模块没有被实例化,且页面已经load，则说明上面的routeReady监听触发时，index.js没有加载完成,这会导致index模块没有被实例化。
* 因此，在此处再做一次index的实例化。
 */
(function newIndexPage() {
    if(!funs.hasLoadModuleArray.hasOwnProperty('Index') && globalData.domReady){
        new Module($("body"));
    }
})();