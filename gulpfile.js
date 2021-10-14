import gulp from "gulp";
import minify from "gulp-minify";
const publicJavascriptsMinFunction = () => {
    return gulp.src("public-typescript/*.js", { allowEmpty: true })
        .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
        .pipe(gulp.dest("public/javascripts"));
};
gulp.task("public-javascript-min", publicJavascriptsMinFunction);
const watchFunction = () => {
    gulp.watch("public-typescript/*.js", publicJavascriptsMinFunction);
};
gulp.task("watch", watchFunction);
gulp.task("default", () => {
    publicJavascriptsMinFunction();
    watchFunction();
});
