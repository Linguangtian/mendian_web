/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:23*/
var t = null,
    a = null,
    e = getApp();
Page({
    data: {
        bg: "",
        userinfo: "",
        hasEmptyGrid: !1,
        showPicker: !1,
        jilu: "",
        isview: 0,
        page_signs: "/sudu8_page_plugin_sign/index/index",
        tongj: ""
    },
    onPullDownRefresh: function() {
        var t = this;
        t.data.id, t.checkvip(), t.getsign()
    },
    onLoad: function(t) {
        var a = this;
        wx.setNavigationBarTitle({
            title: "积分签到"
        });
        var n = 0;
        t.fxsid && (n = t.fxsid, a.setData({
            fxsid: t.fxsid
        })), a.checkvip(), a.getsign();
        var s = new Date,
            i = s.getFullYear(),
            r = s.getMonth() + 1;
        this.calculateEmptyGrids(i, r), this.calculateDays(i, r), this.setData({
            cur_year: i,
            cur_month: r,
            weeks_ch: ["日", "一", "二", "三", "四", "五", "六"]
        });
        var o = e.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: o,
            data: {
                vs1: 1
            },
            success: function(t) {
                t.data.data, a.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                })
            }
        }), e.util.getUserInfo(a.getinfos, n)
    },
    redirectto: function(t) {
        var a = t.currentTarget.dataset.link,
            n = t.currentTarget.dataset.linktype;
        e.util.redirectto(a, n)
    },
    checkvip: function() {
        var t = this,
            a = wx.getStorageSync("openid");
        wx.request({
            url: e.util.url("entry/wxapp/checkvip", {
                m: "sudu8_page"
            }),
            data: {
                kwd: "sign",
                openid: a
            },
            success: function(a) {
                console.log(a), a.data.data || (t.setData({
                    needvip: !0
                }), wx.showModal({
                    title: "进入失败",
                    content: "使用本功能需先开通vip!",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/sudu8_page/register/register"
                        })
                    }
                }))
            },
            fail: function(t) {
                console.log(t)
            }
        })
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
    getThisMonthDays: function(t, a) {
        return new Date(t, a, 0).getDate()
    },
    getFirstDayOfWeek: function(t, a) {
        return new Date(Date.UTC(t, a - 1, 1)).getDay()
    },
    calculateEmptyGrids: function(t, a) {
        var e = this.getFirstDayOfWeek(t, a),
            n = [];
        if (0 < e) {
            for (var s = 0; s < e; s++) n.push(s);
            this.setData({
                hasEmptyGrid: !0,
                empytGrids: n
            })
        } else this.setData({
            hasEmptyGrid: !1,
            empytGrids: []
        })
    },
    calculateDays: function(t, a) {
        var n = this,
            s = (this.getThisMonthDays(t, a), wx.getStorageSync("openid"));
        e.util.request({
            url: "entry/wxapp/Mysign",
            data: {
                openid: s,
                year: t,
                month: a
            },
            success: function(t) {
                var a = t.data.data;
                n.setData({
                    days: a
                })
            }
        })
    },
    handleCalendar: function(t) {
        var a = t.currentTarget.dataset.handle,
            e = this.data.cur_year,
            n = this.data.cur_month;
        if ("prev" === a) {
            var s = n - 1,
                i = e;
            s < 1 && (i = e - 1, s = 12), this.calculateDays(i, s), this.calculateEmptyGrids(i, s), this.setData({
                cur_year: i,
                cur_month: s
            })
        } else {
            var r = n + 1,
                o = e;
            12 < r && (o = e + 1, r = 1), this.calculateDays(o, r), this.calculateEmptyGrids(o, r), this.setData({
                cur_year: o,
                cur_month: r
            })
        }
    },
    tapDayItem: function(t) {
        var a = t.currentTarget.dataset.idx,
            e = this.data.days;
        e[a].choosed = !e[a].choosed, this.setData({
            days: e
        })
    },
    chooseYearAndMonth: function() {
        for (var t = this.data.cur_year, a = this.data.cur_month, e = [], n = [], s = 1900; s <= 2100; s++) e.push(s);
        for (var i = 1; i <= 12; i++) n.push(i);
        var r = e.indexOf(t),
            o = n.indexOf(a);
        this.setData({
            picker_value: [r, o],
            picker_year: e,
            picker_month: n,
            showPicker: !0
        })
    },
    pickerChange: function(e) {
        var n = e.detail.value;
        t = this.data.picker_year[n[0]], a = this.data.picker_month[n[1]]
    },
    tapPickerBtn: function(e) {
        var n = {
            showPicker: !1
        };
        "confirm" === e.currentTarget.dataset.type && (n.cur_year = t, n.cur_month = a, this.calculateEmptyGrids(t, a), this.calculateDays(t, a)), this.setData(n)
    },
    getsign: function() {
        var t = this,
            a = wx.getStorageSync("openid");
        e.util.request({
            url: "entry/wxapp/Mysign",
            data: {
                openid: a
            },
            success: function(a) {
                var e = a.data.data;
                t.setData({
                    days: e
                })
            }
        }), wx.request({
            url: e.util.url("entry/wxapp/globaluserinfo", {
                m: "sudu8_page"
            }),
            data: {
                openid: a
            },
            success: function(a) {
                var e = a.data.data;
                e.nickname && e.avatar || t.setData({
                    isview: 1
                }), t.setData({
                    userinfo: a.data.data
                })
            }
        }), e.util.request({
            url: "entry/wxapp/Mysignjl",
            data: {
                openid: a
            },
            success: function(a) {
                var e = a.data.data;
                t.setData({
                    jilu: e
                })
            }
        }), e.util.request({
            url: "entry/wxapp/Mysigntj",
            data: {
                openid: a
            },
            success: function(a) {
                var e = a.data.data;
                t.setData({
                    tongj: e
                })
            }
        }), wx.stopPullDownRefresh()
    },
    onShareAppMessage: function() {
        return {
            title: "积分签到"
        }
    },
    huoqusq: function() {
        var t = this,
            a = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(n) {
                console.log(n);
                var s = n.userInfo,
                    i = s.nickName,
                    r = s.avatarUrl,
                    o = s.gender,
                    c = s.province,
                    u = s.city,
                    d = s.country;
                e.util.request({
                    url: "entry/wxapp/Useupdate",
                    data: {
                        openid: a,
                        nickname: i,
                        avatarUrl: r,
                        gender: o,
                        province: c,
                        city: u,
                        country: d
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), t.setData({
                            isview: 0,
                            globaluser: a.data.data
                        }), t.getsign()
                    }
                })
            },
            fail: function() {
                e.util.selfinfoget(t.chenggfh)
            }
        })
    },
    qiandao: function() {
        var t = wx.getStorageSync("openid");
        t ? e.util.request({
            url: "entry/wxapp/Qiandao",
            data: {
                openid: t
            },
            success: function(t) {
                1 == t.data.data ? wx.showModal({
                    title: "提醒",
                    content: "您今天已经签过到了！",
                    showCancel: !1
                }) : wx.showModal({
                    title: "提醒",
                    content: "签到成功！",
                    showCancel: !1,
                    success: function(t) {
                        wx.redirectTo({
                            url: "/sudu8_page_plugin_sign/index/index"
                        })
                    }
                })
            }
        }) : wx.showModal({
            title: "签到失败",
            content: "请先授权登录再签到",
            showCancel: !1,
            success: function(t) {
                wx.redirectTo({
                    url: "/sudu8_page_plugin_sign/index/index"
                })
            }
        })
    }
});