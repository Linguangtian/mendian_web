var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        minHeight: 220,
        picList: [],
        datas: "",
        nowcon: "con",
        sc: 0,
        is_comment: 0,
        comm: 0,
        commSelf: 0,
        comments: [],
        commShow: 0,
        shareShow: 0,
        shareScore: 0,
        shareNotice: 0,
        fxsid: 0,
        heighthave: 0,
        serverBtn: 0,
        shareHome: 0,
        interval: 5e3,
        duration: 1e3,
        currentSwiper: 0,
        indicatorDots: !0,
        tableis: 0,
        bottom_edit: 0,
        current: 0,
        imgheights: [],
        NowSelectStr: ""
    },
    imageLoad: function(t) {
        var a = t.detail.width, e = a / (o = t.detail.height);
        console.log(a, o);
        var o = 750 / e, i = this.data.imgheights;
        i[t.currentTarget.dataset.id] = o, this.setData({
            imgheights: i
        });
    },
    bindchange: function(t) {
        this.setData({
            current: t.detail.current
        });
    },
    onPullDownRefresh: function() {
        var t = this.data.id;
        this.getShowPic(t);
    },
    onLoad: function(t) {
        var a = this, e = t.id;
        if (a.setData({
            id: e
        }), "1" == t.bottom_edit) {
            var o = t.NowSelectStr, i = t.appoint_date, s = o ? o.split(",").length : 0;
            a.setData({
                NowSelectStr: o,
                appoint_date: i,
                appoint_num: s,
                bottom_edit: parseInt(t.bottom_edit)
            });
        }
        wx.showShareMenu({
            withShareTicket: !0
        });
        var n = 0;
        t.fxsid && (n = t.fxsid, a.setData({
            fxsid: t.fxsid,
            shareHome: 1
        })), t.userid && a.setData({
            userid: t.userid
        }), app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(t) {
                t.data.data;
                a.setData({
                    baseinfo: t.data.data,
                    comm: t.data.data.commP,
                    comms: t.data.data.commPs
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                });
            }
        }), app.util.getUserInfo(a.getinfos, n);
    },
    redirectto: function(t) {
        var a = t.currentTarget.dataset.link, e = t.currentTarget.dataset.linktype;
        app.util.redirectto(a, e);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                e.setData({
                    openid: t.data
                });
                var a = e.data.id;
                e.getShowPic(a), e.givepscore();
            }
        });
    },
    follow: function(t) {
        var a = t.currentTarget.dataset.id;
        app.util.request({
            url: "entry/wxapp/commentFollow",
            cachetime: "0",
            data: {
                id: a
            },
            success: function(t) {}
        }), wx.showToast({
            title: "点赞成功",
            icon: "success",
            duration: 1e3
        });
    },
    pinglun: function(t) {
        this.setData({
            pinglun_t: t.detail.value
        });
    },
    pinglun_sub: function() {
        var t = this.data.pinglun_t, a = this.data.id, e = wx.getStorageSync("openid");
        if ("" == t || null == t) return wx.showModal({
            content: "评论不能为空"
        }), !1;
        app.util.request({
            url: "entry/wxapp/comment",
            cachetime: 0,
            data: {
                pinglun_t: t,
                id: a,
                openid: e
            },
            success: function(t) {
                console.log(t), 1 == t.data.data.result && (wx.showToast({
                    title: "评价提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "/sudu8_page/showPro_lv/showPro_lv?id=" + a
                    });
                }, 2e3));
            }
        });
    },
    tabChange: function(t) {
        var a = t.currentTarget.dataset.id;
        this.setData({
            nowcon: a
        });
    },
    getShowPic: function(a) {
        var e = this, t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/globaluserinfo",
            data: {
                openid: t
            },
            success: function(t) {
                e.setData({
                    globaluser: t.data.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/showPro",
            data: {
                id: a,
                openid: t,
                types: "showPro_lv"
            },
            cachetime: "30",
            success: function(t) {
                console.log(t), e.setData({
                    id: a,
                    picList: t.data.data.text,
                    title: t.data.data.title,
                    datas: t.data.data,
                    comment: WxParse.wxParse("comment", "html", t.data.data.product_txt, e, 5),
                    my_num: t.data.data.my_num,
                    xg_num: t.data.data.pro_xz,
                    sc: t.data.data.collectcount,
                    commSelf: t.data.data.comment,
                    tableis: t.data.data.tableis,
                    appoint_price: 1 == e.data.bottom_edit ? e.data.appoint_num * t.data.data.price : 0
                }), wx.setNavigationBarTitle({
                    title: e.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        }), setTimeout(function() {
            if ("1" == e.data.comm && "0" != e.data.commSelf || "1" == e.data.commSelf) {
                var t = e.data.comms;
                e.setData({
                    commShow: 1
                }), app.util.request({
                    url: "entry/wxapp/getComment",
                    cachetime: "0",
                    data: {
                        id: a,
                        comms: t
                    },
                    success: function(t) {
                        "" != t.data && e.setData({
                            comments: t.data.data,
                            is_comment: 1,
                            commShow: 1
                        });
                    }
                });
            }
        }, 500);
    },
    collect: function(t) {
        var e = this, a = t.currentTarget.dataset.name, o = wx.getStorageSync("openid");
        0 == e.data.sc ? (wx.showLoading({
            title: "收藏中"
        }), app.util.request({
            url: "entry/wxapp/Collect",
            data: {
                openid: o,
                types: "showPro_lv",
                id: a
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                var a = t.data.data;
                "收藏成功" == a ? e.setData({
                    sc: 1
                }) : e.setData({
                    sc: 0
                }), wx.showToast({
                    title: a,
                    icon: "succes",
                    duration: 1e3,
                    mask: !0
                });
            }
        })) : (wx.showLoading({
            title: "取消收藏中"
        }), app.util.request({
            url: "entry/wxapp/Collect",
            data: {
                openid: o,
                types: "showPro_lv",
                id: a
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                var a = t.data.data;
                "取消收藏成功" == a ? e.setData({
                    sc: 0
                }) : e.setData({
                    sc: 1
                }), wx.showToast({
                    title: a,
                    icon: "succes",
                    duration: 1e3,
                    mask: !0
                });
            }
        })), setTimeout(function() {
            wx.hideLoading();
        }, 1e3);
    },
    swiperLoad: function(o) {
        var i = this;
        wx.getSystemInfo({
            success: function(t) {
                var a = o.detail.width / o.detail.height, e = t.windowWidth / a;
                i.data.heighthave || i.setData({
                    minHeight: e,
                    heighthave: 1
                });
            }
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
    shareClo: function() {
        this.setData({
            shareShow: 0
        });
    },
    onShareAppMessage: function() {
        var t = wx.getStorageSync("openid"), a = this.data.id, e = "";
        return e = 1 == this.data.globaluser.fxs ? "/sudu8_page/showPro_lv/showPro_lv?id=" + a + "&userid=" + t : "/sudu8_page/showPro_lv/showPro_lv?id=" + a + "&userid=" + t + "&fxsid=" + t, 
        {
            title: this.data.title,
            path: e,
            success: function(t) {}
        };
    },
    share111: function() {
        this.setData({
            share: 1
        });
    },
    share_close: function() {
        this.setData({
            share: 0
        });
    },
    givepscore: function() {
        var t = this.data.id, a = this.data.userid, e = wx.getStorageSync("openid");
        a != e && 0 != a && "" != a && app.util.request({
            url: "entry/wxapp/giveposcore",
            data: {
                id: t,
                types: "showPro_lv",
                openid: e,
                fxsid: a
            },
            success: function(t) {}
        });
    },
    topay: function() {
        0 == this.data.appoint_num ? wx.showModal({
            title: "提示",
            content: "您尚未选择商品",
            showCancel: !1
        }) : wx.navigateTo({
            url: "../showPro_lv_buy/showPro_lv_buy?id=" + this.data.id + "&NowSelectStr=" + this.data.NowSelectStr + "&type=table&appoint_date=" + this.data.appoint_date
        });
    }
});