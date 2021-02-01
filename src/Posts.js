import React from 'react'
import './Posts.css';
import Avatar from "@material-ui/core/Avatar";
import {useState, useEffect} from 'react';
import firebase from 'firebase';
import {db} from '../src/firebase';
import { Button, Input } from '@material-ui/core';

function Posts({username, commentuser, postId, caption, imageUrl}) {
    const [comments,setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db.collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','asc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: commentuser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }
    
    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt={username} src="/static/images/avatar/2.jpg"/>
                <h3 className="post__username">{username}</h3>
            </div>
            
        
            <img className="post__image" src={imageUrl} alt=""></img>
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <div style={{paddingLeft: '6px',paddingBottom:'2px',marginTop: '2px'}}>Comments</div>
            <div >
            {
                comments.map((com) => (
                    <p style={{margin:0,color: '#522546', padding: '2px'}}>
                        <strong>{com.username}</strong> {com.text}
                    </p>
                ))
            }
            {commentuser && (
                <form style={{marginBottom: '0.4rem'}} className="post__commentbox">
                <Input className="post__input" type="text" placeholder="Add a comment..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                 />
                <Button style={{color: '#e23e57'}} className="post__button" type="submit" disabled={!comment} onClick={postComment}>
                 POST
                </Button>
            </form>
            )}
            
            </div>
        </div>
    )
}

export default Posts;
