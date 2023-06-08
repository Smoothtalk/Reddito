FROM python:3.11.2
WORKDIR /worker
COPY . /worker
RUN pip3 install -r requirements.txt

CMD ["celery", "-A", "tasks", "worker", "--loglevel=info"]
