/*源码A社区社区：www.aaxcx.cn   time:2018-09-26 11:40:20*/
var t = require("../../sudu8_page/resource/wxParse/wxParse.js"),
    a = getApp();
Page({
    data: {
        baseurl: a.globalData.baseurl,
        imgUrls: [],
        indicatorDots: !1,
        autoplay: !1,
        interval: 5e3,
        duration: 1e3,
        check: 0,
        yyzz: "",
        logo: "",
        avatar: "",
        nickname: "",
        slide: "",
        catename: "请选择所属分类",
        apply_success: !1
    },
    onLoad: function(t) {
        var a = this;
        wx.setNavigationBarTitle({
            title: "商户注册"
        }), a.getBase(), wx.getSystemInfo({
            success: function(t) {
                a.setData({
                    h: t.windowHeight
                })
            }
        }), a.getslide_m(), wx.getStorageSync("openid") ? a.is_apply() : a.getopenid()
    },
    getBase: function() {
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
                }), wx.setNavigationBarTitle({
                    title: "全部分类"
                })
            }
        })
    },
    getslide_m: function() {
        var e = this;
        a.util.request({
            url: "entry/wxapp/getslide_m",
            success: function(a) {
                a.data.data.protocol && t.wxParse("content", "html", a.data.data.protocol, e, 5), e.setData({
                    system_name: a.data.data.system_name,
                    slide: a.data.data.bg,
                    category: a.data.data.category
                })
            }
        })
    },
    is_apply: function() {
        var t = this;
        a.util.request({
            url: "entry/wxapp/is_apply",
            data: {
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {
                console.log(a), 1 == a.data.data.is_apply && wx.showModal({
                    title: "提示",
                    showCancel: !1,
                    content: "您已提交申请，请等待管理员审核",
                    success: function(t) {
                        wx.redirectTo({
                            url: "/sudu8_page/index/index"
                        })
                    }
                }), 2 == a.data.data.is_apply && t.setData({
                    apply_success: !0,
                    data_username: a.data.data.data.username,
                    data_password: a.data.data.data.password,
                    data_url: a.data.data.data.url
                }), 3 == a.data.data.is_apply && wx.showModal({
                    title: "提示",
                    showCancel: !1,
                    content: "您的申请未通过，请重新申请！"
                })
            }
        })
    },
    getopenid: function() {
        var t = this;
        wx.login({
            success: function(a) {
                wx.request({
                    url: t.data.baseurl + "getopenid",
                    data: {
                        code: a.code
                    },
                    success: function(a) {
                        1 == a.data.openid ? wx.showModal({
                            title: "提示",
                            content: "获取openid失败"
                        }) : (wx.setStorage({
                            key: "openid",
                            data: a.data.openid
                        }), t.is_apply())
                    },
                    fail: function() {}
                })
            }
        })
    },
    onShareAppMessage: function() {},
    check_change: function() {
        var t = this;
        0 == t.data.check ? t.setData({
            check: 1
        }) : t.setData({
            check: 0
        })
    },
    xieyi_close: function() {
        this.setData({
            xieyi_block: 0
        })
    },
    xieyi_hidden: function() {
        this.setData({
            xieyi_block: 1,
            check: 0
        })
    },
    yyzz_upload: function() {
        var t = this;
        wx.chooseImage({
            count: 1,
            sizeType: ["original", "compressed"],
            sourceType: ["album", "camera"],
            success: function(a) {
                t.setData({
                    yyzz: a.tempFilePaths[0]
                }), console.log(a)
            }
        })
    },
    logo_upload: function() {
        var t = this;
        wx.chooseImage({
            count: 1,
            sizeType: ["original", "compressed"],
            sourceType: ["album", "camera"],
            success: function(a) {
                t.setData({
                    logo: a.tempFilePaths[0]
                })
            }
        })
    },
    formSubmit: function(t) {
        var e = this;
        if (0 == e.data.check) return wx.showToast({
            title: "请先阅读协议",
            icon: "none"
        }), !1;
        var o = t.detail.value;
        if ("" == o.username) return wx.showModal({
            title: "提示",
            content: "请输入手机号",
            showCancel: !1
        }), !1;
        if ("" == o.password) return wx.showModal({
            title: "提示",
            content: "请输入密码",
            showCancel: !1
        }), !1;
        if ("" == o.cid) return wx.showModal({
            title: "提示",
            content: "请选择分类",
            showCancel: !1
        }), !1;
        if ("" == o.name) return wx.showModal({
            title: "提示",
            content: "请输入商户名称",
            showCancel: !1
        }), !1;
        if ("" == o.tel) return wx.showModal({
            title: "提示",
            content: "请输入商户电话",
            showCancel: !1
        }), !1;
        if ("" == o.address) return wx.showModal({
            title: "提示",
            content: "请输入商户地址",
            showCancel: !1
        }), !1;
        if ("" == o.latlong) return wx.showModal({
            title: "提示",
            content: "请填写经纬度",
            showCancel: !1
        }), !1;
        if ("" == o.worktime) return wx.showModal({
            title: "提示",
            content: "请输入营业时间",
            showCancel: !1
        }), !1;
        if ("" == o.intro) return wx.showModal({
            title: "提示",
            content: "请输入一句话简介",
            showCancel: !1
        }), !1;
        if ("" == o.yyzz) return wx.showModal({
            title: "提示",
            content: "请上传营业执照",
            showCancel: !1
        }), !1;
        if ("" == o.logo) return wx.showModal({
            title: "提示",
            content: "请上传商户logo",
            showCancel: !1
        }), !1;
        o.openid = wx.getStorageSync("openid"), o.cid = e.data.cid;
        var n = a.util.url("entry/wxapp/uploadImg", {
            m: "sudu8_page_plugin_shop"
        });
        wx.uploadFile({
            url: n,
            filePath: e.data.yyzz,
            name: "file",
            success: function(t) {
                var a = JSON.parse(t.data);
                o.yyzz = a.data
            }
        }), wx.uploadFile({
            url: n,
            filePath: e.data.logo,
            name: "file",
            success: function(t) {
                var a = JSON.parse(t.data);
                o.logo = a.data
            },
            complete: function(t) {
                a.util.request({
                    url: "entry/wxapp/shopApply",
                    data: {
                        formdata: JSON.stringify(o)
                    },
                    method: "POST",
                    header: {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    success: function(t) {
                        console.log(t), wx.showToast({
                            title: "申请成功",
                            icon: "success",
                            duration: 2e3,
                            success: function() {
                                wx.redirectTo({
                                    url: "/sudu8_page/index/index"
                                })
                            }
                        })
                    }
                })
            }
        })
    },
    bindPickerChange: function(t) {
        var a = this,
            e = t.detail.value;
        a.setData({
            cid: a.data.category[e].id,
            catename: a.data.category[e].name
        })
    },
    getLatlong: function() {
        var t = this;
        wx.chooseLocation({
            success: function(a) {
                t.setData({
                    latlong: Math.floor(1e6 * a.latitude) / 1e6 + "," + Math.floor(1e6 * a.longitude) / 1e6
                })
            }
        })
    }
});