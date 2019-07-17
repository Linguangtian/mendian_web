/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:19*/
function t(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t
}
var a = getApp();
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
        this.getinfos()
    },
    onLoad: function(t) {
        var e = this,
            o = t.id;
        e.setData({
            id: o
        });
        var i = 0;
        t.fxsid && (i = t.fxsid, e.setData({
            fxsid: t.fxsid
        }));
        var n = a.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: n,
            cachetime: "30",
            success: function(t) {
                t.data.data;
                e.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                })
            }
        }), a.util.getUserInfo(e.getinfos, i)
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                });
                var e = t.data.id;
                t.getShowPic(e)
            }
        })
    },
    getShowPic: function(t) {
        var e = this,
            o = wx.getStorageSync("openid"),
            i = a.util.url("entry/wxapp/mycoupon", {
                m: "sudu8_page"
            });
        wx.request({
            url: i,
            data: {
                openid: o,
                flag: 0
            },
            success: function(t) {
                console.log(t), e.setData({
                    couponlist: t.data.data
                })
            },
            fail: function(t) {
                console.log(t)
            }
        }), a.util.request({
            url: "entry/wxapp/showPro",
            data: {
                id: t,
                openid: o
            },
            cachetime: "30",
            success: function(t) {
                var a = e.data.yhje;
                e.setData({
                    picList: t.data.data.images,
                    title: t.data.data.title,
                    datas: t.data.data,
                    hjjg: t.data.data.sellprice,
                    dprice: t.data.data.sellprice,
                    sfje: t.data.data.sellprice - a,
                    shengyu: t.data.data.storage
                }), console.log(e.data.datas), wx.setNavigationBarTitle({
                    title: e.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh()
            }
        })
    },
    jian: function() {
        var t = this,
            a = t.data.jhsl,
            e = t.data.dprice,
            o = t.data.yhje;
        --a <= 0 && (a = 1);
        var i = 100 * e * a / 100,
            n = i - o;
        t.setData({
            jhsl: a,
            hjjg: i,
            sfje: n,
            jqdjg: "请选择",
            yhqid: 0
        })
    },
    jia: function() {
        var t = this,
            a = t.data.jhsl,
            e = t.data.my_num,
            o = t.data.xg_num,
            i = t.data.shengyu,
            n = t.data.dprice,
            s = t.data.yhje;
        ++a > i && -1 != i && (a--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        })), a + e > o && 0 != o && (1 == a ? a = 1 : a -= 1, wx.showModal({
            title: "提醒",
            content: "该商品为限购产品，您总购买数已超过限额！",
            showCancel: !1
        }));
        var d = 100 * n * a / 100,
            r = d - s;
        t.setData({
            jhsl: a,
            hjjg: d,
            sfje: r,
            jqdjg: "请选择",
            yhqid: 0
        })
    },
    userNameInput: function(t) {
        this.setData({
            pro_name: t.detail.value
        })
    },
    userTelInput: function(t) {
        this.setData({
            pro_tel: t.detail.value
        })
    },
    userAddInput: function(t) {
        this.setData({
            pro_address: t.detail.value
        })
    },
    userTextInput: function(t) {
        this.setData({
            pro_txt: t.detail.value
        })
    },
    save: function(t) {
        var e = this,
            o = e.data.jhsl,
            i = e.data.shengyu;
        if (o > i && -1 != i) return o--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        var n = e.data.sfje,
            s = wx.getStorageSync("openid"),
            d = e.data.jhsl,
            r = e.data.dprice,
            c = e.data.yhje,
            l = e.data.id,
            u = e.data.order,
            h = e.data.pro_name,
            p = e.data.pro_tel,
            g = e.data.pro_address,
            f = e.data.pro_txt,
            w = (e.data.id, e.data.yhqid),
            x = (t.detail.formId, !0);
        if (!h) return x = !1, wx.showModal({
            title: "提醒",
            content: "姓名为必填！",
            showCancel: !1
        }), !1;
        var y = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return p ? y.test(p) ? g ? void(x && a.util.request({
            url: "entry/wxapp/Dingd",
            data: {
                openid: s,
                id: l,
                price: r,
                count: d,
                youhui: c,
                zhifu: n,
                order: u,
                pro_name: h,
                pro_tel: p,
                pro_address: g,
                pro_txt: f,
                yhqid: w
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                console.log(t);
                var o = t.data.data.order_id;
                return 0 == t.data.data.success && 0 == t.data.data.syl ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！商品售完了！",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../goods_detail/goods_detail?id=" + l
                        })
                    }
                }), !1) : 0 == t.data.data.success && t.data.data.syl > 0 ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！商品只剩下" + t.data.data.syl + "个",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../goods_detail/goods_detail?id=" + l
                        })
                    }
                }), !1) : void(1 == t.data.data.success && (e.setData({
                    order: t.data.data
                }), wx.showModal({
                    title: "提醒",
                    content: "您将支付" + n + "元",
                    success: function(t) {
                        t.confirm && a.util.request({
                            url: "entry/wxapp/zhifu",
                            data: {
                                openid: s,
                                money: n,
                                types: 1,
                                order_id: o
                            },
                            header: {
                                "content-type": "application/json"
                            },
                            success: function(t) {
                                console.log(t), t.data.data.order_id && wx.requestPayment({
                                    timeStamp: t.data.data.timeStamp,
                                    nonceStr: t.data.data.nonceStr,
                                    package: t.data.data.package,
                                    signType: "MD5",
                                    paySign: t.data.data.paySign,
                                    success: function(t) {
                                        wx.showToast({
                                            title: "支付成功",
                                            icon: "success",
                                            duration: 3e3,
                                            success: function(t) {
                                                console.log("ok"), a.util.request({
                                                    url: "entry/wxapp/zhifuSuccess",
                                                    data: {
                                                        order_id: o
                                                    },
                                                    success: function(t) {
                                                        console.log(t)
                                                    }
                                                }), wx.redirectTo({
                                                    url: "/sudu8_page/order_more_list/order_more_list"
                                                })
                                            },
                                            fail: function(t) {
                                                wx.showToast({
                                                    icon: "loading",
                                                    title: "支付失败！",
                                                    duration: 2e3
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })))
            }
        })) : (x = !1, wx.showModal({
            title: "提醒",
            content: "地址为必填！",
            showCancel: !1
        }), !1) : (wx.showModal({
            title: "提醒",
            content: "请输入有效的手机号码！",
            showCancel: !1
        }), !1) : (x = !1, wx.showModal({
            title: "提醒",
            content: "手机号为必填！",
            showCancel: !1
        }), !1)
    },
    bindDateChange: function(t) {
        console.log("picker发送选择改变，携带值为", t.detail.value), this.setData({
            chuydate: t.detail.value
        })
    },
    bindTimeChange: function(t) {
        console.log("picker发送选择改变，携带值为", t.detail.value), this.setData({
            chuytime: t.detail.value
        })
    },
    getmoney: function(t) {
        var a = this,
            e = t.currentTarget.id,
            o = t.currentTarget.dataset.index,
            i = o.coupon.pay_money,
            n = a.data.hjjg;
        if (1 * n < 1 * i) wx.showModal({
            title: "提示",
            content: "价格未满" + i + "元，不可使用该优惠券！",
            showCancel: !1
        });
        else {
            var s = (100 * n - 100 * e) / 100,
                d = parseFloat(s.toPrecision(12));
            d < 0 && (d = 0), a.setData({
                jqdjg: e,
                yhqid: o.id,
                sfje: d
            }), a.hideModal()
        }
    },
    qxyh: function() {
        var a = this,
            e = a.data.jqdjg;
        "请选择" == e && (e = 0);
        var o = (100 * a.data.sfje + 100 * e) / 100;
        a.hideModal(), a.setData(t({
            jqdjg: 0,
            yhqid: 0,
            sfje: o
        }, "jqdjg", "请选择"))
    },
    showModal: function() {
        var t = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = t, t.translateY(300).step(), this.setData({
            animationData: t.export(),
            showModalStatus: !0
        }), setTimeout(function() {
            t.translateY(0).step(), this.setData({
                animationData: t.export()
            })
        }.bind(this), 200)
    },
    hideModal: function() {
        var t = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = t, t.translateY(300).step(), this.setData({
            animationData: t.export()
        }), setTimeout(function() {
            t.translateY(0).step(), this.setData({
                animationData: t.export(),
                showModalStatus: !1
            })
        }.bind(this), 200)
    }
});