FROM python:3.7-slim

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

RUN mkdir /backend
WORKDIR /backend
COPY . /backend

RUN adduser user
USER user

EXPOSE 8000
CMD django manage.py runserver 0.0.0.0:8000