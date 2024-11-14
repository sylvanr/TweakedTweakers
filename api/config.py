import logging
import os
from logging.handlers import RotatingFileHandler


"""
Logging configuration for the project.
"""


class ProjectFileFilter(logging.Filter):
    def __init__(self, project_path):
        super().__init__()
        self.project_path = os.path.abspath(project_path)

    def filter(self, record):
        # Only allow logs originating from files in the specified project directory
        return record.pathname.startswith(self.project_path)


# Set up logging configurations
log_file_path = "./logs/main.log"
max_log_size_bytes = 1 * 1024 * 1024 * 1024  # 1GB in bytes
backup_count = 5  # Number of backup log files to keep

file_handler = RotatingFileHandler(
    filename=log_file_path,
    maxBytes=max_log_size_bytes,
    backupCount=backup_count,
)
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(logging.Formatter("[%(module)s:%(lineno)d]: %(message)s"))

project_path = "/api" if os.getenv("DOCKER", "False") == "True" else os.getcwd()
file_handler.addFilter(ProjectFileFilter(project_path))

# Set up root logger
root_logger = logging.getLogger()
root_logger.setLevel(logging.DEBUG)
root_logger.addHandler(file_handler)

# Suppress logs from `werkzeug` and `flask.app` as before
logging.getLogger("werkzeug").setLevel(logging.ERROR)
logging.getLogger("flask.app").setLevel(logging.ERROR)
logging.getLogger("selenium").setLevel(logging.ERROR)
logging.getLogger("urllib3.connectionpool").setLevel(logging.ERROR)


# Test logging
def confirm_logger():
    logging.info("Logger configured correctly.")
