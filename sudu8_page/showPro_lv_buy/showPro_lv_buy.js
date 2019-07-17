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
        id: "",
        bg: "",
        couponlist: [],
        picList: [],
        datas: "",
        comment: "",
        jhsl: 1,
        dprice: "",
        yhje: 0,
        hjjg: "",
        sfje: "",
        order: "",
        pro_name: "",
        pro_tel: "",
        pro_address: "",
        pro_txt: "",
        my_num: "",
        xg_num: "",
        shengyu: "",
        userInfo: "",
        chuydate: "选择日期",
        chuytime: "选择时间",
        num: [],
        duogg: [],
        xz_num: [],
        couponprice: 0,
        jqdjg: "请选择",
        yhqid: "0",
        oldsfje: "",
        pagedata: {},
        imgcount_xz: 0,
        pagedata_set: [],
        zhixin: !1,
        xuanz: 0,
        lixuanz: -1,
        ttcxs: 0,
        chooseNum: 0
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            id: e
        }), "table" == a.type && t.setData({
            type: a.type,
            NowSelectStr: a.NowSelectStr,
            appoint_date: a.appoint_date
        }), console.log(a.NowSelectStr);
        var d = 0;
        a.fxsid && (d = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(a) {
                a.data.data;
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), app.util.getUserInfo(t.getinfos, d);
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
                e.getShowPic(t);
            }
        });
    },
    getShowPic: function(a) {
        var h = this, t = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/mycoupon",
            data: {
                openid: t,
                flag: 0
            },
            success: function(a) {
                h.setData({
                    couponlist: a.data.data
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), app.util.request({
            url: "entry/wxapp/showPro",
            data: {
                id: a,
                openid: t
            },
            cachetime: "30",
            success: function(a) {
                if (console.log(a.data.data.table), "table" != h.data.type) {
                    var t = h.data.yhje;
                    if (0 == a.data.data.pro_xz) e = 1; else var e = a.data.data.pro_xz - a.data.data.my_num;
                    for (var d = a.data.data.more_type_x, n = [], o = {}, s = 0, i = 0; i < d.length; i++) o[i] = 0, 
                    n.push(o), s += 0 * d[i][1];
                    h.setData({
                        bg: a.data.data.text[0],
                        picList: a.data.data.text,
                        title: a.data.data.title,
                        datas: a.data.data,
                        duogg: d,
                        hjjg: s,
                        dprice: s,
                        sfje: s - t,
                        xz_num: a.data.data.more_type_num,
                        num: n,
                        xg_num: a.data.data.pro_xz,
                        shengyu: a.data.data.pro_kc,
                        xg_buy: e,
                        pagedata: a.data.data.forms
                    });
                } else {
                    t = h.data.yhje;
                    var r, l, u = h.data.NowSelectStr.split(","), c = u.length;
                    for (i = 0; i < c; i++) r = u[i].split("a"), l = a.data.data.table.rowstr[r[0] - 1] + "，", 
                    l += a.data.data.table.columnstr[r[1] - 1], u[i] = l;
                    console.log(u), h.setData({
                        select_arr: u,
                        bg: a.data.data.text[0],
                        title: a.data.data.title,
                        datas: a.data.data,
                        hjjg: a.data.data.price * c,
                        dprice: a.data.data.price,
                        select_num: c,
                        sfje: Math.floor(100 * (a.data.data.price * c - t)) / 100,
                        pagedata: a.data.data.forms
                    });
                }
                console.log(h.data.pagedata), wx.setNavigationBarTitle({
                    title: h.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    jian: function(a) {
        var t = this, e = (t.data.yhje, a.currentTarget.dataset.testid), d = a.currentTarget.dataset.testkey, n = t.data.num[d][d], o = (t.data.duogg, 
        t.data.sfje), s = t.data.oldsfje, i = t.data.hjjg;
        if (--n < 0) n = 0; else {
            var r = Math.round(100 * s - 100 * e * n + 100 * e * (n - 1)) / 100;
            s = i = o = r;
            var l = t.data.num;
            l[d][d] = n;
            var u = t.data.chooseNum - 1;
            t.setData({
                num: l,
                sfje: o,
                hjjg: i,
                jqdjg: "请选择",
                oldsfje: s,
                yhqid: 0,
                chooseNum: u
            });
        }
    },
    jia: function(a) {
        var t = this, e = (t.data.yhje, a.currentTarget.dataset.testid), d = a.currentTarget.dataset.testkey, n = t.data.num[d][d], o = (t.data.duogg, 
        t.data.sfje), s = t.data.oldsfje, i = t.data.hjjg;
        if (t.data.xz_num[d].shennum < ++n) return n--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        var r = Math.round(100 * e * n + 100 * s - 100 * e * (n - 1)) / 100;
        i = s = o = r;
        var l = t.data.num;
        l[d][d] = n;
        var u = t.data.chooseNum + 1;
        t.setData({
            num: l,
            sfje: o,
            hjjg: i,
            jqdjg: "请选择",
            oldsfje: s,
            yhqid: 0,
            chooseNum: u
        });
    },
    userNameInput: function(a) {
        this.setData({
            pro_name: a.detail.value
        });
    },
    userTelInput: function(a) {
        this.setData({
            pro_tel: a.detail.value
        });
    },
    userAddInput: function(a) {
        this.setData({
            pro_address: a.detail.value
        });
    },
    userTextInput: function(a) {
        this.setData({
            pro_txt: a.detail.value
        });
    },
    save: function() {
        var a = this, t = a.data.jhsl, e = a.data.shengyu, d = a.data.type;
        if (e < t && -1 != e && "table" != d) return t--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        var n = a.data.sfje, o = wx.getStorageSync("openid"), s = (a.data.duogg, a.data.num), i = a.data.chuydate, r = a.data.chuytime, l = a.data.yhje, u = a.data.id, c = a.data.order, h = a.data.pro_name, p = a.data.pro_tel, g = a.data.pro_address, f = a.data.pro_txt, x = (a.data.id, 
        a.data.yhqid), w = !0;
        a.data.hjjg;
        if (0 == ("table" == d ? a.data.select_num : a.data.chooseNum)) return w = !1, wx.showModal({
            title: "提醒",
            content: "您至少要选择1个产品或服务",
            showCancel: !1
        }), !1;
        if (!h && 2 == a.data.datas.pro_flag) return w = !1, wx.showModal({
            title: "提醒",
            content: "姓名为必填！",
            showCancel: !1
        }), !1;
        if (!p && 2 == a.data.datas.pro_flag_tel) return w = !1, wx.showModal({
            title: "提醒",
            content: "手机号为必填！",
            showCancel: !1
        }), !1;
        if (!/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(p) && 2 == a.data.datas.pro_flag_tel) return wx.showModal({
            title: "提醒",
            content: "请输入有效的手机号码！",
            showCancel: !1
        }), !1;
        if (!g && 2 == a.data.datas.pro_flag_add) return w = !1, wx.showModal({
            title: "提醒",
            content: "地址为必填！",
            showCancel: !1
        }), !1;
        if ("0" == a.data.datas.tableid) {
            if ("选择日期" == i && 2 == a.data.datas.pro_flag_data) return w = !1, wx.showModal({
                title: "提醒",
                content: "请选择日期！",
                showCancel: !1
            }), !1;
            if ("选择时间" == r && 2 == a.data.datas.pro_flag_time) return w = !1, wx.showModal({
                title: "提醒",
                content: "请选择时间！",
                showCancel: !1
            }), !1;
        }
        console.log(r);
        for (var v = a.data.pagedata, y = 0; y < v.length; y++) if (1 == v[y].ismust && "" == v[y].val) return w = !1, 
        wx.showModal({
            title: "提醒",
            content: v[y].name + "为必填项！",
            showCancel: !1
        }), !1;
        w && app.util.request({
            url: "entry/wxapp/Dingd",
            data: {
                openid: o,
                num: JSON.stringify(s[0]),
                id: u,
                youhui: l,
                zhifu: n,
                order: c,
                pro_name: h,
                pro_tel: p,
                pro_address: g,
                pro_txt: f,
                chuydate: i,
                chuytime: r,
                yhqid: x,
                types: "table" == a.data.type ? "table" : "",
                NowSelectStr: a.data.NowSelectStr,
                appoint_date: a.data.appoint_date
            },
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                return 0 == t.data.data.success && 0 == t.data.data.syl ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！商品售完了！",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../showPro/showPro?id=" + t.data.data.id
                        });
                    }
                }), !1) : 0 == t.data.data.success && 0 < t.data.data.syl ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！商品只剩下" + t.data.data.syl + "个",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../showPro/showPro?id=" + t.data.data.id
                        });
                    }
                }), !1) : (1 == t.data.data.success && "NULL" == v && wx.navigateTo({
                    url: "../show_Pro_d/show_Pro_d?order=" + t.data.data.order_id
                }), 1 == t.data.data.success && "NULL" != v && app.util.request({
                    url: "entry/wxapp/Formval",
                    data: {
                        id: u,
                        pagedata: JSON.stringify(v),
                        types: "showPro_lv_buy",
                        order_id: t.data.data.order_id
                    },
                    cachetime: "30",
                    success: function(a) {
                        a.data.data.id;
                        wx.showModal({
                            title: "提示",
                            content: a.data.data.con,
                            showCancel: !1,
                            success: function() {
                                wx.navigateTo({
                                    url: "../show_Pro_d/show_Pro_d?order=" + t.data.data.order_id
                                });
                            }
                        });
                    }
                }), 2 == t.data.data.success ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！" + t.data.data.title + "只剩下" + t.data.data.shenyu + "个",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../showPro_lv/showPro_lv?id=" + t.data.data.id
                        });
                    }
                }), !1) : void 0);
            }
        });
    },
    bindDateChange2: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            chuydate: a.detail.value
        });
    },
    bindTimeChange2: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            chuytime: a.detail.value
        });
    },
    getmoney: function(a) {
        var t = a.currentTarget.id, e = a.currentTarget.dataset.index, d = e.coupon.pay_money, n = this.data.hjjg;
        if (1 * n < 1 * d) wx.showModal({
            title: "提示",
            content: "价格未满" + d + "元，不可使用该优惠券！",
            showCancel: !1
        }); else {
            var o = parseFloat(((100 * n - 100 * t) / 100).toPrecision(12));
            o < 0 && (o = 0), this.setData({
                jqdjg: t,
                yhqid: e.id,
                sfje: o,
                oldsfje: n
            });
        }
        this.hideModal();
    },
    qxyh: function() {
        var a = this.data.jqdjg;
        "请选择" == a && (a = 0);
        var t = this.data.sfje, e = Math.round(100 * t + 100 * a) / 100;
        this.hideModal(), this.setData(_defineProperty({
            jqdjg: 0,
            yhqid: 0,
            sfje: e
        }, "jqdjg", "请选择"));
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
    bindInputChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        d[e].val = t, this.setData({
            pagedata: d
        });
    },
    bindPickerChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log();
        var n = d[e].tp_text[t];
        d[e].val = n, this.setData({
            pagedata: d
        });
    },
    bindDateChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    bindTimeChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    checkboxChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    radioChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    choiceimg1111: function(a) {
        var o = this, t = 0, s = o.data.zhixin, i = a.currentTarget.dataset.index, r = o.data.pagedata, e = r[i].val, d = r[i].tp_text[0];
        e ? t = e.length : (t = 0, e = []);
        var n = d - t, l = app.util.url("entry/wxapp/wxupimg", {
            m: "sudu8_page"
        }), u = r[i].z_val ? r[i].z_val : [];
        wx.chooseImage({
            count: n,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                s = !0, o.setData({
                    zhixin: s
                }), wx.showLoading({
                    title: "图片上传中"
                });
                var t = a.tempFilePaths;
                e = e.concat(t), r[i].val = e, o.setData({
                    pagedata: r
                });
                var d = 0, n = t.length;
                !function e() {
                    wx.uploadFile({
                        url: l,
                        filePath: t[d],
                        name: "file",
                        success: function(a) {
                            var t = JSON.parse(a.data);
                            u.push(t), r[i].z_val = u, o.setData({
                                pagedata: r
                            }), ++d < n ? e() : (s = !1, o.setData({
                                zhixin: s
                            }), wx.hideLoading());
                        }
                    });
                }();
            }
        });
    },
    delimg: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.id, d = this.data.pagedata, n = d[t].val;
        n.splice(e, 1), 0 == n.length && (n = ""), d[t].val = n, this.setData({
            pagedata: d
        });
    },
    namexz: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.pagedata[t], d = [], n = 0; n < e.tp_text.length; n++) {
            var o = {};
            o.keys = e.tp_text[n], o.val = 1, d.push(o);
        }
        this.setData({
            ttcxs: 1,
            formindex: t,
            xx: d,
            xuanz: 0,
            lixuanz: -1
        }), this.riqi();
    },
    riqi: function() {
        for (var a = new Date(), t = new Date(a.getTime()), e = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(), d = this.data.xx, n = 0; n < d.length; n++) d[n].val = 1;
        this.setData({
            xx: d
        }), this.gettoday(e);
        var o = [], s = [], i = new Date();
        for (n = 0; n < 5; n++) {
            var r = new Date(i.getTime() + 24 * n * 3600 * 1e3), l = r.getFullYear(), u = r.getMonth() + 1, c = r.getDate(), h = u + "月" + c + "日", p = l + "-" + u + "-" + c;
            o.push(h), s.push(p);
        }
        this.setData({
            arrs: o,
            fallarrs: s,
            today: e
        });
    },
    xuanzd: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.fallarrs[t], d = this.data.xx, n = 0; n < d.length; n++) d[n].val = 1;
        this.setData({
            xuanz: t,
            today: e,
            lixuanz: -1,
            xx: d
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
                types: "showPro_lv_buy",
                days: a,
                pagedatekey: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                for (var t = a.data.data, e = 0; e < t.length; e++) o[t[e]].val = 2;
                var d = 0;
                t.length == o.length && (d = 1), n.setData({
                    xx: o,
                    isover: d
                });
            }
        });
    },
    save_nb: function() {
        var a = this, t = a.data.today, e = a.data.xx, d = a.data.lixuanz;
        if (-1 == d) return wx.showModal({
            title: "提现",
            content: "请选择预约的选项",
            showCancel: !1
        }), !1;
        var n = "已选择" + t + "，" + e[d].keys.yval, o = a.data.pagedata, s = a.data.formindex;
        o[s].val = n, o[s].days = t, o[s].indexkey = s, o[s].xuanx = d, console.log(o), 
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
        var s = this;
        wx.chooseAddress({
            success: function(a) {
                for (var t = a.provinceName + " " + a.cityName + " " + a.countyName + " " + a.detailInfo, e = a.userName, d = a.telNumber, n = s.data.pagedata, o = 0; o < n.length; o++) 0 == n[o].type && 2 == n[o].tp_text[0].yval && (n[o].val = e), 
                0 == n[o].type && 3 == n[o].tp_text[0].yval && (n[o].val = d), 0 == n[o].type && 4 == n[o].tp_text[0].yval && (n[o].val = t);
                console.log(n), s.setData({
                    myname: e,
                    mymobile: d,
                    myaddress: t,
                    pagedata: n
                });
            }
        });
    }
});