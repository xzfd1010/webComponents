/**
 * Created by nick on 2017/6/27.
 */
/**
 * Created by nick on 2017/3/16.
 */
var gulp = require('gulp');
//添加文件版本好，根据文件内容计算哈希码，作用：破除用户浏览器的本地缓存
//传统方法的缺点：手动维护／不同文件的版本比较混乱
//此方法的优点：使用哈希码，如果文件未被修改，文件名就不会变；
var rev = require('gulp-rev');
//文件名修改了，但index里面的引用还是原来的，这个文件是用来更新引用的
var revReplace = require('gulp-rev-replace');

//允许在html中通过注释的方法写一些设置，比如合并文件之类的，配置如下
//<!--build:css css/combined.css-->
//<!--endbuild-->
var useref = require('gulp-useref');

//过滤器，filter可以筛选文件，对文件进行处理，筛选-->restore（恢复）
var filter = require('gulp-filter');
//压缩js代码的文件
var uglify = require('gulp-uglify');
//压缩css代码的文件
//压缩时，*!的注释不会消失
//老的版本文件不会删除，因为发布的时候用户可能正在访问网页，没有更新
var csso = require('gulp-csso');

var spritesmith = require('gulp.spritesmith');
gulp.task('sprite', function () {
    var spriteData = gulp.src('img/icon/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    return spriteData.pipe(gulp.dest('path/to/output/'));
});

//less
var less = require("gulp-less");
gulp.task("less", function () {
    gulp.src("less/**/*.less")
        .pipe(less())
        .pipe(gulp.dest("./css"))
        .pipe(reload({stream: true}));
});

// browserSync
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
gulp.task('serve', function () {
    browserSync.init({
        server: "./"
    });
    gulp.watch("less/**/*.less", ['less']);
    gulp.watch("**/*.html").on('change', reload);
    gulp.watch('js/**/*.js').on('change', reload);
})

gulp.task('myTask', ['serve']);

// 压缩js
gulp.task('useref', function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
    //声明filter
    var jsFilter = filter('**/*.js', {restore: true});
    var cssFilter = filter('**/*.css', {restore: true});
    //所有文件，排除首页，因为首页最好不要加版本号，可能打不开
    var indexHtmlFilter = filter(['**/*', '!**/index.html'], {restore: true});

    //pipe处理，管道对文件流进行处理，src方法指定需要处理的文件
    return gulp.src('index.html')
    //分析带有useref注释的地方，找到那些需要合并的文件，自动放入流中，处理后包含index文件+css文件+js文件
        .pipe(useref())
        //进行filter处理，筛选js文件
        .pipe(jsFilter)
        //进行js压缩
        .pipe(uglify())
        //通过restore将文件扔回流里
        .pipe(jsFilter.restore)
        //找到css文件
        .pipe(cssFilter)
        //压缩
        .pipe(csso())
        //保存
        .pipe(cssFilter.restore)
        //找到index文件
        .pipe(indexHtmlFilter)
        //生成哈希版本号
        .pipe(rev())
        //恢复
        .pipe(indexHtmlFilter.restore)
        //更新引用
        .pipe(revReplace())
        //文件流结束了，把文件流扔到dist文件夹下
        .pipe(gulp.dest('dist'));
});

gulp.task("watchLess", function () {
    gulp.watch("less/*.less", ["less"]);
});






