import React from 'react'
import { Link, useParams, useNavigate} from 'react-router-dom';
import {useState,useEffect} from 'react';
import {ReactComponent as ArrowLeft} from '../assets/arrow-left.svg';

const NotePage = () => {

  let{id} = useParams();
  let navigate = useNavigate();
  let [note,setNote] = useState(null)
  useEffect(()=>{
    getNote()
  },[id])
  let getNote = async () => {

    if (id == 'new') return

    let response = await fetch(`/api/notes/${id}`)
    let data = await response.json()
    setNote(data)
  }
//   let createNote = async () => {
//     fetch('/api/notes/create', {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(note)
//     })
// }

// let createNote = async () => {
//   fetch(`/api/notes/create`, {
//       method: "POST",
//       headers: {
//           'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(note)
      
//   });
// };
function getCSRFToken() {
  const name = 'csrftoken';
  const cookieValue = document.cookie.split(';').find(cookie => cookie.trim().startsWith(`${name}=`));
  if (cookieValue) {
      return cookieValue.split('=')[1];
  } else {
      return null;
  }
}

let createNote = async () => {
  try {
      let response = await fetch(`/api/notes/create`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCSRFToken(),
              'Origin': window.location.origin
          },
          body: JSON.stringify(note)
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      console.log(data);
  } catch (error) {
      console.error('Error:', error);
  }
};

  // let noteId = match.params.id
  let updateNote = async () => {
    await fetch(`/api/notes/${id}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
  };
  let handleChange = (value) => {
    setNote({
      ...note,
      body: value,
    });
  };

  // useEffect(() => {
  //   if (note) {
  //     updateNote();
  //   }
  // }, [note]);
//   let noteId = match.params.id;
  let handleSubmit = async () =>{
    if(id !== 'new' && note.body===''){
       await deleteNote()
    }else if(id !== 'new'){
       await updateNote()
    }else if(id === 'new' && note.body !== null){
       await createNote()
       console.log('We are reaching here');

    }
    
    navigate('/');

  };

  let deleteNote = async ()=> {
    fetch(`/api/notes/${id}/delete/`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
      }
    })
    navigate('/')
  }
  return (
    <div className='note'>
      <div className="note-header">
        <h3>
          
            <ArrowLeft onClick= {handleSubmit}/>
          
          
        </h3>
        {id !== 'new'? (
          <button onClick={deleteNote}>Delete</button>

        ):(
          <button onClick={handleSubmit}>Done</button>
        )}
        
      </div>
      <textarea onChange={(e) =>handleChange(e.target.value) } value={note?.body || ''}></textarea>
    </div>
  )
}

export default NotePage
