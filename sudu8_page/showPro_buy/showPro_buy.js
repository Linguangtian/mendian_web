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
        couponlist: [],
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
        xg_num: "",
        shengyu: "",
        userInfo: "",
        chuydate: "",
        chuytime: "",
        couponprice: 0,
        jqdjg: "请选择",
        yhqid: "0"
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            id: e
        });
        var o = 0;
        a.fxsid && (o = a.fxsid, t.setData({
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
        }), app.util.getUserInfo(t.getinfos, o);
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
                var t = e.data.id;
                e.getShowPic(t);
            }
        });
    },
    getShowPic: function(a) {
        var o = this, t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/mycoupon",
            data: {
                openid: t,
                flag: 0
            },
            success: function(a) {
                o.setData({
                    couponlist: a.data.data
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), app.util.request({
            url: "entry/wxapp/showPro",
            data: {
                id: a,
                openid: t
            },
            cachetime: "30",
            success: function(a) {
                var t = o.data.yhje;
                if (0 == a.data.data.pro_xz) e = 1; else var e = a.data.data.pro_xz - a.data.data.my_num;
                o.setData({
                    bg: a.data.data.text[0],
                    picList: a.data.data.text,
                    title: a.data.data.title,
                    datas: a.data.data,
                    hjjg: a.data.data.price,
                    dprice: a.data.data.price,
                    sfje: a.data.data.price - t,
                    my_num: a.data.data.my_num,
                    xg_num: a.data.data.pro_xz,
                    shengyu: a.data.data.pro_kc,
                    xg_buy: e
                }), console.log("我的购买数" + o.data.my_num), console.log(o.data.datas), wx.setNavigationBarTitle({
                    title: o.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    jian: function() {
        var a = this, t = a.data.jhsl;
        --t <= 0 && (t = 1);
        var e = 100 * a.data.dprice * t / 100, o = e - a.data.yhje;
        a.setData({
            jhsl: t,
            hjjg: e,
            sfje: o,
            jqdjg: "请选择",
            yhqid: 0
        });
    },
    jia: function() {
        var a = this, t = a.data.jhsl, e = a.data.my_num, o = a.data.xg_num, d = a.data.shengyu, i = a.data.dprice, n = a.data.yhje;
        d < ++t && -1 != d && (t--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        })), o < t + e && 0 != o && (1 == t ? t = 1 : t -= 1, wx.showModal({
            title: "提醒",
            content: "该商品为限购产品，您总购买数已超过限额！",
            showCancel: !1
        }));
        var s = 100 * i * t / 100, r = s - n;
        a.setData({
            jhsl: t,
            hjjg: s,
            sfje: r,
            jqdjg: "请选择",
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
    save: function(a) {
        var t = this, e = t.data.jhsl, o = t.data.shengyu;
        if (o < e && -1 != o) return e--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        var d = t.data.sfje, i = wx.getStorageSync("openid"), n = t.data.jhsl, s = t.data.dprice, r = t.data.yhje, l = t.data.id, c = t.data.order, u = t.data.pro_name, h = t.data.pro_tel, p = t.data.pro_address, f = t.data.pro_txt, g = (t.data.id, 
        t.data.yhqid), w = (a.detail.formId, !0);
        if (!u && 2 == t.data.datas.pro_flag) return w = !1, wx.showModal({
            title: "提醒",
            content: "姓名为必填！",
            showCancel: !1
        }), !1;
        return h || 2 != t.data.datas.pro_flag_tel ? /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(h) || 2 != t.data.datas.pro_flag_tel ? p || 2 != t.data.datas.pro_flag_add ? void (w && app.util.request({
            url: "entry/wxapp/Dingd",
            data: {
                openid: i,
                id: l,
                price: s,
                count: n,
                youhui: r,
                zhifu: d,
                order: c,
                pro_name: u,
                pro_tel: h,
                pro_address: p,
                pro_txt: f,
                yhqid: g
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                return 0 == a.data.data.success && 0 == a.data.data.syl ? (wx.showModal({
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
        })) : (w = !1, wx.showModal({
            title: "提醒",
            content: "地址为必填！",
            showCancel: !1
        }), !1) : (wx.showModal({
            title: "提醒",
            content: "请输入有效的手机号码！",
            showCancel: !1
        }), !1) : (w = !1, wx.showModal({
            title: "提醒",
            content: "手机号为必填！",
            showCancel: !1
        }), !1);
    },
    bindDateChange: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            chuydate: a.detail.value
        });
    },
    bindTimeChange: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            chuytime: a.detail.value
        });
    },
    getmoney: function(a) {
        var t = a.currentTarget.id, e = a.currentTarget.dataset.index, o = e.coupon.pay_money, d = this.data.hjjg;
        if (1 * d < 1 * o) wx.showModal({
            title: "提示",
            content: "价格未满" + o + "元，不可使用该优惠券！",
            showCancel: !1
        }); else {
            var i = parseFloat(((100 * d - 100 * t) / 100).toPrecision(12));
            i < 0 && (i = 0), this.setData({
                jqdjg: t,
                yhqid: e.id,
                sfje: i
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
            sfje: t
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
    }
});