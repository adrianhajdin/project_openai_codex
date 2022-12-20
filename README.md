### Client

1. Setup vanilla project using [vite](https://vitejs.dev/guide/)
    ```bash
    npm create vite@latest client --template vanilla
    ```
2. Provide only assets folder as a starter. Vite creates everything else

### Server

1. Go to [OpenAI](https://beta.openai.com/account/api-keys), signup and create a secret key. Make sure to copy it as it'll be shown only once!
3. Create a script in package file to run the server instead of manually running it
2. Use [Render](https://render.com/) for free server deployments. 
    - Create new account
    - Click on the New and select Web Service
    - Publish the repo to github
        - If repo is private:
            - Connect your github account to Render
            - Select the repo
        - If repo is public:
            - Provide repo URL 
    - Mention the root folder of server, in this case it's 'server'
    - Mention the command to run the server i.e., npm run server
    - And deploy...

> NOTE: The Render deployment will take some time for deployment. Later changes will be deployed automatically for each commit pushed to GitHub 