function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var app = getApp();

Page({
    data: {
        id: "",
        bg: "",
        picList: [],
        datas: "",
        comment: "",
        jhsl: 1,
        dprice: "",
        yhje: 0,
        hjjg: "",
        sfje: "",
        order: "",
        pro_name: "",
        pro_tel: "",
        pro_address: "",
        pro_txt: "",
        my_num: "",
        my_gml: "",
        xg_num: "",
        shengyu: "",
        cdd: "",
        chuydate: "",
        chuytime: "",
        num: [],
        xz_num: [],
        couponprice: 0,
        jqdjg: "请选择",
        yhqid: "0",
        oldsfje: "",
        pagedata: {},
        hxmm: "",
        showhx: 0,
        orderFormDisable: !0,
        isChange: "",
        formchangeBtn: 1
    },
    changeOrderFormDisable: function() {
        this.setData({
            orderFormDisable: !1,
            isChange: "isChange",
            formchangeBtn: 3
        });
    },
    changeOrderFormConfirm: function() {
        var t = this;
        wx.showModal({
            title: "确定提交吗",
            content: "只有一次修改的机会哦",
            success: function(a) {
                a.confirm && app.util.request({
                    url: "entry/wxapp/applyModifyAppointInfo",
                    data: {
                        pro_name: t.data.pro_name,
                        pro_tel: t.data.pro_tel,
                        pro_address: t.data.pro_address,
                        chuydate: t.data.chuydate,
                        chuytime: t.data.chuytime,
                        order_id: t.data.order
                    },
                    success: function(a) {
                        console.log(a), t.setData({
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
        var e = this;
        wx.showModal({
            title: "提示",
            content: "请联系商家咨询具体信息！",
            confirmText: "联系商家",
            success: function(a) {
                if (a.confirm) {
                    var t = e.data.baseinfo.tel;
                    wx.makePhoneCall({
                        phoneNumber: t
                    });
                }
            }
        });
    },
    onPullDownRefresh: function() {
        var a = this.data.order;
        this.getOrder(a);
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            order: e
        });
        var d = 0;
        a.fxsid && (d = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(a) {
                a.data.data;
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), app.util.getUserInfo(t.getinfos, d);
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
                e.setData({
                    openid: a.data
                });
                var t = e.data.order;
                e.getOrder(t);
            }
        });
    },
    getOrder: function(a) {
        var r = this, t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/mycoupon",
            data: {
                openid: t
            },
            success: function(a) {
                console.log(a.data.data), r.setData({
                    couponlist: a.data.data
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), app.util.request({
            url: "entry/wxapp/Orderinfo",
            data: {
                order: a,
                openid: t
            },
            cachetime: "30",
            success: function(a) {
                r.data.yhje;
                console.log(a.data.data);
                for (var t = a.data.data.more_type_x, e = [], d = {}, o = 0; o < t.length; o++) d[o] = t[o][4], 
                e.push(d);
                console.log(t);
                var n = a.data.data.true_price, s = a.data.data.coupon.price, i = 1 * n + 1 * s;
                "3" == a.data.data.flag && "1" == a.data.data.pro_flag_ding ? r.setData({
                    formchangeBtn: 0
                }) : "1" != a.data.data.flag || 0 != a.data.data.can_modify || a.data.data.modify_info ? "1" != a.data.data.flag || 1 != a.data.data.can_modify || a.data.data.modify_info ? a.data.data.modify_info && 1 == a.data.data.modify_flag ? r.setData({
                    formchangeBtn: 4
                }) : a.data.data.modify_info && 2 == a.data.data.modify_flag ? r.setData({
                    formchangeBtn: 5
                }) : a.data.data.modify_info && 3 == a.data.data.modify_flag && r.setData({
                    formchangeBtn: 6
                }) : r.setData({
                    formchangeBtn: 2
                }) : r.setData({
                    formchangeBtn: 1
                }), r.setData({
                    id: a.data.data.pid,
                    datas: a.data.data,
                    dprice: a.data.data.price,
                    jhsl: a.data.data.num,
                    hjjg: a.data.data.true_price,
                    sfje: a.data.data.true_price,
                    pro_name: a.data.data.pro_user_name,
                    pro_tel: a.data.data.pro_user_tel,
                    pro_address: a.data.data.pro_user_add,
                    pro_txt: a.data.data.pro_user_txt,
                    my_num: a.data.data.my_num,
                    xg_num: a.data.data.pro_xz,
                    shengyu: a.data.data.pro_kc,
                    my_gml: a.data.data.my_num,
                    cdd: a.data.data.mcount,
                    chuydate: a.data.data.chuydate,
                    chuytime: a.data.data.chuytime,
                    modify_date_begin: a.data.data.modify_date_begin,
                    num: e,
                    xz_num: a.data.data.more_type_num,
                    oldsfje: i,
                    jqdjg: s,
                    yhqid: a.data.data.couponid,
                    pagedata: a.data.data.beizhu_val
                }), wx.setNavigationBarTitle({
                    title: r.data.datas.product
                }), wx.setStorageSync("isShowLoading", !1);
            }
        });
    },
    jian: function(a) {
        var t = this, e = t.data.yhje, d = a.currentTarget.dataset.testid, o = a.currentTarget.dataset.testkey, n = t.data.num[o][o], s = (t.data.duogg, 
        t.data.sfje), i = t.data.hjjg, r = t.data.oldsfje;
        if (--n < 0) n = 0; else {
            var c = (100 * r - 100 * d * n + 100 * d * (n - 1)) / 100;
            s = c - e, r = i = c;
            var u = t.data.num;
            u[o][o] = n, t.setData({
                num: u,
                sfje: s,
                hjjg: i,
                jqdjg: "请选择",
                oldsfje: r,
                yhqid: 0
            });
        }
    },
    jia: function(a) {
        var t = this, e = t.data.yhje, d = a.currentTarget.dataset.testid, o = a.currentTarget.dataset.testkey, n = t.data.num[o][o], s = (t.data.duogg, 
        t.data.sfje), i = t.data.hjjg, r = t.data.xz_num, c = t.data.oldsfje;
        if (r[o].shennum < ++n) return n--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        var u = (100 * d * n + 100 * c - 100 * d * (n - 1)) / 100;
        s = u - e, c = i = u;
        var l = t.data.num;
        l[o][o] = n, t.setData({
            num: l,
            sfje: s,
            hjjg: i,
            jqdjg: "请选择",
            oldsfje: c,
            yhqid: 0
        });
    },
    userNameInput: function(a) {
        this.setData({
            pro_name: a.detail.value
        });
    },
    userTelInput: function(a) {
        this.setData({
            pro_tel: a.detail.value
        });
    },
    userAddInput: function(a) {
        this.setData({
            pro_address: a.detail.value
        });
    },
    userTextInput: function(a) {
        this.setData({
            pro_txt: a.detail.value
        });
    },
    save: function() {
        var t = this, a = t.data.jhsl, e = t.data.shengyu;
        if (e < a && -1 != e) return a--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        for (var d = t.data.sfje, o = wx.getStorageSync("openid"), n = (t.data.duogg, t.data.num), s = (n[0], 
        []), i = {}, r = 0; r < n.length; r++) {
            var c = parseInt(n[r][r]);
            i[r] = c, s.push(i);
        }
        var u = t.data.chuydate, l = t.data.chuytime, h = t.data.yhje, p = t.data.id, f = t.data.order, g = t.data.pro_name, m = t.data.pro_tel, _ = t.data.pro_address, w = t.data.pro_txt, x = (t.data.id, 
        t.data.yhqid), y = !0;
        if (0 == d) return y = !1, wx.showModal({
            title: "提醒",
            content: "请至少选择一个规格的商品！",
            showCancel: !1
        }), !1;
        if (!g && 2 == t.data.datas.pro_flag) return y = !1, wx.showModal({
            title: "提醒",
            content: "姓名为必填！",
            showCancel: !1
        }), !1;
        if (!m && 2 == t.data.datas.pro_flag_tel) return y = !1, wx.showModal({
            title: "提醒",
            content: "手机号为必填！",
            showCancel: !1
        }), !1;
        if (!/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(m) && 2 == t.data.datas.pro_flag_tel) return wx.showModal({
            title: "提醒",
            content: "请输入有效的手机号码！",
            showCancel: !1
        }), !1;
        if (!_ && 2 == t.data.datas.pro_flag_add) return y = !1, wx.showModal({
            title: "提醒",
            content: "地址为必填！",
            showCancel: !1
        }), !1;
        if ("选择日期" == u && 2 == t.data.datas.pro_flag_data) return y = !1, wx.showModal({
            title: "提醒",
            content: "请选择日期！",
            showCancel: !1
        }), !1;
        if ("选择时间" == l && 2 == t.data.datas.pro_flag_time) return y = !1, wx.showModal({
            title: "提醒",
            content: "请选择时间！",
            showCancel: !1
        }), !1;
        var v = t.data.pagedata;
        for (r = 0; r < v.length; r++) if (1 == v[r].ismust && "" == v[r].val) return y = !1, 
        wx.showModal({
            title: "提醒",
            content: v[r].name + "为必填项！",
            showCancel: !1
        }), !1;
        y && app.util.request({
            url: "entry/wxapp/Dingd",
            data: {
                openid: o,
                num: s[0],
                id: p,
                youhui: h,
                zhifu: d,
                order: f,
                pro_name: g,
                pro_tel: m,
                pro_address: _,
                pro_txt: w,
                chuydate: u,
                chuytime: l,
                yhqid: x,
                pagedata: v
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                return console.log("执行返回了！"), console.log(a), 0 == a.data.data.success && 0 == a.data.data.syl ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！商品售完了！",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../showPro/showPro?id=" + a.data.data.id
                        });
                    }
                }), !1) : 0 == a.data.data.success && 0 < a.data.data.syl ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！商品只剩下" + a.data.data.syl + "个",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../showPro/showPro?id=" + a.data.data.id
                        });
                    }
                }), !1) : void (1 == a.data.data.success && (t.setData({
                    order: a.data.data
                }), wx.reLaunch({
                    url: "../show_Pro_d/show_Pro_d?order=" + a.data.data.order_id
                })));
            }
        });
    },
    passd: function() {
        var t = this.data.order;
        wx.showModal({
            title: "提醒",
            content: "亲，您确定要删除该订单？",
            success: function(a) {
                a.confirm && app.util.request({
                    url: "entry/wxapp/dpass",
                    data: {
                        order: t
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        1 == a.data.data && wx.showToast({
                            title: "订单取消成功",
                            icon: "success",
                            duration: 2e3,
                            success: function() {
                                wx.redirectTo({
                                    url: "/sudu8_page/order/order?type=9"
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    bindDateChange2: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            chuydate: a.detail.value
        });
    },
    bindTimeChange2: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            chuytime: a.detail.value
        });
    },
    getmoney: function(a) {
        var t = a.currentTarget.id, e = a.currentTarget.dataset.index, d = e.coupon.pay_money, o = this.data.hjjg;
        if (1 * o < 1 * d) wx.showModal({
            title: "提示",
            content: "价格未满" + d + "元，不可使用该优惠券！",
            showCancel: !1
        }); else {
            var n = parseFloat(((100 * o - 100 * t) / 100).toPrecision(12));
            n < 0 && (n = 0), this.setData({
                jqdjg: t,
                yhqid: e.id,
                sfje: n,
                oldsfje: o
            }), this.hideModal();
        }
    },
    qxyh: function() {
        var a = this.data.jqdjg;
        "请选择" == a && (a = 0);
        var t = (100 * this.data.sfje + 100 * a) / 100;
        this.hideModal(), this.setData(_defineProperty({
            jqdjg: 0,
            yhqid: 0,
            sfje: t,
            oldsfje: t
        }, "jqdjg", "请选择"));
    },
    showModal: function() {
        var a = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        (this.animation = a).translateY(300).step(), this.setData({
            animationData: a.export(),
            showModalStatus: !0
        }), setTimeout(function() {
            a.translateY(0).step(), this.setData({
                animationData: a.export()
            });
        }.bind(this), 200);
    },
    hideModal: function() {
        var a = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        (this.animation = a).translateY(300).step(), this.setData({
            animationData: a.export()
        }), setTimeout(function() {
            a.translateY(0).step(), this.setData({
                animationData: a.export(),
                showModalStatus: !1
            });
        }.bind(this), 200);
    },
    bindInputChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        d[e].val = t, this.setData({
            pagedata: d
        });
    },
    bindPickerChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log();
        var o = d[e].tp_text[t];
        d[e].val = o, this.setData({
            pagedata: d
        });
    },
    bindDateChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    bindTimeChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    checkboxChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    radioChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    hxmmInput: function(a) {
        this.setData({
            hxmm: a.detail.value
        });
    },
    hxmmpass: function() {
        var e = this, a = e.data.hxmm, d = e.data.datas;
        a ? app.util.request({
            url: "entry/wxapp/hxmm",
            data: {
                hxmm: a,
                order_id: d.order_id
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                0 == a.data.data ? wx.showModal({
                    title: "提示",
                    content: "核销密码不正确！",
                    showCancel: !1
                }) : wx.showToast({
                    title: "消费成功",
                    icon: "success",
                    duration: 2e3,
                    success: function(a) {
                        d.flag = 2, e.setData({
                            datas: d,
                            showhx: 0
                        });
                        var t = e.data.order;
                        this.getOrder(t);
                    }
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入核销密码！",
            showCancel: !1
        });
    },
    hxshow: function() {
        this.setData({
            showhx: 1
        });
    },
    hxhide: function() {
        this.setData({
            showhx: 0
        });
    }
});