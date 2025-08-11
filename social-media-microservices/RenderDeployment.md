# Deploying Social Media Microservices to Render

This guide explains how to deploy your microservices project to [Render](https://render.com).

---

## 1. Prepare Your Codebase

- Ensure each service has a `Dockerfile`.
- Remove secrets from `.env` files. You will set environment variables in the Render dashboard.

---

## 2. Push to GitHub

If not already done:

```sh
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

## 3. Set Up Render Services

Render does **not** support `docker-compose.yml` directly. You must create a separate Render "Web Service" for each microservice and for each dependency.

### a. Managed Databases

- **MongoDB**: Use [Render's MongoDB add-on](https://render.com/docs/databases#mongodb) or [MongoDB Atlas](https://www.mongodb.com/atlas).
- **Redis**: Use [Render's Redis add-on](https://render.com/docs/databases#redis).
use this chatGpt page:(https://chatgpt.com/share/6899029d-ad00-800b-9e33-14a7a9732e7b).

### b. RabbitMQ

- Render does **not** provide managed RabbitMQ. Use a provider like [CloudAMQP](https://www.cloudamqp.com/).

---

## 4. Deploy Each Microservice

For each service (`api-gateway`, `identity-service`, `post-service`, `media-service`, `search-service`):

1. Go to **Render Dashboard** → **New** → **Web Service**.
2. Connect your GitHub repo.
3. Set the **Root Directory** to the service folder (e.g., `api-gateway`).
4. Set the **Build Command** (example for Node.js):
    ```
    npm ci --only=production
    ```
5. Set the **Start Command** (example for Node.js):
    ```
    node src/server.js
    ```
6. If using Docker, Render will auto-detect the `Dockerfile`.
7. **Add Environment Variables**:
    - `PORT` (e.g., 3000, 3001, etc.)
    - `MONGODB_URI` (from your managed MongoDB)
    - `REDIS_URL` (from Render Redis)
    - `RABBITMQ_URL` (from CloudAMQP)
    - Any other secrets from your `.env` files

8. Click **Create Web Service**.

Repeat for each service.

---

## 5. Update Service URLs

- In your `.env` files (or Render environment variables), set the correct URLs for each service using the Render-provided service URLs.

---

## 6. Test Everything

- Use the Render URLs to test your endpoints.
- Check logs in the Render dashboard for troubleshooting.

---

## 7. Optional: Custom Domain

- Add a custom domain in Render if needed.

---

## Summary

- Push code to GitHub
- Create managed databases (MongoDB, Redis, RabbitMQ)
- Deploy each service as a separate Render Web Service
- Set environment variables for each
- Update service URLs
- Test and debug