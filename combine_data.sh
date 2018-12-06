# scp enlbadmin@192.168.207.185:/var/log/nginx/`date --date="-1 day" +"%Y-%m-%d"`.zip todays_log_file/lb1/
# scp enlb02@192.168.207.148:/var/log/nginx/`date --date="-1 day" +"%Y-%m-%d"`.zip todays_log_file/lb2/

# unzip todays_log_file/lb1/`date --date="-1 day" +"%Y-%m-%d"`.zip -d todays_log_file/lb1
# unzip todays_log_file/lb2/`date --date="-1 day" +"%Y-%m-%d"`.zip -d todays_log_file/lb2

# gunzip todays_log_file/lb1/var/log/nginx/access.log*.gz
# cat todays_log_file/lb1/var/log/nginx/access.log* > log_file.log

# gunzip todays_log_file/lb2/var/log/nginx/access.log*.gz
# cat todays_log_file/lb2/var/log/nginx/access.log* >> log_file.log


gunzip todays_log_file/lb1/access.log*.gz
cat todays_log_file/lb1/access.log* > log_file.log

gunzip todays_log_file/lb2/access.log*.gz
cat todays_log_file/lb2/access.log* >> log_file.log


awk '$NF ~ "-"' log_file.log > all.log
awk '$NF !~ "-" && $7 !~ "generate_log" && $7 !~ "favicon.ico" && !a[$NF $7]++' log_file.log >> all.log
awk '{print $7}' all.log | sort | uniq -c | sort -rn > count.txt
echo "URL,COUNT" > all_csv_file/DAILY_UNIQUE_VISITOR_LOG_`date --date="-1 day" +"%Y-%m-%d"`.csv
awk '{print $2,",",$1}' count.txt >> all_csv_file/DAILY_UNIQUE_VISITOR_LOG_`date --date="-1 day" +"%Y-%m-%d"`.csv



# rm todays_log_file/lb1/* -R
# rm todays_log_file/lb2/* -R
# rm log_file.log
# rm all.log
# rm count.txt
