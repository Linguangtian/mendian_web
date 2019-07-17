var app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        var t = this;
        app.util.request({
            url: "entry/wxapp/base",
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
    goback: function() {
        var a = this, s = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(a) {
                var t = a.userInfo, e = t.nickName, o = t.avatarUrl, n = t.gender, c = t.province, r = t.city, i = t.country;
                app.util.request({
                    url: "entry/wxapp/Useupdate",
                    data: {
                        openid: s,
                        nickname: e,
                        avatarUrl: o,
                        gender: n,
                        province: c,
                        city: r,
                        country: i
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            },
            fail: function() {
                app.util.selfinfoget(a.chenggfh);
            }
        });
    }
});