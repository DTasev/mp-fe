var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('collectstatic', shell.task('python ../manage.py collectstatic --noinput'));

gulp.task('watch', () => {
    gulp.watch('static/**/*.*', ['collectstatic']);
});