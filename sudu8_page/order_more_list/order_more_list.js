var app = getApp();

Page({
    data: {
        page_sign: "order",
        page: 1,
        morePro: !1,
        baseinfo: [],
        orderinfo: [],
        type: 9,
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        },
        type1: 10,
        flag: 10,
        showmask: !1,
        kuaidi: [ "选择快递", "圆通", "中通", "申通", "顺丰", "韵达", "天天", "EMS", "本人到店", "其他" ],
        index: 0
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onReachBottom: function() {
        this.getList();
    },
    onLoad: function(t) {
        var a = this;
        wx.setNavigationBarTitle({
            title: "我的订单"
        }), app.util.request({
            url: "entry/wxapp/BaseMin",
            data: {
                vs1: 1
            },
            success: function(t) {
                a.setData({
                    baseinfo: t.data.data,
                    baseColor: t.data.data.base_color2
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                });
            }
        }), t.flag && a.setData({
            flag: t.flag
        }), t.type1 && a.setData({
            type1: t.type1
        });
        var e = 0;
        t.fxsid && (e = t.fxsid, a.setData({
            fxsid: t.fxsid
        })), app.util.getUserInfo(a.getinfos, e);
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
                }), a.getList();
            }
        });
    },
    changflag: function(t) {
        var a = this;
        a.data.page = 1;
        var e = t.currentTarget.dataset.flag, o = t.currentTarget.dataset.nav;
        null != o && null != e ? a.setData({
            type1: o,
            flag: e
        }) : null == o && a.setData({
            flag: e
        }), a.getList();
    },
    setorderover: function(t) {
        wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/setorderover",
            data: {
                openid: wx.getStorageSync("openid")
            },
            success: function(t) {}
        });
    },
    getList: function(t) {
        var a = this, e = (wx.getStorageSync("openid"), a.data.page);
        app.util.request({
            url: "entry/wxapp/duoorderlist",
            data: {
                page: e,
                flag: a.data.flag,
                type1: a.data.type1,
                openid: wx.getStorageSync("openid")
            },
            success: function(t) {
                console.log(e), a.setData({
                    page: e + 1,
                    orderinfo: 1 == e ? t.data.data : a.data.orderinfo.concat(t.data.data)
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    makePhoneCallB: function(t) {
        var a = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    qrshouh: function(t) {
        var a = this, e = t.target.dataset.order, o = wx.getStorageSync("openid");
        wx.showModal({
            title: "提示",
            content: "确认收货吗？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/querenxc",
                    data: {
                        openid: o,
                        orderid: e
                    },
                    success: function(t) {
                        wx.showToast({
                            title: "收货成功！",
                            success: function(t) {
                                setTimeout(function() {
                                    a.data.page = 1, a.getList();
                                }, 1500);
                            }
                        });
                    }
                });
            }
        });
    },
    tuihuo: function(t) {
        this.setData({
            showmask: !0,
            order_tuihuo: t.currentTarget.dataset.order
        });
    },
    bindPickerChange: function(t) {
        this.setData({
            index: t.detail.value
        });
    },
    changekdh: function(t) {
        this.setData({
            kdh: t.detail.value
        });
    },
    cancelkdinfo: function() {
        this.setData({
            showmask: !1
        });
    },
    changekdinfo: function() {
        var t = this;
        0 == t.data.index ? wx.showModal({
            title: "提交失败",
            content: "必须选择快递",
            showCancel: !1
        }) : t.data.kdh ? app.util.request({
            url: "entry/wxapp/tuihuo",
            data: {
                order_id: t.data.order_tuihuo,
                kuaidi: t.data.kuaidi[t.data.index],
                kuaidihao: t.data.kdh
            },
            success: function(t) {
                console.log(t), wx.showToast({
                    title: "已申请退货",
                    icon: "success",
                    success: function() {
                        setTimeout(function() {
                            wx.redirectTo({
                                url: "/sudu8_page/order_more_list/order_more_list"
                            });
                        }, 1500);
                    }
                });
            }
        }) : wx.showModal({
            title: "提交失败",
            content: "快递号/信息必填",
            showCancel: !1
        });
    },
    tuikuan: function(t) {
        console.log(t);
        var a = t.detail.formId, e = t.currentTarget.dataset.order;
        console.log(e), wx.showModal({
            title: "提醒",
            content: "确定要退款吗？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/tuikuan",
                    data: {
                        formId: a,
                        order_id: e
                    },
                    success: function(t) {
                        console.log(t), 1 == t.data.data.flag ? wx.showModal({
                            title: "很抱歉",
                            content: t.data.data.message,
                            showCancel: !1
                        }) : 0 == t.data.data.flag && wx.showModal({
                            title: "恭喜您",
                            content: t.data.data.message,
                            showCancel: !1,
                            success: function(t) {
                                wx.redirectTo({
                                    url: "/sudu8_page/order_more_list/order_more_list"
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});