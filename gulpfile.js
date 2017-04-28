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

gulp.task("build", sync.sync(["clean:build", ["vendor_css", "vendor_js", "vendor_fonts", "css" ] ] ) );

function browserSyncInit(baseDir, watchFiles) {
  browserSync.instance = browserSync.init(watchFiles, {
    server: { baseDir: baseDir },
    port: 8080,
    ui: { port: 8090 }
  });
};

gulp.task("browserSync", [ "build" ], function() {
  browserSyncInit(devResourcePath, [
    cfg.root_html.src,
    cfg.css.bld + "/**/*.css",
    cfg.js.src,
    cfg.html.src,
  ]);
});

gulp.task("run", [ "build", "browserSync" ], function () {
  gulp.watch(cfg.css.src, [ "css" ]);
});

gulp.task("dist:assets", [ "build" ], function() {
  return gulp.src(cfg.root_html.src).pipe(debug())
  .pipe(useref({ searchPath: devResourcePath } ))
  .pipe(gulpif(["**/*.js" ], replace(cfg.apiUrl.dev,cfg.apiUrl.prd)))
  .pipe(gulpif(["**/*.js"], uglify()))
  .pipe(gulpif(["**/*.css"], cssMin()))
  .pipe(gulp.dest(distPath)).pipe(debug());
});

gulp.task("dist:fonts", function(){
  return gulp.src(cfg.vendor_fonts.bld + "/**/*", { base: cfg.vendor_css.bld} )
  .pipe(gulp.dest(distPath));
});

gulp.task("dist:html", function(){
  return gulp.src(cfg.html.src, { base: srcPath + "/javascripts"}).pipe(debug())
  .pipe(htmlMin({ collapseWhitespace: true }))
  .pipe(gulp.dest(distPath)).pipe(debug());
});

gulp.task("dist", sync.sync( [ "clean:dist", "build", "dist:assets", "dist:fonts", "dist:html" ] ));

gulp.task("dist:run", [ "dist" ], function() {
  browserSyncInit(distPath);
});

gulp.task("default", [ "run" ]);
