var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp(), innerAudioContext = wx.createInnerAudioContext();

Page({
    data: {
        id: "",
        datas: "",
        pagedata: {},
        imgcount_xz: 0,
        pagedata_set: [],
        zh_all: 0,
        zh_now: 0,
        zhixin: !1,
        is_comment: 0,
        comm: 0,
        commSelf: 0,
        comments: [],
        commShow: 0,
        shareShow: 0,
        shareScore: 0,
        shareNotice: 0,
        videopay: 0,
        autoplay: !1,
        poster: "",
        navtel: "",
        xuanz: 0,
        lixuanz: -1,
        ttcxs: 0,
        share: 0,
        shareHome: 0,
        fxsid: 0,
        showLike: 0,
        art_price: "",
        music_price: "",
        loopPlay: "",
        music: "",
        musicAutoPlay: "",
        musicTitle: "",
        musicpay: 0,
        artpay: 1,
        audioplay: 1,
        duration: "",
        curTimeVal: "",
        durationDay: "播放获取",
        curTimeValDay: "00:00"
    },
    onReady: function() {
        this.audioCtx = wx.createAudioContext("myAudio");
    },
    audioPlay: function() {
        var s = this;
        s.setData({
            audioplay: 2
        }), innerAudioContext.play(), innerAudioContext.onPlay(function(a) {
            innerAudioContext.onTimeUpdate(function(a) {
                var t = innerAudioContext.duration, e = parseInt(t / 60);
                e < 10 && (e = "0" + e);
                var i = parseInt(t - 60 * e);
                i < 10 && (i = "0" + i);
                var n = innerAudioContext.currentTime, o = parseInt(n / 60);
                o < 10 && (o = "0" + o);
                var d = parseInt(n - 60 * o);
                d < 10 && (d = "0" + d), s.setData({
                    duration: 100 * innerAudioContext.duration.toFixed(2),
                    curTimeVal: 100 * innerAudioContext.currentTime.toFixed(2),
                    durationDay: e + ":" + i,
                    curTimeValDay: o + ":" + d
                });
            }), innerAudioContext.onEnded(function() {
                s.setStopState(s);
            });
        });
    },
    audioPause: function() {
        this.setData({
            audioplay: 1
        }), innerAudioContext.pause();
    },
    slideBar: function(a) {
        var t = a.detail.value;
        this.setData({
            curTimeVal: t / 100
        }), innerAudioContext.seek(this.data.curTimeVal);
    },
    updateTime: function(s) {
        innerAudioContext.onTimeUpdate(function(a) {
            var t = innerAudioContext.duration, e = parseInt(t / 60);
            e < 10 && (e = "0" + e);
            var i = parseInt(t - 60 * e);
            i < 10 && (i = "0" + i);
            var n = innerAudioContext.currentTime, o = parseInt(n / 60);
            o < 10 && (o = "0" + o);
            var d = parseInt(n - 60 * o);
            d < 10 && (d = "0" + d), s.setData({
                duration: 100 * innerAudioContext.duration.toFixed(2),
                curTimeVal: 100 * innerAudioContext.currentTime.toFixed(2),
                durationDay: e + ":" + i,
                curTimeValDay: o + ":" + d
            });
        }), innerAudioContext.duration.toFixed(2) - innerAudioContext.currentTime.toFixed(2) <= 0 && s.setStopState(s), 
        innerAudioContext.onEnded(function() {
            s.setStopState(s);
        });
    },
    setStopState: function(a) {
        a.setData({
            curTimeVal: 0
        }), innerAudioContext.stop();
    },
    onPullDownRefresh: function() {
        var a = this, t = a.data.id;
        a.getPoductDetail(t), a.setData({
            zhixin: !1
        });
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            id: e,
            page_signs: "/sudu8_page/showArt/showArt?id=" + e
        }), wx.showShareMenu({
            withShareTicket: !0
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, t.setData({
            fxsid: a.fxsid,
            shareHome: 1
        })), a.userid && t.setData({
            userid: a.userid
        }), app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(a) {
                a.data.data;
                t.setData({
                    baseinfo: a.data.data,
                    comm: a.data.data.commA,
                    comms: a.data.data.commAs
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), app.util.getUserInfo(t.getinfos, i);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.util.redirectto(t, e);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                e.setData({
                    openid: a.data
                });
                var t = e.data.id;
                e.getPoductDetail(t), e.givepscore();
            }
        });
    },
    follow: function(a) {
        var t = a.currentTarget.dataset.id;
        app.util.request({
            url: "entry/wxapp/commentFollow",
            cachetime: "0",
            data: {
                id: t
            },
            success: function(a) {
                1 == a.data.data.result && wx.showToast({
                    title: "点赞成功",
                    icon: "success",
                    duration: 1e3
                });
            }
        });
    },
    pinglun: function(a) {
        this.setData({
            pinglun_t: a.detail.value
        });
    },
    pinglun_sub: function() {
        var a = this.data.pinglun_t, t = this.data.id, e = wx.getStorageSync("openid");
        if ("" == a || null == a) return wx.showModal({
            content: "评论不能为空"
        }), !1;
        app.util.request({
            url: "entry/wxapp/comment",
            cachetime: "30",
            data: {
                pinglun_t: a,
                id: t,
                openid: e
            },
            success: function(a) {
                1 == a.data.data.result && (wx.showToast({
                    title: "评价提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "/sudu8_page/showArt/showArt?id=" + t
                    });
                }, 2e3));
            }
        });
    },
    getPoductDetail: function(t) {
        var l = this, a = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/productsDetail",
            data: {
                id: t,
                openid: a
            },
            cachetime: "0",
            success: function(a) {
                if (-1 != a.data.data.share_score.indexOf("http")) {
                    var t = encodeURIComponent(a.data.data.share_score);
                    wx.redirectTo({
                        url: "/sudu8_page/webpage/webpage?url=" + t
                    });
                }
                if (-1 != a.data.data.share_score.indexOf("sudu8_page") && wx.redirectTo({
                    url: a.data.data.share_score
                }), "" == a.data.data.etime) var e = a.data.data.ctime; else e = a.data.data.etime;
                if ("" == a.data.data.labels) var i = a.data.data.thumb; else i = a.data.data.labels;
                if ("false" == a.data.data.market_price) var n = !1; else n = !0;
                if (0 < parseInt(a.data.data.pro_flag)) {
                    if (a.data.data.navlistnum) {
                        var o = (100 / a.data.data.navlistnum).toFixed(2);
                        l.setData({
                            pro_flag: a.data.data.pro_flag,
                            navlist: a.data.data.navlist,
                            navwidth: o + "%"
                        });
                    }
                } else l.setData({
                    pro_flag: a.data.data.pro_flag
                });
                var d = a.data.data.likeArtList;
                d && 0 < d.length && l.setData({
                    showLike: 1
                });
                var s = a.data.data.music_art_info.music, r = a.data.data.musicpay, u = a.data.data.music_art_info.autoPlay, c = a.data.data.music_art_info.loopPlay;
                l.setData({
                    audioSrc: s
                }), innerAudioContext.src = s, 1 == r && 1 == u && (l.setData({
                    audioplay: 2
                }), innerAudioContext.autoplay = !0, innerAudioContext.onPlay(function() {
                    innerAudioContext.onTimeUpdate(function(a) {
                        var t = innerAudioContext.duration, e = parseInt(t / 60);
                        e < 10 && (e = "0" + e);
                        var i = parseInt(t - 60 * e);
                        i < 10 && (i = "0" + i);
                        var n = innerAudioContext.currentTime, o = parseInt(n / 60);
                        o < 10 && (o = "0" + o);
                        var d = parseInt(n - 60 * o);
                        d < 10 && (d = "0" + d), l.setData({
                            duration: 100 * innerAudioContext.duration.toFixed(2),
                            curTimeVal: 100 * innerAudioContext.currentTime.toFixed(2),
                            durationDay: e + ":" + i,
                            curTimeValDay: o + ":" + d
                        });
                    }), innerAudioContext.onEnded(function() {
                        l.setStopState(l);
                    });
                })), 1 == c && (innerAudioContext.loop = !0), l.setData({
                    id: a.data.data.id,
                    title: a.data.data.title,
                    time: e,
                    v: a.data.data.video,
                    videopay: a.data.data.videopay,
                    autoplay: n,
                    poster: i,
                    price: a.data.data.price,
                    block: a.data.data.btn.pic_page_btn,
                    pmarb: a.data.data.pmarb,
                    ptit: a.data.data.ptit,
                    datas: a.data.data,
                    pagedata: a.data.data.forms,
                    commSelf: a.data.data.comment,
                    art_price: a.data.data.music_art_info.art_price,
                    music_price: a.data.data.music_art_info.music_price,
                    loopPlay: c,
                    music: s,
                    musicTitle: a.data.data.music_art_info.musicTitle,
                    musicpay: r,
                    artpay: a.data.data.artpay
                }), a.data.data.text && WxParse.wxParse("content", "html", a.data.data.text, l, 0), 
                wx.setNavigationBarTitle({
                    title: l.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        }), app.util.request({
            url: "entry/wxapp/mymoney",
            data: {
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                l.setData({
                    mymoney: t.money,
                    globaluser: t
                });
            }
        }), setTimeout(function() {
            if (1 == l.data.comm && 0 != l.data.commSelf || 1 == l.data.commSelf) {
                l.setData({
                    commShow: 1
                });
                var a = l.data.comms;
                app.util.request({
                    url: "entry/wxapp/getComment",
                    cachetime: "0",
                    data: {
                        id: t,
                        comms: a
                    },
                    success: function(a) {
                        "" != a.data && l.setData({
                            comments: a.data.data,
                            is_comment: 1
                        });
                    }
                });
            }
        }, 500);
    },
    makePhoneCall: function(a) {
        var t = a.currentTarget.dataset.navtel;
        if ("" != t) wx.makePhoneCall({
            phoneNumber: t
        }); else {
            var e = this.data.baseinfo.tel;
            wx.makePhoneCall({
                phoneNumber: e
            });
        }
    },
    makePhoneCallB: function(a) {
        var t = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    openMap: function(a) {
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
        var a = wx.getStorageSync("openid"), t = this.data.id, e = "";
        return e = 1 == this.data.globaluser.fxs ? "/sudu8_page/showArt/showArt?id=" + t + "&userid=" + a : "/sudu8_page/showArt/showArt?id=" + t + "&userid=" + a + "&fxsid=" + a, 
        {
            title: this.data.title,
            path: e,
            success: function(a) {}
        };
    },
    bindInputChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata;
        i[e].val = t, this.setData({
            pagedata: i
        });
    },
    bindPickerChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata, n = i[e].tp_text[t];
        i[e].val = n, this.setData({
            pagedata: i
        });
    },
    bindDateChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata;
        i[e].val = t, this.setData({
            pagedata: i
        });
    },
    bindTimeChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata;
        i[e].val = t, this.setData({
            pagedata: i
        });
    },
    checkboxChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata;
        i[e].val = t, this.setData({
            pagedata: i
        });
    },
    radioChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata;
        i[e].val = t, this.setData({
            pagedata: i
        });
    },
    formSubmit: function(a) {
        for (var e = this, t = a.detail.formId, i = (e.data.datas, e.data.id), n = !0, o = e.data.pagedata, d = 0; d < o.length; d++) if (1 == o[d].ismust && "" == o[d].val) return n = !1, 
        wx.showModal({
            title: "提醒",
            content: o[d].name + "为必填项！",
            showCancel: !1
        }), !1;
        n && app.util.request({
            url: "entry/wxapp/Formval",
            data: {
                id: i,
                pagedata: JSON.stringify(o),
                types: "showArt",
                openid: wx.getStorageSync("openid"),
                form_id: t
            },
            success: function(a) {
                console.log(a);
                var t = a.data.data.id;
                wx.showModal({
                    title: "提示",
                    content: a.data.data.con + "，请支付款项",
                    showCancel: !1,
                    success: function(a) {
                        e.sendMail_form(i, t);
                    }
                });
            }
        });
    },
    sendMail_form: function(t, a) {
        app.util.request({
            url: "entry/wxapp/sendMail_form",
            data: {
                id: t,
                cid: a
            },
            success: function(a) {
                wx.redirectTo({
                    url: "/sudu8_page/showArt/showArt?id=" + t
                });
            },
            fail: function(a) {
                console.log("sendMail_order_fail");
            }
        });
    },
    choiceimg1111: function(a) {
        var o = this, t = 0, d = o.data.zhixin, s = a.currentTarget.dataset.index, r = o.data.pagedata, e = r[s].val, i = r[s].tp_text[0];
        e ? t = e.length : (t = 0, e = []);
        var n = i - t, u = app.util.url("entry/wxapp/wxupimg", {
            m: "sudu8_page"
        }), c = r[s].z_val ? r[s].z_val : [];
        wx.chooseImage({
            count: n,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                d = !0, o.setData({
                    zhixin: d
                }), wx.showLoading({
                    title: "图片上传中"
                });
                var t = a.tempFilePaths;
                e = e.concat(t), r[s].val = e, o.setData({
                    pagedata: r
                });
                var i = 0, n = t.length;
                !function e() {
                    wx.uploadFile({
                        url: u,
                        filePath: t[i],
                        name: "file",
                        success: function(a) {
                            var t = JSON.parse(a.data);
                            c.push(t), r[s].z_val = c, o.setData({
                                pagedata: r
                            }), ++i < n ? e() : (d = !1, o.setData({
                                zhixin: d
                            }), wx.hideLoading());
                        }
                    });
                }();
            }
        });
    },
    delimg: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.id, i = this.data.pagedata, n = i[t].val;
        n.splice(e, 1), 0 == n.length && (n = ""), i[t].val = n, this.setData({
            pagedata: i
        });
    },
    onPreviewImage: function(a) {
        app.util.showImage(a);
    },
    ffgk: function(a) {
        var t = this, e = t.data.id, i = t.data.mymoney, n = a.currentTarget.dataset.pay, o = a.currentTarget.dataset.type, d = wx.getStorageSync("openid");
        if (1 * n <= 1 * i) wx.showModal({
            title: "提醒",
            content: "您的余额为" + i + "元，本次将扣除" + n + "元",
            success: function(a) {
                a.confirm && app.util.request({
                    url: "entry/wxapp/videozhifu",
                    data: {
                        openid: d,
                        mykoumoney: n,
                        types: 1,
                        id: e,
                        artType: o
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        console.log(a), "1" == a.data.data.count && t.payover_fxs(a.data.data.order_id), 
                        t.getPoductDetail(e);
                    }
                });
            }
        }); else {
            var s = n - i;
            0 == i ? wx.showModal({
                title: "提醒",
                content: "您将微信支付" + s + "元",
                success: function(a) {
                    a.confirm && t.zhifu(s, i, e, o);
                }
            }) : wx.showModal({
                title: "提醒",
                content: "您将余额支付" + i + "元，微信支付" + s + "元",
                success: function(a) {
                    a.confirm && t.zhifu(s, i, e, o);
                }
            });
        }
    },
    zhifu: function(e, i, n, o) {
        var d = this, a = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/videozhifu",
            data: {
                openid: a,
                money: e,
                mykoumoney: i,
                types: 2,
                id: n
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var t = a.data.data.order_id;
                "success" == a.data.message && wx.requestPayment({
                    timeStamp: a.data.data.timeStamp,
                    nonceStr: a.data.data.nonceStr,
                    package: a.data.data.package,
                    signType: "MD5",
                    paySign: a.data.data.paySign,
                    success: function(a) {
                        wx.showToast({
                            title: "支付成功",
                            icon: "success",
                            duration: 3e3,
                            success: function(a) {
                                console.log("进来了嘛"), console.log(a), d.dosetmoney(e, i, n, t, o);
                            }
                        });
                    }
                });
            }
        });
    },
    dosetmoney: function(a, t, e, i, n) {
        var o = this, d = wx.getStorageSync("openid");
        e = o.data.id;
        app.util.request({
            url: "entry/wxapp/videogeng",
            data: {
                openid: d,
                money: a,
                mykoumoney: t,
                orderid: i,
                id: e,
                artType: n
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                "1" == a.data.data.count && o.payover_fxs(a.data.data.order_id), o.getPoductDetail(e);
            }
        });
    },
    namexz: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.pagedata[t], i = [], n = 0; n < e.tp_text.length; n++) {
            var o = {};
            o.keys = e.tp_text[n], o.val = 1, i.push(o);
        }
        this.setData({
            ttcxs: 1,
            formindex: t,
            xx: i,
            xuanz: 0,
            lixuanz: -1
        }), this.riqi();
    },
    riqi: function() {
        for (var a = new Date(), t = new Date(a.getTime()), e = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(), i = this.data.xx, n = 0; n < i.length; n++) i[n].val = 1;
        this.setData({
            xx: i
        }), this.gettoday(e);
        var o = [], d = [], s = new Date();
        for (n = 0; n < 5; n++) {
            var r = new Date(s.getTime() + 24 * n * 3600 * 1e3), u = r.getFullYear(), c = r.getMonth() + 1, l = r.getDate(), p = c + "月" + l + "日", x = u + "-" + c + "-" + l;
            o.push(p), d.push(x);
        }
        this.setData({
            arrs: o,
            fallarrs: d,
            today: e
        });
    },
    xuanzd: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.fallarrs[t], i = this.data.xx, n = 0; n < i.length; n++) i[n].val = 1;
        this.setData({
            xuanz: t,
            today: e,
            lixuanz: -1,
            xx: i
        }), this.gettoday(e);
    },
    goux: function(a) {
        var t = a.currentTarget.dataset.index;
        console.log(t), this.setData({
            lixuanz: t
        });
    },
    gettoday: function(a) {
        var n = this, t = n.data.id, e = n.data.formindex, o = n.data.xx;
        app.util.request({
            url: "entry/wxapp/Duzhan",
            data: {
                id: t,
                types: "showArt",
                days: a,
                pagedatekey: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                for (var t = a.data.data, e = 0; e < t.length; e++) o[t[e]].val = 2;
                var i = 0;
                t.length == o.length && (i = 1), n.setData({
                    xx: o,
                    isover: i
                });
            }
        });
    },
    save: function() {
        var a = this, t = a.data.today, e = a.data.xx, i = a.data.lixuanz;
        if (-1 == i) return wx.showModal({
            title: "提现",
            content: "请选择预约的选项",
            showCancel: !1
        }), !1;
        var n = "已选择" + t + "，" + e[i].keys, o = a.data.pagedata, d = a.data.formindex;
        o[d].val = n, o[d].days = t, o[d].indexkey = d, o[d].xuanx = i, console.log(o), 
        a.setData({
            ttcxs: 0,
            pagedata: o
        });
    },
    quxiao: function() {
        this.setData({
            ttcxs: 0
        });
    },
    weixinadd: function() {
        var d = this;
        wx.chooseAddress({
            success: function(a) {
                for (var t = a.provinceName + " " + a.cityName + " " + a.countyName + " " + a.detailInfo, e = a.userName, i = a.telNumber, n = d.data.pagedata, o = 0; o < n.length; o++) 0 == n[o].type && 2 == n[o].tp_text[0] && (n[o].val = e), 
                0 == n[o].type && 3 == n[o].tp_text[0] && (n[o].val = i), 0 == n[o].type && 4 == n[o].tp_text[0] && (n[o].val = t);
                console.log(n), d.setData({
                    myname: e,
                    mymobile: i,
                    myaddress: t,
                    pagedata: n
                });
            }
        });
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
        var a = this.data.id, t = this.data.userid, e = wx.getStorageSync("openid");
        t != e && 0 != t && "" != t && null != t && app.util.request({
            url: "entry/wxapp/giveposcore",
            data: {
                id: a,
                types: "showArt",
                openid: e,
                fxsid: t
            },
            success: function(a) {}
        });
    },
    payover_fxs: function(a) {
        var t = wx.getStorageSync("openid"), e = wx.getStorageSync("fxsid");
        app.util.request({
            url: "entry/wxapp/payoverFxs",
            data: {
                openid: t,
                order_id: a,
                fxsid: e,
                types: "art"
            },
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        });
    }
});