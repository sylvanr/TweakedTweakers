# Flask API Dockerfile
FROM python:3.11

RUN apt-get update && apt-get install -y --no-install-recommends \
   curl \
   unzip \
   gnupg \
   libglib2.0-0 \
   libnss3 \
   libgconf-2-4 \
   libfontconfig1 \
   libxss1 \
   libxtst6 \
   xdg-utils \
   && rm -rf /var/lib/apt/lists/*

# Download Chromium directly and set it up
RUN mkdir -p /usr/src/chromium && \
    curl -SL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o /tmp/chrome.deb && \
    apt-get install -y /tmp/chrome.deb || apt-get -fy install && \
    rm /tmp/chrome.deb

# Setup Chromedriver for Selenium
RUN CHROMEDRIVER_VERSION=$(curl -sS https://chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
    curl -SL "https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" -o /tmp/chromedriver.zip && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver && \
    rm /tmp/chromedriver.zip

# Set environment variables for Selenium to use Chromium and Chromedriver
ENV CHROME_BIN="/usr/bin/google-chrome-stable" \
    CHROMEDRIVER_PATH="/usr/local/bin/chromedriver"

WORKDIR /api
COPY ./api /api
RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
