#!/bin/bash

# check if the script is run as root or with sudo
if [ "$(id -u)" -ne 0 ]; then
  echo "Please run this script as root or with sudo."
  exit 1
fi

# update the package list and install PostgreSQL
apt-get update
apt-get install -y postgresql postgresql-contrib

# start and enable the PostgreSQL service
systemctl start postgresql
systemctl enable postgresql

# set a password for the PostgreSQL 'postgres' user
echo "Enter a password for the 'postgres' user:"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"

# allow local connections to the database server
echo "Modifying PostgreSQL configuration for local connections..."
echo "host    all             all             127.0.0.1/32            md5" >> /etc/postgresql/$(ls /etc/postgresql)/main/pg_hba.conf
echo "local   all             all                                     md5" >> /etc/postgresql/$(ls /etc/postgresql)/main/pg_hba.conf
echo "listen_addresses = '*'" >> /etc/postgresql/$(ls /etc/postgresql)/main/postgresql.conf

# restart PostgreSQL for changes to take effect
systemctl restart postgresql

echo "PostgreSQL installation and configuration completed."
