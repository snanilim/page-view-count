# scp enlbadmin@192.168.207.185:/var/log/nginx/`date --date="-1 day" +"%Y-%m-%d"`.zip todays_log_file/lb1/
# scp enlb02@192.168.207.148:/var/log/nginx/`date --date="-1 day" +"%Y-%m-%d"`.zip todays_log_file/lb2/

unzip todays_log_file/lb1/`date --date="-1 day" +"%Y-%m-%d"`.zip -d todays_log_file/lb1
unzip todays_log_file/lb2/`date --date="-1 day" +"%Y-%m-%d"`.zip -d todays_log_file/lb2


node index.js
: > combined/log_file.txt