import * as bm from "../js/baseModule.js";
// import * as SelectCity from "../modules/SelectCity.js";

export class Module extends bm.baseModule {
    constructor(view) {
        super(view);
        this.jsonList;
        var that = this;
        that.jsonList = globalData.cityList;
        this.selectVUE = new Vue({
            el: ".selectAddress_vue",
            data: {
                provList: [
                    [{ "adcode": 820000, "name": "澳门" }, { "adcode": 340000, "name": "安徽" }, { "adcode": 110000, "name": "北京" }, { "adcode": 500000, "name": "重庆" }, { "adcode": 350000, "name": "福建" }, { "adcode": 620000, "name": "甘肃" }, { "adcode": 440000, "name": "广东" }, { "adcode": 450000, "name": "广西" }, { "adcode": 520000, "name": "贵州" }],
                    [{ "adcode": 460000, "name": "海南" }, { "adcode": 130000, "name": "河北" }, { "adcode": 230000, "name": "黑龙江" }, { "adcode": 410000, "name": "河南" }, { "adcode": 420000, "name": "湖北" }, { "adcode": 430000, "name": "湖南" }, { "adcode": 320000, "name": "江苏" }, { "adcode": 360000, "name": "江西" }, { "adcode": 220000, "name": "吉林" }],
                    [{ "adcode": 210000, "name": "辽宁" }, { "adcode": 150000, "name": "内蒙古" }, { "adcode": 640000, "name": "宁夏" }, { "adcode": 630000, "name": "青海" }, { "adcode": 370000, "name": "山东" }, { "adcode": 310000, "name": "上海" }, { "adcode": 140000, "name": "山西" }, { "adcode": 610000, "name": "陕西" }, { "adcode": 510000, "name": "四川" }],
                    [{ "adcode": 120000, "name": "天津" }, { "adcode": 810000, "name": "香港" }, { "adcode": 650000, "name": "新疆" }, { "adcode": 540000, "name": "西藏" }, { "adcode": 530000, "name": "云南" }, { "adcode": 330000, "name": "浙江" }]
                ],
                cityList: [],
                areaList: [],
                provSelect: "省份",
                citySelect: "城市",
                areaSelect: "区县",
                addr: "",
                prov_id: 0,
                city_id: 0,
                area_id: 0,
                showModel: "prov"//prov:省份，city：城市，area：区县
            }
        });
    }
    afterInstall(){
        this.selectVUE.provSelect = globalData.selPos.prov;
        this.selectVUE.citySelect = globalData.selPos.city;
        this.selectVUE.prov_id = globalData.selPos.prov_id;
        this.selectVUE.city_id = globalData.selPos.city_id;
        this.selectVUE.showModel = 'prov';
        let adcode = globalData.selPos.prov_id;
        for (let i = 0; i <= this.jsonList.length; i++) {
            if (adcode == this.jsonList[i].adcode) {
                this.selectVUE.cityList = this.jsonList[i].subs;
                break;
            }
        }
    }
    /**顶部tab切换*/
    _evt_choose(target, hit) {
        this.selectVUE.showModel = $(hit).attr('type');
    }

    /**选择省份*/
    _evt_chooseProv(target, hit) {
        let adcode = this.selectVUE.prov_id = $(hit).attr('adcode');
        this.selectVUE.provSelect = $(hit).text();
        this.selectVUE.citySelect = "城市";
        this.selectVUE.areaSelect = "区县";
        this.selectVUE.addr = "";
        for (let i = 0; i <= this.jsonList.length; i++) {
            if (adcode == this.jsonList[i].adcode) {
                this.selectVUE.cityList = this.jsonList[i].subs;
                this.selectVUE.showModel = "city";

                break;
            }
        }
    }
    /**选择城市*/
    _evt_chooseCity(target, hit) {
        let adcode = this.selectVUE.city_id = $(hit).attr('adcode');
        this.selectVUE.citySelect = $(hit).text();
        // this.selectVUE.areaSelect = "区县";
        // this.selectVUE.addr = "";

        this._evt_goback();
        // for (let i = 0; i <= this.selectVUE.cityList.length; i++) {
        //     if (adcode == this.selectVUE.cityList[i].adcode) {
        //         this.selectVUE.areaList = this.selectVUE.cityList[i].subs;
        //         this.selectVUE.showModel = "area";
        //
        //         break;
        //     }
        // }
    }
    /**选择区县*/
    _evt_chooseArea(target, hit) {
        let adcode = this.selectVUE.area_id = $(hit).attr('adcode');
        this.selectVUE.areaSelect = $(hit).text();
        this.selectVUE.addr = "";


    }
    afterUninstall() {
        if (this.selectVUE.citySelect != "城市") {
            globalData.selPos.prov = this.selectVUE.provSelect;
            globalData.selPos.prov_id = this.selectVUE.prov_id;
            globalData.selPos.city = this.selectVUE.citySelect;
            globalData.selPos.city_id = this.selectVUE.city_id;
            globalData.selPos.county = this.selectVUE.areaSelect;
            globalData.selPos.county_id = this.selectVUE.area_id;
            globalData.selPos.addr = this.selectVUE.addr;
            funs.getModuleFuns('modules/SupplierList.js', function (mod) {
                mod.changeDemandType();
            });
            if (this.selectVUE.areaSelect == "区县") {
                globalData.selPos.county = "";
            }

            //获取当前城市的工程商数量
            api.getCertifySupplierCntByCity(globalData.selPos.city_id, {
                succ: function (json) {
                    globalData.cnt = json.cnt;
                }
            });
        }
    }
}

