var app = getApp();

Page({
    data: {
        page_signs: "/sudu8_page/coupon/coupon",
        couponlist: [],
        baseinfo: [],
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        }
    },
    onPullDownRefresh: function() {
        this.getBase(), this.getList(), this.couset(), this.refreshSessionkey();
    },
    onLoad: function(t) {
        var a = this, e = 0;
        t.fxsid && (e = t.fxsid, a.setData({
            fxsid: t.fxsid
        })), a.getBase(), a.refreshSessionkey(), app.util.getUserInfo(a.getinfos, e);
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                a.setData({
                    openid: t.data
                }), a.getList(), a.couset();
            }
        });
    },
    redirectto: function(t) {
        var a = t.currentTarget.dataset.link, e = t.currentTarget.dataset.linktype;
        app.util.redirectto(a, e);
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
                }), wx.setNavigationBarTitle({
                    title: "领取优惠券"
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
    getList: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/coupon",
            data: {
                openid: a.data.openid
            },
            success: function(t) {
                a.setData({
                    couponlist: t.data.data
                }), console.log(a.data.couponlist), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    getit: function(o) {
        var n = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                var a = t.data;
                if (a) {
                    var e = o;
                    console.log("进来了么"), console.log(a), console.log(e), app.util.request({
                        url: "entry/wxapp/getcoupon",
                        data: {
                            id: e,
                            openid: a
                        },
                        success: function(t) {
                            console.log("返回了么"), console.log(t), 1 == t.data.data && (wx.showToast({
                                title: "领取成功",
                                icon: "success",
                                duration: 2e3
                            }), setTimeout(function() {
                                n.getList();
                            }, 500)), 2 == t.data.data && (wx.showToast({
                                title: "领取失败",
                                icon: "loading",
                                duration: 4e3
                            }), setTimeout(function() {
                                n.getList();
                            }, 500));
                        },
                        fail: function(t) {
                            console.log(t);
                        }
                    });
                } else n.getList();
            }
        });
    },
    getit_zj: function(t) {
        var e = this, o = t.currentTarget.id;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                var a = t.data;
                a ? app.util.request({
                    url: "entry/wxapp/getcoupon",
                    data: {
                        id: o,
                        openid: a
                    },
                    success: function(t) {
                        console.log(t.data.data), 1 == t.data.data && (wx.showToast({
                            title: "领取成功",
                            icon: "success",
                            duration: 2e3
                        }), setTimeout(function() {
                            e.getList();
                        }, 500)), 2 == t.data.data && (wx.showToast({
                            title: "领取失败",
                            icon: "loading",
                            duration: 4e3
                        }), setTimeout(function() {
                            e.getList();
                        }, 500));
                    },
                    fail: function(t) {
                        console.log(t);
                    }
                }) : e.getList();
            }
        });
    },
    openApp: function(t) {
        wx.navigateToMiniProgram({
            appId: t.currentTarget.dataset.id,
            path: t.currentTarget.dataset.path,
            success: function(t) {
                console.log("ok");
            }
        });
    },
    mycoupp: function() {
        wx.redirectTo({
            url: "/sudu8_page/mycoupon/mycoupon"
        });
    },
    makePhoneCall: function(t) {
        var a = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    makePhoneCallB: function(t) {
        var a = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    openMap: function(t) {
        wx.openLocation({
            latitude: parseFloat(this.data.baseinfo.latitude),
            longitude: parseFloat(this.data.baseinfo.longitude),
            name: this.data.baseinfo.name,
            address: this.data.baseinfo.address,
            scale: 22
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.cateinfo.name + "-" + this.data.baseinfo.name
        };
    },
    refreshSessionkey: function() {
        var a = this;
        wx.login({
            success: function(t) {
                app.util.request({
                    url: "entry/wxapp/getNewSessionkey",
                    data: {
                        code: t.code
                    },
                    success: function(t) {
                        console.log(t), a.setData({
                            newSessionKey: t.data.data
                        });
                    }
                });
            }
        });
    },
    getPhoneNumber: function(e) {
        var o = this, t = e.detail.iv, a = e.detail.encryptedData;
        console.log(123), "getPhoneNumber:ok" == e.detail.errMsg ? wx.checkSession({
            success: function() {
                app.util.request({
                    url: "entry/wxapp/jiemiNew",
                    data: {
                        encryptedData: a,
                        iv: t,
                        newSessionKey: o.data.newSessionKey
                    },
                    success: function(t) {
                        if (console.log(t.data), t.data.data) {
                            var a = t.data.data;
                            app.util.request({
                                url: "entry/wxapp/mobilesetuser",
                                data: {
                                    openid: o.data.openid,
                                    mobile: a
                                },
                                success: function(t) {
                                    var a = e.currentTarget.id;
                                    o.getit(a), o.setData({
                                        shouj: 2
                                    });
                                }
                            });
                        } else wx.showModal({
                            title: "提示",
                            content: "sessionKey已过期，请下拉刷新！"
                        });
                    }
                });
            },
            fail: function() {
                wx.showModal({
                    title: "提示",
                    content: "sessionKey已过期，请下拉刷新！"
                });
            }
        }) : wx.showModal({
            title: "提醒",
            content: "领取优惠券时，请先授权获取您的手机号！",
            showCancel: !1
        });
    },
    couset: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/couponset",
            success: function(t) {
                console.log(t.data.data);
                var a = 1;
                a = t.data.data ? t.data.data.flag : 1, e.setData({
                    kaiq: a
                });
            }
        }), console.log(e.data.openid), app.util.request({
            url: "entry/wxapp/globaluserinfo",
            data: {
                openid: e.data.openid
            },
            success: function(t) {
                var a = 1;
                console.log(t.data.data), a = t.data.data.mobile ? 2 : 1, console.log(a), e.setData({
                    shouj: a
                });
            }
        });
    }
});