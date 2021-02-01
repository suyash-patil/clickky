import React,{useState, useEffect} from 'react';
import './App.css';
import Posts from './Posts';
import {db, auth} from "../src/firebase"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from '../src/ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left+7}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [opensignin, setsignin] = useState(false); 
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [user,setUser] = useState(null);


  useEffect(() => {
  const unsubscribe=auth.onAuthStateChanged((authUser)=> {
    if(authUser) {
      //user has logged in...
      setUser(authUser);
      
    } else {
      //user has logged out...
      setUser(null);
    }
  })
  return () => {
    unsubscribe();
  }
  }, []);

  useEffect(()=> {
    db.collection("posts")
    .orderBy("timestamp","desc")
    .onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
        })));
    })
  }, [user,username]);

  const SignUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=> {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error)=>alert(error.message));
    setOpen(false);
  }
  const signin = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message));
    setsignin(false);
  }
  return (
    <div className="App">
    
    <div class="navbar">
    <Modal
      open={open}
      onClose={()=> setOpen(false)}
    >
    
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
      <center>
        <h2 className="app__header__name">Clickky</h2>
      </center>
        <Input 
          type="text"
          required="true"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e)=> setUsername(e.target.value)}
        />
        <Input 
          name="email"
          type="email"
          required="true"
          placeholder="Email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
        />
        <Input 
          name="password"
          type="password"
          required="true"
          placeholder="Password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
        />
      <Button style={{color: '#e23e57'}} type="submit" onClick={SignUp}>Sign Up</Button>
      </form>
    </div>
    </Modal>
    <Modal
      open={opensignin}
      onClose={()=> setsignin(false)}
    >
    
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
      <center>
        <h2 className="app__header__name">Clickky</h2>
      </center>
        <Input 
          name="email"
          type="email"
          required="true"
          placeholder="Email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
        />
        <Input 
          name="password"
          type="password"
          required="true"
          placeholder="Password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
        />
      <Button style={{color: '#e23e57'}} type="submit" onClick={signin}>Sign In</Button>
      </form>
    </div>
    </Modal>
      <div className="app__header">
        <h2 className="app__header__name">Clickky</h2>
        {user ? (
        <div className="app__logincontainer">
        {user?.displayName ? (
        <Button><ImageUpload username={user.displayName}/></Button>
      ) : (
        <h3>You need to be Logged in to upload</h3>
      )
      }
        <Button style={{color: '#e23e57'}} onClick={()=> auth.signOut()}>
          LOG OUT
      </Button>
</div>
      ) : (
        <div className="app__logincontainer">
        <Button style={{color: '#e23e57'}} className="app__login__button" onClick={()=> setsignin(true)}>
          SIGN IN
        </Button>
        <Button style={{color: '#e23e57'}} className="app__login__button"  onClick={()=> setOpen(true)}>
          SIGN UP
        </Button>
        </div>
      
)
      }
      </div>
    </div>
    <div className="content"> 
      <div className="app__posts">
      {
        posts.map(({id,post}) => (
            <Posts key={id} postId={id} commentuser={user} username={post.username} imageUrl={post.imageUrl} caption={post.caption}/>
        ))
      }
      </div>
      
    </div>
    </div>
  );
}

export default App;
