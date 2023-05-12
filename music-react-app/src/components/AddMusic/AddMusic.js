import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/AddMusic/controls/Controls";
import { useForm, Form } from '../../components/AddMusic/useForm';
import { ChangeEvent } from 'react';
import { TextField } from '@material-ui/core';
import { saveAs } from 'file-saver';
import axios from "axios";
import { LayoutContext } from "../Layout";
import { useContext } from 'react';
const initialFValues = {
    name: '',
    artistName: '',
    lyrics: '',
    bigThumbnail: '',
    thumbnail: '',
    path:''
}

export default function EmployeeForm(props) {
  const {
    user,
    setUser
  } = useContext(LayoutContext);
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        if ('artistName' in fieldValues)
            temp.artistName = fieldValues.artistName ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);
    
    const [fileMusic, setfileMusic] = useState();
    const [fileBigThumbnail, setfileBigThumbnail] = useState();
    const [fileThumbnail, setfileThumbnail] = useState();
    const [path, setPath] = useState('');
    const [pathThum,setPathThum] = useState('');
    const [pathBigThum,setPathBigThum] = useState('');
    const [name,setName] = useState('');
    const [artistName,setArtistName] = useState('');
    const handleFileChangeMusic = (e ) => {
        if(e.target.files)
        {
            setPath(e.target.files[0].name);
            setfileMusic(e.target.files[0]);
           
        }
    };
 
    const handleFileChangeBigThumbnail = (e ) => {
        if(e.target.files)
        {
            setfileBigThumbnail(e.target.files[0]);
            setPathBigThum(e.target.files[0].name);
        }
    };

    const handleFileChangeThumbnail = (e ) => {
        if(e.target.files)
        {
            setfileThumbnail(e.target.files[0]);
            setPathThum(e.target.files[0].name);
        }
    };
    
    const uploadFile =(name,artistName,fileMusic,fileThumbnail,fileBigThumbnail) =>{
        const formData = new FormData();
        formData.append('fileMusic', fileMusic);
        formData.append('fileThumbnail', fileBigThumbnail);
        formData.append('fileBigThumbnail', fileBigThumbnail);
        formData.append('name', name);
        formData.append('artistName', artistName);
        formData.append('author',user ? user.username : null) 
        axios.post("http://localhost:8082/uploadSong", formData)
            .then(res => {
                    console.log(res.data);
            })
    }
    const handleSubmit = () => {
       // saveAs('D:\\HocReact\\music-react-app\\public\\mp3',fileMusic);
        uploadFile(name,artistName,fileMusic,fileThumbnail,fileBigThumbnail);
    }
    return (
      <div
        style={{ width: "500px" }}
        class="login100-form validate-form"
      >
        <div className={"wrap-input100 validate-input"}>
          <input
            class="input100"
            type="text"
            name="name"
            placeholder="Tên bài hát"
            onInput={e => setName(e.target.value)}
          />
          <span class="focus-input100"></span>
          <span class="symbol-input100">
            <i class="fa fa-music" aria-hidden="true"></i>
          </span>
        </div>
        <div className={"wrap-input100 validate-input"}>
          <input
            class="input100"
            type="text"
            name="artistName"
            placeholder="Tên Nghệ sĩ"
            onInput={e => setArtistName(e.target.value)}
          />
          <span class="focus-input100"></span>
          <span class="symbol-input100">
            <i class="fa fa-music" aria-hidden="true"></i>
          </span>
        </div>

        {/* <div className={"wrap-input100 validate-input"}>
          <input
            class="input100"
            type="text"
            name="thumbnail"
            value={pathThum}
            placeholder="Thumbnail"
          />
          <span class="focus-input100"></span>
          <span class="symbol-input100">
            <i class="fa fa-music" aria-hidden="true"></i>
          </span>
        </div>
        <input type={"file"} onChange={handleFileChangeThumbnail} style = {{marginBottom: '10px'}}/>
        <div>
          {fileThumbnail && `${fileThumbnail.name} - ${fileThumbnail.type}`}
        </div> */}


        <div className={"wrap-input100 validate-input"}>
          <input
            class="input100"
            type="text"
            name="bigThumbnail"
            value={pathBigThum}
            placeholder="BigThumbnail"
          />
          <span class="focus-input100"></span>
          <span class="symbol-input100">
            <i class="fa fa-music" aria-hidden="true"></i>
          </span>
        </div>
        <input type={"file"} onChange={handleFileChangeBigThumbnail} style = {{marginBottom: '10px'}}/>
        {/* <div>
          {fileBigThumbnail &&
            `${fileBigThumbnail.name} - ${fileBigThumbnail.type}`}
        </div> */}

        <div className={"wrap-input100 validate-input"}>
          <input
            class="input100"
            type="text"
            name="path"
            value= {path}
            placeholder="đường dẫn"
          />
          <span class="focus-input100"></span>
          <span class="symbol-input100">
            <i class="fa fa-music" aria-hidden="true"></i>
          </span>
        </div>

        <input type={"file"} onChange={handleFileChangeMusic} style = {{marginBottom: '10px'}}/>
        <div class="container-login100-form-btn">
          <button  className="login100-form-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
}
