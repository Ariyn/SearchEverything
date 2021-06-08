const qs = require('qs');

const clientId = "e8f38403181949db990306732cf8e1ba";
const clientSecret = "6fb1bbc7ca944ca780bbe8faf9bb0b0a";
const code = "AQBd3RWooYGiGcNL8WVPsOzeXtholg8GjJltBDV_hK5S6pTfw1-PlqnrexG8HZK0SORePc9bJh_XQK60sHiXYWiYMHCt2rUV5sI0ojGEErZWFfJ9XROh2v-kHwlHRfZ2LT5Ddv2mcjaygd9XZVv6EvzMlXPq2Ee-YAFjAAxNI3TILa79L9QGj95itFmEKnT3H9iPsDphAac-8tSpxVrtaGpS4o1zThICG-uxvb7mYAieOKmf-ImYcR0RpmtNK6YAOK7CDWVvVTEvxZi8S59RZ0ti2UaXuDlPrPcAl_mOyOOrt325Gqjqt8Y8Jfzcofj3WFxtZ2LOr7Lv1o6DUf7E69tHXMVxtGFyZ4PUSSzI_MgsjevXm1st_e8DOQ"

let accessToken = ""
let refreshToken = "AQDb5sK6H0VuekO5fgLxszmjC4ECoQj7hlu9R2NPfiFjQ_-VWzYV5dHnZHyt-UKgA36uFMd4St1-ez1Bl71t_NGmhdIecRoFdbFv6o1_ie2GpADLiEF8zvm91QHVP0_Ebfg"


function Spotify() {
    let app = null;
    let instance = null;
    
    function newInstance(accessToken) {
            return axios.create({
            baseURL: 'https://api.spotify.com/v1/',
            timeout: 1000,
            headers: {
                'authorization': 'Bearer '+accessToken
            }
        });
    }

    function bind(_app) {
        app = _app
    }

    function searchBoxInput(value) {
        console.log(value)
        // spotify connect > spotify token
        // or just spotify refresh
        if(value == "connect") {
            console.log("https://accounts.spotify.com/authorize?client_id="+clientId+"&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&scope=user-read-private%20user-read-email%20user-library-read%20user-library-read%20playlist-modify-private%20playlist-read-private%20user-read-playback-state%20user-read-currently-playing&state=34fFs29kd09")
        } else if (value == "token") {
            axios.post("https://accounts.spotify.com/api/token", qs.stringify({
                "grant_type":"authorization_code",
                "code": code,
                "redirect_uri":"http://localhost/callback",
            }),{
                headers: {
                    "Authorization": "Basic "+ btoa(clientId+":"+clientSecret),   
                    "content-type": "application/x-www-form-urlencoded"
                }
            })
            .then(response => {
                console.log(response)
                accessToken = response.data.access_token;
                refreshToken = response.data.refresh_token;
                
                instance = newInstance(accessToken)
            })
            .catch(error => {
                console.log(error)
            })
        } else if (value == "refresh") {
            axios.post("https://accounts.spotify.com/api/token", qs.stringify({
                "grant_type":"refresh_token",
                "refresh_token":refreshToken,
            }),{
                headers: {
                    "Authorization": "Basic "+ btoa(clientId+":"+clientSecret),   
                    "content-type": "application/x-www-form-urlencoded"
                }
            })
            .then(response => {
                console.log(response)
                accessToken = response.data.access_token;
                if (response.data.refresh_token !== undefined) {
                    refreshToken = response.data.refresh_token;
                }

                instance = newInstance(accessToken)
            })
            .catch(error => {
                console.log(error)
            })
        } else if (value == "current") {
            instance.get("/me/player/currently-playing", {
                params: {
                    market:"KR"
                }
            })
            .then(function(response) {
                console.log(response.data)
                if (response.data != "") {
                    app.spotify.thumbnail = response.data.item.album.images[0].url
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }

    return {
        keyword:"spotify",
        bind,
        searchBoxInput,
        config: {},
        useKeyword: true,
        showSearchResult: function() {
            return true
        },
        showTextArea: function() {
            return false
        }
    }
}