/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:15*/
var t, a = getApp();
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
    onLoad: function(t) {
        var e = this,
            o = t.shareid;
        e.setData({
            shareid: o
        }), e.getpingt();
        var i = a.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: i,
            data: {
                vs1: 1
            },
            success: function(t) {
                e.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarTitle({
                    title: e.data.baseinfo.name
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                })
            },
            fail: function(t) {
                console.log(t)
            }
        });
        var s = 0;
        t.fxsid && (s = t.fxsid, e.setData({
            fxsid: t.fxsid
        })), a.util.getUserInfo(e.getinfos, s)
    },
    redirectto: function(t) {
        var e = t.currentTarget.dataset.link,
            o = t.currentTarget.dataset.linktype;
        a.util.redirectto(e, o)
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                })
            }
        })
    },
    daojishi: function() {
        var a, e, o, i, s, r = this,
            n = r.data.overtime,
            d = (new Date).getTime(),
            u = 1e3 * parseInt(n) - d;
        0 == u && clearInterval(t), 0 <= u ? (e = Math.floor(u / 1e3 / 60 / 60 / 24), o = Math.floor(u / 1e3 / 60 / 60 % 24) < 10 ? "0" + Math.floor(u / 1e3 / 60 / 60 % 24) : Math.floor(u / 1e3 / 60 / 60 % 24), i = Math.floor(u / 1e3 / 60 % 60) < 10 ? "0" + Math.floor(u / 1e3 / 60 % 60) : Math.floor(u / 1e3 / 60 % 60), s = Math.floor(u / 1e3 % 60) < 10 ? "0" + Math.floor(u / 1e3 % 60) : Math.floor(u / 1e3 % 60)) : s = i = o = e = 0, a = e + "天" + o + ":" + i + ":" + s, r.setData({
            daojishi: a
        }), t = setTimeout(function() {
            r.daojishi()
        }, 1e3)
    },
    ptorder: function() {
        wx.navigateTo({
            url: "/sudu8_page_plugin_pt/orderlist/orderlist"
        })
    },
    getpingt: function() {
        var t = this,
            e = t.data.shareid;
        a.util.request({
            url: "entry/wxapp/pingtuan",
            data: {
                shareid: e
            },
            success: function(a) {
                for (var e = a.data.data.products, o = a.data.data.lists, i = (a.data.data.share, a.data.data.products.pt_min), s = a.data.data.products.pt_max, r = o.length, n = {
                    infoimg: "/sudu8_page/resource/img/pe.png"
                }, d = [], u = 0; u < s; u++) o[u] ? d.push(o[u]) : d.push(n);
                t.setData({
                    products: e,
                    lists: d,
                    min: i,
                    max: s,
                    now: r,
                    overtime: a.data.data.overtime,
                    labels: a.data.data.labels
                }), t.daojishi()
            }
        })
    },
    onShareAppMessage: function() {
        var t = this.data.shareid,
            a = this.data.products,
            e = "/sudu8_page_plugin_pt/products/products?shareid=" + t + "&id=" + a.id;
        return console.log(e), {
            title: a.title,
            path: e
        }
    }
});