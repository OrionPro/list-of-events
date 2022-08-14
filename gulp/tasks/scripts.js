module.exports = function() {
	$.gulp.task('libsJS:dev', () => {
		return $.gulp.src([
			'dev/libs/jquery.js',
			'node_modules/mobile-detect/mobile-detect.min.js',
			'node_modules/jquery-validation/dist/jquery.validate.min.js',
			'node_modules/tooltipster/dist/js/tooltipster.bundle.min.js',
			'node_modules/tooltipster-follower/dist/js/tooltipster-follower.min.js',
			'node_modules/select2/dist/js/select2.min.js',
			'node_modules/jquery-inputmask/index.js',
			'dev/libs/moment.min.js',
			'dev/libs/jquery-ui.min.js',
			'dev/libs/matchMedia.js',
			'dev/libs/fontawesome-all.min.js',
			'dev/libs/timepicki.js',
		])
			.pipe($.gp.concat('libs.min.js'))
			.pipe($.gulp.dest('./build/js/'))
			.pipe($.browserSync.reload({
				stream: true
			}));
	});

	$.gulp.task('libsJS:build', () => {
		return $.gulp.src([
			'dev/libs/jquery.js',
			'node_modules/mobile-detect/mobile-detect.min.js',
			'node_modules/jquery-validation/dist/jquery.validate.min.js',
			'node_modules/tooltipster/dist/js/tooltipster.bundle.min.js',
			'node_modules/tooltipster-follower/dist/js/tooltipster-follower.min.js',
			'node_modules/select2/dist/js/select2.min.js',
			'node_modules/jquery-inputmask/index.js',
			'dev/libs/jquery-ui.min.js',
			'dev/libs/moment.min.js',
			'dev/libs/matchMedia.js',
			'dev/libs/fontawesome-all.min.js',
			'dev/libs/timepicki.js',
		])
			.pipe($.gp.concat('libs.min.js'))
			.pipe($.gp.uglify())
			.pipe($.gulp.dest('./build/js/'));
	});

	$.gulp.task('js:copy', () => {
		return $.gulp.src([
			'./dev/js/_functions.js',
			'./dev/js/main.js',
			'!./dev/js/libs.min.js'])
			.pipe($.babel({
				presets: ['es2015', 'stage-3']
			}))
			.pipe($.gp.concat('main.js'))
			.pipe($.gp.uglify())
			.pipe($.gulp.dest('./build/js/'))
			.pipe($.browserSync.reload({
				stream: true
			}));
	});
};
