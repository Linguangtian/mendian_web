/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:15*/
function a(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a
}
var t = getApp();
Page({
    data: {
        title: "订单提交",
        yhq_hidden: 0,
        yhq: ["不使用优惠券", "满100减10", "满200减30", "满500减100"],
        yhq_i: 0,
        yhq_tishi: 1,
        yhq_u: 0,
        nav: 1,
        jqdjg: "请选择",
        jifen_u: 0,
        yhqid: 0,
        yhdq: 0,
        sfje: 0,
        szmoney: 0,
        dkmoney: 0,
        dkscore: 0,
        mjly: "",
        px: 0,
        yunfei: 0,
        yfjian: 0
    },
    onPullDownRefresh: function() {
        this.getinfos()
    },
    onLoad: function(a) {
        var e = this,
            n = a.shareid;
        e.setData({
            shareid: n
        });
        var i = a.id;
        null != i && e.setData({
            id: i
        }), wx.setNavigationBarTitle({
            title: e.data.title
        }), wx.getSystemInfo({
            success: function(a) {
                e.setData({
                    h: a.windowHeight
                })
            }
        });
        var d = a.addressid;
        d ? e.getmraddresszd(d) : e.getmraddress();
        var s = 0;
        a.fxsid && (s = a.fxsid, e.setData({
            fxsid: a.fxsid
        }));
        var o = t.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: o,
            data: {
                vs1: 1
            },
            success: function(a) {
                e.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                })
            }
        });
        var r = a.orderid;
        console.log(r), r && "undefined" != r && null != r ? t.util.request({
            url: "entry/wxapp/duoorderinfo",
            data: {
                orderid: r
            },
            success: function(a) {
                for (var t = a.data.data.jsondata, n = 0, i = 0, d = 0; d < t.length; d++) {
                    var s = t[d].num;
                    if (1 == (i = t[d].gmorpt)) var o = t[d].proinfo.price;
                    else o = t[d].proinfo.dprice;
                    n += 1 * o * (1 * s)
                }
                e.setData({
                    jsdata: a.data.data.jsondata,
                    jsprice: n,
                    sfje: n,
                    px: 1,
                    orderid: r,
                    gwc: i
                }), e.tuanzyh()
            }
        }) : wx.getStorage({
            key: "jsdata",
            success: function(a) {
                for (var t = a.data, n = 0, i = 0, d = 0; d < t.length; d++) {
                    var s = t[d].num;
                    if (1 == (i = t[d].gmorpt)) var o = t[d].proinfo.price;
                    else o = t[d].proinfo.dprice;
                    n += 1 * o * (1 * s)
                }
                console.log(a.data), e.setData({
                    jsdata: a.data,
                    jsprice: n,
                    sfje: n,
                    px: 0,
                    gwc: i
                }), e.tuanzyh()
            }
        }), t.util.getUserInfo(e.getinfos, s)
    },
    getkuaidi: function() {
        var a = this;
        t.util.request({
            url: "entry/wxapp/getkuaidi",
            data: {
                id: a.data.id
            },
            success: function(t) {
                0 == t.data.data ? a.setData({
                    nav: 1
                }) : a.setData({
                    nav: 2
                }), a.nav()
            }
        })
    },
    nav: function(a) {
        var t = this,
            e = 0,
            n = t.data.yunfei;
        console.log(n);
        var i = t.data.nav;
        console.log(i), e = 1 == i ? 0 : n, t.setData({
            yfjian: e
        })
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                a.setData({
                    openid: t.data
                })
            }
        })
    },
    switchChange: function(a) {
        for (var e = this, n = a.detail.value, i = wx.getStorageSync("openid"), d = e.data.jsdata, s = e.data.sfje, o = 0, r = [], u = 0; u < d.length; u++) {
            var c = {};
            c.num = d[u].num, c.pvid = d[u].pvid, r.push(c)
        }
        1 == n ? t.util.request({
            url: "entry/wxapp/setgwcscore",
            data: {
                jsdata: r,
                openid: i
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var t = a.data.data;
                o = t.moneycl;
                var n = t.gzmoney,
                    i = t.gzscore;
                s < o && (o = parseInt(s));
                var d = o * i / n;
                s -= o, e.setData({
                    sfje: s,
                    szmoney: o,
                    dkmoney: o,
                    dkscore: d,
                    jifen_u: 1
                })
            }
        }) : (o = e.data.szmoney, s += o, e.setData({
            sfje: s,
            szmoney: 0,
            dkmoney: 0,
            dkscore: 0,
            jifen_u: 0
        }))
    },
    add_address: function() {
        wx.navigateTo({
            url: "/sudu8_page/address/address?shareid=" + this.data.shareid + "&pid=" + this.data.id
        })
    },
    yhq_sub: function() {
        var a = this.data.yhq_i;
        this.setData({
            yhq_r: a,
            yhq_hidden: 0,
            yhq_tishi: 0
        })
    },
    yhq_block: function() {
        this.setData({
            yhq_hidden: 1
        })
    },
    yhq_choose: function(a) {
        var t = a.currentTarget.dataset.i;
        this.setData({
            yhq_i: t
        })
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
            })
        }.bind(this), 200)
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
            })
        }.bind(this), 200)
    },
    getmraddress: function() {
        var a = this,
            e = wx.getStorageSync("openid");
        t.util.request({
            url: "entry/wxapp/getmraddress",
            data: {
                openid: e
            },
            success: function(t) {
                var e = t.data.data;
                a.setData({
                    mraddress: e
                })
            }
        })
    },
    getmraddresszd: function(a) {
        var e = this,
            n = wx.getStorageSync("openid");
        t.util.request({
            url: "entry/wxapp/getmraddresszd",
            data: {
                openid: n,
                id: a
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    mraddress: t
                })
            }
        })
    },
    getmyinfo: function() {
        var a = this,
            e = wx.getStorageSync("openid"),
            n = (a.data.jsdata, a.data.sfje),
            i = t.util.url("entry/wxapp/base", {
                m: "sudu8_page"
            });
        wx.request({
            url: i,
            success: function(t) {
                a.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                })
            },
            fail: function(a) {
                console.log(a)
            }
        });
        var d = t.util.url("entry/wxapp/mymoney", {
            m: "sudu8_page"
        });
        wx.request({
            url: d,
            data: {
                openid: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                a.setData({
                    money: t.data.data.money,
                    score: t.data.data.score
                })
            }
        });
        var s = t.util.url("entry/wxapp/mycoupon", {
            m: "sudu8_page"
        });
        wx.request({
            url: s,
            data: {
                openid: e
            },
            success: function(t) {
                a.setData({
                    couponlist: t.data.data
                })
            }
        });
        var o = t.util.url("entry/wxapp/yunfeiget", {
            m: "sudu8_page"
        });
        wx.request({
            url: o,
            success: function(t) {
                var e = t.data.data,
                    i = 0;
                i = a.data.sfje >= e.byou ? 0 : e.yfei, n = 1 * n + 1 * i, a.setData({
                    yunfei: i,
                    sfje: n
                }), a.getkuaidi()
            }
        })
    },
    qxyh: function() {
        var t, e = this,
            n = e.data.jqdjg;
        e.data.yhdq, "请选择" == n && (n = 0);
        var i = (100 * e.data.sfje + 100 * n) / 100;
        e.hideModal(), e.setData((a(t = {
            jqdjg: 0,
            yhqid: 0,
            sfje: i
        }, "jqdjg", "请选择"), a(t, "yhdq", 0), t))
    },
    getmoney: function(a) {
        var t = this,
            e = a.currentTarget.id,
            n = a.currentTarget.dataset.index,
            i = n.coupon.pay_money,
            d = t.data.sfje;
        d = 1 * d + 1 * t.data.yhdq;
        var s = t.data.yhqid;
        if (0 == s || n.id != s) if (1 * d < 1 * i) wx.showModal({
            title: "提示",
            content: "价格未满" + i + "元，不可使用该优惠券！",
            showCancel: !1
        });
        else {
            var o = 1 * d - 1 * e;
            o < 0 && (o = 0), t.setData({
                jqdjg: e,
                yhqid: n.id,
                sfje: o,
                oldsfje: d,
                yhdq: e
            }), t.hideModal()
        }
        n.id
    },
    submit: function() {
        var a = this,
            e = wx.getStorageSync("openid"),
            n = (a.data.id, a.data.jsdata);
        console.log(n);
        for (var i = [], d = 0; d < n.length; d++) {
            var s = {};
            s.baseinfo = n[d].baseinfo2.id, s.proinfo = n[d].proinfo.id, s.num = n[d].num, s.pvid = n[d].pvid, s.one_bili = n[d].one_bili, s.two_bili = n[d].two_bili, s.three_bili = n[d].three_bili, s.id = n[d].id, i.push(s)
        }
        e = wx.getStorageSync("openid");
        var o = a.data.yhqid,
            r = a.data.sfje,
            u = a.data.nav,
            c = a.data.yunfei,
            l = a.data.yfjian;
        c = c || 0;
        var p = a.data.shareid,
            f = a.data.dkscore,
            h = a.data.dkmoney,
            y = a.data.gwc;
        r -= l, c -= l;
        var g = a.data.mraddress,
            v = a.data.mjly;
        if ((null == g || 0 == g) && 1 == u) return wx.showModal({
            title: "提醒",
            content: "请先选择/设置地址！",
            showCancel: !1
        }), !1;
        if ((null == g || 0 == g) && 2 == u) return wx.showModal({
            title: "提醒",
            content: "请先选择/设置地址,方便店家联系你！",
            showCancel: !1
        }), !1;
        var w = g.id;
        if (0 == a.data.px) {
            var m = t.util.url("entry/wxapp/duosetorder", {
                m: "sudu8_page_plugin_pt"
            });
            wx.request({
                url: m,
                header: {
                    "content-type": "application/json"
                },
                data: {
                    openid: e,
                    jsdata: i,
                    couponid: o,
                    price: r,
                    dkscore: f,
                    address: w,
                    mjly: v,
                    nav: u,
                    gwc: y,
                    shareid: p
                },
                success: function(a) {
                    if (2 == a.data.data) wx.showModal({
                        title: "提醒",
                        content: "你是拼团发起人，不能参团",
                        showCancel: !1,
                        success: function() {
                            wx.reLaunch({
                                url: "/sudu8_page/index/index"
                            })
                        }
                    });
                    else if (3 == a.data.data) wx.showModal({
                        title: "提醒",
                        content: "你已参团，不能再次参团",
                        showCancel: !1,
                        success: function() {
                            wx.reLaunch({
                                url: "/sudu8_page/index/index"
                            })
                        }
                    });
                    else if (4 == a.data.data) wx.showModal({
                        title: "提醒",
                        content: "该团已满，无法参团",
                        showCancel: !1,
                        success: function() {
                            wx.reLaunch({
                                url: "/sudu8_page/index/index"
                            })
                        }
                    });
                    else {
                        var t = a.data.data;
                        wx.navigateTo({
                            url: "/sudu8_page_plugin_pt/order_do/order_do?orderid=" + t + "&dkmoney=" + h + "&dkscore=" + f + "&yunfei=" + c + "&shareid=" + p
                        })
                    }
                }
            })
        } else {
            var x = a.data.orderid;
            m = t.util.url("entry/wxapp/duoorderchangegg", {
                m: "sudu8_page_plugin_pt"
            }), t.util.request({
                url: m,
                header: {
                    "content-type": "application/json"
                },
                data: {
                    orderid: x,
                    couponid: o,
                    price: r,
                    dkscore: f,
                    address: g.id,
                    mjly: v,
                    nav: u
                },
                success: function(a) {
                    wx.navigateTo({
                        url: "/sudu8_page_plugin_pt/order_do/order_do?orderid=" + x + "&dkmoney=" + h + "&dkscore=" + f + "&yunfei=" + c + "&shareid=" + p
                    })
                }
            })
        }
    },
    mjly: function(a) {
        var t = a.detail.value;
        this.setData({
            mjly: t
        })
    },
    mend: function() {},
    makePhoneCallC: function(a) {
        var t = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: t
        })
    },
    tuanzyh: function() {
        var a = this,
            e = a.data.jsdata[0].pvid;
        console.log(e), t.util.request({
            url: "entry/wxapp/pttuanzyh",
            header: {
                "content-type": "application/json"
            },
            data: {
                id: e
            },
            success: function(t) {
                var e = t.data.data.tz_yh,
                    n = a.data.gwc,
                    i = a.data.sfje,
                    d = a.data.shareid,
                    s = 0;
                1 == n && 0 == d && (s = i - (i = (i * e / 10).toFixed(2)), a.setData({
                    tz_bl: e,
                    sfje: i,
                    youhl: s
                })), a.getmyinfo()
            }
        })
    }
});