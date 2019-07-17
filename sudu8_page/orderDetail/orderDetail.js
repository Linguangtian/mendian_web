var _Page;

function _defineProperty(e, a, t) {
    return a in e ? Object.defineProperty(e, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[a] = t, e;
}

var app = getApp();

Page((_defineProperty(_Page = {
    data: {
        state: 1,
        orderFormDisable: !0,
        isChange: "",
        formchangeBtn: 2
    },
    changeOrderFormDisable: function() {
        this.setData({
            orderFormDisable: !1,
            isChange: "isChange",
            formchangeBtn: 3
        });
    },
    changeOrderFormConfirm: function() {
        var a = this;
        wx.showModal({
            title: "确定提交吗",
            content: "只有一次修改的机会哦",
            success: function(e) {
                e.confirm && app.util.request({
                    url: "entry/wxapp/applyModifyAppointInfo",
                    data: {
                        pro_name: a.data.pro_name,
                        pro_tel: a.data.pro_tel,
                        pro_address: a.data.pro_address,
                        chuydate: a.data.chuydate,
                        chuytime: a.data.chuytime,
                        order_id: a.data.order
                    },
                    success: function(e) {
                        console.log(e), a.setData({
                            orderFormDisable: !0,
                            isChange: "",
                            formchangeBtn: 4
                        }), wx.showModal({
                            title: "提示",
                            content: "信息修改成功，请等待后台管理员审核！",
                            showCancel: !1
                        });
                    }
                });
            }
        });
    },
    changeOrderFormCancel: function() {
        this.setData({
            orderFormDisable: !0,
            isChange: "",
            formchangeBtn: 2
        });
    },
    ContactMerchant: function() {
        var t = this;
        wx.showModal({
            title: "提示",
            content: "请联系商家咨询具体信息！",
            confirmText: "联系商家",
            success: function(e) {
                if (e.confirm) {
                    var a = t.data.baseinfo.tel;
                    wx.makePhoneCall({
                        phoneNumber: a
                    });
                }
            }
        });
    },
    bindDateChange2: function(e) {
        this.setData({
            chuydate: e.detail.value
        });
    },
    onLoad: function(e) {
        var a = this;
        e.orderid && a.setData({
            orderid: e.orderid
        });
        var t = 0;
        e.fxsid && (t = e.fxsid, a.setData({
            fxsid: e.fxsid
        })), a.getBase(), app.util.getUserInfo(a.getinfos, t);
    },
    getBase: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/BaseMin",
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
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(e) {
                a.setData({
                    openid: e.data
                }), a.getOrder();
            }
        });
    },
    getOrder: function() {
        var a = this, e = a.data.orderid;
        app.util.request({
            url: "entry/wxapp/getOrderMoreDetail",
            data: {
                order_id: e
            },
            success: function(e) {
                a.setData({
                    datas: e.data.data
                }), console.log(e);
            }
        });
    },
    copy: function(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.ddh,
            success: function(e) {
                wx.showToast({
                    title: "复制成功"
                });
            }
        });
    },
    makephonecall: function() {
        this.data.datas.seller_tel && wx.makePhoneCall({
            phoneNumber: this.data.datas.seller_tel
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
}, "copy", function(e) {
    var a = e.currentTarget.dataset.ddh;
    wx.setClipboardData({
        data: a,
        success: function(e) {
            wx.getClipboardData({
                success: function(e) {
                    console.log(e.data);
                }
            });
        }
    });
}), _defineProperty(_Page, "tuikuan", function(e) {
    console.log(e);
    var a = e.detail.formId, t = e.currentTarget.dataset.order;
    console.log(t), wx.showModal({
        title: "提醒",
        content: "确定要退款吗？",
        success: function(e) {
            e.confirm && app.util.request({
                url: "entry/wxapp/tuikuan",
                data: {
                    formId: a,
                    order_id: t
                },
                success: function(e) {
                    console.log(e), 1 == e.data.data.flag ? wx.showModal({
                        title: "很抱歉",
                        content: e.data.data.message,
                        showCancel: !1
                    }) : 0 == e.data.data.flag && wx.showModal({
                        title: "恭喜您",
                        content: e.data.data.message,
                        showCancel: !1,
                        success: function(e) {
                            wx.redirectTo({
                                url: "/sudu8_page/orderDetail/orderDetail?orderid=" + t
                            });
                        }
                    });
                }
            });
        }
    });
}), _defineProperty(_Page, "qrshouh", function(e) {
    var a = e.target.dataset.order, t = wx.getStorageSync("openid");
    app.util.request({
        url: "entry/wxapp/querenxc",
        data: {
            openid: t,
            orderid: a
        },
        success: function(e) {
            wx.redirectTo({
                url: "/sudu8_page/orderDetail/orderDetail?orderid=" + a
            });
        }
    });
}), _defineProperty(_Page, "tuihuo", function(e) {
    this.setData({
        showmask: !0,
        order_tuihuo: e.currentTarget.dataset.order
    });
}), _Page));