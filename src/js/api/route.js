/** =====路由规则===== */

function Router() {
    this.routes = {};
    this.currentUrl = '';
}
//单层路由注册
Router.prototype.route = function(path, callback) {
    path = path.replace(/\s*/g,"");//过滤空格
    if(callback && Object.prototype.toString.call(callback) === '[object Function]' ){
        this.routes[path] = callback;
    }

};
Router.prototype.refresh = function() {
    this.currentUrl = funs.getUrlParams();

    if(this.routes[this.currentUrl.path]){
        this.routes[this.currentUrl.path]();
    }else{
        //不存在的地址重定向到首页
        location.hash = 'install';
        this.routes['install']();
    }

};

Router.prototype.init = function() {
    window.addEventListener('load', ()=>{
        this.refresh();
        globalData.domReady = true;
        $(window).trigger('routeReady');
    }, false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
};
funs.getUrlParams = function () {
    let hashDeatail = location.hash.split("?"),
        hashName = hashDeatail[0].split("#")[1],//路由地址
        params = hashDeatail[1] ? hashDeatail[1].split("&") : [],//参数内容
        query = {};
    for(let i = 0;i<params.length ; i++){
        let item = params[i].split("=");
        query[item[0]] = item[1]
    }
    return 	{
        path:hashName,
        query:query
    }
};

window.Router = new Router();
window.Router.init();

/** 路由录入 */
Router.route('install', function() {
    globalData.demand.menuTab = 'install';
    funs.getModuleFuns('modules/SupplierList.js', function (mod) {
        mod.changeDemandType();
    });
});
Router.route('repair', function() {
    globalData.demand.menuTab = 'repair';
    funs.getModuleFuns('modules/SupplierList.js', function (mod) {
        mod.changeDemandType();
    });
});
Router.route('rental', function() {
    globalData.demand.menuTab = 'rental';
    funs.getModuleFuns('modules/SupplierList.js', function (mod) {
        mod.changeDemandType();
    });
});