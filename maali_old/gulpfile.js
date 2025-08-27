const { series, watch, src, dest, parallel } = require('gulp');
const pump = require('pump');
const beeper = require('beeper');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const cssnano = require('cssnano');

const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const postcssImport = require('postcss-import');
const postcssMixins = require('postcss-mixins');

// Define base folders
const asset_src = 'assets/';
const asset_dist = 'assets/dist/';
const npm_src   = 'node_modules/';
const is_sourcemap_needed = false;

// Browsersync init
const serve = done => {
  browserSync.init({
    port: 3368,
    proxy: 'http://127.0.0.1:2368/'
  });
  done();
};

// Handle reload
const reload = done => {
  browserSync.reload();
  done();
};

// Handle errors
const handleError = done => (
  (err) => {
    if (err) {
      beeper();
    }
    return done(err);
  }
);

// Handle CSS
const css = done => {
  const processors = [
    postcssImport(),
    postcssMixins(),
    postcssNested(),
    postcssPresetEnv({
      browsers: '> .5% or last 2 versions',
      stage: 0,
      features: {
        'nesting-rules': true
      }
    }),
    cssnano({preset: 'advanced'})
  ];

  pump(
    [
      src('assets/css/app.css', {sourcemaps: is_sourcemap_needed}),
      postcss(processors),
      rename({suffix: '.min'}),
      dest(asset_dist, {sourcemaps: '.'})
    ],
    handleError(done)
  );
};

// Handle Js
const js = done => {
  pump(
    [
      src([
        `${npm_src}@tryghost/content-api/umd/content-api.min.js`,
        `${npm_src}lazysizes/lazysizes.min.js`,
        `${npm_src}fitvids/dist/fitvids.min.js`,
        `${npm_src}fslightbox/index.js`,
        `${npm_src}tocbot/dist/tocbot.min.js`,
        `${asset_src}js/script.js`
      ], 
      { sourcemaps: is_sourcemap_needed }),
      babel({
        'presets': [
          [
            '@babel/preset-env', {
              'modules': false
            }
          ]
        ]
      }),
      concat('app.js'),
      rename({suffix: '.min'}),
      uglify(),
      dest(asset_dist, { sourcemaps: '.' })
    ],
    handleError(done)
  );
};

// Handle tasks
const cssWatch = () => watch('assets/css/**', series(css, reload));
const jsWatch = () => watch('assets/js/**', series(js, reload));
const hbsWatch = () => watch([
  '*.hbs', 
  'partials/**/*.hbs', 
  'members/**/*.hbs',
  '!node_modules/**/*.hbs'], series(reload));
const watcher = parallel(cssWatch, jsWatch, hbsWatch);
const build = series(css, js);
const dev = series(build, serve, watcher);

exports.build = build;
exports.css = css;
exports.js = js;
exports.default = dev;
