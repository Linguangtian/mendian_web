var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        imgUrls: [],
        num: 1,
        indicatorDots: !0,
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        circular: !0,
        sc: 0,
        guige: 0,
        protab: 1,
        foot: 1,
        nowcon: "con",
        is_comment: 0,
        comments: 2,
        share: 0,
        u_gwc: 0,
        xzarr: [],
        gwccount: 0,
        products: [ {
            xsl: 0
        } ],
        fxsid: 0,
        heighthave: 0,
        minHeight: 220,
        shareHome: 0
    },
    onPullDownRefresh: function() {
        var t = this;
        t.data.id;
        t.getPro(), t.gwcdata();
    },
    onLoad: function(t) {
        var a = this, e = t.id;
        a.setData({
            id: e
        });
        var o = 0;
        t.fxsid && (o = t.fxsid, a.setData({
            fxsid: t.fxsid,
            shareHome: 1
        })), t.userid && a.setData({
            userid: t.userid
        }), app.util.request({
            url: "entry/wxapp/BaseMin",
            data: {
                vs1: 1
            },
            success: function(t) {
                a.setData({
                    commbase: t.data.data
                }), console.log(a.data.commbase), wx.setNavigationBarTitle({
                    title: a.data.commbase.name
                }), wx.setNavigationBarColor({
                    frontColor: a.data.commbase.base_tcolor,
                    backgroundColor: a.data.commbase.base_color
                });
            }
        }), app.util.getUserInfo(a.getinfos, o);
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
                }), a.getPro(), a.gwcdata(), a.givepscore();
            }
        });
    },
    getPro: function() {
        var c = this, t = c.data.fxsid, a = c.data.openid, e = c.data.id;
        app.util.request({
            url: "entry/wxapp/globaluserinfo",
            data: {
                openid: a
            },
            success: function(t) {
                c.setData({
                    globaluser: t.data.data
                }), wx.stopPullDownRefresh();
            }
        }), app.util.request({
            url: "entry/wxapp/duoproducts",
            data: {
                id: e,
                fxsid: t,
                openid: a
            },
            success: function(t) {
                console.log(t);
                var a = t.data.data, e = a.products;
                wx.setNavigationBarTitle({
                    title: e.title
                }), c.setData({
                    products: e,
                    imgUrls: e.imgtext,
                    guiz: a.guiz
                }), e.texts && WxParse.wxParse("content", "html", e.texts, c, 5);
                for (var o = a.grouparr, s = "", i = 0; i < o.length; i++) s += o[i] + "、";
                var n = s.substring(0, s.length - 1);
                c.setData({
                    strgrouparr: n,
                    grouparr: o
                });
                var r = a.grouparr_val;
                c.setData({
                    gzjson: r
                }), 1 == a.shouc ? c.setData({
                    sc: 0
                }) : c.setData({
                    sc: 1
                }), c.getproinfo(), c.gwcdata();
            }
        });
    },
    swiperLoad: function(o) {
        var s = this;
        wx.getSystemInfo({
            success: function(t) {
                var a = o.detail.width / o.detail.height, e = t.windowWidth / a;
                s.data.heighthave || s.setData({
                    minHeight: e,
                    heighthave: 1
                });
            }
        });
    },
    onShareAppMessage: function() {
        var t = this, a = wx.getStorageSync("openid"), e = t.data.products, o = t.data.id, s = "";
        return s = 1 == t.data.globaluser.fxs ? "/sudu8_page/showProMore/showProMore?id=" + o + "&userid=" + a : "/sudu8_page/showProMore/showProMore?id=" + o + "&userid=" + a + "&fxsid=" + a, 
        console.log(s), {
            title: e.title,
            path: s,
            imageUrl: t.data.products.shareimg
        };
    },
    share111: function() {
        this.setData({
            share: 1
        });
    },
    share_close: function() {
        this.setData({
            share: 0
        });
    },
    poster: function() {
        wx.navigateTo({
            url: "/sudu8_page/poster/poster"
        });
    },
    pinglun: function(t) {
        console.log(t);
        this.setData({
            pinglun_t: t.detail.value
        });
    },
    pinglun_sub: function() {
        var t = this.data.pinglun_t, a = this.data.id, e = wx.getStorageSync("openid");
        if ("" == t || null == t) return wx.showModal({
            content: "评论不能为空"
        }), !1;
        app.util.request({
            url: "entry/wxapp/comment",
            cachetime: "30",
            data: {
                pinglun_t: t,
                id: a,
                openid: e
            },
            success: function(t) {
                console.log(t), 1 == t.data.data.result && (wx.showToast({
                    title: "评价提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "/sudu8_page/showArt/showArt?id=" + a
                    });
                }, 2e3));
            }
        });
    },
    tabChange: function(t) {
        var a = t.currentTarget.dataset.id;
        this.setData({
            nowcon: a
        });
    },
    num_add: function() {
        var t = this.data.proinfo.kc, a = this.data.num;
        t < (a += 1) && (wx.showModal({
            title: "提醒",
            content: "您的购买数量超过了库存！",
            showCancel: !1
        }), a--), this.setData({
            num: a
        });
    },
    num_jian: function() {
        var t = this.data.num;
        1 == t ? this.setData({
            num: 1
        }) : (t -= 1, this.setData({
            num: t
        }));
    },
    gwc_close: function() {
        this.setData({
            gwc_block: 0
        });
    },
    gwc_block: function() {
        this.setData({
            gwc_block: 1
        });
    },
    gwc_100: function() {
        this.setData({
            gwc: 1,
            gm: 0,
            guige: 1,
            foot: 0
        });
    },
    gm_100: function() {
        this.setData({
            gwc: 0,
            gm: 1,
            guige: 1,
            foot: 0
        });
    },
    guige_block: function() {
        console.log(233);
        this.setData({
            guige: 1,
            gwc: 1,
            gm: 0
        });
    },
    guige_hidden: function() {
        this.setData({
            guige: 0
        });
    },
    color_change: function(t) {},
    collect: function() {
        var e = this, t = e.data.sc, a = e.data.id, o = wx.getStorageSync("openid");
        0 == t ? (wx.showLoading({
            title: "收藏中"
        }), console.log(123), app.util.request({
            url: "entry/wxapp/Collect",
            data: {
                openid: o,
                types: "showProMore",
                id: a
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                var a = t.data.data;
                "收藏成功" == a ? e.setData({
                    sc: 1
                }) : e.setData({
                    sc: 0
                }), wx.showToast({
                    title: a,
                    icon: "succes",
                    duration: 1e3,
                    mask: !0
                });
            }
        })) : (wx.showLoading({
            title: "取消收藏中"
        }), app.util.request({
            url: "entry/wxapp/Collect",
            data: {
                openid: o,
                types: "showProMore",
                id: a
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                var a = t.data.data;
                "取消收藏成功" == a ? e.setData({
                    sc: 0
                }) : e.setData({
                    sc: 1
                }), wx.showToast({
                    title: a,
                    icon: "succes",
                    duration: 1e3,
                    mask: !0
                });
            }
        })), setTimeout(function() {
            wx.hideLoading();
        }, 1e3);
    },
    changepro: function(t) {
        var a = t.currentTarget.dataset.id, e = (this.data.grouparr, t.currentTarget.dataset.index), o = this.data.gzjson;
        o[a].ck = e, this.setData({
            gzjson: o
        }), this.getproinfo();
    },
    getproinfo: function() {
        for (var e = this, t = e.data.gzjson, a = e.data.grouparr, o = "", s = e.data.id, i = 0; i < a.length; i++) {
            o += t[a[i]].val[t[a[i]].ck] + "|";
        }
        var n = o.substring(0, o.length - 1);
        app.util.request({
            url: "entry/wxapp/duoproductsinfoNew",
            data: {
                str: n,
                id: s
            },
            success: function(t) {
                var a = t.data.data;
                console.log(t.data.data), e.setData({
                    proinfo: a.proinfo,
                    baseinfo: a.baseinfo,
                    newstr: n
                });
            }
        });
    },
    gwcget: function() {
        var a = this, t = a.data.proinfo, e = a.data.num, o = wx.getStorageSync("openid");
        if (0 == t.kc) return wx.showModal({
            title: "提醒",
            content: "您来晚了，已经卖完了！",
            showCancel: !1
        }), !1;
        app.util.request({
            url: "entry/wxapp/gwcadd",
            data: {
                openid: o,
                id: t.id,
                prokc: e
            },
            success: function(t) {
                wx.showToast({
                    title: "加入成功",
                    icon: "success",
                    duration: 2e3,
                    success: function() {
                        a.guige_hidden(), a.gwcdata();
                    }
                });
            }
        });
    },
    gmget: function() {
        var t = this, a = t.data.proinfo, e = t.data.num, o = t.data.products, s = t.data.baseinfo, i = t.data.guiz;
        if (0 == a.kc) return wx.showModal({
            title: "提醒",
            content: "您来晚了，已经卖完了！",
            showCancel: !1
        }), !1;
        for (var n = a.comment.split(","), r = "", c = 0; c < n.length; c++) {
            var u = c + 1;
            r += n[c] + ":" + a["type" + u] + ",";
        }
        r = r.substring(0, r.length - 1);
        a.ggz = r;
        var d = 1 * a.price * e, g = {};
        g.cid = s.cid, g.id = s.id, g.title = s.title, g.thumb = s.thumb, o.baseinfo = g, 
        o.proinfo = a, o.num = e, o.pvid = a.pid, o.one_bili = i.one_bili, o.two_bili = i.two_bili, 
        o.three_bili = i.three_bili;
        var l = [];
        l.push(o), wx.setStorage({
            key: "jsdata",
            data: l
        }), wx.setStorage({
            key: "jsprice",
            data: d
        }), wx.navigateTo({
            url: "/sudu8_page/order_more/order_more"
        });
    },
    gwcdata: function() {
        var a = this, t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/gwcdata",
            data: {
                openid: t
            },
            success: function(t) {
                a.setData({
                    gwccount: t.data.data
                });
            }
        });
    },
    givepscore: function() {
        var t = this.data.id, a = this.data.userid, e = wx.getStorageSync("openid");
        a != e && 0 != a && "" != a && app.util.request({
            url: "entry/wxapp/giveposcore",
            data: {
                id: t,
                types: "showProMore",
                openid: e,
                fxsid: a
            },
            success: function(t) {}
        });
    }
});