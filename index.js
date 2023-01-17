const express = require('express');

const app = express()
const port = 5000;

app.get('/', (req, res) => {
    res.send({status:'Server running...'})
})

app.listen(port, () => {
    console.log('PORT',port)
})