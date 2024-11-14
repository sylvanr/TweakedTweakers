# TweakedTweakers

## Table of Contents

- [TweakedTweakers](#tweakedtweakers)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
    - [Docker](#docker)
      - [Install docker](#install-docker)
        - [Linux](#linux)
          - [Docker Desktop](#docker-desktop)
          - [Terminal](#terminal)
        - [MacOS](#macos)
        - [Windows](#windows)
    - [Local Development (setup)](#local-development-setup)
      - [Creating Symbolic Links](#creating-symbolic-links)
      - [Set up api](#set-up-api)
      - [Set up app](#set-up-app)
  - [Running](#running)
    - [Local Development (running)](#local-development-running)
    - [Docker (running)](#docker-running)

## Setup

### Docker

#### Install docker

##### Linux

###### Docker Desktop

[Docker desktop on Linux installation](https://docs.docker.com/desktop/setup/install/linux/)

###### Terminal

Simply copy and paste

```sh
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg -y
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
"deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
"$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

##### MacOS

[Docker desktop on Mac installation](https://docs.docker.com/desktop/setup/install/mac-install/)

##### Windows

[Docker desktop on Windows installation](https://docs.docker.com/desktop/setup/install/windows-install/)

### Local Development (setup)

#### Creating Symbolic Links

To create symbolic links, you can use the `ln -s` command in your terminal. Here are the steps to create the required symlinks:

1. **Create a symlink of `./data` to `./api`:**
2. **Create a symlink of `./static` to `./api`:**
3. **Create a symlink of `./static/charts` to `./app/public`:**

```sh
ln -s ./data ./api
ln -s ./static ./api
ln -s ./static/charts ./app/public
```

Make sure you have the necessary permissions to create symlinks in the target directories.

#### Set up api

1. Install python 3 (3.11 was used for development)
2. `pip install -r requirements.txt` in the ./api directory
3. Make sure google chrome or chromedriver is installed.

#### Set up app

1. Install Node (developed on node v18.20.4)
2. `npm install`
3. npm run

## Running

### Local Development (running)

In the ./api directory:

```sh
flask run
```

and in the ./app directory

```sh
npm start
```

### Docker (running)

From the terminal, run:

```sh
docker compose up
```

[Quickstart guide](https://docs.docker.com/compose/gettingstarted/#step-3-build-and-run-your-app-with-compose)

_From Docker Desktop, run the `docker compose up` command through the integrated terminal._
