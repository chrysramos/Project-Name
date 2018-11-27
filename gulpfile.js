var gulp = require('gulp');
var sass = require('gulp-sass');
var gp_concat = require('gulp-concat');
var gp_rename = require('gulp-rename');
var gp_uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');
var gp_sourcemaps = require('gulp-sourcemaps');

gulp.task('js-build', function () {
  return gulp.src(['assets/js/*.js'])
    .pipe(gp_concat('concat.js'))
    .pipe(gulp.dest('dist'))
    .pipe(gp_rename('app.min.js'))
    .pipe(gp_uglify())
    .pipe(gulp.dest('assets/js/build/'));
});

gulp.task('css-build', function () {
  return gulp.src(['assets/css/settings.css', 'assets/css/tools.css', 'assets/css/generic.css', 'assets/css/elements.css', 'assets/css/objects.css', 'assets/css/components.css', 'assets/css/trumps.css'])
    .pipe(gp_sourcemaps.init())
    .pipe(gp_concat('concat.css'))
    .pipe(gulp.dest('dist'))
    .pipe(gp_rename('app.min.css'))
    .pipe(cssmin())
    .pipe(gp_sourcemaps.write('./'))
    .pipe(gulp.dest('assets/css/build/'));
});

gulp.task('sass-build', function () {
  return gulp.src(['assets/scss/*.scss'])
    .pipe(sass({outoutStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('assets/css/'));
});

gulp.task('image-build', function () {
  return gulp.src(['assets/img/*'])
    .pipe(gulp.dest('assets/img/build/'))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
})

gulp.task('compact', gulp.series( function () {
  gulp.watch('assets/img/*', gulp.parallel(['image-build']));
  gulp.watch('assets/scss/*scss', gulp.parallel(['sass-build']));
  gulp.watch('assets/css/*.css', gulp.parallel(['css-build']));
  gulp.watch('assets/js/*.js', gulp.parallel(['js-build']));
}));

gulp.task('default', gulp.series(['compact']));