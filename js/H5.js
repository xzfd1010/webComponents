/**
 * Created by nick on 2017/6/28.
 */
var H5 = function () {
    this.id = ('h5_' + Math.random()).replace('.', '_');
    // 先隐藏
    this.el = $('<div class="h5" id="' + this.id + '">').hide();

    this.page = [];

    // 添加到page中
    $('body').append(this.el);

    /**
     * 新增一个页
     * @param {string} name 组件的名称，会加入到className中
     * @param {string} text 页内的默认文本
     * @return {H5} H5对象，可以重复使用H5对象支持的方法
     */
    this.addPage = function (name, text) {
        var page = $('<div class="section h5_page">');

        if (name !== undefined) {
            page.addClass('h5_page_' + name);
        }
        if (text !== undefined) {
            page.text(text);
        }
        // this的指向，第一次执行时，this指向h5
        this.el.append(page);
        // 添加到数组中记录
        this.page.push(page);

        //添加页时的回调函数
        if (typeof this.whenAddPage === 'function') {
            this.whenAddPage();
        }

        return this;
    };

    this.addComponent = function (name, cfg) {
        // 给当前页的最后一个页面添加

        var cfg = cfg || {};
        cfg = $.extend({
            type: 'base'
        }, cfg);

        var component;

        // slice(-1)代表截取最后一项
        // page = this.page.slice(-1)[0];
        var page = this.page.slice(-1)[0];

        switch (cfg.type) {
            case 'base':
                // 这里与base组件结合起来了
                component = new H5ComponentBase(name, cfg);
                break;
            case 'polyline':
                // 这里与base组件结合起来了
                component = new H5ComponentPolyline(name, cfg);
                break;
            case 'pie':
                // 这里与base组件结合起来了
                component = new H5ComponentPie(name, cfg);
                break;
            case 'bar':
                // 这里与base组件结合起来了
                component = new H5ComponentBar(name, cfg);
                break;
            case 'bar_v':
                // 这里与base组件结合起来了
                component = new H5ComponentBar_v(name, cfg);
                break;
            case 'radar':
                // 这里与base组件结合起来了
                component = new H5ComponentRadar(name, cfg);
                break;
            case 'ring':
                // 这里与base组件结合起来了
                component = new H5ComponentRing(name, cfg);
                break;
            case 'point':
                // 这里与base组件结合起来了
                component = new H5ComponentPoint(name, cfg);
                break;

            default:
        }

        page.append(component);

        return this;
    };

    /*H5对象初始化呈现*/
    // firstPage:初始第几页
    this.loader = function (firstPage) {
        this.el.fullpage({
            onLeave: function (index, nextIndex, direction) {
                //建立了一种耦合的方式，这样就可以给每个页面单独写事件
                $(this).find('.h5_component').trigger('onLeave');
            },
            afterLoad: function (anchorLink, index) {
                $(this).find('.h5_component').trigger('onLoad');
            }
        });
        this.page[0].find('.h5_component').trigger('onLoad');
        this.el.show();
        if (firstPage) {
            $.fn.fullpage.moveTo(firstPage);
        }
    }

    return this;
};