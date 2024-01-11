import {io} from "socket.io-client"
import {useEffect, useMemo, useState} from "react"
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  // const socket=io("http://localhost:4000")
  const socket=useMemo(()=>io("http://localhost:4000",{
    withCredentials:true
  }),[])
  const [message,setMessage]=useState("")
  const [room,setRoom]=useState("")
  const [socketid,setSocketId]=useState("")
  const [joinroom,setJoinRoom]=useState("")
  const [Allmessages,setAllmessages]=useState([])

  useEffect(() => {
    socket.on("connect",()=>{
      setSocketId(socket.id)
      console.log("connected",socket.id)
    })
    socket.on("receive-message",(message)=>{
      
      console.log("Message",message)
      setAllmessages((Allmessages)=>[...Allmessages,message])
    })
    
    socket.on("welcome",(s)=>{
      console.log(s)
    })
    return()=>{
      socket.disconnect()
    }
  
  }, [])

  const submitHandler=(e)=>{
    e.preventDefault()
    socket.emit("message",{message,room})
    setMessage("")
    setRoom("")
  }

  const joinRoomHandler=(e)=>{
    e.preventDefault()
    socket.emit("join-room",joinroom)
    setJoinRoom("")
  }
  

  return (
    <Container maxWidth="sm">
      
      <Box sx={{ height: 500 }} />

      <Typography variant="h6" component={"div"} gutterBottom>
      {socketid}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h6>Join Room</h6>
      <TextField
          value={joinroom}
          onChange={(e)=>setJoinRoom(e.target.value)}
          id="outlined-basic"
          label="Room name"
          variant="outlined"
          />
          <Button variant="contained" color="primary" type="submit">
            Join
          </Button>
      </form>

      <form onSubmit={submitHandler}>
          <TextField
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          />
          <TextField
          value={room}
          onChange={(e)=>setRoom(e.target.value)}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          />
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
      </form>

    <Stack>
      {
        Allmessages.map((m,i)=>(
          <Typography key={i} variant="h6" component={"div"} gutterBottom>
          {m}
          </Typography>
    
        ))
      }
    </Stack>

    </Container>
  )
}

export default App
