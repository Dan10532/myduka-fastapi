FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

ENV MODULE_NAME=main
ENV VARIABLE_NAME=app
ENV DATABASE_URL=postgresql://postgres:Mdan10532@my_postgres:5432/flask_shop

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt
COPY . /app
