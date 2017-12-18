/** ====== 全局公共方法 ======*/
let funs = {
    /** 加载模块 */
    getModule: function (moduleSrc, parent, cb) {
        //截取模块的名字； 此处限制了module下不能有三级目录，也就是说module下的文件夹只能是代表一个模块；不能嵌套文件夹；
        let moduleName = moduleSrc.split('/')[1].split('.')[0];
        let moduleNameNohash = moduleName.split('-')[0];
        let that = this;
        $.ajax({
            type: 'GET',
            url: 'modules/' + moduleNameNohash + '.html',
            dataType: "html",
            success: function (result) {
                parent.append(result);
                that.loadModule(moduleName, moduleNameNohash, cb);

            },
            error: function () {
                alert('加载失败，请检查网络后重试', 'warning');
                cb.fail() && cb.fail();
            }

        })
    },
    /** 侧滑显示模块 */
    swipeModule: function (moduleSrc, width, callback) {
        //截取模块的名字； 此处限制了module下不能有三级目录，也就是说module下的文件夹只能是代表一个模块；不能嵌套文件夹；
        let moduleName = moduleSrc.split('/')[1].split('.')[0];
        let moduleNameNohash = moduleName.split('-')[0];
        let that = this;
        //获取当前展开的侧边栏个数
        let index = parseInt($('[type="AsideModal"]').length);
        $.ajax({
            type: 'GET',
            url: 'modules/' + moduleNameNohash + '.html',
            dataType: "html",
            success: function (result) {
                let module = result;
                let dom = '<div id="asideModulePanel' + index + '" type="AsideModal" style="z-index:' + (999 + index) + '"><div class="asideModuleContent" style="width:' + width + 'px"><span class="icon-cross"></span><div class="content">' + module + '</div></div></div>';
                $('body').append(dom);
                let panel = $('#asideModulePanel' + index);
                that.loadModule(moduleName, moduleNameNohash, function (mod) {
                    panel.find('.asideModuleContent').css('margin-left', -width + 'px');
                    callback && callback(mod);
                    mod.config = {
                        parent: panel
                    };
                    //点击空白处收起侧边，然后移除当前div
                    panel.on('click', function (e) {
                        if (e.target == this || e.target.className == 'icon-cross') {
                            panel.find('.asideModuleContent').css('margin-left', '0');
                            setTimeout(function () {
                                panel.remove();
                                mod.afterUninstall && mod.afterUninstall();
                            }, 310)
                        }
                    })
                });
            },
            error: function () {
                // alert('加载失败，请检查网络后重试');
            }

        });

    },
    loadModule: function (name, nameNoHash, cb) {
        let that = this;
        require(["../modules/" + name + ".js"], function (mod) {
            let module = new mod.Module($('#' + nameNoHash));
            that.hasLoadModuleArray[nameNoHash] = module;
            cb && cb(module);
        });
    },
    /** 获取模块类的functions */
    getModuleFuns: function (src, cb) {
        let that = this;
        let moduleName = src.split('/')[1].split('.')[0];
        let moduleNameNohash = moduleName.split('-')[0];

        // 如果加载过模块，则直接返回；没加载过，则先new再返回
        if (that.hasLoadModuleArray[moduleNameNohash]) {
            cb && cb(that.hasLoadModuleArray[moduleNameNohash])
        } else {
            require(["../" + src], function (mod) {
                let module = new mod.Module($('#' + moduleNameNohash));
                cb && cb(module)
            });
        }
    },
    //已经加载过的模块
    hasLoadModuleArray: {},



    /**验证邮箱 */
    checkEmail: function (mail) {
        let msg = '';
        let pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (!pattern.test(mail)) {
            msg = "请输入正确的邮箱地址";
            return msg;
        }
        return true;
    },
    /**计算json数据的条目数*/
    jsonLength: function (json) {
        let count = 0;
        for (let item in json) {
            count++;
        }
        return count
    },
    /**获取当前日期 */
    getCurrentTime: function () {
        let myDate = new Date();
        let date = myDate.toLocaleDateString();     //
        let mytime = myDate.toLocaleTimeString();     //获取当前时间
        let time = mytime.substr(2, mytime.length);
        let halfDay = mytime.substr(0, 2);
        let array = time.split(':');
        if (halfDay == '下午') {
            array[0] = parseInt(array[0]) + 12;
            time = array.join(':');
        } else {
            //如果是上午12点，则变成0点
            if (array[0] == '12') {
                array[0] = '00';
                time = array.join(':');
            }
        }
        let currentTime = {
            "date": date,//2017-11-15
            "time": time //12:00:00
        };
        return currentTime
    },
    /**UTC时间格式转换*/
    dateUTC: function (time) {
        let date = new Date(time);
        let localeString = date.toLocaleString();
        let localeDateString = date.toLocaleDateString();
        let localeTimeString = date.toLocaleTimeString();
        let Time = {
            "dateString": localeString,//2017/11/15 上午12:00:00
            "date": localeDateString,//2017-11-15
            "time": localeTimeString //12:00:00
        };
        return Time
    },
    /** 获取url的query值 */
    qs: function (name) {
        let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        if (match) {
            return decodeURIComponent(match[1].replace(/\+/g, ' '));
        }
        return match
    },

    /** 获取cookie值 */
    getCookie: function (name) {
        let re = new RegExp(name + "=([^;]+)");
        let value = re.exec(document.cookie);
        return (value != null) ? unescape(value[1]) : null;
    },
    /** 设置cookie */
    setCookie: function (c_name, value, expiredays) {
        let exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ';path=/;' +
            ((expiredays == null) ? "" : "expires=" + exdate.toGMTString());
    },

    /** 设置session */
    setSession: function (key, value) {
        localStorage.setItem(key, value);
    },

    /** 获取session */
    getSession: function (key) {
        return localStorage.getItem(key);
    },

    /** 计算时间间隔 */
    countTimeGap: function (startTime) {
        startTime = startTime + '';
        let text;
        let stime = startTime * 1000;
        let date = new Date().getTime();
        let gapMin = Math.floor((date - stime) / 1000 / 60);
        if (gapMin <= 0) {
            //防止偶尔出现的js取时间不准确
            gapMin = 1;
        }
        let gapHour = Math.floor((date - stime) / 1000 / 60 / 60);

        if (gapHour <= 24) {
            text = gapHour + '小时前';
            if (gapMin < 60) {
                text = gapMin + '分钟前';
            }
        } else if (gapHour < 24 * 8) {
            gapHour = Math.floor(gapHour / 24);
            text = gapHour + '天前'
        } else if (gapHour >= 24 * 8) {
            let ddd = new Date(startTime * 1000);
            gapHour = (ddd.getMonth() + 1) + '-' + ddd.getDate();
            text = gapHour
        } else {
            //防止意外情况，暂时如此处理
            text = '刚刚'
        }
        return text;
    },

    /** 整理参与的工程商数据 */
    initSupplierList: function (array, loadMore) {
        let that = this;
        let cate = globalData.demand.menuTab;
        //是否是加载更多列表
        let isLoad = false;
        if (loadMore) {
            isLoad = loadMore
        }
        let basePrice = globalData.demand.totalPrice;
        $.each(array, function (i, item) {
            // 如果是加载更多，直接显示 “议价”
            if (isLoad) {
                item.price = '在线议价'
            } else {
                if (i > 3) {
                    item.price = '在线议价'
                }
                //安装订单
                if (cate == 'install') {
                    switch (i) {
                        case 0:
                            item.price = that.budgetForInt(basePrice);
                            break;
                        case 1:
                            item.price = that.budgetForInt(basePrice * 1.1);
                            break;
                        case 2:
                            item.price = that.budgetForInt(basePrice * 1.3);
                            break;
                        case 3:
                            item.price = that.budgetForInt(basePrice * 1.35);
                            break;
                    }

                    //维修
                } else if (cate == 'repair') {
                    // 如果是加载更多，直接显示 “议价”
                    switch (i) {
                        case 0:
                            item.price = '59/次';
                            break;
                        case 1:
                            item.price = '100/天';
                            break;
                        case 2:
                            item.price = '88/次';
                            break;
                        case 3:
                            item.price = '128/天';
                            break;
                    }
                } else if (cate == 'rental') {
                    switch (i) {
                        case 0:
                            item.price = basePrice + '/㎡';
                            break;
                        case 1:
                            item.price = parseInt(basePrice * 1.13) + '/㎡';
                            break;
                        case 2:
                            item.price = parseInt(basePrice * 1.19) + '/㎡';
                            break;
                        case 3:
                            item.price = parseInt(basePrice * 1.35) + '/㎡';
                            break;
                    }
                }
            }
            if (item.com == '') {
                item.com = '个体供应商'
            }
            item.hasLoadDetal = false;
            // 加入im的未读数字段
            item.unread = 0;
            if (item.avatar == '') {
                item.avatar = '/img/supplier.jpg';
            }

            //给工程商添加2~3个标签,通过工程商id的尾号来选择
            let keywords = [
                ["位置近","性价比高承保","承保"],
                ["大量现货","口碑好","专业小间距"],
                ["位置近","大量现货","承保"],
                ["品牌商","性价比高"],
                ["专业","口碑好","联保"],
                ["平台推荐","联保"],
                ["大量现货","性价比高"],
                ["承保","平台推荐","专业小间距"],
                ["位置近","口碑好","品牌商"],
                ["专业小间距","厂家直销"],
            ];
            item.tags = [];
            let id = item.id.toString();
            let idEnd = id.charAt(id.length - 1);
            item.tags = keywords[idEnd];

        });
        return array
    },

    /** 获取当前的项目类型code */
    getCurrCateCode: function () {
        //获取当前项目类型
        let curr_cate = globalData.demand.menuTab;
        let cate_id = 1;
        if (curr_cate == 'repair') {
            cate_id = 2
        }
        if (curr_cate == 'rental') {
            cate_id = 3
        }
        return cate_id
    },
    /**修改url中指定参数的值
     * url 目标url
     * arg 需要替换的参数名称
     * arg_val 替换后的参数的值
     * return url 参数替换后的url
     */
    changeURLArg: function (url, arg, arg_val) {
        var pattern = arg + '=([^&]*)';
        var replaceText = arg + '=' + arg_val;
        if (url.match(pattern)) {
            var tmp = '/(' + arg + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp), replaceText);
            return tmp;
        } else {
            if (url.match('[\?]')) {
                return url + '&' + replaceText;
            } else {
                return url + '?' + replaceText;
            }
        }
        return url + '\n' + arg + '\n' + arg_val;
    },

    /** 整理当前客户的相关信息到群资料中；方便客服那边查看 */
    initClientInfoToIM: function (info) {
        let a = {}, b = {}, c = {};
        if (info.demand) {
            $.each(info.demand, function (key, val) {
                var name, value;
                if (val == '') {
                    return true
                }
                if (key == 'menuTab') {
                    name = '需求类型：';
                    if (val == 'install') {
                        value = '安装'
                    }
                    if (val == 'repair') {
                        value = '维修'
                    }
                    if (val == 'rental') {
                        value = '租赁'
                    }
                }
                else if (key == 'typeName') {
                    name = '屏幕类型：';
                    value = val;
                }
                else if (key == 'colorName') {
                    name = '颜色：';
                    value = val;
                }
                else if (key == 'locationName') {
                    name = '户内外：';
                    value = val;
                }
                else if (key == 'faultName') {
                    name = '故障原因：';
                    value = val;
                }
                else if (key == 'totalTime') {
                    name = '租用天数：';
                    value = val;
                }
                else if (key == 'sHeight') {
                    name = '高度：';
                    value = val;
                }
                else if (key == 'sWidth') {
                    name = '宽度：';
                    value = val;
                }
                else if (key == 'toBottom') {
                    name = '离地高度：';
                    value = val;
                }
                else if (key == 'installMethod') {
                    name = '安装方式：';
                    value = val;
                }
                else if (key == 'currDistance') {
                    name = '观看距离：';
                    value = val;
                } else {
                    return true
                }
                a[name] = value;
            });
        }
        if (info.supplier) {
            $.each(info.supplier, function (key, val) {
                let name, value;
                if (val == '') {
                    return true
                }
                if (key == 'id') {
                    name = '工程商id：';
                    value = val;
                } else if (key == 'nickname') {
                    name = '昵称：';
                    value = val;
                }
                else if (key == 'com') {
                    name = '公司：';
                    value = val;
                } else {
                    return true
                }
                b[name] = value;
            });
        }
        let sem = JSON.parse(info.sem);
        if (sem) {
            $.each(sem, function (key, val) {
                let name, value;
                if (val == '') {
                    return true
                }
                if (key == 'word') {
                    name = '客户搜索词：';
                    value = val;
                } else if (key == 'source') {
                    name = '客户来源：';
                    value = val;
                } else {
                    return true
                }
                c[name] = value;
            });
        }
        return JSON.stringify({ demand: a, supplier: b, sem: c })
    },
    /**预算取整*/
    budgetForInt: function (number) {
        let length = parseInt(number).toString().length;
        if (number < 100) {
            return Math.round(number);
        } else if (number >= 10000000) {
            return 0
        } else {
            return Math.round(number / Math.pow(10, length - 2)) * Math.pow(10, length - 2);
        }
    }
};