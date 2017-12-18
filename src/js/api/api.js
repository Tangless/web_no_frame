/**
 * ========== API请求 ==========
 * 书写规则说明:
 * 1，封装了两个基础的ajax方法；主要是因为原有接口和新接口的数据传递格式有变化；要根据不同接口情况使用不同的方法：
 *    ajax_post: application/x-www-form-urlencoded，
 *    ajax_post_json: application/json
 *
 * 2，参数格式: {arg1:val1, arg2: val2，arg3: val3 ……}
 *    在保持api请求参数只占一个参数位的原则下，尽量简洁而方便的调用api；
 *    因此，如果接口只需要一个参数，则api方法应该书写为只需要传入对应val值即可（参考 api.clientConsult）
 *    其他一个以上的参数，则保持对象格式传入；
 *
 * */


let api = {
    /** 获取用户信息 */
    getUserInfo: function(cb) {
        ajax_post("/User/getUserInfo", null, {
            succ:function (json) {
                cb && cb.succ && cb.succ(json.user);
            },
            fail:function (data) {
                cb && cb.fail && cb.fail(data);
            }
        })
    },

    /** 加盟工程商 */
    new_joinSupplier: function(data, cb) {
        ajax_post("/Supplier/Supplier/join", data, cb);
    },

    /** 获取ip定位省市 */
    new_ipLocation: function(cb) {
        ajax_post("/Ip/getIpInfo", null, {
            succ:function (json) {
                cb && cb.succ && cb.succ(json.ip_info);
            },
            fail:function (data) {
                cb && cb.fail && cb.fail(data);
            }
        });
    },

    /** 获取指定城市的认证工程商数量 */
    getCertifySupplierCntByCity: function(city_id,cb) {
        ajax_post_json("/Client/getCertifySupplierCntByCity", {"city_id":city_id}, cb);
    },

    /** 获取指定城市的认证工程商列表
     *  args:  全部int类型
     *  |--cate: 类型；---|-- 1:安装；2:维修；3:租赁 --|
     *  |--city_id:   ---|
     *  |--current_page:  上一页最后一个bid_count值  ---|
     * */
    getSupplierList: function(data,cb) {
        ajax_post_json("/Client/getSupplierList", data, {
            succ:function (json) {
                globalData.current_page = json.current_page;
                cb && cb.succ && cb.succ(json.user_list);
            },
            fail:function (data) {
                cb && cb.fail && cb.fail(data);
            }
        });
    },
    /** 工程商的咨询人数值+1 */
    clientConsult: function(supplierId, cb) {
        ajax_post_json("/Client/consult", {"supplier_id":supplierId}, cb);
    },

    /** 工程商成交记录
     *  args:
     *  |--partic_id:   ---|
     *  |--supplier_id:   ---|
     * */
    getSupplierParticList: function(data,cb) {
        ajax_post_json("/Client/getSupplierParticList", data, {
            succ:function (json) {
                cb && cb.succ && cb.succ(json.partic_list);
            },
            fail:function (data) {
                cb && cb.fail && cb.fail(data);
            }
        });
    },

    /** 获取工程商资料详细 */
    getSupplierInfo: function(sid,cb) {
        let data= {
            "city_id": globalData.selPos.city_id,
            "supplier_id": sid
        };
        ajax_post_json("/Client/getSupplierInfo", data, {
            succ:function (json) {
                if(json.supplier_info.avatar==''){
                    json.supplier_info.avatar = '/img/supplier.jpg';
                }
                if(json.supplier_info.com==''){
                    json.supplier_info.com = '个体供应商';
                }
                cb && cb.succ && cb.succ(json.supplier_info);
            },
            fail:function (data) {
                cb && cb.fail && cb.fail(data);
            }
        });
    },

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
    countPrices: function(data,cb) {
        ajax_post_json("/Client/compute/prices", data, cb);
    },

    /** 报修草稿 
     *  args:
     *  |--mobile:   ---|
     *  |--cate:   ---|
     *  |--prov:   ---|
     *  |--city:   ---|
     *  |--sem:   ---|
    */
    postDraft: function(data, cb) {
        ajax_post("/Client/Demand/postDraft", data, cb);
    },

};

/** ajax请求方法 */
function ajax_post(url, data, cb) {
    let URL = APIURL + url;
    $.ajax(URL, $.extend({
        method: 'POST',
        data: data,
        dataType: "json",
        timeout: 30000,
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Accept': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function(json, status, xhr) {
            cb && cb.always && cb.always(json);
            if (json.status == "200") {
                cb && cb.succ && cb.succ(json);
            } else {
                cb && cb.fail && cb.fail(json);
            }
        },
        error: function(xhr, status, thrown) {
            console.log("[!err!](" + url + "): status: " + xhr.status + ", msg: " + thrown);
            cb && cb.fail && cb.fail();
            console.error("接口["+url+"]：失败") ;
        }
    }));
}
/** ajax请求方法 (application/json)*/
function ajax_post_json(url, data, cb) {
    let URL = APIURL + url;
    $.ajax(URL, $.extend({
        method: 'POST',
        data: JSON.stringify(data),
        dataType: "json",
        timeout: 30000,
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        contentType: 'application/json',
        success: function(json, status, xhr) {
            cb && cb.always && cb.always(json);
            if (json.status == "200") {
                cb && cb.succ && cb.succ(json);
            } else {
                cb && cb.fail && cb.fail(json);
            }
        },
        error: function(xhr, status, thrown) {
            console.log("[!err!](" + url + "): status: " + xhr.status + ", msg: " + thrown);
            cb && cb.fail && cb.fail();
            console.error("接口["+url+"]：失败") ;
        }
    }));
}