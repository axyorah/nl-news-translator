# activate virtual env (create if not present)
if [[ -d venv ]]
    then source venv/bin/activate
elif [[ -d backend/venv ]]
    then source backend/venv/bin/activate
else
    python3 -m venv venv
    source venv/bin/activate
    python3 -m pip install -r backend/requirements.txt
fi

# apply migrations
python backend/manage.py makemigrations
python backend/manage.py migrate

# start api server
python3 backend/manage.py runserver
