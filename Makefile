example:
	@chrome http://localhost:3000
	@cd example && node-dev server.js

dev:
	@chrome http://localhost:9010
	@npm run storybook

doc:
	@npm run publish-storybook

.PHONY: dev example dev
