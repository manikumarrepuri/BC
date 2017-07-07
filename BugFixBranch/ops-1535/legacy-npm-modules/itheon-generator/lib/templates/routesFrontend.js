//
router.get('/api/{{module}}s', ensureAuthenticatedApi, {{Module}}Module.Routes.{{Module}}ApiRoutes.find.bind({{Module}}Module.Routes.{{Module}}ApiRoutes));
router.get('/api/{{module}}s/schema', ensureAuthenticatedApi, {{Module}}Module.Routes.{{Module}}ApiRoutes.getSchema.bind({{Module}}Module.Routes.{{Module}}ApiRoutes));
router.get('/api/{{module}}s/:id', ensureAuthenticatedApi, {{Module}}Module.Routes.{{Module}}ApiRoutes.findById.bind({{Module}}Module.Routes.{{Module}}ApiRoutes));
router.post('/api/{{module}}s', ensureAuthenticatedApi, {{Module}}Module.Routes.{{Module}}ApiRoutes.create.bind({{Module}}Module.Routes.{{Module}}ApiRoutes));
router.put('/api/{{module}}s/:id', ensureAuthenticatedApi, {{Module}}Module.Routes.{{Module}}ApiRoutes.update.bind({{Module}}Module.Routes.{{Module}}ApiRoutes));
