# Project

## Project Read List - GET

권한: -

path - `/projects`

## Project Read Single- GET

권한: -

path - `/projects/:id`

## Project Create Temporate - POST

권한: 팀에 소속되어있음

## Project Update Temporate - PUT

권한: 팀에 소속되어있음

## Project Read Temporate Save - GET

권한: 팀에 소속되어있음

- project 생성 혹은 업데이트하면 사라짐
- 작동 플로우
  - 임시 프로젝트 객체 a
  - 프로젝트 객체 b
  - a와 b는 별도의 저장공간을 사용함
  - b가 update / create되면 a는 초기화됨
  - 팀 외부의 사용자는 b만을 조회할 수 있음

## Project Create - POST

권한: 팀에 소속되어있음

## Project Update - PUT

권한: 팀에 소속되어있음

## Project Delete - DELETE

권한: admin

## Like Project - POST

## Project # Likes - GET
