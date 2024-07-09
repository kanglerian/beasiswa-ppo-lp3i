import React, { useEffect, useState } from 'react'
import { checkTokenExpiration } from '../middleware/middleware';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faFilePdf, faSignOut, faUserCircle, faUsers, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import LogoTagline from '../assets/tagline-warna.png'
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });

  const logoutHandle = async () => {
    await axios.get('http://localhost:8000/api/beasiswa-ppo/logout')
    .then((response) => {
      console.log(response);
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
          navigate('/login');
        }
        setUser(response.data);
      })
      .catch((error) => {
        if (error.forbidden) {
          navigate('/login');
        }
      })
  }, []);

  return (
    <main className="flex flex-col items-center justify-between bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-lp3i-800 bg-blend-multiply h-screen py-5">
      <nav className='flex items-center gap-3 py-5'>
        <img src={LogoLP3IPutih} alt="" width={190} />
        <img src={LogoTagline} alt="" width={120} />
      </nav>
      <div className='flex flex-col items-center gap-8 max-w-3xl w-full mx-auto px-5'>
        <section className='flex flex-col items-center text-center gap-1'>
          <h1 className='text-white text-xl'>Halo, <span className='font-medium'>{user.name}</span>!</h1>
          <p className='text-gray-400'>Harap segera untuk melengkapi persyaratan penerimaan mahasiswa baru melalui jalur Beasiswa PPO.</p>
        </section>
        <section className='grid grid-cols-1 md:grid-cols-3 items-center gap-3'>
          <div className='flex flex-col items-center gap-2 bg-gray-50 hover:bg-lp3i-500 text-gray-800 hover:text-white shadow-md px-5 py-4 cursor-pointer transition-all rounded-2xl'>
            <FontAwesomeIcon icon={faUserCircle} size='lg' />
            <p className='space-x-2'>
              <span>Data Pribadi</span>
              <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
            </p>
          </div>
          <div className='flex flex-col items-center gap-2 bg-gray-50 hover:bg-lp3i-500 text-gray-800 hover:text-white shadow-md px-5 py-4 cursor-pointer transition-all rounded-2xl'>
            <FontAwesomeIcon icon={faUsers} size='lg' />
            <p className='space-x-2'>
              <span>Data Orangtua</span>
              <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
            </p>
          </div>
          <div className='flex flex-col items-center gap-2 bg-gray-50 hover:bg-lp3i-500 text-gray-800 hover:text-white shadow-md px-5 py-4 cursor-pointer transition-all rounded-2xl'>
          <FontAwesomeIcon icon={faFilePdf} size='lg' />
            <p className='space-x-2'>
              <span>Unggah Berkas</span>
              <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
            </p>
          </div>
        </section>
        <section>
          <button type="button" onClick={logoutHandle} class="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
            <span>Keluar</span>
            <FontAwesomeIcon icon={faSignOut} size='sm' />
          </button>
        </section>
      </div>
      <p className='text-xs text-lp3i-50'>Copyright © 2024 Politeknik LP3I Kampus Tasikmalaya</p>
    </main>
  )
}

export default Dashboard