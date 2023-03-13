cd ~/Downloads
touch test.txt
./google-cloud-sdk/bin/gsutil ls > test.txt
./google-cloud-sdk/bin/gsutil cp -n -r test.txt ../smartproj_alan/src/CollectedData/
cd /Users/alan/smartproj_alan/src/DataHarvester
python3 createJson.py