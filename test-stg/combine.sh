#!/bin/bash
rm todays_log_file/lb1/* -R
rm todays_log_file/lb2/* -R
rm log_file.log
rm all.log
rm count.txt

TARGET_DATE=2018-09-28

cp /home/nilim/Documents/stg-easynet-backup/lb1/$TARGET_DATE.zip todays_log_file/lb1/
cp /home/nilim/Documents/stg-easynet-backup/lb2/$TARGET_DATE.zip todays_log_file/lb2/

unzip todays_log_file/lb1/$TARGET_DATE.zip -d todays_log_file/lb1
unzip todays_log_file/lb2/$TARGET_DATE.zip -d todays_log_file/lb2

gunzip todays_log_file/lb1/var/log/nginx/access.log*.gz
cat todays_log_file/lb1/var/log/nginx/access.log* > log_file.log

gunzip todays_log_file/lb2/var/log/nginx/access.log*.gz
cat todays_log_file/lb2/var/log/nginx/access.log* >> log_file.log


# gunzip todays_log_file/lb1/access.log*.gz
# cat todays_log_file/lb1/access.log* > log_file.log

# gunzip todays_log_file/lb2/access.log*.gz
# cat todays_log_file/lb2/access.log* >> log_file.log


awk '$NF ~ "-" && substr($7,1,1) ~ "/" && $7 !~ "generate_log" && $7 !~ "favicon.ico" && $7 !~ "8801" && $7 !~ "/redirect_to" && $7 !~ "/site/quiz_personality" && $7 !~ "/download_" && $7 !~ "/visit_free_site/" && $7 !~ "/quiz_personality/" && $7 !~ "/payment/" && $7 !~ "/my_offer/" && $7 !~ "/uploads/"' log_file.log > all.log
awk '$NF !~ "-" && substr($7,1,1) ~ "/" && $7 !~ "generate_log" && $7 !~ "favicon.ico" && $7 !~ "8801" && $7 !~ "/redirect_to" && $7 !~ "/site/quiz_personality" && $7 !~ "/download_" && $7 !~ "/uploads/" && $7 !~ "/my_offer/" && $7 !~ "/payment/" && $7 !~ "/quiz_personality/" && $7 !~ "/visit_free_site/" && !a[$NF $7]++' log_file.log >> all.log
awk '{print $7}' all.log | sort | uniq -c | sort -rn > count.txt
echo "URL,COUNT" > all_csv_file/DAILY_UNIQUE_VISITOR_LOG_$TARGET_DATE.csv
awk '{print $2,",",$1}' count.txt >> all_csv_file/DAILY_UNIQUE_VISITOR_LOG_$TARGET_DATE.csv


rm todays_log_file/lb1/* -R
rm todays_log_file/lb2/* -R
rm log_file.log
rm all.log
rm count.txt