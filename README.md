

[https://material-ui.com/getting-started/installation/](https://material-ui.com/getting-started/installation/)

# tar && zip the build dir
```bash
cd build
tar -zcvf app.tar.gz .
```

# list the zip file
```bash
tar -ztvf app.tar.gz
```

# unzip the file
```bash
tar -xzf ../app.tar.gz
```


# Release file download url
[https://github.com/yfsoftcom/mui-study/releases/download/beta/app.tar.gz](https://github.com/yfsoftcom/mui-study/releases/download/beta/app.tar.gz)

use `wget` to download the file
```bash
$ wget https://github.com/yfsoftcom/mui-study/releases/download/beta/app.tar.gz
```


# Add the ui for the proj
```
// add postinstall script for the package.json
"postinstall": cpy node_modules/ui.webhook.yunplus.io/build/*.* public/ && cpy node_modules/ui.webhook.yunplus.io/build/index.html views/index.html

```