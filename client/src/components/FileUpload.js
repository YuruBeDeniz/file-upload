import { Fragment, useState } from 'react';
import axios from 'axios';
import Message from './Message';

const FileUpload = () => {
  const [file, setFile] = useState();
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');

  const onChange = e => {
    console.log(e);
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    //requestBody:
    const formData = new FormData();
    formData.append('imageFile', file);  

    try {
      const res = await axios.post('/upload ', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      });

      console.log("res: ", res)

      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath});
      setMessage('File Uploaded')

    } catch(err) {
        console.log(err)
        if (err.response.status === 500) {
            setMessage('There was a problem with the server');
          } else {
            setMessage(err.response.data.msg);
          }
    }
  }

  return (
    <Fragment>
        {message && <Message msg={message} />}
        <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>
        <input type='submit' value="Upload" className='btn btn-primary btn-block mt-4' />
        </form>
        {uploadedFile && (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default FileUpload