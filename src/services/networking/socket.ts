import io from 'socket.io-client'

const domain = "http://localhost:3000"
// const domain = "https://damp-springs-38226.herokuapp.com"
const socket = io(domain)
export default socket 