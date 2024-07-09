import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { checkTokenExpiration } from '../../middleware/middleware'

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandle = async () => {
    if (email !== '' && password !== '') {
      await axios.post('http://localhost:8000/api/auth/beasiswappo/login', {
        email: email,
        password: password,
      })
        .then((response) => {
          localStorage.setItem('LP3IPPO:token', response.data.access_token)
          alert(response.data.message);
          navigate('/dashboard');
        })
        .catch((error) => {
          console.log(error.response.data.message);
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
        console.log(response.message);
      })
      .catch((error) => {
        if (!error.forbidden) {
          navigate('/login');
        }
        console.log(error.message);
      })
  }, []);

  return (
    <div className='flex items-center justify-center bg-lp3i-300 h-screen'>
      <div className='max-w-lg w-full bg-white p-10 rounded-3xl shadow-xl space-y-6'>
        <form onSubmit={(e) => checkValidation(e, 'phone')} method='POST' className='space-y-4'>
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
        </form>
        <div className='flex items-center gap-3'>
          <button type="button" onClick={loginHandle} className="text-white bg-lp3i-200 hover:bg-lp3i-300  font-medium rounded-xl text-sm px-5 py-2.5 text-center inline-flex items-center gap-2">
            <span>Masuk pak Eko!</span>
            <FontAwesomeIcon icon={faRightToBracket} />
          </button>
          <Link to={`/`} className="text-gray-700 font-medium rounded-xl text-sm text-center">
            <span>Belum punya akun? </span>
            <span className='underline font-semibold'>Daftar disini</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login