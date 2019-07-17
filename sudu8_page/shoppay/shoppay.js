var app = getApp();

Page({
    data: {
        page_signs: "/sudu8_page/shoppay/shoppay",
        baseinfo: [],
        userInfo: "",
        searchtitle: "",
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        },
        scopes: !1,
        money: 0,
        yue: 0,
        guiz: "",
        weixpay: 0,
        paymoney: 0,
        jifen_u: 0,
        jfscore: 0,
        jfmoney: 0,
        jqdjg: "请选择",
        yhq_hidden: 0,
        yhqmoney: 0,
        yhq_id: 0
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(e) {
        wx.setNavigationBarTitle({
            title: "店内支付"
        });
        var a = this, t = 0;
        e.fxsid && (t = e.fxsid, a.setData({
            fxsid: e.fxsid
        })), wx.getSystemInfo({
            success: function(e) {
                a.setData({
                    h: e.windowHeight
                });
            }
        }), a.getBase(), app.util.getUserInfo(a.getinfos, t);
    },
    redirectto: function(e) {
        var a = e.currentTarget.dataset.link, t = e.currentTarget.dataset.linktype;
        app.util.redirectto(a, t);
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(e) {
                a.setData({
                    openid: e.data
                }), a.getGuiz();
            }
        });
    },
    getBase: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/base",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(e) {
                a.setData({
                    baseinfo: e.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                });
            },
            fail: function(e) {
                console.log(e);
            }
        });
    },
    getGuiz: function() {
        var a = this, e = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/Guiz",
            data: {
                openid: e
            },
            success: function(e) {
                a.setData({
                    scroeconf: e.data.data.conf,
                    yhq: e.data.data.coupon,
                    guiz: e.data.data,
                    yue: e.data.data.user.money,
                    score: e.data.data.user.score,
                    score_shoppay: e.data.data.conf.score_shoppay
                });
            },
            fail: function(e) {
                console.log(e);
            }
        });
    },
    makePhoneCall: function(e) {
        var a = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    makePhoneCallB: function(e) {
        var a = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    openMap: function(e) {
        var a = this;
        wx.openLocation({
            latitude: parseFloat(a.data.baseinfo.latitude),
            longitude: parseFloat(a.data.baseinfo.longitude),
            name: a.data.baseinfo.name,
            address: a.data.baseinfo.address,
            scale: 22
        });
    },
    chongz: function() {
        wx.navigateTo({
            url: "/sudu8_page/recharge/recharge"
        });
    },
    switchChange: function(e) {
        var a = this, t = e.detail.value, o = (1e3 * a.data.paymoney - 1e3 * a.data.yhqmoney) / 1e3;
        if (1 == t) {
            a.data.money;
            var n = a.data.weixpay, i = a.data.yue, s = a.data.score_shoppay, d = a.data.score, r = a.data.scroeconf;
            if (s >= r.scroe && d >= r.scroe) {
                if (s <= d) var c = parseInt(s / r.scroe * 1); else c = parseInt(d / r.scroe * 1);
                if (o <= c) a.setData({
                    weixpay: 0,
                    money: 0,
                    jfmoney: o,
                    jfscore: o * r.scroe,
                    jifen_u: 1
                }); else {
                    var u = c * r.scroe;
                    n = (n = (1e3 * o - 1e3 * i - 1e3 * c) / 1e3) < 0 ? 0 : n, a.setData({
                        money: (1e3 * o - 1e3 * n - 1e3 * c) / 1e3,
                        weixpay: n,
                        jfmoney: c,
                        jfscore: u,
                        jifen_u: 1
                    });
                }
            } else {
                n = (n = (1e3 * o - 1e3 * i) / 1e3) < 0 ? 0 : n, a.setData({
                    money: (1e3 * o - 1e3 * n) / 1e3,
                    weixpay: n,
                    jfmoney: 0,
                    jfscore: 0,
                    jifen_u: 1
                });
            }
        } else {
            n = (n = (1e3 * o - 1e3 * (i = a.data.yue)) / 1e3) < 0 ? 0 : n, a.setData({
                money: (1e3 * o - 1e3 * n) / 1e3,
                weixpay: n,
                jfscore: 0,
                jfmoney: 0,
                jifen_u: 0
            });
        }
    },
    setsubmit: function() {
        var a = this, e = wx.getStorageSync("openid"), t = a.data.paymoney, o = a.data.weixpay, n = a.data.money, i = a.data.jfscore, s = (a.data.yhqmoney, 
        a.data.yhq_id), d = a.data.jfmoney;
        if (!t && 0 == d || t <= 0 && 0 == d) return wx.showModal({
            title: "提醒",
            content: "请输入正确的消费金额！",
            showCancel: !1
        }), !1;
        0 == o ? app.util.request({
            url: "entry/wxapp/Shoppay_duo",
            data: {
                openid: e,
                ordermoeny: t,
                yuemoney: t,
                money: 0,
                order_id: "",
                jfscore: i,
                yhq_id: s
            },
            header: {
                "content-type": "application/json"
            },
            success: function(e) {
                wx.showToast({
                    title: "支付成功",
                    icon: "success",
                    duration: 3e3,
                    success: function() {
                        setTimeout(function() {
                            wx.redirectTo({
                                url: "/sudu8_page/shoppay/shoppay"
                            });
                        }, 3e3);
                    }
                });
            }
        }) : app.util.request({
            url: "entry/wxapp/Balance",
            data: {
                openid: e,
                ordermoeny: t,
                yuemoney: n,
                money: o
            },
            header: {
                "content-type": "application/json"
            },
            success: function(e) {
                a.setData({
                    order_id: e.data.data.order_id
                }), "success" == e.data.message && wx.requestPayment({
                    timeStamp: e.data.data.timeStamp,
                    nonceStr: e.data.data.nonceStr,
                    package: e.data.data.package,
                    signType: "MD5",
                    paySign: e.data.data.paySign,
                    success: function(e) {
                        wx.showToast({
                            title: "支付成功",
                            icon: "success",
                            duration: 3e3,
                            success: function(e) {
                                a.dosetmoney(a.data.order_id, n, o);
                            }
                        });
                    },
                    fail: function(e) {
                        console.log("fail");
                    },
                    complete: function(e) {
                        console.log("complete");
                    }
                }), "error" == e.data.message && wx.showModal({
                    title: "提醒",
                    content: e.data.data.message,
                    showCancel: !1
                });
            }
        });
    },
    dosetmoney: function(e, a, t) {
        var o = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/dosetmoney",
            data: {
                openid: o,
                orderid: 1001,
                yemoney: a,
                wxmoney: t
            },
            header: {
                "content-type": "application/json"
            },
            success: function(e) {}
        });
    },
    setmoney: function(e) {
        var a = e.detail.value, t = e.detail.value;
        if ("" == a) return this.setData({
            money: 0,
            weixpay: 0,
            jfmoney: 0,
            jfscore: 0,
            paymoney: 0,
            jifen_u: 0,
            yhq_id: 0,
            yhqmoney: 0,
            yhqid: 0,
            jqdjg: "请选择"
        }), !1;
        var o = this.data.yue, n = this.data.jfmoney, i = (1e3 * a - 1e3 * o - 1e3 * n) / 1e3;
        i = i < 0 ? 0 : i, this.setData({
            money: (1e3 * a - 1e3 * i - 1e3 * n) / 1e3,
            weixpay: i,
            paymoney: t
        });
    },
    getmoney: function(e) {
        var a = this, t = a.data.paymoney, o = a.data.jfmoney, n = (e.currentTarget.id, 
        e.currentTarget.dataset.index), i = (1e3 * t - 1e3 * o) / 1e3, s = n.pay_money, d = n.ids;
        if (i < s) return wx.showModal({
            title: "提示",
            content: "价格未满" + s + "元，不可使用该优惠券！",
            showCancel: !1
        }), !1;
        var r = n.price, c = (1e3 * i - 1e3 * a.data.yue - 1e3 * r) / 1e3;
        c = c < 0 ? 0 : c, a.hideModal(), a.setData({
            money: (1e3 * i - 1e3 * c - 1e3 * r) / 1e3,
            weixpay: c,
            yhq_id: d,
            yhqmoney: r,
            jqdjg: n.title
        });
    },
    qxyh: function() {
        var e = this, a = (1e3 * e.data.paymoney - 1e3 * e.data.jfmoney) / 1e3, t = (1e3 * a - 1e3 * e.data.yue) / 1e3;
        t = t < 0 ? 0 : t, e.hideModal(), e.setData({
            money: (1e3 * a - 1e3 * t) / 1e3,
            weixpay: t,
            yhq_id: 0,
            yhqmoney: 0,
            jqdjg: "请选择"
        });
    },
    showModal: function() {
        if (0 == this.data.paymoney) return wx.showModal({
            title: "提醒",
            content: "请先输入消费金额"
        }), !1;
        var e = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        (this.animation = e).translateY(300).step(), this.setData({
            animationData: e.export(),
            showModalStatus: !0
        }), setTimeout(function() {
            e.translateY(0).step(), this.setData({
                animationData: e.export()
            });
        }.bind(this), 200);
    },
    hideModal: function() {
        var e = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        (this.animation = e).translateY(300).step(), this.setData({
            animationData: e.export()
        }), setTimeout(function() {
            e.translateY(0).step(), this.setData({
                animationData: e.export(),
                showModalStatus: !1
            });
        }.bind(this), 200);
    }
});