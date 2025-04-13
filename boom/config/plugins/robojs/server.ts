export default {
	cors: true,
	host: process.env.HOST || '0.0.0.0', // use HOST from env or fallback to all network interfaces
	port: parseInt(process.env.PORT || '8080', 10) // use PORT from env or fallback to 8080
}
