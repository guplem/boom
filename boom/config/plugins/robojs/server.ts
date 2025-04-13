export default {
	cors: true,
	host: '0.0.0.0', // listen on all network interfaces rather than just localhost
	port: parseInt(process.env.PORT || '8080', 10) // listen on port 8080 or the port specified in the environment variable PORT
}
