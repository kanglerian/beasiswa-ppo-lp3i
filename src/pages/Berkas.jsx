import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheckCircle, faCircleDot, faDownload, faTrash, } from '@fortawesome/free-solid-svg-icons'
import { checkTokenExpiration } from '../middleware/middleware'
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import ServerError from './errors/ServerError'
import LoadingScreen from './LoadingScreen';

const Berkas = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [loading, setLoading] = useState(false);

  const [errorPage, setErrorPage] = useState(false);
  const [fileupload, setFileupload] = useState([]);
  const [userupload, setUserupload] = useState([]);

  const getInfo = async () => {
    setLoading(true);
    const token = localStorage.getItem('LP3IPPO:token');
    await axios.get('https://database.politekniklp3i-tasikmalaya.ac.id/api/beasiswappo/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setUserupload(response.data.userupload);
        setFileupload(response.data.fileupload);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem('LP3IPPO:token');
          navigate('/login')
        }
        if (error.response.status == 500) {
          setErrorPage(true);
        }
      })
  }

  const handleFileChange = (e) => {
    e.preventDefault();
    setLoading(true);
    const targetFile = e.target.files[0];
    const targetId = e.target.dataset.id;
    const targetNamefile = e.target.dataset.namefile;
    if (targetFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        let data = {
          identity: user.identity,
          image: event.target.result.split(";base64,").pop(),
          namefile: targetNamefile,
          typefile: targetFile.name.split(".").pop(),
        };
        let status = {
          identity_user: user.identity,
          fileupload_id: targetId,
          typefile: targetFile.name.split(".").pop(),
        };
        const token = localStorage.getItem('LP3IPPO:token');
        await axios.post(`https://api.politekniklp3i-tasikmalaya.ac.id/pmbonline/upload`, data)
          .then(async (res) => {
            await axios.post(`https://database.politekniklp3i-tasikmalaya.ac.id/api/beasiswappo/userupload`, status, {
              headers: { Authorization: `Bearer ${token}` }
            }
            ).then((res) => {
              getInfo();
              alert("Berhasil diupload!");
              setLoading(false);
            })
              .catch((error) => {
                alert("Mohon maaf, ada kesalahan di sisi Server.");
                setLoading(false);
              });
          })
          .catch((error) => {
            alert("Mohon maaf, ada kesalahan di sisi Server.");
            setLoading(false);
          });
      };

      reader.readAsDataURL(targetFile);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    alert("upload!");
  };

  const handleDelete = async (user) => {
    if (confirm(`Apakah kamu yakin akan menghapus data?`)) {
      let data = {
        identity: user.identity_user,
        namefile: user.fileupload.namefile,
        typefile: user.typefile,
      };
      const token = localStorage.getItem('LP3IPPO:token');
      setLoading(true);
      await axios
        .delete(
          `https://api.politekniklp3i-tasikmalaya.ac.id/pmbonline/delete`,
          {
            params: data,
          }
        )
        .then(async (res) => {
          await axios
            .delete(
              `https://database.politekniklp3i-tasikmalaya.ac.id/api/beasiswappo/userupload/${user.id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
            )
            .then((res) => {
              getInfo();
              alert(res.data.message);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };


  useEffect(() => {
    checkTokenExpiration()
      .then((response) => {
        if (response.forbidden) {
          return navigate('/login');
        }
        setUser(response.data);
        getInfo();
      })
      .catch((error) => {
        if (error.forbidden) {
          return navigate('/login');
        }
      })
  }, []);
  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 py-10 px-5 h-screen'>
          <div className='max-w-5xl w-full mx-auto shadow-xl'>
            <header className='grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl'>
              <Link to={'/dashboard'} className='text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2'>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Kembali</span>
              </Link>
              <h2 className='text-white text-center font-bold space-x-2'>
                <FontAwesomeIcon icon={faCircleDot} />
                <span>Data Berkas</span>
              </h2>
              <div className='flex justify-center md:justify-end'>
                <img src={LogoLP3IPutih} alt="" width={150} />
              </div>
            </header>
            <div className='bg-white px-8 py-10 rounded-b-2xl'>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {userupload.length > 0 &&
                  userupload.map((user) => (
                    <div key={user.id}>
                      <label className="block mb-2 text-sm font-medium text-gray-900 space-x-1">
                        <span>{user.fileupload.name}</span>
                      </label>
                      <div className='flex items-center justify-between gap-2'>
                        <p className='w-full text-sm bg-gray-50 border border-gray-300 rounded-xl px-2 py-2.5 text-center space-x-2'>
                          <span className='font-medium'>Uploaded!</span>
                          <FontAwesomeIcon icon={faCheckCircle} className='text-emerald-500' />
                        </p>
                        <div className='flex items-center gap-1'>
                          <button type='button' onClick={() => handleDelete(user)} className='w-full block bg-red-500 hover:bg-red-600 text-sm px-5 py-2 rounded-xl'>
                            <FontAwesomeIcon icon={faTrash} className='text-white' />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 ml-1 text-xs text-gray-500">
                        <span className="font-medium">Keterangan file:</span>
                        {" "}
                        <span className="underline">{user.fileupload.accept}</span>
                      </p>
                    </div>
                  ))}
                {fileupload.length > 0 &&
                  fileupload.map((file) => (
                    <form key={file.id} onSubmit={handleUpload} encType="multipart/form-data">
                      <label className="block mb-2 text-sm font-medium text-gray-900">{file.name}</label>
                      <input className="block w-full text-xs text-gray-900 border border-gray-300 rounded-xl p-3 cursor-pointer bg-gray-50 focus:outline-none" type="file" accept={file.accept} data-id={file.id} data-namefile={file.namefile} name="berkas" onChange={handleFileChange} />
                      <p className="mt-2 ml-1 text-xs text-gray-500">
                        <span className="font-medium">Keterangan file:</span>
                        {" "}
                        <span className="underline">{file.accept}</span>
                      </p>
                    </form>
                  ))}
              </div>
            </div>
          </div>
        </main>
      )
    )
  )
}

export default Berkas