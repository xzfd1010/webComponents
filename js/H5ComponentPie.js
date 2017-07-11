/**
 * Created by nick on 2017/7/3.
 */
/**
 * 柱图组件对象
 */

var H5ComponentPie = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg);

    // 绘制网格线——背景层
    var w = cfg.width;
    var h = cfg.height;
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    var r = w / 2;
    // 加入一个底图层
    ctx.beginPath();
    ctx.fillStyle = "#eee";
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.arc(r, r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // 绘制一个数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    var colors = ['red', 'green', 'blue', 'orange', 'gray'];//备用
    var sAngle = 1.5 * Math.PI; // 设置开始的角度在12点位置
    var eAngle = 0; // 结束角度
    var aAngle = Math.PI * 2; // 100%的圆结束的角度 2pi = 360

    // 测试
    // ctx.beginPath();
    // ctx.fillStyle = "#f00";
    // ctx.strokeStyle = '#eee';
    // ctx.lineWidth = 1;
    // ctx.moveTo(r,r);//到圆心
    // ctx.arc(r, r, r, sAngle, eAngle);
    // ctx.fill();
    // ctx.stroke();

    var step = cfg.data.length;
    for (var i = 0; i < step; i++) {

        var item = cfg.data[i];
        //颜色
        var color = item[2] || (item[2] = colors.pop());

        eAngle = sAngle + aAngle * item[1];

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.moveTo(r, r);//到圆心
        ctx.arc(r, r, r, sAngle, eAngle);
        ctx.fill();
        ctx.stroke();

        sAngle = eAngle;

        // 加入项目文本及百分比
        var text = $('<div class="text">');
        text.text(cfg.data[i][0]);

        var per = $('<div class="per">');
        per.text(cfg.data[i][1] * 100 + '%');
        text.append(per);

        var x = r + Math.sin(.5 * Math.PI - sAngle) * r;
        var y = r + Math.cos(.5 * Math.PI - sAngle) * r;

        // text.css('left', x / 2);
        // text.css('top', y / 2);

        if (x > w / 2) {
            text.css('left', x / 2);
        } else {
            text.css('right', (w - x) / 2);
        }

        if (y > h / 2) {
            text.css('top', y / 2);
        } else {
            text.css('bottom', (h - y) / 2);
        }

        if (cfg.data[2]) {
            text.css('color', cfg.data[2]);
        }

        text.css('opacity', 0);

        component.append(text);

    }

    // 加入一个蒙版层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex', 3);
    component.append(cns);


    ctx.fillStyle = "#eee";
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;


    //生长动画
    function draw(per) {
        ctx.clearRect(0, 0, w, h);

        // 加入一个底图层
        ctx.beginPath();

        ctx.moveTo(r, r);

        if (per <= 0) {
            ctx.arc(r, r, r, 0, 2 * Math.PI);
            component.find('.text').css('opacity', 0);
        } else {
            // true代表反向动画，不加true是渐显，加上true变为渐隐
            ctx.arc(r, r, r, sAngle, sAngle + 2 * Math.PI * per, true);
        }

        ctx.fill();
        ctx.stroke();

        if (per >= 1) {
            component.find('.text').css('opacity', 1);
            // 这里是为了处理环图层叠顺序
            $(cns).css('zIndex', -1);
        } else {
            $(cns).css('zIndex', 3);
        }
    }

    // 初始化蒙版
    draw(0);

    // 饼图生长动画
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

    // 饼图退场动画
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