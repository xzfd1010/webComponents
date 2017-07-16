/**
 * Created by nick on 2017/7/11.
 */
/* 环图组件对象 */

var H5ComponentRing = function (name, cfg) {
    cfg.type = 'pie';

    //  环图应该只有一个数据
    if (cfg.data.length > 1) {
        cfg.data = [cfg.data[0]];
    }

    var component = new H5ComponentPie(name, cfg);

    // 设置遮盖层，利用scale设置半径
    var mask = $('<div class="mask">');

    component.addClass('h5_component_ring');

    component.append(mask);

    var text = component.find('.text');



    // 清空饼图的样式
    text.attr('style', '');

    // 设置文字的颜色
    if (cfg.data[0][2]) {
        text.css('color', cfg.data[0][2]);
    }

    // 在mask中添加文字
    mask.append(text);


    // 饼图生长动画


    return component;
}