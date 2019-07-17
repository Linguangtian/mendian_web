var app = getApp();

Page({
    data: {
        page: 1,
        collectlist: "",
        page_signs: "/sudu8_page/collect/collect",
        morePro: !1,
        baseinfo: []
    },
    onPullDownRefresh: function() {
        this.getCollect();
    },
    onLoad: function(t) {
        var a = this, e = 0;
        t.fxsid && (e = t.fxsid, a.setData({
            fxsid: t.fxsid
        })), a.getCollect(), app.util.getUserInfo(a.getinfos, e);
    },
    redirectto: function(t) {
        var a = t.currentTarget.dataset.link, e = t.currentTarget.dataset.linktype;
        app.util.redirectto(a, e);
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                a.setData({
                    openid: t.data
                });
            }
        });
    },
    getCollect: function() {
        var a = this, t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/BaseMin",
            data: {
                vs1: 1
            },
            success: function(t) {
                t.data.data;
                a.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                });
            }
        }), app.util.request({
            url: "entry/wxapp/getCollect",
            data: {
                openid: t,
                page: 1
            },
            cachetime: "30",
            success: function(t) {
                a.setData({
                    collectlist: t.data.data.list
                }), 10 < t.data.data.num ? a.setData({
                    morePro: !0
                }) : a.setData({
                    morePro: !1
                }), wx.setNavigationBarTitle({
                    title: "我的收藏"
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    showMore: function() {
        var a = this, e = a.data.page + 1, t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/getCollect",
            data: {
                openid: t,
                page: e
            },
            success: function(t) {
                "" != t.data.data.list && a.setData({
                    collectlist: a.data.collectlist.concat(t.data.data.list),
                    page: e
                }), t.data.data.num == e && a.setData({
                    morePro: !1
                });
            }
        });
    }
});