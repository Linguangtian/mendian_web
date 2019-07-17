App({
    onLaunch: function() {
        var t = this;
        wx.getSystemInfo({
            success: function(e) {
                wx.setStorageSync("systemInfo", e);
                var i = e.windowWidth, n = e.windowHeight;
                t.globalData.ww = i, t.globalData.hh = n;
            }
        });
    },
    onShow: function() {},
    onHide: function() {},
    onError: function() {},
    util: require("sudu8_page/resource/js/util.js"),
    siteInfo: require("siteinfo.js"),
    bezier: function(e, i) {
        for (var n, t, u, o = [], s = 0; s <= i; s++) {
            for (u = e.slice(0), t = []; n = u.shift(); ) if (u.length) t.push(r([ n, u[0] ], s / i)); else {
                if (!(1 < t.length)) break;
                u = t, t = [];
            }
            o.push(t[0]);
        }
        function r(e, i) {
            var n, t, u, o, s, r, a, g;
            return n = e[0], o = (t = e[1]).x - n.x, s = t.y - n.y, u = Math.pow(Math.pow(o, 2) + Math.pow(s, 2), .5), 
            r = s / o, a = Math.atan(r), g = u * i, {
                x: n.x + g * Math.cos(a),
                y: n.y + g * Math.sin(a)
            };
        }
        return {
            bezier_points: o
        };
    },
    globalData: {
        userInfo: null,
        i_tel: "../../sudu8_page/resource/img/i_tel.png",
        i_add: "../../sudu8_page/resource/img/i_add.png",
        i_time: "../../sudu8_page/resource/img/i_time.png",
        close: "../../sudu8_page/resource/img/c.png",
        v_ico: "../../sudu8_page/resource/img/p.png",
        i_view: "../../sudu8_page/resource/img/i_view.png"
    }
});