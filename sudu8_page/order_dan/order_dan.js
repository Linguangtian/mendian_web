var app = getApp();

Page({
    data: {
        nav: 1,
        num: 1,
        jifen_u: 0,
        yunfei: 0,
        yfjian: 0,
        jqdjg: "请选择",
        yhqid: 0,
        yhdq: 0,
        dkmoney: 0,
        dkscore: 0,
        zf_type: null,
        pagedata: {},
        imgcount_xz: 0,
        pagedata_set: [],
        xuanz: 0,
        lixuanz: -1,
        ttcxs: 0,
        chooseNum: 0
    },
    onLoad: function(a) {
        var t = this;
        a.id && (t.data.id = a.id);
        var e = a.addressid, n = a.orderid;
        t.setData({
            addressid: e,
            orderid: n
        });
        var d = 0;
        a.fxsid && (d = a.fxsid, t.setData({
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
        }), app.util.getUserInfo(t.getinfos, d);
    },
    getinfos: function() {
        var d = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var e = a.data, t = d.data.addressid, n = d.data.orderid;
                d.setData({
                    openid: e
                }), t ? d.getmraddresszd(t) : d.getmraddress(), app.util.request({
                    url: "entry/wxapp/showPro",
                    data: {
                        openid: e,
                        id: d.data.id,
                        orderid: n || ""
                    },
                    success: function(a) {
                        if (console.log(a), 0 == a.data.data.pro_xz) var t = 1; else t = a.data.data.pro_xz - a.data.data.my_num;
                        d.setData({
                            mymoney: parseFloat(a.data.data.userinfo.money),
                            myscore: parseFloat(a.data.data.userinfo.score),
                            thumb: a.data.data.thumb,
                            title: a.data.data.title,
                            datass: a.data.data,
                            dprice: a.data.data.price,
                            hjjg: a.data.data.order_num ? a.data.data.price * a.data.data.order_num : a.data.data.price,
                            my_num: a.data.data.my_num,
                            xg_num: a.data.data.pro_xz,
                            shengyu: a.data.data.pro_kc,
                            xg_buy: t,
                            num: a.data.data.order_num ? a.data.data.order_num : 1,
                            pagedata: a.data.data.forms,
                            nav: n && "1" == a.data.data.nav ? 2 : 1
                        }), console.log("我的购买数" + d.data.my_num), wx.setNavigationBarTitle({
                            title: d.data.title
                        }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), 
                        app.util.request({
                            url: "entry/wxapp/mycoupon",
                            data: {
                                openid: e
                            },
                            success: function(a) {
                                d.setData({
                                    couponlist: a.data.data
                                });
                            }
                        }), app.util.request({
                            url: "entry/wxapp/getmoneyoff",
                            success: function(a) {
                                for (var t = a.data.data.moneyoff, e = "", n = 0; n < t.length; n++) n == t.length - 1 ? e += "满" + t[n].reach + "减" + t[n].del : e += "满" + t[n].reach + "减" + t[n].del + "，";
                                d.setData({
                                    moneyoff: t,
                                    moneyoffstr: t ? e : ""
                                }), d.getmyinfo();
                            }
                        });
                    }
                });
            }
        });
    },
    getmyinfo: function() {
        var n = this, a = (wx.getStorageSync("openid"), n.data.moneyoff), d = n.data.hjjg;
        if (a) for (var t = a.length - 1; 0 <= t; t--) if (d >= parseFloat(a[t].reach)) {
            d -= parseFloat(a[t].del);
            break;
        }
        app.util.request({
            url: "entry/wxapp/yunfeiget",
            success: function(a) {
                console.log(a);
                var t = a.data.data, e = 0;
                e = d >= t.byou ? 0 : t.yfei, d = Math.round(100 * (1 * d + 1 * e)) / 100, n.setData({
                    datas: t,
                    yunfei: e,
                    sfje: d,
                    zf_type: n.data.mymoney >= d ? 0 : 1,
                    zf_money: n.data.mymoney >= d ? d : Math.round(100 * (d - n.data.mymoney)) / 100
                });
            }
        });
    },
    switchChange: function(a) {
        var o = this, t = a.detail.value, e = wx.getStorageSync("openid"), i = o.data.sfje, s = 0;
        if (1 == t) app.util.request({
            url: "entry/wxapp/scoreDeduction",
            data: {
                id: o.data.id,
                num: o.data.num,
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
                var d = s * n / e;
                i = Math.round(100 * (i - s)) / 100, o.setData({
                    sfje: i,
                    dkmoney: s,
                    dkscore: d,
                    zf_type: o.data.mymoney >= i ? 0 : 1,
                    zf_money: o.data.mymoney >= i ? i : Math.round(100 * (i - o.data.mymoney)) / 100,
                    jifen_u: 1
                });
            }
        }); else {
            console.log(o.data.dkmoney);
            s = o.data.dkmoney;
            i += s, o.setData({
                sfje: i,
                zf_type: o.data.mymoney >= i ? 0 : 1,
                zf_money: o.data.mymoney >= i ? i : Math.round(100 * (i - o.data.mymoney)) / 100,
                dkmoney: 0,
                dkscore: 0,
                jifen_u: 0
            });
        }
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.util.redirectto(t, e);
    },
    onShow: function() {},
    onShareAppMessage: function() {},
    nav: function(a) {
        var t = this, e = parseInt(a.detail.value), n = 0, d = t.data.yunfei;
        1 == e ? n -= d : n = d;
        var o = Math.round(100 * (t.data.sfje - n)) / 100;
        t.setData({
            nav: e,
            yfjian: 1 == e ? 0 : d,
            sfje: o,
            zf_type: t.data.mymoney >= o ? 0 : 1,
            zf_money: t.data.mymoney >= o ? o : Math.round(100 * (o - t.data.mymoney)) / 100
        });
    },
    add_address: function() {
        wx.navigateTo({
            url: "/sudu8_page/address/address?shareid=" + this.data.shareid + "&pid=" + this.data.id + "&orderid=" + this.data.orderid
        });
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
    jian: function() {
        var a = this.data.num;
        --a <= 0 && (a = 1);
        var t = 100 * this.data.dprice * a / 100;
        this.setData({
            num: a,
            hjjg: t,
            dkmoney: 0,
            dkscore: 0,
            jifen_u: 0,
            jqdjg: "请选择",
            yhqid: 0,
            yhdq: 0,
            ischecked: !1
        }), this.getmyinfo();
    },
    jia: function() {
        var a = this, t = a.data.num, e = a.data.my_num, n = a.data.xg_num, d = a.data.shengyu, o = a.data.dprice;
        d < ++t && -1 != d && (t--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        })), n < t + e && 0 != n && (1 < t && t--, wx.showModal({
            title: "提醒",
            content: "该商品为限购产品，您总购买数已超过限额！",
            showCancel: !1
        }));
        var i = 100 * o * t / 100;
        a.setData({
            num: t,
            hjjg: i,
            dkmoney: 0,
            dkscore: 0,
            jifen_u: 0,
            jqdjg: "请选择",
            yhqid: 0,
            yhdq: 0,
            ischecked: !1
        }), a.getmyinfo();
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
    qxyh: function() {
        var a = this, t = a.data.yhdq;
        console.log(111);
        var e = a.data.sfje;
        e = (100 * e + 100 * t) / 100, a.hideModal(), a.setData({
            jqdjg: "请选择",
            yhqid: 0,
            sfje: e,
            zf_type: a.data.mymoney >= e ? 0 : 1,
            zf_money: a.data.mymoney >= e ? e : Math.round(100 * (e - a.data.mymoney)) / 100,
            yhdq: 0
        });
    },
    getmoney: function(a) {
        var t = this, e = a.currentTarget.id, n = a.currentTarget.dataset.index, d = n.coupon.pay_money, o = t.data.sfje;
        o = 1 * o + 1 * t.data.yhdq;
        var i = t.data.yhqid;
        0 != i && n.id == i || (1 * o - parseFloat(t.data.yunfei) + parseFloat(t.data.yfjian) < 1 * d ? wx.showModal({
            title: "提示",
            content: "价格未满" + d + "元，不可使用该优惠券！",
            showCancel: !1
        }) : ((o = Math.floor(100 * (1 * o - 1 * e)) / 100) < 0 && (o = 0), t.setData({
            jqdjg: e,
            yhqid: n.id,
            sfje: o,
            zf_type: t.data.mymoney >= o ? 0 : 1,
            zf_money: t.data.mymoney >= o ? o : Math.round(100 * (o - t.data.mymoney)) / 100,
            yhdq: e
        }), t.hideModal()));
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
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata, d = n[e].tp_text[t];
        n[e].val = d, this.setData({
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
        for (var e = this, n = (e.data.datas, e.data.id), t = !0, d = e.data.pagedata, o = 0; o < d.length; o++) if (1 == d[o].ismust && "" == d[o].val) return t = !1, 
        wx.showModal({
            title: "提醒",
            content: d[o].name + "为必填项！",
            showCancel: !1
        }), !1;
        t && app.util.request({
            url: "entry/wxapp/Formval",
            data: {
                id: n,
                pagedata: JSON.stringify(d),
                types: "showProDan"
            },
            cachetime: "30",
            success: function(a) {
                var t = a.data.data.id;
                wx.showModal({
                    title: "提示",
                    content: a.data.data.con,
                    showCancel: !1,
                    success: function(a) {
                        e.sendMail_form(n, t), e.doshend(t);
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
        var o = this, t = 0, i = o.data.zhixin, s = a.currentTarget.dataset.index, r = o.data.pagedata, e = r[s].val, n = r[s].tp_text[0];
        e ? t = e.length : (t = 0, e = []);
        var d = n - t, u = app.util.url("entry/wxapp/wxupimg", {
            m: "sudu8_page"
        }), c = r[s].z_val ? r[s].z_val : [];
        wx.chooseImage({
            count: d,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                i = !0, o.setData({
                    zhixin: i
                }), wx.showLoading({
                    title: "图片上传中"
                });
                var t = a.tempFilePaths;
                e = e.concat(t), r[s].val = e, o.setData({
                    pagedata: r
                });
                var n = 0, d = t.length;
                !function e() {
                    wx.uploadFile({
                        url: u,
                        filePath: t[n],
                        name: "file",
                        success: function(a) {
                            var t = JSON.parse(a.data);
                            c.push(t), r[s].z_val = c, o.setData({
                                pagedata: r
                            }), ++n < d ? e() : (i = !1, o.setData({
                                zhixin: i
                            }), wx.hideLoading());
                        }
                    });
                }();
            }
        });
    },
    delimg: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.id, n = this.data.pagedata, d = n[t].val;
        d.splice(e, 1), 0 == d.length && (d = ""), n[t].val = d, this.setData({
            pagedata: n
        });
    },
    onPreviewImage: function(a) {
        app.util.showImage(a);
    },
    namexz: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.pagedata[t], n = [], d = 0; d < e.tp_text.length; d++) {
            var o = {};
            o.keys = e.tp_text[d], o.val = 1, n.push(o);
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
        for (var a = new Date(), t = new Date(a.getTime()), e = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(), n = this.data.xx, d = 0; d < n.length; d++) n[d].val = 1;
        this.setData({
            xx: n
        }), this.gettoday(e);
        var o = [], i = [], s = new Date();
        for (d = 0; d < 5; d++) {
            var r = new Date(s.getTime() + 24 * d * 3600 * 1e3), u = r.getFullYear(), c = r.getMonth() + 1, l = r.getDate(), p = c + "月" + l + "日", f = u + "-" + c + "-" + l;
            o.push(p), i.push(f);
        }
        this.setData({
            arrs: o,
            fallarrs: i,
            today: e
        });
    },
    xuanzd: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.fallarrs[t], n = this.data.xx, d = 0; d < n.length; d++) n[d].val = 1;
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
        var d = this, t = d.data.id, e = d.data.formindex, o = d.data.xx;
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
                var n = 0;
                t.length == o.length && (n = 1), d.setData({
                    xx: o,
                    isover: n
                });
            }
        });
    },
    save_nb: function() {
        var a = this, t = a.data.today, e = a.data.xx, n = a.data.lixuanz;
        if (-1 == n) return wx.showModal({
            title: "提现",
            content: "请选择预约的选项",
            showCancel: !1
        }), !1;
        var d = "已选择" + t + "，" + e[n].keys.yval, o = a.data.pagedata, i = a.data.formindex;
        o[i].val = d, o[i].days = t, o[i].indexkey = i, o[i].xuanx = n, a.setData({
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
        var i = this;
        wx.chooseAddress({
            success: function(a) {
                for (var t = a.provinceName + " " + a.cityName + " " + a.countyName + " " + a.detailInfo, e = a.userName, n = a.telNumber, d = i.data.pagedata, o = 0; o < d.length; o++) 0 == d[o].type && 2 == d[o].tp_text[0].yval && (d[o].val = e), 
                0 == d[o].type && 3 == d[o].tp_text[0].yval && (d[o].val = n), 0 == d[o].type && 4 == d[o].tp_text[0].yval && (d[o].val = t);
                i.setData({
                    myname: e,
                    mymobile: n,
                    myaddress: t,
                    pagedata: d
                });
            }
        });
    },
    submit: function(a) {
        var t = this, e = a.detail.formId;
        t.setData({
            formId: e
        });
        var n = t.data.datas, d = t.data.mraddress;
        if (0 < n.formset) {
            if (1 == t.data.nav && (null == d || !d)) return wx.showModal({
                title: "提示",
                content: "请先选择/设置收货地址！",
                showCancel: !1
            }), !1;
            t.formSubmit();
        } else {
            if (1 == t.data.nav && (null == d || !d)) return wx.showModal({
                title: "提示",
                content: "请先选择/设置收货地址！",
                showCancel: !1
            }), !1;
            t.doshend();
        }
    },
    doshend: function(a) {
        var e = this, t = wx.getStorageSync("openid"), n = e.data.yhqid, d = e.data.sfje, o = e.data.nav, i = e.data.yunfei, s = e.data.yfjian, r = e.data.dkscore, u = (e.data.dkmoney, 
        e.data.mraddress), c = e.data.mjly, l = e.data.orderid;
        if (i -= s, console.log(u), !(1 != o || null != u && u)) return wx.showModal({
            title: "提示",
            content: "请先选择/设置收货地址！",
            showCancel: !1
        }), !1;
        if (2 == o) ; else u.id;
        console.log(i), console.log(r), app.util.request({
            url: "entry/wxapp/createorder",
            header: {
                "content-type": "application/json"
            },
            data: {
                pid: e.data.id,
                num: e.data.num,
                types: "miaosha",
                openid: t,
                couponid: n,
                price: d,
                dkscore: r,
                address: u.id,
                mjly: c,
                nav: o,
                formid: a,
                yunfei: i,
                orderid: l || ""
            },
            success: function(a) {
                if (console.log(a), "1" == a.data.data.errcode) wx.showModal({
                    title: a.data.data.err,
                    content: "请重新下单",
                    showCancel: !1
                }); else if ("2" == a.data.data.errcode) wx.showModal({
                    title: a.data.data.err,
                    content: a.data.data.can_buy <= 0 ? "去逛逛其他商品吧~" : "您还可购买" + a.data.data.can_buy + "件"
                }); else if ("3" == a.data.data.errcode) wx.showModal({
                    title: a.data.data.err,
                    content: "当前库存为" + a.data.data.kc + "件"
                }); else {
                    var t = a.data.data;
                    e.setData({
                        orderid: t
                    }), console.log(d), console.log(e.data.mymoney), d <= e.data.mymoney ? e.pay1(t) : e.pay2(t);
                }
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
                types: "miaosha",
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
                        types: "miaosha",
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
                                            wx.navigateBack({
                                                delta: 9
                                            }), wx.navigateTo({
                                                url: "/sudu8_page/orderlist_dan/orderlist_dan?type=9"
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
    payover_do: function(a) {
        var t = wx.getStorageSync("openid"), e = this.data.sfje;
        app.util.request({
            url: "entry/wxapp/paynotify",
            data: {
                out_trade_no: a,
                openid: t,
                payprice: e,
                types: "miaosha",
                flag: 0,
                formId: this.data.formId
            },
            success: function(a) {
                console.log(a), wx.showToast({
                    title: "购买成功！",
                    icon: "success",
                    success: function() {
                        setTimeout(function() {
                            wx.navigateBack({
                                delta: 9
                            }), wx.navigateTo({
                                url: "/sudu8_page/orderlist_dan/orderlist_dan?type=9"
                            });
                        }, 1500);
                    }
                });
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
                types: "miaosha"
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