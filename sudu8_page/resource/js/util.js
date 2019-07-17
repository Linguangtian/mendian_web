var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

function _defineProperty(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e;
}

var util = {}, openid = "";

function getQuery(e) {
    var t = [];
    if (-1 != e.indexOf("?")) for (var n = e.split("?")[1].split("&"), o = 0; o < n.length; o++) n[o].split("=")[0] && unescape(n[o].split("=")[1]) && (t[o] = {
        name: n[o].split("=")[0],
        value: unescape(n[o].split("=")[1])
    });
    return t;
}

function getUrlParam(e, t) {
    var n = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"), o = e.split("?")[1].match(n);
    return null != o ? unescape(o[2]) : null;
}

function getSign(e, t, n) {
    var o = require("underscore.js"), a = require("md5.js"), i = "", s = getUrlParam(e, "sign");
    if (s || t && t.sign) return !1;
    if (e && (i = getQuery(e)), t) {
        var r = [];
        for (var c in t) c && t[c] && (r = r.concat({
            name: c,
            value: t[c]
        }));
        i = i.concat(r);
    }
    i = o.sortBy(i, "name"), i = o.uniq(i, !0, "name");
    for (var u = "", l = 0; l < i.length; l++) i[l] && i[l].name && i[l].value && (u += i[l].name + "=" + i[l].value, 
    l < i.length - 1 && (u += "&"));
    return s = a(u + (n = n || getApp().siteInfo.token));
}

util.url = function(e, t) {
    var n = getApp(), o = n.siteInfo.siteroot + "?i=" + n.siteInfo.uniacid + "&t=" + n.siteInfo.multiid + "&v=" + n.siteInfo.version + "&from=wxapp&";
    if (e && ((e = e.split("/"))[0] && (o += "c=" + e[0] + "&"), e[1] && (o += "a=" + e[1] + "&"), 
    e[2] && (o += "do=" + e[2] + "&")), t) for (var a in t) a && t[a] && (o += a + "=" + t[a] + "&");
    return o;
}, util.request = function(o) {
    require("underscore.js");
    var e, t = require("md5.js"), a = getApp();
    (o = o || {}).cachetime = o.cachetime ? o.cachetime : 0, o.showLoading = void 0 === o.showLoading || o.showLoading;
    var n = wx.getStorageSync("userInfo").sessionid, i = o.url;
    if (-1 == i.indexOf("http://") && -1 == i.indexOf("https://") && (i = util.url(i)), 
    getUrlParam(i, "state") || o.data && o.data.state || !n || (i = i + "&state=we7sid-" + n), 
    !o.data || !o.data.m) {
        var s = getCurrentPages();
        s && (s = s[getCurrentPages().length - 1]).__route__ && (i = i + "&m=" + s.__route__.split("/")[0]);
    }
    var r = getSign(i, o.data);
    if (r && (i = i + "&sign=" + r), !i) return !1;
    if (wx.showNavigationBarLoading(), o.showLoading && util.showLoading(), o.cachetime) {
        var c = t(i), u = wx.getStorageSync(c), l = Date.parse(new Date());
        if (u && u.data) {
            if (u.expire > l) return o.complete && "function" == typeof o.complete && o.complete(u), 
            o.success && "function" == typeof o.success && o.success(u), console.log("cache:" + i), 
            wx.hideLoading(), wx.hideNavigationBarLoading(), !0;
            wx.removeStorageSync(c);
        }
    }
    wx.request((_defineProperty(e = {
        url: i,
        data: o.data ? o.data : {},
        header: o.header ? o.header : {},
        method: o.method ? o.method : "POST"
    }, "header", {
        "content-type": "application/x-www-form-urlencoded"
    }), _defineProperty(e, "success", function(e) {
        if (wx.hideNavigationBarLoading(), wx.hideLoading(), e.data.errno) {
            if ("41009" == e.data.errno) return wx.setStorageSync("userInfo", ""), void util.getUserInfo(function() {
                util.request(o);
            });
            if (o.fail && "function" == typeof o.fail) o.fail(e); else if (e.data.message) {
                if (null != e.data.data && e.data.data.redirect) var t = e.data.data.redirect; else t = "";
                a.util.message(e.data.message, t, "error");
            }
        } else if (o.success && "function" == typeof o.success && o.success(e), o.cachetime) {
            var n = {
                data: e.data,
                expire: l + 1e3 * o.cachetime
            };
            wx.setStorageSync(c, n);
        }
    }), _defineProperty(e, "fail", function(e) {
        wx.hideNavigationBarLoading(), wx.hideLoading();
        var t = require("md5.js")(i), n = wx.getStorageSync(t);
        if (n && n.data) return o.success && "function" == typeof o.success && o.success(n), 
        console.log("failreadcache:" + i), !0;
        o.fail && "function" == typeof o.fail && o.fail(e);
    }), _defineProperty(e, "complete", function(e) {
        o.complete && "function" == typeof o.complete && o.complete(e);
    }), e));
}, util.redirectto = function(t, e) {
    switch (e) {
      case "page":
        "/sudu8_page/index/index" == t || "/sudu8_page/index/index/" == t ? (console.log("index"), 
        wx.reLaunch({
            url: t
        })) : (console.log("neiye"), wx.navigateTo({
            url: t
        }));
        break;

      case "web":
        wx.navigateTo({
            url: "/sudu8_page/webpage/webpage?url=" + encodeURIComponent(t)
        });
        break;

      case "tel":
        t = t.slice(4), wx.showModal({
            title: "提示",
            content: "是否拨打电话:" + t,
            success: function(e) {
                1 == e.confirm && wx.makePhoneCall({
                    phoneNumber: t
                });
            }
        });
        break;

      case "map":
        t = (n = t.split("##"))[0].split(","), wx.openLocation({
            latitude: parseFloat(t[0]),
            longitude: parseFloat(t[1]),
            scale: 22,
            name: n[1],
            address: n[2]
        });
        break;

      case "mini":
        var n, o = (n = t.split(","))[0].slice(6);
        if (2 == n.length) var a = n[1].slice(9); else a = "";
        wx.navigateToMiniProgram({
            appId: o,
            path: a,
            success: function(e) {
                console.log("打开成功"), console.log(o);
            }
        });
    }
}, util.getUserInfo = function(n, o) {
    getCurrentPages();
    wx.getStorage({
        key: "openid",
        success: function(e) {
            util.fxsbindagain(o, e.data), "function" == typeof n && n();
        },
        fail: function() {
            wx.login({
                success: function(e) {
                    var t = util.url("entry/wxapp/Appbase", {
                        m: "sudu8_page"
                    });
                    wx.request({
                        url: t,
                        data: {
                            code: e.code
                        },
                        success: function(e) {
                            if (e.data.data) {
                                wx.setStorageSync("openid", e.data.data.openid);
                                var t = e.data.data.openid;
                                console.log("第一次进入"), util.fxsbindagain(o, t), "function" == typeof n && n();
                            } else wx.showModal({
                                title: "提醒",
                                content: "获取用户信息失败，请检查appid和appsecret是否正确！",
                                showCancel: !1
                            });
                        }
                    });
                },
                fail: function() {
                    wx.showModal({
                        title: "获取信息失败",
                        content: "请允许授权以便为您提供给服务",
                        success: function(e) {
                            e.confirm && util.getUserInfo();
                        }
                    });
                }
            });
        }
    });
}, util.fxsbindagain = function(e, t) {
    console.log("分销商绑定判断"), 0 != e && e != t ? (console.log("分销商绑定开始"), util.fxsbind(e, t), 
    wx.setStorageSync("fxsid", e)) : wx.getStorage({
        key: "fxsid",
        success: function(e) {
            0 != e.data && util.fxsbind(e.data, t);
        },
        fail: function() {
            wx.setStorageSync("fxsid", 0);
        }
    });
}, util.fxsbind = function(e, t) {
    var n = util.url("entry/wxapp/bindfxs", {
        m: "sudu8_page"
    });
    wx.request({
        url: n,
        data: {
            openid: t,
            fxsid: e
        },
        success: function(e) {
            console.log("绑定完成");
        }
    });
}, util.selfinfoget = function(a) {
    wx.getStorage({
        key: "golobeuser",
        success: function(e) {
            console.log(e);
        },
        fail: function() {
            console.log(123), wx.getSetting({
                success: function(e) {
                    e.authSetting["scope.userInfo"], wx.showModal({
                        title: "提示",
                        content: "必须授权登录后才能操作,是否重新授权登录？",
                        showCancel: !1,
                        success: function(e) {
                            wx.openSetting({
                                success: function(e) {
                                    e.authSetting["scope.userInfo"] ? (console.log(222), wx.getUserInfo({
                                        success: function(e) {
                                            var t = e.userInfo, n = wx.getStorageSync("openid"), o = util.url("entry/wxapp/Useupdate", {
                                                m: "sudu8_page"
                                            });
                                            wx.request({
                                                url: o,
                                                data: {
                                                    openid: n,
                                                    nickname: t.nickName,
                                                    avatarUrl: t.avatarUrl,
                                                    gender: t.gender,
                                                    province: t.province,
                                                    city: t.city,
                                                    country: t.country
                                                },
                                                header: {
                                                    "content-type": "application/json"
                                                },
                                                success: function(e) {
                                                    wx.setStorageSync("golobeuid", e.data.data.id), wx.setStorageSync("golobeuser", e.data.data), 
                                                    "function" == typeof a && a();
                                                }
                                            });
                                        }
                                    })) : (console.log(333), util.selfinfoget());
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}, util.openset = function() {
    wx.showModal({
        title: "提示",
        content: "必须授权登录后才能操作,是否重新授权登录？",
        showCancel: !1,
        success: function(e) {
            wx.openSetting({
                success: function(e) {
                    e.authSetting["scope.userInfo"] ? wx.getUserInfo({
                        success: function(e) {
                            var t = e.userInfo, n = util.url("entry/wxapp/Useupdate", {
                                m: "sudu8_page"
                            });
                            wx.request({
                                url: n,
                                data: {
                                    openid: openid,
                                    nickname: t.nickName,
                                    avatarUrl: t.avatarUrl,
                                    gender: t.gender,
                                    province: t.province,
                                    city: t.city,
                                    country: t.country
                                },
                                header: {
                                    "content-type": "application/json"
                                },
                                success: function(e) {
                                    wx.setStorageSync("golobeuid", e.data.data.id);
                                }
                            });
                        }
                    }) : util.openset();
                }
            });
        }
    });
}, util.navigateBack = function(t) {
    var e = t.delta ? t.delta : 1;
    if (t.data) {
        var n = getCurrentPages(), o = n[n.length - (e + 1)];
        o.pageForResult ? o.pageForResult(t.data) : o.setData(t.data);
    }
    wx.navigateBack({
        delta: e,
        success: function(e) {
            "function" == typeof t.success && t.success(e);
        },
        fail: function(e) {
            "function" == typeof t.fail && t.function(e);
        },
        complete: function() {
            "function" == typeof t.complete && t.complete();
        }
    });
}, util.footer = function(e) {
    var t = e, n = getApp().tabBar;
    for (var o in n.list) n.list[o].pageUrl = n.list[o].pagePath.replace(/(\?|#)[^"]*/g, "");
    t.setData({
        tabBar: n,
        "tabBar.thisurl": t.__route__
    });
}, util.message = function(e, t, n) {
    if (!e) return !0;
    if ("object" == (void 0 === e ? "undefined" : _typeof(e)) && (t = e.redirect, n = e.type, 
    e = e.title), t) {
        var o = t.substring(0, 9), a = "", i = "";
        "navigate:" == o ? (i = "navigateTo", a = t.substring(9)) : "redirect:" == o ? (i = "redirectTo", 
        a = t.substring(9)) : (a = t, i = "redirectTo");
    }
    n || (n = "success"), "success" == n ? wx.showToast({
        title: e,
        icon: "success",
        duration: 2e3,
        mask: !!a,
        complete: function() {
            a && setTimeout(function() {
                wx[i]({
                    url: a
                });
            }, 1800);
        }
    }) : "error" == n && wx.showModal({
        title: "系统信息",
        content: e,
        showCancel: !1,
        complete: function() {
            a && wx[i]({
                url: a
            });
        }
    });
}, util.user = util.getUserInfo, util.showLoading = function() {
    wx.getStorageSync("isShowLoading") && (wx.hideLoading(), wx.setStorageSync("isShowLoading", !1)), 
    wx.showLoading({
        title: "加载中",
        complete: function() {
            wx.setStorageSync("isShowLoading", !0);
        },
        fail: function() {
            wx.setStorageSync("isShowLoading", !1);
        }
    });
}, util.countDown = function(t, n) {
    var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0;
    "object" != (void 0 === n ? "undefined" : _typeof(n)) && (n = [ n ]);
    var c = function(e) {
        return e < 10 ? "0" + e : e;
    }, u = 0;
    if ("function" == typeof t && t(function(e) {
        for (var t = [], n = 0; n < e.length; n++) if (0 < e[n]) {
            var o = Math.floor(e[n] / 1e3), a = Math.floor(o / 3600), i = {};
            i.day = Math.floor(a / 24), i.hour = c(a % 24), i.min = c(Math.floor((o - 3600 * a) / 60)), 
            i.sec = c(o % 60), i.sto_id = r, t.push(i);
        } else {
            var s = {
                day: 0,
                hour: 0,
                min: 0,
                sec: 0
            };
            s.sto_id = r, t.push(s), u++;
        }
        return 1 == e.length ? t[0] : t;
    }(n)), u != n.length) r = setTimeout(function() {
        for (var e = 0; e < n.length; e++) n[e] -= 1e3;
        util.countDown(t, n, r);
    }, 1e3);
}, module.exports = util;