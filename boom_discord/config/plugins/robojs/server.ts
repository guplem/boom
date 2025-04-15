const host = process.env.HOST || '0.0.0.0'
const port = parseInt(process.env.PORT || '8080', 10)

console.log(`Server attempting to bind to ${host}:${port}`)

export default {
	cors: true,
	host,
	port
}
