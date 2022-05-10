# Dutch News Translator

Simple React app with Django backend to help you learn Dutch by reading Dutch news. It fetches news with [newsapi](https://newsapi.org/), optionally translates them to English using [OPUS-MT](https://aclanthology.org/2020.eamt-1.61.pdf) transformer-based  [model](https://huggingface.co/Helsinki-NLP/opus-mt-nl-en), and allows you to make two-sided notes to help remember useful words and phrases.

<span style='color: rgb(180,80,80)'>This project is still under construction!!! Currently it can only fetch news from <a href='https://nos.nl/'>nos.nl</a>!!!</span>

<img width=700 src='./imgs/nl-news-app-main.png'/>
<img width=700 src='./imgs/nl-news-app-note.png'/>

<details>
<summary>More Screenshots</summary>
<img width=700 src='./imgs/nl-news-app-note-list.png'/>
<img width=700 src='./imgs/nl-news-app-tag-list.png'/>
</details>

## 1. Setup
Clone this repo to your machine:
```bash
$ git clone https://github.com/axyorah/nl-news-translate
```

After cloning in project root you'll see two directories: `backend` and `frontend`.

### 1.1 Requirements
This projects requires [python3](https://www.python.org/) for backend and [node](https://nodejs.org/en/) v14+ for frontend.

### 1.2 Environmental Variables
For news-fetching part of the app to work you need to get **API key from [newsapi](https://newsapi.org/)** and save it in `backend/.env` file.

You can get the API key for free by registering with [newsapi](https://newsapi.org/) - just click on a big `Get API Key` button or follow [this direct link](https://newsapi.org/register).

Once you have your key go to `backend` directory, **create file `.env`** and copy your API key in this file like so:
```
NEWSAPI_KEY=<COPY-YOUR-API-KEY>
```

### 1.3 Python Dependencies
While in `backend` directory create and activate python virtual environment, and install the dependencies:

On Mac/Linux
```bash
$ python -m venv venv
$ source ./venv/bin/activate
$ python -m pip install -r requirements.txt
```

On Windows:
```
python -m venv venv
venv\Scripts\activate.bat
python -m pip install -r requirements.txt
```

### 1.4 Node Dependencies
Go to `frontend` directory and install node dependencies:
```bash
$ npm install 
```

## 2. What's Under the Hood
### 2.1 Backend

### 2.2 Frontend
