/**
 * Created by nick on 2017/7/3.
 */
/**
 * 柱图组件对象
 */

var H5ComponentBar = function (name, cfg) {
    // 散点图组件基于原有的H5ComponentBase组件
    var component = new H5ComponentBase(name, cfg);
    // componentBase返回的是一个DOM元素对象（应该是jquery对象吧）

    $.each(cfg.data, function (idx, item) {

        var line = $('<div class="line">');
        var name = $('<div class="name">');
        var rate = $('<div class="rate">');
        var per = $('<div class="per">');

        // 用百分比设定宽度，相对于line
        var width = item[1] * 100 + '%';

        // 设置颜色
        var bgStyle = '';
        if (item[2]) {
            bgStyle = 'style="background-color:' + item[2] + '"';
        }

        // 操纵rate，后面的数字也会受到其影响；
        // 用于操作动画，rate的宽度是固定的
        // 操作bar，就只需要从0-100%，不需要关注rate的宽度
        rate.html('<div class="bg"' + bgStyle + '></div>');


        rate.css('width', width);

        name.text(item[0]);

        per.text(width);

        line.append(name).append(rate).append(per);

        component.append(line);

    });


    return component;
};