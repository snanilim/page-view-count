gunzip todays_log_file/lb1/var/log/nginx/access.log*.gz
cat todays_log_file/lb1/var/log/nginx/access.log* > combined/log_file.txt

gunzip todays_log_file/lb2/var/log/nginx/access.log*.gz
cat todays_log_file/lb2/var/log/nginx/access.log* >> combined/log_file.txt

rm todays_log_file/lb1/* -R
rm todays_log_file/lb2/* -R