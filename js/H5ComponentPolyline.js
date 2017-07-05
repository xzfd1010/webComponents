/**
 * Created by nick on 2017/7/3.
 */
/**
 * 柱图组件对象
 */

var H5ComponentPolyline = function (name, cfg) {
    // 散点图组件基于原有的H5ComponentBase组件
    var component = new H5ComponentBase(name, cfg);

    // 绘制网格线，除2是为了retina，而这里的宽度是给canvas用的，所以直接设置
    var w = cfg.width;
    var h = cfg.height;

    // 加入一个画布（用于做网格线背景）
    // 背景层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');

    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    // 水平网格线 100份 -> 10份
    var step = 10;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#aaa';

    window.ctx = ctx;

    for (var i = 0; i < step + 1; i++) {
        var y = (h / step) * i;
        ctx.moveTo(0, y);// 起始点
        ctx.lineTo(w, y);// 结束点
    }

    //垂直网格线  根据项目的格式分
    step = cfg.data.length + 1;
    var text_w = w / step >> 0;
    for (var i = 0; i < step + 1; i++) {
        var x = ( w / step) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);

        // 因为step + 1了，所以会存在取不到数据的情况
        if (cfg.data[i]) {
            var text = $('<div class="text">');
            text.text(cfg.data[i][0]);

            text.css('width', text_w / 2).css('left', x / 2 + text_w / 4);

            component.append(text);
        }

    }

    ctx.stroke();


    // 加入画布，数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    /**
     * 绘制折线以及对应的数据和阴影
     * @param per 从0到1之间的数据，会根据这个值绘制最终数据对应的中间状态
     */
    function draw(per) {

        // 清空画布
        ctx.clearRect(0, 0, w, h);

        // 绘制折线数据
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ff8878";

        var x = 0;
        var y = 0;
        var points = [];// 用于记录坐标

        // ctx.moveTo(10, 10);
        // 绘制一个圆，圆心x，y，半径r，起始角度，结束角度（弧度）
        // ctx.arc(10, 10, 5, 0, 2 * Math.PI);

        // step = cfg.data.length + 1;
        var row_w = w / (cfg.data.length + 1);
        // 画点
        // 此处的i是从0开始的，默认i是字符串
        for (i in cfg.data) {
            // item是对应的数据项
            var item = cfg.data[i];

            x = row_w * i + row_w;
            // row_w;
            y = h - (h * item[1] * per);
            points.push([x, y]);
            ctx.moveTo(x, y);
            ctx.arc(x, y, 5, 0, 2 * Math.PI);

        }

        // 连线
        // 移动画笔到第一个数据的点位
        ctx.moveTo(points[0][0], points[0][1]);
        for (i = 0; i < points.length - 1; i++) {
            var x = points[i][0];
            var y = points[i][1];

            // ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.lineTo(points[i + 1][0], points[i + 1][1])

        }

        // 为了让左右两侧的线消失
        ctx.stroke();

        ctx.lineWidth = 1;

        //绘制阴影
        // api：ctx.lineTo(x,x); ctx.stroke(); ctx.fill();
        var length = points.length;
        ctx.lineTo(points[length - 1][0], h);//当前最后一个点的x
        ctx.lineTo(points[0][0], h);
        // ctx.lineTo(points[0][0], points[0][1]);
        ctx.fillStyle = 'rgba(255, 138, 120, .2)';
        ctx.fill();

        // 写数据
        for (i = 0; i < points.length; i++) {
            item = cfg.data[i];
            var x = points[i][0];
            var y = points[i][1];
            ctx.moveTo(x, y);
            // 设置字体颜色
            ctx.fillStyle = item[2] ? item[2] : '#595959';
            ctx.fillText(((item[1] * 100) + '%'), x - 10, y - 10);
        }

        ctx.stroke();
    }

    // 折线图生长动画
    component.on('onLoad', function () {
        var s = 0;
        for (i = 0; i < 100; i++) {
            // 相当于闭包
            setTimeout(function () {
                s += .01;
                draw(s);
            }, i * 10 + 500)
            // i * 10 i是0～100，每一个的时间参数都不一样，所以这是一个渐缓的动画
        }
    });

    // 折线图退场动画
    component.on('onLeave', function () {
        var s = 1;
        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                s -= .01;
                draw(s);
            }, i * 10)
        }
    });



    return component;
};