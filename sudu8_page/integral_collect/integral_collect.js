var app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        var o = this;
        wx.setNavigationBarTitle({
            title: "获取积分"
        }), o.getBase(), app.util.request({
            url: "entry/wxapp/scoreget",
            success: function(a) {
                console.log(a), o.setData({
                    guiz: a.data.data.guiz
                });
            }
        });
    },
    getBase: function() {
        var o = this;
        app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(a) {
                o.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: o.data.baseinfo.base_tcolor,
                    backgroundColor: o.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});