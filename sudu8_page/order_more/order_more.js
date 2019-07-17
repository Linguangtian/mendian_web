function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var app = getApp();

Page({
    data: {
        title: "订单提交",
        yhq_hidden: 0,
        yhq: [ "不使用优惠券", "满100减10", "满200减30", "满500减100" ],
        yhq_i: 0,
        yhq_tishi: 1,
        yhq_u: 0,
        nav: 1,
        jqdjg: "请选择",
        jifen_u: 0,
        yhqid: 0,
        yhdq: 0,
        sfje: 0,
        szmoney: 0,
        dkmoney: 0,
        dkscore: 0,
        mjly: "",
        px: 0,
        yunfei: 0,
        yfjian: 0,
        zf_type: null
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: t.data.title
        }), wx.getSystemInfo({
            success: function(a) {
                t.setData({
                    h: a.windowHeight
                });
            }
        });
        var e = a.addressid, n = a.orderid;
        t.setData({
            addressid: e,
            orderid: n
        });
        var o = 0;
        a.fxsid && (o = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), app.util.request({
            url: "entry/wxapp/BaseMin",
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
        }), app.util.getUserInfo(t.getinfos, o);
    },
    makePhoneCallC: function(a) {
        var t = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.util.redirectto(t, e);
    },
    getinfos: function() {
        var s = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = a.data, e = s.data.addressid, i = s.data.orderid;
                s.setData({
                    openid: t
                }), e ? s.getmraddresszd(e) : s.getmraddress(), null != i && "undefined" != i ? app.util.request({
                    url: "entry/wxapp/duoorderinfo",
                    data: {
                        orderid: i
                    },
                    success: function(a) {
                        for (var t = a.data.data.jsondata, e = 0, n = 0; n < t.length; n++) {
                            var o = t[n].num, d = t[n].proinfo.price;
                            e += Math.round(1 * d * (1 * o) * 100) / 100;
                        }
                        s.setData({
                            jsdata: a.data.data.jsondata,
                            jsprice: e,
                            sfje: e,
                            px: 1,
                            orderid: i,
                            nav: "2" == a.data.data.nav ? 2 : 1
                        }), s.getmoneyoff();
                    }
                }) : wx.getStorage({
                    key: "jsdata",
                    success: function(a) {
                        for (var t = a.data, e = 0, n = 0; n < t.length; n++) {
                            var o = t[n].num, d = t[n].proinfo.price;
                            e += Math.round(1 * d * (1 * o) * 100) / 100;
                        }
                        s.setData({
                            jsdata: a.data,
                            jsprice: e,
                            sfje: e,
                            px: 0,
                            nav: 1
                        }), s.getmoneyoff();
                    }
                });
            }
        });
    },
    getmoneyoff: function() {
        var o = this;
        app.util.request({
            url: "entry/wxapp/getmoneyoff",
            success: function(a) {
                for (var t = a.data.data.moneyoff, e = "", n = 0; n < t.length; n++) n == t.length - 1 ? e += "满" + t[n].reach + "减" + t[n].del : e += "满" + t[n].reach + "减" + t[n].del + "，";
                o.setData({
                    moneyoff: t,
                    moneyoffstr: t ? e : ""
                }), o.getmyinfo();
            }
        });
    },
    getmyinfo: function() {
        var n = this, e = wx.getStorageSync("openid"), o = (n.data.jsdata, n.data.sfje), d = n.data.moneyoff;
        app.util.request({
            url: "entry/wxapp/mymoney",
            data: {
                openid: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                if (n.setData({
                    money: parseFloat(a.data.data.money),
                    score: parseFloat(a.data.data.score)
                }), app.util.request({
                    url: "entry/wxapp/mycoupon",
                    data: {
                        openid: e
                    },
                    success: function(a) {
                        n.setData({
                            couponlist: a.data.data
                        });
                    }
                }), console.log(d), d) for (var t = d.length - 1; 0 <= t; t--) if (o >= parseFloat(d[t].reach)) {
                    o -= parseFloat(d[t].del);
                    break;
                }
                console.log(o), app.util.request({
                    url: "entry/wxapp/yunfeiget",
                    success: function(a) {
                        var t = a.data.data, e = 0;
                        e = o >= t.byou ? 0 : t.yfei, o = Math.round(100 * (1 * o + 1 * e)) / 100, console.log("asd" + n.data.money), 
                        n.setData({
                            datas: t,
                            yunfei: e,
                            sfje: o,
                            zf_type: n.data.money >= o ? 0 : 1,
                            zf_money: n.data.money >= o ? o : Math.round(100 * (o - n.data.money)) / 100,
                            pagedata: t.forms
                        });
                    }
                });
            }
        });
    },
    switchChange: function(a) {
        for (var d = this, t = a.detail.value, e = wx.getStorageSync("openid"), n = d.data.jsdata, i = d.data.sfje, s = 0, o = [], r = 0; r < n.length; r++) {
            var u = {};
            u.num = n[r].num, u.pvid = n[r].pvid, o.push(u);
        }
        if (1 == t) app.util.request({
            url: "entry/wxapp/setgwcscore",
            data: {
                jsdata: JSON.stringify(o),
                openid: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                console.log(a.data.data);
                var t = a.data.data;
                s = t.moneycl;
                var e = t.gzmoney, n = t.gzscore;
                i < s && (s = parseInt(i));
                var o = s * n / e;
                i = Math.round(100 * (i - s)) / 100, d.setData({
                    sfje: i,
                    szmoney: s,
                    dkmoney: s,
                    dkscore: o,
                    zf_type: d.data.money >= i ? 0 : 1,
                    zf_money: d.data.money >= i ? i : Math.round(100 * (i - d.data.money)) / 100,
                    jifen_u: 1
                });
            }
        }); else {
            console.log(d.data.szmoney);
            s = d.data.szmoney;
            i += s, d.setData({
                sfje: i,
                zf_type: d.data.money >= i ? 0 : 1,
                zf_money: d.data.money >= i ? i : Math.round(100 * (i - d.data.money)) / 100,
                szmoney: 0,
                dkmoney: 0,
                dkscore: 0,
                jifen_u: 0
            });
        }
    },
    nav: function(a) {
        var t = this, e = parseInt(a.detail.value), n = 0, o = t.data.yunfei;
        1 == e ? n -= o : n = o;
        var d = Math.round(100 * (t.data.sfje - n)) / 100;
        t.setData({
            nav: e,
            yfjian: 1 == e ? 0 : o,
            sfje: d,
            zf_type: t.data.money >= d ? 0 : 1,
            zf_money: t.data.money >= d ? d : Math.round(100 * (d - t.data.money)) / 100
        });
    },
    add_address: function() {
        wx.navigateTo({
            url: "/sudu8_page/address/address?shareid=" + this.data.shareid + "&pid=" + this.data.id + "&orderid=" + this.data.orderid
        });
    },
    yhq_sub: function() {
        var a = this.data.yhq_i;
        this.setData({
            yhq_r: a,
            yhq_hidden: 0,
            yhq_tishi: 0
        });
    },
    yhq_block: function() {
        this.setData({
            yhq_hidden: 1
        });
    },
    yhq_choose: function(a) {
        var t = a.currentTarget.dataset.i;
        this.setData({
            yhq_i: t
        });
    },
    showModal: function() {
        var a = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        (this.animation = a).translateY(300).step(), this.setData({
            animationData: a.export(),
            showModalStatus: !0
        }), setTimeout(function() {
            a.translateY(0).step(), this.setData({
                animationData: a.export()
            });
        }.bind(this), 200);
    },
    hideModal: function() {
        var a = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        (this.animation = a).translateY(300).step(), this.setData({
            animationData: a.export()
        }), setTimeout(function() {
            a.translateY(0).step(), this.setData({
                animationData: a.export(),
                showModalStatus: !1
            });
        }.bind(this), 200);
    },
    getmraddress: function() {
        var e = this, a = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/getmraddress",
            data: {
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    mraddress: t
                });
            }
        });
    },
    getmraddresszd: function(a) {
        var e = this, t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/getmraddresszd",
            data: {
                openid: t,
                id: a
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    mraddress: t
                });
            }
        });
    },
    qxyh: function() {
        var a, t = this, e = t.data.jqdjg;
        t.data.yhdq;
        console.log(111), "请选择" == e && (e = 0);
        var n = (100 * t.data.sfje + 100 * e) / 100;
        t.hideModal(), t.setData((_defineProperty(a = {
            jqdjg: 0,
            yhqid: 0,
            sfje: n,
            zf_type: t.data.money >= n ? 0 : 1,
            zf_money: t.data.money >= n ? n : Math.round(100 * (n - t.data.money)) / 100
        }, "jqdjg", "请选择"), _defineProperty(a, "yhdq", 0), a));
    },
    getmoney: function(a) {
        var t = this, e = a.currentTarget.id, n = a.currentTarget.dataset.index, o = n.coupon.pay_money, d = t.data.sfje;
        d = 1 * d + 1 * t.data.yhdq;
        var i = t.data.yhqid;
        if (0 == i || n.id != i) if (1 * d - parseFloat(t.data.yunfei) + parseFloat(t.data.yfjian) < 1 * o) wx.showModal({
            title: "提示",
            content: "价格未满" + o + "元，不可使用该优惠券！",
            showCancel: !1
        }); else {
            var s = Math.floor(100 * (1 * d - 1 * e)) / 100;
            s < 0 && (s = 0), t.setData({
                jqdjg: e,
                yhqid: n.id,
                sfje: s,
                zf_type: t.data.money >= s ? 0 : 1,
                zf_money: t.data.money >= s ? s : Math.round(100 * (s - t.data.money)) / 100,
                oldsfje: d,
                yhdq: e
            }), t.hideModal();
        }
    },
    submit: function(a) {
        var t = this, e = a.detail.formId;
        t.setData({
            formId: e
        });
        var n = t.data.datas, o = t.data.mraddress;
        if (0 < n.formset) {
            if (1 == t.data.nav && (null == o || !o)) return wx.showModal({
                title: "提示",
                content: "请先选择/设置收货地址！",
                showCancel: !1
            }), !1;
            t.formSubmit();
        } else {
            if (1 == t.data.nav && (null == o || !o)) return wx.showModal({
                title: "提示",
                content: "请先选择/设置收货地址！",
                showCancel: !1
            }), !1;
            t.doshend();
        }
    },
    doshend: function(a) {
        for (var e = this, t = e.data.jsdata, n = [], o = 0; o < t.length; o++) {
            var d = {};
            d.baseinfo = t[o].baseinfo.id, d.proinfo = t[o].proinfo.id, d.num = t[o].num, d.pvid = t[o].pvid, 
            d.one_bili = t[o].one_bili, d.two_bili = t[o].two_bili, d.three_bili = t[o].three_bili, 
            t[o].buy_type ? d.id = 0 : d.id = t[o].id, n.push(d);
        }
        var i = wx.getStorageSync("openid"), s = e.data.yhqid, r = e.data.sfje, u = e.data.nav, c = e.data.yunfei, l = e.data.yfjian, p = e.data.dkscore, f = (e.data.dkmoney, 
        e.data.mraddress), h = e.data.mjly;
        if (c -= l, console.log(f), !(1 != u || null != f && f)) return wx.showModal({
            title: "提示",
            content: "请先选择/设置收货地址！",
            showCancel: !1
        }), !1;
        if (2 == u) ; else f.id;
        var y = e.data.px;
        if (console.log(t), console.log(c), console.log(p), 0 == y) app.util.request({
            url: "entry/wxapp/createorder",
            header: {
                "content-type": "application/json"
            },
            data: {
                types: "duo",
                openid: i,
                jsdata: JSON.stringify(n),
                couponid: s,
                price: r,
                dkscore: p,
                address: f.id,
                mjly: h,
                nav: u,
                formid: a,
                yunfei: c
            },
            success: function(a) {
                if (console.log(a), "1" == a.data.data.errcode) wx.showModal({
                    title: a.data.data.err,
                    content: "请重新下单",
                    showCancel: !1
                }); else if ("2" == a.data.data.errcode) wx.showModal({
                    title: a.data.data.err,
                    content: a.data.data.title + "还剩:" + a.data.data.kc
                }); else {
                    var t = a.data.data;
                    e.setData({
                        orderid: t
                    }), console.log(r), console.log(e.data.money), r <= e.data.money ? e.pay1(t) : e.pay2(t);
                }
            }
        }); else {
            var g = e.data.orderid;
            app.util.request({
                url: "entry/wxapp/duoorderchangegg",
                header: {
                    "content-type": "application/json"
                },
                data: {
                    orderid: g,
                    couponid: s,
                    price: r,
                    dkscore: p,
                    openid: i,
                    address: f.id,
                    mjly: h,
                    nav: u,
                    formid: a
                },
                success: function(a) {
                    r <= e.data.money ? e.pay1(g) : e.pay2(g);
                }
            });
        }
    },
    mjly: function(a) {
        var t = a.detail.value;
        this.setData({
            mjly: t
        });
    },
    bindInputChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        n[e].val = t, this.setData({
            pagedata: n
        });
    },
    bindPickerChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata, o = n[e].tp_text[t];
        n[e].val = o, this.setData({
            pagedata: n
        });
    },
    bindDateChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        n[e].val = t, this.setData({
            pagedata: n
        });
    },
    bindTimeChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        n[e].val = t, this.setData({
            pagedata: n
        });
    },
    checkboxChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        n[e].val = t, this.setData({
            pagedata: n
        });
    },
    radioChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        n[e].val = t, this.setData({
            pagedata: n
        });
    },
    formSubmit: function(a) {
        for (var e = this, t = (e.data.datas, !0), n = e.data.pagedata, o = 0; o < n.length; o++) if (1 == n[o].ismust && "" == n[o].val) return t = !1, 
        wx.showModal({
            title: "提醒",
            content: n[o].name + "为必填项！",
            showCancel: !1
        }), !1;
        t && app.util.request({
            url: "entry/wxapp/Formval",
            data: {
                id: 0,
                pagedata: JSON.stringify(n),
                types: "showOrder"
            },
            cachetime: "30",
            success: function(a) {
                var t = a.data.data.id;
                wx.showModal({
                    title: "提示",
                    content: a.data.data.con,
                    showCancel: !1,
                    success: function(a) {
                        e.sendMail_form(0, t), e.doshend(t);
                    }
                });
            }
        });
    },
    sendMail_form: function(a, t) {
        app.util.request({
            url: "entry/wxapp/sendMail_form",
            data: {
                id: a,
                cid: t
            },
            success: function(a) {
                return !0;
            },
            fail: function(a) {
                console.log("sendMail_order_fail");
            }
        });
    },
    choiceimg1111: function(a) {
        var d = this, t = 0, i = d.data.zhixin, s = a.currentTarget.dataset.index, r = d.data.pagedata, e = r[s].val, n = r[s].tp_text[0];
        e ? t = e.length : (t = 0, e = []);
        var o = n - t, u = app.util.url("entry/wxapp/wxupimg", {
            m: "sudu8_page"
        }), c = r[s].z_val ? r[s].z_val : [];
        wx.chooseImage({
            count: o,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                i = !0, d.setData({
                    zhixin: i
                }), wx.showLoading({
                    title: "图片上传中"
                });
                var t = a.tempFilePaths;
                e = e.concat(t), r[s].val = e, d.setData({
                    pagedata: r
                });
                var n = 0, o = t.length;
                !function e() {
                    wx.uploadFile({
                        url: u,
                        filePath: t[n],
                        name: "file",
                        success: function(a) {
                            var t = JSON.parse(a.data);
                            c.push(t), r[s].z_val = c, d.setData({
                                pagedata: r
                            }), ++n < o ? e() : (i = !1, d.setData({
                                zhixin: i
                            }), wx.hideLoading());
                        }
                    });
                }();
            }
        });
    },
    delimg: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.id, n = this.data.pagedata, o = n[t].val;
        o.splice(e, 1), 0 == o.length && (o = ""), n[t].val = o, this.setData({
            pagedata: n
        });
    },
    onPreviewImage: function(a) {
        app.util.showImage(a);
    },
    namexz: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.pagedata[t], n = [], o = 0; o < e.tp_text.length; o++) {
            var d = {};
            d.keys = e.tp_text[o], d.val = 1, n.push(d);
        }
        this.setData({
            ttcxs: 1,
            formindex: t,
            xx: n,
            xuanz: 0,
            lixuanz: -1
        }), this.riqi();
    },
    riqi: function() {
        for (var a = new Date(), t = new Date(a.getTime()), e = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(), n = this.data.xx, o = 0; o < n.length; o++) n[o].val = 1;
        this.setData({
            xx: n
        }), this.gettoday(e);
        var d = [], i = [], s = new Date();
        for (o = 0; o < 5; o++) {
            var r = new Date(s.getTime() + 24 * o * 3600 * 1e3), u = r.getFullYear(), c = r.getMonth() + 1, l = r.getDate(), p = c + "月" + l + "日", f = u + "-" + c + "-" + l;
            d.push(p), i.push(f);
        }
        this.setData({
            arrs: d,
            fallarrs: i,
            today: e
        });
    },
    xuanzd: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.fallarrs[t], n = this.data.xx, o = 0; o < n.length; o++) n[o].val = 1;
        this.setData({
            xuanz: t,
            today: e,
            lixuanz: -1,
            xx: n
        }), this.gettoday(e);
    },
    goux: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            lixuanz: t
        });
    },
    gettoday: function(a) {
        var o = this, t = o.data.id, e = o.data.formindex, d = o.data.xx;
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
                for (var t = a.data.data, e = 0; e < t.length; e++) d[t[e]].val = 2;
                var n = 0;
                t.length == d.length && (n = 1), o.setData({
                    xx: d,
                    isover: n
                });
            }
        });
    },
    save: function() {
        var a = this, t = a.data.today, e = a.data.xx, n = a.data.lixuanz;
        if (-1 == n) return wx.showModal({
            title: "提现",
            content: "请选择预约的选项",
            showCancel: !1
        }), !1;
        var o = "已选择" + t + "，" + e[n].keys, d = a.data.pagedata, i = a.data.formindex;
        d[i].val = o, d[i].days = t, d[i].indexkey = i, d[i].xuanx = n, a.setData({
            ttcxs: 0,
            pagedata: d
        });
    },
    quxiao: function() {
        this.setData({
            ttcxs: 0
        });
    },
    weixinadd: function() {
        var i = this;
        wx.chooseAddress({
            success: function(a) {
                for (var t = a.provinceName + " " + a.cityName + " " + a.countyName + " " + a.detailInfo, e = a.userName, n = a.telNumber, o = i.data.pagedata, d = 0; d < o.length; d++) 0 == o[d].type && 2 == o[d].tp_text[0] && (o[d].val = e), 
                0 == o[d].type && 3 == o[d].tp_text[0] && (o[d].val = n), 0 == o[d].type && 4 == o[d].tp_text[0] && (o[d].val = t);
                i.setData({
                    myname: e,
                    mymobile: n,
                    myaddress: t,
                    pagedata: o
                });
            }
        });
    },
    pay1: function(t) {
        var e = this;
        wx.showModal({
            title: "请注意",
            content: "您将使用余额支付" + e.data.sfje + "元",
            success: function(a) {
                a.confirm && (e.payover_do(t), e.payover_fxs(t));
            }
        });
    },
    pay2: function(t) {
        var e = this, a = wx.getStorageSync("openid"), n = e.data.sfje;
        app.util.request({
            url: "entry/wxapp/beforepay",
            data: {
                openid: a,
                price: n,
                order_id: t,
                types: "duo",
                formId: e.data.formId
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                console.log(a);
                -1 != [ 1, 2, 3, 4 ].indexOf(a.data.data.err) && wx.showModal({
                    title: "支付失败",
                    content: a.data.data.message,
                    showCancel: !1
                }), 0 == a.data.data.err && (console.log("调起支付"), app.util.request({
                    url: "entry/wxapp/savePrepayid",
                    data: {
                        types: "duo",
                        order_id: t,
                        prepayid: a.data.data.package
                    },
                    success: function(a) {
                        console.log(a);
                    }
                }), wx.requestPayment({
                    timeStamp: a.data.data.timeStamp,
                    nonceStr: a.data.data.nonceStr,
                    package: a.data.data.package,
                    signType: "MD5",
                    paySign: a.data.data.paySign,
                    success: function(a) {
                        console.log(a), wx.showToast({
                            title: "支付成功",
                            icon: "success",
                            duration: 3e3,
                            success: function(a) {
                                e.payover_fxs(t), wx.showToast({
                                    title: "购买成功！",
                                    icon: "success",
                                    success: function() {
                                        setTimeout(function() {
                                            wx.redirectTo({
                                                url: "/sudu8_page/order_more_list/order_more_list"
                                            });
                                        }, 1500);
                                    }
                                });
                            }
                        });
                    },
                    fail: function(a) {
                        console.log("fail");
                    },
                    complete: function(a) {
                        console.log("complete");
                    }
                }));
            }
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
                types: "duo"
            },
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    payover_do: function(a) {
        var t = wx.getStorageSync("openid"), e = this.data.sfje;
        app.util.request({
            url: "entry/wxapp/paynotify",
            data: {
                out_trade_no: a,
                openid: t,
                payprice: e,
                types: "duo",
                flag: 0,
                formId: this.data.formId
            },
            success: function(a) {
                console.log(a), wx.showToast({
                    title: "购买成功！",
                    icon: "success",
                    success: function() {
                        setTimeout(function() {
                            wx.redirectTo({
                                url: "/sudu8_page/order_more_list/order_more_list"
                            });
                        }, 1500);
                    }
                });
            }
        });
    }
});