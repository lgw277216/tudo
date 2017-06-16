
var gulp = require('gulp'); //把模块引进来
var $ = require('gulp-load-plugins')(); //引用所有package.json里面的模块

var open = require("open");


var app={
    srcPath: 'src/',
    buildPath:'build/',
    distPath:'dist/'
};


//编写任务
gulp.task("jquery",function(){
    // 将你的默认的任务代码放在这
    gulp.src('bower_components/jquery/dist/*.js')
        .pipe(gulp.dest(app.srcPath+'lib/jquery'))
        .pipe(gulp.dest(app.buildPath+'lib/jquery')) //开发环境
        .pipe(gulp.dest( app.distPath+'lib/jquery'))  //生产环境
});

//编写任务
gulp.task("store",function(){
    // 将你的默认的任务代码放在这
    gulp.src('bower_components/store2/dist/*.js')
        .pipe(gulp.dest(app.srcPath+'lib/store2'))
        .pipe(gulp.dest(app.buildPath+'lib/store2')) //开发环境
        .pipe(gulp.dest( app.distPath+'lib/store2'))  //生产环境
});

//复制音乐
gulp.task("music",function(){
    gulp.src(app.srcPath+"music/*")
        .pipe(gulp.dest(app.buildPath+'music')) //开发环境
        .pipe(gulp.dest(app.distPath+'music')) //生产环境
});

//压缩图片
gulp.task("imgMin",function(){
    gulp.src(app.srcPath+"images/*")
        .pipe(gulp.dest(app.buildPath+'images')) //开发环境
        .pipe($.imagemin()) //压缩图片
        .pipe(gulp.dest(app.distPath+'images')) //生产环境
});

//复制html文件
gulp.task("html",function(){
    gulp.src(app.srcPath+"*.html")
        .pipe(gulp.dest(app.buildPath)) //开发环境
        .pipe(gulp.dest(app.distPath)) //生产环境
        .pipe($.connect.reload());

});

//复制JS
gulp.task("js",function(){
    gulp.src(app.srcPath+"js/*.js")
        .pipe($.concat('index.js')) //合并JS
        .pipe(gulp.dest(app.buildPath+'js')) //复制开发环境
        .pipe($.uglify()) //压缩js
        .pipe(gulp.dest(app.distPath+'js')) //复制生产环境
});

//复制css
gulp.task("css",function(){
    gulp.src(app.srcPath+"css/*.css")
        .pipe($.concat('index.css')) //合并css
        .pipe(gulp.dest(app.buildPath+'css')) //复制开发环境
        //.pipe($.minifyCss()) //压缩css
        .pipe($.cssmin()) //压缩css
        .pipe(gulp.dest(app.distPath+'css')) //复制生产环境
});





//删除文件
gulp.task("clear",function(){
    gulp.src([app.buildPath,app.distPath])
        .pipe($.clean())
});


//总的任务
gulp.task("build",['jquery','js','imgMin','html','css','store','music']);


//自动执行，生成http
gulp.task('serve', ['build'], function() {
    $.connect.server({
        root: [app.buildPath],
        livereload: true,
        port: 3000
    });



    open("http://localhost:3000/");

    //监控
    gulp.watch(app.srcPath + '*.html', ['html']);
    gulp.watch(app.srcPath + 'css/*.css', ['css']);
    gulp.watch(app.srcPath + 'js/*.js', ['js']);
    gulp.watch(app.srcPath + 'images/*', ['image']);
});


//默认任务

gulp.task('default', ['serve']);



/*function each(s){
    document.write(s + "<br/>")
}
function t1(){
    each("1")
}

t1()

function t1(){
    each("2")
}

t2();

t1=function(){
    each(3)
}*/


