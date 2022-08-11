!/bin/bash

CONTAINER_ID=$(docker container ls -f "name=app" -q)

echo "> container id ${CONTAINER_ID}"

if [ -z ${CONTAINER_ID} ]
then
  echo no running container
else
  echo "> docker stop ${CONTAINER_ID}"
  sudo docker stop ${CONTAINER_ID}
  echo "> docker rm ${CONTAINER_ID}"
  sudo docker rm ${CONTAINER_ID}
fi

docker-compose down -v