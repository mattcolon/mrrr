/*
 * Mrrr Web Comic Application
 * @author Matthew Colón
 */ 

// Extended from https://travismaynard.com/writing/getting-started-with-gulp

// Plugins
var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');

// Clean the Distribution Folder
gulp.task('clean', function() {
    return del(['dist/**/*']);
});

// Check JavaScript Code Quality
function lint() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
}
gulp.task('lint', ['clean'], lint);
gulp.task('lint-watch', lint);

// Copy Bower Files
function bower() {
    return gulp.src(mainBowerFiles())
        .pipe(uglify())
        .pipe(gulp.dest('dist/lib'));
}
gulp.task('bower', ['clean'], bower);
gulp.task('bower-watch', bower);

// Copy HTML Files
function html() {
    return gulp.src('*.html')
        .pipe(gulp.dest('dist'));
}
gulp.task('html', ['clean'], html);
gulp.task('html-watch', html);

// Copy Images
function images() {
    return gulp.src('images/**/*')
        .pipe(gulp.dest('dist/images'));
}
gulp.task('images', ['clean'], images);
gulp.task('images-watch', images);

// Copy JSON
function json() {
    return gulp.src('json/*.json')
        .pipe(gulp.dest('dist/json'));
};
gulp.task('json', ['clean'], json);
gulp.task('json-watch', json);

// Compile Sass
function css() {
    return gulp.src('scss/mrrr.scss')
        .pipe(sass())
        .pipe(concat('mrrr.css'))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('dist/css'));
};
gulp.task('css', ['clean'], css);
gulp.task('css-watch', css);

// Concatenate & Minify JavaScript
function scripts() {
    return gulp.src('js/*.js')
        .pipe(concat('mrrr.js'))
        .pipe(rename('mrrr.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
};
gulp.task('scripts', ['clean'], scripts);
gulp.task('scripts-watch', scripts);

// Watch Files For Changes
gulp.task('watch', ['dist'], function() {
    
    gulp.watch('*.html', ['html-watch']);
    gulp.watch('images/**/*', ['images-watch']);
    gulp.watch('json/*.json', ['json-watch']);
    gulp.watch('scss/*.scss', ['css-watch']);
    gulp.watch('js/*.js', ['lint-watch', 'scripts-watch']);
});

gulp.task('serve', ['watch'], function() {
    browserSync.init({
        server: {
            baseDir: 'dist',
            index: 'index.html'
        }
    });
});

// Create Distribution Content
gulp.task('dist', ['clean', 'lint', 'bower', 'html', 'images', 'json', 'css', 'scripts']);

// Default Task
gulp.task('default', ['dist']);