var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var cleanCss = require('gulp-clean-css');
var minifyXML = require('gulp-pretty-data');
var insert = require('gulp-file-insert');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('clean', function(done){
  // del fails to call async callback for some reason, just using it sync
  del.sync(['ng-tree-select.js', 'ng-tree-select.min.js', 'tmp']);
  done();
});

gulp.task('css', function(done){
  gulp
    .src(['src/**/*.scss', 'src/**/*.css'])
    .pipe(sass())
    .pipe(concatCss('ng-tree-select.css'))
    .pipe(cleanCss({ rebase: false }))
    .pipe(gulp.dest('tmp', { overwrite: true }))
    .on('end', done);
});

gulp.task('html', function(done){
  gulp
    .src('src/ng-tree-select.html')
    .pipe(minifyXML({
      type: 'minify',
      preserveComments: false,
      extensions: { 'html': 'xml' }
    }))
    .pipe(gulp.dest('tmp', {overwrite: true}))
    .on('end', done);
});

gulp.task('js', function(done){
  gulp.src('src/ng-tree-select.js', { base: 'src' })
  .pipe(insert({
    "TEMPLATE": "tmp/ng-tree-select.html",
    "STYLE": "tmp/ng-tree-select.css"
  }))
  .pipe(gulp.dest('./', { overwrite: true }))
  .on('end', done);
});

gulp.task('minify', function(done){
  gulp.src('ng-tree-select.js')
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('./', {overwrite: true}))
  .on('end', done);
});

gulp.task('build', gulp.series(gulp.parallel('css', 'html'), 'js', 'minify'));
gulp.task('rebuild', gulp.series('clean', 'build'));