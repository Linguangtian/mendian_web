function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var app = getApp(), QQMapWX = require("../../sudu8_page/resource/js/qqmap.js");

Page({
    data: _defineProperty({
        page_signs: "/sudu8_page/store/store",
        storelist: [],
        baseinfo: [],
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        },
        currentCity: "",
        searchtitle: "",
        title: "",
        city: "",
        storeShow: 0
    }, "storelist", [ 0 ]),
    onPullDownRefresh: function(t) {
        this.getBase(), this.getStoreConf();
    },
    onLoad: function(t) {
        var a = this, e = t.city;
        e && a.setData({
            city: e
        });
        var o = 0;
        t.fxsid && (o = t.fxsid, a.setData({
            fxsid: t.fxsid
        })), a.getBase(), app.util.getUserInfo(a.getinfos, o);
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
                }), a.getStoreConf();
            }
        });
    },
    getBase: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/BaseMin",
            data: {
                vs1: 1
            },
            success: function(t) {
                a.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    getStoreConf: function() {
        var n = this;
        app.util.request({
            url: "entry/wxapp/storeConf",
            success: function(t) {
                if (console.log(t), t.data.data.mapkey) var a = t.data.data.mapkey; else a = "6DYBZ-GN6W3-45I3C-Y2A4Q-YRIAS-YFBP3";
                n.setData({
                    search: t.data.data.search,
                    title: t.data.data.title,
                    storeShow: t.data.data.flag
                }), wx.setNavigationBarTitle({
                    title: n.data.title + "展示"
                });
                var i = new QQMapWX({
                    key: a
                });
                0 == t.data.data.flag ? wx.getLocation({
                    type: "wgs84",
                    success: function(t) {
                        var a = t.latitude, e = t.longitude;
                        i.reverseGeocoder({
                            location: {
                                latitude: a,
                                longitude: e
                            },
                            success: function(t) {
                                n.setData({
                                    currentCity: t.result.address_component.city
                                });
                            }
                        }), n.getListAll(e, a);
                    },
                    fail: function() {
                        n.getListAll();
                    }
                }) : wx.getLocation({
                    type: "wgs84",
                    success: function(t) {
                        var e = t.latitude, o = t.longitude;
                        i.reverseGeocoder({
                            location: {
                                latitude: e,
                                longitude: o
                            },
                            success: function(t) {
                                var a = n.data.city;
                                a ? (n.setData({
                                    currentCity: a
                                }), n.getList(o, e, a)) : (n.setData({
                                    currentCity: t.result.address_component.city
                                }), n.getList(o, e, t.result.address_component.city));
                            }
                        });
                    }
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    getList: function(t, a, e) {
        var o = this;
        app.util.request({
            url: "entry/wxapp/storeNew",
            data: {
                lon: t,
                lat: a,
                currentCity: e
            },
            success: function(t) {
                o.setData({
                    storelist: t.data.data.list,
                    storenum: t.data.data.num[0].num
                }), console.log(o.data.storelist), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    getListAll: function(t, a) {
        var e = this;
        console.log("111"), app.util.request({
            url: "entry/wxapp/store",
            data: {
                lon: t,
                lat: a
            },
            success: function(t) {
                e.setData({
                    storelist: t.data.data.list,
                    storenum: t.data.data.num[0].num
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    dianPhoneCall: function(t) {
        var a = t.currentTarget.dataset.index;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    makePhoneCall: function(t) {
        var a = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    makePhoneCallB: function(t) {
        var a = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    openMap: function(t) {
        wx.openLocation({
            latitude: parseFloat(this.data.baseinfo.latitude),
            longitude: parseFloat(this.data.baseinfo.longitude),
            name: this.data.baseinfo.name,
            address: this.data.baseinfo.address,
            scale: 22
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.title + "展示 -" + this.data.baseinfo.name
        };
    },
    mycoupp: function() {
        wx.redirectTo({
            url: "/sudu8_page/mycoupon/mycoupon"
        });
    },
    serachInput: function(t) {
        this.setData({
            searchtitle: t.detail.value
        });
    },
    search: function() {
        var a = this, t = t, e = e, o = a.data.searchtitle;
        o ? app.util.request({
            url: "entry/wxapp/store",
            data: {
                lon: e,
                lat: t,
                keyword: o
            },
            success: function(t) {
                a.setData({
                    storelist: t.data.data.list,
                    storenum: t.data.data.num[0].num
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(t) {
                console.log(t);
            }
        }) : wx.showModal({
            title: "提醒",
            content: "请输入搜索关键字！",
            showCancel: !1
        });
    },
    gesinco: function() {
        this.setData({
            diplay: res.data.data.flag
        });
        var t = 0;
        1 == res.flag ? t++ : t--;
        for (t = 0; t < res.data.length; t++) res.data[t].cmd;
    }
});