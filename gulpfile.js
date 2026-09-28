import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
const sass = gulpSass(dartSass);
const publicSCSSDestination = 'public/stylesheets';
const publicSCSSFunction = () => {
    return gulp
        .src('public-scss/*.scss')
        .pipe(sass({
        outputStyle: 'compressed',
        includePaths: ['./', './node_modules']
    }).on('error', sass.logError))
        .pipe(gulp.dest(publicSCSSDestination));
};
gulp.task('public-scss', publicSCSSFunction);
const watchFunction = () => {
    gulp.watch('public-scss/*.scss', publicSCSSFunction);
};
gulp.task('watch', watchFunction);
gulp.task('default', () => {
    publicSCSSFunction();
    watchFunction();
});
