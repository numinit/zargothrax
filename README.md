# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

- Ruby version
  2.3+, (consider using rvm to "sandbox" a newer version if you don't want to
  install normally)
- System dependencies

  On Ubuntu, you will need at least the following:
  * postgresql-server-dev-all
  * postgresql-server

- Configuration

Set up `config/initializers/base_uri.rb` from the provided example.

- Database creation

  * Set up postgresql, and configure with user zx\_dev, password zx\_dev
  * Make sure that your pg\_hba.conf is configured to accept local connections
    by md5 (and NOT peer auth).
    
    (For instance, the Ubuntu distributed postgres config defaults to using
    peer auth for local connections. So, you would neet to change
    local  all  all  peer to
    local  all  all  md5
    to proceed.)

- Database initialization
  * Copy the example database, located at config/database.yml.example, 
    to config/database.yml.
  * run bundle ex rake:db-migrate

- How to run the test suite

- Services (job queues, cache servers, search engines, etc.)

- Deployment instructions
