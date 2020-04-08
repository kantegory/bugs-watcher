# Client sample script and templates

Move files bugsWatcher.js and bugs-watcher.css to /js/etersoft/ (you should add this dir).

Move file bugswatcher.html.tmpl to template/en/default (in all your localization template folders).

Include this template in /template/en/default/bug/edit.html.tmpl (in all your localization template folders):
```perl
[% PROCESS etersoft/bugswatcher.html.tmpl %]
```

For client it's all! But don't remember, that you need add right hostname and port into bugsWatcher.js.
