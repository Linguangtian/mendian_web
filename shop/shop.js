/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:19*/
require("../../sudu8_page/resource/wxParse/wxParse.js");
var a = getApp();
Page({
    data: {
        page_sign: "store",
        footer: {
            i_tel: a.globalData.i_tel,
            i_add: a.globalData.i_add,
            i_time: a.globalData.i_time
        },
        baseinfo: [],
        minHeight: 220,
        lat: "",
        lon: "",
        address: "",
        content: ""
    },
    onPullDownRefresh: function() {
        var a = this.data.id;
        this.getbaseinfo(), this.getAbout(a)
    },
    onLoad: function(t) {
        var e = this,
            o = t.id;
        e.setData({
            id: o
        });
        var i = 0;
        t.fxsid && (i = t.fxsid, e.setData({
            fxsid: t.fxsid
        })), e.getbaseinfo(), a.util.getUserInfo(e.getinfos, i)
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
                a.getAbout(e)
            }
        })
    },
    getbaseinfo: function() {
        var t = this,
            e = a.util.url("entry/wxapp/Base", {
                m: "sudu8_page"
            });
        wx.request({
            url: e,
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                })
            },
            fail: function(a) {
                console.log(a)
            }
        })
    },
    getAbout: function(t) {
        var e = this;
        a.util.request({
            url: "entry/wxapp/showstore",
            data: {
                id: t
            },
            success: function(a) {
                console.log(a.data.data);
                a.data.data;
                e.setData({
                    aboutinfo: a.data.data,
                    lat: a.data.data.latitude,
                    lon: a.data.data.longitude,
                    address: a.data.data.address
                }), wx.setNavigationBarTitle({
                    title: e.data.aboutinfo.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh()
            }
        })
    },
    dianPhoneCall: function(a) {
        var t = a.currentTarget.dataset.index;
        wx.makePhoneCall({
            phoneNumber: t
        })
    },
    openMap: function() {
        var a = this;
        wx.openLocation({
            latitude: parseFloat(a.data.lat),
            longitude: parseFloat(a.data.lon),
            name: a.data.aboutinfo.name,
            address: a.data.address,
            scale: 22
        })
    },
    onShareAppMessage: function() {
        return {
            title: this.data.aboutinfo.title
        }
    }
});