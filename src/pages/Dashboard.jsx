import React, { useEffect, useState } from 'react'
import { checkTokenExpiration } from '../middleware/middleware';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCheckCircle, faFilePdf, faSignOut, faUserCircle, faUsers, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import LogoTagline from '../assets/tagline-warna.png'
import axios from 'axios';

const Dashboard = () => {
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
        if(error.response.status == 401){
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
    <main className="flex flex-col items-center justify-between bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 h-screen py-5">
      <nav className='flex items-center gap-3 py-3'>
        <img src={LogoLP3IPutih} alt="" width={180} />
        <img src={LogoTagline} alt="" width={110} />
      </nav>
      <div className='flex flex-col items-center gap-5 md:gap-8 max-w-3xl w-full mx-auto px-5'>
        <section className='flex flex-col items-center text-center gap-1'>
          <h1 className='text-white text-xl'>Halo, <span className='font-medium'>{user.name}</span>! 👋</h1>
          <p className='text-gray-200 text-sm'>Selamat datang <span className='underline'>{user.name}</span> dengan email <span className='underline'>{user.email}</span>. Lakukan registrasi mahasiswa baru dengan melengkapi isian dan langkah-langkah berikut.</p>
        </section>
        <section className='grid grid-cols-1 md:grid-cols-4 items-center gap-3'>
          <Link to={`/pribadi`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
            <FontAwesomeIcon icon={faUserCircle} size='lg' />
            <p className='space-x-2'>
              <span className='text-sm'>Data Pribadi</span>
              <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
            </p>
          </Link>
          <Link to={`/orangtua`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
            <FontAwesomeIcon icon={faUsers} size='lg' />
            <p className='space-x-2'>
              <span className='text-sm'>Data Orangtua</span>
              <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
            </p>
          </Link>
          <Link to={`/programstudi`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
            <FontAwesomeIcon icon={faBook} size='lg' />
            <p className='space-x-2'>
              <span className='text-sm'>Program Studi</span>
              <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
            </p>
          </Link>
          <div className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
            <FontAwesomeIcon icon={faFilePdf} size='lg' />
            <p className='space-x-2'>
              <span className='text-sm'>Unggah Berkas</span>
              <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
            </p>
          </div>
        </section>
        <section>
          <button type="button" onClick={logoutHandle} className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
            <span className='text-sm'>Keluar</span>
            <FontAwesomeIcon icon={faSignOut} size='sm' />
          </button>
        </section>
      </div>
      <p className='text-xs text-lp3i-50'>Copyright © 2024 Politeknik LP3I Kampus Tasikmalaya</p>
    </main>
  )
}

export default Dashboard