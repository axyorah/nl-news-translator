::activate virtual env (create if not present)
IF EXIST venv\ (
    call venv\Scripts\activate.bat
) ELSE IF EXIST backend\venv\ (
    call backend\venv\Scripts\activate.bat
) ELSE (
    call python -m venv venv
    call venv\Scripts\activate.bat
    call python -m pip install -r backend\requirements.txt
)

::apply migrations
python backend\manage.py makemigrations
python backend\manage.py migrate --run-syncdb

::start api server
python backend\manage.py runserver