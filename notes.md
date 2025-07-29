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

# Deployement

1. create aws ec2 instance 
2. select any operating system
3. genereate key pair 
4. connect to ec2 instance using ssh
5. open terminal and go to path where key pair file is located
6. run command chmod 400 your-key.pem (for changin permission)
6. run command ssh -i "keypairfile.pem" ec2-user@ec2-xx- ( which is provided in ec2 ssh) (connecting machine)
7. install node using curl command (check official nodejs)
8. install nvm (version should be same as your project) ex: nvm install 16.7.0
9. If NVM not found showing on screen close terminal using command 'exit' and reconnect
10. clone your git to remote system
11. If git not installed on ec2 machine use command - sudo yum install git -y 

  ## deploy front end
  1. go to frond end project directory and install npm packages
  2. build project using command :npm run build
  3. if you want to see files type ls
  4. to update version : sudo apt update(for ubantu), sudo yum update -y(for linux)
  5. install nginx using command: sudo apt install nginx(ubantu), sudo dnf install nginx -y(linux)
  6. start nginx using command: sudo systemctl start nginx
  7. enable nginx using command: sudo systemctl enable nginx
  8. check path of /var/www/html but default location is - /usr/share/nginx/html/
  9. If /var/www/html is not exist create it using commad - sudo mkdir -p /var/www/html
  10. copy code from dist folder to /var/www/html using command
     sudo scp -r dist/* var/www/html (copy command)
  11. If folder is copied to html instead of file then you can use this command to move files
      sudo mv folder-name/* ./  (you should be on path where you are copying)
  12. enable port :80 of our instance by adding inbound rules
     ex: type custom tcp port is 80
  13. if nginx already started simply use this to deploy 
     *npm run build
     *sudo scp -r dist/* var/www/html (sudo scp -r source distination)
   14. If the location is different than var/www/html use below command to move files to that location
     sudo cp -r /var/www/html/* /usr/share/nginx/html/ (for moving files to /usr/share/nginx/html/)
   15. or you can change the default location to your choice using command
       sudo rm /usr/share/nginx/html/index.html (rm path) - to remove file
       sudo cp /var/www/html/index.html /usr/share/nginx/html/ - copy
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

  ## deploy back end
  1. go to backend project directory and install npm packages
  2. start server using command: npm run start (this is for temporary)
  3. If port is already in use. Then run command and kill port
     sudo lsof -i :7777
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

  ## Connect backend and front end
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

  ## domain change
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

  # Sending an Email through SES
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
  14. install @aws-sdk/client-ses and change code formate like instead of import -> require and so on
  15. you can run your function and verify
 