const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const uglify = require("gulp-uglify");
const tsify = require("tsify");

const routes = {
  typescript: {
    dest: "dist",
  },
};

const typescript = () =>
  tsProject
    .src()
    .pipe(tsProject())
    // .plugin(tsify)
    // .bundle()
    .js.pipe(uglify())
    .pipe(gulp.dest(routes.typescript.dest));

module.exports.dev = gulp.series(typescript);