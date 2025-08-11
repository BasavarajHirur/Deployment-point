# Notes

## to add cookies, You need to set cors configurataion from backend
ex:
app.use(cors(
    {
        origin:"http://localhost:4200",
        credentials: true
    }
));

## and at front end side you need to add options
ex:
 login(loginDetails: any): Observable<any> {
    return this.http.post('http://localhost:3000/login', loginDetails, { withCredentials: true });
  }

## Git
When you deleted files from git how to restore
1.rm .git/index.lock
2.git status
3.git restore .

# [I] Deployement
1. create aws ec2 instance 
2. select any operating system
3. genereate key pair 
4. connect to ec2 instance using ssh
5. open terminal and go to path where key pair file is located
6. run command chmod 400 your-key.pem (for changin permission)
6. run command ssh -i "keypairfile.pem" ec2-user@ec2-xx- ( which is provided in ec2 ssh) (connecting machine)
7. Instal, curl : 
   sudo yum update -y
   sudo yum install curl -y
8. install node using curl command (check official nodejs)
9. install nvm (version should be same as your project) ex: nvm install 16.7.0
10. If NVM not found showing on screen close terminal using command 'exit' and reconnect
11. If nvm not found again you need set configuration for new instances by following commands
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Loads nvm
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # Optional bash autocomplete
   source ~/.bashrc
12. clone your git to remote system
13. If git not installed on ec2 machine use command - sudo yum install git -y 

  ## [i] deploy front end
    ### [a] Using git bash
    1. go to frond end project directory and install npm packages
    2. build project using command :npm run build
    3. if you want to see files type ls
    4. to update version : sudo apt update(for ubantu), sudo yum update -y(for linux)
    5. install nginx using command: sudo apt install nginx(ubantu), sudo dnf install nginx -y(linux)
    6. start nginx using command: sudo systemctl start nginx
    7. enable nginx using command: sudo systemctl enable nginx
    8. check path of /var/www/html but default location is - /usr/share/nginx/html/
    9. If /var/www/html is not exist create it using commad only if you want this specific location or else continue with default location - sudo mkdir -p /var/www/html
    10. copy code from dist folder to /var/www/html using command
     sudo scp -r dist/* var/www/html (copy command)
    11. If folder is copied to html instead of file then you can use this command to move files
      sudo mv folder-name/* ./  (you should be on path where you are copying)
    12. enable port :80 of our instance by adding inbound rules
     ex: type custom tcp port is 80
    13. if nginx already started simply use this to deploy 
     *npm run build
     *sudo scp -r dist/* (var/www/html or /usr/share/nginx/html/) (sudo scp -r source distination)
    14. If you want copy file from another location
     sudo cp -r /source path/* /destination path/ (for moving files to /usr/share/nginx/html/)
    15. or you can change the default location to your choice using command
       sudo rm /path (rm path) - to remove file
       sudo cp /source /destination/ - copy
    16. restart nginx
      sudo systemctl restart nginx
    17. If you want remove all files from the path use below command ex path is: /usr/share/nginx/html/
        sudo rm -rf /usr/share/nginx/html/*


      additional commands
      rm - to remove
      cp - copies within same machine
      scp - socure copied between two diff machines ex: local to nginx server

      main commands if already setup
      1. git pull
      2. npm run build
      3. sudo scp -r dist/folder/* /usr/share/nginx/html/
      4. sudo systemctl restart nginx

      [or]

      ### [b] Using Winscp and putty
      1. download winscp and putty from official website
      2. If you have .pem file convert it to .ppk file using puttygen 
      3. you need to open your putty gen from program files under putty file path, 
      4. After you open putty gen, There is load option there you need convert your pem to ppk
      5. once ppk downloaded upload file in both putty as well winscp
      6. in putty -> connection-sssh-auth-crential 
      7. in winscp -> Advanced” → SSH → Authentication
      8. Connect you winscp using <your ip>
      9. connect putty with ec2-user@<your ip>
      10. you can copy your file from local to ec2 using winscp or you can use command
      11. once you moved your file run below commands
          sudo cp -r /home/ec2-user/<filename>/* /usr/share/nginx/html/
          sudo chown -R nginx:nginx /usr/share/nginx/html  //to set permission
          sudo chmod -R 755 /usr/share/nginx/html   //to set permission
          sudo systemctl restart nginx

  ## [ii] deploy back end
  1. go to backend project directory and install npm packages
  2. start server using command: npm run start (this is for temporary)
  3. If port is already in use. Then run command and kill port
     sudo lsof -i :<port number>
     output will be like this :
     COMMAND   PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
     node    32277 ec2-user   28u  IPv6  58607      0t0  TCP *:cbt (LISTEN)
     then kill port using below command
     sudo kill -9 32277
  4. add network access in mongodb : add ip of ec2
  5. add inbound rules for port 3000 in ec2 security group
  6. install the pm2 : npm install pm2 -g (to stay always start server)
  7. start server using command : pm2 start npm -- start or pm2 start npm --name "Name" -- start
  8. check log using : pm2 log, to plush : pm2 flush name
  9. check pm2 details using : pm2 list
  10. to stop server using command : pm2 stop name
  11. to delete server using command : pm2 delete name
  12. to change server name using command : pm2 rename name newname
     or if you want to give initially instead of default : pm2 start npm --name newname -- start
  13. Remember after every package install you need to run npm install in server

  ## [iii] Connect backend and front end
  1. nginx proxy pass api to 3000 (search it on chatgpt for config)
  2. Check if there is other config files using -  
    sudo find /etc/nginx -type f 
  3. If nothing is in sites-available, then edit the main config file:
    sudo nano /etc/nginx/nginx.conf
    If there is sites-available then use below
    sudo nano /etc/nginx/sites-available/default
  4. edit server name instead of _ change ip of ec2(or if you have domain name change it to it)
  5. below of server name add location /api which is copied from chatgpt
  Ex:  
    server_name yourdomain.com;
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    special case whe you refresh page if page not found then it will show 404 error use below to reload on index.html
    
    location / {
        try_files $uri $uri/ /index.html;
    }
  6. save it
  7. restart nginx using command : sudo systemctl restart nginx
  8. modify front end BASE_URL to configured nginx ex: '/api'

  ## [iv] domain change
  1. go to godaddy(I preferred) website and purchase your domain.
  2. You can also do DNS thorugh godaddy or you can use cloudflare website
  3. verify and secure your domain on cloudflare
  4. add you purchased domain on cloudflare and scan for DNS records
  5. go to free plan
  6. continue to activation
  7. copy name servers from cloudflare
  8. Go to DNS name servers section of goDaddy and change name servers and add copied cloudflare name servers
  9. Go to cloudflare check name servers now once it is available(it will take some minutes)
  10. Go to cloudflare and go to DNS Records and delete A records or edit A record and add you domain pointing to your ip
  11. Add SSL and in custom select flexible
  12. check edge certificate , there is option automatic https. Enable it
  13. For better maintainance you can make your ec2 ip to elastic and replace static ip with wherever you used old one

  ## [v] dot env Backend
  1. Place you all secret related information inside .env
  2. you need to install dotenv package using npm install dotenv
  3. For production you need create .env file in your root project manually using
     nano /home/ec2-user/devTinderBackEnd/.env
  4. And add all your data here



# [II] Sending an Email through SES
1. create IAM user and attach rule(you can give full access)
2. Go to aws SES
3. create a identity from SES by providing domain name and email as well
4. open cloudflare and add DNS to to your domain
5. make sure trun off proxy to your added DNS, DNS name and value should copy from AWS SES
6. It may take some time to verify your domain
7. Go to AWS SES get set up page and click on request from production
8. provide details and submit
9. got to IAM User and create access key select other
10. copy access key and secret key, create .env file add these details
11. search on the google for AWS SES nodejs documentation
12. Go for latest one(for now v3) and get code example for sending an email or you can get it from git hub repo (https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ses#code-examples)
13. Here you need to install some dependencied in your backend code
14. In code there are some imports you need create folder for sesClient and add sesClient code from git hub, sendemail file add sendEmail code from git hub
15. Alter the code like new credential should be add refer sesClient.js
16. install @aws-sdk/client-ses and change code formate like instead of import -> require and so on
17. you can run your function and verify

# [III] Scheduling cron jon in nodeJs
1. install node-cron package
2. create a file in your backend folder and name it as cron.js
3. learn about expression in 'cron guru'
4. Schedule job
5. Install data-fns package optional to set timezone

  # [i] For bulk email 
  1. Follow batch mechanism
  2. que mechanism using ams SES or bee-queue npm package

# [IV] Payment gateway ft RazorPay
1. Create a account in Razor pay the famous gate way in india
2. complete KYC it will take 3-4 days
3. You need to create two apis in nodejs
    i. one is for creating order
    ii. one is for payment signature for webhook
    ii. one is for payment verification
4. after creating order done, you need to set up payment signature
5. In Razor pay you need provide webhook details, on successfull or failure payment which api (It should be live url) for our case 'Base Url + /payment/webhook'
6. Follow next step payment signature by creating new api with same path which you provided in webhook i,e '/payment/webhook'

  ## [i] Back End Code Changes (You need to add paralell front end changes)
  1. For creating order refer razorpay documentation for nodejs (https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/) or Git hub repo https://github.com/razorpay/razorpay-node
  2. install razor pay package using - npm i razorpay
  3. create a instance by razaro pay docs steps
  4. Key_id and key_secret you will get it from razorPay dashboard
  5. Create a order using razorpay sample code
  6. Once order api done , you need to create payment signature api
  7. For validate you can find it in documentation - https://razorpay.com/docs/webhooks/validate-test/
  8. As mentioned create new api for payment signature it should be same path as provided in webhook details in razor pay
  9. Create a api for premium verification to update UI

  ## [ii] Front End Code Changes
  1. Once you done with order api creation follow next step i,e open Razor dailog using sample code in  razor paydocs in Front end side
  2. You need to add script details in main index.html in Front end as provided in docs
  3. When you are using script in mail html, The RazorPay instance attached to window so just use window.razorpay to open dailog.
  4. You need send all neccessary response from backend
  5. after hiting premium verification api you need to update UI based on premium condition


# [V] Web sockets and sockets.io
1. socket.io is the library - it has low-latency, bidirectional and event based

  ## [i] Back End
  1. install socket.io using npm i socket.io
  2. follow sample code in socket.io docs for server
  3. you need have http to create server
  4. in normal way you would connect your backend server using app.listen() but when you are using socket.io you need to use server.listen() sample code in backend repo
  5. create socket configuration at backend, where your normally adding joinChat, recievingMessage, disconnect
  6. Secure Websocket connection by providing auth
  7. Once you done you need to create separate api to show all messages
  8. Before that you need to store all messages so create mongoDb Schema
  9. When you are sending message allow only who are already frnds
  10. Show last seen logic by storing establish connection
  11. Limit message loading when fetching from Db - add pagination 
  12. Remeber you need to add nginx configuration for prod
    location /api/socket.io/ {
    proxy_pass http://localhost:3000/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

  ## [ii] Front End
  1. create chat component for chat, and use query param to get to which user your chatting 
  2. Follow front end sample in repo
  3. You need to use socket.io client to connect to server so install 'socket.io-client'
  4. for client side you can refer client api doc from socket.io website
  5. you need to setup socket configuration for front end side as well
  6. you need to establish connection on page load i,e joinChat or joinRoom
  7. You need to create socket event for sending message and receiving message
  6. Make sure the configuration of socket should be correct for production
  
