var app = getApp();

Page({
    data: {
        page_signs: "/sudu8_page/usercenter/usercenter",
        member_card: "1",
        isview: 0,
        money: 0,
        score: 0,
        coupon: 0,
        vipset: 1,
        viptext: "6688",
        vipflag: 1
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "个人中心"
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getBase(), app.util.getUserInfo(t.getinfos, e);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.util.redirectto(t, e);
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                }), t.getinfo(), t.peizhi();
            }
        });
    },
    getBase: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getinfo: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                console.log(a), app.util.request({
                    url: "entry/wxapp/globaluserinfo",
                    data: {
                        openid: a.data
                    },
                    success: function(a) {
                        console.log(a);
                        var t = a.data.data;
                        t.nickname && t.avatar || e.setData({
                            isview: 1
                        }), e.setData({
                            globaluser: a.data.data
                        });
                    }
                }), app.util.request({
                    url: "entry/wxapp/mymoney",
                    data: {
                        openid: a.data
                    },
                    success: function(a) {
                        console.log(a.data.data), "2" != a.data.data.vipset || a.data.data.vipid ? a.data.data.vipid ? e.setData({
                            viptext: a.data.data.vipid.substr(12, 4),
                            isvip: !0
                        }) : (3 == a.data.data.vipflag ? e.setData({
                            vipflag: 3
                        }) : 2 == a.data.data.vipflag ? e.setData({
                            vipflag: 2
                        }) : 4 == a.data.data.vipflag && e.setData({
                            vipflag: 4
                        }), e.setData({
                            isvip: !1
                        })) : e.setData({
                            needVip: !0
                        }), e.setData({
                            userbg: a.data.data.userbg,
                            money: a.data.data.money,
                            score: a.data.data.score,
                            coupon: a.data.data.couponNum,
                            vipset: a.data.data.vipset,
                            cardname: a.data.data.cardname
                        });
                    }
                });
            }
        });
    },
    peizhi: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/updatausersetnew",
            success: function(a) {
                console.log(a), t.setData({
                    fxzzd: a.data.data.arrs,
                    myorder: a.data.data.myorder,
                    mysign: a.data.data.mysign
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.getinfos(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    makePhoneCall: function(a) {
        var t = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    makePhoneCallB: function(a) {
        var t = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    openMap: function(a) {
        var t = this;
        wx.openLocation({
            latitude: parseFloat(t.data.baseinfo.latitude),
            longitude: parseFloat(t.data.baseinfo.longitude),
            name: t.data.baseinfo.name,
            address: t.data.baseinfo.address,
            scale: 22
        });
    },
    refreshSessionkey: function() {
        var t = this;
        wx.login({
            success: function(a) {
                app.util.request({
                    url: "entry/wxapp/getNewSessionkey",
                    data: {
                        code: a.code
                    },
                    success: function(a) {
                        console.log(a), t.setData({
                            newSessionKey: a.data.data
                        });
                    }
                });
            }
        });
    },
    huoqusq: function(a) {
        var t = this, e = wx.getStorageSync("openid");
        if (console.log(a.detail.userInfo), a.detail.userInfo) {
            var n = a.detail.userInfo, s = n.nickName, o = n.avatarUrl, i = n.gender, r = n.province, u = n.city, d = n.country;
            console.log(s), app.util.request({
                url: "entry/wxapp/Useupdate",
                data: {
                    openid: e,
                    nickname: s,
                    avatarUrl: o,
                    gender: i,
                    province: r,
                    city: u,
                    country: d
                },
                header: {
                    "content-type": "application/json"
                },
                success: function(a) {
                    console.log(a), wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                    t.setData({
                        isview: 0,
                        globaluser: a.data.data
                    }), t.getinfo();
                }
            });
        } else wx.showModal({
            title: "获取失败",
            content: "请您允许授权",
            showCancel: !1,
            success: function(a) {
                a.confirm && wx.getSetting({
                    success: function(a) {
                        a.authSetting["scope.userInfo"] || wx.openSetting({
                            success: function(a) {
                                wx.reLaunch({
                                    url: "/sudu8_page/usercenter/usercenter"
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    toRegisterVIP: function() {
        wx.navigateTo({
            url: "/sudu8_page/register/register"
        });
    },
    toSign: function() {
        wx.navigateTo({
            url: "/sudu8_page_plugin_sign/index/index"
        });
    },
    toRegisterSuccess: function() {
        wx.navigateTo({
            url: "/sudu8_page/register_success/register_success"
        });
    },
    setVipText: function(a) {
        this.setData({
            viptext: a
        });
    }
});