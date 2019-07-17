/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:24*/
var t = getApp();
Page({
    data: {
        minHeight: 220,
        bg: "",
        userinfo: "",
        hasEmptyGrid: !1,
        showPicker: !1,
        paixu: ""
    },
    onPullDownRefresh: function() {
        this.data.id, this.getsign()
    },
    onLoad: function(a) {
        var e = this;
        e.getsign(), wx.setNavigationBarTitle({
            title: "最新签到"
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, e.setData({
            fxsid: a.fxsid
        }));
        var s = t.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: s,
            data: {
                vs1: 1
            },
            success: function(t) {
                t.data.data, e.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                })
            }
        }), t.util.getUserInfo(e.getinfos, i)
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                })
            }
        })
    },
    getsign: function() {
        var a = this,
            e = wx.getStorageSync("openid");
        t.util.request({
            url: "entry/wxapp/paihb",
            data: {
                openid: e
            },
            success: function(t) {
                var e = t.data.data;
                console.log(e), a.setData({
                    paixu: e
                })
            }
        })
    },
    onShareAppMessage: function() {
        return {
            title: "最新签到"
        }
    }
});