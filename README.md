# Remix Expense App

A silly little app teaching Dan how to use Remix.

## Running locally

```
npm run dev
```

## Generating prisma client

```
npx prisma generate
```

## Building docker image

```
docker build -t dandev:latest .
docker tag dandev:latest 319180752723.dkr.ecr.us-east-1.amazonaws.com/dandev:latest
docker push 319180752723.dkr.ecr.us-east-1.amazonaws.com/dandev:latest
```

## Running docker image locally

```
docker run -p 127.0.0.1:80:3000 --env-file .env dandev:latest  
```
