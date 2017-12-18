let argv = require('yargs').argv;
let gulp = require('gulp');
let concat = require('gulp-concat');
let autoprefix = require('gulp-autoprefixer');
let fileinclude = require('gulp-file-include');
let connect = require('gulp-connect');
let rename = require('gulp-rename');
let livereload = require('gulp-livereload');
let scss = require('gulp-sass');
let clean = require('gulp-clean');
let replace = require('gulp-replace');
let through = require("through2");
let runSequnce = require('gulp-sequence');
let babel = require('gulp-babel');
let  browserify = require('browserify');
let sourcemaps = require("gulp-sourcemaps");
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let rev = require('gulp-rev');
let revReplace = require('gulp-rev-replace');
let uglify = require("gulp-uglify");

//参数配置
let domain = argv.domain || "wph.com";
// let port = domain == 'wph.com' ? ':8000' : ':80';
let apiurl = domain == 'wanpinghui.com' ? 'https://opc.wanpinghui.com/api':'http://opc.88ba.com/api';


//合并js
gulp.task('scripts1', function () {
    return gulp.src('src/js/api/*.js')
        .pipe(replace('`{APIURL}`',apiurl))
        .pipe(concat('api.js'))
        .pipe(babel({
            presets: [['es2015']]
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(livereload());
});
gulp.task('scripts2', function () {
    return gulp.src(['src/js/vendor/jquery-2.1.3.min.js', 'src/js/vendor/*.js','!src/js/vendor/require.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(livereload());
});
gulp.task('requirejs', function () {
    return gulp.src('src/js/vendor/require.js')
        .pipe(gulp.dest('./dist/js'))
});
gulp.task('scripts3', function () {
    return gulp.src('src/js/biz/*.js')
        .pipe(babel({
            presets: [['es2015',{"modules":"amd"}]]
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(livereload());
});
gulp.task('scripts4', function () {
    return gulp.src(['src/modules/**/*.js'])
        .pipe(babel({
            presets: [['es2015',{"modules":"amd"}]]
        }))
        .pipe(rename(function (path) {
            let dir = path.dirname;
            path.dirname = 'modules';
            path.basename = dir;
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(livereload());
});
gulp.task("browserify", function () {
    let b = browserify({
        entries: "./dist/js/index.js",
        debug: true /*告知browserify在运行同时生成内联sourcemap用于调试*/
    });

    return b.bundle()
        .pipe(source("index.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/js"));
});


//scss
gulp.task('scss', function () {
    return gulp.src('src/modules/*/*.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefix({browsers: ['last 5 version', 'safari >= 5', 'ie >= 8', 'opera 12.1', 'ios >= 7', 'android >= 4'],}))
        .pipe(rename({extname: '.css.min'}))
        .pipe(gulp.dest('src/modules'))
        .pipe(livereload())

});
//合并css
gulp.task('css', function () {
    return gulp.src(['src/css/*.scss', 'src/css/*.css','!src/css/mixin.scss'])
        .pipe(concat('style.css'))
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefix({browsers: ['last 5 version', 'safari >= 5', 'ie >= 8', 'opera 12.1', 'ios >= 7', 'android >= 4'],}))
        .pipe(gulp.dest('./dist/css'))
        .pipe(livereload());
});

//其他文件夹
gulp.task('root', function () {
    return gulp.src('src/root/*.*')
        .pipe(gulp.dest('./dist'))
        .pipe(livereload());
});
//字体
gulp.task('font', function () {
    return gulp.src('src/css/fonts/*.*')
        .pipe(gulp.dest('./dist/css/fonts'))
        .pipe(livereload());
});
gulp.task('img', function () {
    return gulp.src('src/img/*.*')
        .pipe(gulp.dest('./dist/img'))
        .pipe(livereload());
});
// page
gulp.task('html', function () {
    gulp.src('src/pages/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'dist/'
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(livereload());
});
// module html
gulp.task('mHtml', ['scss'], function () {
    gulp.src('src/modules/*/*.html')
        .pipe(through.obj(function (file, env, cb) {
            let contents = file.contents.toString();
            let path = file.path.split('\\');
            let module = path[path.length - 2];
            contents = contents.replace('`{module.js}`', '/modules/' + module + '.js');
            file.contents = new Buffer(contents);
            this.push(file);
            cb();
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/'
        }))
        .pipe(rename(function (path) {
            let dir = path.dirname;
            path.dirname = 'modules';
            path.basename = dir;
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(livereload());
});
// 清理dist
gulp.task('clean', function () {
    return gulp.src('dist/')
        .pipe(clean());
});
// 清理css.min
gulp.task('cleanCssmin', function () {
    return gulp.src('src/modules/*/*.css.min')
        .pipe(clean());
});


gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(['src/img/*.*', 'src/root/*.*'], ['img', 'root', 'html']);
    gulp.watch(['src/modules/*/*.html','src/modules/*/*.scss', '!src/modules/*/*css.min'], function () {
        runSequnce('scss','mHtml', 'html', 'scripts4', 'html')(function (err) {
                if (err) console.log(err)
            })
        }
    );
    gulp.watch('src/modules/*/*.js', function () {
        runSequnce('scripts4','scripts3','browserify')(function (err) {
                if (err) console.log(err)
            })
        }
    );
    gulp.watch(['src/js/*/*.*'], ['scripts1', 'scripts3','browserify']);
    gulp.watch(['src/css/*.*'], ['css']);
    gulp.watch(['src/pages/*.*'], function () {
        runSequnce('mHtml','html')(function (err) {
            if (err) console.log(err)
        })
    });
    livereload.listen();
});

// 服务器
gulp.task('connect', function () {
    connect.server({
        root: './dist/',
        port: 8000,
        livereload: true
    });
});
//压缩js
gulp.task('jsMin',function () {
   return gulp.src('dist/**/*.js')
       .pipe(uglify())
       .pipe(gulp.dest('dist/'))
});
// 给所有的dist目录下的js加上版本号，将替换关系存入rev-manifest.json文件中
gulp.task("rev", function () {
    return gulp.src(['dist/**/*.js', "dist/**/style.css","!dist/js/vendor.js", "!dist/js/require.js"])
        .pipe(rev())
        .pipe(gulp.dest('dist/'))
        .pipe(rev.manifest('rev-manifest.json'))
        .pipe(gulp.dest('dist/'))
});
// 替换rev-manifest.json文件中的对应文件
gulp.task("revReplace", function () {
    let manifest = gulp.src("dist/rev-manifest.json");
    return gulp.src('dist/**/*.*')
        .pipe(revReplace({ manifest: manifest }))
        .pipe(gulp.dest('dist/'));
});

// dev执行
gulp.task('default', runSequnce('clean',['watch', 'img', 'root','css', 'font','requirejs'],'mHtml', ['scripts1', 'scripts2', 'scripts3'], 'scripts4','browserify', 'html','connect'));

//发布正式环境
gulp.task('release',runSequnce('clean',['img', 'root','css', 'font','requirejs'],'mHtml', ['scripts1', 'scripts2', 'scripts3'], 'scripts4','browserify', 'html','rev','revReplace',"jsMin"));

