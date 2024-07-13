import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { checkTokenExpiration } from '../../middleware/middleware'
import LogoLP3IPutih from '../../assets/logo-lp3i-putih.svg'
import LogoTagline from '../../assets/tagline-warna.png'

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandle = async (e) => {
    e.preventDefault();
    if (email !== '' && password !== '') {
      await axios.post('http://localhost:8000/api/beasiswappo/login', {
        email: email,
        password: password,
      })
        .then((response) => {
          localStorage.setItem('LP3IPPO:token', response.data.access_token)
          alert(response.data.message);
          navigate('/dashboard');
        })
        .catch((error) => {
          if (error.response.status == 401) {
            alert(error.response.data.message);
          }
        });
    } else {
      alert('Ada form yang belum diisi!');
    }
  }

  useEffect(() => {
    checkTokenExpiration()
      .then((response) => {
        if (!response.forbidden) {
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        if (!error.forbidden) {
          navigate('/login');
        }
      })
  }, []);

  return (
    <div className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 h-screen p-5 space-y-4'>
      <nav className='flex items-center gap-3 py-3'>
        <img src={LogoLP3IPutih} alt="" width={180} />
        <img src={LogoTagline} alt="" width={110} />
      </nav>
      <div className='max-w-lg w-full bg-white p-10 rounded-3xl shadow-xl space-y-6'>
        <form onSubmit={loginHandle} method='POST' className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Email
              </label>
              <div className='flex gap-2'>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="Tulis nama lengkap anda..." required />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Kata Sandi
              </label>
              <div className='flex gap-2'>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="Tulis nama lengkap anda..." required />
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <button type="submit" onClick={loginHandle} className="text-white bg-lp3i-200 hover:bg-lp3i-300  font-medium rounded-xl text-sm px-5 py-2.5 text-center inline-flex items-center gap-2">
              <span>Masuk</span>
              <FontAwesomeIcon icon={faRightToBracket} />
            </button>
            <Link to={`/`} className="text-gray-700 font-medium rounded-xl text-sm text-center">
              <span>Belum punya akun? </span>
              <span className='underline font-semibold'>Daftar disini</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login