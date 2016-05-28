example:
	@chrome http://localhost:3000
	@node-dev example/server.js

dev:
	@chrome http://localhost:9010
	@npm run storybook

doc:
	@npm run publish-storybook

.PHONY: dev
