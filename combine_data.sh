gunzip todays_log_file/lb1/access.log*.gz
cat todays_log_file/lb1/access.log* > combined/log_file.txt

gunzip todays_log_file/lb2/access.log*.gz
cat todays_log_file/lb2/access.log* >> combined/log_file.txt

rm todays_log_file/lb1/access.log*
rm todays_log_file/lb2/access.log*