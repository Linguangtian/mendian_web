/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:10*/
var a = getApp();
Page({
    data: {
        page_sign: "order",
        page_signs: "/sudu8_page_plugin_exchange/order/order",
        orderlist: "",
        footer: {
            i_tel: a.globalData.i_tel,
            i_add: a.globalData.i_add,
            i_time: a.globalData.i_time,
            i_view: a.globalData.i_view,
            close: a.globalData.close,
            v_ico: a.globalData.v_ico
        }
    },
    onPullDownRefresh: function() {
        this.getinfos()
    },
    onLoad: function(t) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "我的积分订单"
        }), t.type && e.setData({
            type: t.type
        });
        var o = 0;
        t.fxsid && (o = t.fxsid, e.setData({
            fxsid: t.fxsid
        })), e.getBase(), a.util.getUserInfo(e.getinfos, o)
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                a.setData({
                    openid: t.data
                }), a.getList()
            }
        })
    },
    getBase: function() {
        var t = this,
            e = a.util.url("entry/wxapp/BaseMin", {
                m: "sudu8_page"
            });
        wx.request({
            url: e,
            data: {
                vs1: 1
            },
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
    redirectto: function(t) {
        var e = t.currentTarget.dataset.link,
            o = t.currentTarget.dataset.linktype;
        a.util.redirectto(e, o)
    },
    getList: function(t) {
        var e = this;
        wx.getStorageSync("openid"), a.util.request({
            url: "entry/wxapp/myscoreorder",
            data: {
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {
                console.log(a.data.data), e.setData({
                    orderlist: a.data.data
                })
            },
            fail: function(a) {
                console.log(a)
            }
        })
    },
    makePhoneCall: function(a) {
        var t = this.data.baseinfo.tel;
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
    }
});