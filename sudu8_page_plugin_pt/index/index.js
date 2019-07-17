/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:15*/
var t = getApp();
Page({
    data: {
        page_signs: "/sudu8_page_plugin_pt/index/index",
        imgUrls: [],
        indicatorDots: !0,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        styles: 4
    },
    onPullDownRefresh: function() {
        this.getinfos(), wx.stopPullDownRefresh()
    },
    onLoad: function(a) {
        var e = this,
            s = 0;
        a.fxsid && (s = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), e.setData({
            msgList: [{
                src: "/image/about1.jpg",
                title: "秒杀了"
            }, {
                src: "/image/about1.jpg",
                title: "秒杀了"
            }, {
                src: "/image/about1.jpg",
                title: "秒杀了"
            }],
            msgList2: [{
                title: "限时秒杀，过时即涨"
            }, {
                title: "更多好货，不在错过"
            }, {
                title: "开枪预约，不在错过"
            }]
        }), wx.setNavigationBarTitle({
            title: "拼团首页"
        });
        var i = 3600;
        setInterval(function() {
            if (0 <= i) {
                var t = e.dateformat(i);
                e.setData({
                    sytime: t
                }), i--
            }
        }, 1e3);
        var r = t.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: r,
            data: {
                vs1: 1
            },
            success: function(t) {
                console.log(t), e.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                }), e.getpro()
            },
            fail: function(t) {
                console.log(t)
            }
        }), t.util.getUserInfo(e.getinfos, s)
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link,
            s = a.currentTarget.dataset.linktype;
        t.util.redirectto(e, s)
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
    onShareAppMessage: function() {
        return {
            title: "拼团商城"
        }
    },
    dateformat: function(t) {
        var a = Math.floor(t);
        if (86400 < a) var e = parseInt(a / 86400 / 24);
        else e = 0;
        e < 10 && (e = "0" + e);
        var s = Math.floor(a / 3600 % 24);
        s < 10 && (s = "0" + s);
        var i = Math.floor(a / 60 % 60);
        i < 10 && (i = "0" + i);
        var r = Math.floor(a % 60);
        return r < 10 && (r = "0" + r), this.setData({
            day: e,
            hr: s,
            min: i,
            sec: r
        }), s + "小时" + i + "分钟" + r + "秒"
    },
    getpro: function() {
        var a = this;
        t.util.request({
            url: "entry/wxapp/ptprolist",
            success: function(t) {
                var e = t.data.data,
                    s = (e.guiz, e.cate[0].id);
                a.sandcid(s)
            }
        })
    },
    sandcid: function(a) {
        var e = this;
        t.util.request({
            url: "entry/wxapp/ptprolist",
            data: {
                cate: a
            },
            success: function(t) {
                var a = t.data.data,
                    s = a.guiz,
                    i = a.cate[0].id;
                e.setData({
                    lists: a.lists,
                    styles: s.types,
                    cate: a.cate,
                    cid: i
                })
            }
        })
    },
    handleTap: function(a) {
        var e = a.currentTarget.dataset.id,
            s = this;
        t.util.request({
            url: "entry/wxapp/ptprolist",
            data: {
                cate: e
            },
            success: function(t) {
                var a = t.data.data,
                    i = a.guiz;
                console.log(a), s.setData({
                    lists: a.lists,
                    styles: i.types,
                    cate: a.cate,
                    cid: e
                })
            }
        })
    }
});