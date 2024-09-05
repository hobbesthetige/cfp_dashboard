#!/bin/bash

# Function to show a spinner
show_spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

echo "Stopping the CFP Dashboard service..."
sudo systemctl stop cfp-dashboard &  # Run command in background
show_spinner $!  # Show spinner while waiting for the previous command to finish

echo "Navigating to the CFP Dashboard directory..."
cd ~/repos/cfp_dashboard

echo "Pulling the latest changes from the main branch..."
git pull origin main &  # Run command in background
show_spinner $!  # Show spinner while waiting for the previous command to finish

echo "Building the Docker images..."
docker-compose build &  # Run command in background
show_spinner $!  # Show spinner while waiting for the previous command to finish

echo "Starting the CFP Dashboard service..."
sudo systemctl start cfp-dashboard &  # Run command in background
show_spinner $!  # Show spinner while waiting for the previous command to finish

echo "CFP Dashboard update complete!"