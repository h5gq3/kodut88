#!/bin/bash

# check if Homebrew is installed
if ! command -v brew &>/dev/null; then
  echo "Homebrew is not installed. Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
fi

# update Homebrew
brew update

# install PostgreSQL
brew install postgresql

# start and enable the PostgreSQL service
brew services start postgresql

echo "PostgreSQL installation and configuration completed."
