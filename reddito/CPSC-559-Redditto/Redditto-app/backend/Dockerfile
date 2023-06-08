FROM python:3.11.2
WORKDIR /backend
COPY . /backend
RUN pip3 install -r requirements.txt
EXPOSE 5000
CMD ["python3", "app.py"]
