var app = getApp();

Page({
    data: {
        page_signs: "/sudu8_page/fenxiao_account/fenxiao_account"
    },
    onPullDownRefresh: function() {
        this.getmzh();
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "我的账户"
        }), wx.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#fafafa"
        });
        var t = 0;
        a.fxsid && (t = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), app.util.request({
            url: "entry/wxapp/BaseMin",
            data: {
                vs1: 1
            },
            success: function(a) {
                if (a.data.data.video) var t = "show";
                if (a.data.data.c_b_bg) var o = "bg";
                e.setData({
                    baseinfo: a.data.data,
                    show_v: t,
                    c_b_bg1: o
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                }), e.getmzh();
            },
            fail: function(a) {
                console.log(a);
            }
        }), app.util.getUserInfo(e.getinfos, t);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, o = a.currentTarget.dataset.linktype;
        app.util.redirectto(t, o);
    },
    getinfos: function() {
        var o = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = a.data;
                o.setData({
                    openid: t
                });
            }
        });
    },
    account_tixian: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_tixian/fenxiao_tixian"
        });
    },
    fenxiao_order: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_order/fenxiao_order"
        });
    },
    tixian_record: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_tixian_do/fenxiao_tixian_do"
        });
    },
    getmzh: function() {
        var t = this, a = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/getmzh",
            data: {
                openid: a
            },
            success: function(a) {
                console.log(a.data.data), t.setData({
                    myzh: a.data.data.userinfo,
                    yj: a.data.data.wfmoney
                });
            }
        });
    }
});