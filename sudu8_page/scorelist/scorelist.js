var app = getApp();

Page({
    data: {
        page_signs: "/sudu8_page/scorelist/scorelist",
        baseinfo: [],
        userInfo: "",
        searchtitle: "",
        scopes: !1,
        money: 0,
        score: 0,
        isview: 0,
        page: 1,
        xz: 1
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(t) {
        var a = this;
        wx.setNavigationBarTitle({
            title: "积分明细"
        });
        var e = 0;
        t.fxsid && (e = t.fxsid, a.setData({
            fxsid: t.fxsid
        }));
        var s = t.type;
        a.setData({
            xz: s || 1
        }), 1 == s ? (a.getscore(), wx.setNavigationBarTitle({
            title: "积分明细"
        })) : (a.getmoeny(), wx.setNavigationBarTitle({
            title: "消费流水"
        })), a.getBase(), app.util.getUserInfo(a.getinfos, e);
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                a.setData({
                    openid: t.data
                }), a.getinfo(), a.getscore();
            }
        });
    },
    getBase: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(t) {
                a.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    redirectto: function(t) {
        var a = t.currentTarget.dataset.link, e = t.currentTarget.dataset.linktype;
        app.util.redirectto(a, e);
    },
    getinfo: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                app.util.request({
                    url: "entry/wxapp/globaluserinfo",
                    data: {
                        openid: t.data
                    },
                    success: function(t) {
                        a.setData({
                            globaluser: t.data.data
                        });
                    }
                });
            }
        });
    },
    getscore: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                app.util.request({
                    url: "entry/wxapp/getmyscorelist",
                    data: {
                        openid: t.data,
                        page: a.data.page
                    },
                    success: function(t) {
                        1 == t.data.data.isover ? a.setData({
                            morePro: !0
                        }) : a.setData({
                            morePro: !1
                        }), a.setData({
                            scorelists: t.data.data.lists
                        });
                    }
                });
            }
        });
    },
    getmoeny: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                app.util.request({
                    url: "entry/wxapp/getmymoneylist",
                    data: {
                        openid: t.data,
                        page: a.data.page
                    },
                    success: function(t) {
                        1 == t.data.data.isover ? a.setData({
                            morePro: !0
                        }) : a.setData({
                            morePro: !1
                        }), a.setData({
                            scorelists: t.data.data.lists
                        });
                    }
                });
            }
        });
    },
    onReachBottom: function() {
        var a = this, e = a.data.page + 1, t = wx.getStorageSync("openid");
        console.log(a.data.xz), 1 == a.data.xz ? app.util.request({
            url: "entry/wxapp/getmyscorelist",
            data: {
                openid: t,
                page: e
            },
            success: function(t) {
                1 == t.data.data.isover ? a.setData({
                    morePro: !0
                }) : a.setData({
                    morePro: !1
                }), a.setData({
                    scorelists: a.data.scorelists.concat(t.data.data.lists),
                    page: e
                });
            }
        }) : app.util.request({
            url: "entry/wxapp/getmymoneylist",
            data: {
                openid: t,
                page: e
            },
            success: function(t) {
                1 == t.data.data.isover ? a.setData({
                    morePro: !0
                }) : a.setData({
                    morePro: !1
                }), a.setData({
                    scorelists: a.data.scorelists.concat(t.data.data.lists),
                    page: e
                });
            }
        });
    },
    qieh: function(t) {
        var a = this, e = t.target.dataset.id;
        a.setData({
            xz: e
        }), 1 == e ? (a.getscore(), wx.setNavigationBarTitle({
            title: "积分明细"
        })) : (a.getmoeny(), wx.setNavigationBarTitle({
            title: "消费流水"
        }));
    }
});