export const createGame = (name) => {
  const params = {
    crossDomain: true,
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ name: name }),
  }
  console.log(params)
  fetch('http://localhost:3001/games/new', params)
    .then(res => res.json())
    .then(result => {

    }).catch(error => {
      console.log('ERROR: ', error)
    })
}