var app = getApp();

Page({
    data: {
        tximg: "",
        nnewm: "/sudu8_page/resource/img/u_food.png"
    },
    onPullDownRefresh: function() {
        this.getinfos(), wx.showLoading({
            title: "二维码生成中"
        });
    },
    onLoad: function(t) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "二维码生成"
        }), wx.showLoading({
            title: "二维码生成中"
        }), wx.getSystemInfo({
            success: function(t) {
                console.log(t), e.setData({
                    pwidth: t.screenWidth,
                    pheight: t.windowHeight,
                    wheight: t.windowHeight,
                    pixelRatio: t.pixelRatio
                });
            }
        }), app.util.request({
            url: "entry/wxapp/BaseMin",
            data: {
                vs1: 1
            },
            success: function(t) {
                wx.showLoading({
                    title: "二维码生成中"
                }), e.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            }
        });
        var a = t.id, i = t.type;
        e.setData({
            id: a,
            types: i
        });
        var o = 0;
        t.fxsid && (o = t.fxsid, e.setData({
            fxsid: t.fxsid
        })), app.util.getUserInfo(e.getinfos, o);
    },
    redirectto: function(t) {
        var e = t.currentTarget.dataset.link, a = t.currentTarget.dataset.linktype;
        app.util.redirectto(e, a);
    },
    getinfos: function() {
        var i = this;
        wx.showLoading({
            title: "二维码生成中"
        }), wx.getStorage({
            key: "openid",
            success: function(t) {
                var e = t.data;
                i.setData({
                    openid: e
                }), app.util.request({
                    url: "entry/wxapp/globaluserinfo",
                    data: {
                        openid: e
                    },
                    success: function(t) {
                        wx.showLoading({
                            title: "二维码生成中"
                        }), i.setData({
                            globaluser: t.data.data
                        });
                    }
                });
                var a = i.data.id;
                i.data.types;
                a ? (i.setData({
                    id: a
                }), i.getproinfo(a), i.ewm(a, 2)) : (i.ewm(0, 1), i.setData({
                    id: 0
                }));
            }
        });
    },
    getproinfo: function(t) {
        var a = this, e = wx.getStorageSync("openid");
        if ("PT" == a.data.types) {
            wx.showLoading({
                title: "二维码生成中"
            });
            var i = app.util.url("entry/wxapp/Ptproductinfo", {
                m: "sudu8_page_plugin_pt"
            });
            wx.request({
                url: i,
                data: {
                    id: t,
                    openid: e
                },
                success: function(t) {
                    wx.showLoading({
                        title: "二维码生成中"
                    });
                    var e = t.data.data.products;
                    a.setData({
                        pro: e
                    });
                }
            });
        } else wx.showLoading({
            title: "二维码生成中"
        }), app.util.request({
            url: "entry/wxapp/ProductsDetail",
            data: {
                id: t,
                openid: e
            },
            success: function(t) {
                wx.showLoading({
                    title: "二维码生成中"
                });
                var e = t.data.data;
                console.log(e), a.setData({
                    pro: e
                });
            }
        });
    },
    ewm: function(t, e) {
        var a = this;
        wx.showLoading({
            title: "二维码生成中"
        });
        var i = wx.getStorageSync("openid"), o = a.data.types;
        console.log(o), app.util.request({
            url: "entry/wxapp/shareewm",
            data: {
                openid: i,
                id: t,
                types: e,
                frompage: o
            },
            success: function(t) {
                wx.showLoading({
                    title: "二维码生成中"
                });
                var e = t.data.data;
                wx.getImageInfo({
                    src: e,
                    success: function(t) {
                        var e = t.path;
                        console.log(e), a.jibxx(e);
                    },
                    fail: function() {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            showCancel: !1,
                            content: "二维码生成失败，请稍后再试",
                            success: function(t) {}
                        });
                    }
                });
            }
        });
    },
    jibxx: function(o) {
        var s = this;
        if (wx.showLoading({
            title: "二维码生成中"
        }), 0 != s.data.id) {
            var t = s.data.pro.thumbimg;
            console.log(t);
            var n = 1;
            wx.getImageInfo({
                src: t,
                success: function(t) {
                    wx.showLoading({
                        title: "二维码生成中"
                    });
                    var e = t.path, a = t.width, i = t.height;
                    s.setData({
                        imgwidth: a,
                        imgheight: i
                    }), s.saveimg(e, o, n);
                },
                fail: function() {
                    wx.hideLoading(), wx.showModal({
                        title: "提示",
                        showCancel: !1,
                        content: "二维码生成失败，请稍后再试",
                        success: function(t) {}
                    });
                }
            });
        } else {
            wx.showLoading({
                title: "二维码生成中"
            });
            n = 2;
            app.util.request({
                url: "entry/wxapp/shareguiz",
                success: function(t) {
                    wx.showLoading({
                        title: "二维码生成中"
                    });
                    var e = t.data.data;
                    s.setData({
                        thumbimg: e
                    }), wx.getImageInfo({
                        src: e,
                        success: function(t) {
                            wx.showLoading({
                                title: "二维码生成中"
                            });
                            var e = t.width, a = t.height;
                            s.setData({
                                imgwidth: e,
                                imgheight: a
                            });
                            var i = t.path;
                            s.saveimg(i, o, n);
                        },
                        fail: function() {
                            wx.hideLoading(), wx.showModal({
                                title: "提示",
                                showCancel: !1,
                                content: "二维码生成失败！如开启远程附件，需设置https，并添加域名至小程序服务器域名downloadfile内！",
                                success: function(t) {}
                            });
                        }
                    });
                }
            });
        }
    },
    saveimg: function(t, e, a) {
        wx.showLoading({
            title: "二维码生成中"
        });
        var i = this, o = i.data.baseinfo.name, s = wx.createCanvasContext("myCanvas"), n = i.data.imgwidth, l = i.data.imgheight, d = i.data.pwidth, c = i.data.pheight, g = i.data.types;
        console.log("hhhhh"), console.log(g), s.setFillStyle("#ffffff"), c < 600 ? s.fillRect(0, 0, d, d + 140) : s.fillRect(0, 0, d, d + 160);
        var r = d * l / n;
        if (i.setData({
            heigts: r + 180
        }), s.drawImage(t, 0, 0, d, r), 1 == a) {
            var w = i.data.pro, h = w.title, u = w.price;
            s.setFillStyle("#333333"), s.setFontSize(14), s.setTextAlign("left");
            var f = h;
            if (s.fillText(f, 10, r + 30), "showArt" == g || "showPic" == g) {
                var p = "";
                s.fillText(p, d - 10, r + 30);
            } else {
                s.setFillStyle("#E7142F"), s.setFontSize(14), s.setTextAlign("right");
                p = "¥" + u;
                s.fillText(p, d - 10, r + 30);
            }
        }
        2 == a && (s.setFillStyle("#333333"), s.setFontSize(14), s.setTextAlign("center"), 
        s.fillText("<更多内容小程序内查看>", d / 2, r + 30)), s.setStrokeStyle("#dedede"), s.moveTo(10, r + 45), 
        s.lineTo(d - 10, r + 45), s.stroke(), s.setFillStyle("#666666"), c < 600 ? s.setFontSize(16) : s.setFontSize(18), 
        s.setTextAlign("left"), s.fillText("长按识别小程序码访问", 10, r + 80), s.setFillStyle("#666666"), 
        s.setFontSize(14), s.setTextAlign("left"), s.fillText(o, 10, r + 110), s.setFillStyle("#000000"), 
        s.setFontSize(14), s.setTextAlign("left"), s.fillText("", 80, 495), c < 600 ? s.drawImage(e, d - 100, r + 60, 80, 80) : s.drawImage(e, d - 120, r + 60, 100, 100), 
        s.draw(), wx.hideLoading();
    },
    saveimgdo: function() {
        var e = this;
        console.log(123), wx.getSetting({
            success: function(t) {
                t.authSetting["scope.writePhotosAlbum"] ? e.dosave() : wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    success: function() {
                        e.dosave();
                    },
                    fail: function() {
                        wx.openSetting();
                    }
                });
            }
        });
    },
    dosave: function() {
        var t = this.data.pwidth, e = this.data.heigts, a = this.data.pixelRatio;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: t,
            height: e,
            destWidth: t * a,
            destHeight: e * a,
            canvasId: "myCanvas",
            success: function(t) {
                wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function(t) {
                        wx.showModal({
                            title: "提醒",
                            content: "请转发您专属的分享图至好友、群。好友点击后，您将获得积分！",
                            showCancel: !1,
                            success: function(t) {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
                        });
                    },
                    fail: function(t) {
                        console.log("fail");
                    }
                });
            }
        });
    }
});