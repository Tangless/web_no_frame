
let APIURL = "`{APIURL}`";
let demand_config = {
    //1: '安防监控', 2: '商用广告', 3: '门头广告', 4: '交通诱导', 5: '舞台租赁'
    //1: '落地式', 2: '墙挂式', 3: '单立柱', 4: '双立柱', { name: "单立柱", id: "3" }, { name: "双立柱", id: "4" }
    typeOptions: {
        1: {
            name: '安防监控屏', id: '1', def: {
                location: '2', color: '3', span: '2.54', wide: 5, high: 3, install: 2, box: 1, sync: 1, toBottom: 0, locationName: '室内', colorName: '全彩', installName: '墙挂式',
                forbid: { location: 3, sync: 3, color: [1, 2], install: [3, 4] },
                locationOptions: [{ name: '户外', id: '1' }, { name: '室内', id: '2' }],
                colorOptions: [{ name: '全彩', id: '3' }],
                spanOptions: { 1: { name: 'P6', id: '1' }, 2: { name: 'P8', id: '2' }, 3: { name: 'P10', id: '3' }, 4: { name: '其他', id: '4' }, },
                installOptions: [{ name: "落地式", id: "1" }, { name: "墙挂式", id: '2' }]
            }
        },
        2: {
            name: '商业广告屏', id: '2', def: {
                location: 1, color: 3, span: 6, wide: 8, high: 4.5, install: 2, box: '3', sync: 1, toBottom: 0, locationName: '户外', colorName: '全彩', installName: '墙挂式',
                forbid: { location: 3, sync: 3 },
                locationOptions: [{ name: '户外', id: '1' }, { name: '室内', id: '2' }],
                colorOptions: [{ name: '单色', id: '1' }, { name: '双色', id: '2' }, { name: '全彩', id: '3' }],
                spanOptions: { 1: { name: 'P6', id: '1' }, 2: { name: 'P8', id: '2' }, 3: { name: 'P10', id: '3' }, 4: { name: '其他', id: '4' }, },
                installOptions: [{ name: "落地式", id: "1" }, { name: "墙挂式", id: '2' }, { name: "单立柱", id: "3" }, { name: "双立柱", id: "4" }]
            }
        },
        3: {
            name: '门头字幕屏', id: '3', def: {
                location: 3, color: 1, span: 10, wide: 3, high: 0.5, install: 2, box: 4, sync: 3, toBottom: 0, locationName: '半户外', colorName: '单色', installName: '墙挂式',
                forbid: { location: 2, sync: [1, 2], color: 3, install: [3, 4], box: [1, 2, 3] },
                locationOptions: [{ name: '户外', id: '1' }, { name: '半户外', id: '3' }],
                colorOptions: [{ name: '单色', id: '1' }, { name: '双色', id: '2' }],
                spanOptions: { 1: { name: 'P6', id: '1' }, 2: { name: 'P8', id: '2' }, 3: { name: 'P10', id: '3' }, 4: { name: '其他', id: '4' }, },
                installOptions: [{ name: "落地式", id: "1" }, { name: "墙挂式", id: '2' }]
            }
        },
        4: {
            name: '交通诱导屏', id: '4', def: {
                location: 1, color: 3, span: 10, wide: 3, high: 0.5, install: 2, box: 3, sync: 1, toBottom: 0, locationName: '户外', colorName: '全彩', installName: '墙挂式',
                forbid: { location: [2, 3], sync: 3, box: 4 },
                locationOptions: [{ name: '户外', id: '1' }],
                colorOptions: [{ name: '单色', id: '1' }, { name: '双色', id: '2' }, { name: '全彩', id: '3' }],
                spanOptions: { 1: { name: 'P6', id: '1' }, 2: { name: 'P8', id: '2' }, 3: { name: 'P10', id: '3' }, 4: { name: '其他', id: '4' }, },
                installOptions: [{ name: "落地式", id: "1" }, { name: "墙挂式", id: '2' }, { name: "单立柱", id: "3" }, { name: "双立柱", id: "4" }]
            }
        },
        5: {
            name: '舞台租赁屏', id: '5', def: {
                location: 2, color: 3, span: 4, wide: 6, high: 4, install: 1, box: 2, sync: 1, toBottom: 0, locationName: '室内', colorName: '全彩', installName: '落地式',
                forbid: { location: 3, sync: 3, color: [1, 2], install: [3, 4], box: [3, 4] },
                locationOptions: [{ name: '户外', id: '1' }, { name: '室内', id: '2' }],
                colorOptions: [{ name: '全彩', id: '3' }],
                spanOptions: { 1: { name: 'P6', id: '1' }, 2: { name: 'P8', id: '2' }, 3: { name: 'P10', id: '3' }, 4: { name: '其他', id: '4' }, },
                installOptions: [{ name: "落地式", id: "1" }, { name: "墙挂式", id: '2' }]
            }
        }
    },
    faultOptions: {
        1: {
            name: '安防监控屏', id: '1', fault: '3', faultName: '有色彩问题'
        },
        2: {
            name: '商业广告屏', id: '2', fault: '1', faultName: '整屏或部分不亮'
        },
        3: {
            name: '门头字幕屏', id: '3', fault: '4', faultName: '无法更换屏幕内容'
        },
        4: {
            name: '交通诱导屏', id: '4', fault: '2', faultName: '出现亮点暗点'
        },
        5: {
            name: '舞台租赁屏', id: '5', fault: '1', faultName: '整屏或部分不亮'
        }
    }

};
let locationOptions = [{ name: '户外', id: '1' }, { name: '室内', id: '2' }];
let colorOptions = [{ name: '单色', id: '1' }, { name: '双色', id: '2' }, { name: '全彩', id: '3' }];
let installOptions = [{ name: "落地式", id: "1" }, { name: "墙挂式", id: '2' }, { name: "单立柱", id: "3" }, { name: "双立柱", id: "4" }];

let typeList = {
    "install": [
        { name: '门头字幕屏', id: '3' },
        { name: '商业广告屏', id: '2' },
        { name: '舞台租赁屏', id: '5' },
        { name: '交通诱导屏', id: '4' },
        { name: '安防监控屏', id: '1' },
    ],
    "repair": [
        { name: '门头字幕屏', id: '3' },
        { name: '商业广告屏', id: '2' },
        { name: '舞台租赁屏', id: '5' },
        { name: '交通诱导屏', id: '4' },
        { name: '安防监控屏', id: '1' },
    ],
    "rental": [
        { name: '婚礼宴会', id: '1' },
        { name: '活动庆典', id: '2' },
        { name: '舞台演出', id: '3' },
        { name: '会议展会', id: '4' },
    ],
    "fault": [
        { name: '整屏或部分不亮', id: '1' },
        { name: '出现亮点暗点', id: '2' },
        { name: '有色彩问题', id: '3' },
        { name: '无法更换屏幕内容', id: '4' },
        { name: '屏幕移位', id: '5' },
        { name: '其他', id: '0' },
    ]
};
let currTime = funs.getCurrentTime().date;
/** 全局数据 */
let globalData = {
    demand: {
        menuTab: "install",//首页tab选择:install--安装，repair--维修，rental--租赁
        typeList: typeList,
        demand_config: demand_config,
        typeId: 1,
        typeName: "",//使用环境
        colorId: 1,
        colorName: "",//颜色
        locationId: 1,
        locationName: "",//户内外
        faultId: 1,
        faultName: "",//故障原因
        startTime: currTime,//开始时间
        totalTime: 0.5,//总时间
        sHeight: 3,//高
        sWidth: 12,//宽
        toBottom: 0,//离地高度
        installId: 1,
        installMethod: "",//安装方式
        currDistance: "4.81m",//观看距离
        locationOptions: locationOptions,
        colorOptions: colorOptions,
        installOptions: installOptions,
        sync: 1,
        box: 1,
        totalPrice: 3223
    },
    user: {
        id: '422',
        im_token: '7033e35e6e9171a30e745b8a6ae717b4',
        type: 0,
        mobile:""
    },
    current_supplier: {
        "id": 3319226,
        "has_rent": true,
        "avatar": "/img/auth.png",
        "has_repair": true,
        "nickname": "谢冬霞",
        "has_install": true,
        "com": "深圳市绿景程光电有限公司",
        "info_com_summary": "",
        "info_consult_count": 0,
        "info_bid_count": 0,
        "mobile": "15504650124",
        "area_name_list": ["深圳市",],
        "outstanding_cases": [],
        "partic_list": [],
        "hasLoadDetal":false
    },
    supplier_list: [

    ],
    sem: "",
    ipPos: {
        city: "深圳市",
        city_id: 440300,
        county: "南山区",
        county_id: 440305,
        prov: "广东省",
        prov_id: 440000,
        addr: ""
    },
    selPos: {
        city: "深圳市",
        city_id: 440300,
        county: "南山区",
        county_id: 440305,
        prov: "广东省111",
        prov_id: 440000,
        addr: ""
    },
    cnt: '384',
    quotationOptions: {
        working: 0,
        scene_type: 0,
        install_way: 0,
        color: 0,
        spacing: 0,
        wide: 0.0,
        high: 0.0,
        ground_high: 0.0
    },
    current_page: 1,//supplier_list页码
    cityList:[],
    domReady: false, //页面是否已经load

};