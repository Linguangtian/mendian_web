/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:19*/
var a = require("../../sudu8_page/resource/wxParse/wxParse.js"),
    t = getApp();
Page({
    data: {
        minHeight: 220,
        bg: "",
        picList: [],
        datas: "",
        sc: 0,
        nowcon: "con",
        is_comment: 0,
        comm: 0,
        commSelf: 0,
        comments: [],
        commShow: 0,
        shareShow: 0,
        shareScore: 0,
        shareNotice: 0,
        content: "",
        con2: "",
        con3: "",
        fxsid: 0,
        heighthave: 0,
        shareHome: 0
    },
    onPullDownRefresh: function() {
        var a = this,
            t = a.data.id;
        a.getShowPic(t), a.givepscore()
    },
    onLoad: function(a) {
        var e = this,
            o = a.id;
        e.setData({
            id: o
        }), wx.showShareMenu({
            withShareTicket: !0
        });
        var s = 0;
        a.fxsid && (s = a.fxsid, e.setData({
            fxsid: a.fxsid,
            shareHome: 1
        }));
        var n = t.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: n,
            cachetime: "30",
            success: function(a) {
                a.data.data;
                e.setData({
                    baseinfo: a.data.data,
                    comm: a.data.data.commP,
                    comms: a.data.data.commPs
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                })
            }
        }), t.util.getUserInfo(e.getinfos, s)
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                a.setData({
                    openid: t.data
                });
                var e = a.data.id;
                a.getShowPic(e), a.givepscore()
            }
        })
    },
    follow: function(a) {
        var e = a.currentTarget.dataset.id;
        t.util.request({
            url: "entry/wxapp/commentFollow",
            cachetime: "0",
            data: {
                id: e
            },
            success: function(a) {
                1 == a.data.data.result && wx.showToast({
                    title: "点赞成功",
                    icon: "success",
                    duration: 1e3
                })
            }
        })
    },
    pinglun: function(a) {
        this.setData({
            pinglun_t: a.detail.value
        })
    },
    pinglun_sub: function() {
        var a = this,
            e = a.data.pinglun_t,
            o = a.data.id,
            s = wx.getStorageSync("openid");
        if ("" == e || void 0 == e) return wx.showModal({
            content: "评论不能为空"
        }), !1;
        t.util.request({
            url: "entry/wxapp/comment",
            cachetime: "30",
            data: {
                pinglun_t: e,
                id: o,
                openid: s
            },
            success: function(a) {
                console.log(a), 1 == a.data.data.result && (wx.showToast({
                    title: "评价提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "/sudu8_page_plugin_shop/goods_detail/goods_detail?id=" + o
                    })
                }, 2e3))
            }
        })
    },
    getShowPic: function(e) {
        var o = this,
            s = wx.getStorageSync("openid"),
            n = t.util.url("entry/wxapp/globaluserinfo", {
                m: "sudu8_page"
            });
        wx.request({
            url: n,
            data: {
                openid: s
            },
            success: function(a) {
                o.setData({
                    globaluser: a.data.data
                })
            }
        }), t.util.request({
            url: "entry/wxapp/showPro",
            data: {
                id: e,
                openid: s
            },
            cachetime: "30",
            success: function(t) {
                console.log(t.data.data), o.setData({
                    picList: t.data.data.images,
                    title: t.data.data.title,
                    datas: t.data.data,
                    sc: t.data.data.collectcount
                }), t.data.data.descp && a.wxParse("content", "html", t.data.data.descp, o, 5), t.data.data.con2 && a.wxParse("con2", "html", t.data.data.con2, o, 5), t.data.data.con3 && a.wxParse("con3", "html", t.data.data.con3, o, 5), wx.setNavigationBarTitle({
                    title: o.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh()
            }
        }), setTimeout(function() {
            if ("1" == o.data.comm && "0" != o.data.commSelf || "1" == o.data.commSelf) {
                var a = o.data.comms;
                o.setData({
                    commShow: 1
                }), t.util.request({
                    url: "entry/wxapp/getComment",
                    cachetime: "0",
                    data: {
                        id: e,
                        comms: a
                    },
                    success: function(a) {
                        "" != a.data && o.setData({
                            comments: a.data.data,
                            is_comment: 1
                        })
                    }
                })
            }
        }, 500)
    },
    collect: function(a) {
        var e = this,
            o = a.currentTarget.dataset.name;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var s = wx.getStorageSync("openid"),
                    n = t.util.url("entry/wxapp/Collect", {
                        m: "sudu8_page"
                    });
                wx.request({
                    url: n,
                    data: {
                        openid: s,
                        types: "shopsPro",
                        id: o
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        var t = a.data.data;
                        "收藏成功" == t ? e.setData({
                            sc: 1
                        }) : e.setData({
                            sc: 0
                        }), wx.showToast({
                            title: t,
                            icon: "succes",
                            duration: 1e3,
                            mask: !0
                        })
                    }
                })
            },
            fail: function() {
                console.log("ffffff");
                var a = wx.getStorageSync("appcode"),
                    s = t.util.url("entry/wxapp/Appbase", {
                        m: "sudu8_page"
                    });
                wx.request({
                    url: s,
                    data: {
                        code: a
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        var s = a.data.data.openid;
                        wx.setStorage({
                            key: "openid",
                            data: a.data.data.openid,
                            success: function() {
                                var a = t.util.url("entry/wxapp/Collect", {
                                    m: "sudu8_page"
                                });
                                wx.request({
                                    url: a,
                                    data: {
                                        openid: s,
                                        types: "showPro",
                                        id: o
                                    },
                                    header: {
                                        "content-type": "application/json"
                                    },
                                    success: function(a) {
                                        var t = a.data.data;
                                        "收藏成功" == t ? e.setData({
                                            sc: 1
                                        }) : e.setData({
                                            sc: 0
                                        }), wx.showToast({
                                            title: t,
                                            icon: "succes",
                                            duration: 1e3,
                                            mask: !0
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },
    tabChange: function(a) {
        var t = a.currentTarget.dataset.id;
        this.setData({
            nowcon: t
        })
    },
    swiperLoad: function(a) {
        var t = this;
        wx.getSystemInfo({
            success: function(e) {
                var o = a.detail.width / a.detail.height,
                    s = e.windowWidth / o;
                t.data.heighthave || t.setData({
                    minHeight: s,
                    heighthave: 1
                })
            }
        })
    },
    makePhoneCall: function(a) {
        var t = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: t
        })
    },
    makePhoneCallB: function(a) {
        var t = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: t
        })
    },
    openMap: function(a) {
        var t = this;
        wx.openLocation({
            latitude: parseFloat(t.data.baseinfo.latitude),
            longitude: parseFloat(t.data.baseinfo.longitude),
            name: t.data.baseinfo.name,
            address: t.data.baseinfo.address,
            scale: 22
        })
    },
    shareClo: function() {
        this.setData({
            shareShow: 0
        })
    },
    onShareAppMessage: function() {
        var a = this,
            t = wx.getStorageSync("openid"),
            e = a.data.id,
            o = "";
        return o = 1 == a.data.globaluser.fxs ? "/sudu8_page_plugin_shop/goods_detial/goods_detial?id=" + e : "/sudu8_page_plugin_shop/goods_detial/goods_detial?id=" + e + "&fxsid=" + t, {
            title: a.data.title,
            path: o,
            success: function(a) {
                console.log("分享成功"), console.log(a)
            }
        }
    },
    givepscore: function() {
        var a = this,
            e = a.data.id,
            o = a.data.fxsid,
            s = wx.getStorageSync("openid");
        if (o != s && 0 != o) {
            var n = t.util.url("entry/wxapp/giveposcore", {
                m: "sudu8_page"
            });
            wx.request({
                url: n,
                data: {
                    id: e,
                    types: "showPro",
                    openid: s,
                    fxsid: o
                },
                success: function(a) {}
            })
        }
    }
});