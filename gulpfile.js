//npm install gulp gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename --save-dev

var debug = true;

//引入gulp
var gulp = require('gulp');


////检查脚本
//var jshint = require('gulp-jshint');
//gulp.task('lint', function () {
//    gulp.src('./js/!*.js')
//        .pipe(jshint())
//        .pipe(jshint.reporter('default'));
//});


//编译sass,压缩css
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
gulp.task('css', function () {
    var task = gulp.src('css/index.scss')
        //编译
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('out'));

    //压缩
    if (!debug) {
        task.pipe(minifyCss())
            .pipe(gulp.dest('out'));
    }
});


//合并,压缩文件js
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//var rename = require('gulp-rename');
gulp.task('js', function () {
    //合并
    var task = gulp.src(['js/lib/soneway.js', 'js/lib/ui.js', 'js/index.js'])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('out'));

    //压缩
    if (!debug) {
        task.pipe(uglify())
            .pipe(gulp.dest('out'));
    }
});


//默认任务
gulp.task('default', function () {
    //监听文件变化
    gulp.watch(['css/**'], function () {
        gulp.run('css');
    });
    gulp.watch(['js/**'], function () {
        gulp.run('js');
    });
});

//初始化运行
gulp.run(['css', 'js']);