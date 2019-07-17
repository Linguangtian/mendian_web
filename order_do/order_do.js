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
            n = e.dkmoney,
            i = e.dkscore,
            d = e.yunfei,
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
            dkmoney: n,
            dkscore: i,
            yf: d
        }), t.getOrder();
        var c = 0;
        e.fxsid && (c = e.fxsid, t.setData({
            fxsid: e.fxsid
        })), a.util.getUserInfo(t.getinfos, c)
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
            n = e.data.kouk,
            i = a.util.url("entry/wxapp/duoorderget", {
                m: "sudu8_page_plugin_pt"
            });
        wx.request({
            url: i,
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
                    i = t.price;
                1 * o < 1 * i ? (r = (i - o).toFixed(2), n = 1) : (r = i, n = 0), e.setData({
                    comment: a.data.data,
                    kouk: n,
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
            n = t.data.order;
        t.setData({
            formId: e.detail.formId
        }), a.util.request({
            url: "entry/wxapp/weixinpay",
            data: {
                openid: o,
                price: r,
                order_id: n
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
                                t.payover_do(n)
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
            n = t.data.mymoney,
            i = t.data.true_price,
            d = t.data.couponid,
            s = (t.data.order, t.data.shareid),
            c = t.data.dkscore;
        if (t.data.mymoney, t.data.true_price, 0 == r) var u = i;
        1 == r && (u = n), a.util.request({
            url: "entry/wxapp/duoorderchange",
            data: {
                order_id: e,
                openid: o,
                true_price: u,
                dkscore: c,
                couponid: d,
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
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link;
        switch (a.currentTarget.dataset.linktype) {
            case "page":
                wx.navigateTo({
                    url: e
                });
                break;
            case "tel":
                e = e.slice(4), wx.showModal({
                    title: "提示",
                    content: "是否拨打电话:" + e,
                    success: function(a) {
                        1 == a.confirm && wx.makePhoneCall({
                            phoneNumber: e
                        })
                    }
                });
                break;
            case "map":
                e = e.split(","), wx.openLocation({
                    latitude: parseFloat(e[1]),
                    longitude: parseFloat(e[0]),
                    scale: 22
                })
        }
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