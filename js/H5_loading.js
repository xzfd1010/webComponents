/**
 * Created by nick on 2017/7/17.
 */
var H5_loading = function (images, firstPage) {

    var id = this.id;

    if (this._images === undefined) { // 第一次进入H5_loading方法
        window.firstPage = firstPage;
        this._images = (images || []).length; // 代表需要加载的图片个数
        this._loaded = 0; // 代表已加载的图片个数

        // 把当前对象-h5存储在全局对象 window 中，用来进行某个图片加载完成之后的回调
        window[id] = this;

        for (s in images) {
            var item = images[s];
            var img = new Image();
            // img onload实现绑定，执行h5.loader方法
            img.onload = function () {
                // h5.loader()
                window[id].loader();
            }
            // 将图片加入缓存
            img.src = item; // 直接把图片载入缓存
        }

        $('#rate').text('0%');

        // 保持调用
        return this;
    } else {  // 之后进入
        this._loaded++; //计数器+1
        $('#rate').text(((this._loaded / this._images * 100  ) >> 0 )+ '%');

        if (this._loaded < this._images) {

            return this;
        }

    }
    // 清空
    window[id] = null;

    this.el.fullpage({
        css3:true,
        easingcss3: 'cubic-bezier(.17,.67,.53,1.33)',
        onLeave: function (index, nextIndex, direction) {
            //建立了一种耦合的方式，这样就可以给每个页面单独写事件
            $(this).find('.h5_component').trigger('onLeave');
        },
        afterLoad: function (anchorLink, index) {
            $(this).find('.h5_component').trigger('onLoad');
        }
    });
    // debugger
    this.page[0].find('.h5_component').trigger('onLoad');
    this.el.show();
    if (window.firstPage) {
        $.fn.fullpage.moveTo(window.firstPage);
    }

    window.firstPage = null;
}