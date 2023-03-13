cd ~/Downloads
./google-cloud-sdk/bin/gsutil cp -n -r gs://hrismag/btest4.csv ./ ../smartproj_alan/src/CollectedData/
./google-cloud-sdk/bin/gsutil cp -n -r gs://smart-station-ptrs/rmd/2022/05/05/PTRS220505_MAG_00_00.RMD.zip ../smartproj_alan/src/CollectedData/
cd ../smartproj_alan/src/CollectedData
unzip -o *.zip
find . -name 'btest4.csv' | python3 ../DataHarvester/DataProcess.py