# tohopedia
:information_source: A fully responsive "tokopedia" app clone created with **NextJS** (TypeScript) and **GraphQL** (Go)

:open_file_folder: The databases used in this app are **MySQL** (for development and testing) and **PostgreSQL** (for deployment)

:globe_with_meridians: The frontend side was deployed using **Vercel**, while the backend was deployed using **Heroku**

<h3 align="center">To view this app online you can visit: https://toped.vercel.app/</h2>
For testing, you may use the following credentials:

- Email: `jevon@mail.com`
- Password: `jevon123`

To run this app, you can follow the following steps:
1. Clone this repository:

```
git clone https://github.com/je-von/tohopedia.git
```

2. Go to "backend" directory and create .env file. 
```
cd backend
```
The environment variables you need to provide are:
```
DB_HOST=host_name
DB_PORT=port_number
DB_DATABASE=db_name
DB_USER=user_name
DB_PASSWORD=password

# for the DB_CONNECTION, you can choose between 'mysql' or 'pgsql'
DB_CONNECTION=mysql

# if you choose pgsql, you need to provide:
# DATABASE_URL=postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
```
3. After creating your own database and configure the environment variables, you can run the server
```
go run server.go
```
4. Run the frontend app
```
cd ../frontend
npm run dev
```
:eye_speech_bubble: Web app preview:
![tohoped](https://user-images.githubusercontent.com/86874779/168518895-234dab37-dfac-4845-9b43-73d8df2710e7.png)

_Disclaimer: This project was initially created for learning purposes_
