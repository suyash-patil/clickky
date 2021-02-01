import { Button } from '@material-ui/core'
import React, {useState} from 'react'
import {db,storage} from '../src/firebase';
import firebase from 'firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import '../src/ImageUpload.css';
import { Input } from '@material-ui/core';

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
function ImageUpload({username}) {
    const classes = useStyles();
    const [caption,setCaption] = useState('');
    const [image,setImage] = useState(null);
    const [progress,setProgress] = useState(0);
    const [modalStyle] = React.useState(getModalStyle);
    const [openPost,setOpenPost] = useState(false);

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100
                );
                setProgress(progress);
                if((snapshot.bytesTransferred / snapshot.totalBytes) *100 === 100) {
                    setOpenPost(false);
                }
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }
        )
        
    }
    

    return (
    <div>
    <Modal
      open={openPost}
      onClose={()=> setOpenPost(false)}>

      <div style={modalStyle} className={classes.paper}>
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <Input type="text" placeholder="Enter Caption" onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" style={{color: '#e23e57'}} onChange={handleChange}/>
            <Button variant="outlined" style={{color: '#e23e57'}} onClick={handleUpload}> UPLOAD </Button>
        </div>
        
    </div>
    </Modal>
    <Button style={{color: '#e23e57'}} onClick={()=> setOpenPost(true)}> POST </Button>
    </div>
    )
}

export default ImageUpload;
