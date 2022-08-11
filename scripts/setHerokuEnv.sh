cat .env | tr '\n' ' ' | xargs heroku config:set -a your_app


# heroku config:set -a connecthon-dev