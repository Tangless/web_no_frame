import * as bm from "../js/baseModule.js";

export class Module extends bm.baseModule {
    constructor(view) {
        super(view);
        let that = this;
        let dom = this.view.find('.quotationTool_Vue')[0];
        this.distanceRange = ['0.7m', '0.95m', '1.27m', '1.46m', '1.56m', '1.59m', '1.9m', '2.38m', '2.5m', '2.54m', '3m', '4m', '4.75m', '5m', '6m', '7.625m', '8m', '10m', '16m'];

        this.Demand_VUE = window['menu'] = new Vue({
            el: dom,
            data: {
                demand: globalData.demand,
                selPos: globalData.selPos,
                locationOptions: globalData.demand.locationOptions
            },
            watch: {
                "demand.menuTab": function (a, b) {
                    //初始化数据
                    that.init_data();
                    that.bindData();

                    if (a == 'rental') {
                        setTimeout(function () {
                            that.init_calendar();
                        }, 500);
                    }
                    if (a != "repair") {
                        setTimeout(function () {
                            that.init_range();
                            that.blurInput();
                        }, 5);
                    }
                }
            }
        });
        this.init_data();
        this.bindData();
        this.init_range();
        this.init_calendar();
        this.blurInput();

    }
    /**init数据*/
    init_data() {
        if (this.Demand_VUE.demand.menuTab == 'install') {
            //安装
            this.Demand_VUE.demand.typeId = 3;
            this.Demand_VUE.demand.typeName = "门头字幕屏";//使用环境
            this.Demand_VUE.demand.colorId = 1;
            this.Demand_VUE.demand.colorName = "单色";//颜色
            this.Demand_VUE.demand.locationId = 3;
            this.Demand_VUE.demand.locationName = "半户外";//户内外
            this.Demand_VUE.demand.sHeight = 3;//高
            this.Demand_VUE.demand.sWidth = 0.5;//宽
            this.Demand_VUE.demand.toBottom = 0;//离地高度
            this.Demand_VUE.demand.installId = 2;
            this.Demand_VUE.demand.installMethod = "墙挂式";//安装方式
            this.Demand_VUE.demand.currDistance = "10m";//观看距离
            this.Demand_VUE.demand.totalPrice = 3223;

        } else if (this.Demand_VUE.demand.menuTab == 'repair') {
            this.Demand_VUE.demand.typeId = 3;
            this.Demand_VUE.demand.typeName = "门头字幕屏";//使用环境
            this.Demand_VUE.demand.faultId = 4;
            this.Demand_VUE.demand.faultName = "无法更换屏幕内容";//故障原因

        } else {
            //租赁
            this.Demand_VUE.demand.typeId = 1;
            this.Demand_VUE.demand.typeName = "婚礼宴会";//使用环境
            this.Demand_VUE.demand.locationId = 1;
            this.Demand_VUE.demand.locationName = "户外";//户内外
            this.Demand_VUE.demand.startTime = funs.getCurrentTime().date;;//开始时间
            this.Demand_VUE.demand.totalTime = 1;//总时间
            this.Demand_VUE.demand.sHeight = 3;//高
            this.Demand_VUE.demand.sWidth = 12;//宽
            this.Demand_VUE.demand.currDistance = "4.81m";//观看距离
            this.Demand_VUE.demand.totalPrice = 0;

        }
    }
    /**range监听 vue绑定数据，tab每一次切换必须重新调一次本方法，因为有元素的hidden*/
    init_range() {
        let that = this;
        let dom1 = $('.spider');
        let dom2 = dom1.find('.slider');
        let dom3 = dom1.find('.fill');
        let words = dom1.find('.words');

        //drag用来存储滑块允许拖拽和不允许拖拽的状态
        let drag = 0;
        let percent = 0;
        let offX = 0;
        let wid = parseInt(dom1[0].offsetWidth);
        //在滑动条上绑定click事件以实现点击任意位置,自动调整滑块和填充块的效果
        dom1.on('click', function (e) {
            if (e.target === dom2[0]) {
                //点击滑块自身不做任何事情
            } else {
                if (e.offsetX > wid) {
                    dom2.css("left", wid + 'px');
                    words.css("left", wid-10 + 'px');
                    dom3.css("width", wid + 'px');
                    offX = wid;
                } else if (e.offsetX < 13) {
                    dom2.css("left",'0');
                    words.css("left",'0');
                    dom3.css("width",'0');
                    offX = 0;
                } else {
                    dom2.css("left", e.offsetX - 6 + 'px');
                    words.css("left", e.offsetX - 11+ 'px');
                    dom3.css("width", e.offsetX - 6 + 'px');
                    offX = e.offsetX - 6;
                }
                percent = parseInt(offX) / dom1.width();
                let currRate = Math.floor(percent * (that.distanceRange.length));
                if (currRate == that.distanceRange.length) {
                    currRate = that.distanceRange.length - 1;
                }
                //取得当前间距
                that.Demand_VUE.demand.currDistance = that.distanceRange[currRate];
                that.getData();
            }
        });
        //修改drag的状态
        dom2.on('mousedown', function () {
            drag = 1;
        });
        //释放按钮绑定在document上,保证在整个页面容器里面任何地方松开按钮都能修改drag的状态
        $(document).on('mouseup', function () {
            drag = 0;

            // 使滑块和填充块跟随移动,这里使用的pageX,需要计算和视窗左侧的距离而不是和滑动块左侧的距离
        }).on('mousemove', function (e) {
            if (drag == 1) {
                if (e.pageX >= (wid +dom1.width())) {
                    dom2.css("left", dom1.width() - 10 + 'px');
                    words.css("left", dom1.width() - 15 + 'px');
                    dom3.css("width", dom1.width() - 10 + 'px');
                    offX = wid;
                } else if (e.pageX < wid+10) {
                    dom2.css("left",'0');
                    words.css("left",'0');
                    dom3.css("width",'0');
                    offX = 0;
                } else {
                    dom2.css("left", e.pageX - wid  -13 + 'px');
                    words.css("left", e.pageX - wid - 18 + 'px');
                    dom3.css("width", e.pageX - wid -13 + 'px');
                    offX = e.pageX - wid-10;
                }
                percent = parseInt(offX) / dom1.width();
                let currRate = Math.floor(percent * (that.distanceRange.length));
                if (currRate == that.distanceRange.length) {
                    currRate = that.distanceRange.length - 1;
                }
                //取得当前间距
                that.Demand_VUE.demand.currDistance = that.distanceRange[currRate];
                that.getData();
            }
        });
    }

    /**inout 失去焦点*/
    blurInput() {
        let that = this;
        this.find('.input').on("blur", function () {
            let val = $(this).val().trim();
            if ((/[^0-9.]/g.test(val))) {
                $(this).val(0);
            }
            globalData.demand.sWidth = that.find(".input-wide").val() || globalData.demand.sWidth;
            globalData.demand.sHeight = that.find(".input-hide").val() || globalData.demand.sHeight;
            globalData.demand.totalTime = that.find(".input-time").val() || globalData.demand.totalTime;
            globalData.demand.toBottom = that.find(".input-height").val() || globalData.demand.toBottom;

            that.getData();
        });

    }
    /**实例化日历*/
    init_calendar() {
        let that = this;
        /**日历*/
        this.find('#ca').calendar({
            width: 240,
            height: 240,
            data: [
                {
                    date: '2015/12/24',
                    value: 'Christmas Eve'
                },
                {
                    date: '2015/12/25',
                    value: 'Merry Christmas'
                },
                {
                    date: '2016/01/01',
                    value: 'Happy New Year'
                }
            ],
            onSelected: function (view, time, data) {
                that.Demand_VUE.demand.startTime = funs.dateUTC(time).date;
                that.find(".rental-calendar").hide();

            }

        });
        $('#dd').calendar({
            trigger: '#dt',
            zIndex: 999,
            format: 'yyyy-mm-dd',
            onSelected: function (view, date, data) {
                console.log('event: onSelected')
            },
            onClose: function (view, date, data) {
                console.log('event: onClose')
                console.log('view:' + view)
                console.log('date:' + date)
                console.log('data:' + (data || 'None'));
            }
        });
    }

    /** 计算报价
     *  args:
     *  |--working:   ---|
     *  |--scene_type:   ---|
     *  |--install_way:   ---|
     *  |--color:   ---|
     *  |--spacing:   ---|
     *  |--assemble_way:   ---|
     *  |--wide:   ---|
     *  |--high:   ---|
     *  |--transport:   ---|
     *  |--products:   ---|
     *  |--ground_high:   ---|
     * */
    getData() {
        let quotationOptions = {
            working: parseInt(globalData.demand.typeId),
            scene_type: parseInt(globalData.demand.locationId),
            install_way: parseInt(globalData.demand.installId),
            color: parseInt(globalData.demand.colorId),
            spacing: parseFloat(globalData.demand.currDistance) + "",
            wide: parseFloat(globalData.demand.sWidth) || 0.0,
            high: parseFloat(globalData.demand.sHeight) || 0.0,
            ground_high: parseFloat(globalData.demand.toBottom) || 0.0,
            assemble_way: parseInt(globalData.demand.box),
            transport: parseInt(globalData.demand.sync),
        }
        if (globalData.demand.menuTab == "install") {
            $.extend(true, globalData.quotationOptions, quotationOptions);
            api.countPrices(globalData.quotationOptions, {
                succ: function (json) {
                    globalData.demand.totalPrice = json.total;
                },
                fail: function () { }
            });
        } else if (globalData.demand.menuTab == 'rental') {
            this.rentalComputed();
        }
    }
    /**侧滑打开城市选择*/
    _evt_openSelectCity() {
        funs.swipeModule("modules/SelectAddress.js", 386, function () { });
    }


    /**使用环境选择*/
    _evt_chooseType(target, hit) {
        let typeId = this.Demand_VUE.demand.typeId = parseInt($(target).attr("typeId"));
        this.Demand_VUE.demand.typeName = $(target).text();
        this.bindData();
        this.getData()
    }

    /**租赁使用开始时间选择*/
    _evt_getStartTime() {
        this.find(".rental-calendar").show();
    }

    /**租赁总共时间*/
    _evt_totalTime(target, hit) {
        let type = $(target).attr("type");
        let val = parseFloat(this.find(".totalTime .input-time").val());
        if (type == 'minus') {
            //减法
            val = val - 1;
            if (val <= 1) {
                val = 1;
            }
        } else if (type == "plus") {
            //加法
            val = val + 1;

        }
        this.find(".totalTime .input-time").val(val);
        this.Demand_VUE.demand.totalTime = val;
    }
    /**Option选择*/
    _evt_chooseOption(target, hit) {
        let type = $(target).attr('type');
        this.Demand_VUE.demand[type + 'Id'] = $(target).attr(type + "Id");
        this.Demand_VUE.demand[type + 'Name'] = $(target).text();
        if (type == 'location') {
            this.init_range();
        }
        this.getData();
    }

    /**数据联动*/
    bindData() {

        if (this.Demand_VUE.demand.menuTab == 'install') {
            //安装
            let def = this.Demand_VUE.demand.demand_config.typeOptions[this.Demand_VUE.demand.typeId].def;
            this.Demand_VUE.locationOptions = def.locationOptions;
            this.Demand_VUE.demand.colorOptions = def.colorOptions;
            this.Demand_VUE.demand.installOptions = def.installOptions;
            this.Demand_VUE.demand.colorId = def.color;
            this.Demand_VUE.demand.colorName = def.colorName;
            this.Demand_VUE.demand.locationId = def.location;
            this.Demand_VUE.demand.locationName = def.locationName;//户内外
            this.Demand_VUE.demand.sHeight = def.high;//高
            this.Demand_VUE.demand.sWidth = def.wide;//宽
            this.Demand_VUE.demand.toBottom = def.toBotom;//离地高度
            this.Demand_VUE.demand.installId = def.install;
            this.Demand_VUE.demand.installMethod = def.installName;//安装方式
            this.Demand_VUE.demand.box = def.box;//安装方式
            this.Demand_VUE.demand.sync = def.sync;//安装方式
            //设置间距计算方法
            this.distanceRange = ['0.7m', '0.95m', '1.27m', '1.46m', '1.56m', '1.59m', '1.9m', '2.38m', '2.5m', '2.54m', '3m', '4m', '4.75m', '5m', '6m', '7.625m', '8m', '10m', '16m'];
            this.countSpanWidth(def.span + 'm');

        } else if (this.Demand_VUE.demand.menuTab == 'repair') {

            this.Demand_VUE.demand.faultId = this.Demand_VUE.demand.demand_config.faultOptions[this.Demand_VUE.demand.typeId].fault;
            this.Demand_VUE.demand.faultName = this.Demand_VUE.demand.demand_config.faultOptions[this.Demand_VUE.demand.typeId].faultName;
        } else if (this.Demand_VUE.demand.menuTab == 'rental') {
            this.Demand_VUE.locationOptions = globalData.demand.locationOptions;
        }
    }
    /** 设置间距计算方法 */
    countSpanWidth(span) {
        this.Demand_VUE.demand.currDistance = span;//观看距离
        let index = this.distanceRange.indexOf(span);
        let rate = index / this.distanceRange.length * 100;
        rate = rate.toFixed(1);
        $('.blue-cover').css('width', rate + '%');
        $('.change-value').css('left', rate - 4 + '%').html(span);
        $('.span-range').val(rate);

        $('.spider').find('.fill').css('width', rate + '%').next('.slider').css('left', rate + '%')
            .next('.words').css("left",rate-1+'%');
        if (globalData.demand.menuTab == 'rental') {
            this.rentalComputed();
        }
    }
    /**租赁间距更改后价格计算*/
    rentalComputed() {
        let price = 0;
        switch (parseFloat(this.Demand_VUE.demand.currDistance)) {
            case 2.5: price = 450; break;
            case 3.91: price = 300; break;
            case 4.81: price = 200; break;
            case 5.9: price = 150; break;
        }
        if (this.Demand_VUE.demand.locationId == '1') {
            switch (parseFloat(this.Demand_VUE.demand.currDistance)) {
                case 3.91: price = 350; break;
                case 4.81: price = 250; break;
                case 5.9: price = 200; break;
            }
        }
        globalData.demand.totalPrice = price;
    }
}