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
    peer auth for local connections. So, you would need to change
    `local all all peer` to `local all all md5` to proceed.)

- Database initialization
  * Copy the example database config, located at `config/database.yml.example`, 
    to `config/database.yml`.
  * run `bundle ex rake db:migrate`

