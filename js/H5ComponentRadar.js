/**
 * Created by nick on 2017/7/3.
 */
/**
 * 柱图组件对象
 */

var H5ComponentRadar = function (name, cfg) {
    // 散点图组件基于原有的H5ComponentBase组件
    var component = new H5ComponentBase(name, cfg);

    // 绘制网格线——背景层
    var w = cfg.width;
    var h = cfg.height;

    // 加入一个画布（用于做网格线背景）
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');

    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    var r = w / 2;
    var step = cfg.data.length;//数据条目

    // // 绘制圆心
    // ctx.beginPath();
    // ctx.arc(r, r, 5, 0, 2 * Math.PI);
    // ctx.stroke();
    //
    // // 绘制外圆
    // ctx.beginPath();
    // ctx.arc(r, r, r , 0, 2 * Math.PI);
    // ctx.stroke();

    // 计算一个圆周上的坐标（计算多边形的顶点坐标）
    // 已知：圆心坐标(a,b)、半径r；角度deg。
    // rad = (2 * Math.PI / 360) * (360 / step) * i;
    // x = a + Math.sin(rad) * r;
    // y = b + Math.cos(rad) * r;

    // 绘制网格背景（分面绘制，一共10个）
    var isBlue = false;//颜色切换
    for (var s = 10; s > 0; s--) {

        ctx.beginPath();
        for (var i = 0; i < step; i++) {
            var rad = (2 * Math.PI / 360) * (360 / step ) * i;
            // 就是2PI ／ step * i
            var x = r + Math.sin(rad) * r * (s / 10);
            var y = r + Math.cos(rad) * r * (s / 10);

            // ctx.moveTo(r, r);
            ctx.lineTo(x, y);
            // ctx.arc(x, y, 5, 0, 2 * Math.PI);
        }

        ctx.closePath();// 封闭起来
        ctx.fillStyle = (isBlue = !isBlue) ? '#99c0ff' : '#f1f9ff';
        ctx.fill();

    }
    // ctx.stroke();

    // 绘制伞骨
    for (var i = 0; i < step; i++) {
        var rad = (2 * Math.PI / 360) * (360 / step ) * i;
        // x，y是顶点坐标
        var x = r + Math.sin(rad) * r;
        var y = r + Math.cos(rad) * r;
        ctx.moveTo(r, r);
        ctx.lineTo(x, y);

        // 输出项目文字
        // 难点：不容易调整文字方向

        var text = $('<div class="text">');
        text.text(cfg.data[i][0]);

        // 文字渐次出现
        text.css('transition', 'all .5s ' + i * .1 + 's');

        // 这样写会挡住图表
        // text.css('left', x/2);
        // text.css('top', y / 2);

        // 控制对齐
        if (x > w / 2) {
            text.css('left', x / 2 + 5);
        } else {
            text.css('right', (w - x) / 2 + 5);
        }

        if (y > h / 2) {
            text.css('top', y / 2 + 5);
        } else {
            text.css('bottom', (h - y) / 2 + 5)
        }

        if (cfg.data[i][2]) {
            text.css('color', cfg.data[i][2]);
        }
        text.css('opacity', 0);

        component.append(text);

    }
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke();

    // 数据层的开发
    // 加入一个画布（数据层）
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    /**
     * 绘制雷达图以及对应的数据和阴影
     * @param per 从0到1之间的数据，会根据这个值绘制最终数据对应的中间状态
     */
    ctx.strokeStyle = '#f00';
    function draw(per) {
        if (per >= 1) {
            component.find('.text').css('opacity', 1)
        }
        if (per <= 1) {
            component.find('.text').css('opacity', 0)
        }
        ctx.clearRect(0, 0, w, h);
        //输出数据的折线
        for (var i = 0; i < step; i++) {
            var rad = (2 * Math.PI / 360) * (360 / step ) * i;
            var rate = cfg.data[i][1] * per;
            var x = r + Math.sin(rad) * r * rate;
            var y = r + Math.cos(rad) * r * rate;
            ctx.lineTo(x, y);
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            // ctx.fill();此时fill会有问题，需要把点和折线分开处理
        }
        ctx.closePath();
        ctx.stroke();

        // 分开填充数据点
        ctx.fillStyle = '#ff7676';
        for (var i = 0; i < step; i++) {
            var rad = (2 * Math.PI / 360) * (360 / step ) * i;
            var rate = cfg.data[i][1] * per;
            var x = r + Math.sin(rad) * r * rate;
            var y = r + Math.cos(rad) * r * rate;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
        ctx.stroke();
    }

    // draw(1)

    // 雷达图生长动画
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

    // 雷达图退场动画
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