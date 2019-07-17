/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:19*/
var t = getApp(),
    a = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
    ];
Page({
    data: {
        page_sign: "shopsList",
        page: 1,
        morePro: !1,
        baseinfo: [],
        cid: 0,
        cate: [],
        footer: {
            i_tel: t.globalData.i_tel,
            i_add: t.globalData.i_add,
            i_time: t.globalData.i_time,
            i_view: t.globalData.i_view,
            close: t.globalData.close,
            v_ico: t.globalData.v_ico
        },
        showMenu: !1,
        subMenuDisplay: ["hidden", "hidden", "hidden", "hidden"],
        subMenuHighLight: a,
        cover: "",
        menuCss: ["ordinary", "ordinary", "ordinary", "ordinary"],
        rotateRight: ["", "", "", "", ""],
        menuContent: [{
            title: "全部分类",
            content: ["全部分类"]
        }, {
            title: "综合排序",
            content: ["综合排序", "距离最近"]
        }, {
            title: "所有商家",
            content: ["所有商家", "优选商家"]
        }],
        content: [],
        indexListHouse: [],
        lastIndex: null,
        times: 1,
        longitude: "",
        latitude: ""
    },
    onLoad: function(t) {
        var a = this;
        t.cid && a.setData({
            cid: t.cid
        });
        t.fxsid && (t.fxsid, a.setData({
            fxsid: t.fxsid
        })), a.getBase(), a.getCate(a.data.cid)
    },
    onShow: function() {
        var a = this;
        wx.getLocation({
            type: "wgs84",
            success: function(e) {
                a.data.latitude = e.latitude, a.data.longitude = e.longitude, t.util.getUserInfo(a.getinfos, a.data.fxsid)
            }
        })
    },
    onReachBottom: function() {
        var a = this;
        a.data.page++, t.util.request({
            url: "entry/wxapp/selectShopList",
            data: {
                option1: a.data.menuContent[0].title,
                option2: a.data.menuContent[1].title,
                option3: a.data.menuContent[2].title,
                longitude: a.data.longitude,
                latitude: a.data.latitude,
                page: a.data.page
            },
            cachetime: "30",
            success: function(t) {
                console.log(t), a.setData({
                    shopList: a.data.shopList.concat(t.data.data)
                })
            }
        })
    },
    getinfos: function() {
        var t = this,
            a = t.data.cid;
        wx.getStorage({
            key: "openid",
            success: function(e) {
                t.setData({
                    openid: e.data
                }), t.getShopList(a)
            }
        })
    },
    getBase: function() {
        var a = this,
            e = t.util.url("entry/wxapp/Base", {
                m: "sudu8_page"
            });
        wx.request({
            url: e,
            success: function(t) {
                a.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                }), wx.setNavigationBarTitle({
                    title: "商户列表"
                })
            }
        })
    },
    tapMainMenu: function(t) {
        var a = this,
            e = t.currentTarget.dataset.index;
        a.data.lastIndex == e ? (a.data.times++, 2 == a.data.times ? a.setData({
            showMenu: !1
        }) : a.setData({
            showMenu: !0,
            content: a.data.menuContent[e].content,
            times: 1
        })) : a.setData({
            showMenu: !0,
            content: a.data.menuContent[e].content,
            times: 1
        }), a.data.lastIndex = e
    },
    tapSubMenu: function(a) {
        var e = this,
            n = e.data.menuContent,
            i = a.currentTarget.dataset.index;
        n[e.data.lastIndex].title = e.data.content[i], e.setData({
            menuContent: n,
            showMenu: !1,
            times: 2,
            page: 1
        }), t.util.request({
            url: "entry/wxapp/selectShopList",
            data: {
                option1: e.data.menuContent[0].title,
                option2: e.data.menuContent[1].title,
                option3: e.data.menuContent[2].title,
                longitude: e.data.longitude,
                latitude: e.data.latitude,
                page: 1
            },
            cachetime: "30",
            success: function(t) {
                console.log(t), e.setData({
                    shopList: t.data.data
                })
            }
        })
    },
    switchCate: function(t) {
        var a = this,
            e = t.currentTarget.dataset.cid,
            n = t.currentTarget.dataset.name;
        a.getShopList(e), a.setData({
            nowCate: n,
            changeShow1: "hide",
            changeShow2: "hide",
            changeShow3: "show"
        })
    },
    getShopList: function(a) {
        var e = this;
        t.util.request({
            url: "entry/wxapp/selectShopList",
            data: {
                cid: a,
                longitude: e.data.longitude,
                latitude: e.data.latitude
            },
            cachetime: "30",
            success: function(t) {
                console.log(t), e.setData({
                    shopList: t.data.data
                })
            }
        })
    },
    getCate: function(a) {
        var e = this;
        t.util.request({
            url: "entry/wxapp/getCate",
            success: function(t) {
                for (var n = e.data.menuContent, i = 0; i < t.data.data.length; i++) n[0].content.push(t.data.data[i].name);
                if (console.log(t.data.data), a) for (var o = e.data.menuContent, s = t.data.data, d = 0; d < s.length; d++) s[d].id == a && (o[0].title = s[d].name, e.setData({
                    menuContent: o
                }));
                e.setData({
                    cate: t.data.data
                })
            }
        })
    },
    makePhoneCall: function(t) {
        var a = t.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: a
        })
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.cateinfo.name + "-" + t.data.baseinfo.name
        }
    }
});