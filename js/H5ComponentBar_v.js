/**
 * Created by nick on 2017/7/3.
 */
/**
 * 柱图组件对象
 */

var H5ComponentBar_v = function (name, cfg) {
    // 基于componentBar组件修改
    var component = new H5ComponentBar(name, cfg);

    var width = (100 / cfg.data.length) >> 0; // 每个柱图中项目宽度的计算

    component.find('.line').width(width + '%'); // 设置宽度

    $.each(component.find('.rate'), function () {

        var w = $(this).css('width');

        // 把进度区的宽度重设为高度，并且取消原来的宽度
        $(this).height(w).width('');

        //不改变DOM结构，直接定位per，这样也无需处理居中的问题了
        $(this).siblings('.per').css('bottom', w)

    });

    // $.each(component.find('.per'), function () {
    //     // 重新调整 DOM 结构，把百分比数值（.per）添加到进度区（.rate）中，
    //     // 和色块元素（.bg）同级。提示，获得进度区元素：$(this).prev
    //     // $(this).appendTo($(this).prev())
    //     // $(this).css('bottom',)
    // });


    return component;
};