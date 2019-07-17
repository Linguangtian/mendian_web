/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:15*/
var a, t = getApp();
Page({
    data: {
        imgUrls: [],
        indicatorDots: !0,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3
    },
    onPullDownRefresh: function() {
        this.getinfos()
    },
    onLoad: function(a) {
        var e = this,
            o = a.shareid;
        e.setData({
            shareid: o
        }), e.getpingt();
        var i = t.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: i,
            data: {
                vs1: 1
            },
            success: function(a) {
                e.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarTitle({
                    title: e.data.baseinfo.name
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                })
            },
            fail: function(a) {
                console.log(a)
            }
        });
        var s = 0;
        a.fxsid && (s = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), t.util.getUserInfo(e.getinfos, s)
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
    daojishi: function() {
        var t, e, o, i, s, r = this,
            n = r.data.overtime,
            d = (new Date).getTime(),
            u = 1e3 * parseInt(n) - d;
        0 == u && clearInterval(a), 0 <= u ? (e = Math.floor(u / 1e3 / 60 / 60 / 24), o = Math.floor(u / 1e3 / 60 / 60 % 24) < 10 ? "0" + Math.floor(u / 1e3 / 60 / 60 % 24) : Math.floor(u / 1e3 / 60 / 60 % 24), i = Math.floor(u / 1e3 / 60 % 60) < 10 ? "0" + Math.floor(u / 1e3 / 60 % 60) : Math.floor(u / 1e3 / 60 % 60), s = Math.floor(u / 1e3 % 60) < 10 ? "0" + Math.floor(u / 1e3 % 60) : Math.floor(u / 1e3 % 60)) : s = i = o = e = 0, t = e + "天" + o + ":" + i + ":" + s, r.setData({
            daojishi: t
        }), a = setTimeout(function() {
            r.daojishi()
        }, 1e3)
    },
    ptorder: function() {
        wx.navigateTo({
            url: "/sudu8_page_plugin_pt/orderlist/orderlist"
        })
    },
    getpingt: function() {
        var a = this,
            e = a.data.shareid;
        t.util.request({
            url: "entry/wxapp/pingtuan",
            data: {
                shareid: e
            },
            success: function(t) {
                for (var e = t.data.data.products, o = t.data.data.lists, i = (t.data.data.share, t.data.data.products.pt_min), s = t.data.data.products.pt_max, r = o.length, n = {
                    infoimg: "/sudu8_page/resource/img/pe.png"
                }, d = [], u = 0; u < s; u++) o[u] ? d.push(o[u]) : d.push(n);
                a.setData({
                    products: e,
                    lists: d,
                    min: i,
                    max: s,
                    now: r,
                    overtime: t.data.data.overtime,
                    labels: t.data.data.labels
                }), a.daojishi()
            }
        })
    },
    onShareAppMessage: function() {
        var a = this.data.shareid,
            t = this.data.products,
            e = "/sudu8_page_plugin_pt/products/products?shareid=" + a + "&id=" + t.id;
        return console.log(e), {
            title: t.title,
            path: e
        }
    }
});