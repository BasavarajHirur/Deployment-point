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

# Deplooyement

1. create aws ec2 instance 
2. select any operating system
3. genereate key pair 
4. connect to ec2 instance using ssh
5. open terminal and go to path where key pair file is located
6. run command chmod 400 your-key.pem
6. run command ssh -i "keypairfile.pem" ec2-user@ec2-xx- ( which is provided in ec2 ssh)
7. install node using curl command
8. install nvm (version should be same as your project) ex: nvm install 16.7.0
9. clone your git to remote system

  ## deploy front end
  1. go to frond end project directory and install npm packages
  2. build project using command :npm run build
  3. if you want to see files type ls
  4. to update ubantu versio : sudo apt update
  5. install nginx using command: sudo apt install nginx
  6. start nginx using command: sudo systemctl start nginx
  7. enable nginx using command: sudo systemctl enable nginx
  8. copy code from dist folder to nginx http server(to/var/www/html)
     sudo scp -r dist/* var/www/html (copy command)
  9. enable port :80 of our instance by adding inbound rules
     ex: type is custom tcp port is 80

     if nginx already started simply use this to deploy 
     *npm run build
     *sudo scp -r dist/* var/www/html

  ## deploy back end
  1. go to backend project directory and install npm packages
  2. start server using command: npm run start (this is for temporary)
  3. add network access in mongodb : add ip of ec2
  4. add inbound rules for port 3000 in ec2 security group
  5. install the pm2 : npm install pm2 -g (to stay always start server)
  6. start server using command : pm2 start npm -- start
  7. check log using : pm2 log
  8. check pm2 details using : pm2 list
  9. to stop server using command : pm2 stop name
  10. to delete server using command : pm2 delete name
  11. to change server name using command : pm2 rename name newname
     or if you want to give initially instead of default : pm2 start npm --name newname -- start

  ## Connect backend and front end
  1. nginx proxy pass api to 3000 (search it on chatgpt for config)
    Ex:  
    server_name yourdomain.com;
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
  2. run command : sudo nano /etc/nginx/sites-available/default
  3. edit server name instead of _ change ip of ec2(or if you have domain name change it to it)
  4. below of server name add location /api which is copied from chatgpt
  5. save it
  6. restart nginx using command : sudo systemctl restart nginx
  7. modify front end BASE_URL

  ## domain change
  1. go to godaddy(I preferred) website and purchase your domain.
  2. You can also do DNS thorugh godaddy or you can use cloudflare website
  3. verify and secure your domain on cloudflare
  4. copy namserver from cloudflare and add it to godaddy.
  5. wait for somtime to our namserver get update on cloudflare (around 15-20 mnts)
  6. add DNS 'A' record to your ip address on cloudflare