exports.seed = async function (knex) {
  await knex('accounts').del()
  await knex('accounts').insert([
    { id: 1, name: `Anna's Account`, currency: 'USD' },
    { id: 2, name: `Hanna's Account`, currency: 'CAD' },
    { id: 3, name: `Peter's Account`, currency: 'GBP' },
  ])
  await knex('uploads').del()
  await knex('uploads').insert([
    { id: 1, name: 'Upload A' },
    { id: 2, name: 'Upload B' },
  ])
  await knex('categories').del()
  await knex('categories').insert([
    { id: 1, name: `Utilities`, color: '#0000FF' },
    { id: 2, name: `Groceries`, color: '#FF0000' },
  ])
  await knex('transactions').del()
  await knex('transactions').insert([
    {
      id: 1,
      description: 'Food',
      amount: 18.99,
      account_id: 1,
      upload_id: 1,
      date: new Date('2020-10-27').getTime(),
      row: '2020-10-27,Food,18.99',
    },
    {
      id: 2,
      description: 'Drink',
      amount: 6.5,
      account_id: 2,
      upload_id: 2,
      date: new Date('2020-01-01').getTime(),
      row: '2020-01-01,Drink,6.50',
    },
    {
      id: 3,
      description: 'Internet',
      amount: 22.0,
      account_id: 1,
      upload_id: 1,
      date: new Date('2020-05-01').getTime(),
      row: '2020-05-01,Internet,22.00',
    },
    {
      id: 4,
      description: 'Movie',
      amount: 9.0,
      account_id: 2,
      upload_id: 2,
      date: new Date('2020-07-01').getTime(),
      row: '2020-07-01,Movie,9.00',
    },
  ])
}
