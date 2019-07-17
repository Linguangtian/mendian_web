var app = getApp();

Page({
    data: {
        allprice: 0,
        allxuanz: 0,
        page_signs: "/sudu8_page/gwc/gwc"
    },
    onPullDownRefresh: function() {
        this.getmygwc();
    },
    onLoad: function(t) {
        var e = this;
        wx.getSystemInfo({
            success: function(t) {
                var a = t.windowHeight - 100;
                e.setData({
                    h: t.windowHeight,
                    list_h: a
                });
            }
        });
        var a = 0;
        t.fxsid && (a = t.fxsid, e.setData({
            fxsid: t.fxsid
        })), app.util.request({
            url: "entry/wxapp/baseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(t) {
                e.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            }
        }), app.util.getUserInfo(e.getinfos, a);
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
                }), a.getmygwc();
            }
        });
    },
    getmygwc: function() {
        var n = this;
        wx.setNavigationBarTitle({
            title: "购物车"
        });
        var t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/getmygwc",
            data: {
                openid: t
            },
            success: function(t) {
                console.log(t);
                for (var a = t.data.data, e = 0; e < a.length; e++) a[e].total_price = Math.round(a[e].num * a[e].proinfo.price * 100) / 100;
                n.setData({
                    mygwc: a
                }), n.allxuanz();
            }
        });
    },
    xuanz: function(t) {
        var a = this, e = t.currentTarget.dataset.index, n = (t.currentTarget.dataset.id, 
        t.currentTarget.dataset.num, t.currentTarget.dataset.price), r = a.data.mygwc, i = a.data.allprice;
        0 == r[e].ck ? (r[e].ck = 1, i += n) : (r[e].ck = 0, i = Math.round(100 * (i - n)) / 100, 
        a.setData({
            allxuanz: 0
        })), a.setData({
            mygwc: r,
            allprice: i
        });
    },
    allxuanz: function() {
        var t = this, a = t.data.allxuanz, e = t.data.mygwc, n = t.data.allprice;
        if (1 == a) for (var r = a = 0; r < e.length; r++) n -= Math.round(e[r].num * e[r].proinfo.price * 100) / 100, 
        e[r].ck = 0; else {
            a = 1;
            for (r = n = 0; r < e.length; r++) n += Math.round(e[r].num * e[r].proinfo.price * 100) / 100, 
            e[r].ck = 1;
        }
        t.setData({
            allxuanz: a,
            allprice: n,
            mygwc: e
        });
    },
    addbtn: function(t) {
        var n = this, a = t.currentTarget.dataset.index, r = n.data.mygwc, e = r[a].num, i = r[a].proinfo.kc, c = r[a].id;
        i < ++e && (wx.showModal({
            title: "提醒",
            content: "您的购买数量超过了库存！",
            showCancel: !1
        }), e--), r[a].num = e, r[a].total_price = Math.round(r[a].proinfo.price * e * 100) / 100, 
        r[a].ck = 1, app.util.request({
            url: "entry/wxapp/duogwcchange",
            data: {
                id: c,
                num: e
            },
            success: function(t) {
                for (var a = 0, e = 0; e < r.length; e++) a += Math.round(r[e].num * r[e].proinfo.price * 100) / 100;
                n.setData({
                    mygwc: r,
                    allprice: a
                });
            }
        });
    },
    delbtn: function(t) {
        var n = this, a = t.currentTarget.dataset.index, r = n.data.mygwc, e = r[a].num, i = (r[a].proinfo.kc, 
        r[a].id);
        0 == --e && e++, r[a].num = e, r[a].total_price = Math.round(r[a].proinfo.price * e * 100) / 100, 
        r[a].ck = 1, app.util.request({
            url: "entry/wxapp/duogwcchange",
            data: {
                id: i,
                num: e
            },
            success: function(t) {
                for (var a = 0, e = 0; e < r.length; e++) a += Math.round(r[e].num * r[e].proinfo.price * 100) / 100;
                n.setData({
                    mygwc: r,
                    allprice: a
                });
            }
        });
    },
    deldata: function(t) {
        var n = this, a = t.currentTarget.dataset.id, r = t.currentTarget.dataset.index, i = n.data.mygwc;
        wx.showModal({
            title: "提醒",
            content: "您确定要删除该商品？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/delmygwc",
                    data: {
                        id: a
                    },
                    success: function(t) {
                        i.splice(r, 1);
                        for (var a = 0, e = 0; e < i.length; e++) a += Math.round(i[e].num * i[e].proinfo.price * 100) / 100;
                        n.setData({
                            mygwc: i,
                            allprice: a
                        });
                    }
                });
            }
        });
    },
    jiesuan: function(t) {
        var a = this.data.mygwc, e = this.data.allprice;
        if (0 == e) return wx.showModal({
            title: "提醒",
            content: "请先选择结算的商品！",
            showCancel: !1
        }), !1;
        for (var n = [], r = 0; r < a.length; r++) 1 == a[r].ck && n.push(a[r]);
        wx.setStorage({
            key: "jsdata",
            data: n
        }), wx.setStorage({
            key: "jsprice",
            data: e
        }), wx.navigateTo({
            url: "/sudu8_page/order_more/order_more"
        });
    }
});