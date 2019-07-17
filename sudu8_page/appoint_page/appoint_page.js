var week = require("../resource/js/date_week.js"), app = getApp();

Page({
    data: {
        id: 0,
        date_: "",
        date: "",
        table: [],
        NowSelect: [],
        otherSelect: [],
        NowSelectStr: "",
        weekday: [ "", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ]
    },
    onLoad: function(t) {
        var e = this, a = t.id, o = t.tableid;
        if (e.setData({
            tableid: o,
            id: a
        }), t.appoint_date) {
            var r = new Date(t.appoint_date).getDay();
            r = t.appoint_date + " (" + e.data.weekday[r] + ")";
        }
        var s = t.startdate ? t.startdate : week.getDates(1)[0].year + "-" + week.getDates(1)[0].month + "-" + week.getDates(1)[0].day;
        e.setData({
            start: t.startdate ? t.startdate : s,
            date_: t.appoint_date ? t.appoint_date : s,
            date: t.appoint_date ? r : s + " (" + week.getDates(1)[0].week + ")"
        }), t.NowSelectStr && e.setData({
            NowSelectStr: t.NowSelectStr
        }), e.getbase(), e.proTable(), e.getSelected();
    },
    getbase: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/BaseMin",
            cachetime: "30",
            data: {
                vs1: 1
            },
            success: function(t) {
                e.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    proTable: function() {
        var l = this;
        app.util.request({
            url: "entry/wxapp/proTable",
            data: {
                tableid: l.data.tableid
            },
            success: function(t) {
                console.log(t);
                var e = t.data.data;
                if (l.setData({
                    table: e
                }), "" != l.data.NowSelectStr) {
                    for (var a = l.data.NowSelectStr.split(","), o = [], r = [], s = 0; s < a.length; s++) o = a[s].split("a"), 
                    r[s] = {}, r[s].row = e.rowstr[parseInt(o[0]) - 1], r[s].column = e.columnstr[parseInt(o[1]) - 1];
                    l.setData({
                        selected: r,
                        NowSelect: a
                    });
                }
                wx.setNavigationBarTitle({
                    title: t.data.data.name
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    selectThis: function(t) {
        var e = this, a = t.currentTarget.dataset.num, o = e.data.NowSelect;
        o.push(a);
        for (var r = [], s = [], l = 0; l < o.length; l++) r = o[l].split("a"), s[l] = {}, 
        s[l].row = e.data.table.rowstr[parseInt(r[0]) - 1], s[l].column = e.data.table.columnstr[parseInt(r[1]) - 1];
        var d = o.join(",");
        e.setData({
            selected: s,
            NowSelect: o,
            NowSelectStr: d
        });
    },
    removeThis: function(t) {
        for (var e = this, a = t.currentTarget.dataset.num, o = e.data.NowSelect, r = 0; r < o.length; r++) o[r] == a && o.splice(r, 1);
        for (var s = [], l = [], d = 0; d < o.length; d++) s = o[d].split("a"), l[d] = {}, 
        l[d].row = e.data.table.rowstr[parseInt(s[0]) - 1], l[d].column = e.data.table.columnstr[parseInt(s[1]) - 1];
        var n = o.join(",");
        e.setData({
            selected: l,
            NowSelect: o,
            NowSelectStr: n
        });
    },
    bindDateChange: function(t) {
        for (var e = [], a = 0; a < 1; a++) {
            var o = week.dateLater(t.detail.value, a);
            e.push(o);
        }
        return this.setData({
            date_: t.detail.value,
            date: e[0].year + "-" + e[0].month + "-" + e[0].day + " (" + e[0].week + ")"
        }), this.getSelected(), e;
    },
    getSelected: function() {
        var a = this;
        console.log(a.data.date_), console.log(a.data.id), app.util.request({
            url: "entry/wxapp/getSelected",
            data: {
                date: a.data.date_,
                id: a.data.id
            },
            success: function(t) {
                var e = t.data.data.split(",");
                console.log(e), a.setData({
                    otherSelect: e
                });
            }
        });
    }
});