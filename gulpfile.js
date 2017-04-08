"use strict";

var gulp = require('gulp');
var gulpif = require('gulp-if');
var sync = require('gulp-sync')(gulp);
var del = require('del');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-clean-css');
var htmlMin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();
var srcPath = "client/src";
var buildPath = "client/build";
var vendorBuildPath = buildPath + "/vendor";
var distPath = "public/client";
var bowerPath = "bower_components";

var cfg = {
  root_html : { src: srcPath + "/index.html", bld: buildPath },
  css : { src: srcPath + "/stylesheets/**/*.css", bld: buildPath + "/stylesheets" },
  js : { src: srcPath + "/javascripts/**/*.js" },
  html : { src: [srcPath + "/**/*.html", "!"+srcPath + "/*.html"]},
  bootstrap_sass : { src: bowerPath + "/bootstrap-sass/assets/stylesheets" },
  bootstrap_fonts: { src: bowerPath + "/bootstrap-sass/assets/fonts/**/*" },
  jquery: { src: bowerPath + "/jquery2/jquery.js" },
  bootstrap_js: { src: bowerPath + "/bootstrap-sass/assets/javascripts/bootstrap.js" },
  angular: { src: bowerPath + "/angular/angular.js" },
  angular_ui_router: { src: bowerPath + "/angular-ui-router/release/angular-ui-router.js" },
  angular_resource: { src: bowerPath + "/angular-resource/angular-resource.js" },
  vendor_js: { bld: vendorBuildPath + "/javascripts" },
  vendor_css: { bld: vendorBuildPath + "/stylesheets" },
  vendor_fonts: { bld: vendorBuildPath + "/stylesheets/fonts" },
  apiUrl: { dev: "http://localhost:3000",
            prd: "https://pumpkin-surprise-81224.herokuapp.com" },
};

var devResourcePath = [
  cfg.vendor_js.bld,
  cfg.vendor_css.bld,
  buildPath + "/javascripts",
  buildPath + "/stylesheets",
  srcPath,
  srcPath + "/javascripts",
  srcPath + "stylesheets"
];

gulp.task("clean:build", function() {
  console.log("buildPath=" + buildPath)
  return del(buildPath);
});

gulp.task("clean:dist", function() {
  return del(distPath);
});

gulp.task("clean", ["clean:build", "clean:dist"]);

gulp.task("vendor_css", function() {
  return gulp.src([
    //cfg.bootstrap_css.src,
  ])
  .pipe(gulp.dest(cfg.vendor_css.bld));
});

gulp.task("vendor_js", function() {
  return gulp.src([
    cfg.jquery.src,
    cfg.bootstrap_js.src,
    cfg.angular.src,
    cfg.angular_ui_router.src,
    cfg.angular_resource.src,
  ])
  .pipe(gulp.dest(cfg.vendor_js.bld));
});

gulp.task('vendor_fonts', function() {
  return gulp.src([
    cfg.bootstrap_fonts.src,
  ])
  .pipe(gulp.dest(cfg.vendor_fonts.bld));
});

gulp.task('css', function() {
  return gulp.src(cfg.css.src).pipe(debug())
  .pipe(sourcemaps.init())
  .pipe(sass({ includePaths: [ cfg.bootstrap_sass.src ] } ))
  .pipe(sourcemaps.write("./maps"))
  .pipe(gulp.dest(cfg.css.bld)).pipe(debug());
});
