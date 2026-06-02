# Deployment Guide

Deploying Occassions to production is seamless and free using the recommended Vercel and MongoDB Atlas stack.

## 1. Set up MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. Create a new **M0 Free Cluster**.
3. Under **Security > Database Access**, create a new database user (e.g., `dbUser`). Generate and save a highly secure password.
4. Under **Security > Network Access**, add the IP Address `0.0.0.0/0` (Allow Access from Anywhere). This is required because Vercel uses dynamic IP addresses.
5. Go to your cluster, click **Connect > Drivers > Node.js**, and copy the connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/occassions?retryWrites=true&w=majority`

## 2. Push Code to GitHub
Vercel deploys directly from your Git repository.
1. Create a new public (or private) repository on GitHub.
2. Push your local code to the repository:
   ```bash
   git add .
   git commit -m "Initial commit for Occassions"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/occassions.git
   git push -u origin main
   ```

## 3. Deploy to Vercel (Hosting)
1. Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Import the `occassions` repository you just pushed.
4. **CRITICAL STEP**: Before clicking deploy, expand the **Environment Variables** section and add these three variables:
   
   | Key | Value |
   | :--- | :--- |
   | `MONGODB_URI` | Your MongoDB connection string from Step 1 (Replace `<username>` and `<password>`) |
   | `NEXTAUTH_SECRET` | Generate a strong, random password string (e.g., `8d2f1b4e8...`) |
   | `NEXTAUTH_URL` | *Leave empty during first deploy. Vercel automatically maps this variable in most cases. If auth fails later, set this to your final `https://your-app.vercel.app` domain.* |

5. Click **Deploy**. Vercel will automatically build the Next.js App Router project and provision the serverless Edge network.
6. Once completed, your app will be live on the internet! 🚀
