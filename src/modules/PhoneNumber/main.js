import * as bm from "../js/baseModule.js";

export class Module extends bm.baseModule{
    constructor(view){
        super(view);

        let dom = this.view.find('.phoneNumber_Vue')[0];
        new Vue({
            el: dom,
            data: globalData.current_supplier,
            computed:{
                mobileInit: function () {
                    let mobile = this.mobile;
                    // 将电话号码改为 132-5222-2222的格式
                    let arr = mobile.split('');
                    arr[2] += '-';
                    arr[6] += '-';
                    mobile = arr.join('');
                    return mobile
                }
            }
        });
    }
    afterInstall(){
        let that = this;
        let num = parseInt(that.find('.min').text());
        let a = setInterval(function () {
            if(num>0){
                num--;
            }
            that.find('.min').text(num);
        },1000)
    }
}