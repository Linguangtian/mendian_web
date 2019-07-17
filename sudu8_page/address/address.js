var app = getApp();

Page({
    data: {
        title: "收货地址",
        address_is: 1,
        moren: 0,
        choose: 0,
        id: 0,
        region: [ "北京市", "北京市", "东城区" ]
    },
    onPullDownRefresh: function() {
        this.myaddress();
    },
    onLoad: function(e) {
        var s = this, a = e.shareid;
        null != a && s.setData({
            shareid: a
        });
        var t = e.orderid;
        null != t & "undefined" != t && s.setData({
            orderid: t
        });
        var d = e.pid;
        null != d && s.setData({
            pid: d
        }), wx.setNavigationBarTitle({
            title: s.data.title
        }), wx.getSystemInfo({
            success: function(e) {
                var a = e.windowHeight, t = e.windowHeight - 59;
                s.setData({
                    h: t,
                    choose_h: a
                });
            }
        }), app.util.request({
            url: "entry/wxapp/BaseMin",
            data: {
                vs1: 1
            },
            success: function(e) {
                if (e.data.data.video) ;
                if (e.data.data.c_b_bg) ;
                s.setData({
                    baseinfo: e.data.data
                }), wx.setNavigationBarTitle({
                    title: s.data.baseinfo.name
                }), wx.setNavigationBarColor({
                    frontColor: s.data.baseinfo.base_tcolor,
                    backgroundColor: s.data.baseinfo.base_color
                });
            },
            fail: function(e) {
                console.log(e);
            }
        });
        var i = 0;
        e.fxsid && (i = e.fxsid, s.setData({
            fxsid: e.fxsid
        })), app.util.getUserInfo(s.getinfos, i);
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(e) {
                a.setData({
                    openid: e.data
                }), a.myaddress();
            }
        });
    },
    moren_set: function(e) {
        var a = this, t = (a.data.moren, e.currentTarget.dataset.id), s = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/setmoaddress",
            data: {
                openid: s,
                id: t
            },
            success: function(e) {
                a.myaddress();
            }
        });
    },
    choose_close: function() {
        this.setData({
            choose: 0
        });
    },
    add_address: function(e) {
        var a = this, t = e.currentTarget.dataset.id;
        a.setData({
            choose: 1,
            id: t
        });
        var s = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/getaddressinfo",
            data: {
                openid: s,
                id: t
            },
            success: function(e) {
                e.data.data && a.setData({
                    addressinfo: e.data.data,
                    region: e.data.data.region
                });
            }
        });
    },
    myaddress: function() {
        var a = this, e = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/getmyaddress",
            data: {
                openid: e
            },
            success: function(e) {
                console.log(e.data), a.setData({
                    myaddress: e.data.data
                });
            }
        });
    },
    wx_address: function() {
        var r = this, o = wx.getStorageSync("openid");
        wx.chooseAddress({
            success: function(e) {
                var a = e.provinceName + " " + e.cityName + " " + e.countyName, t = e.detailInfo, s = e.userName, d = e.telNumber, i = e.postalCode;
                app.util.request({
                    url: "entry/wxapp/setmyaddress",
                    data: {
                        openid: o,
                        name: s,
                        mobile: d,
                        address: a,
                        more_address: t,
                        postalcode: i,
                        froms: "weixin"
                    },
                    success: function(e) {
                        r.myaddress();
                    }
                });
            }
        });
    },
    bindRegionChange: function(e) {
        this.setData({
            region: e.detail.value
        });
    },
    formSubmit: function(e) {
        var a = this, t = a.data.id, s = e.detail.value, d = a.data.region, i = s.realname, r = s.mobile, o = s.postalcode, n = d[0] + " " + d[1] + " " + d[2], c = s.more_address, u = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/setmyaddress",
            data: {
                id: t,
                openid: u,
                name: i,
                mobile: r,
                address: n,
                more_address: c,
                postalcode: o,
                froms: "selfadd"
            },
            success: function(e) {
                wx.showToast({
                    title: "更新/新建成功",
                    icon: "success",
                    duration: 2e3
                }), a.setData({
                    id: 0
                }), a.choose_close(), a.myaddress();
            }
        });
    },
    deladdress: function(e) {
        var a = this, t = e.currentTarget.dataset.id;
        app.util.request({
            url: "entry/wxapp/delmyaddress",
            data: {
                id: t
            },
            success: function(e) {
                wx.showToast({
                    title: "删除成功",
                    icon: "success",
                    duration: 2e3
                }), a.myaddress();
            }
        });
    },
    redirectto: function(e) {
        var a = e.currentTarget.dataset.link, t = e.currentTarget.dataset.linktype;
        app.util.redirectto(a, t);
    },
    xuanzaddress: function(e) {
        var a = e.currentTarget.dataset.id, t = getCurrentPages(), s = t[t.length - 2].route;
        wx.redirectTo({
            url: "/" + s + "?addressid=" + a + "&shareid=" + this.data.shareid + "&id=" + this.data.pid + "&orderid=" + this.data.orderid
        });
    }
});