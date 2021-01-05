import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getSong, listSongs } from "../graphql/queries";
import { createSong,deleteSong,updateSong } from "../graphql/mutations";


// import {createBlog,createComment,createPost} from '../graphql/mutations';

export type Song = {
  id: string;
  title: string;
  description: string;
  filePath: string;
  like: number;
  owner: string;
};

function Songs(props: any) {
    const [toggleModal, setToggleModal] = useState(false);
    const [songs, setSongs] = useState([]);
  const [songForm, setSongsForm] = useState({
    title: "",
    description: "",
    filePath: "",
    like:0,
    owner:''
  });

  const [editSongForm, setEditSongsForm] = useState({
    id:'',
    title: "",
    description: "",
    filePath: "",
    like:0,
    owner:''
  });
  

  useEffect(() => {
    getSongs();
  }, []);



  const getSongs = async () => {
    try {
      const songData: any = await API.graphql(graphqlOperation(listSongs));
      const songsList = songData.data.listSongs.items;
      setSongs(songsList);
    } catch (error) {
      console.log(error);
    }
  };

  const setFormObj = (event: any) => {
    event.preventDefault();
    setSongsForm((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const editFormSong = (event: any) => {
    event.preventDefault();
    setEditSongsForm((prev:any) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const addNewSong = async (event:any) => {
    event.preventDefault();
    try {
      const form = songForm;
      await API.graphql(graphqlOperation(createSong, {input:form}));
      getSongs();
    } catch (error) {
      console.log(error);
    }
  };

  const removeSong = async (idToDelete:string) => {
   let id = {id: idToDelete}
    await API.graphql(graphqlOperation(deleteSong, {input:id}));
    getSongs();
  }

  const getOneSong = async (songId:string) => {
    setToggleModal(!toggleModal)
    console.log(toggleModal)
    const songData: any = await API.graphql(graphqlOperation(getSong,{id:songId}));
    const song = songData.data.getSong
    setEditSongsForm(prev=>{
       return(
        {
            ...prev,
            ...song
        }
       ) 
    })
  }

  const editSong = async (event:any) =>{
    event.preventDefault();
      try {
        const input = {
            id:editSongForm.id,
            title:editSongForm.title,
            description:editSongForm.description,
            filePath:editSongForm.filePath,
            like:editSongForm.like,
            owner:editSongForm.owner
        };
        await API.graphql(graphqlOperation(updateSong, {input}));
        getSongs();
      } catch (error) {
          console.log(error)
      }
  }

  return (
    <div className="container">
      <h2>Songs List</h2>
      <div className="addSong">
        <form onSubmit={addNewSong}> 
          <input
            type="text"
            name="title"
            placeholder="title"
            onChange={setFormObj}
          />
          <input
            onChange={setFormObj}
            type="text"
            name="description"
            placeholder="description"
          />
          <input
            onChange={setFormObj}
            type="text"
            name="filePath"
            placeholder="filePath"
          />
              <input
            onChange={setFormObj}
            type="text"
            name="owner"
            placeholder="owner"
          />
          <button>submit song</button>
        </form>
      </div>
      {songs.map((song:Song) => {
        return (
          <div className="songCard" key={song.id}>
            <h1>{song.title}</h1>
            <h3>{song.description}</h3>
            <img src={song.filePath} alt="" />
            <button onClick={()=>{removeSong(song.id)}}>remove song</button>
            <button onClick={()=> getOneSong(song.id)}>edit song</button>
          </div>
        );
      })}
      {
      toggleModal
      ?
      <div className="modal">
          <div className="modalContainer">
      <h1>change songs values</h1>
      <form onSubmit={editSong}> 
          <input
            type="text"
            name="title"
            placeholder="title"
            onChange={editFormSong}
            value={editSongForm.title}
          />
          <input
            onChange={editFormSong}
            type="text"
            name="description"
            placeholder="description"
            value={editSongForm.description}
          />
          <input
            onChange={editFormSong}
            type="text"
            name="filePath"
            placeholder="filePath"
            value={editSongForm.filePath}
          />
              <input
            onChange={editFormSong}
            type="text"
            name="owner"
            placeholder="owner"
            value={editSongForm.owner}
          />
          <button>edit song</button>
        </form>
          </div>
      </div>
        :
        null
      }
    </div>
  );
}

export default Songs;
