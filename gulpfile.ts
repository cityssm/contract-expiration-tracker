/* eslint-disable node/no-unpublished-import */

import gulp from "gulp";
import minify from "gulp-minify";

/*
 * Minify public/javascripts
 */

const publicJavascriptsMinFunction = () => {

  return gulp.src("public-typescript/*.js", { allowEmpty: true })
    .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
    .pipe(gulp.dest("public/javascripts"));
};


gulp.task("public-javascript-min", publicJavascriptsMinFunction);

/*
 * Watch
 */

const watchFunction = () => {
  gulp.watch("public-typescript/*.js", publicJavascriptsMinFunction);
};

gulp.task("watch", watchFunction);

/*
 * Initialize default
 */

gulp.task("default", () => {
  publicJavascriptsMinFunction();
  watchFunction();
});
