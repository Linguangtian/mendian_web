var app = getApp();

Page({
    data: {},
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(t) {
        var e = this;
        console.log(decodeURIComponent(t.url)), e.setData({
            url: decodeURIComponent(t.url)
        });
        var a = 0;
        t.fxsid && (a = t.fxsid, e.setData({
            fxsid: t.fxsid
        })), e.getIndex(), app.util.getUserInfo(e.getinfos, a);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                e.setData({
                    openid: t.data
                });
            }
        });
    },
    getIndex: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(t) {
                e.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    onShareAppMessage: function() {
        return {};
    }
});