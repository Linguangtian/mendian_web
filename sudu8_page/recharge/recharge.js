var app = getApp();

Page({
    data: {
        page_signs: "/sudu8_page/recharge/recharge",
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
        guiz: "",
        a: 1
    },
    onPullDownRefresh: function() {
        this.getinfos(), wx.stopPullDownRefresh();
    },
    onLoad: function(a) {
        wx.setNavigationBarTitle({
            title: "账户充值"
        });
        var e = this, t = 0;
        a.fxsid && (t = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), e.checkvip(), e.getBase(), app.util.getUserInfo(e.getinfos, t);
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link, t = a.currentTarget.dataset.linktype;
        app.util.redirectto(e, t);
    },
    checkvip: function() {
        var e = this, a = wx.getStorageSync("openid");
        wx.request({
            url: app.util.url("entry/wxapp/checkvip", {
                m: "sudu8_page"
            }),
            data: {
                kwd: "recharge",
                openid: a
            },
            success: function(a) {
                console.log(a), a.data.data || (e.setData({
                    needvip: !0
                }), wx.showModal({
                    title: "进入失败",
                    content: "使用本功能需先开通vip!",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.redirectTo({
                            url: "/sudu8_page/register/register"
                        });
                    }
                }));
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                e.setData({
                    openid: a.data
                }), e.getGuiz();
            }
        });
    },
    getBase: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(a) {
                e.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getGuiz: function() {
        var t = this, a = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/Guiz",
            data: {
                openid: a
            },
            success: function(a) {
                var e = a.data.data.list;
                console.log(e), t.setData({
                    guiz: a.data.data,
                    gz: e[0] ? e[0].id : 0,
                    money: e[0] ? e[0].money : 0
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    makePhoneCall: function(a) {
        var e = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    makePhoneCallB: function(a) {
        var e = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    openMap: function(a) {
        var e = this;
        wx.openLocation({
            latitude: parseFloat(e.data.baseinfo.latitude),
            longitude: parseFloat(e.data.baseinfo.longitude),
            name: e.data.baseinfo.name,
            address: e.data.baseinfo.address,
            scale: 22
        });
    },
    setmoney: function(a) {
        var e = a.detail.value;
        this.setData({
            money: e
        });
    },
    setsubmit: function() {
        var e = this, a = e.data.money, t = wx.getStorageSync("openid"), o = !0;
        if (a <= 0) return wx.showModal({
            title: "提醒",
            content: "请输入正确的充值金额！",
            showCancel: !1
        }), o = !1;
        o && app.util.request({
            url: "entry/wxapp/Balance",
            data: {
                openid: t,
                money: a
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                e.setData({
                    order_id: a.data.data.order_id
                }), "success" == a.data.message && wx.requestPayment({
                    timeStamp: a.data.data.timeStamp,
                    nonceStr: a.data.data.nonceStr,
                    package: a.data.data.package,
                    signType: "MD5",
                    paySign: a.data.data.paySign,
                    success: function(a) {
                        wx.showToast({
                            title: "支付成功",
                            icon: "success",
                            duration: 3e3,
                            success: function(a) {
                                e.dosetmoney();
                            }
                        });
                    },
                    fail: function(a) {
                        console.log("fail");
                    },
                    complete: function(a) {
                        console.log("complete");
                    }
                }), "error" == a.data.message && wx.showModal({
                    title: "提醒",
                    content: a.data.data.message,
                    showCancel: !1
                });
            }
        });
    },
    dosetmoney: function() {
        var a = this.data.order_id, e = this.data.money, t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/Pay_cz",
            data: {
                openid: t,
                money: e,
                order_id: a,
                gz: 0 == this.data.a ? 0 : this.data.gz
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                wx.redirectTo({
                    url: "/sudu8_page/usercenter/usercenter"
                });
            }
        });
    },
    choose_cz: function(a) {
        var e = a.currentTarget.dataset.id;
        this.data.gz = a.currentTarget.dataset.gz;
        var t = this.data.guiz;
        if (0 == e) this.setData({
            a: e,
            money: 0
        }); else {
            e--;
            var o = t.list[e].money;
            e++, this.setData({
                a: e,
                money: o
            });
        }
    }
});