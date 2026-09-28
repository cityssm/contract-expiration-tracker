/* eslint-disable node/no-unpublished-import */

import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'

const sass = gulpSass(dartSass)

/*
 * Compile SASS
 */

const publicSCSSDestination = 'public/stylesheets'

const publicSCSSFunction = () => {
  return gulp
    .src('public-scss/*.scss')
    .pipe(
      sass({
        outputStyle: 'compressed',
        includePaths: ['./', './node_modules']
      }).on('error', sass.logError)
    )
    .pipe(gulp.dest(publicSCSSDestination))
}

gulp.task('public-scss', publicSCSSFunction)

/*
 * Watch
 */

const watchFunction = () => {
  gulp.watch('public-scss/*.scss', publicSCSSFunction)
}

gulp.task('watch', watchFunction)

/*
 * Initialize default
 */

gulp.task('default', () => {
  publicSCSSFunction()
  watchFunction()
})
