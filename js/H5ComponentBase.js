/**
 * Created by nick on 2017/6/28.
 */
var H5ComponentBase = function (name, cfg) {
    var cfg = cfg || {};
    var id = ('h5_c_' + Math.random()).replace('.', '_');
    // 代表组件类型className,以及自定义的name
    var cls ='h5_component_name_' + name + ' h5_component_' + cfg.type;
    var component = $('<div class="h5_component ' + cls + '" id="' + id + '"></div>');

    //如果有text，写入component
    cfg.text && component.text(cfg.text);
    cfg.width && component.width(cfg.width / 2);// 切图以iphone为准的，需要处理为1倍图
    cfg.height && component.height(cfg.height / 2);// 切图以iphone为准的，需要处理为普通

    cfg.css && component.css(cfg.css);
    cfg.bg && component.css('backgroundImage', 'url(' + cfg.bg + ')');// 切图以iphone为准的，需要处理为普通

    if (cfg.center === true) {
        component.css({
            marginLeft: (cfg.width / 4 * -1) + 'px',
            left: '50%'
        })
    }

    //... 其他自定义参数，随用随加

    component.on('onLoad', function () {
        // 添加类名，代表load完成，并不应该指定任何动画
        component.addClass(cls + '_load').removeClass(cls+'_leave');
        cfg.animateIn && component.animate(cfg.animateIn);
        return false;
    });


    component.on('onLeave', function () {
        component.addClass(cls + '_leave').removeClass(cls+'_load');
        cfg.animateOut && component.animate(cfg.animateOut);
        return false;
    });

    return component;// 返回的是一个jquery对象
};