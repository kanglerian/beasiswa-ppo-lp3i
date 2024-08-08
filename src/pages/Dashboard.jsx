import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCheckCircle, faFilePdf, faSignOut, faUserCircle, faUsers, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import LogoTagline from '../assets/tagline-warna.png'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'
import ServerError from './errors/ServerError';
import LoadingScreen from './LoadingScreen';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  const [errorPage, setErrorPage] = useState(false);

  const [validate, setValidate] = useState(false);
  const [validateData, setValidateData] = useState(false);
  const [validateFather, setValidateFather] = useState(false);
  const [validateMother, setValidateMother] = useState(false);
  const [validateProgram, setValidateProgram] = useState(false);
  const [validateFiles, setValidateFiles] = useState(false);

  const getInfo = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('LP3IPPO:token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const decoded = jwtDecode(token);
      setUser(decoded.data);

      const fetchProfile = async (token) => {
        const response = await axios.get('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/profiles/v1', {
          headers: { Authorization: token },
          withCredentials: true,
        });
        return response.data;
      };

      try {
        const profileData = await fetchProfile(token);
        setValidateData(profileData.validate.validate_data);
        setValidateFather(profileData.validate.validate_father);
        setValidateMother(profileData.validate.validate_mother);
        setValidateProgram(profileData.validate.validate_program);
        setValidateFiles(profileData.validate.validate_files);
        setValidate(profileData.validate.validate);
      } catch (profileError) {
        if (profileError.response && profileError.response.status === 403) {
          try {
            const response = await axios.get('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/token', {
              withCredentials: true,
            });

            const newToken = response.data;
            const decodedNewToken = jwtDecode(newToken);
            localStorage.setItem('LP3IPPO:token', newToken);
            setUser(decodedNewToken.data);

            const newProfileData = await fetchProfile(newToken);
            setValidateData(newProfileData.validate.validate_data);
            setValidateFather(newProfileData.validate.validate_father);
            setValidateMother(newProfileData.validate.validate_mother);
            setValidateProgram(newProfileData.validate.validate_program);
            setValidateFiles(newProfileData.validate.validate_files);
            setValidate(newProfileData.validate.validate);
          } catch (error) {
            console.error('Error refreshing token or fetching profile:', error);
            if (error.response && error.response.status === 400) {
              localStorage.removeItem('LP3IPPO:token');
            } else {
              setErrorPage(true);
            }
          }
        } else {
          console.error('Error fetching profile:', profileError);
          setErrorPage(true);
        }
      }
    } catch (error) {
      if (error.response) {
        if ([400, 403].includes(error.response.status)) {
          localStorage.removeItem('LP3IPPO:token');
          navigate('/login');
        } else {
          console.error('Unexpected HTTP error:', error);
        }
      } else if (error.request) {
        console.error('Network error:', error);
      } else {
        console.error('Error:', error);
        setErrorPage(true);
      }
      navigate('/login');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const logoutHandle = async () => {
    if (window.confirm('Apakah Anda yakin akan keluar?')) {
      const token = localStorage.getItem('LP3IPPO:token');

      if (!token) {
        console.log('Token tidak ditemukan saat logout');
        navigate('/login');
        return;
      }

      try {
        await axios.delete('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/logout', {
          headers: { Authorization: token },
          withCredentials: true,
        });

        localStorage.removeItem('LP3IPPO:token');
        navigate('/login');
      } catch (error) {
        const status = error.response?.status;

        if (status === 401 || status === 500) {
          localStorage.removeItem('LP3IPPO:token');
          navigate('/login');
        } else {
          console.error('Logout error:', error);
          setErrorPage(true);
        }
      }
    }
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main className="flex flex-col items-center justify-between bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 md:h-screen pt-5 pb-2">
          <nav className='flex items-center gap-3 py-3'>
            <img src={LogoLP3IPutih} alt="" width={180} />
            <img src={LogoTagline} alt="" width={115} />
          </nav>
          <div className='flex flex-col items-center justify-center gap-5 md:gap-8 max-w-3xl w-full mx-auto px-5 h-screen md:h-full'>
            <section className='flex flex-col items-center text-center gap-1'>
              <h1 className='text-white text-xl font-medium'>Halo, {user.name}! 👋</h1>
              <p className='text-gray-200 text-sm'>Selamat datang <span className='underline'>{user.name}</span> dengan email <span className='underline'>{user.email}</span>. Lakukan registrasi mahasiswa baru dengan melengkapi isian dan langkah-langkah berikut.</p>
            </section>
            <section className='w-full grid grid-cols-1 md:grid-cols-4 items-center gap-3'>
              <Link to={`/pribadi`} className='flex flex-col items-center gap-2 shadow-xl bg-gray-50 hover:bg-lp3i-400 text-gray-800 hover:text-white border-4 hover:border-lp3i-200 px-5 py-4 cursor-pointer transition-all rounded-2xl'>
                <FontAwesomeIcon icon={faUserCircle} size='lg' />
                <p className='space-x-2'>
                  <span className='text-sm'>Data Pribadi</span>
                  {
                    validateData ? (
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
                    validateFather && validateMother ? (
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
                    validateProgram ? (
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
                    validateFiles ? (
                      <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text-emerald-500' />
                    ) : (
                      <FontAwesomeIcon icon={faXmarkCircle} size='sm' className='text-red-500' />
                    )
                  }
                </p>
              </Link>
            </section>
            <section className='flex flex-col md:flex-row items-center gap-4'>
              {
                validate ? (
                  <a href='https://wa.me?phone=6282219509698&text=Kirim%20pesan%20perintah%20ini%20untuk%20konfirmasi%20pendaftaran%20:confirmregistration:' target='_blank' className="text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
                    <span className='text-sm'>Konfirmasi Pendaftaran</span>
                    <FontAwesomeIcon icon={faWhatsapp} size='sm' />
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
  )
}

export default Dashboard