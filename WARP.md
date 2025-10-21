# SunriseYouth MEVN stack app #

LOCAL:
- frontend (vue) is at /Users/nick/repos/webfly/nextgen/fe
- backend (node/express) is at /Users/nick/repos/webfly/nextgen/be
- be/.env has MONGODB_URL for the mongo db string, and PORT for what PORT the api runs on
- deploy.sh is meant to build locally then sync to prod


PRODUCTION:
Access production with this: `ssh -i /Users/nick/.ssh/id_rsa_hostinger root@5.183.8.134`
- frontend: /opt/webfly/nextgen/fe
- backend: /opt/webfly/nextgen/be, running on pm2 (named sun)