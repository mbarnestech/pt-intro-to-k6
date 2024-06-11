import http from 'k6/http';
import { check } from 'k6';

export default function () {
    // register a new user
    const body = JSON.stringify({
        "username": "test" + Date.now(),
        "password": "test"
    })

    const params = {
        headers: {
            "Content-Type": "application/json"
        }   
    }
    http.post('https://test-api.k6.io/user/register/', body, params)

    // login and get authorization token
    let res = http.post('https://test-api.k6.io/auth/token/login/', body, params)
    let authorization = "Bearer " + res.json().access

    // create new crocodile
    let name = "new" + Date.now()
    let newCroc = {
        "name": name,
        "sex": "F",
        "date_of_birth": "2024-06-05"
    }
    let newCroco = http.post('https://test-api.k6.io/my/crocodiles/', newCroc, {headers: {"Authorization": authorization}})
    // get new crocodile's id
    let newCrocodileId = newCroco.json().id

    // get information about crocodile using id
    let resp = http.get('https://test-api.k6.io/my/crocodiles/' + newCrocodileId + "/", {headers: {"Authorization": authorization}})
    
    // check that we got the correct crocodile
    check(resp, {
        'resp status is 200': (r) => r.status === 200,
        'crocodile name': (r) => r.json().name === name,
        'crocodile id': (r) => r.json().id === newCrocodileId,
    })
}
