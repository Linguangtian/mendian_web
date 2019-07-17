var app = getApp();

Page({
    data: {
        ke_jine: "0.00",
        jine: 0,
        zfb: 0,
        xuanz: 1,
        zfbzh: "",
        zfbxm: "",
        page_signs: "/sudu8_page/fenxiao_tixian/fenxiao_tixian",
        items: [ {
            name: "1",
            value: "余额",
            checked: "true"
        }, {
            name: "2",
            value: "微信"
        }, {
            name: "3",
            value: "支付宝"
        } ]
    },
    onPullDownRefresh: function() {
        this.tigz();
    },
    onLoad: function(a) {
        var n = this;
        wx.setNavigationBarTitle({
            title: "我要提现"
        }), wx.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#fafafa"
        });
        var t = 0;
        a.fxsid && (t = a.fxsid, n.setData({
            fxsid: a.fxsid
        })), app.util.request({
            url: "entry/wxapp/BaseMin",
            data: {
                vs1: 1
            },
            success: function(a) {
                if (a.data.data.video) var t = "show";
                if (a.data.data.c_b_bg) var e = "bg";
                n.setData({
                    baseinfo: a.data.data,
                    show_v: t,
                    c_b_bg1: e
                }), wx.setNavigationBarColor({
                    frontColor: n.data.baseinfo.base_tcolor,
                    backgroundColor: n.data.baseinfo.base_color
                });
            }
        }), app.util.getUserInfo(n.getinfos, t);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.util.redirectto(t, e);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = a.data;
                e.setData({
                    openid: t
                }), e.tigz();
            }
        });
    },
    radioChange: function(a) {
        var t = this, e = a.detail.value;
        3 == e ? t.setData({
            zfb: 1
        }) : t.setData({
            zfb: 0
        }), t.setData({
            xuanz: e
        });
    },
    ti_all: function(a) {
        var t = this.data.ke_jine;
        0 == parseInt(t) ? (wx.showLoading({
            title: "无可提现金额"
        }), setTimeout(function() {
            wx.hideLoading();
        }, 1e3)) : this.setData({
            ti_jine: t,
            jine: t
        });
    },
    jine: function(a) {
        var t = a.detail.value;
        this.setData({
            jine: t
        });
    },
    sub: function() {
        var a = this, t = a.data.jine, e = a.data.ke_jine, n = a.data.zuidmoney, i = a.data.xuanz, o = a.data.zfbzh, s = a.data.zfbxm;
        if (console.log(t), console.log(e), 0 == t) return wx.showModal({
            title: "提醒",
            content: "提现金额不能为空！",
            showCancel: !1
        }), !1;
        if (1 * e < 1 * t) return wx.showModal({
            title: "提醒",
            content: "可提现金额不足！",
            showCancel: !1
        }), !1;
        if (t < n) return wx.showModal({
            title: "提醒",
            content: "提现金额不足最低标准！",
            showCancel: !1
        }), !1;
        if (3 == i) {
            if ("" == o) return wx.showModal({
                title: "提醒",
                content: "支付宝账户必填！",
                showCancel: !1
            }), !1;
            if ("" == s) return wx.showModal({
                title: "提醒",
                content: "支付宝账户姓名必填！",
                showCancel: !1
            }), !1;
        }
        var r = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/fxstixian",
            data: {
                openid: r,
                money: t,
                xuanz: i,
                zfbzh: o,
                zfbxm: s
            },
            success: function(a) {
                wx.showToast({
                    title: "申请成功！",
                    icon: "success",
                    success: function() {
                        wx.redirectTo({
                            url: "/sudu8_page/fenxiao_account/fenxiao_account"
                        });
                    }
                });
            }
        });
    },
    tigz: function() {
        var t = this, a = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/wytixian",
            data: {
                openid: a
            },
            success: function(a) {
                t.setData({
                    myzh: a.data.data.userinfo,
                    ke_jine: a.data.data.userinfo.fx_money,
                    guiz: a.data.data.guiz,
                    zuidmoney: a.data.data.guiz.txmoney
                });
            }
        });
    },
    zfbzh: function(a) {
        var t = a.detail.value;
        this.setData({
            zfbzh: t
        });
    },
    zfbxm: function(a) {
        var t = a.detail.value;
        this.setData({
            zfbxm: t
        });
    }
});