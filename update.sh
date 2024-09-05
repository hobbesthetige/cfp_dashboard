#!/bin/bash
sudo systemctl stop cfp-dashboard
cd ~/repos/cfp_dashboard
git pull origin main
docker-compose build
sudo systemctl start cfp-dashboard