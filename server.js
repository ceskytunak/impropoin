import express from 'express'
import crawls from './src/routes/crawlers.js'
import bodyParser from 'body-parser'
const app = express()
const port = 4000

// Add the bodyParser middelware to the express application
app.use(bodyParser.urlencoded({ extended: false }))

// Set up home route
app.get('/', (req, res) => {
	res.send('This is the homepage')
})

// Set up other routes
app.use('/crawler', crawls)

app.listen(port, () => {
	console.log(`Success! Your application is running on http://127.0.0.1:${port}`)
})