/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:15*/
var t = getApp();
Page({
    data: {
        page_sign: "order",
        page: 1,
        morePro: !1,
        baseinfo: [],
        orderinfo: [],
        type: 9,
        footer: {
            i_tel: t.globalData.i_tel,
            i_add: t.globalData.i_add,
            i_time: t.globalData.i_time,
            i_view: t.globalData.i_view,
            close: t.globalData.close,
            v_ico: t.globalData.v_ico
        }
    },
    onPullDownRefresh: function() {
        this.getinfos(), wx.stopPullDownRefresh()
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "我的拼团订单"
        });
        var o = t.util.url("entry/wxapp/BaseMin", {
            m: "sudu8_page"
        });
        wx.request({
            url: o,
            data: {
                vs1: 1
            },
            success: function(t) {
                e.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                })
            }
        }), a.type && e.setData({
            type: a.type
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), t.util.getUserInfo(e.getinfos, i)
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link,
            o = a.currentTarget.dataset.linktype;
        t.util.redirectto(e, o)
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                }), t.getList()
            }
        })
    },
    getList: function(a) {
        var e = this;
        wx.getStorageSync("openid"), t.util.request({
            url: "entry/wxapp/ptorderlist",
            data: {
                openid: wx.getStorageSync("openid")
            },
            success: function(t) {
                console.log(t.data.data), e.setData({
                    orderinfo: t.data.data
                }), console.log(e.data.orderinfo)
            }
        })
    },
    makePhoneCallB: function(t) {
        var a = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: a
        })
    },
    qrshouh: function(a) {
        var e = this,
            o = a.target.dataset.order,
            i = wx.getStorageSync("openid");
        t.util.request({
            url: "entry/wxapp/querenxc",
            data: {
                openid: i,
                orderid: o
            },
            success: function(t) {
                e.getList()
            }
        })
    }
});