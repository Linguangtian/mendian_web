var app = getApp();

Page({
    data: {
        order: "",
        comment: "",
        true_price: "",
        my_money: "",
        true_money: 0,
        dikou_jf: 0,
        dikou_jf_val: 0
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "支付订单"
        });
        var t = a.order;
        e.setData({
            order: t
        });
        var o = 0;
        a.fxsid && (o = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), e.showbase(), app.util.getUserInfo(e.getinfos, o);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                e.setData({
                    openid: a.data
                }), e.getOrder();
            }
        });
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link, t = a.currentTarget.dataset.linktype;
        app.util.redirectto(e, t);
    },
    showbase: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(a) {
                a.data.data;
                e.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            }
        });
    },
    getOrder: function() {
        var o = this, a = o.data.order, d = o.data.my_money, r = o.data.true_money;
        app.util.request({
            url: "entry/wxapp/Orderinfo",
            data: {
                order: a
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                a.data.data.jf_money;
                var e = a.data.data.dikou_jf;
                if (1 == a.data.data.is_score) var t = 1e3 * a.data.data.true_price - 1e3 * e; else t = 1e3 * a.data.data.true_price;
                d = 1e3 * a.data.data.my_money, r = t <= d ? 0 : t - d, o.setData({
                    showPay: 1,
                    comment: a.data.data,
                    true_price: t / 1e3,
                    my_money: d / 1e3,
                    true_money: r / 1e3,
                    dikou_jf: a.data.data.dikou_jf,
                    dikou_jf_val: a.data.data.dikou_jf,
                    cid: a.data.data.pid,
                    orderid: a.data.data.id,
                    is_more: a.data.data.is_more
                });
            }
        });
    },
    goback: function() {
        wx.navigateBack();
    },
    sendMail_form: function() {
        var a = this;
        console.log(a.data.cid), app.util.request({
            url: "entry/wxapp/sendMail_form2",
            data: {
                orderid: a.data.orderid,
                cid: a.data.cid
            },
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log("sendMail_order_fail");
            }
        });
    },
    sendMail_order: function(a) {
        app.util.request({
            url: "entry/wxapp/sendMail_order",
            data: {
                order_id: a
            },
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log("sendMail_order_fail");
            }
        });
    },
    pay0: function(a) {
        var e = this;
        e.setData({
            formId: a.detail.formId
        });
        var t = e.data.comment.order_id;
        app.util.request({
            url: "entry/wxapp/checktable",
            data: {
                order_id: t
            },
            success: function(a) {
                a.data.data ? (e.payover_do(t), e.sendMail_order(t), "0" != e.data.is_more && e.sendMail_form()) : wx.showModal({
                    title: "抱歉",
                    content: "您选择的商品已售出，请重新选购",
                    showCancel: !1,
                    success: function(a) {
                        wx.navigateBack({
                            delta: 2
                        });
                    }
                });
            }
        });
    },
    pay1: function(a) {
        var e = this;
        e.setData({
            formId: a.detail.formId
        });
        var t = e.data.comment.order_id;
        app.util.request({
            url: "entry/wxapp/checktable",
            data: {
                order_id: t
            },
            success: function(a) {
                a.data.data ? (e.payover_do(t), e.sendMail_order(t), "0" != e.data.is_more && e.sendMail_form()) : wx.showModal({
                    title: "抱歉",
                    content: "您选择的商品已售出，请重新选购",
                    showCancel: !1,
                    success: function(a) {
                        wx.navigateBack({
                            delta: 2
                        });
                    }
                });
            }
        });
    },
    pay: function(a) {
        var e = this;
        e.setData({
            formId: a.detail.formId
        });
        var t = wx.getStorageSync("openid"), o = e.data.comment.true_price;
        e.data.true_money && (o = e.data.true_money);
        var d = e.data.comment.order_id;
        app.util.request({
            url: "entry/wxapp/checktable",
            data: {
                order_id: d
            },
            success: function(a) {
                console.log(a), a.data.data ? app.util.request({
                    url: "entry/wxapp/weixinpay",
                    data: {
                        openid: t,
                        price: o,
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
                                console.log(a), wx.showToast({
                                    title: "支付成功",
                                    icon: "success",
                                    duration: 3e3,
                                    success: function(a) {
                                        e.payover_do(d), e.sendMail_order(d), "0" != e.data.is_more && e.sendMail_form();
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
                }) : wx.showModal({
                    title: "抱歉",
                    content: "您选择的商品已售出，请重新选购",
                    showCancel: !1,
                    success: function(a) {
                        wx.navigateBack({
                            delta: 2
                        });
                    }
                });
            }
        });
    },
    payover_do: function(a) {
        var e = this, t = e.data.comment, o = e.data.true_price, d = e.data.my_money, r = e.data.true_money, n = e.data.dikou_jf;
        n = 1 == t.is_score ? n : 0;
        var i = 0;
        i = 0 == r ? o : d, app.util.request({
            url: "entry/wxapp/orderpayover",
            data: {
                order_id: a,
                my_pay_money: i,
                true_money: r,
                jf_score: n,
                openid: wx.getStorageSync("openid"),
                formId: e.data.formId
            },
            success: function(a) {
                1 == a.data.data && wx.reLaunch({
                    url: "/sudu8_page/order/order?type=9"
                });
            },
            fail: function(a) {
                console.log("fail");
            },
            complete: function(a) {
                console.log("complete");
            }
        });
    },
    switch1Change: function(a) {
        var e = this, t = (e.data.dikou_jf, e.data.dikou_jf_val), o = 0, d = 0;
        d = 0 == (o = a.detail.value ? t : 0) ? -t : t;
        var r = e.data.true_money, n = e.data.true_price;
        0 == r ? n = (1e3 * n - 1e3 * d) / 1e3 : r = (1e3 * r - 1e3 * d) / 1e3, e.setData({
            dikou_jf: o,
            true_money: r,
            true_price: n
        });
    }
});