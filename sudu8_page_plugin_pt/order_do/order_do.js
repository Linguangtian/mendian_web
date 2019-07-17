/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:15*/
var a = getApp();
Page({
    data: {
        order: "",
        comment: "",
        dikou_jf: 0,
        dikou_jf_val: 0,
        true_price: 0,
        kouk: 0
    },
    onPullDownRefresh: function() {
        this.getinfos()
    },
    onLoad: function(e) {
        var t = this,
            o = e.shareid;
        t.setData({
            shareid: o
        }), wx.setNavigationBarTitle({
            title: "支付订单"
        });
        var r = e.orderid,
            d = e.dkmoney,
            n = e.dkscore,
            i = e.yunfei,
            s = a.util.url("entry/wxapp/BaseMin", {
                m: "sudu8_page"
            });
        wx.request({
            url: s,
            data: {
                vs1: 1
            },
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                })
            },
            fail: function(a) {
                console.log(a)
            }
        }), t.setData({
            order: r,
            dkmoney: d,
            dkscore: n,
            yf: i
        }), t.getOrder();
        var c = 0;
        e.fxsid && (c = e.fxsid, t.setData({
            fxsid: e.fxsid
        })), a.util.getUserInfo(t.getinfos, c)
    },
    redirectto: function(e) {
        var t = e.currentTarget.dataset.link,
            o = e.currentTarget.dataset.linktype;
        a.util.redirectto(t, o)
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(e) {
                a.setData({
                    openid: e.data
                })
            }
        })
    },
    getOrder: function() {
        var e = this,
            t = e.data.order,
            o = wx.getStorageSync("openid"),
            r = e.data.true_price,
            d = e.data.kouk,
            n = a.util.url("entry/wxapp/duoorderget", {
                m: "sudu8_page_plugin_pt"
            });
        wx.request({
            url: n,
            data: {
                order: t,
                openid: o
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var t = a.data.data;
                console.log("返回的结果"), console.log(t);
                var o = t.mymoney,
                    n = t.price;
                1 * o < 1 * n ? (r = (n - o).toFixed(2), d = 1) : (r = n, d = 0), e.setData({
                    comment: a.data.data,
                    kouk: d,
                    true_price: r,
                    mymoney: o,
                    couponid: t.coupon
                })
            }
        })
    },
    goback: function() {
        wx.navigateBack()
    },
    pay1: function(a) {
        var e = this,
            t = e.data.order;
        e.setData({
            formId: a.detail.formId
        }), e.payover_do(t)
    },
    pay3: function(e) {
        var t = this,
            o = wx.getStorageSync("openid"),
            r = t.data.true_price,
            d = t.data.order;
        t.setData({
            formId: e.detail.formId
        }), a.util.request({
            url: "entry/wxapp/weixinpay",
            data: {
                openid: o,
                price: r,
                order_id: d
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                "success" == a.data.message && wx.requestPayment({
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
                                t.payover_do(d)
                            }
                        })
                    },
                    fail: function(a) {
                        console.log("fail")
                    },
                    complete: function(a) {
                        console.log("complete")
                    }
                }), "error" == a.data.message && wx.showModal({
                    title: "提醒",
                    content: a.data.data.message,
                    showCancel: !1
                })
            }
        })
    },
    payover_do: function(e) {
        var t = this,
            o = (t.data.comment, wx.getStorageSync("openid")),
            r = t.data.kouk,
            d = t.data.mymoney,
            n = t.data.true_price,
            i = t.data.couponid,
            s = (t.data.order, t.data.shareid),
            c = t.data.dkscore;
        if (t.data.mymoney, t.data.true_price, 0 == r) var u = n;
        1 == r && (u = d), a.util.request({
            url: "entry/wxapp/duoorderchange",
            data: {
                order_id: e,
                openid: o,
                true_price: u,
                dkscore: c,
                couponid: i,
                shareid: s,
                formid: t.data.formId
            },
            success: function(a) {
                t.sendMail_order(e), 0 == a.data.data ? wx.redirectTo({
                    url: "/sudu8_page_plugin_pt/orderlist/orderlist"
                }) : wx.redirectTo({
                    url: "/sudu8_page_plugin_pt/pt/pt?shareid=" + a.data.data
                })
            }
        })
    },
    sendMail_order: function(e) {
        var t = a.util.url("entry/wxapp/sendMail_order", {
            m: "sudu8_page_plugin_pt"
        });
        a.util.request({
            url: t,
            data: {
                order_id: e
            },
            success: function(a) {
                console.log(a)
            },
            fail: function(a) {
                console.log("sendMail_order_fail")
            }
        })
    },
    onShareAppMessage: function() {
        return {
            title: "支付订单"
        }
    }
});