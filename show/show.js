/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:10*/
var t = require("../../sudu8_page/resource/wxParse/wxParse.js"),
    a = getApp();
Page({
    data: {
        id: "",
        sc: 0,
        bg: "",
        minHeight: 220,
        datas: "",
        content: "",
        jhsl: 1,
        dprice: "",
        yhje: 0,
        hjjg: "",
        sfje: "",
        order: "",
        my_num: "",
        xg_num: "",
        shengyu: "",
        userInfo: "",
        num: [],
        xz_num: [],
        proinfo: "",
        heighthave: 0
    },
    onPullDownRefresh: function() {
        this.getinfos()
    },
    onLoad: function(t) {
        var e = this,
            o = t.id;
        e.setData({
            id: o
        });
        var n = 0;
        t.fxsid && (n = t.fxsid, e.setData({
            fxsid: t.fxsid
        }));
        var i = a.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: i,
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
        }), a.util.getUserInfo(e.getinfos, n)
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                });
                var e = t.data.id;
                t.getShowPic(e)
            }
        })
    },
    getShowPic: function(e) {
        var o = this;
        wx.getStorageSync("openid"), a.util.request({
            url: "entry/wxapp/scoreinfo",
            data: {
                id: e
            },
            success: function(a) {
                console.log(a.data.data), o.setData({
                    datas: a.data.data,
                    content: t.wxParse("content", "html", a.data.data.product_txt, o, 5)
                }), wx.setNavigationBarTitle({
                    title: a.data.data.title
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh()
            }
        })
    },
    save: function(t) {
        this.data.jhsl;
        var e = wx.getStorageSync("openid"),
            o = this.data.id;
        wx.showModal({
            title: "提示",
            content: "确定兑换此商品吗？",
            success: function(n) {
                n.confirm ? (console.log("用户点击确定"), a.util.request({
                    url: "entry/wxapp/Scoreorder",
                    data: {
                        openid: e,
                        id: o,
                        formId: t.detail.formId
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(t) {
                        var a = t.data.data;
                        0 == a.flag ? wx.showModal({
                            title: "提醒",
                            content: a.msg,
                            showCancel: !1
                        }) : wx.showToast({
                            title: "兑换成功",
                            icon: "success",
                            duration: 1e3,
                            success: function() {
                                setTimeout(function() {
                                    wx.redirectTo({
                                        url: "/sudu8_page_plugin_exchange/order/order"
                                    })
                                }, 1e3)
                            }
                        })
                    }
                })) : n.cancel && console.log("用户点击取消")
            }
        })
    },
    tabChange: function(t) {
        var a = t.currentTarget.dataset.id;
        this.setData({
            nowcon: a
        })
    },
    swiperLoad: function(t) {
        var a = this;
        wx.getSystemInfo({
            success: function(e) {
                var o = t.detail.width / t.detail.height,
                    n = e.windowWidth / o;
                a.data.heighthave || a.setData({
                    minHeight: n,
                    heighthave: 1
                })
            }
        })
    },
    onShareAppMessage: function() {
        return {
            title: this.data.title
        }
    }
});