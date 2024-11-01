/* eslint-disable style/max-statements-per-line */

import $ from 'jquery'
import { compose, curry, map, prop } from 'ramda'

// -- Utils ----------------------------------------------------------
const Impure = {
  trace: curry((tag, x) => { console.log(tag, x); return x }),
  getJSON: curry((callback, url) => $.getJSON(url, callback)),
  setHtml: curry((sel, html) => $(sel).html(html)),
}

// -- Pure -----------------------------------------------------------
const host = 'api.flickr.com'
const path = '/services/feeds/photos_public.gne'
const query = t => `?tags=${t}&format=json&jsoncallback=?`
const url = t => `https://${host}${path}${query(t)}`

const img = src => $('<img />', { src }) // string => string

const mediaUrl = item => item.media.m // obj => string
const mediaToImg = compose(img, mediaUrl) // obj => string

const images = compose(map(mediaToImg), prop('items'))

// -- Impure ---------------------------------------------------------
const render = compose(Impure.setHtml('#js-main'), images)
const app = compose(Impure.getJSON(render), url)

app('cats')
