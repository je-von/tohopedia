# tohopedia
ℹ️ A <a href="http://tokopedia.com" target="_blank" rel="noopener noreferrer">_tokopedia_</a> clone web app created with **NextJS** (TypeScript) and **GraphQL** (Go)

📂 The databases used in this app are **MySQL** (for development and testing) and **PostgreSQL** (for deployment)

🌐 The frontend side was deployed using **Vercel**, while the backend was deployed using **Heroku**

<h3 align="center">To view this app online you can visit: https://toped.vercel.app/</h2>
For testing, you may use the following credentials:

- Email: `jevon@mail.com`
- Password: `jevon123`

To develop and run this app locally, you can follow the following steps:
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
👁️ Web app preview:
![tohoped](https://user-images.githubusercontent.com/86874779/168518895-234dab37-dfac-4845-9b43-73d8df2710e7.png)

| | | |
|:-------------------------:|:-------------------------:|:-------------------------:|
|![Picture4](https://user-images.githubusercontent.com/86874779/169686647-0bdbcb7c-15be-4a99-bedf-8dc927c1e48f.png)|![Picture2](https://user-images.githubusercontent.com/86874779/169686636-d3e80197-950e-4a58-af1a-4e2ea67d7667.png)|![Picture3](https://user-images.githubusercontent.com/86874779/169686641-0cca663b-82d0-4e41-9a64-b34caff25cf6.png)|
|![Picture1](https://user-images.githubusercontent.com/86874779/169686625-1ede0c7e-1503-4e0f-84a3-d24191ac395d.png)|![Picture5](https://user-images.githubusercontent.com/86874779/169686654-f0b16fc8-4ab1-4474-9add-76a4493279a6.png)
||

_Disclaimer: This project was created for learning purposes._