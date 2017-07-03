/**
 * 散点图表组件对象
 */

var H5ComponentPoint = function (name, cfg) {
    // 散点图组件基于原有的H5ComponentBase组件
    // componentBase返回的是一个DOM元素对象（应该是jquery对象吧）
    var component = new H5ComponentBase(name, cfg);

    var base = cfg.data[0][1];// 第一个数据为参照

    // 循环data每一项的数据
    $.each(cfg.data, function (idx, item) {
        // idx代表索引，item代表项；
        // point是一个div
        var point = $('<div class="point point_' + idx + '">');
        // 将item的文本添加到point中
        var name = $('<div class="name">' + item[0] + '</div>');
        var rate = $('<div class="per">' + (item[1] * 100) + '%</div>');

        // 相应的元素添加到point中
        name.append(rate);
        point.append(name);

        var per = (item[1] / base * 100) + '%'; // 按比例缩小

        // 设置宽高；所有的点都在point组件中
        point.width(per).height(per);

        // 设置颜色，因为颜色可能不存在，所以用if判断。
        if (item[2]) {
            point.css('backgroundColor', item[2]);
        }

        // 设置位置，用第四项和第五项，分别代表x、y轴偏移
        if (item[3] !== undefined && item[4] !== undefined) {
            point.css('left', item[3]).css('top', item[4]);
            point.data('left', item[3]).data('top', item[4]);  // 暂存left、top到元素上
        }

        // 设置过渡
        point.css('zIndex', 100 - idx);
        point.css('left', 0).css('top', 0);
        point.css('transition', 'all 1s ' + idx * 0.5 + 's');
        component.append(point);
    });

    // onLoad之后取出暂存的left、top 并且附加到 CSS 中
    component.on('onLoad', function () {
        component.find('.point').each(function (idx, item) {
            $(item).css('left', $(item).data('left'))
                .css('top', $(item).data('top'));
        })
    });

    // onLeave之后，还原初始的位置
    component.on('onLeave', function () {
        component.find('.point').each(function (idx, item) {
            $(item).css('left', 0).css('top', 0);
        })
    });

    component.find('.point').on('click', function () {
        component.find('.point').removeClass('point_focus');
        $(this).addClass('point_focus');
        return false;
    }).eq(0).addClass('point_focus');

    return component;
};