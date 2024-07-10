import React, { useEffect, useState } from 'react'
import { checkTokenExpiration } from '../middleware/middleware';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircleDot, faSave } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'

const Prodi = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [applicant, setApplicant] = useState({});
  const [father, setFather] = useState({});
  const [mother, setMother] = useState({});
  const [files, setFiles] = useState([]);

  const getInfo = async () => {
    const token = localStorage.getItem('LP3IPPO:token');
    await axios.get('http://localhost:8000/api/auth/beasiswappo/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setApplicant(response.data.applicant);
        setFather(response.data.father);
        setMother(response.data.mother);
        setFiles(response.data.files);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem('LP3IPPO:token');
          navigate('/login')
        }
      })
  }

  const logoutHandle = async () => {
    const token = localStorage.getItem('LP3IPPO:token');
    await axios.get('http://localhost:8000/api/auth/beasiswappo/logout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        localStorage.removeItem('LP3IPPO:token');
        navigate('/login')
      })
      .catch((error) => {
        console.log(error);
      })
  }

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
    <main className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 md:h-screen py-10 p-5 md:py-5'>
      <section className='max-w-5xl w-full mx-auto shadow-xl'>
        <header className='grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl'>
          <Link to={'/dashboard'} className='text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2'>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Kembali</span>
          </Link>
          <h2 className='text-white text-center font-bold space-x-2'>
            <FontAwesomeIcon icon={faCircleDot} />
            <span>Data Program Studi</span>
          </h2>
          <div className='flex justify-center md:justify-end'>
            <img src={LogoLP3IPutih} alt="" width={150} />
          </div>
        </header>
        <div className='bg-white px-8 py-10 rounded-b-2xl'>
          <div className='space-y-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">Program Studi 1</label>
                <select id="gender" defaultValue={applicant.gender} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option disabled>Pilih</option>
                  <option value="1">Laki-laki</option>
                  <option value="0">Perempuan</option>
                </select>
              </div>
              <div>
                <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">Program Studi 2</label>
                <select id="gender" defaultValue={applicant.gender} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option disabled>Pilih</option>
                  <option value="1">Laki-laki</option>
                  <option value="0">Perempuan</option>
                </select>
              </div>
            </div>
            <button type="button" class="text-white bg-lp3i-200 hover:bg-lp3i-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
              <FontAwesomeIcon icon={faSave} />
              <span>Simpan perubahan</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Prodi