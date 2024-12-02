// Пути до файлов
let project_folder = 'dist';
let source_folder = '#src';

let path = {
    build: {
        html: `${project_folder}/`,
        css: `${project_folder}/assets/css/`,
        scripts: `${project_folder}/assets/scripts/`,
        img: `${project_folder}/assets/img/`,
        fonts: `${project_folder}/assets/fonts/`,
        public: `${project_folder}/assets/`,
    },
    src: {
        html: [`${source_folder}/pages/**/*.{html,pug}`, `!${source_folder}/pages/_*.{html,pug}`],
        css: `${source_folder}/scss/*.{scss,sass}`,
        js: `${source_folder}/js/*.js`,
        ts: `${source_folder}/ts/*.ts`,
        img: `${source_folder}/img/**/*.{jpeg,jpg,png,svg,gif,ico}`,
        fonts: `${source_folder}/fonts/*.{eot,ttf,woff,woff2}`,
        public: `${source_folder}/public/**/*.*`,
    },
    watch: {
        html: `${source_folder}/**/*.{html,pug}`,
        css: `${source_folder}/**/*.{scss,sass}`,
        js: `${source_folder}/js/*.js`,
        ts: `${source_folder}/ts/*.ts`,
        img: `${source_folder}/img/**/*.{jpeg,jpg,png,svg,gif,ico}`,
        public: `${source_folder}/public/**/*.*`,
    },
    clean: `./${project_folder}/`,
};

// Импорты
import gulp from "gulp";
import browsersync from "browser-sync";
import fileinclude from "gulp-file-include";
import del from "del";
import gulpSass from "gulp-sass";
import * as simpleSass from 'sass'
import autoprefixer from "gulp-autoprefixer";
import group_media from "gulp-group-css-media-queries";
import cleanCSS from "gulp-clean-css";
import terser from "gulp-terser";
import rename from "gulp-rename";
import imagemin from "gulp-imagemin";
import mozjpeg from "imagemin-mozjpeg";
import optipng from "imagemin-optipng";
import svgo from "imagemin-svgo";
import pug from 'gulp-pug';
import pugbem from 'gulp-pugbem';
import replace from 'gulp-replace';

const sass = gulpSass(simpleSass);

// Запуск сервера
export const browserSync = () => {
    browsersync.init({
        server: {
            baseDir: `./${project_folder}/`,
        },
        port: 3000,
        notify: false,
    });
};

// Сборка html
export const html = () => {
    return gulp.src(path.src.html)
        .pipe(pug({
            plugins: [pugbem],
            pretty: true,
        }).on('error', (err) => {
            console.error(err.message);
            this.emit('end');
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(browsersync.stream());
};


// Сборка images
export const images = () => {
    return gulp.src(path.src.img)
        .pipe(imagemin([
            mozjpeg({ quality: 75, progressive: true }),
            optipng({ optimizationLevel: 5 }),
        ]).on('error', console.error))
        .pipe(gulp.dest(path.build.img))
        .pipe(browsersync.stream());
};

// Сборка js
export const js = () => {
    return gulp.src(path.src.js)
        .pipe(fileinclude().on('error', console.error))
        .pipe(gulp.dest(path.build.scripts))
        .pipe(terser().on('error', console.error))
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(path.build.scripts))
        .pipe(browsersync.stream());
};

// Сборка css из sass
export const css = () => {
    return gulp.src(path.src.css)
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true,
        }).on('error', console.error))
        .pipe(group_media())
        .pipe(gulp.dest(path.build.css))
        .pipe(cleanCSS({ debug: true }, (details) => {
            console.log(`INFO CSS MIN: FROM ${details.name}: ${details.stats.originalSize}KB TO ${details.name}: ${details.stats.minifiedSize}KB`);
        }).on('error', console.error))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(path.build.css))
        .pipe(browsersync.stream());
};

// Fonts
export const fonts = () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browsersync.stream());
};

// Public
export const publicFiles = () => {
    return gulp.src(path.src.public)
        .pipe(gulp.dest(path.build.public))
        .pipe(browsersync.stream());
};

// Моментальное обновление файлов
export const watchFiles = () => {
    gulp.watch(path.watch.html, gulp.series(html, (done) => {
        browsersync.reload();
        done();
    }));
    gulp.watch(path.watch.css, gulp.series(css, (done) => {
        browsersync.reload();
        done();
    }));
    gulp.watch(path.watch.js, gulp.series(js, (done) => {
        browsersync.reload();
        done();
    }));
    gulp.watch(path.watch.img, gulp.series(images, (done) => {
        browsersync.reload();
        done();
    }));
    gulp.watch(path.watch.public, gulp.series(publicFiles, (done) => {
        browsersync.reload();
        done();
    }));
};

// Создание папки заново
export const clean = () => {
    return del(path.clean).catch(console.error);
};

export const build = gulp.series(
    clean,
    gulp.parallel(js, css, html, images, fonts, publicFiles)
);

export const dev = gulp.series(
    clean,
    gulp.parallel(js, css, html, images, fonts, publicFiles),
    gulp.parallel(watchFiles, browserSync)
);

export default dev;
