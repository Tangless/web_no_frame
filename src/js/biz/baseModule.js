export class baseModule{
    constructor(view){
        this.view = view;
        this.config = {};
        this.watchEvents();

        //记录已经实例化的模块
        this.config.id = this.view.attr('id');
        funs.hasLoadModuleArray[this.config.id] = this;

        // 让模块的构造方法先执行；
        setTimeout( ()=>{
            this.afterInstall && this.afterInstall();
        },1);

    }
    watchEvents(){
        let _this = this;
        let actions = this;
        let view = this.view;
        let callAction = function (action, type, target, hit) {
            let fun = actions["_evt_" + action];
            if (fun) {
                return fun.call(_this, target, hit);
            }
            else {
                return true;
            }
        };
        view.on("click", function (e) {
            let type = e.type;
            let hit = e.target;
            let target = e.target;
            let nodeName = target.nodeName;
            let propagation = true;
            let root = this;
            if (type == "focusin" && nodeName != "INPUT" && nodeName != "TEXTARE") {
                return true;
            }
            if (type == "click" && (nodeName == "FORM" || nodeName == "SELECT" || nodeName == "OPTION" || nodeName == "TEXTARE" || nodeName == "INPUT" || (nodeName == "LABEL" && target.htmlFor))) {
                return true;
            }
            if (type == "change" && (nodeName == "FORM" || nodeName == "TEXTARE" || nodeName == "INPUT")) {
                return true;
            }
            while (target && target != root) {
                let actions_1 = target.getAttribute("evt");
                if (actions_1 && (!target.hasAttribute("disabled") || target.getAttribute("disabled") == 'false')) {
                    propagation = (callAction(actions_1, type, target, hit) ? true : false) && propagation;
                    return propagation;
                }
                if (target.nodeName == "FORM") {
                    return true;
                }
                target = target.parentNode;
            }
            return true;
        });
    }
    find(str){
        return this.view.find(str);
    }
    _evt_goback() {
        let panel = this.config.parent;
        panel.find('.asideModuleContent').css('margin-left', '0');
        setTimeout(function () {
            panel.remove();
        }, 310);
        this.afterUninstall && this.afterUninstall();
    }
}