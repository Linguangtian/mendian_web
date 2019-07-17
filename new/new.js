/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:24*/
var t = getApp();
Page({
    data: {
        page: 1,
        collectlist: "",
        baseinfo: [],
        arr: ""
    },
    onPullDownRefresh: function() {
        this.getCollect()
    },
    onLoad: function(a) {
        var e = this;
        e.getCollect(), wx.setNavigationBarTitle({
            title: "签到排行榜"
        });
        var o = 0;
        a.fxsid && (o = a.fxsid, e.setData({
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
        }), t.util.getUserInfo(this.getinfos, o)
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
    getCollect: function() {
        var a = this,
            e = wx.getStorageSync("openid");
        t.util.request({
            url: "entry/wxapp/Zxqd",
            data: {
                openid: e
            },
            success: function(t) {
                console.log(t.data.data), a.setData({
                    arr: t.data.data
                })
            }
        })
    },
    onShareAppMessage: function() {
        return {
            title: "签到排行榜"
        }
    }
});