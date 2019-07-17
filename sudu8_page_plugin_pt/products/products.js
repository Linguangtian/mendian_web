/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:15*/
var t, a = require("../../sudu8_page/resource/wxParse/wxParse.js"),
    e = getApp();
Page({
    data: {
        imgUrls: [],
        indicatorDots: !0,
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        circular: !0,
        num: 1,
        sc: 0,
        guige: 0,
        protab: 1,
        gwc: 1,
        gm: 0,
        foot: 1,
        nowcon: "con",
        is_comment: 0,
        comments: 2,
        share: 0,
        u_gwc: 0,
        xzarr: [],
        gwccount: 0,
        overtime: [],
        daojishi: [],
        heighthave: 0
    },
    onPullDownRefresh: function() {
        this.getinfos()
    },
    onLoad: function(t) {
        var a = this,
            i = 0;
        t.fxsid && (i = t.fxsid, a.setData({
            fxsid: t.fxsid
        }));
        var o = t.id,
            n = t.shareid;
        n ? a.gwc_100() : n = 0, a.setData({
            id: o,
            shareid: n
        });
        var s = e.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: s,
            data: {
                vs1: 1
            },
            success: function(t) {
                a.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                })
            }
        }), e.util.getUserInfo(a.getinfos, i)
    },
    redirectto: function(t) {
        var a = t.currentTarget.dataset.link,
            i = t.currentTarget.dataset.linktype;
        e.util.redirectto(a, i)
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                }), t.getPro()
            }
        })
    },
    swiperLoad: function(t) {
        var a = this;
        wx.getSystemInfo({
            success: function(e) {
                var i = t.detail.width / t.detail.height,
                    o = e.windowWidth / i;
                a.data.heighthave || a.setData({
                    minHeight: o,
                    heighthave: 1
                })
            }
        })
    },
    getPro: function() {
        var t = this,
            i = (t.data.fxsid, t.data.openid),
            o = t.data.id,
            n = e.util.url("entry/wxapp/globaluserinfo", {
                m: "sudu8_page"
            });
        wx.request({
            url: n,
            data: {
                openid: i
            },
            success: function(a) {
                t.setData({
                    globaluser: a.data.data
                }), wx.stopPullDownRefresh()
            }
        }), e.util.request({
            url: "entry/wxapp/Ptproductinfo",
            data: {
                id: o,
                openid: i
            },
            success: function(e) {
                console.log(e), wx.setNavigationBarTitle({
                    title: e.data.data.products.title
                });
                var i = e.data.data,
                    o = i.products,
                    n = i.pingtuan,
                    s = i.overtime,
                    r = i.pingtcount;
                1 == i.collect ? t.setData({
                    sc: 1
                }) : t.setData({
                    sc: 0
                }), t.daojishi(), t.setData({
                    products: o,
                    pintuan: n,
                    imgUrls: o.imgtext,
                    guiz: i.guiz,
                    overtime: s,
                    pingtcount: r
                }), a.wxParse("content", "html", o.texts, t, 5);
                for (var u = i.grouparr, d = "", c = 0; c < u.length; c++) d += u[c] + "、";
                var g = d.substring(0, d.length - 1);
                t.setData({
                    strgrouparr: g,
                    grouparr: u
                });
                var l = i.grouparr_val;
                console.log(l), t.setData({
                    gzjson: l
                }), t.getproinfo()
            }
        })
    },
    daojishi: function() {
        for (var a = this, e = a.data.overtime, i = [], o = 0; o < e.length; o++) {
            var n, s, r, u, d = (new Date).getTime(),
                c = 1e3 * parseInt(e[o]) - d;
            0 <= c && (n = Math.floor(c / 1e3 / 60 / 60 / 24), s = Math.floor(c / 1e3 / 60 / 60 % 24) < 10 ? "0" + Math.floor(c / 1e3 / 60 / 60 % 24) : Math.floor(c / 1e3 / 60 / 60 % 24), r = Math.floor(c / 1e3 / 60 % 60) < 10 ? "0" + Math.floor(c / 1e3 / 60 % 60) : Math.floor(c / 1e3 / 60 % 60), u = Math.floor(c / 1e3 % 60) < 10 ? "0" + Math.floor(c / 1e3 % 60) : Math.floor(c / 1e3 % 60)), i[o] = n + "天" + s + ":" + r + ":" + u
        }
        a.setData({
            daojishi: i
        }), t = setTimeout(function() {
            a.daojishi()
        }, 1e3)
    },
    onShareAppMessage: function() {
        var t = wx.getStorageSync("openid"),
            a = this.data.products,
            e = this.data.id,
            i = "";
        return i = 1 == this.data.globaluser.fxs ? "/sudu8_page_plugin_pt/products/products?id=" + e : "/sudu8_page_plugin_pt/products/products?id=" + e + "&fxsid=" + t, {
            title: a.title,
            path: i
        }
    },
    share111: function() {
        this.setData({
            share: 1
        })
    },
    share_close: function() {
        this.setData({
            share: 0
        })
    },
    pinglun: function(t) {
        this.setData({
            pinglun_t: t.detail.value
        })
    },
    pinglun_sub: function() {
        var t = this.data.pinglun_t,
            a = this.data.id,
            i = wx.getStorageSync("openid");
        if ("" == t || null == t) return wx.showModal({
            content: "评论不能为空"
        }), !1;
        e.util.request({
            url: "entry/wxapp/comment",
            cachetime: "30",
            data: {
                pinglun_t: t,
                id: a,
                openid: i
            },
            success: function(t) {
                console.log(t), 1 == t.data.data.result && (wx.showToast({
                    title: "评价提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "/sudu8_page_plugin_pt/products/products?id=" + a
                    })
                }, 2e3))
            }
        })
    },
    tabChange: function(t) {
        var a = t.currentTarget.dataset.id;
        this.setData({
            nowcon: a
        })
    },
    num_add: function() {
        var t = this.data.proinfo.kc,
            a = this.data.num;
        t < (a += 1) && (wx.showModal({
            title: "提醒",
            content: "您的购买数量超过了库存！",
            showCancel: !1
        }), a--), this.setData({
            num: a
        })
    },
    num_jian: function() {
        var t = this.data.num;
        1 == t ? this.setData({
            num: 1
        }) : (t -= 1, this.setData({
            num: t
        }))
    },
    gm: function() {
        wx.navigateTo({
            url: "/pages/order/order"
        })
    },
    gwc_close: function() {
        this.setData({
            gwc_block: 0
        })
    },
    gwc_block: function() {
        this.setData({
            gwc_block: 1
        })
    },
    gwc_100: function() {
        this.setData({
            gwc: 1,
            gm: 0,
            guige: 1,
            foot: 0
        })
    },
    gm_100: function() {
        this.setData({
            gwc: 0,
            gm: 1,
            guige: 1,
            foot: 0
        })
    },
    guige_block: function() {
        this.setData({
            guige: 1,
            gwc: 1,
            gm: 0
        })
    },
    guige_hidden: function() {
        this.setData({
            guige: 0
        })
    },
    color_change: function(t) {},
    collect: function() {
        var t = this.data.sc;
        0 == t ? wx.showLoading({
            title: "收藏中"
        }) : wx.showLoading({
            title: "取消收藏中"
        }), this.collects(t)
    },
    collects: function(t) {
        var a = this;
        wx.request({
            url: a.data.baseurl + "doPageCollect",
            cachetime: "30",
            data: {
                uniacid: a.data.uniacid,
                id: a.data.id,
                openid: wx.getStorageSync("openid"),
                types: "pt"
            },
            success: function(e) {
                1 == t ? a.setData({
                    sc: 0
                }) : a.setData({
                    sc: 1
                }), setTimeout(function() {
                    wx.showToast({
                        title: e.data.data,
                        icon: "success",
                        duration: 2e3,
                        success: function() {
                            wx.hideLoading()
                        }
                    })
                }, 2e3)
            }
        })
    },
    changepro: function(t) {
        var a = t.currentTarget.dataset.id,
            e = (this.data.grouparr, t.currentTarget.dataset.index),
            i = this.data.gzjson;
        i[a].ck = e, this.setData({
            gzjson: i
        }), this.getproinfo()
    },
    getproinfo: function() {
        for (var t = this, a = t.data.gzjson, i = t.data.grouparr, o = t.data.id, n = "", s = 0; s < i.length; s++) n += a[i[s]].val[a[i[s]].ck] + "\\";
        var r = n.substring(0, n.length - 1);
        e.util.request({
            url: "entry/wxapp/ptpinfo",
            data: {
                str: r,
                id: o
            },
            success: function(a) {
                var e = a.data.data;
                t.setData({
                    proinfo: e.proinfo,
                    baseinfo2: e.baseinfo,
                    newstr: r
                })
            }
        })
    },
    gmget: function() {
        var a = this,
            e = a.data.proinfo,
            i = a.data.num,
            o = a.data.products,
            n = a.data.baseinfo2,
            s = a.data.gwc,
            r = a.data.shareid,
            u = a.data.guiz;
        if (0 == e.kc) return wx.showModal({
            title: "提醒",
            content: "您来晚了，已经卖完了！",
            showCancel: !1
        }), !1;
        for (var d = e.comment.split(","), c = "", g = 0; g < d.length; g++) {
            var l = g + 1;
            c += d[g] + ":" + e["type" + l] + ","
        }
        if (c = c.substring(0, c.length - 1), e.ggz = c, 1 == s) var h = 1 * e.price * i;
        else h = 1 * e.dprice * i;
        var p = {};
        p.cid = n.cid, p.id = n.id, p.title = n.title, p.thumb = n.thumb, o.baseinfo2 = p, o.proinfo = e, o.num = i, o.pvid = e.pid, o.one_bili = u.one_bili, o.two_bili = u.two_bili, o.three_bili = u.three_bili, o.gmorpt = s;
        var f = [];
        f.push(o), wx.setStorage({
            key: "jsdata",
            data: f
        }), wx.setStorage({
            key: "jsprice",
            data: h
        }), clearInterval(t), wx.navigateTo({
            url: "/sudu8_page_plugin_pt/order/order?shareid=" + r + "&id=" + a.data.id
        })
    },
    lijct: function(a) {
        var i = this,
            o = a.currentTarget.dataset.index,
            n = wx.getStorageSync("openid");
        e.util.request({
            url: "entry/wxapp/pdmytuanorcy",
            data: {
                shareid: o,
                openid: n
            },
            success: function(a) {
                1 == a.data.data ? (clearInterval(t), wx.navigateTo({
                    url: "/sudu8_page_plugin_pt/pt/pt?shareid=" + o
                })) : (i.gwc_100(), i.setData({
                    shareid: o
                }))
            }
        })
    }
});