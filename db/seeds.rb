# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
p1 = Project.create(script_name: 'foo', timeout: 5000)
p2 = Project.create(script_name: 'bar', timeout: 5000)

[p1, p2].each do |proj|
  wu1 = proj.work_units.create(arguments: {foo: 'bar'}, consensus: nil)
  wu2 = proj.work_units.create(arguments: {baz: 'foo'}, consensus: nil)
  [wu1, wu2].each do |wu|
    unreturned = wu.work_requests.create
    returned1 = wu.work_requests.create(result: {foo: 'bar'})
    returned2 = wu.work_requests.create(result: {baz: 'foo'})
  end
end
