import * as bm from "../js/baseModule.js";
export class Module extends bm.baseModule {
    constructor(view) {
        super(view);
        let that = this;
        let dom = this.view.find('.list')[0];
        this.listVue = new Vue({
            el: dom,
            data: globalData,
            watch: {
                "demand.menuTab": function (a, b) {
                }
            }
        });
    }
}