router.get("/{{module}}s", {{Module}}Module.Routes.UserRoutes.find.bind({{Module}}Module.Routes.{{Module}}Routes));
router.get("/{{module}}s/:id", {{Module}}Module.Routes.UserRoutes.findById.bind({{Module}}Module.Routes.{{Module}}Routes));
router.post("/{{module}}s", {{Module}}Module.Routes.UserRoutes.create.bind({{Module}}Module.Routes.{{Module}}Routes));
router.patch("/{{module}}s/:id", {{Module}}Module.Routes.UserRoutes.update.bind({{Module}}Module.Routes.{{Module}}Routes));
// router.delete("/{{Module}}/:id", {{Module}}Module.Routes.{{Module}}Routes.delete.bind({{Module}}Module.Routes.{{Module}}Routes));
