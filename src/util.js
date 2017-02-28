const appConfig = require('./config.json');

export const get = (url, options) => new Promise((accept, reject) => {
  console.info('get', url, options);
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function (evt) {
    if (this.readyState === 4) {
      if (this.status === 200) {
        accept(xhr.responseText)
      } else {
        console.error(xhr, evt)
        reject(`Error with request`)
      }
    }
  }
  xhr.open('GET', url)
  if (options && options.accessToken) {
    xhr.setRequestHeader('Authorization', `Bearer ${options.accessToken}`)
  }
  xhr.send()
})

export const post = (url, data) => new Promise((accept, reject) => {
  console.info('post', url, data);

  const body = Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('$')

  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function (evt) {
    if (this.readyState === 4) {
      if (this.status === 200) {
        accept(xhr.responseText)
      } else {
        console.error(xhr, evt)
        reject(`Error with request`)
      }
    }
  }
  xhr.open('POST', url)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(body)
})


var configPromise;
export const getConfig = () => configPromise ? configPromise : configPromise =
  get(appConfig.configUrl).then(JSON.parse)

export const getRedirectUri = () => window.location.origin + window.location.pathname

export const getLoginUrl = () => getConfig().then((config) =>
  `${config.authorization_endpoint}?client_id=${appConfig.clientId}&redirect_uri=${getRedirectUri()}&response_type=token&nonce=${Math.random()}`
)

export const getUserInfoUrl = () => getConfig().then((config) => config.userinfo_endpoint)

export const getTokenUrl = () => getConfig().then((config) => config.token_endpoint)

export const getUserInfo = (accessToken) => getUserInfoUrl().then((url) => get(url, {accessToken: accessToken})).then(JSON.parse)

export const getAccountUrl = () => getConfig().then((config) => `${config.issuer}/account?redirect_uri=${getRedirectUri()}`)

const unescapeUri = (str) =>
  decodeURIComponent(str.split('+').join(' '))

export const decodeQuery = (qstr) => {
  var query = {};
  if (qstr) {
    var a = (qstr[0] === '?' || qstr[0] == '#' ? qstr.substr(1) : qstr).split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[unescapeUri(b[0])] = unescapeUri(b[1] || '');
    }
  }
  return query;
}

export const getToken = (code) => getTokenUrl().then(tokenUrl =>
  post(tokenUrl, {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: getRedirectUri()
  })
)
