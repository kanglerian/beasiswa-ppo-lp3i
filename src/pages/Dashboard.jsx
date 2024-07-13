import React, { useEffect, useState } from 'react'
import { checkTokenExpiration } from '../middleware/middleware';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCheck, faCheckCircle, faFilePdf, faSignOut, faUserCircle, faUsers, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import LogoTagline from '../assets/tagline-warna.png'
import axios from 'axios';
import ServerError from './errors/ServerError';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });

  const [errorPage, setErrorPage] = useState(false);

  const [applicantFinish, setApplicantFinish] = useState(false);
  const [familyFinish, setFamilyFinish] = useState(false);
  const [prodiFinish, setProdiFinish] = useState(false);
  const [userUploadFinish, setUserUploadFinish] = useState(false);

  const getInfo = async () => {
    const token = localStorage.getItem('LP3IPPO:token');
    await axios.get('http://localhost:8000/api/beasiswappo/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        const userupload = response.data.userupload;
        const applicant = response.data.applicant;
        const father = response.data.father;
        const mother = response.data.mother;
        let foto = userupload.find((file) => { return file.fileupload.namefile == "foto" });
        let aktaKelahiran = userupload.find((file) => { return file.fileupload.namefile == "akta-kelahiran" });
        let sertifikatPendukung = userupload.find((file) => { return file.fileupload.namefile == "sertifikat-pendukung" });
        let fotoRumah = userupload.find((file) => { return file.fileupload.namefile == "foto-rumah" });
        let buktiTarifDaya = userupload.find((file) => { return file.fileupload.namefile == "bukti-tarif-daya" });
        if (applicant.nik && applicant.name && applicant.gender !== null && applicant.place_of_birth && applicant.date_of_birth && applicant.religion && applicant.school_id && applicant.major && applicant.class && applicant.year && applicant.income_parent && applicant.social_media && applicant.address) {
          setApplicantFinish(true);
        }
        if (father.name && father.place_of_birth && father.date_of_birth && father.phone && father.education && father.job && father.address && mother.name && mother.place_of_birth && mother.date_of_birth && mother.phone && mother.education && mother.job && mother.address) {
          setFamilyFinish(true);
        }
        if (applicant.program && applicant.program_second) {
          setProdiFinish(true);
        }
        if (foto && aktaKelahiran && sertifikatPendukung && fotoRumah && buktiTarifDaya) {
          setUserUploadFinish(true);
        }
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

  const logoutHandle = async () => {
    const token = localStorage.getItem('LP3IPPO:token');
    await axios.get('http://localhost:8000/api/beasiswappo/logout', {
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
    errorPage ? (
      <ServerError />
    ) : (
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
                {
                  applicantFinish ? (
                    <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
                  ) : (
                    <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
                  )
                }
              </p>
            </Link>
            <Link to={`/orangtua`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
              <FontAwesomeIcon icon={faUsers} size='lg' />
              <p className='space-x-2'>
                <span className='text-sm'>Data Orangtua</span>
                {
                  familyFinish ? (
                    <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
                  ) : (
                    <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
                  )
                }
              </p>
            </Link>
            <Link to={`/programstudi`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
              <FontAwesomeIcon icon={faBook} size='lg' />
              <p className='space-x-2'>
                <span className='text-sm'>Program Studi</span>
                {
                  prodiFinish ? (
                    <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
                  ) : (
                    <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
                  )
                }
              </p>
            </Link>
            <Link to={`/berkas`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
              <FontAwesomeIcon icon={faFilePdf} size='lg' />
              <p className='space-x-2'>
                <span className='text-sm'>Unggah Berkas</span>
                {
                  userUploadFinish ? (
                    <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
                  ) : (
                    <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
                  )
                }
              </p>
            </Link>
          </section>
          <section className='flex items-center gap-4'>
            {
              applicantFinish && familyFinish && prodiFinish && userUploadFinish ? (
                <a href='https://wa.me?phone=6285183098993&text=confirmregistration' target='_blank' className="text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
                  <span className='text-sm'>Konfirmasi Pendaftaran</span>
                  <FontAwesomeIcon icon={faCheckCircle} size='sm' />
                </a>
              ) : (
                <button type="button" className="text-white bg-red-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2" disabled>
                  <span className='text-sm'>Konfirmasi Belum Tersedia</span>
                  <FontAwesomeIcon icon={faXmarkCircle} size='sm' />
                </button>
              )
            }
            <button type="button" onClick={logoutHandle} className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
              <span className='text-sm'>Keluar</span>
              <FontAwesomeIcon icon={faSignOut} size='sm' />
            </button>
          </section>
        </div>
        <p className='text-xs text-lp3i-50'>Copyright © 2024 Politeknik LP3I Kampus Tasikmalaya</p>
      </main>
    )
  )
}

export default Dashboard