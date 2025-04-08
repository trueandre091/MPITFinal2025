import yaml
import os

with open(os.path.join(os.path.dirname(__file__), "content.yaml"), "r") as file:
    CONTENT = yaml.safe_load(file)



