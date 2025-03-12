#!/bin/bash
set -e

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

# Start services
for service in jenkins cron docker; do
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
) > /var/log/emlJenkinsEC2-Entrypoint.log 2>> /var/log/emlJenkinsEC2-Entrypoint-Error.log &

wait
echo "All versions have been logged" >> /var/log/emlJenkinsEC2-Entrypoint.log
echo "Entrypoint script completed" >> /var/log/emlJenkinsEC2-Entrypoint.log
exit 0





# amazon-linux-extras install -y java-openjdk17
# yum install -y git docker aws-cli
# # Install Jenkins
# wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
# rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
# yum install -y jenkins
# systemctl enable jenkins
# systemctl start jenkins
# # Configure Docker
# systemctl enable docker
# systemctl start docker
# usermod -aG docker ec2-user
# usermod -aG docker jenkins
# # Install Node.js using nvm
# sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# sudo source ~/.bashrc
# nvm --version
# nvm install 22
# nvm alias default 22
# node --version

# # Configure Jenkins to use Node.js
# echo 'export PATH=$PATH:~/.nvm/versions/node/v22/bin' >> /etc/sysconfig/jenkins
# systemctl restart jenkins
# # Install AWS CloudWatch Agent
# yum install -y amazon-cloudwatch-agent
# /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c ssm:/AmazonCloudWatch/JenkinsConfig
