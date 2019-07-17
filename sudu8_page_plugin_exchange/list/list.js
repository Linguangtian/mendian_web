/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:10*/
function a(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a
}
var t, e = getApp();
Page((a(t = {
    data: {
        page_signs: "/sudu8_page_plugin_exchange/list/list",
        page: 1,
        morePro: !1,
        ProductsList: [],
        baseinfo: [],
        footer: {
            i_tel: e.globalData.i_tel,
            i_add: e.globalData.i_add,
            i_time: e.globalData.i_time,
            i_view: e.globalData.i_view,
            close: e.globalData.close,
            v_ico: e.globalData.v_ico
        },
        cid: 0,
        cate: ""
    },
    onPullDownRefresh: function() {
        this.getinfos()
    },
    onLoad: function(a) {
        var t = this;
        t.setData({
            cid: a.cid
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.checkvip(), t.getBase(), e.util.getUserInfo(t.getinfos, i)
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link,
            i = a.currentTarget.dataset.linktype;
        e.util.redirectto(t, i)
    },
    checkvip: function() {
        var a = this,
            t = wx.getStorageSync("openid");
        wx.request({
            url: e.util.url("entry/wxapp/checkvip", {
                m: "sudu8_page"
            }),
            data: {
                kwd: "exchange",
                openid: t
            },
            success: function(t) {
                console.log(t), t.data.data || (a.setData({
                    needvip: !0
                }), wx.showModal({
                    title: "进入失败",
                    content: "使用本功能需先开通vip!",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.redirectTo({
                            url: "/sudu8_page/register/register"
                        })
                    }
                }))
            },
            fail: function(a) {
                console.log(a)
            }
        })
    }
}, "onPullDownRefresh", function() {
    this.getBase(), this.getList(), this.getCate(), this.getinfo()
}), a(t, "getinfos", function() {
    var a = this;
    wx.getStorage({
        key: "openid",
        success: function(t) {
            a.setData({
                openid: t.data
            }), a.getList(), a.getCate(), a.getinfo()
        }
    })
}), a(t, "getBase", function() {
    var a = this,
        t = e.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
    wx.request({
        url: t,
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
        },
        fail: function(a) {
            console.log(a)
        }
    })
}), a(t, "getinfo", function() {
    var a = this;
    wx.getStorage({
        key: "openid",
        success: function(t) {
            var i = e.util.url("entry/wxapp/globaluserinfo", {
                m: "sudu8_page"
            });
            wx.request({
                url: i,
                data: {
                    openid: t.data
                },
                success: function(t) {
                    var e = t.data.data;
                    e.nickname && e.avatar || a.setData({
                        isview: 1
                    }), a.setData({
                        globaluser: t.data.data
                    })
                }
            })
        }
    })
}), a(t, "handleTap", function(a) {
    var t = this,
        e = a.currentTarget.id.slice(1);
    t.data.cid, e && (t.setData({
        cid: e,
        page: 1
    }), t.getList(e))
}), a(t, "getCate", function() {
    var a = this;
    e.util.request({
        url: "entry/wxapp/Scorecate",
        success: function(t) {
            console.log(t.data.data), a.setData({
                cate: t.data.data
            })
        },
        fail: function(a) {
            console.log(a)
        }
    })
}), a(t, "getList", function(a) {
    var t = this;
    null == a && (a = 0), e.util.request({
        url: "entry/wxapp/Scorepro",
        cachetime: "30",
        data: {
            cid: a
        },
        success: function(e) {
            console.log(e.data.data), t.setData({
                cate_list: e.data.data,
                cid: a
            }), wx.setNavigationBarTitle({
                title: "积分商城"
            }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh()
        },
        fail: function(a) {
            console.log(a)
        }
    })
}), a(t, "onReachBottom", function() {
    var a = this,
        t = a.data.page + 1,
        i = a.data.cid;
    e.util.request({
        url: "entry/wxapp/Scorepro",
        data: {
            cid: i,
            page: t
        },
        success: function(e) {
            "" != e.data.data ? a.setData({
                cate_list: a.data.cate_list.concat(e.data.data),
                page: t
            }) : a.setData({
                morePro: !1
            })
        }
    })
}), a(t, "makePhoneCall", function(a) {
    var t = this.data.baseinfo.tel;
    wx.makePhoneCall({
        phoneNumber: t
    })
}), a(t, "makePhoneCallB", function(a) {
    var t = this.data.baseinfo.tel_b;
    wx.makePhoneCall({
        phoneNumber: t
    })
}), a(t, "openMap", function(a) {
    wx.openLocation({
        latitude: parseFloat(this.data.baseinfo.latitude),
        longitude: parseFloat(this.data.baseinfo.longitude),
        name: this.data.baseinfo.name,
        address: this.data.baseinfo.address,
        scale: 22
    })
}), a(t, "onShareAppMessage", function() {
    return {
        title: this.data.cateinfo.name + "-" + this.data.baseinfo.name
    }
}), a(t, "huoqusq", function() {
    var a = this,
        t = wx.getStorageSync("openid");
    wx.getUserInfo({
        success: function(i) {
            var n = i.userInfo,
                o = n.nickName,
                s = n.avatarUrl,
                c = n.gender,
                r = n.province,
                l = n.city,
                u = n.country,
                d = e.util.url("entry/wxapp/Useupdate", {
                    m: "sudu8_page"
                });
            wx.request({
                url: d,
                data: {
                    openid: t,
                    nickname: o,
                    avatarUrl: s,
                    gender: c,
                    province: r,
                    city: l,
                    country: u
                },
                header: {
                    "content-type": "application/json"
                },
                success: function(t) {
                    wx.setStorageSync("golobeuid", t.data.data.id), wx.setStorageSync("golobeuser", t.data.data), a.setData({
                        isview: 0,
                        globaluser: t.data.data
                    }), a.getinfos()
                }
            })
        },
        fail: function() {
            e.util.selfinfoget(a.chenggfh)
        }
    })
}), a(t, "chenggfh", function() {
    var a = wx.getStorageSync("golobeuser");
    this.setData({
        isview: 0,
        globaluser: a
    })
}), t));