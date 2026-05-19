#!/bin/bash

echo "=== 开始构建主应用 ==="
npm run build

echo "=== 构建完成，输出目录: dist ==="
ls -la dist/

echo "=== 开始构建管理后台 ==="
cd admin-app
npm install
npm run build

echo "=== 创建 admin 目录 ==="
mkdir -p ../dist/admin

echo "=== 复制 admin-app 构建产物 ==="
cp -r dist/* ../dist/admin/

echo "=== 构建完成 ==="
cd ..
ls -la dist/admin/
