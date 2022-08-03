import gulp from "gulp";
import changed from "gulp-changed";
import minify from "gulp-minify";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
const publicSCSSDestination = "public/stylesheets";
const publicSCSSFunction = () => {
    return gulp.src("public-scss/*.scss")
        .pipe(sass({
        outputStyle: 'compressed',
        includePaths: ['./', './node_modules']
    }).on('error', sass.logError))
        .pipe(gulp.dest(publicSCSSDestination));
};
gulp.task("public-scss", publicSCSSFunction);
const publicJavascriptsDestination = "public/javascripts";
const publicJavascriptsMinFunction = () => {
    return gulp.src("public-typescript/*.js", { allowEmpty: true })
        .pipe(changed(publicJavascriptsDestination, {
        extension: ".min.js"
    }))
        .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
        .pipe(gulp.dest(publicJavascriptsDestination));
};
gulp.task("public-javascript-min", publicJavascriptsMinFunction);
const watchFunction = () => {
    gulp.watch("public-scss/*.scss", publicSCSSFunction);
    gulp.watch("public-typescript/*.js", publicJavascriptsMinFunction);
};
gulp.task("watch", watchFunction);
gulp.task("default", () => {
    publicJavascriptsMinFunction();
    publicSCSSFunction();
    watchFunction();
});
