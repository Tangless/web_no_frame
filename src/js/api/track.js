let track = {
    call: function () {
        // 统计一次400转化
        if (!this.hasCall) {
            if (globalData.demand.menuTab == 'rental') {
                this._track('Rental_400.html');
            } else if (globalData.demand.menuTab == 'repair') {
                this._track('Repair_400.html');
            } else {
                this._track('Setup_400.html');
            }
            this.hasCall = true;
        }
    },
    chat: function () {
        // 统计一次聊天转化
        if (!this.hasConsult) {
            if (globalData.demand.menuTab == 'rental') {
                this._track('Rental_consult.html');
            } else if (globalData.demand.menuTab == 'repair') {
                this._track('Repair_consult.html');
            } else {
                this._track('Setup_consult.html');
            }
            this.hasConsult = true;
        }
    },
    submit: function () {
        // 统计一次提交转化
        if (globalData.demand.menuTab == 'rental') {
            this._track('Rental_submit.html');
        } else if (globalData.demand.menuTab == 'repair') {
            this._track('Repair_submit.html');
        } else {
            this._track('Setup_submit.html');
        }
    },
    _track: function (page) {
        let dest = '/track/' + page;
        console.log('track: ' + dest);
        $('#TrackFrame').attr('src', dest);
    },
    hasConsult: false,  //判断是否已经统计过该事件，统计过则不再重复统计
    hasCall: false,    //判断是否已经统计过该事件，统计过则不再重复统计
};