This project is for scraping scraping doctors's data from a practo.

I used master-worker architecture along with k8s. dockerized both master and worker. Deployed worker to AWS EKS and master to firebase as serverless function.

Successfully scraped 6600 doctors in 2hrs.