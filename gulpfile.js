var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin');




gulp.task('less', function () {
    return gulp.src('src/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('watch', function () {
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('browser-sync', function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'src' // Директория для сервера - src
        },
        notify: false // Отключаем уведомления
    });
});



gulp.task('img', function () {
    return gulp.src('src/img/**/*') // Берем все изображения из scr
        .pipe(cache(imagemin({ // Сжимаем их 
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function () {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'src/css/main.css',
        'src/css/libs.min.css'
        ])
        .pipe(gulp.dest('dist/css'))

    var buildHtml = gulp.src('src/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);
