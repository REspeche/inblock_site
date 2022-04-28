Steps to deploy in production
-----------------------------

1. Create Database
##################

- Download repo from github: https://github.com/REspeche/inblock_apirest
- Go to "database" folder and get the last database backup. For example: Dump20220214.sql
- Go to Mysql console and execute the next commands (database settings is "app/config.js" file):
  > CREATE DATABASE inblock_db DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
  > CREATE USER inblock_user@'%' IDENTIFIED BY '5sjaqEyhmwVZsCVf';
  > GRANT ALL PRIVILEGES ON inblock_db.* TO 'inblock_user'@'%' WITH GRANT OPTION;
  > FLUSH PRIVILEGES;
  > exit;

- Execute this command to restore database (use file from step 2):
  > mydql -u inblock_user -p 5sjaqEyhmwVZsCVf inblock_db < Dump20220214.sql
