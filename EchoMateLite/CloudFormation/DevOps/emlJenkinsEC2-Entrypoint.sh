#!/bin/bash
set -e

# Disable crond service if running
if systemctl is-active --quiet crond; then
    echo "Disabling crond service" >> /var/log/emlJenkinsEC2-Entrypoint.log
    sudo systemctl stop crond
fi

# Update system and install dependencies
sudo yum update -y
# Create log files
sudo touch /var/log/emlJenkinsEC2-Entrypoint{,-Error}.log

# Function for service management
check_and_start_service() {
    local service_name=$1
    if ! systemctl is-active --quiet "$service_name"; then
        echo "$service_name is not running. Starting $service_name..." >> /var/log/emlJenkinsEC2-Entrypoint.log
        sudo systemctl start "$service_name" >> /var/log/emlJenkinsEC2-Entrypoint.log 2>> /var/log/emlJenkinsEC2-Entrypoint-Error.log
        echo "$service_name has been started." >> /var/log/emlJenkinsEC2-Entrypoint.log
    else
        echo "$service_name is already running." >> /var/log/emlJenkinsEC2-Entrypoint.log
    fi
}

# Jenkins backup recovery
if [ -n "$(ls -A /mnt/jenkins_backup 2>/dev/null)" ]; then
    echo "Jenkins backup folder is not empty. Recovering jenkins state" >> /var/log/emlJenkinsEC2-Entrypoint.log
    sudo cp -a -v /mnt/jenkins_backup/. /var/lib/jenkins/ >> /var/log/emlJenkinsEC2-Entrypoint.log 2>> /var/log/emlJenkinsEC2-Entrypoint-Error.log
    echo "Jenkins recovery completed" >> /var/log/emlJenkinsEC2-Entrypoint.log
else
    echo "Jenkins backup folder is empty. No recovery needed" >> /var/log/emlJenkinsEC2-Entrypoint.log
fi

# Set permissions efficiently
sudo chown jenkins:jenkins /var/lib/jenkins
sudo chmod 755 /var/lib/jenkins
find /var/lib/jenkins -type d -exec chmod 755 {} +
find /var/lib/jenkins -type f -exec chmod 644 {} +

# Check if cron job exists or not
cron_job="*/15 * * * * root /bin/bash /home/ec2-user/emlJenkinsEC2-Backup.sh"
cron_file="/etc/cron.d/jenkins_backup"

if [ ! -f "$cron_file" ]; then
    echo "Creating cron job for Jenkins backup" >> /var/log/emlJenkinsEC2-Entrypoint.log
    echo "$cron_job" | sudo tee "$cron_file"
    echo "" | sudo tee -a "$cron_file"
    sudo chmod 644 "$cron_file"
    echo "Cron job created" >> /var/log/emlJenkinsEC2-Entrypoint.log
else
    if ! sudo grep -q "$cron_job" "$cron_file"; then
        echo "Updating cron job for Jenkins backup" >> /var/log/emlJenkinsEC2-Entrypoint.log
        echo "$cron_job" | sudo tee "$cron_file"
        echo "" | sudo tee -a "$cron_file"
        sudo chmod 644 "$cron_file"
        echo "Cron job updated" >> /var/log/emlJenkinsEC2-Entrypoint.log
    else
        echo "Cron job already exists" >> /var/log/emlJenkinsEC2-Entrypoint.log
    fi
fi

# Start services
for service in jenkins crond docker; do
    check_and_start_service "$service" &
done

echo "All services have been started" >> /var/log/emlJenkinsEC2-Entrypoint.log
echo "Logging all versions" >> /var/log/emlJenkinsEC2-Entrypoint.log

# Parallel version logging
(
    node --version
    npm --version
    aws --version
    docker --version
    java --version
    git --version
) >> /var/log/emlJenkinsEC2-Entrypoint.log 2>> /var/log/emlJenkinsEC2-Entrypoint-Error.log &

wait
echo "All versions have been logged" >> /var/log/emlJenkinsEC2-Entrypoint.log
echo "Entrypoint script completed" >> /var/log/emlJenkinsEC2-Entrypoint.log

# Reboot the system
sudo reboot

exit 0