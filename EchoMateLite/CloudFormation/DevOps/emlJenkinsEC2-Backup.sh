#!/bin/bash
set -e

SOURCE=/var/lib/jenkins
DESTINATION=/mnt/jenkins_backup
DATE=$(date +%Y-%m-%d-%H-%M-%S)
LOGFILE=/var/log/emlJenkinsEC2-Backup.log
echo "Starting Backup" >> $LOGFILE
echo "Backup started at $DATE" >> $LOGFILE

# Deleting prv log file if exists
if [ -f "$LOGFILE" ]; then
    rm -f $LOGFILE
    echo "Log file deleted"
    # Creating log file
    touch $LOGFILE
    echo "Log file created"
fi

# Setup logging
exec 1>> "$LOGFILE" 2>&1

# Check source and destination directories
for dir in "$SOURCE" "$DESTINATION"; do
    if [ ! -d "$dir" ]; then
        echo "Directory $dir does not exist"
        exit 1
    fi
    echo "Directory $dir exists"
done

# CHECK DISK MOUNT POINT
if [lsblk | grep -q "/mnt/jenkins_backup" && lsblk | grep -q "xvdf"]; then
    echo "Disk is mounted" >> $LOGFILE
else
    echo "Disk is not mounted" >> $LOGFILE
    exit 1
fi

# Check if rsync is installed
if ! command -v rsync &> /dev/null; then
    echo "rsync is not installed"
    exit 1
fi
echo "rsync is installed" >> $LOGFILE
echo "rsync version: $(rsync --version)" >> $LOGFILE

# Creating backup
# Optimized rsync flags:
# -a: archive mode (preserves permissions, etc.)
# -z: compression
# --compress-level=9: maximum compression
# --delete: remove extraneous files
# --inplace: update files in-place
# --partial: keep partially transferred files
# --info=progress2: show progress
# --no-inc-recursive: don't use incremental recursion
sudo rsync -az \
    --compress-level=9 \
    --delete \
    --inplace \
    --partial \
    --info=progress2 \
    --no-inc-recursive \
    --stats \
    "$SOURCE/" \
    "$DESTINATION/"

if [ $? -eq 0 ]; then
    log "Backup completed successfully"
else
    log "Backup failed with exit code $?"
    exit 1
fi
exit 0