/* jshint node: true */

'use strict';

import gulp from 'gulp'; //gulp module [http://gulpjs.com/]
import sass from 'gulp-sass';  //allows gulp sass processing [https://www.npmjs.org/package/gulp-sass]
import autoprefixer from 'gulp-autoprefixer'; //allows gulp autoprefixing [https://www.npmjs.org/package/gulp-autoprefixer]
import sourcemaps from 'gulp-sourcemaps';  //allows gulp sourcemaps [https://www.npmjs.com/package/gulp-sourcemaps/]
import notify from 'gulp-notify';  //allows for creation of custom error msgs [https://www.npmjs.com/package/gulp-notify/]
import del from 'del';  //allows setting up task to delete build folder [https://www.npmjs.com/package/del]
import browserSync from 'browser-sync';
import include from 'gulp-include';
// set up entry and exit point, if left as is
// gulp will look inside src folder and output to build folder

const reload = browserSync.reload;

const dirs = {
    src: 'src',
    dest: 'build'
};

//define entry and exit points for scss processing
//looks inside src for app.scss and outputs to dest/styles/app.css
const sassPaths = {
    src: `${dirs.src}/styles/app.scss`,
    dest: `${dirs.dest}/styles/`
};

// the magic, processes sass, inserts autoprefixes and sourcemaps, outputs to
// the above defined dest folder
gulp.task('styles', () => {
    //tells gulp to look in the path defined above in sassPaths.src (src/app.scss)
    return gulp.src(sassPaths.src)
        // initialize sourcemaps
        // https://www.npmjs.com/package/gulp-sourcemaps/
        .pipe(sourcemaps.init())
        //process sass!
        .pipe(sass({
            // outputStyle can be set to any of the below options leave as is for normal syntax
            // nested - css will be nested
            // compact - one line per css selector
            // compressed - one line per css file no spaces
            // for other options see https://www.npmjs.org/package/gulp-sass
            outputStyle: 'expanded'
        }))
        // log errors
        .on('error', notify.onError(function(error) {
            return 'Error: ' + error.message
        }))
        // adds prefixes
        .pipe(autoprefixer({
            // https://github.com/postcss/autoprefixer#options
            // browsers (array): list of browsers query (like last 2 versions), which are supported in your project. We recommend to use browserslist config or browserslist key in package.json, rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
            browsers: [
                'last 2 versions',
                'ie 9',
                'ios 6',
                'android 4'
            ],
            // cascade (boolean): should Autoprefixer use Visual Cascade, if CSS is uncompressed. Default: true
            cascade: true
        }))
        // choose the sourcemap destination
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(sassPaths.dest));
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        },
        port: 3000,
        ghostMode: true,
    });
});

//deletes build folder [https://www.npmjs.com/package/del]
gulp.task('clean', () => {
    return del(['build/**', '!build']);
});

gulp.task('html', () => {
    return gulp.src(['./*.html'])
        .pipe(include())
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

//watch for scss changes and auto-compile into css
gulp.task('watch', () => {
    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('build/styles/app.css').on('change', reload);

    gulp.watch('./*', ['html']);
});

// default task, will execute by typing "gulp" into the CL, runs clean task then styles task, then watches for scss changes.
gulp.task('default', ['clean', 'styles', 'watch', 'browser-sync']);
