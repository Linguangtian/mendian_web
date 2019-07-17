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
        this.getinfos(), wx.stopPullDownRefresh()
    },
    onLoad: function(a) {
        console.log(a);
        var e = this,
            n = a.shareid;
        e.setData({
            shareid: n
        });
        var d = a.id;
        null != d && e.setData({
            id: d
        }), wx.setNavigationBarTitle({
            title: e.data.title
        }), wx.getSystemInfo({
            success: function(a) {
                e.setData({
                    h: a.windowHeight
                })
            }
        });
        var s = a.addressid;
        console.log(s), s ? e.getmraddresszd(s) : e.getmraddress();
        var i = 0;
        a.fxsid && (i = a.fxsid, e.setData({
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
        if (r && "undefined" != r && null != r) {
            var u = wx.getStorageSync("openid");
            t.util.request({
                url: "entry/wxapp/getorderinfo",
                data: {
                    orderid: r,
                    openid: u
                },
                success: function(a) {
                    for (var t = a.data.data.jsondata, n = 0, d = 0, s = 0; s < t.length; s++) {
                        var i = t[s].num;
                        if (1 == (d = t[s].gmorpt)) var o = t[s].proinfo.price;
                        else o = t[s].proinfo.dprice;
                        n += 1 * o * (1 * i)
                    }
                    e.setData({
                        jsdata: a.data.data.jsondata,
                        jsprice: Math.round(100 * n) / 100,
                        sfje: n,
                        px: 1,
                        orderid: r,
                        gwc: d
                    }), e.tuanzyh()
                }
            })
        } else wx.getStorage({
            key: "jsdata",
            success: function(a) {
                for (var t = a.data, n = 0, d = 0, s = 0; s < t.length; s++) {
                    var i = t[s].num;
                    if (1 == (d = t[s].gmorpt)) var o = t[s].proinfo.price;
                    else o = t[s].proinfo.dprice;
                    n += 1 * o * (1 * i)
                }
                console.log(a.data), e.setData({
                    jsdata: a.data,
                    jsprice: Math.round(100 * n) / 100,
                    sfje: n,
                    px: 0,
                    gwc: d
                }), e.tuanzyh()
            }
        });
        t.util.getUserInfo(e.getinfos, i)
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link,
            n = a.currentTarget.dataset.linktype;
        t.util.redirectto(e, n)
    },
    getkuaidi: function() {
        var a = this,
            e = a.data.jsdata[0].pvid;
        t.util.request({
            url: "entry/wxapp/getkuaidi",
            data: {
                id: e
            },
            success: function(t) {
                0 == t.data.data ? a.setData({
                    nav: 1
                }) : a.setData({
                    nav: 2
                })
            }
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
        for (var e = this, n = a.detail.value, d = wx.getStorageSync("openid"), s = e.data.jsdata, i = e.data.sfje, o = 0, r = [], u = 0; u < s.length; u++) {
            var c = {};
            c.num = s[u].num, c.pvid = s[u].pvid, r.push(c)
        }
        1 == n ? t.util.request({
            url: "entry/wxapp/setgwcscore",
            data: {
                jsdata: JSON.stringify(r),
                openid: d
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var t = a.data.data;
                o = t.moneycl;
                var n = t.gzmoney,
                    d = t.gzscore;
                if (i < o && (o = parseInt(i)), 1 == e.data.use_yhq) {
                    var s = e.data.oldsfje,
                        r = e.data.yhj_pay_money;
                    Math.round(100 * (i - o)) / 100 < r && (i = s, e.qxyh())
                }
                var u = o * d / n;
                i = Math.round(100 * (i - o)) / 100, e.setData({
                    newsfje: i,
                    zf_type: e.data.money >= i ? 0 : 1,
                    sfje: i,
                    szmoney: o,
                    dkmoney: o,
                    dkscore: u,
                    jifen_u: 1
                })
            }
        }) : (o = e.data.szmoney, i += o, e.setData({
            newsfje: i,
            zf_type: e.data.money >= i ? 0 : 1,
            sfje: i,
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
            d = t.util.url("entry/wxapp/base", {
                m: "sudu8_page"
            });
        wx.request({
            url: d,
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
        var s = t.util.url("entry/wxapp/mymoney", {
            m: "sudu8_page"
        });
        wx.request({
            url: s,
            data: {
                openid: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(d) {
                a.setData({
                    money: parseFloat(d.data.data.money),
                    score: parseFloat(d.data.data.score)
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
                var i = t.util.url("entry/wxapp/yunfeiget", {
                    m: "sudu8_page"
                });
                wx.request({
                    url: i,
                    success: function(t) {
                        var e = t.data.data,
                            d = 0;
                        d = a.data.sfje >= e.byou ? 0 : e.yfei, n = Math.round(100 * (1 * n + 1 * d)) / 100, console.log(n), a.setData({
                            yunfei: d,
                            sfje: n,
                            zg_type: a.data.money >= n ? 0 : 1,
                            newsfje: a.data.money >= n ? n : Math.round(100 * (n - a.data.money)) / 100
                        }), console.log(a.data.newsfje), a.getkuaidi()
                    }
                })
            }
        })
    },
    qxyh: function() {
        var t, e = this,
            n = e.data.jqdjg;
        e.data.yhdq, "请选择" == n && (n = 0);
        var d = (100 * e.data.sfje + 100 * n) / 100;
        e.hideModal(), e.setData((a(t = {
            jqdjg: 0,
            yhqid: 0,
            sfje: d,
            newsfje: d
        }, "jqdjg", "请选择"), a(t, "yhdq", 0), t))
    },
    getmoney: function(a) {
        var t = this,
            e = a.currentTarget.id,
            n = a.currentTarget.dataset.index;
        console.log(n);
        var d = n.coupon.pay_money,
            s = t.data.sfje,
            i = t.data.yhdq;
        s = Math.round(100 * (1 * s + 1 * i)) / 100;
        var o = t.data.yhqid;
        if (0 == o || n.id != o) if (1 * s < 1 * d) wx.showModal({
            title: "提示",
            content: "价格未满" + d + "元，不可使用该优惠券！",
            showCancel: !1
        });
        else {
            var r = Math.round(100 * (1 * s - 1 * e)) / 100;
            r < 0 && (r = 0), t.setData({
                jqdjg: e,
                yhqid: n.id,
                sfje: r,
                newsfje: r,
                oldsfje: s,
                yhdq: e,
                yhj_pay_money: d,
                use_yhq: 1
            }), t.hideModal()
        }
        n.id
    },
    submit: function() {
        var a = this,
            e = wx.getStorageSync("openid"),
            n = a.data.jsdata;
        n[0].pvid, console.log(n);
        for (var d = [], s = 0; s < n.length; s++) {
            var i = {};
            i.baseinfo = n[s].baseinfo2.id, i.proinfo = n[s].proinfo.id, i.num = n[s].num, i.pvid = n[s].pvid, i.one_bili = n[s].one_bili, i.two_bili = n[s].two_bili, i.three_bili = n[s].three_bili, i.id = n[s].id, d.push(i)
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
            w = a.data.mjly;
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
        var v = g.id;
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
                    jsdata: d,
                    couponid: o,
                    price: r,
                    dkscore: f,
                    address: v,
                    mjly: w,
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
                    mjly: w,
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
        t.util.request({
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
                    d = a.data.sfje,
                    s = a.data.shareid,
                    i = d,
                    o = 0;
                1 == n && 0 == s && (d = (d * e / 10).toFixed(2), o = Math.round(100 * (1 * i - 1 * d)) / 100, a.setData({
                    tz_bl: e,
                    sfje: d,
                    youhl: o
                })), a.getmyinfo()
            }
        })
    }
});