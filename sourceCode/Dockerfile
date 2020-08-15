FROM ubuntu:18.04

COPY ./ /app
WORKDIR /app
RUN apt-get update && apt-get install -y \
    python \
    python-pip
RUN pip install -r requirements.txt
CMD python main.py