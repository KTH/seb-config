# seb-config

Small service, that generates a .seb xml configuration file for Safe Exam Browser, based on a template.xml.
It adds regex rules, so changes can be made without using configuration tool.

App has 2 modes:

- Universal config (regex is not restricted to a particular Canvas course)
- CourseID-based config (regex is restricted to a single Canvas course)

App can be POST'ed at `/q` with two query parameters:
- courseID (Canvas CourseID that config is to be restricted to)
- limit (config variant: 0 - universal config, 1 - course restricted config)

This allows database workflow, where you have one field dedicated to CourseID,
and second field dedicated to restriction.

Examples:
- `/q?courseID=9298&limit=0` will result in `Universal Config`
- `/q?courseID=9298&limit=1` will result in `CourseID Config`
- `/q?limit=0` will result in `Universal Config`
- `/q?limit=1` will result in 400 Bad Request
