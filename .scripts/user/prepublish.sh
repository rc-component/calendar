# Use this file to your own code to run at NPM `prepublish` event.
postcss --use postcss-cssnext -d dist src/*.css
